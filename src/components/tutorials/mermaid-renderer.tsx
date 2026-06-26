"use client";

import { useEffect } from "react";

/**
 * Client-side component that loads Mermaid.js from a CDN and renders any
 * `<div class="mermaid">` elements produced by the `rehype-mermaid` plugin.
 *
 * Renders nothing visible — it's a side-effect-only component placed once
 * on the tutorial page. If the page has no Mermaid diagrams, the script
 * is never loaded.
 */
export function MermaidRenderer() {
  useEffect(() => {
    const mermaidDivs = document.querySelectorAll<HTMLDivElement>("div.mermaid");
    if (mermaidDivs.length === 0) return;

    const renderDiagrams = (mermaid: MermaidLibrary) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
      });

      mermaidDivs.forEach((el, i) => {
        if (el.dataset.processed) return;
        const id = `mermaid-diagram-${i}`;
        const graphDefinition = el.textContent || "";
        mermaid.render(id, graphDefinition).then((result: { svg: string }) => {
          el.innerHTML = result.svg;
          el.dataset.processed = "true";
        });
      });
    };

    // If Mermaid is already loaded (e.g. client-side navigation), reuse it.
    const existing = (window as unknown as { mermaid?: MermaidLibrary }).mermaid;
    if (existing) {
      renderDiagrams(existing);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.async = true;
    script.onload = () => {
      const mermaid = (window as unknown as { mermaid?: MermaidLibrary })
        .mermaid;
      if (mermaid) renderDiagrams(mermaid);
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <style>{`
      .prose .mermaid {
        display: flex;
        justify-content: center;
        margin: 2rem 0;
        padding: 1.5rem;
        background: #0d1117;
        border-radius: 0.5rem;
        border: 1px solid #30363d;
        overflow-x: auto;
      }
      .prose .mermaid svg {
        max-width: 100%;
        height: auto;
      }
    `}</style>
  );
}

/** Minimal type for the Mermaid library loaded from CDN. */
interface MermaidLibrary {
  initialize(config: Record<string, unknown>): void;
  render(
    id: string,
    text: string,
  ): Promise<{ svg: string }>;
}
