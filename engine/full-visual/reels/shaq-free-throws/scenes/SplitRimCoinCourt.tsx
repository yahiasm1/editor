// The Lakers free throw line seen from behind the shooter, the reel's COURT, at the plan's coordinates (feet; origin
// the rim centre, +y away from the baseline). Camera 6 ft up, 8 ft behind the line, looking at the basket: the same
// projection `backwards` uses (rim y 942, line y 1344), so the court carries straight over.
import React from "react";

export const SplitRimCoinCAM = { F: 431, H: 1021, cx: 540, camY: 21.92, camZ: 6 };

export function SplitRimCoinProject(x: number, y: number, z = 0) {
  const d = SplitRimCoinCAM.camY - y;
  return { X: SplitRimCoinCAM.cx + (SplitRimCoinCAM.F * x) / d, Y: SplitRimCoinCAM.H + (SplitRimCoinCAM.F * (SplitRimCoinCAM.camZ - z)) / d, d };
}

const P = SplitRimCoinProject;
const pts = (a: [number, number, number?][]) => a.map(([x, y, z]) => { const p = P(x, y, z ?? 0); return `${p.X.toFixed(1)},${p.Y.toFixed(1)}`; }).join(" ");

/** a seeded random in 0..1 */
export const SplitRimCoinRnd = (i: number, k = 1) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const NEAR = 21.2; // the nearest floor drawn (just in front of the camera's feet)

/** circle of radius r around (cx, cy) on the floor, from angle a0 to a1 (radians, 0 = +x) */
function arc(cx: number, cy: number, r: number, a0: number, a1: number, n = 40) {
  const out: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    const p = P(cx + r * Math.cos(a), cy + r * Math.sin(a));
    out.push(`${p.X.toFixed(1)},${p.Y.toFixed(1)}`);
  }
  return out.join(" ");
}

