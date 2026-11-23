// The big chance disc standing on its edge on the maple, read as a measuring cup: its front face fills white from the
// bottom (points), a grey league level can sit across it, and the lacquered boards mirror it.
import React from "react";
import { interpolateColors } from "remotion";
import {
  TSD_BOARD,
  TSD_R,
  TSD_T,
  trueShootingDiscPoly as poly,
  trueShootingDiscPose,
  trueShootingDiscProject as proj,
  tsdDot,
  tsdRand,
  tsdUnit,
  type TrueShootingDiscCam,
  type TSV3,
} from "./TrueShootingDiscWorld";

const LIGHT: TSV3 = tsdUnit([-0.45, -0.55, 0.7]);
const SEG = 120;

export type TrueShootingDiscState = {
  tilt: number;
  yaw: number;
  lift?: number;
  white: number; // 0..1 of the height, filled white
  grey: number; // 0..1, the league level
  greyO: number; // how far the fill below the league level has turned grey
  dimAbove: number; // the gold above the white dims at the end
  wave: number; // the surface's slosh amplitude, ft
  sheen: number; // 0..1, a light band travelling up the face
  flash: number; // brim flash
  t: number; // frame, for the slosh phase
};

const shade = (n: TSV3, dark: string, lit: string) => interpolateColors(Math.max(0, tsdDot(n, LIGHT)), [0, 1], [dark, lit]);

/** the floor: honey maple strips running away from the camera, staggered end joints, a free throw line and the
 *  Spurs-black paint beyond it, all faded into the navy by one pool of arena light round the disc */
export const TrueShootingDiscFloor: React.FC<{ cam: TrueShootingDiscCam; sweep: number }> = ({ cam, sweep }) => {
  const strips: React.ReactNode[] = [];
  const X0 = -4.2;
  const n = Math.ceil(8.4 / TSD_BOARD);
  let k = 0;
  for (let i = 0; i < n; i++) {
    const x0 = X0 + i * TSD_BOARD;
    const x1 = x0 + TSD_BOARD;
    let y = -2.4 - tsdRand(i) * 2.5;
    while (y < 3.1) {
      const len = 1.6 + tsdRand(i * 31 + k) * 3.4;
      const y1 = Math.min(3.1, y + len);
      const r = tsdRand(i * 7 + k * 13);
      const tone = interpolateColors(r, [0, 0.5, 1], ["#B9844F", "#D4A26B", "#E2B784"]);
      const d = poly(cam, [
        [x0, y, 0],
        [x1, y, 0],
        [x1, y1, 0],
        [x0, y1, 0],
      ]);
      if (d) strips.push(<path key={`b${i}-${k}`} d={d} fill={tone} stroke="#8E5F33" strokeOpacity={0.55} strokeWidth={0.8} />);
      y = y1;
      k++;
    }
  }
  // the free throw line (2 in) and the painted lane behind it
  const lineY = 2.35;
  const paint = poly(cam, [
    [-4.2, lineY + 2 / 12, 0],
    [4.2, lineY + 2 / 12, 0],
    [4.2, 3.1, 0],
    [-4.2, 3.1, 0],
  ]);
  const line = poly(cam, [
    [-4.2, lineY, 0],
    [4.2, lineY, 0],
    [4.2, lineY + 2 / 12, 0],
    [-4.2, lineY + 2 / 12, 0],
  ]);
  const base = proj(cam, [0, 0.2, 0]);
  const sw = proj(cam, [-3 + sweep * 6, 0.6, 0]);
  return (
    <g>
      <defs>
        <radialGradient id="tsd-pool" gradientUnits="userSpaceOnUse" cx={base.x} cy={base.y - 20} r={560} gradientTransform={`translate(${base.x} ${base.y - 20}) scale(1 0.42) translate(${-base.x} ${-(base.y - 20)})`}>
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="tsd-pool-m">
          <rect x={0} y={0} width={1080} height={1920} fill="url(#tsd-pool)" />
        </mask>
        <radialGradient id="tsd-sheen" gradientUnits="userSpaceOnUse" cx={sw.x} cy={sw.y} r={240}>
          <stop offset="0" stopColor="#FFF3DC" stopOpacity="0.32" />
          <stop offset="1" stopColor="#FFF3DC" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g mask="url(#tsd-pool-m)">
        {strips}
        {paint && <path d={paint} fill="#0B0B0C" />}
        {line && <path d={line} fill="#F2F2EE" />}
        {/* lacquer: the arena light lying on the boards, travelling slowly */}
        <rect x={0} y={0} width={1080} height={1920} fill="url(#tsd-sheen)" />
      </g>
    </g>
  );
};

