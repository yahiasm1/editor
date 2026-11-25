// The basket of `clank`: the same basket as `picture` (PictureCourtBasket: padded stanchion, arm, glass with its white
// border and shooter's square, orange bracket and ring, the 12-cord diamond net), drawn in two layers so a ball can
// pass between the back iron and the front iron, and alive: `kick` stretches the net down as a ball swishes through,
// `shiver` rattles the ring after a front-rim clank, `bend` drops the front of a breakaway ring under a dunk
// (pivoting at the bracket, 0.45 ft of travel at the front, as a breakaway rim gives) and springs it back.
import React from "react";
import { PC_BASE, PC_BOARD_Y, pcArc as arc, pcPoly as poly, pcPoly3 as poly3, type PcProj } from "./PictureCourtWorld";

export type ClankSideOnRim = { kick: number; sway: number; shiver: number; bend: number; f: number };

/** height of the ring at a point of it: the front drops under a dunk, the whole ring rattles after a clank */
export const clankSideOnRingZ = (y: number, a: number, r: ClankSideOnRim) =>
  10 - r.bend * 0.45 * ((y + 0.75) / 1.5) + r.shiver * 0.06 * Math.sin(r.f * 2.3 + a * 2);

const openPath = (P: PcProj, pts: [number, number, number][]) => {
  let d = "";
  let pen = false;
  for (const [x, y, z] of pts) {
    const v = P.cam(x, y, z);
    if (v[2] < 0.6) { pen = false; continue; }
    const q = P.scr(v);
    d += `${pen ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    pen = true;
  }
  return d;
};

const ringPts = (r: ClankSideOnRim, R: number, a0: number, a1: number, n = 40, dz = 0): [number, number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    const x = R * Math.cos(a), y = R * Math.sin(a);
    return [x, y, clankSideOnRingZ(y, a, r) + dz];
  });

/** the board, stanchion, bracket and the back half of the ring (the half away from the camera, x > 0) */
export const ClankSideOnBasketBack: React.FC<{ P: PcProj; rim: ClankSideOnRim; dim: number }> = ({ P, rim, dim }) => {
  const B = PC_BOARD_Y;
  const s10 = P.p(0, 0, 10).s;
  const arm = poly3(P, [[-0.35, PC_BASE - 4, 12.2], [0.35, PC_BASE - 4, 12.2], [0.35, B - 0.6, 11.4], [-0.35, B - 0.6, 11.4]]);
  const armLow = poly3(P, [[-0.3, PC_BASE - 4.5, 0], [0.3, PC_BASE - 4.5, 0], [0.3, PC_BASE - 4.2, 12.4], [-0.3, PC_BASE - 4.2, 12.4]]);
  const pad = poly3(P, [[-2, PC_BASE - 6.5, 0], [2, PC_BASE - 6.5, 0], [2, PC_BASE - 3.6, 0], [-2, PC_BASE - 3.6, 0]]);
  const padTop = poly3(P, [[-2, PC_BASE - 6.5, 3.2], [2, PC_BASE - 6.5, 3.2], [2, PC_BASE - 3.6, 3.2], [-2, PC_BASE - 3.6, 3.2]]);
  const padFront = poly3(P, [[-2, PC_BASE - 3.6, 0], [2, PC_BASE - 3.6, 0], [2, PC_BASE - 3.6, 3.2], [-2, PC_BASE - 3.6, 3.2]]);
  const padSide = poly3(P, [[-2, PC_BASE - 6.5, 0], [-2, PC_BASE - 3.6, 0], [-2, PC_BASE - 3.6, 3.2], [-2, PC_BASE - 6.5, 3.2]]);
  // the glass has a thickness (1/2 in) and an aluminium edge: seen edge-on it is a bright sliver, not a line
  const board = poly3(P, [[-3, B, 9.5], [3, B, 9.5], [3, B, 13], [-3, B, 13]]);
  const edge = poly3(P, [[-3, B, 9.5], [-3, B - 0.05, 9.5], [-3, B - 0.05, 13], [-3, B, 13]]);
  const frame = (w: number) => poly3(P, [[-3 + w, B, 9.5 + w], [3 - w, B, 9.5 + w], [3 - w, B, 13 - w], [-3 + w, B, 13 - w]]);
  const sq = poly3(P, [[-1, B - 0.01, 10], [1, B - 0.01, 10], [1, B - 0.01, 11.5], [-1, B - 0.01, 11.5]]);
  // the bracket: the back of the ring is bolted to it, so it tilts with a bending ring
  const bz = clankSideOnRingZ(-0.62, 0, rim);
  const bracket = poly3(P, [[-0.3, B, 9.85], [0.3, B, 9.85], [0.25, -0.62, bz - 0.05], [-0.25, -0.62, bz - 0.05]]);
  const bracketTop = poly3(P, [[-0.3, B, 10.0], [0.3, B, 10.0], [0.25, -0.62, bz + 0.02], [-0.25, -0.62, bz + 0.02]]);
  const sw = Math.max(1.2, s10 * 0.07);
  const k = 1 - dim * 0.55;
  const back = openPath(P, ringPts(rim, 0.75, -Math.PI / 2, Math.PI / 2));
  const boardShadow = poly(P, [[-3, B + 2.24], [3, B + 2.24], [3, B + 3.06], [-3, B + 3.06]]);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={boardShadow} fill="#000" opacity={0.06 * k} />
      <path d={pad} fill="#1A1D24" />
      <path d={padTop} fill="#2B2F38" />
      <path d={padSide} fill="#3C2A5C" />
      <path d={padFront} fill="#552583" opacity={0.9 * k + 0.1} />
      <path d={armLow} fill="#2E333C" />
      <path d={arm} fill="#3A404A" />
      <path d={board} fill="rgba(210,228,255,0.16)" />
      <path d={edge} fill="#C9D3DC" opacity={0.8} />
      <path d={frame(0)} fill="none" stroke="#9AA3AE" strokeWidth={sw * 0.9} />
      <path d={frame(0.17)} fill="none" stroke="#F4F6F8" strokeWidth={sw * 1.1} opacity={0.9} />
      <path d={sq} fill="none" stroke="#F4F6F8" strokeWidth={sw * 1.2} />
      <path d={poly3(P, [[-2.6, B - 0.02, 12.6], [-1.6, B - 0.02, 12.6], [-2.4, B - 0.02, 9.9], [-2.9, B - 0.02, 9.9]])} fill="#FFFFFF" opacity={0.08 * k} />
      <path d={bracket} fill="#A83A14" />
      <path d={bracketTop} fill="#C9461A" />
      <path d={back} fill="none" stroke="#B94416" strokeWidth={sw * 1.2} strokeLinecap="round" />
    </svg>
  );
};

/** the net and the front half of the ring, drawn over anything passing through */
export const ClankSideOnBasketFront: React.FC<{ P: PcProj; rim: ClankSideOnRim; dim: number }> = ({ P, rim, dim }) => {
  const s10 = P.p(0, 0, 10).s;
  const sw = Math.max(1.2, s10 * 0.07);
  const k = 1 - dim * 0.55;
  const { f, kick, sway } = rim;
  // the net: 12 cords from the ring hooks, knotted into diamonds over four rows down to 8.5 ft; a swish stretches it
  // down and narrows the bottom, then it ripples back
  const rows = [{ r: 0.75, z: 0 }, { r: 0.66, z: -0.4 }, { r: 0.57, z: -0.8 }, { r: 0.5, z: -1.15 }, { r: 0.44, z: -1.5 }];
  const np = (row: number, kk: number) => {
    const R = rows[row];
    const a = ((kk + (row % 2) * 0.5) / 12) * Math.PI * 2;
    const st = row / 4;
    const rr = R.r * (1 - 0.22 * kick * st);
    const sx = sway * st * Math.sin(f / 3 + kk * 0.7) * 0.25;
    const x = rr * Math.cos(a) + sx, y = rr * Math.sin(a) + sway * st * 0.3;
    const top = clankSideOnRingZ(row === 0 ? y : R.r * Math.sin(a), a, rim);
    return P.p(x, y, top + R.z * (1 + 0.35 * kick) - (row ? rim.bend * 0.08 * st : 0));
  };
  let net = "";
  for (let row = 0; row < rows.length - 1; row++)
    for (let kk = 0; kk < 12; kk++) {
      const a = np(row, kk), b1 = np(row + 1, row % 2 ? kk + 1 : kk), b2 = np(row + 1, row % 2 ? kk : kk - 1);
      net += `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b1.x.toFixed(1)} ${b1.y.toFixed(1)}M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b2.x.toFixed(1)} ${b2.y.toFixed(1)}`;
    }
  const front = openPath(P, ringPts(rim, 0.75, Math.PI / 2, (3 * Math.PI) / 2));
  const lip = openPath(P, ringPts(rim, 0.73, Math.PI / 2, (3 * Math.PI) / 2, 40, 0.03));
  // the net hooks: small loops under the ring where each cord ties on
  let hooks = "";
  for (let kk = 0; kk < 12; kk++) {
    const a = (kk / 12) * Math.PI * 2;
    const x = 0.75 * Math.cos(a), y = 0.75 * Math.sin(a);
    const z = clankSideOnRingZ(y, a, rim);
    const q1 = P.p(x, y, z), q2 = P.p(x * 0.98, y * 0.98, z - 0.09);
    hooks += `M${q1.x.toFixed(1)} ${q1.y.toFixed(1)}L${q2.x.toFixed(1)} ${q2.y.toFixed(1)}`;
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={net} stroke="#F2F2F2" strokeOpacity={0.85 * k + 0.1} strokeWidth={Math.max(0.8, s10 * 0.025)} fill="none" strokeLinecap="round" />
      <path d={hooks} stroke="#D9D9D9" strokeWidth={Math.max(0.8, s10 * 0.02)} />
      <path d={front} fill="none" stroke="#E4571E" strokeWidth={sw * 1.2} strokeLinecap="round" />
      <path d={lip} fill="none" stroke="#FF8A4C" strokeWidth={sw * 0.35} opacity={0.7 * k} />
    </svg>
  );
};

export const clankSideOnRingPath = (P: PcProj, z = 10) => poly(P, arc(0, 0, 0.75, 0, Math.PI * 2, 48), z);
