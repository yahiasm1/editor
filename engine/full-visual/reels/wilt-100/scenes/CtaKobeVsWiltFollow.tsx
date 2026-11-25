// wilt-100 "cta": the creator's Instagram follow row (their real avatar and handle, Instagram's dark-mode Follow button,
// as in their wemby-50 ask). It lands on "Follow", the button is pressed and turns Following; on "next" it rises and
// shrinks to the top of the stage, where it stays as the signature over the two prints.
import React from "react";
import { Img, staticFile } from "remotion";
import { ease, mix, prog } from "../../../src/engine";
import { CKW_CARD, CKW_HAIR, CKW_IG, CKW_SMOOTH, type CtaKobeVsWiltT, ckwLerp } from "./CtaKobeVsWiltKit";

const W = 860, H = 200, AV = 132, BW = 220, BH = 72;

export const CtaKobeVsWiltFollow: React.FC<{ f: number; T: CtaKobeVsWiltT; font: string }> = ({ f, T, font }) => {
  const inK = prog(f, T.born, 12, ease.out);
  const press = T.follow + 5;
  const dip = prog(f, press, 4) - prog(f, press + 5, 7);
  const flip = f >= press + 6;
  const btnBg = mix(f, press + 5, 5, CKW_IG.blue, CKW_IG.btn);
  const ring = prog(f, press, 18, ease.out);
  const up = prog(f, T.next - 2, 26, CKW_SMOOTH);
  const cy = ckwLerp(930, 598, up) + (1 - inK) * 70;
  const s = ckwLerp(1, 0.62, up);
  // the avatar keeps breathing: a slow push inside its circle
  const push = 1.04 + 0.04 * prog(f, T.born, T.end - T.born, ease.linear);
  return (
    <div
      style={{
        position: "absolute", left: 540 - W / 2, top: cy - H / 2, width: W, height: H, borderRadius: 30,
        background: CKW_CARD, boxShadow: `0 0 0 1.5px ${CKW_HAIR}, 0 24px 50px rgba(0,0,0,0.55)`,
        transform: `scale(${s.toFixed(4)})`, transformOrigin: "50% 50%", opacity: inK,
        filter: inK < 1 ? `blur(${((1 - inK) * 12).toFixed(2)}px)` : undefined, fontFamily: font,
      }}
    >
      <div style={{ position: "absolute", left: 34, top: (H - AV) / 2, width: AV, height: AV, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 1.5px rgba(255,255,255,0.14)" }}>
        <Img src={staticFile("wilt-100/ctakobevswilt-avatar.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push.toFixed(4)})` }} />
      </div>
      <div style={{ position: "absolute", left: 34 + AV + 28, top: 52, fontSize: 44, fontWeight: 700, color: CKW_IG.text, letterSpacing: -0.6 }}>ballsimplified</div>
      <div style={{ position: "absolute", left: 34 + AV + 28, top: 110, fontSize: 32, fontWeight: 500, color: CKW_IG.sub }}>Ball Simplified</div>
      <div
        style={{
          position: "absolute", left: W - 34 - BW, top: (H - BH) / 2, width: BW, height: BH, borderRadius: 16, background: btnBg,
          transform: `scale(${(1 - 0.07 * dip).toFixed(4)})`, display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, fontSize: 32, fontWeight: 700, color: "#FFFFFF",
        }}
      >
        {flip ? "Following" : "Follow"}
        {flip && (
          <svg width={20} height={20} viewBox="0 0 12 12" style={{ opacity: prog(f, press + 6, 5) }}>
            <path d="M2 4.2 6 8l4-3.8" fill="none" stroke="#F5F5F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {/* the tap */}
      <div
        style={{
          position: "absolute", left: W - 34 - BW / 2 - 60, top: H / 2 - 60, width: 120, height: 120, borderRadius: "50%",
          background: "rgba(255,255,255,0.35)", transform: `scale(${(0.2 + 1.2 * ring).toFixed(3)})`,
          opacity: f >= press ? 0.9 * (1 - ring) : 0,
        }}
      />
    </div>
  );
};
