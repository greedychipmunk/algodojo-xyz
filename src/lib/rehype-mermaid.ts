/**
 * Custom rehype plugin that converts `language-mermaid` code blocks into
 * `<div class="mermaid">` elements for client-side rendering by Mermaid.js.
 *
 * Must run BEFORE `@shikijs/rehype` so Shiki doesn't try to syntax-highlight
 * the Mermaid source as a code block.
 *
 * Written without external dependencies (no `unist-util-visit` needed) —
 * the tree is walked manually since the structure is simple and shallow.
 */

/** Minimal hast node shape — enough to transform code blocks. */
interface HastNode {
  type: string;
  tagName?: string;
  properties?: { className?: string[]; [key: string]: unknown };
  children?: HastNode[];
  value?: string;
}

function isMermaidPre(node: HastNode): boolean {
  return (
    node.type === "element" &&
    node.tagName === "pre" &&
    !!node.children &&
    node.children.length === 1 &&
    node.children[0].type === "element" &&
    node.children[0].tagName === "code" &&
    Array.isArray(node.children[0].properties?.className) &&
    (node.children[0].properties!.className as string[]).includes(
      "language-mermaid",
    )
  );
}

function transformMermaidBlocks(node: HastNode): HastNode {
  if (node.children) {
    node.children = node.children.map((child) => {
      if (isMermaidPre(child)) {
        const codeElement = child.children![0];
        const textContent = (codeElement.children || [])
          .map((c) => c.value || "")
          .join("");

        return {
          type: "element",
          tagName: "div",
          properties: { className: ["mermaid"] },
          children: [{ type: "text", value: textContent }],
        };
      }
      return transformMermaidBlocks(child);
    });
  }
  return node;
}

export function rehypeMermaid() {
  return (tree: HastNode) => transformMermaidBlocks(tree);
}
