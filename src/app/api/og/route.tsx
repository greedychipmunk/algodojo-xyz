import { ImageResponse } from "next/og";

// Brand mark (torii gate + amber inference-node keystone) on a charcoal tile.
// Kept in sync with app/icon.svg and components/ui/logo.tsx. Embedded as a
// data URI because Satori renders <img> reliably but inline <svg> only partially.
const MARK_SVG = `<svg width="64" height="64" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#0c0a09"/><rect x="0.5" y="0.5" width="31" height="31" rx="6.5" stroke="#44403c"/><g fill="#fafaf9"><rect x="4.5" y="6.8" width="23" height="3" rx="0.9"/><rect x="8" y="12" width="16" height="2.4" rx="0.7"/><path d="M10 9.8 H12.2 L12.6 26 H9.2 Z"/><path d="M22 9.8 H19.8 L19.4 26 H22.8 Z"/></g><path d="M16 9.2 L18 11 L16 12.8 L14 11 Z" fill="#f59e0b"/></svg>`;
const MARK_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(MARK_SVG).toString("base64")}`;

// Runs on the Node.js runtime (Fluid Compute). Fonts are fetched at request
// time rather than bundled, to stay under ImageResponse's 500KB bundle limit.

/**
 * Fetch a subset of Inter (only the glyphs in `text`) as TTF from Google Fonts.
 * Returns null on any failure so the image still renders with the default font.
 */
async function loadInter(
  text: string,
  weight: 400 | 700,
): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&text=${encodeURIComponent(
      text,
    )}`;
    const css = await (await fetch(cssUrl)).text();
    const match = css.match(
      /src: url\((https:\/\/[^)]+)\) format\('(?:opentype|truetype)'\)/,
    );
    if (!match) return null;
    const res = await fetch(match[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Algo Dojo").slice(0, 100);
  const eyebrow = (searchParams.get("eyebrow") || "").slice(0, 40);

  // Subset the fonts to exactly the glyphs we render.
  const renderedText = `Algo Dojo algodojo.xyz { } ${eyebrow} ${title}`;
  const [bold, regular] = await Promise.all([
    loadInter(renderedText, 700),
    loadInter(renderedText, 400),
  ]);

  const fonts = [
    bold && {
      name: "Inter",
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
    regular && {
      name: "Inter",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
  ].filter(Boolean) as {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 700;
    style: "normal";
  }[];

  const titleSize = title.length > 70 ? 52 : title.length > 45 ? 60 : 74;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundColor: "#0c0a09",
        backgroundImage:
          "radial-gradient(1000px circle at 100% 0%, rgba(245,158,11,0.18), rgba(245,158,11,0) 55%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Wordmark */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MARK_DATA_URI}
          width={64}
          height={64}
          alt="Algo Dojo"
          style={{ marginRight: "18px" }}
        />
        <div style={{ display: "flex", fontSize: "34px", fontWeight: 700 }}>
          <span style={{ color: "#fafaf9" }}>Algo</span>
          <span style={{ color: "#f59e0b" }}>&nbsp;Dojo</span>
        </div>
      </div>

      {/* Title block */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              color: "#f59e0b",
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            color: "#fafaf9",
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            width: "120px",
            height: "4px",
            borderRadius: "2px",
            backgroundColor: "#f59e0b",
            marginBottom: "20px",
          }}
        />
        <div
          style={{
            display: "flex",
            color: "#8f887f",
            fontSize: "24px",
            letterSpacing: "2px",
          }}
        >
          algodojo.xyz
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      ...(fonts.length > 0 ? { fonts } : {}),
      headers: {
        "Cache-Control": "public, max-age=604800, immutable",
      },
    },
  );
}
