// Hook A, "the yank, rim to line" (shaq-free-throws-h1), 0-4.87 s:
// "Shaquille O'Neal was so unstoppable that teams started fouling him on purpose."
// Shaquille O'Neal: the real Suns dunk photo, cut out, already rising at the rim on the behind-the-shooter court.
// unstoppable: he hammers it: the ring bends 6 deg, the board flexes, the net snaps, the ball drops through, dust off
// the boards, three frames of shake. teams: five real team logos fly in from the edges and bounce off him like pins.
// fouling: a real hand clamps his arm (foul red marks bloom) and YANKS: camera and Shaq dragged 15 ft back down the
// lane in one 22-frame whip, the dunk swapping for the real standing Lakers Shaq on the blur frame, feet thud on the
// line. on: the whistle blasts by his head. purpose: the FOUL tag stamps on the arm. In the silence the hand drags him
// out of frame left while the camera settles on the backwards court (keep = true: backwards starts on that picture).
// Notes: notes/HookX1.md.
import React from "react";
import { Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/BarlowCondensed";
import { ease, prog, useScene } from "../../../src/engine";
import { HookX1Cam, HookX1Court, HookX1EndCam, HookX1Rig, hookX1Mix, hookX1Project } from "./HookX1Court";

const HookX1Font = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] }).fontFamily;
const RED = "#E5383B";

// the cut-outs (image px) and their anchors
const DUNK = { src: "shaq-free-throws/hookx1-shaq-dunk.png", nonet: "shaq-free-throws/hookx1-shaq-dunk-nonet.png", w: 1662, h: 2097, ring: [1440, 112], grip: [215, 1150], head: [700, 1050], shL: [200, 1440], shR: [1040, 1400], pxPerFt: 350 };
const STAND = { src: "shaq-free-throws/hookx1-shaq-lakers.png", w: 719, h: 2327, feet: [440, 2290], grip: [70, 470], head: [478, 130], pxPerFt: 2327 / 7.1 };
const HAND = { src: "shaq-free-throws/hookx1-hand.png", w: 813, h: 590, grip: [400, 330] };

// cameras (feet, degrees, px)
const CAM_RIM: HookX1Cam = { y: 5.4, z: 8.6, a: 0, F: 605, X0: 540, Y0: 860, dy: 0, blur: 0, dim: 1 };
const CAM_LINE: HookX1Cam = { y: 13.92 + 9, z: 6, a: 0, F: 950, X0: 540, Y0: 800, dy: 0, blur: 0, dim: 1 };
const SHAQ_X = -1.2; // where he stands on the line, feet

const HookX1Logos = [
  { src: "hookx1-mavericks.svg", from: [-260, 760], hit: "shL" },
  { src: "hookx1-spurs.svg", from: [1340, 820], hit: "shR" },
  { src: "hookx1-kings.svg", from: [-240, 1380], hit: "shL" },
  { src: "hookx1-blazers.svg", from: [1320, 1320], hit: "shR" },
  { src: "hookx1-pacers.svg", from: [1300, 1700], hit: "shR" },
] as const;

const HookX1Dust = (() => {
  const out: { x: number; y: number; vx: number; vy: number; r: number; d: number }[] = [];
  let s = 97;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 90; i++) out.push({ x: rnd() * 1080, y: 1385 + rnd() * 60, vx: (rnd() - 0.5) * 2.4, vy: -1.2 - rnd() * 2.6, r: 1.5 + rnd() * 4, d: rnd() * 8 });
  return out;
})();

/** a decaying spring: 1 at t = 0, rings and settles */
const hookX1Spring = (k: number, period = 14, decay = 16) => (k < 0 ? 0 : Math.exp(-k / decay) * Math.cos((k / period) * Math.PI * 2));

