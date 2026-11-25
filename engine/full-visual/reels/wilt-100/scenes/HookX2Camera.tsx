// wilt-100 hook variant 2: the RCA TK-41 studio camera on its pedestal, redrawn from the DogsRNice photo
// (assets/refs/objects/commons-rca-tk41-tv-camera-dogsrnice-ccbysa4.jpg). Every part is a real-size solid in metres,
// projected through one viewer (HookX2Kit): the three-armed cast base on its casters, the hammertone bell, the
// steering ring, the twin chrome column, the pan head and tilt handle, the stainless head with its black control
// end, the louvred hood, the four-lens turret, the viewfinder in its rubber cowl, the red tally lamp and the cable.
// Flat details (script, porthole, louvres, knobs, seams, the CRT picture) are drawn in millimetres and mapped onto
// their own face patch by an affine matrix from that patch's projected corners.
import React from "react";
import { loadFont as loadYellowtail } from "@remotion/google-fonts/Yellowtail";
import {
  HX2_F, HX2_TALLY, type HX2Pose, type P2, type V3, hx2Depth, hx2Faces, hx2Matrix, hx2P, hx2Path, hx2Project, hx2Rnd, hx2World,
} from "./HookX2Kit";

const hx2Lerp2 = (a: number, b: number, k: number) => a + (b - a) * k;
const SCRIPT = loadYellowtail("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

type Sh = { x: number; y: number; s?: number };
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

/** the head box and the parts on it, metres, local frame */
export const HX2_BODY = { x0: -0.16, x1: 0.16, y0: 1.1, y1: 1.46, z0: -0.34, z1: 0.42 };
const VF = { x0: -0.15, x1: 0.15, y0: 1.4, y1: 1.7, z0: -0.42, z1: -0.16 };
/** the CRT face inside the cowl (4:3, 260 x 195 mm), and the drawing units it is mapped from */
export const HX2_CRT = { x0: -0.13, x1: 0.13, y0: 1.4675, y1: 1.6625, z: -0.405, W: 520, H: 390 };
export const HX2_CRT_CENTRE: V3 = [0, (HX2_CRT.y0 + HX2_CRT.y1) / 2, HX2_CRT.z];
const COWL = { x0: -0.166, x1: 0.166, y0: 1.394, y1: 1.716, z: -0.49 };
export const HX2_PLUG: V3 = [-0.07, 1.16, -0.34];
export const HX2_TALLY_AT: V3 = [0.085, 1.7, -0.25];

/** an affine-mapped flat drawing on the patch spanned by o, o+u (width) and o+v (height) */
const Patch: React.FC<{ P: (p: V3) => P2; o: V3; u: V3; v: V3; W: number; H: number; children: React.ReactNode; opacity?: number; clip?: { id: string; pts: P2[] } }> = ({ P, o, u, v, W, H, children, opacity, clip }) => {
  const inner = (
    <g transform={hx2Matrix(P(o), P(add(o, u)), P(add(o, v)), W, H)} opacity={opacity}>
      {children}
    </g>
  );
  if (!clip) return inner;
  // the flat drawing is affine, the face is in perspective: keep the drawing inside the face's true outline
  return (
    <g>
      <clipPath id={clip.id}>
        <path d={hx2Path(clip.pts)} />
      </clipPath>
      <g clipPath={`url(#${clip.id})`}>{inner}</g>
    </g>
  );
};

/** a solid of revolution about the local y axis (rings of [y, r]), drawn as its silhouette */
function revolve(P: (p: V3) => P2, cx: number, cz: number, rings: [number, number][], n = 28) {
  const pts: P2[] = [];
  for (const [y, r] of rings) for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push(P([cx + r * Math.cos(a), y, cz + r * Math.sin(a)]));
  }
  return hull(pts);
}
function hull(pts: { x: number; y: number }[]) {
  const p = [...pts].sort((a, b) => a.x - b.x || a.y - b.y);
  const cr = (o: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lo: typeof p = [], up: typeof p = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
}
/** a ring (circle) in the plane y = const, as projected points */
const ring = (P: (p: V3) => P2, c: V3, r: number, n = 48, a0 = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + (i / n) * Math.PI * 2;
    return P([c[0] + r * Math.cos(a), c[1], c[2] + r * Math.sin(a)]);
  });
/** a circle in the plane z = const */
const discZ = (P: (p: V3) => P2, c: V3, r: number, n = 24) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return P([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), c[2]]);
  });
/** a circle in the plane x = const (a caster wheel) */
const discX = (P: (p: V3) => P2, c: V3, r: number, n = 18) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return P([c[0], c[1] + r * Math.sin(a), c[2] + r * Math.cos(a)]);
  });

