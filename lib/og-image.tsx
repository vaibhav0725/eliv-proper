import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogAlt =
  "Eliv Logistics — freight forwarding, land transport, and customs brokerage across APAC";

export async function createOgImage() {
  const logo = await readFile(join(process.cwd(), "public/logo-mark.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#101218",
          color: "#ffffff",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 700,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#a8b0bd",
            }}
          >
            Australia · New Zealand · Hong Kong · China
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 78,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 0.95,
            }}
          >
            Eliv Logistics
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.35,
              color: "#d7dbe3",
            }}
          >
            Freight forwarding, land transport, and customs brokerage under one
            team.
          </div>
        </div>
        <img src={logoSrc} width={280} height={262} alt="" />
      </div>
    ),
    { ...ogSize },
  );
}
