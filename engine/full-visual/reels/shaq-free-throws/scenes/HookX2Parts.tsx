// Hook B's small real things. The grab: the back of a real right hand (Evan-Amos, CC BY-SA 3.0), rotated so the
// fingers wrap Shaq's left upper arm just above the elbow and cut where they curl behind it, a white terry wristband
// (every NBA arm in 2000), the forearm reaching in from off stage, slightly out of focus because it is nearer the
// camera; red contact crescents under the fingertips. The dry-erase markers: chisel felt tip, grey nib collar, dark
// barrel, the ink-coloured band and cap. The referee's whistle: black moulded plastic, the ring and the lanyard.
import React from "react";
import { Img, staticFile } from "remotion";
import { ease, prog } from "../../../src/engine";
import { hookX2Shaq } from "./HookX2World";

const HAND = { w: 600, h: 823, cx: 300, cy: 420 };
const rad = Math.PI / 180;

export const HookX2Hand: React.FC<{ f: number; at: number; shaqX: number; feetY: number; red: string }> = ({ f, at, shaqX, feetY, red }) => {
  if (f < at - 6) return null;
  const sh = hookX2Shaq();
  const left = shaqX - sh.feetX * sh.w;
  const top = feetY - sh.h;
  // the grip point on his upper arm, just above the elbow (cut-out px 180, 515): the knuckle row lands there
  const gx = left + 180 * sh.s;
  const gy = top + 515 * sh.s;
  const r = sh.s / 0.3275; // follows the camera when it pulls back in the handover
  const k = 0.3 * r; // the defender is nearer the camera than Shaq: his hand reads a little bigger than Shaq's own
  const rot = 112; // fingers pointing right and a little down, across his upper arm toward his back
  const CUT = 262; // photo rows above this are the fingertips, curled out of sight behind his arm
  const inn = prog(f, at - 6, 7, ease.out);
  const squeeze = prog(f, at + 1, 4, ease.out);
  const tug = f > at + 2 ? Math.exp(-(f - at - 2) / 8) * Math.sin((f - at - 2) * 0.5) : 0;
  const back = 1 - inn;
  const ay = (330 - HAND.cy) * k;
  const cx = gx + ay * Math.sin(rot * rad) - 170 * back - 10 * tug;
  const cy = gy - ay * Math.cos(rot * rad) - 50 * back + 4 * tug;
  const toScreen = (px: number, py: number): [number, number] => {
    const x = (px - HAND.cx) * k, y = (py - HAND.cy) * k;
    return [cx + x * Math.cos(rot * rad) - y * Math.sin(rot * rad), cy + x * Math.sin(rot * rad) + y * Math.cos(rot * rad)];
  };
  const wristA = toScreen(262, 790);
  const wristB = toScreen(474, 790);
  const wrist: [number, number] = [(wristA[0] + wristB[0]) / 2, (wristA[1] + wristB[1]) / 2];
  const dir = [Math.cos((rot + 90) * rad), Math.sin((rot + 90) * rad)]; // from the fingers toward the elbow of his arm
    const halfW = 31 * r;
  const nrm = [-dir[1], dir[0]];
  const along = (o: number, side: number, wd: number) => [wrist[0] + dir[0] * o + nrm[0] * side * wd, wrist[1] + dir[1] * o + nrm[1] * side * wd];
  // a forearm tapering out of the wrist: the flexor bulge toward the elbow, off stage
  const prof = [[0, 31], [60, 33], [140, 40], [230, 44], [330, 44], [420, 42]].map(([o, wd]) => [o * r, wd * r]);
  const arm = [...prof.map(([o, wd]) => along(o, 1, wd)), ...prof.slice().reverse().map(([o, wd]) => along(o, -1, wd))];
  const lit = prof.map(([o, wd]) => along(o, 1, wd * 0.55));
  const band = (o0: number, o1: number) => [along(o0, 1, halfW + 3), along(o1, 1, halfW + 5), along(o1, -1, halfW + 5), along(o0, -1, halfW + 3)];
  const pts = (a: number[][]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  // fingertips: where each finger disappears round his arm
  const tips = [[195, CUT + 30], [300, CUT + 14], [395, CUT + 16], [478, CUT + 40]].map(([x, y]) => toScreen(x, y + 30 * squeeze));
  const marks = prog(f, at + 2, 6, ease.out);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: prog(f, at - 6, 3, ease.linear) }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: "blur(2.2px)" }}>
        <defs>
          <linearGradient id="hx2-arm-unused" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform={`rotate(${rot} ${wrist[0]} ${wrist[1]})`}>
            <stop offset="0" stopColor="#B58F7E" />
            <stop offset="0.5" stopColor="#D2AE9C" />
            <stop offset="1" stopColor="#9C7767" />
          </linearGradient>
        </defs>
        <defs>
          <linearGradient id="hx2-armfade" gradientUnits="userSpaceOnUse" x1={wrist[0]} y1={wrist[1]} x2={wrist[0] + dir[0] * 330 * r} y2={wrist[1] + dir[1] * 330 * r}>
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.45" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <mask id="hx2-armmask" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
            <rect x={0} y={0} width={1080} height={1920} fill="url(#hx2-armfade)" />
          </mask>
          <filter id="hx2-skin" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.24  0 0 0 0.18 0" result="t" />
            <feComposite in="t" in2="SourceGraphic" operator="in" result="tt" />
            <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="tt" /></feMerge>
          </filter>
        </defs>
        <g mask="url(#hx2-armmask)" filter="url(#hx2-skin)">
        <polygon points={pts(arm)} fill="#B48D7B" />
        {/* the top of the forearm catches the arena light, the underside falls into shadow */}
        <polyline points={pts(lit)} fill="none" stroke="#D9B7A5" strokeWidth={26 * r} strokeLinecap="round" opacity={0.75} />
        <polyline points={pts(prof.map(([o, wd]) => along(o, -1, wd * 0.8)))} fill="none" stroke="#7E5D4F" strokeWidth={12} strokeLinecap="round" opacity={0.6} />
        </g>
        {/* the terry wristband */}
        <polygon points={pts(band(-6 * r, 34 * r))} fill="#F3F3F0" />
        {Array.from({ length: 9 }, (_, i) => {
          const o = (-4 + i * 4.4) * r;
          const a = [wrist[0] + dir[0] * o + nrm[0] * (halfW + 3), wrist[1] + dir[1] * o + nrm[1] * (halfW + 3)];
          const b = [wrist[0] + dir[0] * o - nrm[0] * (halfW + 3), wrist[1] + dir[1] * o - nrm[1] * (halfW + 3)];
          return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#C9CCD0" strokeWidth={1.3} />;
        })}
      </svg>
      {/* the photo hand, its fingertips cut where they curl behind his forearm */}
      <div style={{ position: "absolute", left: cx - HAND.cx, top: cy - HAND.cy, width: HAND.w, height: HAND.h, transformOrigin: `${HAND.cx}px ${HAND.cy}px`, transform: `rotate(${rot}deg) scale(${(k * (1 - 0.03 * squeeze)).toFixed(4)})` }}>
        <div style={{ position: "absolute", inset: 0, clipPath: `polygon(150px ${(CUT + 30 * squeeze).toFixed(0)}px, 600px ${(CUT + 30 * squeeze).toFixed(0)}px, 600px 823px, 240px 823px, 160px 600px, 150px 470px)` }}>
          <Img src={staticFile("shaq-free-throws/hookx2-hand-back.png")} style={{ width: HAND.w, height: HAND.h }} />
          {/* the curl: fingers darken as they turn away round the arm */}
          <div style={{ position: "absolute", left: 0, right: 0, top: CUT + 30 * squeeze, height: 90, background: "linear-gradient(180deg, rgba(40,20,12,0.55), rgba(40,20,12,0))", WebkitMaskImage: `url(${staticFile("shaq-free-throws/hookx2-hand-back.png")})`, WebkitMaskSize: `${HAND.w}px ${HAND.h}px`, WebkitMaskPosition: `0 ${-(CUT + 30 * squeeze)}px` }} />
        </div>
      </div>
      {/* red contact marks under the fingertips, and the jolt ring */}
      {marks > 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {tips.map(([x, y], i) => (
            <path key={i} d={`M${(x - 8).toFixed(1)},${(y - 3).toFixed(1)} q8,${(8 * marks).toFixed(1)} 16,0`} stroke={red} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.95} />
          ))}
          {f < at + 22 && (
            <circle cx={gx} cy={gy} r={30 + 140 * prog(f, at + 1, 20, ease.out)} fill="none" stroke={red} strokeWidth={6 * (1 - prog(f, at + 1, 20))} opacity={1 - prog(f, at + 1, 20)} />
          )}
        </svg>
      )}
    </div>
  );
};

