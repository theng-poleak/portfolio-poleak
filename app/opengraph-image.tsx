import { ImageResponse } from "next/og";

import { getContent } from "@/lib/content";

export const alt = "Portfolio preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { name } = getContent().profile;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        background: "black",
        color: "white",
      }}
    >
      <div style={{ fontSize: 76, fontWeight: 700 }}>{name}</div>
      <div
        style={{
          display: "flex",
          padding: "24px 44px",
          borderRadius: 60,
          border: "2px solid gray",
          color: "lightgray",
          fontSize: 36,
        }}
      >
        What would you like to know about me?
      </div>
    </div>,
    size,
  );
}
