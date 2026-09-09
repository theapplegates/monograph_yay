import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, cp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { buildPicture, pictureSnippet } from "../src/lib/cloudinary-picture.mjs";
import rehypeCloudinaryPicture from "../src/plugins/rehype-cloudinary-picture.mjs";

const props = {
  src: "assets/images/photo",
  alt: 'A "blue" sky & clouds',
  width: 1600,
  height: 1000,
  sizes: "(min-width: 768px) 720px, 100vw",
  breakpoints: "200, 640, 960, 1600, 2000",
};

test("format order, responsive fallback, and width descriptors", () => {
  const model = buildPicture(props, "demo");
  assert.deepEqual(
    model.sources.map((s) => s.type),
    ["image/jxl", "image/avif", "image/webp"],
  );
  for (const source of model.sources) {
    assert.ok(source.srcset.includes(`f_${source.type.split("/")[1]}/`));
    assert.ok(source.srcset.endsWith("1600w"));
    assert.ok(!source.srcset.includes("2000w"));
    assert.equal(source.sizes, props.sizes);
  }
  assert.equal(model.img.srcset, model.sources[2].srcset);
  assert.equal(model.img.alt, props.alt);
});

test("art direction groups formats inside descending media queries and reserves crop dimensions", () => {
  const model = buildPicture(
    { ...props, devices: "0|100|1:1,1200|40|original,768|70|4:3" },
    "demo",
  );
  assert.equal(model.sources.length, 9);
  assert.deepEqual(
    model.sources.map((s) => s.media),
    [
      ...Array(3).fill("(min-width: 1200px)"),
      ...Array(3).fill("(min-width: 768px)"),
      ...Array(3).fill(undefined),
    ],
  );
  assert.match(model.sources[0].srcset, /c_limit/);
  assert.match(model.sources[3].srcset, /c_fill,g_auto,ar_4:3/);
  assert.match(model.img.src, /c_fill,g_auto,ar_1:1,w_1000/);
  assert.equal(model.img.width, model.img.height);
  assert.equal(model.sources[0].width / model.sources[0].height, 1.6);
});

function markdown(input) {
  return unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeCloudinaryPicture, { cloudName: "demo" })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(input);
}

test("upload command caches returned widths and prints no-import snippets in both modes", async () => {
  const root = await mkdtemp(join(tmpdir(), "monograph-upload-test-"));
  try {
    for (const dir of ["scripts", "src/lib", "src/assets/images", "node_modules/cloudinary"]) {
      await mkdir(join(root, dir), { recursive: true });
    }
    await cp(
      new URL("../scripts/cloudinary-breakpoints.mjs", import.meta.url),
      join(root, "scripts/cloudinary-breakpoints.mjs"),
    );
    await cp(
      new URL("../src/lib/cloudinary-picture.mjs", import.meta.url),
      join(root, "src/lib/cloudinary-picture.mjs"),
    );
    await writeFile(join(root, "src/assets/images/photo.jpg"), "test upload placeholder");
    // An isolated SDK double ensures no upload or private credentials are used.
    await writeFile(
      join(root, "node_modules/cloudinary/index.js"),
      `
      exports.v2 = { config() {}, uploader: { async upload(path, options) {
        require('node:fs').writeFileSync(require('node:path').join(process.cwd(), 'request.json'), JSON.stringify(options));
        return { width: 1600, height: 1000, responsive_breakpoints: [{ breakpoints: [{width: 200}, {width: 640}, {width: 1600}] }] };
      } } };
    `,
    );
    for (const flag of ["--sizes=100vw", "--devices=1200|40|original,0|100|1:1"]) {
      const { stdout } = await promisify(execFile)(
        process.execPath,
        [join(root, "scripts/cloudinary-breakpoints.mjs"), "src/assets/images/photo.jpg", flag],
        {
          cwd: root,
          env: {
            ...process.env,
            PUBLIC_CLOUDINARY_CLOUD_NAME: "demo",
            CLOUDINARY_API_KEY: "test",
            CLOUDINARY_API_SECRET: "test",
          },
        },
      );
      assert.ok(!stdout.includes("import Picture"));
      const snippet = stdout.match(/<cloudinary-picture\n[\s\S]*?<\/cloudinary-picture>/)?.[0];
      assert.ok(snippet, stdout);
      const html = String(await markdown(snippet));
      assert.equal((html.match(/<source\b/g) ?? []).length, flag.startsWith("--sizes") ? 3 : 6);
      const cache = JSON.parse(
        await readFile(join(root, "src/data/cloudinary-breakpoints.json"), "utf8"),
      );
      assert.deepEqual(cache["assets/images/photo"], [200, 640, 1600]);
      const request = JSON.parse(await readFile(join(root, "request.json"), "utf8"));
      assert.equal(request.public_id, "assets/images/photo");
      assert.equal(request.responsive_breakpoints[0].format, "webp");
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("printed snippets render in Markdown, preserve prose, and leave code examples alone", async () => {
  const snippet = pictureSnippet({ ...props, "picture-class": "responsive-picture" });
  const output = String(
    await markdown(`Before.\n\n${snippet}\n\nAfter.\n\n\`\`\`html\n${snippet}\n\`\`\``),
  );
  assert.equal((output.match(/<picture\b/g) ?? []).length, 1);
  assert.equal((output.match(/<source\b/g) ?? []).length, 3);
  assert.match(output, /<picture class="responsive-picture">/);
  assert.match(output, /<p>After\.<\/p>/);
  assert.ok(!output.includes("<cloudinary-picture"));
});

test("legacy self-closing Markdown snippets cannot swallow following prose", async () => {
  const snippet = pictureSnippet({ ...props, "picture-class": "responsive-picture" }).replace(
    ">\n</cloudinary-picture>",
    "/>",
  );
  assert.match(
    String(await markdown(`${snippet}\n\nAfter.`)),
    /<\/picture>(?:<\/p>)?\s*<p>After\.<\/p>/,
  );
});

test("MDX literal attributes are converted without imports", () => {
  const tree = {
    children: [
      {
        type: "mdxJsxFlowElement",
        name: "cloudinary-picture",
        attributes: Object.entries(props).map(([name, value]) => ({
          type: "mdxJsxAttribute",
          name,
          value: String(value),
        })),
        children: [],
      },
    ],
  };
  rehypeCloudinaryPicture({ cloudName: "demo" })(tree, {
    fail(message) {
      throw new Error(message);
    },
  });
  assert.equal(tree.children[0].tagName, "picture");
  assert.equal(tree.children[0].children.length, 4);
});

test("invalid metadata fails instead of emitting broken image URLs", () => {
  assert.throws(() => buildPicture(props, ""), /CLOUDINARY_CLOUD_NAME/);
  assert.throws(() => buildPicture({ ...props, alt: undefined }, "demo"), /alt/);
  assert.throws(() => buildPicture({ ...props, breakpoints: "0, nope" }, "demo"), /Breakpoints/);
  assert.throws(() => buildPicture({ ...props, devices: "0|100|1:0" }, "demo"), /aspectRatio/);
  assert.throws(() => buildPicture({ ...props, devices: "0|100|1:1,0|50|4:3" }, "demo"), /unique/);
  assert.throws(() => buildPicture({ ...props, sizes: undefined }, "demo"), /sizes or devices/);
});
