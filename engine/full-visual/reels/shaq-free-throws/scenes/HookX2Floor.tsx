// Hook B's court, from behind the shooter (HookX2World camera): the Lakers' maple and gold lane at Rule 1 geometry,
// 2 in white lines, the free throw circle solid toward the shooter and dashed inside the lane, lane space marks, the
// stanchion pad behind the baseline and the stands rising in the dark with points of light. A slow light crosses
// the boards. Everything is projected for real, so the clipboard's print can land exactly on these lines.
import React from "react";
import { HookX2CAM, hookX2P, hookX2Rnd } from "./HookX2World";

const P = hookX2P;
const pts = (a: [number, number, number][]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
const poly = (xy: [number, number][], z = 0) => pts(xy.map(([x, y]) => P(x, y, z)));

/** a 2 in painted line from a to b on the floor */
function hookX2FloorLine(ax: number, ay: number, bx: number, by: number, w = 2 / 12) {
  const l = Math.hypot(bx - ax, by - ay) || 1;
  const nx = (-(by - ay) / l) * (w / 2);
  const ny = ((bx - ax) / l) * (w / 2);
  return poly([[ax + nx, ay + ny], [bx + nx, by + ny], [bx - nx, by - ny], [ax - nx, ay - ny]]);
}
/** a 2 in painted arc as a band */
function hookX2FloorArc(cx: number, cy: number, r: number, a0: number, a1: number, n = 48, w = 2 / 12) {
  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    outer.push([cx + (r + w / 2) * Math.cos(a), cy + (r + w / 2) * Math.sin(a)]);
    inner.push([cx + (r - w / 2) * Math.cos(a), cy + (r - w / 2) * Math.sin(a)]);
  }
  return poly([...outer, ...inner.reverse()]);
}

// the maple: strips 2.25 in wide running baseline to half court, each its own tone; butt joints staggered along them
const HookX2STRIPS = (() => {
  const out: { x: number; tone: number }[] = [];
  for (let x = -30; x < 30; x += 0.1875) out.push({ x, tone: hookX2Rnd(Math.round(x * 100), 3) });
  return out;
})();
const HookX2JOINTS = Array.from({ length: 900 }, (_, i) => ({
  x: -30 + Math.floor(hookX2Rnd(i, 5) * 320) * 0.1875,
  y: -12 + hookX2Rnd(i, 6) * 35.5,
}));
// the stands: raked rows of seated fans behind the baseline (heads and shoulders in Lakers purple, gold, white and
// dark), faint, and points of light from phones and camera flashes
const HookX2SHIRTS = ["#3B2A5C", "#5B3F86", "#8C6A1E", "#C9C2B4", "#2A2D33", "#1F2430", "#6B2A2A", "#3E4A5E"];
const HookX2FANS = (() => {
  const out: { x: number; y: number; z: number; c: string; skin: string; lean: number }[] = [];
  for (let row = 0; row < 16; row++) {
    for (let k = 0; k < 52; k++) {
      const i = row * 100 + k;
      if (hookX2Rnd(i, 30) < 0.12) continue; // an empty seat
      out.push({
        x: -47 + k * 1.82 + (hookX2Rnd(i, 31) - 0.5) * 0.5, y: -13.2 - row * 2.8, z: 1.35 + row * 1.5,
        c: HookX2SHIRTS[Math.floor(hookX2Rnd(i, 32) * HookX2SHIRTS.length)], skin: ["#5A3A2A", "#8A6248", "#C49A7C", "#3E281C"][Math.floor(hookX2Rnd(i, 33) * 4)],
        lean: (hookX2Rnd(i, 34) - 0.5) * 0.3,
      });
    }
  }
  return out.reverse(); // back rows first
})();
const HookX2CROWD = Array.from({ length: 260 }, (_, i) => {
  const row = Math.floor(hookX2Rnd(i, 8) * 16);
  return { x: -46 + hookX2Rnd(i, 9) * 92, y: -13.2 - row * 2.8, z: 2.6 + row * 1.5, warm: hookX2Rnd(i, 11) > 0.42, a: 0.15 + 0.45 * hookX2Rnd(i, 12), ph: hookX2Rnd(i, 13) * 6.28 };
});

