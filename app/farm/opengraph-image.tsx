import { ImageResponse } from "next/og";
import { siteConfig } from "../site";

export const alt = "Farm — cozy idle farming in your terminal | SSH-Arcade";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const accent = "#5fc868";
const accentDeep = "#4a9a52";

// Farm cabinet social share card. Leafy green accent, same arcade chassis feel.
export default function FarmOpengraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                color: accent,
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
          <div
            style={{
              display: "flex",
              padding: "16px 28px",
              borderRadius: 999,
              background: "#17150f",
              color: accent,
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            CABINET F-01
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              marginBottom: 20,
              padding: "12px 24px",
              borderRadius: 999,
              background: accent,
              color: "#17150f",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 3,
            }}
          >
            FARM
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -4,
            }}
          >
            PLANT IT.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -4,
            }}
          >
            WALK AWAY.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -4,
              color: accentDeep,
            }}
          >
            COME HOME RICHER.
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
              background: accent,
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
