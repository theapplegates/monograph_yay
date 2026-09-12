/** Shared by the Astro component and the upload command. */
export const formats = ["jxl", "avif", "webp"];

export function parseDevices(input) {
  if (!input) return [];
  let list = input;
  if (typeof input === "string") {
    list = input.trim().startsWith("[")
      ? JSON.parse(input)
      : input.split(",").map((part) => {
          const [minWidth, vw, aspectRatio = "original"] = part.trim().split("|");
          return { minWidth, vw, aspectRatio };
        });
  }
  if (!Array.isArray(list) || !list.length)
    throw new Error("devices must contain at least one device.");
  const result = list
    .map((d) => {
      const device = {
        minWidth: Number(d.minWidth ?? d.min_width),
        vw: Number(d.vw),
        aspectRatio: String(d.aspectRatio ?? d.ratio ?? "original").replace(/\s/g, ""),
      };
      if (
        !Number.isFinite(device.minWidth) ||
        device.minWidth < 0 ||
        !Number.isFinite(device.vw) ||
        device.vw <= 0 ||
        device.vw > 100
      ) {
        throw new Error("Device minWidth must be nonnegative and vw must be between 0 and 100.");
      }
      if (device.aspectRatio !== "original") {
        const ratio = device.aspectRatio.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
        if (!ratio || Number(ratio[1]) <= 0 || Number(ratio[2]) <= 0) {
          throw new Error("Device aspectRatio must be original or a positive W:H ratio.");
        }
      }
      return device;
    })
    .sort((a, b) => b.minWidth - a.minWidth);
  if (new Set(result.map((d) => d.minWidth)).size !== result.length) {
    throw new Error("Device minWidth values must be unique.");
  }
  return result;
}

export function normalizeBreakpoints(input, maxWidth) {
  let list = input;
  if (typeof list === "string") {
    list = list.trim().startsWith("[") ? JSON.parse(list) : list.split(",").map(Number);
  }
  if (list && !Array.isArray(list)) list = list.breakpoints;
  if (!Array.isArray(list) || !list.length)
    throw new Error("Missing breakpoints: run npm run cloudinary:breakpoints first.");
  const widths = list.map((bp) => Number(typeof bp === "object" ? bp.width : bp));
  if (widths.some((w) => !Number.isInteger(w) || w <= 0))
    throw new Error("Breakpoints must be positive integer widths.");
  return [...new Set(widths.map((w) => Math.min(w, maxWidth)))].sort((a, b) => a - b);
}

export function buildPicture(props, cloudName) {
  if (!/^[a-zA-Z0-9_-]+$/.test(cloudName ?? "")) {
    throw new Error(
      "Set PUBLIC_CLOUDINARY_CLOUD_NAME (or CLOUDINARY_CLOUD_NAME) before using Cloudinary pictures.",
    );
  }
  const { src, alt } = props;
  if (
    typeof src !== "string" ||
    !src ||
    src.startsWith("/") ||
    src.includes("://") ||
    src.split("/").some((p) => !p || p === "." || p === "..")
  ) {
    throw new Error("Cloudinary src must be a public ID, for example assets/images/my-photo.");
  }
  if (typeof alt !== "string")
    throw new Error(`Missing alt text for ${src}. Use alt="" for a decorative image.`);
  const width = Number(props.width);
  const height = Number(props.height);
  if (![width, height].every((n) => Number.isInteger(n) && n > 0))
    throw new Error(`Positive integer width and height required for ${src}.`);
  const widths = normalizeBreakpoints(props.breakpoints, width);
  const devices = parseDevices(props.devices);
  if (!devices.length && (typeof props.sizes !== "string" || !props.sizes.trim())) {
    throw new Error(`Provide sizes or devices for ${src}.`);
  }
  const publicId = src.split("/").map(encodeURIComponent).join("/");
  const sizeFor = (d) => (d ? `${d.vw}vw` : props.sizes);
  const dimensionsFor = (d) => {
    const ratio =
      !d || d.aspectRatio === "original"
        ? width / height
        : d.aspectRatio
            .split(":")
            .map(Number)
            .reduce((a, b) => a / b);
    const cap = Math.max(1, Math.min(width, Math.floor(height * ratio)));
    const candidates = [...new Set(widths.map((w) => Math.min(w, cap)))];
    const largest = candidates.at(-1);
    return { widths: candidates, width: largest, height: Math.max(1, Math.round(largest / ratio)) };
  };
  const url = (format, w, d) => {
    const crop =
      !d || d.aspectRatio === "original" ? "c_limit" : `c_fill,g_auto,ar_${d.aspectRatio}`;
    return `https://res.cloudinary.com/${cloudName}/image/upload/${crop},w_${w},q_auto,f_${format}/${publicId}`;
  };
  const srcset = (format, d) =>
    dimensionsFor(d)
      .widths.map((w) => `${url(format, w, d)} ${w}w`)
      .join(", ");
  const smallest = devices.at(-1);
  const sources = (devices.length ? devices : [undefined]).flatMap((d) => {
    const dimensions = dimensionsFor(d);
    return formats.map((format) => ({
      type: `image/${format}`,
      ...(d && d !== smallest ? { media: `(min-width: ${d.minWidth}px)` } : {}),
      sizes: sizeFor(d),
      srcset: srcset(format, d),
      width: dimensions.width,
      height: dimensions.height,
    }));
  });
  const fallback = dimensionsFor(smallest);
  const attrs = {};
  for (const key of ["class", "id", "title", "loading", "decoding", "fetchpriority"]) {
    if (props[key] != null) attrs[key] = props[key];
  }
  return {
    pictureClass: props.pictureClass ?? props["picture-class"] ?? "responsive-picture",
    sources,
    img: {
      loading: "lazy",
      decoding: "async",
      ...attrs,
      src: url("webp", fallback.width, smallest),
      srcset: srcset("webp", smallest),
      sizes: sizeFor(smallest),
      alt,
      width: fallback.width,
      height: fallback.height,
    },
  };
}

export function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Render the full <picture> block for pasting directly into Markdown or MDX.
 * Astro passes raw HTML through, so no plugin or imports are needed.
 */
export function pictureHtml(props, cloudName) {
  const model = buildPicture(props, cloudName);
  const attrs = (obj) =>
    Object.entries(obj)
      .map(([key, value]) => `${key}="${escapeAttribute(value)}"`)
      .join(" ");
  return [
    `<picture class="${escapeAttribute(model.pictureClass)}">`,
    ...model.sources.map((source) => `  <source ${attrs(source)}>`),
    `  <img ${attrs(model.img)}>`,
    `</picture>`,
  ].join("\n");
}
