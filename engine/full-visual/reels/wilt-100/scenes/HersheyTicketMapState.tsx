// wilt-100 "hershey": PENNSYLVANIA, drawn from real coordinates (HersheyTicketMapKit): the border draws in as one
// line on "but in", the Susquehanna runs through it, Philadelphia and New York sit as small grey dots at the right,
// and the amber pin drops on Hershey with a bounce. On "Pennsylvania" the state fills a shade lighter and the camera
// pushes in on the pin; on "the chocolate" it dives through the pin into the town.
import React from "react";
import { draw, ease, mix, prog } from "../../../src/engine";
import {
  HTM_AMBER, HTM_CITIES, HTM_DIM, HTM_PA, HTM_SUSQ, HTM_WBRANCH, type HersheyT, htmClamp, htmMap, htmMapCam, htmPath, htmRnd,
  } from "./HersheyTicketMapKit";

// The Ridge-and-Valley: the long Appalachian folds that sweep across the middle of the state in one curve, from the
// Maryland line north-north-east, then bending east toward the Water Gap and the Wyoming Valley. Read from real
// coordinates: the south-east edge is Blue (Kittatinny) Mountain, the north-west edge the Allegheny Front. The folds
// between them are interpolated across the belt with a small zig-zag where the real ridges plunge and turn.
const HTM_BLUE_MTN: [number, number][] = [
  [-77.95, 39.72], [-77.82, 39.95], [-77.62, 40.15], [-77.3, 40.26], [-77.0, 40.35], [-76.9, 40.36], [-76.5, 40.46],
  [-76.0, 40.56], [-75.6, 40.71], [-75.13, 40.97],
];
const HTM_ALLEGHENY_FRONT: [number, number][] = [
  [-78.75, 39.72], [-78.66, 40.0], [-78.45, 40.4], [-78.2, 40.7], [-77.85, 40.95], [-77.4, 41.12], [-77.0, 41.2],
  [-76.6, 41.24], [-76.2, 41.26], [-75.75, 41.25],
];
// the Pennsylvania Turnpike as it ran in 1962, Ohio line to the Delaware River bridge
const HTM_TURNPIKE: [number, number][] = [
  [-80.52, 40.9], [-80.25, 40.78], [-80.1, 40.69], [-79.95, 40.55], [-79.77, 40.43], [-79.6, 40.22], [-79.3, 40.08],
  [-79.08, 40.01], [-78.5, 40.02], [-78.24, 39.99], [-77.9, 40.05], [-77.5, 40.15], [-77.18, 40.2], [-76.95, 40.2],
  [-76.65, 40.2], [-76.3, 40.18], [-75.9, 40.2], [-75.6, 40.12], [-75.45, 40.09], [-75.2, 40.12], [-74.85, 40.13],
];
/** a polyline resampled at a fraction t of its length */
function htmAlong(pts: [number, number][], t: number): [number, number] {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let d = t * seg.reduce((a, b) => a + b, 0);
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? Math.min(1, d / seg[i]) : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    d -= seg[i];
  }
  return pts[pts.length - 1];
}
/** the folds: each a curve across the belt at depth u, over a part [t0, t1] of its length */
const HTM_FOLDS = Array.from({ length: 15 }, (_, j) => {
  const u = (j + 0.5) / 15;
  const t0 = 0.02 + htmRnd(j + 11) * 0.22;
  const t1 = 0.7 + htmRnd(j + 31) * 0.28;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 48; i++) {
    const t = t0 + ((t1 - t0) * i) / 48;
    const a = htmAlong(HTM_BLUE_MTN, t);
    const b = htmAlong(HTM_ALLEGHENY_FRONT, t);
    // the zig-zag of plunging folds, strongest in the middle of the belt
    const wob = Math.sin(t * 22 + j * 1.7) * 0.035 * Math.sin(u * Math.PI) + Math.sin(t * 9 + j) * 0.015;
    const uu = Math.min(0.99, Math.max(0.01, u + wob));
    pts.push([a[0] + (b[0] - a[0]) * uu, a[1] + (b[1] - a[1]) * uu]);
  }
  return { pts, u, j };
});

