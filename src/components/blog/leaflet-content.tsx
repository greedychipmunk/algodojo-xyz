import {
  flattenBlocks,
  type LeafletBlock,
  type LeafletContent as LeafletContentValue,
} from "@/lib/leaflet";
import { RichText } from "./rich-text";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const normalize = (value?: string) => (value ?? "").trim().toLowerCase();

/** Render one leaflet block. Unknown block types degrade to their plaintext. */
function Block({ block }: { block: LeafletBlock }) {
  switch (block.$type) {
    case "pub.leaflet.blocks.header": {
      const level = clamp(block.level ?? 2, 1, 6);
      const Heading = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return <Heading>{block.plaintext}</Heading>;
    }
    case "pub.leaflet.blocks.text":
      if (!block.plaintext) return null;
      return (
        <p>
          <RichText text={block.plaintext} facets={block.facets} />
        </p>
      );
    default:
      return block.plaintext ? <p>{block.plaintext}</p> : null;
  }
}

/**
 * Render a `pub.leaflet.content` body. Falls back to `textContent` (split into
 * paragraphs) when there is no structured content. When `title` is given, a
 * leading header block matching it is dropped so the page's own <h1> isn't
 * duplicated.
 */
export function LeafletContent({
  content,
  fallback,
  title,
}: {
  content?: LeafletContentValue;
  fallback?: string;
  title?: string;
}) {
  let blocks = flattenBlocks(content);

  if (
    title &&
    blocks[0]?.$type === "pub.leaflet.blocks.header" &&
    normalize(blocks[0].plaintext) === normalize(title)
  ) {
    blocks = blocks.slice(1);
  }

  if (blocks.length === 0) {
    if (!fallback?.trim()) return null;
    return (
      <>
        {fallback
          .split(/\n{2,}/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
          .map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
      </>
    );
  }

  return (
    <>
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </>
  );
}
