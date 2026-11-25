// The Lakers lane behind the scoreboard, from the shooter's seat (plan.md, "Coordinates for every builder"): camera
// 6 ft up, 8 ft behind the free throw line, pitched 14 deg down, projected for real. Feet: origin = rim centre,
// +x right, +y away from the baseline. It sits out of focus behind the bug, the stands lit, a light crossing the boards.
import React from "react";

const BackwardsScorebugA = (14 * Math.PI) / 180;
const BackwardsScorebugF = 460;
const BackwardsScorebugCam = { y: 13.92 + 8, z: 6 };
export const BackwardsScorebugCX = 540;
export const BackwardsScorebugCY = 1150;

/** world feet -> stage px */
export function backwardsScorebugProject(x: number, y: number, z: number): [number, number, number] {
  const dy = BackwardsScorebugCam.y - y;
  const dz = z - BackwardsScorebugCam.z;
  const d = dy * Math.cos(BackwardsScorebugA) - dz * Math.sin(BackwardsScorebugA);
  const up = dy * Math.sin(BackwardsScorebugA) + dz * Math.cos(BackwardsScorebugA);
  return [BackwardsScorebugCX + (BackwardsScorebugF * x) / d, BackwardsScorebugCY - (BackwardsScorebugF * up) / d, d];
}

const P = backwardsScorebugProject;
const pts = (a: [number, number, number][]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
const poly = (xy: [number, number][], z = 0) => pts(xy.map(([x, y]) => P(x, y, z)));
/** a 2 in painted line along the floor from a to b, as a quad */
function line(ax: number, ay: number, bx: number, by: number, w = 2 / 12) {
  const dx = bx - ax;
  const dy = by - ay;
  const l = Math.hypot(dx, dy) || 1;
  const nx = (-dy / l) * (w / 2);
  const ny = (dx / l) * (w / 2);
  return poly([
    [ax + nx, ay + ny],
    [bx + nx, by + ny],
    [bx - nx, by - ny],
    [ax - nx, ay - ny],
  ]);
}
function arc(cx: number, cy: number, r: number, a0: number, a1: number, n = 40, z = 0) {
  const out: [number, number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = a0 + ((a1 - a0) * i) / n;
    out.push(P(cx + r * Math.cos(t), cy + r * Math.sin(t), z));
  }
  return out;
}

// seeded crowd lights, the stands behind the baseline
const BackwardsScorebugSeats = (() => {
  const out: { x: number; y: number; r: number; a: number; warm: boolean; ph: number }[] = [];
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 520; i++) {
    const y = 560 + Math.pow(rnd(), 0.8) * 470;
    out.push({ x: rnd() * 1080, y, r: 0.8 + rnd() * 2.2 * (y / 1000), a: 0.08 + rnd() * 0.35, warm: rnd() > 0.45, ph: rnd() * 6.28 });
  }
  return out;
})();