/** a rod between two local points, with a chrome highlight; width from its depth */
const Rod: React.FC<{ P: (p: V3) => P2; a: V3; b: V3; r: number; dark?: string; mid?: string; hi?: string }> = ({ P, a, b, r, dark = "#3A3F45", mid = "#A9AFB5", hi = "#F2F4F6" }) => {
  const A = P(a), B = P(b);
  const w = (2 * r * HX2_F) / Math.max(0.2, (A.d + B.d) / 2);
  const nx = -(B.y - A.y), ny = B.x - A.x;
  const l = Math.hypot(nx, ny) || 1;
  const ox = (nx / l) * w * 0.2, oy = (ny / l) * w * 0.2;
  return (
    <g strokeLinecap="round">
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={dark} strokeWidth={w} />
      <line x1={A.x - ox * 0.3} y1={A.y - oy * 0.3} x2={B.x - ox * 0.3} y2={B.y - oy * 0.3} stroke={mid} strokeWidth={w * 0.62} />
      <line x1={A.x - ox} y1={A.y - oy} x2={B.x - ox} y2={B.y - oy} stroke={hi} strokeWidth={Math.max(1, w * 0.16)} opacity={0.85} />
    </g>
  );
};

type Face = { pts: P2[]; vis: boolean };
function boxFace(P: (p: V3) => P2, pose: HX2Pose, b: { x0: number; x1: number; y0: number; y1: number; z0: number; z1: number }, side: "right" | "left" | "top" | "rear" | "front" | "bottom"): Face {
  const { x0, x1, y0, y1, z0, z1 } = b;
  const q: Record<typeof side, { c: V3[]; n: V3 }> = {
    right: { c: [[x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [x1, y0, z0]], n: [1, 0, 0] },
    left: { c: [[x0, y1, z1], [x0, y1, z0], [x0, y0, z0], [x0, y0, z1]], n: [-1, 0, 0] },
    top: { c: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], n: [0, 1, 0] },
    rear: { c: [[x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0]], n: [0, 0, -1] },
    front: { c: [[x1, y1, z1], [x0, y1, z1], [x0, y0, z1], [x1, y0, z1]], n: [0, 0, 1] },
    bottom: { c: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], n: [0, -1, 0] },
  };
  const s = q[side];
  const ctr: V3 = [(x0 + x1) / 2 + (s.n[0] * (x1 - x0)) / 2, (y0 + y1) / 2 + (s.n[1] * (y1 - y0)) / 2, (z0 + z1) / 2 + (s.n[2] * (z1 - z0)) / 2];
  return { pts: s.c.map(P), vis: hx2Faces(ctr, s.n, pose) };
}

export type HookX2CameraProps = {
  pose: HX2Pose;
  shake: Sh;
  f: number;
  /** the CRT picture, drawn in HX2_CRT.W x HX2_CRT.H units */
  screen: React.ReactNode;
  /** 0..1: how much the tube is lighting its cowl */
  glow: number;
  /** 0..1: the red tally lamp */
  tally: number;
  /** the cable's far end, world (it is yanked off left), and whether the plug is still in */
  cable: { sag: number; far: V3; plugOut: number; plugFly: V3 };
};

