#!/usr/bin/env node
/**
 * Upload an image to Cloudinary, request responsive breakpoints, merge the
 * resulting widths into src/data/cloudinary-breakpoints.json, and print a
 * ready-to-paste <picture> HTML block. Astro passes raw HTML through
 * Markdown, so no plugin or imports are needed.
 *
 * Usage:
 *   npm run cloudinary:breakpoints -- src/assets/images/my-photo.jpg
 *   npm run cloudinary:breakpoints -- src/assets/images/my-photo.jpg --sizes="100vw"
 *
 * With no --devices / --sizes flag the script shows device checkboxes
 * (Desktop / Laptop / Tablet / Phone) and emits an art-direction `devices`
 * string (per-device crops + a derived `sizes`). Press Enter to include all,
 * or type a custom sizes string for simple responsive mode. --devices="..." or
 * --sizes="..." skips the prompt. In a non-interactive shell all devices are
 * used. These only affect the printed snippet, not the upload.
 *
 * The Cloudinary public ID is derived from the file path by dropping the
 * leading "src/" segment and the file extension, e.g.
 *   src/assets/images/my-photo.jpg -> assets/images/my-photo
 *
 * Credentials are read from .env via Node's --env-file-if-exists flag (see
 * package.json), or from the surrounding process environment. The build does
 * NOT need the API key/secret -- only this upload script does.
 */
import cloudinarySdk from "cloudinary";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import {
  parseDevices,
  normalizeBreakpoints,
  pictureHtml,
} from "../src/lib/cloudinary-picture.mjs";

const cloudinary = cloudinarySdk.v2;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BREAKPOINTS_FILE = resolve(ROOT, "src/data/cloudinary-breakpoints.json");

/**
 * Device-based art-direction presets. Each device has a viewport floor
 * (minWidth), the portion of the viewport the image occupies (vw -> sizes),
 * and a crop aspect ratio. minWidth 0 is the smallest device and becomes the
 * <img> fallback crop.
 */
const DEVICE_PRESETS = [
  { key: "desktop", label: "Desktop  >1200px", minWidth: 1200, vw: 40, aspectRatio: "original" },
  { key: "laptop", label: "Laptop   992-1199", minWidth: 992, vw: 60, aspectRatio: "16:9" },
  { key: "tablet", label: "Tablet   768-991", minWidth: 768, vw: 70, aspectRatio: "4:3" },
  { key: "phone", label: "Phone    <768", minWidth: 0, vw: 100, aspectRatio: "1:1" },
];

