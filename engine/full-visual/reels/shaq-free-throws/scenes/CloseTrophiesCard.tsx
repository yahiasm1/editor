// The creator's follow row for `close`: Instagram's Reels row redrawn on the creator's navy card (#161B22, hairline
// #30363D), the real avatar (assets/refs/profile/ig-ballsimplified-avatar.jpg from nba-floor), the real handle and
// name, the Reels "Follow" button as the app draws it over a reel (white outline, white type), pressed to
// "Following". Same row as the creator's earlier reels, so it reads as theirs.
import React from "react";
import { Img, staticFile } from "remotion";

const FONT = "Figtree, sans-serif";
export const CLOSE_TROPHIES_CARD_W = 920;
export const CLOSE_TROPHIES_CARD_H = 184;

export const CloseTrophiesCard: React.FC<{
  cx: number; top: number; opacity: number; blur: number; press: number; following: number; ring: number;
}> = ({ cx, top, opacity, blur, press, following, ring }) => {
  if (opacity <= 0.001) return null;
  const dip = 1 - 0.08 * Math.sin(Math.min(1, press) * Math.PI);
  return (
    <div
      style={{
        position: "absolute", left: cx - CLOSE_TROPHIES_CARD_W / 2, top, width: CLOSE_TROPHIES_CARD_W, height: CLOSE_TROPHIES_CARD_H,
        opacity, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
      }}
    >
      <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "rgba(22,27,34,0.94)", border: "2px solid #30363D", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 30, top: 28, width: 128, height: 128, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 2px #30363D" }}>
        <Img src={staticFile("shaq-free-throws/closetrophies-avatar.jpg")} style={{ width: 128, height: 128, objectFit: "cover" }} />
      </div>
      {ring > 0.001 && ring < 0.999 && (
        <svg width={160} height={160} style={{ position: "absolute", left: 14, top: 12 }}>
          <circle cx={80} cy={80} r={70} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" pathLength={1}
            strokeDasharray="0.22 1" strokeDashoffset={-ring} opacity={Math.sin(ring * Math.PI) * 0.9} transform="rotate(-90 80 80)" />
        </svg>
      )}
      <div style={{ position: "absolute", left: 186, top: 40, fontFamily: FONT, fontWeight: 800, fontSize: 48, lineHeight: "56px", color: "#FFFFFF", letterSpacing: -0.5 }}>ballsimplified</div>
      <div style={{ position: "absolute", left: 187, top: 102, fontFamily: FONT, fontWeight: 600, fontSize: 34, lineHeight: "40px", color: "#8B949E" }}>Basketball Simplified</div>
      <div
        style={{
          position: "absolute", right: 30, top: 58, height: 68, width: 232, borderRadius: 16,
          border: `3px solid ${following > 0.5 ? "rgba(255,255,255,0.55)" : "#FFFFFF"}`, boxSizing: "border-box",
          transform: `scale(${dip.toFixed(4)})`,
          background: `rgba(255,255,255,${(0.18 * Math.sin(Math.min(1, press) * Math.PI)).toFixed(3)})`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 36, lineHeight: "62px", color: "#FFFFFF", opacity: 1 - following }}>Follow</div>
        <div style={{ position: "absolute", inset: 0, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 34, lineHeight: "62px", color: "#FFFFFF", opacity: following }}>Following</div>
      </div>
    </div>
  );
};