export const HersheyTicketMapState: React.FC<{ f: number; T: HersheyT }> = ({ f, T }) => {
  const start = T.but - 8;
  if (f < start - 2) return null;
  const cam = htmMapCam(f, T);
  const fade = 1 - prog(f, T.chocolate - 2, 12, ease.in);
  if (fade <= 0) return null;
  const [hx, hy] = htmMap(HTM_CITIES.hershey);
  // camera: a scale about the pin, the pin carried to where the cam puts it
  const tf = `translate(${cam.pin.x.toFixed(2)} ${cam.pin.y.toFixed(2)}) scale(${cam.s.toFixed(4)}) translate(${(-hx).toFixed(2)} ${(-hy).toFixed(2)})`;
  const outline = draw(f, start, T.hershey - start - 2);
  const fillK = prog(f, T.hershey - 6, 10, ease.out);
  const lighter = prog(f, T.penn, 10, ease.out);
  const riverK = draw(f, T.hershey - 4, 20);
  const sw = 1 / cam.s; // keep lines thin while the camera pushes in

  // the pin: drops on "Hershey" with a bounce, stays the size of a pin while the map grows under it
  const drop = prog(f, T.hershey - 6, 8, ease.in);
  const bounce = f < T.hershey + 2 ? 0 : Math.sin(htmClamp((f - T.hershey - 2) / 10) * Math.PI) * 14 * (1 - htmClamp((f - T.hershey - 2) / 10));
  const pinY = (1 - drop) * -260 - bounce;
  const ring = prog(f, T.hershey + 2, 26, ease.out);

  const dot = (c: [number, number], name: string, anchor: "start" | "end", dx: number, dy: number, at: number, leave = 1) => {
    const [x, y] = htmMap(c);
    const k = prog(f, at, 8, ease.out) * leave;
    return (
      <g opacity={k}>
        <circle cx={x} cy={y} r={7 * sw} fill={HTM_DIM} />
        <text x={x + dx * sw} y={y + dy * sw} textAnchor={anchor} fontFamily="Inter, sans-serif" fontWeight={500} fontSize={32 * sw} fill={HTM_DIM}>{name}</text>
      </g>
    );
  };

  return (
    <g opacity={fade}>
      <defs>
        <clipPath id="htm-pa-clip"><path d={htmPath(HTM_PA, true)} /></clipPath>
        <radialGradient id="htm-pin-glow">
          <stop offset="0" stopColor={HTM_AMBER} stopOpacity={0.55} />
          <stop offset="1" stopColor={HTM_AMBER} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={tf}>
        <path d={htmPath(HTM_PA, true)} fill={mix(f, T.penn, 10, "#18222E", "#26364A")} opacity={fillK * (0.85 + 0.15 * lighter)} />
        {/* the ridge-and-valley folds, clipped to the state: a lit crest and its shadow side, like a relief map */}
        <g clipPath="url(#htm-pa-clip)" opacity={fillK}>
          <path d={htmPath([...HTM_BLUE_MTN, ...[...HTM_ALLEGHENY_FRONT].reverse()], true)} fill="#2E4258" opacity={0.28 + 0.12 * lighter} />
          {HTM_FOLDS.map((r) => {
            const k = draw(f, T.but + 2 + r.j * 1.2, 22);
            return (
              <g key={r.j}>
                <path d={htmPath(r.pts)} fill="none" stroke="#0C131B" strokeWidth={4.2 * sw} strokeLinecap="round" transform={`translate(${(1.6 * sw).toFixed(3)} ${(2.2 * sw).toFixed(3)})`} opacity={0.55} {...k} />
                <path d={htmPath(r.pts)} fill="none" stroke="#7F95AB" strokeWidth={1.6 * sw} strokeLinecap="round" opacity={0.42 + 0.2 * htmRnd(r.j + 5)} {...k} />
              </g>
            );
          })}
        </g>
        {/* the Turnpike, 1962: a thin double line from Ohio to the Delaware, passing just south of Hershey */}
        <g opacity={0.75 * prog(f, T.hershey - 2, 10, ease.out) * (1 - 0.6 * htmClamp(cam.k1 * 2))}>
          <path d={htmPath(HTM_TURNPIKE)} fill="none" stroke="#5E6873" strokeWidth={4 * sw} strokeLinejoin="round" {...draw(f, T.hershey - 2, 24)} />
          <path d={htmPath(HTM_TURNPIKE)} fill="none" stroke="#18222E" strokeWidth={1.6 * sw} strokeLinejoin="round" {...draw(f, T.hershey - 2, 24)} />
          <text x={htmMap([-80.12, 40.9])[0]} y={htmMap([-80.12, 40.9])[1]} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={500} fontSize={24 * sw} fill="#8B949E" transform={`rotate(22 ${htmMap([-80.12, 40.9])[0]} ${htmMap([-80.12, 40.9])[1]})`}>Turnpike</text>
        </g>
        {(() => {
          const [lx, ly] = htmMap([-78.12, 40.74]);
          return (
            <text x={lx} y={ly} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={500} fontStyle="italic" fontSize={26 * sw} fill="#9AA7B4"
              stroke="#162130" strokeWidth={7 * sw} strokeLinejoin="round" paintOrder="stroke"
              opacity={0.9 * prog(f, T.but + 12, 10, ease.out) * (1 - htmClamp(cam.k1 * 3))} transform={`rotate(-42 ${lx} ${ly})`}>Appalachian ridges</text>
          );
        })()}
        <path d={htmPath(HTM_SUSQ)} fill="none" stroke="#6E7F90" strokeWidth={2.4 * sw} strokeLinejoin="round" {...riverK} opacity={0.8} />
        <path d={htmPath(HTM_WBRANCH)} fill="none" stroke="#6E7F90" strokeWidth={2 * sw} strokeLinejoin="round" {...riverK} opacity={0.7} />
        <path d={htmPath(HTM_PA, true)} fill="none" stroke="#E6EDF3" strokeWidth={3.2 * sw} strokeLinejoin="round" {...outline} />
        {dot(HTM_CITIES.pittsburgh, "Pittsburgh", "start", 16, -16, T.hershey + 6, 1 - htmClamp(cam.k1 * 3))}
        {dot(HTM_CITIES.philadelphia, "Philadelphia", "end", -16, -16, T.hershey + 4)}
        {dot(HTM_CITIES.newyork, "New York", "end", 20, 48, T.hershey + 8, 1 - htmClamp(cam.k1 * 3))}
        <g opacity={prog(f, T.penn, 8, ease.out) * (1 - prog(f, T.the - 4, 8))}>
          <text x={htmMap([-77.0, 40.0])[0]} y={htmMap([-77.0, 40.0])[1]} textAnchor="end" fontFamily="Inter, sans-serif" fontWeight={600} fontSize={34 * sw} letterSpacing={8 * sw} fill="#C9D1D9" stroke="#1E2C3C" strokeWidth={9 * sw} strokeLinejoin="round" paintOrder="stroke" opacity={0.8}>PENNSYLVANIA</text>
        </g>
      </g>
      {/* the pin, in frame space so it stays a pin while the map grows */}
      {f >= T.hershey - 6 && (
        <g transform={`translate(${cam.pin.x.toFixed(2)} ${cam.pin.y.toFixed(2)})`}>
          <circle r={70 * ring + 6} fill="none" stroke={HTM_AMBER} strokeWidth={3} opacity={(1 - ring) * 0.8} />
          <circle r={46} fill="url(#htm-pin-glow)" />
          <ellipse cx={0} cy={2} rx={10 * drop} ry={4 * drop} fill="#000" opacity={0.5} />
          <g transform={`translate(0 ${pinY.toFixed(1)})`}>
            <path d="M0,0 C-6,-14 -20,-26 -20,-42 A20,20 0 1 1 20,-42 C20,-26 6,-14 0,0 Z" fill={HTM_AMBER} stroke="#7A5512" strokeWidth={1.5} />
            <circle cx={0} cy={-42} r={7.5} fill="#5A3E0C" />
            <ellipse cx={-7} cy={-50} rx={5} ry={7} fill="#fff" opacity={0.35} />
          </g>
          <g opacity={prog(f, T.hershey + 2, 7, ease.out) * (1 - prog(f, T.the, 8))}>
            <text x={30} y={-34} fontFamily="Inter, sans-serif" fontWeight={600} fontSize={40} fill="#F0F3F6">Hershey</text>
          </g>
        </g>
      )}
    </g>
  );
};