function parseArgs(argv) {
  let filePath = null;
  let sizesArg = null;
  let devicesArg = null;
  for (const arg of argv.slice(2)) {
    if (arg === "--") continue;
    if (arg.startsWith("--sizes=")) {
      sizesArg = arg.slice("--sizes=".length);
    } else if (arg.startsWith("--devices=")) {
      devicesArg = arg.slice("--devices=".length);
    } else if (!filePath && !arg.startsWith("--")) {
      filePath = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (sizesArg !== null && devicesArg !== null)
    throw new Error("Choose --sizes or --devices, not both.");
  if (sizesArg !== null && !sizesArg.trim()) throw new Error("--sizes cannot be empty.");
  if (devicesArg !== null && !devicesArg.trim()) throw new Error("--devices cannot be empty.");
  return { filePath, sizesArg, devicesArg };
}

/** `sizes` string from a device selection (largest viewport first). */
function buildSizes(selected) {
  const sorted = [...selected].sort((a, b) => a.minWidth - b.minWidth);
  const smallest = sorted[0];
  const rest = sorted.slice(1).sort((a, b) => b.minWidth - a.minWidth);
  const clauses = rest.map((d) => `(min-width: ${d.minWidth}px) ${d.vw}vw`);
  return [...clauses, `${smallest.vw}vw`].join(", ");
}

/** Compact `devices` string for the <Picture> prop: "minWidth|vw|aspectRatio,...". */
function buildDevicesString(selected) {
  return selected.map((d) => `${d.minWidth}|${d.vw}|${d.aspectRatio}`).join(",");
}

/** Parse a compact "minWidth|vw|aspectRatio,..." string into device specs. */
function parseDevicesString(input) {
  return parseDevices(input);
}

/**
 * Returns either { mode: "art", devices } (art direction) or
 * { mode: "sizes", sizes } (simple responsive). --devices / --sizes skip the
 * prompt; a non-numeric custom answer becomes a plain sizes string.
 */
async function chooseDevices(sizesArg, devicesArg) {
  if (devicesArg) {
    const parsed = parseDevicesString(devicesArg);
    if (parsed.length > 0) return { mode: "art", devices: parsed };
  }
  if (sizesArg) return { mode: "sizes", sizes: sizesArg };

  console.log("\nArt direction (check the device ranges to include):");
  DEVICE_PRESETS.forEach((d, i) => {
    console.log(`  [x] ${i + 1}) ${d.label}   ${d.aspectRatio}   ${d.vw}vw`);
  });

  if (!stdin.isTTY) return { mode: "art", devices: DEVICE_PRESETS };

  const rl = readline.createInterface({ input: stdin, output: stdout });
  let answer;
  try {
    answer = await rl.question(
      "Enter numbers to include, comma-separated (Enter = all, or type a custom sizes): ",
    );
  } finally {
    rl.close();
  }
  const trimmed = answer.trim();
  if (!trimmed) return { mode: "art", devices: DEVICE_PRESETS };

  const nums = trimmed
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (nums.length > 0 && nums.every((n) => /^\d+$/.test(n))) {
    const selected = [];
    for (const n of nums) {
      const idx = Number(n) - 1;
      if (idx >= 0 && idx < DEVICE_PRESETS.length) {
        const d = DEVICE_PRESETS[idx];
        if (!selected.includes(d)) selected.push(d);
      }
    }
    if (selected.length > 0) return { mode: "art", devices: selected };
  }
  // Not a number list -> treat as a custom sizes string (simple responsive).
  return { mode: "sizes", sizes: trimmed };
}

/** src/assets/images/my-photo.jpg -> assets/images/my-photo */
function derivePublicId(filePath) {
  const rel = relative(ROOT, resolve(ROOT, filePath)).replace(/\\/g, "/");
  if (rel.startsWith("../") || rel === "..") throw new Error("Image must be inside this project.");
  const withoutSrc = rel.startsWith("src/") ? rel.slice(4) : rel;
  const ext = extname(withoutSrc);
  return ext ? withoutSrc.slice(0, -ext.length) : withoutSrc;
}

async function readBreakpoints() {
  if (!existsSync(BREAKPOINTS_FILE)) return {};
  try {
    return JSON.parse(await readFile(BREAKPOINTS_FILE, "utf8"));
  } catch (err) {
    throw new Error(`Could not parse ${BREAKPOINTS_FILE}: ${err.message}`);
  }
}

async function writeBreakpoints(data) {
  await mkdir(dirname(BREAKPOINTS_FILE), { recursive: true });
  await writeFile(BREAKPOINTS_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function main() {
  const { filePath, sizesArg, devicesArg } = parseArgs(process.argv);
  if (!filePath) {
    console.error(
      'Usage: npm run cloudinary:breakpoints -- <path-to-image> [--devices="..."] [--sizes="..."]',
    );
    process.exit(1);
  }

  const cloudName = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error(
      "Missing Cloudinary credentials. Set PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.",
    );
    process.exit(1);
  }

  const absPath = resolve(ROOT, filePath);
  if (!existsSync(absPath)) {
    console.error(`Image not found: ${absPath}`);
    process.exit(1);
  }

  const publicId = derivePublicId(filePath);
  const choice = await chooseDevices(sizesArg, devicesArg);
  const data = await readBreakpoints();

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  console.log(`Uploading "${absPath}" as public_id "${publicId}"...`);

  const result = await cloudinary.uploader.upload(absPath, {
    public_id: publicId,
    unique_filename: false,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
    responsive_breakpoints: [
      {
        create_derived: false,
        // Calculate the shared widths against the WebP fallback rather than
        // against an uploaded JPEG or PNG original.
        format: "webp",
        min_width: 200,
        max_width: 2000,
        bytes_step: 20_000,
        max_images: 10,
      },
    ],
  });

  const widths = result.responsive_breakpoints?.[0]?.breakpoints?.map((bp) => bp.width) ?? [];

  if (widths.length === 0) {
    console.error("Cloudinary returned no breakpoints; the cache was not changed.");
    process.exit(1);
  }

  const sorted = normalizeBreakpoints(widths, result.width);
  data[publicId] = sorted;
  await writeBreakpoints(data);

  console.log(
    `Wrote ${sorted.length} breakpoints for "${publicId}" to ${relative(ROOT, BREAKPOINTS_FILE)}`,
  );
  console.log(sorted.join(", "));

  const snippet = pictureHtml(
    {
      src: publicId,
      alt: "TODO: describe this image",
      width: result.width,
      height: result.height,
      ...(choice.mode === "art"
        ? { devices: buildDevicesString(choice.devices) }
        : { sizes: choice.sizes }),
      breakpoints: sorted.join(", "),
      "picture-class": "responsive-picture",
    },
    cloudName,
  );
  if (choice.mode === "art") console.log(`sizes (derived): ${buildSizes(choice.devices)}`);
  console.log(
    "\nPaste this into your .md or .mdx post, with a blank line before and after, and replace the alt text. No imports needed:\n",
  );
  console.log(snippet);
  console.log("\nFor an article cover, keep cover.src and add this inside cover:\n");
  console.log(`  cloudinary:\n    src: ${JSON.stringify(publicId)}`);
  console.log(
    "Cover widths are read from src/data/cloudinary-breakpoints.json. Commit that file with the post.",
  );
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
