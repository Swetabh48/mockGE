import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Browser tab icon — bold "mG" mark for mockGE */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e3a5f",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: -0.5,
          fontFamily: "Georgia, serif",
        }}
      >
        mG
      </div>
    ),
    { ...size },
  );
}