export const HookX2Camera: React.FC<HookX2CameraProps> = ({ pose, shake, f, screen, glow, tally, cable }) => {
  const P = (p: V3) => hx2P(p, pose, shake);
  const B = HX2_BODY;
  const parts: React.ReactNode[] = [];

  // ---------- the base: three cast arms on casters, a rounded triangle ----------
  const arms = [Math.PI * 1.5, Math.PI / 6, (Math.PI * 5) / 6]; // rear, front-right, front-left (angle from +x toward +z)
  const footOutline = (y: number, grow = 0) => {
    const pts: V3[] = [];
    arms.forEach((a) => {
      for (let i = 0; i < 10; i++) {
        const t = a - 0.9 + (1.8 * i) / 9;
        pts.push([0.36 * Math.cos(a) + (0.075 + grow) * Math.cos(t), y, 0.36 * Math.sin(a) + (0.075 + grow) * Math.sin(t)]);
      }
      // the waist between arms
      const m = a + Math.PI / 3;
      pts.push([(0.17 + grow) * Math.cos(m), y, (0.17 + grow) * Math.sin(m)]);
    });
    return pts.map(P);
  };
  // contact shadow under the base: soft, on the floor
  const sh = ring(P, [0, 0.002, 0], 0.5, 40);
  parts.push(<path key="shadow" d={hx2Path(sh)} fill="rgba(0,0,0,0.55)" filter="url(#hx2-soft)" />);
  // casters (under the arm ends), each a swivel fork and a black rubber wheel
  arms.forEach((a, i) => {
    const c: V3 = [0.38 * Math.cos(a), 0.042, 0.38 * Math.sin(a)];
    const swivel = i === 0 ? 0 : 0.03;
    const wheel = discX(P, [c[0] + swivel, c[1], c[2] - 0.02], 0.042);
    parts.push(
      <g key={`caster${i}`}>
        <path d={hx2Path(wheel)} fill="#101214" stroke="#26292D" strokeWidth={2} />
        <path d={hx2Path(discX(P, [c[0] + swivel + 0.016, c[1], c[2] - 0.02], 0.016))} fill="#6E747A" />
        <path d={hx2Path([P([c[0] - 0.03, 0.078, c[2] - 0.03]), P([c[0] + 0.03, 0.078, c[2] - 0.03]), P([c[0] + 0.024, 0.04, c[2] - 0.02]), P([c[0] - 0.024, 0.04, c[2] - 0.02])])} fill="#4A4F55" />
      </g>,
    );
  });
  parts.push(<path key="foot-bot" d={hx2Path(footOutline(0.075))} fill="#2E3236" />);
  parts.push(<path key="foot-top" d={hx2Path(footOutline(0.12, -0.004))} fill="url(#hx2-cast)" stroke="#8D949A" strokeWidth={1.2} />);
  // the cast ribs on each arm
  arms.forEach((a, i) => {
    parts.push(<line key={`rib${i}`} x1={P([0.16 * Math.cos(a), 0.121, 0.16 * Math.sin(a)]).x} y1={P([0.16 * Math.cos(a), 0.121, 0.16 * Math.sin(a)]).y} x2={P([0.39 * Math.cos(a), 0.121, 0.39 * Math.sin(a)]).x} y2={P([0.39 * Math.cos(a), 0.121, 0.39 * Math.sin(a)]).y} stroke="#A3AAB0" strokeWidth={3} opacity={0.5} strokeLinecap="round" />);
  });

  // ---------- the bell: grey hammertone, a rim band, a neck ----------
  const bell = revolve(P, 0, 0, [[0.12, 0.2], [0.16, 0.214], [0.33, 0.206], [0.37, 0.176], [0.45, 0.12], [0.52, 0.085]]);
  parts.push(<path key="bell" d={hx2Path(bell)} fill="url(#hx2-bell)" />);
  parts.push(<path key="bell-tex" d={hx2Path(bell)} fill="#000" filter="url(#hx2-hammer)" opacity={0.35} />);
  // the rim band: the near half of the ring at y 0.16 (the half closer to the viewer)
  const band = ring(P, [0, 0.165, 0], 0.216, 48).filter((p) => p.d < hx2Depth([0, 0.165, 0], pose) + 0.02);
  parts.push(<path key="band" d={hx2Path(band.sort((a, b) => a.x - b.x), false)} fill="none" stroke="#9BA2A8" strokeWidth={4} opacity={0.6} />);
  const band2 = ring(P, [0, 0.335, 0], 0.206, 48).filter((p) => p.d < hx2Depth([0, 0.335, 0], pose) + 0.02);
  parts.push(<path key="band2" d={hx2Path(band2.sort((a, b) => a.x - b.x), false)} fill="none" stroke="#1E2124" strokeWidth={3} opacity={0.7} />);

  // ---------- the steering ring, back half (behind the column) ----------
  const RING_C: V3 = [0, 0.6, 0];
  const ringPts = ring(P, RING_C, 0.27, 64, pose.ring);
  const cD = hx2Depth(RING_C, pose);
  const ringW = (2 * 0.014 * HX2_F) / cD;
  const halfPath = (front: boolean) => {
    const segs: string[] = [];
    for (let i = 0; i < ringPts.length; i++) {
      const a = ringPts[i], b = ringPts[(i + 1) % ringPts.length];
      if ((a.d < cD) === front) segs.push(`M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
    }
    return segs.join(" ");
  };
  const spokes = [0, 1, 2].map((k) => {
    const a = pose.ring + (k * Math.PI * 2) / 3 + 0.5;
    return { a: P([0.05 * Math.cos(a), 0.6, 0.05 * Math.sin(a)]), b: P([0.265 * Math.cos(a), 0.6, 0.265 * Math.sin(a)]), front: P([0.15 * Math.cos(a), 0.6, 0.15 * Math.sin(a)]).d < cD };
  });
  const ringHalf = (front: boolean) => (
    <g key={`ring${front}`} strokeLinecap="round">
      {spokes.filter((s) => s.front === front).map((s, i) => (
        <g key={i}>
          <line x1={s.a.x} y1={s.a.y} x2={s.b.x} y2={s.b.y} stroke="#4B5157" strokeWidth={ringW * 1.3} />
          <line x1={s.a.x} y1={s.a.y - 1} x2={s.b.x} y2={s.b.y - 1} stroke="#B9C0C6" strokeWidth={ringW * 0.5} />
        </g>
      ))}
      <path d={halfPath(front)} stroke="#555B61" strokeWidth={ringW} fill="none" />
      <path d={halfPath(front)} stroke="#C9CFD4" strokeWidth={ringW * 0.45} fill="none" transform="translate(0 -1.5)" />
    </g>
  );
  parts.push(ringHalf(false));

  // ---------- the column: two chrome tubes, a hub on the ring ----------
  parts.push(<Rod key="colL" P={P} a={[-0.036, 0.5, 0]} b={[-0.036, 1.03, 0]} r={0.03} />);
  parts.push(<Rod key="colR" P={P} a={[0.036, 0.5, 0]} b={[0.036, 1.03, 0]} r={0.03} />);
  parts.push(<path key="hub" d={hx2Path(revolve(P, 0, 0, [[0.58, 0.06], [0.63, 0.06]], 20))} fill="#5D6369" />);
  parts.push(ringHalf(true));

  // ---------- the pan head: a dark cradle under the camera ----------
  const head = { x0: -0.1, x1: 0.1, y0: 1.02, y1: 1.1, z0: -0.13, z1: 0.15 };
  (["rear", "right", "left", "front", "top"] as const).forEach((s) => {
    const fc = boxFace(P, pose, head, s);
    if (fc.vis) parts.push(<path key={`head-${s}`} d={hx2Path(fc.pts)} fill={s === "right" ? "#3D4247" : s === "rear" ? "#2B2F33" : "#474C51"} stroke="#62686E" strokeWidth={1} />);
  });

  // ---------- the turret: four lenses on a plate in front of the head (behind it, from here) ----------
  const TUR: V3 = [0, 1.3, 0.425];
  parts.push(<path key="tplate" d={hx2Path(hull([...discZ(P, TUR, 0.15), ...discZ(P, [TUR[0], TUR[1], TUR[2] + 0.03], 0.15)]))} fill="#1C1F22" stroke="#4A4F54" strokeWidth={1.5} />);
  const lenses = [
    { len: 0.34, r: 0.05 },
    { len: 0.14, r: 0.04 },
    { len: 0.08, r: 0.036 },
    { len: 0.21, r: 0.046 },
  ];
  lenses
    .map((l, k) => {
      const a = pose.turret + (k * Math.PI) / 2;
      const c0: V3 = [0.09 * Math.cos(a), TUR[1] + 0.09 * Math.sin(a), TUR[2] + 0.03];
      const c1: V3 = [c0[0], c0[1], c0[2] + l.len];
      return { ...l, c0, c1, d: hx2Depth(c1, pose) };
    })
    .sort((a, b) => b.d - a.d)
    .forEach((l, k) => {
      const barrel = hull([...discZ(P, l.c0, l.r), ...discZ(P, l.c1, l.r)]);
      const ring1 = discZ(P, [l.c0[0], l.c0[1], l.c0[2] + l.len * 0.35], l.r * 1.04);
      parts.push(
        <g key={`lens${k}`}>
          <path d={hx2Path(barrel)} fill="url(#hx2-barrel)" stroke="#8B9197" strokeWidth={1.2} />
          <path d={hx2Path(ring1)} fill="none" stroke="#D5DADF" strokeWidth={2.4} opacity={0.75} />
          <path d={hx2Path(discZ(P, [l.c0[0], l.c0[1], l.c0[2] + l.len * 0.7], l.r * 1.03))} fill="none" stroke="#9EA5AB" strokeWidth={3} opacity={0.6} strokeDasharray="2 3" />
          <path d={hx2Path(discZ(P, l.c1, l.r * 0.98))} fill="#2A2F35" stroke="#C0C6CB" strokeWidth={1.6} />
        </g>,
      );
    });

  // ---------- the head: stainless sides, black control end ----------
  const steelRight = boxFace(P, pose, B, "right");
  const rear = boxFace(P, pose, B, "rear");
  const top = boxFace(P, pose, B, "top");
  const left = boxFace(P, pose, B, "left");
  const bottom = boxFace(P, pose, B, "bottom");
  const BLK = 0.16; // the black control end: the last 160 mm of the head
  if (bottom.vis) parts.push(<path key="b-bot" d={hx2Path(bottom.pts)} fill="#2A2E32" />);
  if (left.vis) parts.push(<path key="b-left" d={hx2Path(left.pts)} fill="#6B7177" />);
  if (top.vis) parts.push(<path key="b-top" d={hx2Path(top.pts)} fill="url(#hx2-steel-top)" stroke="#C8CDD2" strokeWidth={1} />);
  if (rear.vis) {
    parts.push(<path key="b-rear" d={hx2Path(rear.pts)} fill="#15171A" stroke="#2E3237" strokeWidth={1.5} />);
    // the rear control panel: rows of small coloured knobs round a big round dial, read off the photo
    parts.push(
      <Patch key="b-rear-d" P={P} o={[B.x0, B.y1, B.z0 - 0.001]} u={[B.x1 - B.x0, 0, 0]} v={[0, B.y0 - B.y1, 0]} W={320} H={360} clip={{ id: "hx2-clip-rear", pts: rear.pts }}>
        <rect x={6} y={6} width={308} height={348} rx={6} fill="none" stroke="#2C3035" strokeWidth={3} />
        <circle cx={160} cy={190} r={58} fill="#0A0B0D" stroke="#3A3F45" strokeWidth={5} />
        <circle cx={160} cy={190} r={20} fill="#22262A" />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <rect key={k} x={156} y={136 + 0} width={8} height={20} fill="#6B7177" transform={`rotate(${k * 60} 160 190)`} />
        ))}
        {["#D2372E", "#2F5FB8", "#D2372E", "#3E9A4F", "#E8E4D8"].map((c, i) => (
          <g key={i}>
            <circle cx={44} cy={96 + i * 46} r={13} fill={c} />
            <circle cx={40} cy={92 + i * 46} r={4} fill="#fff" opacity={0.45} />
            <circle cx={276} cy={96 + i * 46} r={13} fill={["#2F5FB8", "#D2372E", "#3E9A4F", "#2F5FB8", "#D2372E"][i]} />
            <circle cx={272} cy={92 + i * 46} r={4} fill="#fff" opacity={0.45} />
          </g>
        ))}
        {/* the cable socket, bottom left */}
        <circle cx={90} cy={300} r={24} fill="#0B0C0E" stroke="#8D949A" strokeWidth={4} />
      </Patch>,
    );
  }
  if (steelRight.vis) {
    parts.push(<path key="b-right" d={hx2Path(steelRight.pts)} fill="url(#hx2-steel)" />);
    // the black control end on the side
    const blk = [P([B.x1, B.y1, B.z0]), P([B.x1, B.y1, B.z0 + BLK]), P([B.x1, B.y0, B.z0 + BLK]), P([B.x1, B.y0, B.z0])];
    parts.push(<path key="b-right-blk" d={hx2Path(blk)} fill="#17191C" />);
    parts.push(
      <Patch key="b-right-d" P={P} o={[B.x1 + 0.001, B.y1, B.z0]} u={[0, 0, B.z1 - B.z0]} v={[0, B.y0 - B.y1, 0]} W={760} H={360} clip={{ id: "hx2-clip-right", pts: steelRight.pts }}>
        {/* brushed grain: long faint lines along the panel */}
        {Array.from({ length: 46 }, (_, i) => (
          <line key={i} x1={BLK * 1000 + 4} x2={756} y1={6 + i * 7.6 + hx2Rnd(i) * 3} y2={6 + i * 7.6 + hx2Rnd(i, 2) * 3} stroke={i % 3 ? "#FFFFFF" : "#2A2F34"} strokeWidth={1} opacity={0.07 + 0.06 * hx2Rnd(i, 3)} />
        ))}
        {/* the long soft highlight of the overhead light */}
        <rect x={BLK * 1000} y={40} width={600} height={70} fill="url(#hx2-sheen)" opacity={0.55} />
        {/* panel seams and screws */}
        {[BLK * 1000, 360, 560].map((x, i) => (
          <line key={i} x1={x} x2={x} y1={0} y2={360} stroke="#3C4146" strokeWidth={3} />
        ))}
        {[200, 290, 420, 510, 640, 720].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={14} r={4} fill="#5A6066" />
            <circle cx={x} cy={346} r={4} fill="#5A6066" />
          </g>
        ))}
        {/* the hinged door on the black end, with its latch */}
        <rect x={14} y={28} width={128} height={300} rx={4} fill="none" stroke="#2F3338" strokeWidth={3} />
        <rect x={120} y={160} width={12} height={40} rx={3} fill="#7E858B" />
        {/* the porthole */}
        <circle cx={250} cy={120} r={24} fill="#C3C9CE" />
        <circle cx={250} cy={120} r={17} fill="#0E1013" />
        <ellipse cx={244} cy={114} rx={7} ry={4} fill="#fff" opacity={0.7} transform="rotate(-30 244 114)" />
        {/* the RCA mark and the script, red, low on the front half */}
        <circle cx={214} cy={242} r={21} fill="#C42B23" />
        <circle cx={214} cy={242} r={16} fill="none" stroke="#F4E9E2" strokeWidth={2} />
        <path d="M210 228 L219 240 L211 241 L220 257" stroke="#F4E9E2" strokeWidth={3} fill="none" strokeLinejoin="round" />
        <text x={244} y={260} fontFamily={SCRIPT} fontSize={64} fill="#C42B23">RCA Television</text>
      </Patch>,
    );
  }

  // ---------- the hood: a rounded louvred cover on top ----------
  const hoodProf = (x: number): V3[] => {
    const pts: V3[] = [[x, B.y1, -0.17], [x, 1.575, -0.17]];
    for (let i = 0; i <= 8; i++) {
      const t = (i / 8) * (Math.PI / 2);
      pts.push([x, B.y1 + 0.115 * Math.cos(t), 0.2 + 0.1 * Math.sin(t)]);
    }
    return pts;
  };
  const hx = 0.148;
  const hr = hoodProf(hx), hl = hoodProf(-hx);
  // the top strips between the two profiles (the curved roof), drawn far to near
  for (let i = 1; i < hr.length - 1; i++) {
    const quad = [P(hl[i]), P(hr[i]), P(hr[i + 1]), P(hl[i + 1])];
    const shade = i === 1 ? "#C6CBD0" : `rgb(${190 - i * 9},${195 - i * 9},${200 - i * 9})`;
    parts.push(<path key={`hood-top${i}`} d={hx2Path(quad)} fill={shade} stroke={shade} strokeWidth={0.8} />);
  }
  if (hx2Faces([hx, 1.52, 0.05], [1, 0, 0], pose)) {
    parts.push(<path key="hood-r" d={hx2Path(hr.map(P))} fill="url(#hx2-steel)" stroke="#D5DADF" strokeWidth={1} />);
    parts.push(
      <Patch key="hood-r-d" P={P} o={[hx + 0.001, 1.575, -0.17]} u={[0, 0, 0.47]} v={[0, -0.115, 0]} W={470} H={115} clip={{ id: "hx2-clip-hood", pts: hr.map(P) }}>
        {[0, 1, 2].map((g) => (
          <g key={g}>
            {[0, 1, 2, 3].map((k) => (
              <g key={k}>
                <rect x={40 + g * 112} y={22 + k * 18} width={84} height={9} rx={4} fill="#1D2024" />
                <rect x={40 + g * 112} y={31 + k * 18} width={84} height={3} rx={1.5} fill="#E9ECEF" opacity={0.8} />
              </g>
            ))}
          </g>
        ))}
      </Patch>,
    );
  }

  // ---------- the viewfinder: black box, rubber cowl, the tube ----------
  (["right", "top", "left"] as const).forEach((s) => {
    const fc = boxFace(P, pose, VF, s);
    if (!fc.vis) return;
    parts.push(<path key={`vf-${s}`} d={hx2Path(fc.pts)} fill={s === "top" ? "url(#hx2-vf-top)" : "url(#hx2-vf-side)"} stroke="#4A5056" strokeWidth={1.4} strokeLinejoin="round" />);
    parts.push(<path key={`vf-${s}-tex`} d={hx2Path(fc.pts)} fill="#000" filter="url(#hx2-crinkle)" opacity={0.5} />);
  });
  if (hx2Faces([VF.x1, 1.55, -0.29], [1, 0, 0], pose)) {
    // the side of the viewfinder: its focus and brightness knobs, a nameplate
    parts.push(
      <Patch key="vf-r-d" P={P} o={[VF.x1 + 0.001, VF.y1, VF.z0]} u={[0, 0, VF.z1 - VF.z0]} v={[0, VF.y0 - VF.y1, 0]} W={260} H={300}>
        <rect x={60} y={40} width={140} height={26} rx={3} fill="#2E3237" stroke="#5B6167" strokeWidth={2} />
        <text x={130} y={59} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight={700} fontSize={16} letterSpacing={3} fill="#AEB4BA">VIEWFINDER</text>
        {[0, 1].map((k) => (
          <g key={k}>
            <circle cx={90 + k * 80} cy={200} r={24} fill="#0B0C0E" stroke="#6A7076" strokeWidth={3} />
            <circle cx={90 + k * 80} cy={200} r={10} fill="#3A3F45" />
            <line x1={90 + k * 80} y1={182} x2={90 + k * 80} y2={192} stroke="#C9CFD4" strokeWidth={3} />
          </g>
        ))}
      </Patch>,
    );
  }
  // the top: a bevel catching the light and the carrying handle
  if (hx2Faces([0, VF.y1, -0.29], [0, 1, 0], pose)) {
    parts.push(<Rod key="vf-handle" P={P} a={[-0.07, VF.y1 + 0.03, -0.2]} b={[0.04, VF.y1 + 0.03, -0.2]} r={0.009} />);
    parts.push(<Rod key="vf-hl" P={P} a={[-0.07, VF.y1, -0.2]} b={[-0.07, VF.y1 + 0.03, -0.2]} r={0.007} />);
    parts.push(<Rod key="vf-hr" P={P} a={[0.04, VF.y1, -0.2]} b={[0.04, VF.y1 + 0.03, -0.2]} r={0.007} />);
    const e = [P([VF.x0, VF.y1, VF.z0]), P([VF.x1, VF.y1, VF.z0]), P([VF.x1, VF.y1, VF.z1])];
    parts.push(<path key="vf-bevel" d={hx2Path(e, false)} fill="none" stroke="#8A9096" strokeWidth={2} opacity={0.7} />);
  }
  const vfRearVis = hx2Faces([0, 1.55, VF.z0], [0, 0, -1], pose);
  if (vfRearVis) {
    const C = HX2_CRT;
    const o = [P([COWL.x0, COWL.y1, COWL.z]), P([COWL.x1, COWL.y1, COWL.z]), P([COWL.x1, COWL.y0, COWL.z]), P([COWL.x0, COWL.y0, COWL.z])];
    const i4 = [P([C.x0 - 0.008, C.y1 + 0.008, VF.z0]), P([C.x1 + 0.008, C.y1 + 0.008, VF.z0]), P([C.x1 + 0.008, C.y0 - 0.008, VF.z0]), P([C.x0 - 0.008, C.y0 - 0.008, VF.z0])];
    // the cowl's four walls: the ones whose inside faces us are lit by the tube and lie beside the glass; the others
    // show us their black rubber outside and hide the edge of the glass, as a real hood does
    const lit = (k: number) => `rgb(${Math.round(14 + 62 * glow * k)},${Math.round(15 + 63 * glow * k)},${Math.round(17 + 62 * glow * k)})`;
    const walls = [
      { a: 0, b: 1, n: [0, -1, 0] as V3, c: [0, COWL.y1, (COWL.z + VF.z0) / 2] as V3, k: 0.35 },
      { a: 1, b: 2, n: [-1, 0, 0] as V3, c: [COWL.x1, (COWL.y0 + COWL.y1) / 2, (COWL.z + VF.z0) / 2] as V3, k: 0.5 },
      { a: 2, b: 3, n: [0, 1, 0] as V3, c: [0, COWL.y0, (COWL.z + VF.z0) / 2] as V3, k: 0.42 },
      { a: 3, b: 0, n: [1, 0, 0] as V3, c: [COWL.x0, (COWL.y0 + COWL.y1) / 2, (COWL.z + VF.z0) / 2] as V3, k: 0.6 },
    ].map((w) => ({ ...w, pts: [o[w.a], o[w.b], i4[w.b], i4[w.a]], inside: hx2Faces(w.c, w.n, pose) }));
    parts.push(<path key="cowl-back" d={hx2Path(o)} fill="#0C0D0F" />);
    walls.filter((w) => w.inside).forEach((w) => parts.push(<path key={`cowl-in${w.a}`} d={hx2Path(w.pts)} fill={lit(w.k)} />));
    // the tube face: the picture, mapped onto the glass
    parts.push(
      <g key="crt" transform={hx2Matrix(P([C.x0, C.y1, C.z]), P([C.x1, C.y1, C.z]), P([C.x0, C.y0, C.z]), C.W, C.H)}>
        <rect x={-10} y={-10} width={C.W + 20} height={C.H + 20} fill="#0A0C0B" />
        <g clipPath="url(#hx2-tube)">{screen}</g>
        {/* the glass: a dark curved face that keeps a reflection when the picture is gone */}
        <rect x={0} y={0} width={C.W} height={C.H} rx={46} fill="url(#hx2-glass)" />
        <path d={`M40 30 Q ${C.W * 0.35} 6 ${C.W * 0.62} 22`} stroke="#fff" strokeWidth={10} opacity={0.08} fill="none" strokeLinecap="round" />
      </g>,
    );
    walls.filter((w) => !w.inside).forEach((w) => parts.push(<path key={`cowl-out${w.a}`} d={hx2Path(w.pts)} fill="#141619" stroke="#24282C" strokeWidth={1} />));
    // the cowl's rubber lip
    parts.push(<path key="cowl-lip" d={hx2Path(o)} fill="none" stroke="#2B2F34" strokeWidth={9} strokeLinejoin="round" />);
    parts.push(<path key="cowl-lip2" d={hx2Path([o[0], o[1], o[2]], false)} fill="none" stroke="#4E545A" strokeWidth={2} />);
  }

  // ---------- the tally lamp on top: red, lit ----------
  const TL = P(HX2_TALLY_AT);
  const tr = (0.024 * HX2_F) / TL.d;
  parts.push(
    <g key="tally">
      <ellipse cx={TL.x} cy={TL.y + tr * 0.35} rx={tr * 1.35} ry={tr * 0.55} fill="#8E959B" />
      <ellipse cx={TL.x} cy={TL.y} rx={tr} ry={tr * 0.85} fill={tally > 0.05 ? HX2_TALLY : "#3B1512"} opacity={1} />
      <ellipse cx={TL.x} cy={TL.y} rx={tr} ry={tr * 0.85} fill="#5A1A15" opacity={1 - tally} />
      <ellipse cx={TL.x - tr * 0.35} cy={TL.y - tr * 0.35} rx={tr * 0.3} ry={tr * 0.2} fill="#fff" opacity={0.25 + 0.55 * tally} />
    </g>,
  );

  // ---------- the tilt handle: chrome rod back and down to a black grip ----------
  parts.push(<Rod key="handle" P={P} a={[0.1, 1.06, -0.1]} b={[0.23, 0.97, -0.46]} r={0.014} />);
  parts.push(<Rod key="grip" P={P} a={[0.22, 0.978, -0.43]} b={[0.24, 0.962, -0.52]} r={0.021} dark="#0E0F11" mid="#26292D" hi="#5D6369" />);

  // ---------- the cable and its plug ----------
  const plugW = cable.plugOut > 0 ? cable.plugFly : hx2World(HX2_PLUG, pose);
  // it drops from the socket to the floor, lies in two loose loops (the coils in the museum photo), then runs off
  // left. Creeping taut, the loops close; yanked, the whole run snaps into one straight line.
  const start = plugW;
  const end = cable.far;
  const A: V3 = [-0.42, 0, -0.15];
  const coil: V3 = [-1.0, 0, 0.25];
  const rc = 0.24 * cable.sag + 0.02;
  const raw: V3[] = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    const hang: V3 = [hx2Lerp2(start[0], A[0], t), start[1] * (1 - t) * (1 - t) + 0.01, hx2Lerp2(start[2], A[2], t * t * 0.4 + t * 0.6)];
    raw.push(hang);
  }
  for (let i = 1; i <= 40; i++) {
    const t = i / 40;
    const a = Math.PI * 0.5 + t * Math.PI * 4;
    const cx = hx2Lerp2(A[0], coil[0], Math.min(1, t * 2)) + (t > 0.5 ? (t - 0.5) * 2 * (end[0] - coil[0]) * 0.15 : 0);
    const cz = hx2Lerp2(A[2], coil[2], Math.min(1, t * 2));
    const r = rc * Math.sin(Math.PI * Math.min(1, t * 1.15));
    raw.push([cx + r * Math.cos(a) * 1.2, 0.01, cz + r * Math.sin(a)]);
  }
  const last = raw[raw.length - 1];
  for (let i = 1; i <= 10; i++) {
    const t = i / 10;
    raw.push([hx2Lerp2(last[0], end[0], t), hx2Lerp2(last[1], end[1], t), hx2Lerp2(last[2], end[2], t)]);
  }
  // taut: everything pulled onto the straight line from the plug to the far end
  const taut = 1 - cable.sag;
  const cablePts: P2[] = raw.map((q, i) => {
    const t = i / (raw.length - 1);
    const s: V3 = [hx2Lerp2(start[0], end[0], t), hx2Lerp2(start[1], end[1], t), hx2Lerp2(start[2], end[2], t)];
    return hx2Project([hx2Lerp2(q[0], s[0], taut * taut), hx2Lerp2(q[1], s[1], taut * taut), hx2Lerp2(q[2], s[2], taut * taut)], shake);
  });
  const cw = (2 * 0.016 * HX2_F) / Math.max(0.5, cablePts[4].d);
  parts.push(
    <g key="cable" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={hx2Path(cablePts, false)} stroke="#050607" strokeWidth={cw} />
      <path d={hx2Path(cablePts, false)} stroke="#3A3F45" strokeWidth={cw * 0.3} transform="translate(-1 -1.5)" opacity={0.8} />
      {/* the connector: a chrome sleeve */}
      <circle cx={cablePts[0].x} cy={cablePts[0].y} r={cw * 1.05} fill="#9AA1A7" stroke="#2C3035" strokeWidth={2} />
    </g>,
  );

  void f;
  return <g>{parts}</g>;
};

/** shared SVG defs: gradients and filters the camera uses */
export const HookX2CameraDefs: React.FC = () => (
  <defs>
    <linearGradient id="hx2-steel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#B9BFC5" />
      <stop offset="0.35" stopColor="#9DA4AA" />
      <stop offset="1" stopColor="#5B6167" />
    </linearGradient>
    <linearGradient id="hx2-steel-top" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#D3D8DC" />
      <stop offset="1" stopColor="#8F969C" />
    </linearGradient>
    <linearGradient id="hx2-vf-top" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#3A3F45" />
      <stop offset="1" stopColor="#1D2024" />
    </linearGradient>
    <linearGradient id="hx2-vf-side" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2A2E33" />
      <stop offset="1" stopColor="#141619" />
    </linearGradient>
    <filter id="hx2-crinkle" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.62  0 0 0 0 0.66  0 0 0 0.9 -0.42" result="a" />
      <feComposite in="a" in2="SourceGraphic" operator="in" />
    </filter>
    <linearGradient id="hx2-sheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0" />
      <stop offset="0.5" stopColor="#fff" stopOpacity="0.45" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="hx2-bell" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#3B4044" />
      <stop offset="0.45" stopColor="#6C7378" />
      <stop offset="0.7" stopColor="#879095" />
      <stop offset="1" stopColor="#4A5055" />
    </linearGradient>
    <linearGradient id="hx2-cast" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#7D858B" />
      <stop offset="1" stopColor="#555C62" />
    </linearGradient>
    <linearGradient id="hx2-barrel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#4A5056" />
      <stop offset="0.45" stopColor="#8C939A" />
      <stop offset="1" stopColor="#2B2F34" />
    </linearGradient>
    <radialGradient id="hx2-glass" cx="0.5" cy="0.5" r="0.72">
      <stop offset="0.55" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.85" />
    </radialGradient>
    <clipPath id="hx2-tube">
      <rect x={0} y={0} width={HX2_CRT.W} height={HX2_CRT.H} rx={46} />
    </clipPath>
    <filter id="hx2-soft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="18" />
    </filter>
    <filter id="hx2-hammer" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" seed="4" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.4 -0.55" result="a" />
      <feComposite in="a" in2="SourceGraphic" operator="in" />
    </filter>
  </defs>
);
