import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { buildPicture, pictureTree } from "../lib/cloudinary-picture.mjs";

/** Expand before any sanitizer. Handles Astro's raw .md HTML and MDX JSX nodes. */
export default function rehypeCloudinaryPicture({ cloudName } = {}) {
  return (tree, file) => {
    const render = (props) =>
      pictureTree(
        buildPicture(
          props,
          cloudName ||
            process.env.PUBLIC_CLOUDINARY_CLOUD_NAME ||
            process.env.CLOUDINARY_CLOUD_NAME,
        ),
      );
    function walk(parent) {
      if (!parent.children) return;
      parent.children = parent.children.flatMap((node) => {
        try {
          if (node.type === "raw" && /<cloudinary-picture\b/i.test(node.value)) {
            // HTML does not recognize self-closing custom elements. Normalize legacy
            // snippets before parsing so following prose cannot become their child.
            const html = node.value.replace(
              /<cloudinary-picture\b(?:[^>"']|"[^"]*"|'[^']*')*\/\s*>/gi,
              (tag) => tag.replace(/\/\s*>$/, "></cloudinary-picture>"),
            );
            const fragment = fromHtml(html, { fragment: true });
            walk(fragment);
            return { type: "raw", value: toHtml(fragment) };
          }
          if (node.type === "element" && node.tagName === "cloudinary-picture") {
            return [render(node.properties), ...(node.children ?? [])];
          }
          if (
            (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
            node.name === "cloudinary-picture"
          ) {
            const props = {};
            for (const attr of node.attributes) {
              if (attr.type !== "mdxJsxAttribute" || typeof attr.value !== "string") {
                throw new Error(
                  "cloudinary-picture accepts quoted attributes; use Picture.astro for JavaScript props.",
                );
              }
              props[attr.name] = attr.value;
            }
            return render(props);
          }
          walk(node);
          return node;
        } catch (error) {
          file.fail(`Cloudinary picture: ${error.message}`, node);
        }
      });
    }
    walk(tree);
  };
}