/** a dry-erase marker, its felt tip at (x, y) */
export const HookX2Marker: React.FC<{ x: number; y: number; color: string; angle: number; o: number; cap: boolean; capFly?: number }> = ({ x, y, color, angle, o, cap, capFly = -1 }) => {
  const L = 250, D = 34;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, transform: `rotate(${angle}deg)`, opacity: o, filter: "drop-shadow(10px 18px 14px rgba(0,0,0,0.5))" }}>
      {/* the chisel tip, the collar, the barrel with its band, the cap posted on the end */}
      <div style={{ position: "absolute", left: 0, top: -6, width: 18, height: 12, background: color, clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0 65%)" }} />
      <div style={{ position: "absolute", left: 16, top: -10, width: 22, height: 20, borderRadius: 3, background: "linear-gradient(180deg, #9EA4AB, #5C6168 60%, #3B3F44)" }} />
      <div style={{ position: "absolute", left: 36, top: -D / 2, width: L - 36, height: D, borderRadius: "6px 14px 14px 6px", background: "linear-gradient(180deg, #4A4E55 0%, #2A2D32 35%, #111316 100%)" }} />
      <div style={{ position: "absolute", left: 70, top: -D / 2, width: 70, height: D, background: `linear-gradient(180deg, ${color}, ${color} 40%, rgba(0,0,0,0.45))`, opacity: 0.95 }} />
      <div style={{ position: "absolute", left: 44, top: -D / 2 + 4, width: L - 60, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.28)" }} />
      <div style={{ position: "absolute", left: L - 4, top: -D / 2 - 2, width: 46, height: D + 4, borderRadius: "4px 12px 12px 4px", background: `linear-gradient(180deg, ${color}, rgba(0,0,0,0.5))` }} />
      {(cap || capFly >= 0) && (
        <div
          style={{
            position: "absolute", left: -20, top: -D / 2 - 3, width: 64, height: D + 6, borderRadius: "14px 4px 4px 14px",
            background: `linear-gradient(180deg, ${color}, rgba(0,0,0,0.55))`,
            transform: capFly >= 0 ? `translate(${(-14 * capFly).toFixed(1)}px, ${(-26 * capFly + 1.1 * capFly * capFly).toFixed(1)}px) rotate(${(-28 * capFly).toFixed(0)}deg)` : undefined,
            opacity: capFly >= 0 ? Math.max(0, 1 - capFly / 30) : 1,
          }}
        >
          <div style={{ position: "absolute", left: 8, top: 4, width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.35)" }} />
        </div>
      )}
    </div>
  );
};

/** the referee's whistle: a chrome pea whistle on a lanyard, the classic NBA referee's, buzzing */
export const HookX2Whistle: React.FC<{ f: number }> = ({ f }) => {
  const buzz = Math.sin(f * 2.4) * 2.4 * Math.exp(-f / 30);
  return (
    <svg width={260} height={160} style={{ overflow: "visible", transform: `translateX(${buzz.toFixed(1)}px) rotate(-12deg)` }}>
      <defs>
        <linearGradient id="hx2-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.22" stopColor="#C9D0D8" />
          <stop offset="0.5" stopColor="#6E7782" />
          <stop offset="0.72" stopColor="#D5DBE2" />
          <stop offset="1" stopColor="#59616B" />
        </linearGradient>
        <linearGradient id="hx2-chrome2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9EDF1" />
          <stop offset="0.5" stopColor="#7A838E" />
          <stop offset="1" stopColor="#B5BDC6" />
        </linearGradient>
      </defs>
      {/* the black lanyard */}
      <path d="M58,74 C30,40 -10,30 -48,6" stroke="#121417" strokeWidth={7} fill="none" />
      <path d="M58,74 C40,58 6,56 -30,48" stroke="#1B1E22" strokeWidth={6} fill="none" />
      <circle cx={62} cy={78} r={12} fill="none" stroke="url(#hx2-chrome2)" strokeWidth={5} />
      {/* the round chamber, the slot on top, the flat mouthpiece */}
      <circle cx={112} cy={96} r={42} fill="url(#hx2-chrome)" stroke="#3E454E" strokeWidth={2} />
      <path d="M112,54 L210,62 C216,62 220,66 220,72 L220,90 C220,95 216,98 210,98 L140,102 Z" fill="url(#hx2-chrome)" stroke="#3E454E" strokeWidth={2} />
      <path d="M120,60 L160,63 L160,72 L122,70 Z" fill="#1D2126" />
      <ellipse cx={98} cy={78} rx={16} ry={7} fill="#FFFFFF" opacity={0.7} />
      <path d="M220,72 L224,72 L224,90 L220,90 Z" fill="#2B3036" />
      {/* the sound, drawn */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${232 + i * 16},${54 - i * 6} q14,${16 + i * 6} 0,${36 + i * 12}`} stroke="#F4F1EA" strokeWidth={5} strokeLinecap="round" fill="none" opacity={Math.max(0, Math.sin((f - i * 3) * 0.35)) * Math.exp(-f / 40)} />
      ))}
    </svg>
  );
};