export const HookX1: React.FC & { keep?: boolean } = () => {
  const { f, cue, scene } = useScene();
  const T = {
    oneal: cue("O'Neal"),
    unst: cue("unstoppable"),
    teams: cue("teams"),
    fouling: cue("fouling"),
    on: cue("on"),
    purpose: cue("purpose"),
    end: scene.to,
  };
  const yank0 = T.fouling + 2;
  const YANK = 22;
  const yankT = prog(f, yank0, YANK, (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2));
  const yankV = Math.abs(yankT - prog(f - 1, yank0, YANK, (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)));
  const landed = yank0 + YANK;
  // the hand-over: the last 13 frames before backwards mounts (it draws over the whole stage at end - 6)
  const hEnd = T.end - 6 - 1; // the hook's last drawn frame
  const ho0 = hEnd - 13;
  const hoT = prog(f, ho0, 13, ease.inOut);
  const out = prog(f, ho0 - 1, 11, ease.in);

  // ---- camera ----
  // a slow push at the rim; a slow push on the payoff
  // the shake: three frames on the slam, two on the landing
  const shakeA = [14, -11, 6, -2];
  const kS = f - T.unst;
  const kL = f - landed;
  const sx = (kS >= 0 && kS < 4 ? shakeA[kS] : 0) + (kL >= 0 && kL < 3 ? [5, -3, 1][kL] : 0);
  const sy = (kS >= 0 && kS < 4 ? [10, -8, 4, -1][kS] : 0) + (kL >= 0 && kL < 3 ? [8, -4, 1][kL] : 0);
  // a slow push at the rim, with a small kick toward him on his name
  const camRimBase = { ...CAM_RIM, y: CAM_RIM.y - 0.35 * prog(f, 0, T.fouling, ease.linear), F: CAM_RIM.F * (1 + 0.03 * prog(f, T.oneal - 2, 14, ease.out)) };
  // frame him: his body centred, so the ring sits where his right fist is
  {
    const sc0 = (1.5 * camRimBase.F) / Math.max(1, hookX1Project(camRimBase, -0.72, 0.2, 10)[2]) / 400;
    const want = 540 + (DUNK.ring[0] - 700) * sc0;
    camRimBase.X0 += want - hookX1Project(camRimBase, -0.72, 0.2, 10)[0];
  }
  const camRimNow = { ...camRimBase, X0: camRimBase.X0 + sx, Y0: camRimBase.Y0 + sy };
  const camLineNow = { ...CAM_LINE, F: CAM_LINE.F * (1 + 0.035 * prog(f, landed, 70, ease.out)), X0: CAM_LINE.X0 + sx, Y0: CAM_LINE.Y0 + sy };
  const cam = hookX1Mix(hookX1Mix(camRimNow, camLineNow, yankT), HookX1EndCam, hoT);
  const P = (x: number, y: number, z: number) => hookX1Project(cam, x, y, z);

  // ---- the rim rig ----
  const slam = f - T.unst;
  const shiver = f < T.unst ? 0.012 * Math.sin(f * 1.9) * (0.4 + 0.6 * prog(f, 0, T.unst)) : 0;
  const rig: HookX1Rig = {
    bend: slam >= 0 ? 6 * Math.max(0, hookX1Spring(slam, 22, 12)) + 1.2 * Math.max(0, -hookX1Spring(slam, 22, 12)) * 0 : 0,
    flex: (slam >= 0 ? 0.22 * hookX1Spring(slam, 10, 11) : 0) + shiver,
    netDrop: slam >= 0 ? 0.65 * Math.max(0, hookX1Spring(slam - 2, 16, 10)) + 0.15 * Math.max(0, -hookX1Spring(slam - 2, 16, 10)) : 0.05 * Math.sin(f / 7),
    netSwing: slam >= 0 ? 0.18 * Math.sin(slam / 5) * Math.exp(-slam / 30) : 0.03 * Math.sin(f / 11),
    streak: Math.min(1, yankV * 9) * (1 - hoT),
    shadow: yankT > 0.5 && out < 0.6 ? { x: SHAQ_X, y: 13.92, s: 1 + 0.35 * Math.max(0, 1 - (f - landed) / 7) * (f >= landed ? 1 : 0) } : null,
    flashes: f < T.teams + 30,
    net: prog(yankT, 0.04, 0.1, ease.linear),
  };

  // ---- Shaq ----
  // world anchor: the ring at the rim, the line after the yank
  // the dunk: rising into the ring, landing on "unstoppable", hanging, then the jolts of the logos
  const rise = (1 - prog(f, -20, T.unst + 20, ease.out)) * 150;
  const hang = slam >= 0 ? 26 * Math.max(0, hookX1Spring(slam, 18, 14)) + 10 * prog(f, T.unst, 20) : 0;
  let jx = 0;
  let jy = 0;
  HookX1Logos.forEach((l, i) => {
    const k = f - (T.teams - 2 + i * 6 + 8);
    if (k >= 0 && k < 12) {
      const dir = l.hit === "shL" ? 1 : l.hit === "shR" ? -1 : 0;
      const a = Math.exp(-k / 3) * Math.cos(k * 1.4);
      jx += dir * 12 * a;
      jy += 4 * a;
    }
  });
  const ringS = hookX1Project(camRimNow, -0.72, 0.2, 10);
  // the photo's own net hangs from his fist: the drawn ring is sized to it
  const dunkSc0 = (1.5 * camRimNow.F) / Math.max(1, ringS[2]) / 400;
  const d0 = { sc: dunkSc0, x: ringS[0] - DUNK.ring[0] * dunkSc0 + jx, y: ringS[1] - DUNK.ring[1] * dunkSc0 + rise + hang + jy };
  const feetS = hookX1Project(camLineNow, SHAQ_X, 13.92, 0);
  const standSc0 = (camLineNow.F / feetS[2]) / STAND.pxPerFt;
  const s1 = { sc: standSc0, x: feetS[0] - STAND.feet[0] * standSc0, y: feetS[1] - STAND.feet[1] * standSc0 };
  // the body's centre on screen travels from the rim pose to the line pose; each cut-out keeps its own size ratio
  const DC = [650, 1500];
  const SC = [380, 1000];
  const cD = [d0.x + DC[0] * d0.sc, d0.y + DC[1] * d0.sc];
  const cS = [s1.x + SC[0] * s1.sc, s1.y + SC[1] * s1.sc];
  const kSize = (s1.sc * STAND.h) / (d0.sc * DUNK.h * 1.25); // the standing body vs the dunking one
  const cx = cD[0] + (cS[0] - cD[0]) * yankT;
  const cy = cD[1] + (cS[1] - cD[1]) * yankT;
  const grow = Math.pow(kSize, yankT);
  const dunk = { sc: d0.sc * grow, x: cx - DC[0] * d0.sc * grow, y: cy - DC[1] * d0.sc * grow };
  const sh2 = s1.sc / Math.pow(kSize, 1 - yankT);
  const stand = { sc: sh2, x: cx - SC[0] * sh2, y: cy - SC[1] * sh2 };
  // during the yank the dunk is dragged with its anchor; both cut-outs ride the same pull
  const swap = yankT >= 0.5;
  const gripS: [number, number] = swap
    ? [stand.x + STAND.grip[0] * stand.sc, stand.y + STAND.grip[1] * stand.sc]
    : [dunk.x + DUNK.grip[0] * dunk.sc, dunk.y + DUNK.grip[1] * dunk.sc];
  const headS: [number, number] = swap
    ? [stand.x + STAND.head[0] * stand.sc, stand.y + STAND.head[1] * stand.sc]
    : [dunk.x + DUNK.head[0] * dunk.sc, dunk.y + DUNK.head[1] * dunk.sc];
  const moBlur = Math.min(22, yankV * 260);
  const outX = -1150 * out;
  const outBlur = Math.min(30, (out - prog(f - 1, ho0 - 1, 11, ease.in)) * 1150 * 0.12);

  // ---- the hand ----
  const handIn = prog(f, T.fouling - 7, 7, ease.out); // arrives as the word lands
  const clamp = prog(f, T.fouling - 1, 5, ease.out);
  const press = clamp * (1 + 0.08 * Math.sin((f - T.fouling) / 6) * prog(f, landed, 10));
  const handW = swap ? 175 : 230;
  const handSc = handW / HAND.w;
  const tug = f >= yank0 && f < landed ? -40 * Math.sin(yankT * Math.PI) : 0;
  const handAng = -8 + 14 * (1 - clamp) + (f >= yank0 && f < landed ? 10 * Math.sin(yankT * Math.PI) : 0);
  const handX = gripS[0] + (swap ? 26 : 18) - 520 * (1 - handIn) + tug;
  const handY = gripS[1] + 80 * (1 - handIn);
  const fingerClip = HAND.w - 250 * clamp; // the fingers wrap round his arm and out of sight

  // ---- whistle and tag ----
  const blast = (start: number) =>
    [0, 1, 2].map((i) => {
      const k = f - start - i * 4;
      if (k < 0 || k > 22) return null;
      const p = k / 22;
      return (
        <circle key={`${start}-${i}`} cx={0} cy={0} r={26 + 92 * ease.out(p)} fill="none" stroke={RED} strokeWidth={7 * (1 - p) + 2} opacity={(1 - p) * 0.95} />
      );
    });
  const whistleOn = prog(f, T.on - 4, 6, ease.back);
  const tagK = f - T.purpose;
  const tagSc = tagK < 0 ? 0 : tagK < 4 ? 1.6 - 0.6 * ease.in(tagK / 4) : 1;
  const tagDy = tagK >= 4 && tagK < 10 ? 4 * Math.sin(((tagK - 4) / 6) * Math.PI) : 0;

  const credit = swap ? "Bigmoe797, CC BY-SA 4.0" : "Keith Allison, CC BY-SA 2.0";
  const creditOp = (1 - out) * (yankT > 0.25 && yankT < 0.75 ? 0 : 1);

  const showFigure = f < hEnd + 1 && out < 1;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <HookX1Court f={f} c={cam} rig={rig} standsDy={-70 * hoT} extra={1 - hoT} />
      {/* at the rim his body runs down out of the light: the floor under the basket falls into shadow */}
      <div style={{ position: "absolute", left: 0, top: 1250, width: 1080, height: 670, opacity: 1 - yankT, background: "linear-gradient(180deg, rgba(13,17,23,0) 0%, rgba(13,17,23,0.7) 45%, rgba(13,17,23,0.95) 75%)" }} />
      {/* at the rim the board reaches up under the caption: the navy closes over its top edge */}
      <div style={{ position: "absolute", left: 0, top: 300, width: 1080, height: 300, opacity: 1 - yankT, background: "linear-gradient(180deg, #0D1117 0%, #0D1117 55%, rgba(13,17,23,0) 100%)" }} />

      {/* the ball: in his hand above the ring, then through it on "unstoppable" and out the bottom */}
      {(() => {
        if (yankT > 0.15) return null;
        const fist = [dunk.x + 1480 * dunk.sc, dunk.y + 40 * dunk.sc];
        const rc = P(0, 0, 10);
        let s: [number, number];
        let size = (0.78 * cam.F) / Math.max(0.5, rc[2]);
        if (slam < 0) s = [fist[0] - size * 0.15, fist[1] - size * 0.35];
        else if (slam < 7) {
          const q = ease.in(slam / 7);
          s = [fist[0] - size * 0.15 + (rc[0] - fist[0] + size * 0.15) * q, fist[1] - size * 0.35 + (rc[1] + size * 0.4 - fist[1] + size * 0.35) * q];
        } else {
          const k = slam - 7;
          s = [rc[0] + 0.6 * k, rc[1] + size * 0.4 + 2.2 * k + 0.9 * k * k];
          size *= 1 + k * 0.03;
        }
        if (s[1] > 2000) return null;
        return (
          <Img
            src={staticFile("shaq-free-throws/hookx1-ball.png")}
            style={{ position: "absolute", left: s[0] - size / 2, top: s[1] - size / 2, width: size, height: size, transform: `rotate(${f * 6}deg)`, filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.5))", zIndex: slam < 9 ? 5 : 1 }}
          />
        );
      })()}

      {/* dust off the boards on the slam */}
      {slam >= 0 && slam < 50 && yankT < 0.1 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {HookX1Dust.map((d, i) => {
            const k = slam - d.d;
            if (k < 0) return null;
            const o = Math.max(0, 1 - k / 40);
            return <circle key={i} cx={d.x + d.vx * k} cy={d.y + d.vy * k + 0.03 * k * k} r={d.r * (1 + k / 30)} fill="#E8D3B0" opacity={0.55 * o} style={{ filter: "blur(1.5px)" }} />;
          })}
        </svg>
      )}

      {showFigure && (
        <div style={{ position: "absolute", inset: 0, zIndex: 3, transform: `translateX(${outX.toFixed(1)}px)`, filter: outBlur > 0.5 ? `blur(${outBlur.toFixed(1)}px)` : undefined }}>
          {/* Shaq: the dunk, then the standing Lakers Shaq, swapped on the blur frame */}
          {!swap && (
            <Img
              src={staticFile(yankT > 0.06 ? DUNK.nonet : DUNK.src)}
              style={{ position: "absolute", left: dunk.x, top: dunk.y, width: DUNK.w * dunk.sc, height: DUNK.h * dunk.sc, filter: `${moBlur > 0.5 ? `blur(${(moBlur * 0.5).toFixed(1)}px) ` : ""}drop-shadow(0 20px 30px rgba(0,0,0,0.45))`, opacity: 1 - prog(yankT, 0.38, 0.12, ease.linear) * 0 }}
            />
          )}
          {swap && (
            <Img
              src={staticFile(STAND.src)}
              style={{ position: "absolute", left: stand.x, top: stand.y, width: STAND.w * stand.sc, height: STAND.h * stand.sc, filter: `${moBlur > 0.5 ? `blur(${(moBlur * 0.5).toFixed(1)}px) ` : ""}drop-shadow(0 14px 18px rgba(0,0,0,0.35))` }}
            />
          )}

          {/* the logos: the teams closing in, bouncing off him like pins */}
          {!swap &&
            HookX1Logos.map((l, i) => {
              const t0 = T.teams - 2 + i * 6;
              const k = f - t0;
              if (k < 0 || k > 34) return null;
              const tgt = DUNK[l.hit];
              const hx = dunk.x + tgt[0] * dunk.sc;
              const hy = dunk.y + tgt[1] * dunk.sc;
              let x: number;
              let y: number;
              let rot: number;
              const size = 190;
              if (k < 8) {
                const p = ease.in(k / 8);
                x = l.from[0] + (hx - l.from[0]) * p;
                y = l.from[1] + (hy - l.from[1]) * p;
                rot = -20 * (1 - p);
              } else {
                const q = k - 8;
                const bx = (hx - l.from[0]) * -0.07;
                const by = (hy - l.from[1]) * -0.05;
                x = hx + bx * q;
                y = hy + by * q + 0.9 * q * q;
                rot = (l.hit === "shR" ? 1 : -1) * q * 19;
              }
              const squash = k >= 8 && k < 11 ? 1 - 0.18 * (1 - (k - 8) / 3) : 1;
              return (
                <div key={i} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `rotate(${rot}deg) scale(${squash}, ${2 - squash})`, filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.55))" }}>
                  <Img src={staticFile(`shaq-free-throws/${l.src}`)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  {k >= 8 && k < 12 && (
                    <div style={{ position: "absolute", left: "50%", top: "50%", width: 260, height: 260, marginLeft: -130, marginTop: -130, borderRadius: 130, border: `${(4 * (12 - k)).toFixed(0)}px solid rgba(255,255,255,${(0.5 * (12 - k)) / 4})`, transform: `scale(${0.5 + (k - 8) * 0.18})` }} />
                  )}
                </div>
              );
            })}

          {/* the hand: a defender's real hand clamping his arm */}
          {f >= T.fouling - 7 && (
            <div style={{ position: "absolute", left: handX - HAND.grip[0] * handSc, top: handY - HAND.grip[1] * handSc, width: HAND.w * handSc, height: HAND.h * handSc, transformOrigin: `${HAND.grip[0] * handSc}px ${HAND.grip[1] * handSc}px`, transform: `rotate(${handAng.toFixed(2)}deg)` }}>
              {/* the defender's forearm, out to the left edge: it widens toward the elbow, lit from above */}
              <svg width={2000} height={HAND.h * handSc * 2} style={{ position: "absolute", left: -2000 + 60 * handSc, top: -HAND.h * handSc * 0.5, overflow: "visible" }}>
                <defs>
                  <linearGradient id="hx1-arm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#F3D6C2" />
                    <stop offset="0.3" stopColor="#E6BDA2" />
                    <stop offset="0.7" stopColor="#C99274" />
                    <stop offset="1" stopColor="#8E5A42" />
                  </linearGradient>
                </defs>
                {(() => {
                  const cy = HAND.h * handSc * 0.5 + 300 * handSc;
                  const wW = 120 * handSc; // half the wrist
                  const wE = 190 * handSc; // half the forearm near the elbow
                  const x1 = 2000;
                  const x0 = 2000 - 1100 * handSc;
                  return (
                    <g>
                      <path d={`M ${x1} ${cy - wW} C ${x1 - 300 * handSc} ${cy - wW - 10 * handSc}, ${x0 + 300 * handSc} ${cy - wE}, ${x0 - 900} ${cy - wE - 30 * handSc} L ${x0 - 900} ${cy + wE + 20 * handSc} C ${x0 + 300 * handSc} ${cy + wE}, ${x1 - 300 * handSc} ${cy + wW + 6 * handSc}, ${x1} ${cy + wW} Z`} fill="url(#hx1-arm)" />
                      <path d={`M ${x1 - 40 * handSc} ${cy - wW * 0.45} C ${x1 - 400 * handSc} ${cy - wW * 0.6}, ${x0} ${cy - wE * 0.55}, ${x0 - 900} ${cy - wE * 0.6}`} fill="none" stroke="#FFF1E6" strokeOpacity={0.35} strokeWidth={14 * handSc} />
                      <path d={`M ${x1 - 20 * handSc} ${cy + wW * 0.55} C ${x1 - 380 * handSc} ${cy + wW * 0.7}, ${x0} ${cy + wE * 0.7}, ${x0 - 900} ${cy + wE * 0.75}`} fill="none" stroke="#6E3E2B" strokeOpacity={0.25} strokeWidth={18 * handSc} />
                    </g>
                  );
                })()}
              </svg>
              <svg width={HAND.w * handSc} height={HAND.h * handSc} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <defs>
                  <clipPath id="hx1-fingers">
                    <rect x={0} y={105 * clamp * handSc} width={fingerClip * handSc} height={HAND.h * handSc} />
                  </clipPath>
                  <linearGradient id="hx1-crease" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#3A1A0E" stopOpacity={0} />
                    <stop offset="1" stopColor="#3A1A0E" stopOpacity={0.55} />
                  </linearGradient>
                  <radialGradient id="hx1-mark">
                    <stop offset="0" stopColor={RED} stopOpacity={0.95} />
                    <stop offset="0.55" stopColor={RED} stopOpacity={0.5} />
                    <stop offset="1" stopColor={RED} stopOpacity={0} />
                  </radialGradient>
                </defs>
                {/* the pressure, blooming in foul red where the fingers dig in */}
                {[200, 290, 375, 455].map((yy, i) => (
                  <ellipse key={i} cx={(fingerClip + 8) * handSc} cy={yy * handSc} rx={90 * handSc * press} ry={58 * handSc * press} fill="url(#hx1-mark)" opacity={clamp} />
                ))}
                <image href={staticFile(HAND.src)} x={0} y={0} width={HAND.w * handSc} height={HAND.h * handSc} clipPath="url(#hx1-fingers)" />
                <rect x={(fingerClip - 60) * handSc} y={150 * handSc} width={60 * handSc} height={360 * handSc} fill="url(#hx1-crease)" opacity={clamp} clipPath="url(#hx1-fingers)" />
              </svg>
            </div>
          )}

          {/* the whistle: a black referee's whistle, two blasts in foul red */}
          {f >= T.on - 4 && (
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <g transform={`translate(${headS[0] + 165} ${headS[1] + 95})`}>
                <g>{blast(T.on)}</g>
                <g>{blast(T.purpose)}</g>
                <g transform={`scale(${(0.8 * whistleOn).toFixed(3)}) rotate(-10)`}>
                  {/* a chrome referee's whistle (the classic Thunderer), side on: barrel, mouthpiece, slot, lanyard ring */}
                  <defs>
                    <linearGradient id="hx1-chrome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#F4F7FA" />
                      <stop offset="0.35" stopColor="#AEB7C2" />
                      <stop offset="0.55" stopColor="#5E6773" />
                      <stop offset="0.8" stopColor="#C9D1DA" />
                      <stop offset="1" stopColor="#7C8692" />
                    </linearGradient>
                  </defs>
                  <rect x={-120} y={-14} width={86} height={30} rx={6} fill="url(#hx1-chrome)" stroke="#3E4650" strokeWidth={2} />
                  <circle cx={0} cy={6} r={44} fill="url(#hx1-chrome)" stroke="#3E4650" strokeWidth={2.5} />
                  <ellipse cx={-6} cy={-6} rx={22} ry={9} fill="#fff" opacity={0.55} />
                  <rect x={-40} y={-24} width={34} height={11} rx={2} fill="#1A1E24" />
                  <circle cx={44} cy={-30} r={11} fill="none" stroke="url(#hx1-chrome)" strokeWidth={5} />
                  <path d="M 52 -22 Q 80 30 60 120" fill="none" stroke="#111" strokeWidth={4} />
                </g>
              </g>
            </svg>
          )}

          {/* the FOUL tag, stamped on the arm */}
          {tagK >= 0 && (
            <div
              style={{
                position: "absolute",
                left: handX - 300,
                top: handY + 34 + tagDy,
                transformOrigin: "50% 50%",
                transform: `rotate(-7deg) scale(${tagSc.toFixed(3)})`,
                opacity: Math.min(1, tagK / 2 + 0.4),
                padding: "4px 26px 0",
                border: "5px solid #fff",
                borderRadius: 10,
                background: RED,
                boxShadow: "0 14px 28px rgba(0,0,0,0.5)",
                fontFamily: HookX1Font,
                fontWeight: 800,
                fontSize: 92,
                lineHeight: "94px",
                letterSpacing: 4,
                color: "#fff",
              }}
            >
              FOUL
            </div>
          )}
        </div>
      )}

      {/* the cut-out's credit */}
      <div style={{ position: "absolute", right: 40, top: 1408, fontFamily: HookX1Font, fontWeight: 700, fontSize: 22, color: "#8B949E", opacity: creditOp }}>{credit}</div>
    </div>
  );
};
HookX1.keep = true;
