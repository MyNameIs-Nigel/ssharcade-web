import { ImageResponse } from "next/og";

// Apple touch icon — generated so it stays in sync with the brand glyph.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#17150f",
          color: "#ffb000",
          fontSize: 104,
          fontWeight: 800,
          fontFamily: "monospace",
        }}
      >
        {">_"}
      </div>
    ),
    { ...size },
  );
}