export const SplitRimCoinCourt: React.FC<{ f: number; id: string; sweep?: number; stands?: number }> = ({ f, id, sweep = 0, stands = 1 }) => {
  const W = 27; // half-width of the floor drawn
  const LINE = "#F4F1EA";
  // boards run baseline to half court: lines of constant x
  const boards: React.ReactNode[] = [];
  for (let i = -W * 4; i <= W * 4; i++) {
    const x = i / 4; // 3 in boards
    const a = P(x, -5.25), b = P(x, NEAR);
    const tone = SplitRimCoinRnd(i, 3);
    boards.push(<line key={i} x1={a.X} y1={a.Y} x2={b.X} y2={b.Y} stroke={tone > 0.5 ? "#6B4422" : "#F7D9A6"} strokeOpacity={0.06 + 0.12 * tone} strokeWidth={Math.max(0.6, 431 / (NEAR - 4) / 16)} />);
  }
  // board ends (butt joints): short dark ticks at random depths
  const joints: React.ReactNode[] = [];
  for (let i = 0; i < 160; i++) {
    const x = Math.round((SplitRimCoinRnd(i, 7) * 2 - 1) * W * 4) / 4;
    const y = -5 + SplitRimCoinRnd(i, 9) * (NEAR + 4);
    const a = P(x, y), b = P(x + 0.25, y);
    joints.push(<line key={i} x1={a.X} y1={a.Y} x2={b.X} y2={b.Y} stroke="#4A2C14" strokeOpacity={0.35} strokeWidth={0.8} />);
  }
  // the stands: tiers of seats behind the basket, small warm points
  const seats: React.ReactNode[] = [];
  for (let i = 0; i < 520; i++) {
    const row = Math.floor(SplitRimCoinRnd(i, 11) * 14);
    const y = 560 + row * 30 + SplitRimCoinRnd(i, 12) * 8;
    const x = -40 + SplitRimCoinRnd(i, 13) * 1160;
    const tw = 0.5 + 0.5 * Math.sin(f * 0.07 + i * 1.7);
    seats.push(<circle key={i} cx={x} cy={y} r={1.1 + SplitRimCoinRnd(i, 14) * 1.4} fill={SplitRimCoinRnd(i, 15) > 0.8 ? "#C9D1D9" : "#E9B872"} opacity={(0.12 + 0.3 * SplitRimCoinRnd(i, 16)) * (0.7 + 0.3 * tw) * stands} />);
  }
  const ring = arc(0, 0, 0.75, 0, Math.PI * 2, 48);
  const ringPts = ring.split(" ").map((s) => s.split(",").map(Number));
  const rimPts = Array.from({ length: 49 }, (_, i) => { const a = (i / 48) * Math.PI * 2; const p = P(0.75 * Math.cos(a), 0.75 * Math.sin(a), 10); return `${p.X.toFixed(1)},${p.Y.toFixed(1)}`; }).join(" ");
  const netPts = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const t = P(0.75 * Math.cos(a), 0.75 * Math.sin(a), 10), b = P(0.42 * Math.cos(a), 0.42 * Math.sin(a), 8.5);
    return <line key={i} x1={t.X} y1={t.Y} x2={b.X} y2={b.Y} stroke="#F4F1EA" strokeOpacity={0.55} strokeWidth={1.2} />;
  });
  const sw = -200 + ((sweep % 1) + 1) % 1 * 1500;
  void ringPts;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id={`${id}-maple`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8A5A2E" />
          <stop offset="0.45" stopColor="#C38A4E" />
          <stop offset="1" stopColor="#D9A566" />
        </linearGradient>
        <linearGradient id={`${id}-lane`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B9831A" />
          <stop offset="1" stopColor="#FDB927" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-foot`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0D1117" stopOpacity="0" />
          <stop offset="0.22" stopColor="#0D1117" stopOpacity="0.85" />
          <stop offset="0.4" stopColor="#0D1117" stopOpacity="1" />
        </linearGradient>
        <radialGradient id={`${id}-fade`} cx="0.5" cy="0.62" r="0.62">
          <stop offset="0.55" stopColor="#0D1117" stopOpacity="0" />
          <stop offset="1" stopColor="#0D1117" stopOpacity="0.95" />
        </radialGradient>
      </defs>
      {/* the bowl behind the basket */}
      <rect x={-20} y={520} width={1120} height={SplitRimCoinCAM.H - 520 + 100} fill="#0A0E14" />
      {Array.from({ length: 14 }, (_, r) => (
        <rect key={r} x={-20} y={556 + r * 30} width={1120} height={2} fill="#1B2330" opacity={0.6 * stands} />
      ))}
      {seats}
      {/* the floor */}
      <polygon points={pts([[-W, -12], [W, -12], [W, -5.25], [-W, -5.25]])} fill="#5E3B1E" opacity={0.75} />
      <polygon points={pts([[-W, -5.25], [W, -5.25], [W, NEAR], [-W, NEAR]])} fill={`url(#${id}-maple)`} />
      {boards}
      {joints}
      {/* the painted lane, Lakers gold, its seams purple */}
      <polygon points={pts([[-8, -5.25], [8, -5.25], [8, 13.75], [-8, 13.75]])} fill={`url(#${id}-lane)`} />
      {Array.from({ length: 15 }, (_, i) => { const x = -7 + i; const a = P(x, -5.25), b = P(x, 13.75); return <line key={i} x1={a.X} y1={a.Y} x2={b.X} y2={b.Y} stroke="#552583" strokeOpacity={0.28} strokeWidth={0.8} />; })}
      {/* lines, 2 in white paint */}
      <polyline points={pts([[-8, -5.25], [-8, 13.92], [8, 13.92], [8, -5.25]])} fill="none" stroke={LINE} strokeWidth={3} />
      <polygon points={pts([[-8, 13.75], [8, 13.75], [8, 13.92], [-8, 13.92]])} fill={LINE} />
      <polyline points={pts([[-W, -5.25], [W, -5.25]])} fill="none" stroke={LINE} strokeWidth={2} />
      <polyline points={arc(0, 13.92, 6, 0, Math.PI)} fill="none" stroke={LINE} strokeWidth={3} />
      <polyline points={arc(0, 13.92, 6, Math.PI, Math.PI * 2)} fill="none" stroke={LINE} strokeWidth={2.4} strokeDasharray="14 12" opacity={0.85} />
      <polyline points={arc(0, 0, 4, Math.PI * 0.02, Math.PI * 0.98)} fill="none" stroke={LINE} strokeWidth={1.6} opacity={0.8} />
      {/* lane space marks, Rule 1 */}
      {[7, 8, 11, 14].map((yy, i) => (
        <React.Fragment key={i}>
          <polygon points={pts([[-8, yy - 3.75], [-8.67, yy - 3.75], [-8.67, yy - 3.75 + 0.17], [-8, yy - 3.75 + 0.17]])} fill={LINE} />
          <polygon points={pts([[8, yy - 3.75], [8.67, yy - 3.75], [8.67, yy - 3.75 + 0.17], [8, yy - 3.75 + 0.17]])} fill={LINE} />
        </React.Fragment>
      ))}
      {/* light sweeping the satin finish */}
      <clipPath id={`${id}-floorclip`}><polygon points={pts([[-W, -5.25], [W, -5.25], [W, NEAR], [-W, NEAR]])} /></clipPath>
      <g clipPath={`url(#${id}-floorclip)`}>
        <rect x={sw} y={SplitRimCoinCAM.H} width={300} height={900} fill={`url(#${id}-sheen)`} transform={`skewX(-24)`} />
      </g>
      {/* stanchion, board, ring and net */}
      {(() => {
        const bl = P(-3, -1.25, 9.5), br = P(3, -1.25, 9.5), tr = P(3, -1.25, 13), tl = P(-3, -1.25, 13);
        const sql = P(-1, -1.25, 10), sqr = P(1, -1.25, 10), sqt = P(1, -1.25, 11.5), sqtl = P(-1, -1.25, 11.5);
        const post = P(0, -9, 0), postT = P(0, -9, 12), arm = P(0, -1.6, 12);
        return (
          <g>
            <line x1={post.X} y1={post.Y} x2={postT.X} y2={postT.Y} stroke="#1E2632" strokeWidth={22} />
            <line x1={postT.X} y1={postT.Y} x2={arm.X} y2={arm.Y} stroke="#1E2632" strokeWidth={12} />
            <rect x={post.X - 26} y={post.Y - 60} width={52} height={60} fill="#552583" opacity={0.9} />
            <polygon points={`${bl.X},${bl.Y} ${br.X},${br.Y} ${tr.X},${tr.Y} ${tl.X},${tl.Y}`} fill="#C9D6E3" fillOpacity={0.14} stroke="#F4F1EA" strokeWidth={2.4} />
            <polygon points={`${sql.X},${sql.Y} ${sqr.X},${sqr.Y} ${sqt.X},${sqt.Y} ${sqtl.X},${sqtl.Y}`} fill="none" stroke="#F4F1EA" strokeWidth={2} />
            <line x1={bl.X} y1={bl.Y} x2={br.X} y2={br.Y} stroke="#1E2632" strokeWidth={4} />
            {netPts}
            <polyline points={rimPts} fill="none" stroke="#E0561B" strokeWidth={3.2} />
          </g>
        );
      })()}
      <rect x={0} y={0} width={1080} height={1920} fill={`url(#${id}-fade)`} />
      <rect x={0} y={1380} width={1080} height={540} fill={`url(#${id}-foot)`} />
    </svg>
  );
};
