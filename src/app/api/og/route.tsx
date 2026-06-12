import { ImageResponse } from "next/og";

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            border: "3px solid #f59e0b",
            color: "#fafaf9",
            fontSize: "30px",
            fontWeight: 700,
            marginRight: "18px",
          }}
        >
          {"{ }"}
        </div>
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