export const HookX2Floor: React.FC<{ f: number; handover: number }> = ({ f, handover }) => {
  const near = Math.min(24, HookX2CAM.Y - 1.2); // the floor stops in front of the lens

  const lanePoly = poly([[-8, -5.25], [8, -5.25], [8, 13.75], [-8, 13.75]]);
  // the dashed half of the circle (inside the lane): 16 dashes as the floor paints them
  const dashes: React.ReactNode[] = [];
  for (let i = 0; i < 16; i++) {
    const a0 = Math.PI + (i / 16) * Math.PI + 0.03;
    const a1 = a0 + (Math.PI / 16) * 0.55;
    dashes.push(<polygon key={i} points={hookX2FloorArc(0, 13.92, 6, a0, a1, 4)} fill="#F4F1EA" />);
  }
  const marks = [7, 8, 11, 14].flatMap((d) => [-1, 1].map((s) => hookX2FloorLine(s * 8, -5.25 + d, s * 8.67, -5.25 + d, 2 / 12)));
  const block = [-1, 1].map((s) => poly([[s * 8, 1.75], [s * 8.67, 1.75], [s * 8.67, 2.75], [s * 8, 2.75]]));
  const sweep = -26 + ((f + 40) % 420) * 0.13; // the light crossing the boards, in feet along x
  const sw = P(sweep, 6, 0);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, WebkitMaskImage: "linear-gradient(180deg, transparent 468px, black 545px)" }}>
      <defs>
        <linearGradient id="hx2-bowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0D1117" />
          <stop offset="0.55" stopColor="#121A26" />
          <stop offset="1" stopColor="#1A2433" />
        </linearGradient>
        <linearGradient id="hx2-maple" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5E3A1C" />
          <stop offset="0.3" stopColor="#9C6534" />
          <stop offset="1" stopColor="#D9A267" />
        </linearGradient>
        <linearGradient id="hx2-lane" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B07A12" />
          <stop offset="0.5" stopColor="#E3A51E" />
          <stop offset="1" stopColor="#FDB927" />
        </linearGradient>
        <radialGradient id="hx2-sweep">
          <stop offset="0" stopColor="#FFF6E2" stopOpacity={0.32} />
          <stop offset="1" stopColor="#FFF6E2" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="hx2-pool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE9C0" stopOpacity={0.22} />
          <stop offset="1" stopColor="#FFE9C0" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="hx2-top2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0D1117" />
          <stop offset="1" stopColor="#0D1117" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="hx2-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0D1117" />
          <stop offset="1" stopColor="#0D1117" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* the bowl */}
      <rect x={0} y={470} width={1080} height={530} fill="url(#hx2-bowl)" />
      <g opacity={0.62 * (1 - handover)}>
        {HookX2FANS.map((p, i) => {
          const [x, y, d] = P(p.x, p.y, p.z);
          if (y < 440 || y > 880 || x < -40 || x > 1120) return null;
          const u = 1681 / d;
          const sway = Math.sin(f / 31 + i) * 0.04 * u;
          return (
            <g key={i}>
              <ellipse cx={x + sway} cy={y - 0.55 * u} rx={0.78 * u} ry={0.62 * u} fill={p.c} />
              <ellipse cx={x + sway + p.lean * u} cy={y - 1.55 * u} rx={0.3 * u} ry={0.37 * u} fill={p.skin} />
            </g>
          );
        })}
      </g>
      {/* the dark falling over the upper rows */}
      <rect x={0} y={440} width={1080} height={260} fill="url(#hx2-top2)" />
      {HookX2CROWD.map((c, i) => {
        const [x, y, d] = P(c.x, c.y, c.z);
        if (y < 470 || y > 860) return null;
        const flash = hookX2Rnd(Math.floor((f + i * 7) / 9), i) > 0.992 ? 1 : 0;
        const r = (0.9 + 18 / d) * (flash ? 3 : 1);
        const a = flash ? 0.95 : c.a * (0.75 + 0.25 * Math.sin(f / 23 + c.ph));
        return <circle key={i} cx={x} cy={y} r={r} fill={flash ? "#FFFFFF" : c.warm ? "#F2D7B0" : "#A9BCD6"} opacity={a} />;
      })}
      {/* the baseline LED board and the stanchion pad, dark against the floor */}
      <polygon points={poly([[-40, -12.2], [40, -12.2], [40, -12.2], [-40, -12.2]])} fill="#000" />
      <polygon points={pts([P(-40, -12.2, 0), P(40, -12.2, 0), P(40, -12.2, 2.6), P(-40, -12.2, 2.6)])} fill="#0B1320" />
      <polygon points={pts([P(-40, -12.2, 0), P(40, -12.2, 0), P(40, -12.2, 2.6), P(-40, -12.2, 2.6)])} fill="#552583" opacity={0.35} />
      <polygon points={pts([P(-40, -12.2, 0.0), P(40, -12.2, 0.0), P(40, -12.2, 0.2), P(-40, -12.2, 0.2)])} fill="#FDB927" opacity={0.55} />
      {/* the floor */}
      <polygon points={poly([[-40, -12.2], [40, -12.2], [40, near], [-40, near]])} fill="url(#hx2-maple)" />
      {HookX2STRIPS.map((s, i) => {
        if (i % 2) return null;
        const t = s.tone;
        return <polygon key={i} points={poly([[s.x, -12.2], [s.x + 0.1875, -12.2], [s.x + 0.1875, near], [s.x, near]])} fill={t > 0.5 ? "#FFE2B0" : "#4A2A10"} opacity={0.05 + 0.07 * Math.abs(t - 0.5)} />;
      })}
      {HookX2STRIPS.map((s, i) => {
        const a = P(s.x, -12.2, 0);
        const b = P(s.x, near, 0);
        return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(55,28,8,0.32)" strokeWidth={0.8} />;
      })}
      {HookX2JOINTS.map((j, i) => {
        if (j.y > near) return null;
        const a = P(j.x, j.y, 0);
        const b = P(j.x + 0.1875, j.y, 0);
        return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(55,28,8,0.4)" strokeWidth={0.8} />;
      })}
      {/* the painted lane: Lakers gold, its gloss and wear */}
      <polygon points={lanePoly} fill="url(#hx2-lane)" />
      <polygon points={poly([[-6.5, 4], [6.5, 4], [7.5, 13.5], [-7.5, 13.5]])} fill="#FFF3D0" opacity={0.08} />
      {Array.from({ length: 40 }, (_, i) => {
        const [x, y] = P(-7 + hookX2Rnd(i, 21) * 14, -4 + hookX2Rnd(i, 22) * 17, 0);
        return <ellipse key={i} cx={x} cy={y} rx={6 + 16 * hookX2Rnd(i, 23)} ry={1.5 + 3 * hookX2Rnd(i, 24)} fill="#6B4A14" opacity={0.08} />;
      })}
      {/* the lines */}
      <g fill="#F4F1EA">
        <polygon points={hookX2FloorLine(-40, -5.25, 40, -5.25)} />
        <polygon points={hookX2FloorLine(-8, -5.25, -8, 13.92)} />
        <polygon points={hookX2FloorLine(8, -5.25, 8, 13.92)} />
        <polygon points={poly([[-8, 13.75], [8, 13.75], [8, 13.92], [-8, 13.92]])} />
        <polygon points={hookX2FloorArc(0, 13.92, 6, 0, Math.PI)} />
        {dashes}
        <polygon points={hookX2FloorArc(0, 0, 4, 0, Math.PI, 30)} />
        {marks.map((m, i) => <polygon key={i} points={m} />)}
        {block.map((m, i) => <polygon key={`b${i}`} points={m} />)}
        <polygon points={hookX2FloorLine(-22, -5.25, -22, 8.95)} />
        <polygon points={hookX2FloorLine(22, -5.25, 22, 8.95)} />
        {/* the three-point arc, cut where it would pass behind the lens as the camera dollies in */}
        {(() => {
          const top = (near - 0.4) / 23.75;
          if (top >= 1) return <polygon points={hookX2FloorArc(0, 0, 23.75, 0.385, Math.PI - 0.385, 80)} />;
          const am = Math.asin(Math.max(0.2, top));
          return (
            <>
              <polygon points={hookX2FloorArc(0, 0, 23.75, 0.385, am, 40)} />
              <polygon points={hookX2FloorArc(0, 0, 23.75, Math.PI - am, Math.PI - 0.385, 40)} />
            </>
          );
        })()}
      </g>
      {/* the stanchion's padded base behind the baseline */}
      <polygon points={pts([P(-2.2, -9.4, 0), P(2.2, -9.4, 0), P(2.2, -9.4, 3.2), P(-2.2, -9.4, 3.2)])} fill="#14181F" />
      <polygon points={pts([P(-2.2, -9.4, 3.2), P(2.2, -9.4, 3.2), P(2.2, -12, 3.2), P(-2.2, -12, 3.2)])} fill="#262D38" />
      {/* the basket: stanchion, glass board with its shooter's square, the orange ring and the net */}
      {(() => {
        const ring = Array.from({ length: 41 }, (_, i) => P(0.75 * Math.cos((i / 40) * Math.PI * 2), 0.75 * Math.sin((i / 40) * Math.PI * 2), 10));
        const stan = P(0, -6.5, 0);
        const base = P(0, -1.25, 9.5);
        return (
          <g>
            <line x1={stan[0]} y1={stan[1]} x2={base[0]} y2={base[1] + 6} stroke="#2A3240" strokeWidth={10} />
            <polygon points={pts([P(-3, -1.25, 9.5), P(3, -1.25, 9.5), P(3, -1.25, 13), P(-3, -1.25, 13)])} fill="rgba(200,220,255,0.10)" stroke="#E9EEF5" strokeWidth={4} />
            <polygon points={pts([P(-1, -1.25, 10), P(1, -1.25, 10), P(1, -1.25, 11.5), P(-1, -1.25, 11.5)])} fill="none" stroke="#E9EEF5" strokeWidth={2.5} />
            {Array.from({ length: 12 }, (_, i) => {
              const t = (i / 12) * Math.PI * 2;
              const a = P(0.75 * Math.cos(t), 0.75 * Math.sin(t), 10);
              const b = P(0.45 * Math.cos(t + 0.5), 0.45 * Math.sin(t + 0.5), 8.5);
              const c = P(0.45 * Math.cos(t - 0.5), 0.45 * Math.sin(t - 0.5), 8.5);
              return (
                <g key={i}>
                  <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(255,255,255,0.7)" strokeWidth={1.2} />
                  <line x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />
                </g>
              );
            })}
            <polyline points={pts(ring)} fill="none" stroke="#E2531B" strokeWidth={4.5} />
          </g>
        );
      })()}
      {/* the light crossing the boards, and the pool under the line */}
      <ellipse cx={sw[0]} cy={sw[1] + 60} rx={260} ry={60} fill="url(#hx2-sweep)" style={{ mixBlendMode: "screen" }} />
      <ellipse cx={540} cy={1300} rx={520} ry={150} fill="url(#hx2-pool)" style={{ mixBlendMode: "screen" }} />
      {/* the scorebug court opens a touch dimmer: match it as the camera arrives */}
      {handover > 0 && <rect x={0} y={0} width={1080} height={1920} fill="#000" opacity={0.05 * handover} />}
      {/* the stage's top edge stays the reel's navy under the caption */}
      <rect x={0} y={470} width={1080} height={110} fill="url(#hx2-top)" />
    </svg>
  );
};