export const TrueShootingDiscSolid: React.FC<{ cam: TrueShootingDiscCam; s: TrueShootingDiscState; ball?: React.ReactNode; mirror?: boolean }> = ({ cam, s, ball }) => {
  const pose = trueShootingDiscPose(s.tilt, s.yaw, s.lift ?? 0);
  const W = TSD_T / 2;
  const R = TSD_R;
  const vW = -R + 2 * R * s.white;
  const vG = -R + 2 * R * s.grey;
  const angles = Array.from({ length: SEG + 1 }, (_, i) => (i / SEG) * Math.PI * 2);

  // edge: quads round the rim, only the ones that face the eye, far first
  type Q = { d: string; fill: string; depth: number };
  const quads: Q[] = [];
  for (let i = 0; i < SEG; i++) {
    const a0 = angles[i];
    const a1 = angles[i + 1];
    const am = (a0 + a1) / 2;
    const c = pose.at(R * Math.cos(am), R * Math.sin(am), 0);
    const o = pose.at(0, 0, 0);
    const nrm = tsdUnit([c[0] - o[0], c[1] - o[1], c[2] - o[2]]);
    const toEye = [cam.eye[0] - c[0], cam.eye[1] - c[1], cam.eye[2] - c[2]] as TSV3;
    if (tsdDot(nrm, toEye) <= 0) continue;
    const v = R * Math.sin(am);
    const col =
      v <= vG && s.greyO > 0
        ? interpolateColors(s.greyO, [0, 1], [shade(nrm, "#9AA0A6", "#FFFFFF"), shade(nrm, "#3A4048", "#8B949E")])
        : v <= vW
          ? shade(nrm, "#9AA0A6", "#FFFFFF")
          : shade(nrm, "#5E3E0B", "#D89A2C");
    const d = poly(cam, [
      pose.at(R * Math.cos(a0), R * Math.sin(a0), -W),
      pose.at(R * Math.cos(a1), R * Math.sin(a1), -W),
      pose.at(R * Math.cos(a1), R * Math.sin(a1), W),
      pose.at(R * Math.cos(a0), R * Math.sin(a0), W),
    ]);
    if (d) quads.push({ d, fill: col, depth: Math.hypot(...toEye) });
  }
  quads.sort((a, b) => b.depth - a.depth);

  const face = poly(cam, angles.map((a) => pose.at(R * Math.cos(a), R * Math.sin(a), W)));
  const inner = poly(cam, angles.map((a) => pose.at(R * 0.93 * Math.cos(a), R * 0.93 * Math.sin(a), W)));
  // the fill below a level: the arc under it, closed by a sloshing surface
  const below = (lv: number, wave: number) => {
    if (lv <= -R + 1e-4) return "";
    const L = Math.min(R, lv);
    const al = Math.asin(Math.max(-1, Math.min(1, L / R)));
    const a0 = Math.PI - al;
    const a1 = Math.PI * 2 + al;
    const pts: TSV3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = a0 + ((a1 - a0) * i) / 64;
      pts.push(pose.at(R * Math.cos(a), R * Math.sin(a), W));
    }
    if (L < R - 1e-3) {
      const half = Math.sqrt(Math.max(0, R * R - L * L));
      for (let i = 1; i < 24; i++) {
        const u = half - (2 * half * i) / 24;
        const ww = wave * Math.sin(u * 7 + s.t * 0.35) * Math.sqrt(Math.max(0, 1 - (u / half) ** 2));
        pts.push(pose.at(u, L + ww, W));
      }
    }
    return poly(cam, pts);
  };
  const whiteD = below(vW, s.wave);
  const greyD = s.greyO > 0 ? below(vG, 0) : "";
  // above the white: dimmed at the end so the band is the only bright thing
  const aboveD = (() => {
    if (s.dimAbove <= 0 || vW >= R) return "";
    const al = Math.asin(Math.max(-1, Math.min(1, vW / R)));
    const pts: TSV3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = al + ((Math.PI - 2 * al) * i) / 64;
      pts.push(pose.at(R * Math.cos(a), R * Math.sin(a), W));
    }
    return poly(cam, pts);
  })();

  const c = proj(cam, pose.at(0, 0, W));
  const top = proj(cam, pose.at(0, R, W));
  const sc = c.ok ? Math.abs(c.y - top.y) : 200;
  const fN = pose.N;
  const faceLit = shade(fN, "#B07A1E", "#F7C350");

  // contact shadow: the disc cast on the boards along the light, soft
  const shadowD = poly(
    cam,
    angles.map((a) => {
      const p = pose.at(R * Math.cos(a), R * Math.sin(a), 0);
      const k = p[2] / LIGHT[2];
      return [p[0] - k * LIGHT[0] * 0.35, p[1] - k * LIGHT[1] * 0.35 + 0.05, 0.001] as TSV3;
    }),
  );
  // the lacquer's reflection: the face mirrored under the floor
  const reflD = poly(
    cam,
    angles.map((a) => {
      const p = pose.at(R * Math.cos(a), R * Math.sin(a), W);
      return [p[0], p[1], -p[2]] as TSV3;
    }),
  );
  const sheenY = c.y + sc - s.sheen * sc * 2.6;
  const levelPt = (lv: number, u: number) => proj(cam, pose.at(u, lv, W));

  return (
    <g>
      <defs>
        <clipPath id="tsd-face-clip">{face && <path d={face} />}</clipPath>
        <radialGradient id="tsd-face-g" gradientUnits="userSpaceOnUse" cx={c.x - sc * 0.45} cy={c.y - sc * 0.5} r={sc * 1.7}>
          <stop offset="0" stopColor="#FFE3A0" stopOpacity="0.75" />
          <stop offset="0.45" stopColor={faceLit} stopOpacity="0" />
          <stop offset="1" stopColor="#6E4A0E" stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id="tsd-white-g" gradientUnits="userSpaceOnUse" x1={c.x - sc} y1={c.y - sc} x2={c.x + sc} y2={c.y + sc}>
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D5DAE0" />
        </linearGradient>
        <linearGradient id="tsd-sheen-g" gradientUnits="userSpaceOnUse" x1={0} y1={sheenY - 70} x2={0} y2={sheenY + 70}>
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tsd-refl-fade" gradientUnits="userSpaceOnUse" x1={0} y1={c.y + sc} x2={0} y2={c.y + sc * 1.9}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="tsd-refl-m">
          <rect x={0} y={0} width={1080} height={1920} fill="url(#tsd-refl-fade)" />
        </mask>
      </defs>
      {reflD && (
        <g mask="url(#tsd-pool-m)">
          <g mask="url(#tsd-refl-m)" opacity={0.42 * Math.max(0, 1 - s.tilt * 1.6)}>
            <path d={reflD} fill={faceLit} style={{ filter: "blur(5px)" }} />
          </g>
        </g>
      )}
      {shadowD && <path d={shadowD} fill="#2A1504" opacity={0.6} style={{ filter: "blur(14px)" }} />}
      {quads.map((q, i) => (
        <path key={i} d={q.d} fill={q.fill} stroke={q.fill} strokeWidth={0.8} strokeLinejoin="round" />
      ))}
      {ball}
      {face && (
        <>
          <path d={face} fill={faceLit} />
          <path d={face} fill="url(#tsd-face-g)" />
          <g clipPath="url(#tsd-face-clip)">
            {/* spun satin: faint concentric turning marks, as on a machined face */}
            {Array.from({ length: 14 }, (_, i) => {
              const rr = R * (0.12 + i * 0.06);
              const d = poly(cam, angles.filter((_, j) => j % 3 === 0).map((a) => pose.at(rr * Math.cos(a), rr * Math.sin(a), W)));
              return d ? <path key={i} d={d} fill="none" stroke="#FFF1C8" strokeOpacity={0.05 + (i % 3) * 0.025} strokeWidth={1.2} /> : null;
            })}
            {whiteD && <path d={whiteD} fill="url(#tsd-white-g)" />}
            {whiteD && <path d={whiteD} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.9} />}
            {greyD && <path d={greyD} fill="#6E7681" opacity={s.greyO} />}
            {aboveD && <path d={aboveD} fill="#0D1117" opacity={0.45 * s.dimAbove} />}
            <rect x={0} y={sheenY - 70} width={1080} height={140} fill="url(#tsd-sheen-g)" />
            {s.flash > 0 && <path d={face} fill="#FFFFFF" opacity={0.35 * s.flash} />}
          </g>
          {/* the bevel: a darker ring a little inside the rim, a lit lip on the top left */}
          {inner && <path d={inner} fill="none" stroke="#8A5A10" strokeOpacity={0.45} strokeWidth={Math.max(1.5, sc * 0.012)} />}
          <path d={face} fill="none" stroke="#B57F1C" strokeWidth={Math.max(1.5, sc * 0.016)} />
          {s.white > 0.001 && s.white < 0.999 && (() => {
            const h = Math.sqrt(Math.max(0, R * R - vW * vW));
            const a = levelPt(vW, -h);
            const b = levelPt(vW, h);
            return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={8} style={{ filter: "blur(6px)" }} />;
          })()}
        </>
      )}
    </g>
  );
};

