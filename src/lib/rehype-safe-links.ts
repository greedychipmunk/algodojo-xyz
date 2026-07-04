/**
 * A tiny rehype plugin that strips non-navigational URL schemes from `<a href>`
 * and `<img src>`.
 *
 * Blog post bodies are rendered from `site.standard.document` records, so a
 * `javascript:`, `data:`, or `vbscript:` URL in the markdown would otherwise
 * become an executable link/image. `remark-rehype` already drops raw HTML, so
 * this closes the remaining vector. Implemented as a small tree walk (no
 * `unist-util-visit` dependency) so it composes cleanly before syntax
 * highlighting, leaving Shiki's inline styles untouched.
 */

const SAFE_URL = /^(https?:|mailto:|tel:|#|\/)/i;

interface HastNode {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function sanitize(node: HastNode): void {
  if (node.type === "element" && node.properties) {
    const props = node.properties;
    if (node.tagName === "a" && typeof props.href === "string" && !SAFE_URL.test(props.href.trim())) {
      delete props.href;
    }
    if (node.tagName === "img" && typeof props.src === "string" && !SAFE_URL.test(props.src.trim())) {
      delete props.src;
    }
  }
  node.children?.forEach(sanitize);
}

export function rehypeSafeLinks() {
  return (tree: HastNode): void => {
    sanitize(tree);
  };
}
