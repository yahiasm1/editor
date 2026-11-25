// HookX1's court: the Lakers lane from behind the shooter (plan.md coordinates, feet: origin = rim centre, +x right,
// +y away from the baseline), seen through a moving camera. Its last camera is BackwardsScorebugCourt's camera, drawn
// the same way (maple, gold lane, stands, LED board), so `backwards` starts on the very picture the hook ends on.
import React from "react";

export type HookX1Cam = { y: number; z: number; a: number; F: number; X0: number; Y0: number; dy: number; blur: number; dim: number };

/** the backwards scene's first frame: camera 6 ft up, 8 ft behind the line, 14 deg down, 70 px high, a little soft */
export const HookX1EndCam: HookX1Cam = { y: 13.92 + 8, z: 6, a: 14, F: 460, X0: 540, Y0: 1150, dy: -70, blur: 1, dim: 0.95 };

/** world feet -> stage px (and the depth) */
export function hookX1Project(c: HookX1Cam, x: number, y: number, z: number): [number, number, number] {
  const A = (c.a * Math.PI) / 180;
  const dy = c.y - y;
  const dz = z - c.z;
  const d = dy * Math.cos(A) - dz * Math.sin(A);
  const up = dy * Math.sin(A) + dz * Math.cos(A);
  const dd = Math.max(d, 0.05);
  return [c.X0 + (c.F * x) / dd, c.Y0 - (c.F * up) / dd + c.dy, d];
}

export const hookX1Mix = (a: HookX1Cam, b: HookX1Cam, t: number): HookX1Cam => {
  const m = (k: keyof HookX1Cam) => a[k] + (b[k] - a[k]) * t;
  return { y: m("y"), z: m("z"), a: m("a"), F: m("F"), X0: m("X0"), Y0: m("Y0"), dy: m("dy"), blur: m("blur"), dim: m("dim") };
};

type V3 = [number, number, number];

/** clip a closed floor/world polygon to the part in front of the camera (y <= ymax) */
function hookX1ClipPoly(pts: V3[], ymax: number): V3[] {
  const out: V3[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const ain = a[1] <= ymax;
    const bin = b[1] <= ymax;
    if (ain) out.push(a);
    if (ain !== bin) {
      const t = (ymax - a[1]) / (b[1] - a[1]);
      out.push([a[0] + (b[0] - a[0]) * t, ymax, a[2] + (b[2] - a[2]) * t]);
    }
  }
  return out;
}

// seeded crowd lights, the stands behind the baseline: the same seeds and shapes as the backwards court
const HookX1Seats = (() => {
  const out: { x: number; y: number; r: number; a: number; warm: boolean; ph: number }[] = [];
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 520; i++) {
    const y = 560 + Math.pow(rnd(), 0.8) * 470;
    out.push({ x: rnd() * 1080, y, r: 0.8 + rnd() * 2.2 * (y / 1000), a: 0.08 + rnd() * 0.35, warm: rnd() > 0.45, ph: rnd() * 6.28 });
  }
  return out;
})();

// camera flashes in the stands while the dunk happens (one every few frames, each lasting 3 frames)
const HookX1Flashes = (() => {
  const out: { x: number; y: number; f: number }[] = [];
  let s = 31;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 46; i++) out.push({ x: 40 + rnd() * 1000, y: 600 + rnd() * 330, f: Math.floor(rnd() * 190) });
  return out;
})();

export type HookX1Rig = {
  bend: number; // ring bend, degrees (front of the ring pulled down)
  flex: number; // board flex, feet (the board's bottom pulled down)
  netDrop: number; // net stretch, feet
  netSwing: number; // net sway, feet
  streak: number; // 0..1, the yank's speed (motion streaks on the paint)
  shadow: { x: number; y: number; s: number } | null; // contact shadow under feet, world
  flashes: boolean;
  net: number; // the drawn net (the photo's own net hangs from his fist at the rim)
};