/** a basketball: pebbled orange leather, eight black channels seen as the four curves of a real ball, turning */
export const TrueShootingDiscBall: React.FC<{ x: number; y: number; r: number; rot: number; o: number }> = ({ x, y, r, rot, o }) => {
  if (o <= 0) return null;
  const dots = Array.from({ length: 90 }, (_, i) => {
    const a = tsdRand(i * 3.1) * Math.PI * 2;
    const d = Math.sqrt(tsdRand(i * 5.7)) * r * 0.95;
    return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={1.4} fill="#5A2209" opacity={0.28} />;
  });
  return (
    <g opacity={o}>
      <defs>
        <radialGradient id="tsd-ball" cx={0.36} cy={0.32} r={0.75}>
          <stop offset="0" stopColor="#F59A55" />
          <stop offset="0.55" stopColor="#D2611F" />
          <stop offset="1" stopColor="#6A2A0B" />
        </radialGradient>
        <clipPath id="tsd-ball-clip">
          <circle cx={x} cy={y} r={r} />
        </clipPath>
      </defs>
      <ellipse cx={x + r * 0.15} cy={y + r * 0.2} rx={r} ry={r} fill="#000" opacity={0.3} style={{ filter: "blur(10px)" }} />
      <circle cx={x} cy={y} r={r} fill="url(#tsd-ball)" />
      <g clipPath="url(#tsd-ball-clip)">
        {dots}
        <g transform={`rotate(${rot} ${x} ${y})`} fill="none" stroke="#1A0D06" strokeWidth={r * 0.055} strokeLinecap="round">
          <line x1={x - r} y1={y} x2={x + r} y2={y} />
          <line x1={x} y1={y - r} x2={x} y2={y + r} />
          <path d={`M ${x - r * 0.72} ${y - r * 0.72} Q ${x - r * 0.25} ${y} ${x - r * 0.72} ${y + r * 0.72}`} />
          <path d={`M ${x + r * 0.72} ${y - r * 0.72} Q ${x + r * 0.25} ${y} ${x + r * 0.72} ${y + r * 0.72}`} />
        </g>
        <circle cx={x - r * 0.35} cy={y - r * 0.4} r={r * 0.35} fill="#FFFFFF" opacity={0.14} style={{ filter: "blur(6px)" }} />
      </g>
    </g>
  );
};
