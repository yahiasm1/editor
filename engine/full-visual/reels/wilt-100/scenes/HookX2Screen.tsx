// wilt-100 hook variant 2: what the TK-41's viewfinder shows, and the flip panel. The tube's picture is drawn in
// HX2_CRT units (520 x 390) and mapped onto the glass by HookX2Camera. Real tube behaviour: the vertical hold rolls,
// then locks; a lens change on the turret blanks and smears the picture; a bright frame blooms the raster; failing
// power makes it tear and shrink; switched off, the raster collapses to a line, then to a dot.
import React from "react";
import { Img, staticFile } from "remotion";
import { ease, prog } from "../../../src/engine";
import { HX2_CRT } from "./HookX2Camera";
import { HX2_DIM, HX2_OSWALD, type HX2T, hx2Clamp, hx2Rnd } from "./HookX2Kit";

// ---------- the flip panel (the reel's thread counter) ----------
export const HX2_FLAP = { w: 66, h: 96, gap: 8 };

/** the panel's value over time: 0, 23, 41, 69 inside the first second, a riffle on "scored", 100 on "100" */
export function hx2PanelSteps(T: HX2T): { at: number; v: number; dur: number }[] {
  const r = T.scored;
  const h = T.hundred;
  return [
    { at: -99, v: 0, dur: 6 },
    { at: 3, v: 23, dur: 6 },
    { at: Math.max(14, T.chamberlain - 4), v: 41, dur: 6 },
    { at: T.chamberlain + 12, v: 69, dur: 6 },
    { at: r, v: 76, dur: 4 },
    { at: r + 4, v: 83, dur: 4 },
    { at: r + 8, v: 88, dur: 4 },
    { at: r + 12, v: 94, dur: 4 },
    { at: Math.min(h - 5, r + 16), v: 97, dur: 4 },
    { at: h - 2, v: 100, dur: 4 },
  ];
}
const digitsOf = (v: number) => String(v).padStart(3, " ").split("");

/** one flap of the panel: the old digit's top half falls over its hinge, the new digit's bottom half lands */
const Flap: React.FC<{ from: string; to: string; k: number; font: string; mono?: boolean }> = ({ from, to, k, font }) => {
  const { w, h } = HX2_FLAP;
  const face = (d: string, half: "top" | "bot") => (
    <div style={{ position: "absolute", left: 0, top: half === "top" ? 0 : h / 2, width: w, height: h / 2, overflow: "hidden", borderRadius: half === "top" ? "7px 7px 0 0" : "0 0 7px 7px", background: half === "top" ? "linear-gradient(#1E2024, #111215)" : "linear-gradient(#050506, #15161A)" }}>
      <div style={{ position: "absolute", left: 0, top: half === "top" ? 0 : -h / 2, width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, fontWeight: 700, fontSize: 78, color: "#F4F4F2", lineHeight: 1 }}>{d.trim()}</div>
    </div>
  );
  const a = hx2Clamp(k * 2); // the old top falling
  const b = hx2Clamp(k * 2 - 1); // the new bottom landing
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {face(k > 0 ? to : from, "top")}
      {face(b >= 1 || k >= 1 ? to : from, "bot")}
      {k > 0 && k < 1 && a < 1 && (
        <div style={{ position: "absolute", inset: 0, transform: `scaleY(${(1 - a).toFixed(3)})`, transformOrigin: `50% ${h / 2}px`, filter: `brightness(${(1 - 0.5 * a).toFixed(2)})` }}>{face(from, "top")}</div>
      )}
      {k > 0 && k < 1 && a >= 1 && (
        <div style={{ position: "absolute", inset: 0, transform: `scaleY(${b.toFixed(3)})`, transformOrigin: `50% ${h / 2}px`, filter: `brightness(${(0.5 + 0.5 * b).toFixed(2)})` }}>{face(to, "bot")}</div>
      )}
    </div>
  );
};

