import { ImageResponse } from "next/og";
import { siteConfig } from "./site";

export const alt = siteConfig.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated social share card (also used as the Twitter image). Mirrors the
// arcade palette: cream paper, ink text, amber accents.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#d7d1c3",
          color: "#17150f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 20,
              marginRight: 28,
              background: "#17150f",
              color: "#ffb000",
              fontSize: 56,
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            {">_"}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            SSH-ARCADE
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 128,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -5,
            }}
          >
            INSERT COIN.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 128,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -5,
            }}
          >
            START FARM.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              marginRight: 20,
              padding: "20px 30px",
              borderRadius: 16,
              background: "#17150f",
              color: "#f8f1dc",
              fontSize: 36,
              fontFamily: "monospace",
            }}
          >
            {siteConfig.sshCommand}
          </div>
          <div
            style={{
              display: "flex",
              padding: "20px 30px",
              borderRadius: 16,
              background: "#ff6b00",
              color: "#17150f",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            Free to play
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
