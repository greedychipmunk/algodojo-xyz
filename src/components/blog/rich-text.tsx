import { Fragment, type ReactNode } from "react";
import { safeHref, segmentText, type Facet, type FacetFeature } from "@/lib/leaflet";

/**
 * Wrap a run of text in the elements implied by its facet features. Multiple
 * features nest (e.g. bold + code). Unknown features fall through as plain
 * text — the facet union is open, so we never throw on one we don't render.
 */
function applyFeatures(text: ReactNode, features: FacetFeature[]): ReactNode {
  return features.reduce<ReactNode>((node, feature) => {
    switch (feature.$type) {
      case "pub.leaflet.richtext.facet#bold":
        return <strong>{node}</strong>;
      case "pub.leaflet.richtext.facet#italic":
        return <em>{node}</em>;
      case "pub.leaflet.richtext.facet#underline":
        return <u>{node}</u>;
      case "pub.leaflet.richtext.facet#strikethrough":
        return <s>{node}</s>;
      case "pub.leaflet.richtext.facet#code":
        return <code>{node}</code>;
      case "pub.leaflet.richtext.facet#link": {
        const href = safeHref((feature as { uri?: string }).uri);
        return href ? (
          <a href={href} rel="noopener noreferrer" target="_blank">
            {node}
          </a>
        ) : (
          node
        );
      }
      default:
        return node;
    }
  }, text);
}

/** Render a leaflet text block's `plaintext` with its `facets` applied. */
export function RichText({ text, facets }: { text: string; facets?: Facet[] }) {
  const segments = segmentText(text, facets);
  return (
    <>
      {segments.map((segment, index) => (
        <Fragment key={index}>
          {segment.features.length
            ? applyFeatures(segment.text, segment.features)
            : segment.text}
        </Fragment>
      ))}
    </>
  );
}