/** the panel, exactly as `hershey` draws it at the hand-off (three flaps, a grey WILT above), with live flips */
export const HookX2Panel: React.FC<{ f: number; T: HX2T; label?: string; points?: number }> = ({ f, T, label = "WILT", points = 0 }) => {
  const steps = hx2PanelSteps(T);
  let i = 0;
  while (i + 1 < steps.length && f >= steps[i + 1].at) i++;
  const cur = steps[i];
  const prev = steps[Math.max(0, i - 1)];
  const k = i === 0 ? 1 : hx2Clamp((f - cur.at) / cur.dur);
  const dFrom = digitsOf(prev.v), dTo = digitsOf(cur.v);
  const { w, h, gap } = HX2_FLAP;
  const W = 3 * w + 2 * gap;
  return (
    <div style={{ position: "relative", width: W, height: h }}>
      <div style={{ position: "absolute", left: 0, top: -44, width: W, textAlign: "center", fontFamily: HX2_OSWALD, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: HX2_DIM }}>{label}</div>
      {dTo.map((d, j) => {
        const changing = dFrom[j] !== d;
        return (
          <div key={j} style={{ position: "absolute", left: j * (w + gap), top: 0, width: w, height: h, borderRadius: 7, background: "linear-gradient(#1E2024 0%, #111215 49%, #050506 51%, #15161A 100%)", boxShadow: "0 6px 14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <Flap from={dFrom[j]} to={d} k={changing ? k : 1} font={HX2_OSWALD} />
            <div style={{ position: "absolute", left: 0, right: 0, top: h / 2 - 1, height: 2, background: "#000" }} />
            <div style={{ position: "absolute", left: 2, top: h / 2 - 4, width: 4, height: 8, borderRadius: 2, background: "#3A3C40" }} />
            <div style={{ position: "absolute", right: 2, top: h / 2 - 4, width: 4, height: 8, borderRadius: 2, background: "#3A3C40" }} />
          </div>
        );
      })}
      {points > 0 && (
        <div style={{ position: "absolute", left: 0, top: h + 10, width: W, textAlign: "center", fontFamily: HX2_OSWALD, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: "#C9CDD1", clipPath: `inset(0 ${((1 - points) * 100).toFixed(1)}% 0 0)` }}>POINTS</div>
      )}
    </div>
  );
};

/** the same panel drawn in SVG, for inside the tube's picture */
export const HookX2SvgPanel: React.FC<{ f: number; T: HX2T; points?: number }> = ({ f, T, points = 0 }) => {
  const steps = hx2PanelSteps(T);
  let i = 0;
  while (i + 1 < steps.length && f >= steps[i + 1].at) i++;
  const cur = steps[i];
  const prev = steps[Math.max(0, i - 1)];
  const k = i === 0 ? 1 : hx2Clamp((f - cur.at) / cur.dur);
  const dFrom = digitsOf(prev.v), dTo = digitsOf(cur.v);
  const { w, h, gap } = HX2_FLAP;
  const W = 3 * w + 2 * gap;
  const half = (d: string, which: "top" | "bot") => (
    <g clipPath={`url(#hx2-flap-${which})`}>
      <rect x={0} y={0} width={w} height={h} rx={7} fill={which === "top" ? "#1A1C1F" : "#0B0C0E"} />
      <text x={w / 2} y={h / 2 + 2} textAnchor="middle" dominantBaseline="central" fontFamily={HX2_OSWALD} fontWeight={700} fontSize={78} fill="#F4F4F2">{d.trim()}</text>
    </g>
  );
  return (
    <g>
      <defs>
        <clipPath id="hx2-flap-top"><rect x={0} y={0} width={w} height={h / 2} /></clipPath>
        <clipPath id="hx2-flap-bot"><rect x={0} y={h / 2} width={w} height={h / 2} /></clipPath>
      </defs>
      <text x={W / 2} y={-18} textAnchor="middle" fontFamily={HX2_OSWALD} fontWeight={600} fontSize={30} letterSpacing={6} fill="#B9BDC1">WILT</text>
      {dTo.map((d, j) => {
        const from = dFrom[j];
        const kk = from !== d ? k : 1;
        const a = hx2Clamp(kk * 2), b = hx2Clamp(kk * 2 - 1);
        return (
          <g key={j} transform={`translate(${j * (w + gap)} 0)`}>
            {half(kk > 0 ? d : from, "top")}
            {half(kk >= 1 ? d : from, "bot")}
            {kk > 0 && kk < 1 && a < 1 && <g transform={`translate(0 ${h / 2}) scale(1 ${(1 - a).toFixed(3)}) translate(0 ${-h / 2})`}>{half(from, "top")}</g>}
            {kk > 0 && kk < 1 && a >= 1 && <g transform={`translate(0 ${h / 2}) scale(1 ${b.toFixed(3)}) translate(0 ${-h / 2})`}>{half(d, "bot")}</g>}
            <rect x={0} y={h / 2 - 1} width={w} height={2} fill="#000" />
          </g>
        );
      })}
      {points > 0 && (
        <text x={W / 2} y={h + 40} textAnchor="middle" fontFamily={HX2_OSWALD} fontWeight={600} fontSize={30} letterSpacing={8} fill="#E2E4E6">{"POINTS".slice(0, Math.ceil(points * 6))}</text>
      )}
    </g>
  );
};

// ---------- the tube's picture ----------
export type HX2ScreenState = {
  /** 0..1: the collapse to a line (vertical), then to a dot (horizontal) */
  offV: number;
  offH: number;
};

export const HookX2Screen: React.FC<{ f: number; T: HX2T; off: HX2ScreenState }> = ({ f, T, off }) => {
  const { W, H } = HX2_CRT;
  // vertical hold: the raster rolls, then locks on "Wilt"
  const lock = T.wilt + 4;
  const rollAmt = f >= lock ? 0 : (1 - prog(f, -30, lock + 30, ease.out)) * 2.2 + 0.0;
  const settle = f >= lock ? 0.02 * Math.exp(-(f - lock) / 4) * Math.sin((f - lock) * 1.3) : 0;
  const roll = ((rollAmt % 1) + 1) % 1 + settle;
  // the turret: a lens change on "Chamberlain" blanks and smears the picture, which comes back tighter
  const c = T.chamberlain;
  const blank = Math.sin(Math.PI * hx2Clamp((f - (c - 2)) / 12));
  const zoom = 1 + 0.34 * prog(f, c + 3, 8, ease.outHard) + 0.04 * prog(f, c + 3, 160, ease.linear);
  // the "100" frame blooms (the raster also swells a little as the high voltage sags)
  const bloom = f >= T.hundred - 1 && f < T.hundred + 3 ? 1 - (f - (T.hundred - 1)) / 4 : 0;
  // failing power from "almost": tearing, shrinking, dimming
  const fail = prog(f, T.almost - 4, T.nobody - T.almost + 8, ease.in);
  const flick = 0.93 + 0.07 * hx2Rnd(f, 5) - fail * 0.35 * hx2Rnd(f, 9);
  const shrink = 1 - 0.06 * fail;
  const bright = flick * (1 + 0.9 * bloom) * (1 - 0.75 * blank);
  // the picture group: the photo (zoomed on his face), the panel, POINTS
  const face = { x: 0.52 * W, y: 0.38 * H };
  const photo = (dy: number, key: string) => (
    <g key={key} transform={`translate(0 ${dy.toFixed(1)})`}>
      <g transform={`translate(${face.x} ${face.y}) scale(${zoom.toFixed(4)}) translate(${-face.x} ${-face.y})`}>
        <image href={staticFile("wilt-100/hookx2-wilt-1962.jpg")} x={-64} y={0} width={W + 64} height={H} preserveAspectRatio="xMidYMin slice" />
      </g>
    </g>
  );
  const pts = prog(f, T.points - 2, 12, ease.linear);
  const tears = fail > 0.02 ? 7 : 0;
  const body = (
    <g>
      {photo(roll * H, "a")}
      {roll > 0.001 && photo(roll * H - H, "b")}
      {roll > 0.001 && <rect x={0} y={roll * H - 14} width={W} height={20} fill="#000" />}
      <g transform="translate(44 100) scale(0.7)">
        <rect x={-16} y={-56} width={246} height={pts > 0 ? 210 : 168} rx={10} fill="#0A0B0C" stroke="#33373C" strokeWidth={3} />
        <HookX2SvgPanel f={f} T={T} points={pts} />
      </g>
    </g>
  );
  const sx = 1 - off.offH * 0.985;
  const sy = 1 - off.offV * 0.992;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="#0C0E0D" />
      <g transform={`translate(${W / 2} ${H / 2}) scale(${(sx * shrink).toFixed(4)} ${(sy * shrink).toFixed(4)}) translate(${-W / 2} ${-H / 2})`}>
        <defs>
          <filter id="hx2-pic" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={(() => {
              const b = bright * 1.08, o = -0.04 * bright;
              const r = 0.299 * b, g = 0.587 * b, bl = 0.114 * b;
              return `${r} ${g} ${bl} 0 ${o}  ${r} ${g} ${bl} 0 ${o}  ${r} ${g} ${bl} 0 ${o}  0 0 0 1 0`;
            })()} />
            <feGaussianBlur stdDeviation={`${(blank * 6 + 0.4).toFixed(2)} ${(blank * 2 + 0.3).toFixed(2)}`} />
          </filter>
        </defs>
        <g filter="url(#hx2-pic)">
          {tears === 0 ? body : Array.from({ length: tears }, (_, i) => (
            <g key={i} clipPath={`url(#hx2-band${i})`} transform={`translate(${(Math.sin(f * 0.9 + i * 1.7) * 26 * fail * (0.4 + hx2Rnd(i, f % 7))).toFixed(1)} 0)`}>{body}</g>
          ))}
        </g>
        {/* the phosphor: a faint warm-white cast and the scan lines */}
        <rect x={0} y={0} width={W} height={H} fill="#F3EEDF" opacity={0.05} />
        <rect x={0} y={0} width={W} height={H} fill="url(#hx2-scan)" />
        {/* the collapsing raster goes white-hot */}
        <rect x={0} y={0} width={W} height={H} fill="#FFFFFF" opacity={Math.min(1, off.offV * 1.1)} />
      </g>
      {/* the tube's own glow, brighter at the centre */}
      <rect x={0} y={0} width={W} height={H} fill="url(#hx2-phos)" opacity={(1 - off.offV) * 0.5 * bright} />
    </g>
  );
};

/** defs the picture uses: scan lines, the phosphor glow, the tear bands */
export const HookX2ScreenDefs: React.FC = () => (
  <defs>
    <pattern id="hx2-scan" width={8} height={4} patternUnits="userSpaceOnUse">
      <rect width={8} height={1.6} fill="#000" opacity={0.42} />
    </pattern>
    <radialGradient id="hx2-phos" cx="0.5" cy="0.5" r="0.6">
      <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </radialGradient>
    {Array.from({ length: 7 }, (_, i) => (
      <clipPath key={i} id={`hx2-band${i}`}>
        <rect x={-60} y={(i * HX2_CRT.H) / 7} width={HX2_CRT.W + 120} height={HX2_CRT.H / 7 + 1} />
      </clipPath>
    ))}
  </defs>
);