export const BackwardsScorebugCourt: React.FC<{ f: number; blur: number; dim: number; dy: number }> = ({ f, blur, dim, dy }) => {
  // the floor slab, from behind the baseline to under the camera
  const floor = poly([
    [-30, -9],
    [30, -9],
    [30, 21],
    [-30, 21],
  ]);
  const lane = poly([
    [-8, -5.25],
    [8, -5.25],
    [8, 13.75],
    [-8, 13.75],
  ]);
  const boards: React.ReactNode[] = [];
  for (let x = -29.75; x <= 30; x += 0.5) {
    const a = P(x, -9, 0);
    const b = P(x, 21, 0);
    boards.push(<line key={x} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(60,30,10,0.35)" strokeWidth={0.9} />);
  }
  // the free throw circle: upper half (toward the shooter) solid, lower half (inside the lane) dashed
  const circleOuter = arc(0, 13.92, 6, 0, Math.PI, 48);
  const circleInner = arc(0, 13.92, 6, Math.PI, 2 * Math.PI, 48);
  const restricted = arc(0, 0, 4, 0, Math.PI, 36);
  // lane space marks (Rule 1.I.6), on both lane lines, 2 in x 6 in, at 7, 8, 11 and 14 ft from the baseline
  const marks = [7, 8, 11, 14].flatMap((d) =>
    [-1, 1].map((sgn) => line(sgn * 8, -5.25 + d, sgn * 8.5, -5.25 + d, 2 / 12)),
  );
  const board = [P(-3, -1.25, 9.5), P(3, -1.25, 9.5), P(3, -1.25, 13), P(-3, -1.25, 13)];
  const sq = [P(-1, -1.25, 10), P(1, -1.25, 10), P(1, -1.25, 11.5), P(-1, -1.25, 11.5)];
  const ring = arc(0, 0, 0.75, 0, 2 * Math.PI, 40, 10);
  const net: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    const a = P(0.75 * Math.cos(t), 0.75 * Math.sin(t), 10);
    const b = P(0.45 * Math.cos(t + 0.5), 0.45 * Math.sin(t + 0.5), 8.5);
    const c = P(0.45 * Math.cos(t - 0.5), 0.45 * Math.sin(t - 0.5), 8.5);
    net.push(<line key={`a${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(255,255,255,0.7)" strokeWidth={1.2} />);
    net.push(<line key={`b${i}`} x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />);
  }
  const base = P(0, -1.25, 9.5);
  const stan = P(0, -6.5, 0);
  // a slow light crossing the boards
  const sweep = ((f % 360) / 360) * 1600 - 300;
  const [bl] = [P(-8, -5.25, 0)];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${dy.toFixed(1)}px)`, filter: `blur(${blur.toFixed(2)}px) brightness(${dim.toFixed(3)})` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="bsb-stands" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0D1117" stopOpacity={0} />
            <stop offset="0.25" stopColor="#111823" />
            <stop offset="1" stopColor="#1A2230" />
          </linearGradient>
          <linearGradient id="bsb-maple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7A4B22" />
            <stop offset="0.45" stopColor="#C98C4E" />
            <stop offset="1" stopColor="#E2AE70" />
          </linearGradient>
          <linearGradient id="bsb-lane" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C68A14" />
            <stop offset="1" stopColor="#FDB927" />
          </linearGradient>
          <radialGradient id="bsb-pool" cx="0.5" cy="0.62" r="0.55">
            <stop offset="0" stopColor="#FFF4DA" stopOpacity={0.22} />
            <stop offset="1" stopColor="#FFF4DA" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="bsb-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity={0} />
            <stop offset="0.5" stopColor="#fff" stopOpacity={0.16} />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <clipPath id="bsb-floorclip">
            <polygon points={floor} />
          </clipPath>
          <linearGradient id="bsb-fadeTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0D1117" stopOpacity={1} />
            <stop offset="1" stopColor="#0D1117" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* stands */}
        <rect x={0} y={540} width={1080} height={560} fill="url(#bsb-stands)" />
        {BackwardsScorebugSeats.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.warm ? "#FFD9A0" : "#DCE6FF"} opacity={p.a * (0.7 + 0.3 * Math.sin(f / 9 + p.ph))} />
        ))}
        {/* the baseline LED board */}
        <rect x={0} y={bl[1] - 46} width={1080} height={34} fill="#0B1320" />
        <rect x={0} y={bl[1] - 46} width={1080} height={34} fill="#552583" opacity={0.35} />
        <rect x={0} y={bl[1] - 13} width={1080} height={3} fill="#FDB927" opacity={0.55} />
        {/* floor */}
        <polygon points={floor} fill="url(#bsb-maple)" />
        <g clipPath="url(#bsb-floorclip)">
          {boards}
          <polygon points={lane} fill="url(#bsb-lane)" />
          <rect x={sweep} y={1000} width={340} height={600} fill="url(#bsb-sweep)" transform="skewX(-24)" />
          <ellipse cx={540} cy={1250} rx={620} ry={260} fill="url(#bsb-pool)" />
        </g>
        {/* paint */}
        <g fill="#F7F3EA">
          <polygon points={line(-30, -5.25, 30, -5.25)} />
          <polygon points={line(-8, -5.25, -8, 13.92)} />
          <polygon points={line(8, -5.25, 8, 13.92)} />
          <polygon points={poly([
            [-8, 13.75],
            [8, 13.75],
            [8, 13.92],
            [-8, 13.92],
          ])} />
          {marks.map((m, i) => (
            <polygon key={i} points={m} />
          ))}
        </g>
        <polyline points={pts(circleOuter)} fill="none" stroke="#F7F3EA" strokeWidth={3.2} />
        <polyline points={pts(circleInner)} fill="none" stroke="#F7F3EA" strokeWidth={2.2} strokeDasharray="14 12" />
        <polyline points={pts(restricted)} fill="none" stroke="#F7F3EA" strokeWidth={1.8} />
        {/* stanchion, board, ring, net */}
        <line x1={stan[0]} y1={stan[1]} x2={base[0]} y2={base[1] + 6} stroke="#2A3240" strokeWidth={10} />
        <polygon points={pts(board)} fill="rgba(200,220,255,0.10)" stroke="#E9EEF5" strokeWidth={4} />
        <polygon points={pts(sq)} fill="none" stroke="#E9EEF5" strokeWidth={2.5} />
        {net}
        <polyline points={pts(ring)} fill="none" stroke="#E2531B" strokeWidth={4.5} />
        {/* the top of the stage fades into the navy so the caption band stays clean */}
        <rect x={0} y={520} width={1080} height={120} fill="url(#bsb-fadeTop)" />
      </svg>
    </div>
  );
};
