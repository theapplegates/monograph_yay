# Responsive Cloudinary images

Cloudinary pictures use JXL → AVIF → WebP sources and a responsive WebP `<img>` fallback.
The build emits ordinary HTML: no browser JavaScript or `f_auto`.

## Setup (once)

Run `npm install`. Copy `.env.example` to `.env` and fill in your public cloud name,
API key, and API secret. Keep `.env` private. On your build host, set only
`PUBLIC_CLOUDINARY_CLOUD_NAME`; the API key and secret are upload-only.
The older `CLOUDINARY_CLOUD_NAME` variable is also supported.

## Images inside Markdown or MDX posts

Run from the project directory, replacing the path with your image:

```sh
npm run cloudinary:breakpoints -- src/assets/images/my-photo.jpg --sizes="(min-width: 768px) 720px, 100vw"
```

This uploads the image, requests Cloudinary's WebP-based breakpoints, updates
`src/data/cloudinary-breakpoints.json`, and prints a ready-to-paste `<picture>`
HTML block (formatted approximately like this — use the actual command output):

```html
<picture class="responsive-picture">
  <source type="image/jxl" sizes="(min-width: 768px) 720px, 100vw" srcset="https://res.cloudinary.com/your-cloud/image/upload/c_limit,w_200,q_auto,f_jxl/assets/images/my-photo 200w, …" width="2000" height="1500">
  <source type="image/avif" srcset="…" sizes="…">
  <source type="image/webp" srcset="…" sizes="…">
  <img loading="lazy" decoding="async" src="…" srcset="…" sizes="…" alt="Describe the photo" width="2000" height="1500">
</picture>
```

Paste the **actual command output** into your `.md` or `.mdx` post, with a blank line
before and after it, and replace the alt text. No imports and no Markdown plugin are
needed: Astro passes raw HTML through unchanged. The example above is illustrative:
use your uploaded image's actual public ID, dimensions, and widths. Snippets carry
their widths directly; changing the cache alone does not change previously pasted
snippets.

## Art direction (different crops by device)

Omit `--sizes` to choose Desktop, Laptop, Tablet, and Phone interactively:

```sh
npm run cloudinary:breakpoints -- src/assets/images/my-photo.jpg
```

In a non-interactive terminal, all four presets are selected. To specify devices:

```sh
npm run cloudinary:breakpoints -- src/assets/images/my-photo.jpg --devices="1200|40|original,992|60|16:9,768|70|4:3,0|100|1:1"
```

Each entry is `minimum viewport width | viewport percentage | crop ratio`. Sources
are grouped by descending viewport width, then JXL, AVIF, WebP. The smallest selected
crop applies to all smaller screens. `original` uses `c_limit`; ratios use `c_fill,g_auto`.
Widths are capped to avoid upscaling. Sources include crop dimensions to reserve space.
Choose percentages that match your layout; the presets are editable.

## Article covers

Local covers work without credentials and generate AVIF and WebP. **They do not gain
JXL until you upload them and opt into Cloudinary.** For example:

```sh
npm run cloudinary:breakpoints -- src/content/posts/api-versioning-without-making-everyone-angry/cover.jpg --sizes="(min-width: 1280px) 1200px, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 3rem)"
```

Keep the existing `cover.src`, `alt`, and credits, and add `cloudinary` under `cover`:

```yaml
cover:
  src: "./cover.jpg"
  alt: "Your existing description"
  cloudinary:
    src: "content/posts/api-versioning-without-making-everyone-angry/cover"
```

The public ID comes from the command. Cover breakpoints come from the cache: commit
the updated cache with the post. You can override `breakpoints`, `sizes`, or `devices`
inside `cover.cloudinary`. Dimensions and social-sharing images still come from the
local original, which must match the uploaded image. Covers load eagerly and account
for Monograph's page gutters.

## Astro component

In `.astro` files, import `Picture` from `@/components/Picture.astro` and supply the
same props. MDX posts can use `<Picture ... />` without imports because the post template
supplies it in its component map. Use this component for JavaScript expressions or
array props; pasted HTML is static, so dynamic values require the component.

## Verification and files

```sh
npm run test:images
npm run check
npm run build
```

- `scripts/cloudinary-breakpoints.mjs`: upload, cache, and `<picture>` HTML output.
- `src/components/Picture.astro`: component for Astro and MDX.
- `src/lib/cloudinary-picture.mjs`: shared URL, crop, width, fallback, and HTML logic.

This theme has no separate `markdown-pipeline.mjs` or sanitizer. If adding
`rehype-sanitize` later, allow standard `picture`, `source`, and `img` elements and
their responsive attributes so pasted `<picture>` blocks survive.

Builds validate markup and metadata, but do not confirm Cloudinary assets exist.
After uploading and deploying, verify live image requests. The upload command uses
path-derived public IDs and overwrites an existing asset at the same ID.

## If an image is invisible without an error

Inspect the page's HTML. Check that the post still contains a `<picture>` with
`<source>` and `<img>` children — pasted blocks pass through unchanged, so a missing
image means the block was edited or mangled in the post, not that a build step dropped
it. `npm run test:images` renders the actual Astro configuration against the
incident-review post, so anything that strips raw HTML from Markdown fails a test.

After changing the configuration or `.env`, stop and restart `npm run dev` (or
rebuild and redeploy). Set `PUBLIC_CLOUDINARY_CLOUD_NAME` to your actual cloud name
locally and on the build host. Keep your API key and secret private.

If `<picture>` is present but a request fails, check its Cloudinary URL and response
in the browser's Network panel. Confirm the cloud name and uploaded public ID match
your asset. A successful build does not verify that an asset exists in that cloud.

References: [Cloudinary transformations](https://cloudinary.com/documentation/image_transformations)
and [responsive breakpoints](https://cloudinary.com/documentation/image_upload_api_reference#responsive_breakpoints).