export const HookX1Court: React.FC<{ f: number; c: HookX1Cam; rig: HookX1Rig; standsDy: number; extra: number; children?: React.ReactNode }> = ({ f, c, rig, standsDy, extra, children }) => {
  const P = (x: number, y: number, z: number) => hookX1Project(c, x, y, z);
  const ymax = c.y - 0.9;
  const pts = (a: V3[]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const poly = (xy: [number, number][], z = 0) => {
    const cl = hookX1ClipPoly(xy.map(([x, y]) => [x, y, z] as V3), ymax);
    return cl.length > 2 ? pts(cl.map((p) => P(p[0], p[1], p[2]))) : "";
  };
  const line = (ax: number, ay: number, bx: number, by: number, w = 2 / 12) => {
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
  };
  const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 40, z = 0): V3[] => {
    const out: V3[] = [];
    for (let i = 0; i <= n; i++) {
      const t = a0 + ((a1 - a0) * i) / n;
      const y = cy + r * Math.sin(t);
      if (y > ymax) continue;
      out.push(P(cx + r * Math.cos(t), y, z));
    }
    return out;
  };

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
    const b = P(x, Math.min(21, ymax), 0);
    boards.push(<line key={x} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(60,30,10,0.35)" strokeWidth={0.9} />);
  }
  // the yank: streaks of light dragged along the paint, toward the rim
  const streaks: React.ReactNode[] = [];
  if (rig.streak > 0.02) {
    for (let i = 0; i < 26; i++) {
      const x = -7.6 + ((i * 7.31) % 15.2);
      const y0 = -3 + ((i * 5.17 + f * 3.1) % 16);
      const len = 3 + 5 * rig.streak;
      const s = line(x, y0, x, Math.min(y0 + len, 13.6), 0.07 + (i % 3) * 0.03);
      if (s) streaks.push(<polygon key={i} points={s} fill="#FFF3C4" opacity={0.28 * rig.streak} />);
    }
  }
  const circleOuter = arc(0, 13.92, 6, 0, Math.PI, 48);
  const circleInner = arc(0, 13.92, 6, Math.PI, 2 * Math.PI, 48);
  const restricted = arc(0, 0, 4, 0, Math.PI, 36);
  const marks = [7, 8, 11, 14].flatMap((d) => [-1, 1].map((sgn) => line(sgn * 8, -5.25 + d, sgn * 8.5, -5.25 + d, 2 / 12)));

  // the board flexes (its bottom edge pulled down and toward the court), the ring bends on its mount
  const fl = rig.flex;
  const board: V3[] = [P(-3, -1.25 + fl * 0.4, 9.5 - fl), P(3, -1.25 + fl * 0.4, 9.5 - fl), P(3, -1.25, 13), P(-3, -1.25, 13)];
  const sq: V3[] = [P(-1, -1.25 + fl * 0.4, 10 - fl * 0.85), P(1, -1.25 + fl * 0.4, 10 - fl * 0.85), P(1, -1.25 + fl * 0.1, 11.5 - fl * 0.4), P(-1, -1.25 + fl * 0.1, 11.5 - fl * 0.4)];
  const B = (rig.bend * Math.PI) / 180;
  const ringPt = (x: number, y: number, z: number): V3 => {
    // rotate about the mount (y = -1.25, z = 10 - flex) in the y-z plane
    const yb = -1.25;
    const zb = 10 - fl * 0.85;
    const ry = y - yb;
    const rz = z - 10;
    return P(x, yb + ry * Math.cos(B) + rz * Math.sin(B), zb - ry * Math.sin(B) + rz * Math.cos(B));
  };
  const ring: V3[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    ring.push(ringPt(0.75 * Math.cos(t), 0.75 * Math.sin(t), 10));
  }
  const ringBack = ring.filter((p, i) => Math.sin((i / 40) * Math.PI * 2) < 0);
  const ringFront: V3[] = [];
  for (let i = 0; i <= 20; i++) {
    const t = (i / 20) * Math.PI;
    ringFront.push(ringPt(0.75 * Math.cos(t), 0.75 * Math.sin(t), 10));
  }
  const net: React.ReactNode[] = [];
  const bottomZ = 8.5 - rig.netDrop;
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    const a = ringPt(0.75 * Math.cos(t), 0.75 * Math.sin(t), 10);
    const sw = rig.netSwing;
    const b = ringPt(0.45 * Math.cos(t + 0.5) + sw, 0.45 * Math.sin(t + 0.5), bottomZ);
    const cc = ringPt(0.45 * Math.cos(t - 0.5) + sw, 0.45 * Math.sin(t - 0.5), bottomZ);
    const mid = (u: V3, v: V3, w: V3): V3 => [(u[0] + v[0]) / 2 + ((w[0] - (u[0] + v[0]) / 2) * extra), (u[1] + v[1]) / 2 + ((w[1] - (u[1] + v[1]) / 2) * extra), 0];
    const m1 = mid(a, b, ringPt(0.58 * Math.cos(t + 0.26) + sw * 0.5, 0.58 * Math.sin(t + 0.26), 9.25 - rig.netDrop * 0.5));
    const m2 = mid(a, cc, ringPt(0.58 * Math.cos(t - 0.26) + sw * 0.5, 0.58 * Math.sin(t - 0.26), 9.25 - rig.netDrop * 0.5));
    net.push(<polyline key={`a${i}`} points={pts([a, m1, b])} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={1.4} />);
    net.push(<polyline key={`b${i}`} points={pts([a, m2, cc])} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />);
  }
  const midRing: V3[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = (i / 24) * Math.PI * 2;
    midRing.push(ringPt(0.58 * Math.cos(t) + rig.netSwing * 0.5, 0.58 * Math.sin(t), 9.25 - rig.netDrop * 0.5));
  }
  const botRing: V3[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = (i / 24) * Math.PI * 2;
    botRing.push(ringPt(0.45 * Math.cos(t) + rig.netSwing, 0.45 * Math.sin(t), bottomZ));
  }
  const base = P(0, -1.25, 9.5 - fl);
  const stan = P(0, -6.5, 0);
  const bl = P(-8, -5.25, 0);
  const sweep = ((f % 360) / 360) * 1600 - 300;
  const sh = rig.shadow ? P(rig.shadow.x, rig.shadow.y, 0) : null;
  const shR = rig.shadow ? (1.6 * c.F) / Math.max(1, sh![2]) : 0;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 + standsDy, overflow: "hidden", filter: `blur(${c.blur.toFixed(2)}px) brightness(${c.dim.toFixed(3)})` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="hx1-stands" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0D1117" stopOpacity={0} />
            <stop offset="0.25" stopColor="#111823" />
            <stop offset="1" stopColor="#1A2230" />
          </linearGradient>
          <linearGradient id="hx1-maple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7A4B22" />
            <stop offset="0.45" stopColor="#C98C4E" />
            <stop offset="1" stopColor="#E2AE70" />
          </linearGradient>
          <linearGradient id="hx1-lane" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C68A14" />
            <stop offset="1" stopColor="#FDB927" />
          </linearGradient>
          <radialGradient id="hx1-pool" cx="0.5" cy="0.62" r="0.55">
            <stop offset="0" stopColor="#FFF4DA" stopOpacity={0.22} />
            <stop offset="1" stopColor="#FFF4DA" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="hx1-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity={0} />
            <stop offset="0.5" stopColor="#fff" stopOpacity={0.16} />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <clipPath id="hx1-floorclip">
            <polygon points={floor} />
          </clipPath>
          <linearGradient id="hx1-fadeTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0D1117" stopOpacity={1} />
            <stop offset="1" stopColor="#0D1117" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="hx1-shadow">
            <stop offset="0" stopColor="#000" stopOpacity={0.6} />
            <stop offset="1" stopColor="#000" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="hx1-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#DCE8FF" stopOpacity={0.16} />
            <stop offset="0.5" stopColor="#DCE8FF" stopOpacity={0.05} />
            <stop offset="1" stopColor="#DCE8FF" stopOpacity={0.12} />
          </linearGradient>
        </defs>
        {/* stands */}
        <g transform={`translate(0 ${standsDy.toFixed(1)})`}>
          <rect x={0} y={540} width={1080} height={560} fill="url(#hx1-stands)" />
          {HookX1Seats.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.warm ? "#FFD9A0" : "#DCE6FF"} opacity={p.a * (0.7 + 0.3 * Math.sin(f / 9 + p.ph))} />
          ))}
          {rig.flashes &&
            HookX1Flashes.map((p, i) => {
              const k = f - p.f;
              if (k < 0 || k > 3) return null;
              const o = 1 - k / 4;
              return <circle key={`fl${i}`} cx={p.x} cy={p.y} r={7 + 9 * o} fill="#FFFFFF" opacity={0.75 * o} style={{ filter: "blur(2px)" }} />;
            })}
        </g>
        {/* the baseline LED board */}
        <rect x={0} y={bl[1] - 46} width={1080} height={34} fill="#0B1320" />
        <rect x={0} y={bl[1] - 46} width={1080} height={34} fill="#552583" opacity={0.35} />
        <rect x={0} y={bl[1] - 13} width={1080} height={3} fill="#FDB927" opacity={0.55} />
        {/* floor */}
        <polygon points={floor} fill="url(#hx1-maple)" />
        <g clipPath="url(#hx1-floorclip)">
          {boards}
          {lane && <polygon points={lane} fill="url(#hx1-lane)" />}
          {streaks}
          <rect x={sweep} y={1000 + standsDy} width={340} height={600} fill="url(#hx1-sweep)" transform="skewX(-24)" />
          <ellipse cx={540} cy={1250 + standsDy} rx={620} ry={260} fill="url(#hx1-pool)" />
        </g>
        {/* paint */}
        <g fill="#F7F3EA">
          <polygon points={line(-30, -5.25, 30, -5.25)} />
          <polygon points={line(-8, -5.25, -8, 13.92)} />
          <polygon points={line(8, -5.25, 8, 13.92)} />
          <polygon
            points={poly([
              [-8, 13.75],
              [8, 13.75],
              [8, 13.92],
              [-8, 13.92],
            ])}
          />
          {marks.map((m, i) => (
            <polygon key={i} points={m} />
          ))}
        </g>
        {circleOuter.length > 1 && <polyline points={pts(circleOuter)} fill="none" stroke="#F7F3EA" strokeWidth={3.2} />}
        {circleInner.length > 1 && <polyline points={pts(circleInner)} fill="none" stroke="#F7F3EA" strokeWidth={2.2} strokeDasharray="14 12" />}
        {restricted.length > 1 && <polyline points={pts(restricted)} fill="none" stroke="#F7F3EA" strokeWidth={1.8} />}
        {sh && <ellipse cx={sh[0]} cy={sh[1]} rx={shR * rig.shadow!.s} ry={shR * 0.22 * rig.shadow!.s} fill="url(#hx1-shadow)" />}
        {children}
        {/* stanchion, board, ring, net */}
        <line x1={stan[0]} y1={stan[1]} x2={base[0]} y2={base[1] + 6} stroke="#2A3240" strokeWidth={10} />
        <polygon points={pts(board)} fill="rgba(200,220,255,0.10)" stroke="#E9EEF5" strokeWidth={4} />
        {fl > 0.002 && <polygon points={pts(board)} fill="url(#hx1-glass)" />}
        <polygon points={pts(sq)} fill="none" stroke="#E9EEF5" strokeWidth={2.5} />
        <polyline points={pts(ringBack)} fill="none" stroke="#B5410F" strokeWidth={4.5} opacity={extra} />
        <g opacity={rig.net}>{net}</g>
        <g opacity={extra * rig.net}>
          <polyline points={pts(midRing)} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={1.1} />
          <polyline points={pts(botRing)} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={1.2} />
        </g>
        <polyline points={pts(ring)} fill="none" stroke="#E2531B" strokeWidth={4.5} />
        <polyline points={pts(ringFront)} fill="none" stroke="#F26A2E" strokeWidth={5} opacity={extra} />
        {/* the top of the stage fades into the navy so the caption band stays clean */}
        <rect x={0} y={520 + standsDy} width={1080} height={120} fill="url(#hx1-fadeTop)" />
      </svg>
    </div>
  );
};
