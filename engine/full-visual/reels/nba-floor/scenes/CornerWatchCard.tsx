// The creator's card for `cta`: Instagram's Reels row redrawn on the house navy card. The real avatar
// (context/profile, the same file as assets/refs/profile/ig-ballsimplified-avatar.jpg), the real handle and bio
// (context/profile.json: "ballsimplified", "Basketball Simplified"), the Reels "Follow" button as the app draws it over
// a reel (white outline, white type: not the blue profile button), which presses to "Following", then turns into the
// app's paper-plane share glyph on "send".
import React from "react";
import { Img, staticFile } from "remotion";

const FONT = "Figtree, sans-serif";
export const CW_CARD_W = 920;
export const CW_CARD_H = 184;

export const CornerWatchCard: React.FC<{
  cx: number; // centre x on screen
  top: number;
  scale: number;
  opacity: number;
  blur: number;
  press: number; // 0..1: the tap on Follow (a dip), then "Following"
  following: number; // 0..1 cross-fade to "Following"
  send: number; // 0..1 the button becomes the share glyph
  launch: number; // 0..1 the glyph lifts off a little and settles
  ring: number; // 0..1 a light round the avatar as the card lands
}> = ({ cx, top, scale, opacity, blur, press, following, send, launch, ring }) => {
  if (opacity <= 0.001) return null;
  const dip = 1 - 0.07 * Math.sin(Math.min(1, press) * Math.PI);
  const btnO = 1 - send;
  const lx = Math.sin(launch * Math.PI) * 26;
  const ly = -Math.sin(launch * Math.PI) * 22;
  return (
    <div
      style={{
        position: "absolute", left: cx - CW_CARD_W / 2, top, width: CW_CARD_W, height: CW_CARD_H,
        transform: `scale(${scale.toFixed(4)})`, transformOrigin: "50% 0%", opacity,
        filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: 24, background: "#161B22", border: "2px solid #30363D",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 2px 0 rgba(255,255,255,0.03) inset",
        }}
      />
      {/* the avatar, round, a hairline ring; a light passes round it as the card lands */}
      <div style={{ position: "absolute", left: 30, top: 28, width: 128, height: 128, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 2px #30363D" }}>
        <Img src={staticFile("nba-floor/cornerwatch-avatar.jpg")} style={{ width: 128, height: 128, objectFit: "cover" }} />
      </div>
      {ring > 0.001 && ring < 0.999 && (
        <svg width={160} height={160} style={{ position: "absolute", left: 14, top: 12 }}>
          <circle cx={80} cy={80} r={70} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" pathLength={1}
            strokeDasharray={`${(0.22).toFixed(3)} 1`} strokeDashoffset={-ring} opacity={Math.sin(ring * Math.PI) * 0.9} transform="rotate(-90 80 80)" />
        </svg>
      )}
      <div style={{ position: "absolute", left: 186, top: 40, fontFamily: FONT, fontWeight: 800, fontSize: 48, lineHeight: "56px", color: "#FFFFFF", letterSpacing: -0.5 }}>
        ballsimplified
      </div>
      <div style={{ position: "absolute", left: 187, top: 102, fontFamily: FONT, fontWeight: 600, fontSize: 34, lineHeight: "40px", color: "#8B949E" }}>
        Basketball Simplified
      </div>
      {/* the Reels Follow button: white outline, white type */}
      <div
        style={{
          position: "absolute", right: 30, top: 58, height: 68, width: 222, borderRadius: 16,
          border: `3px solid ${following > 0.5 ? "rgba(255,255,255,0.55)" : "#FFFFFF"}`, boxSizing: "border-box",
          transform: `scale(${(dip * (1 - 0.3 * send)).toFixed(4)})`, opacity: btnO,
          background: `rgba(255,255,255,${(0.16 * Math.sin(Math.min(1, press) * Math.PI)).toFixed(3)})`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 36, lineHeight: "62px", color: "#FFFFFF", opacity: 1 - following }}>Follow</div>
        <div style={{ position: "absolute", inset: 0, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 34, lineHeight: "62px", color: "#FFFFFF", opacity: following }}>Following</div>
      </div>
      {/* Instagram's share glyph: the paper plane, thin stroke */}
      {send > 0.001 && (
        <svg width={96} height={96} viewBox="0 0 24 24" style={{ position: "absolute", right: 92, top: 44, overflow: "visible", opacity: send, transform: `translate(${lx.toFixed(1)}px, ${ly.toFixed(1)}px) scale(${(0.7 + 0.3 * send).toFixed(3)}) rotate(${(-8 * Math.sin(launch * Math.PI)).toFixed(2)}deg)` }}>
          <line x1={22} y1={3} x2={9.218} y2={10.083} fill="none" stroke="#FFFFFF" strokeWidth={1.7} strokeLinejoin="round" />
          <polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" fill="none" stroke="#FFFFFF" strokeWidth={1.7} strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
};
