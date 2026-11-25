// wilt-100 "crowd": the things standing in the arena, each drawn flat from its reference and laid onto its plane in the
// world (CrowdHalfEmptySprite). The end wall's door and the stub, the RCA TK-41 on its riser (Early Television Museum
// photo), the press table with covered typewriters and empty folding chairs, the 1954 Zenith T522W (Joe Haupt photo),
// the far-end scoreboard with its quarter lamps, and the radio's waves travelling from one to the other.
import React from "react";
import { ease, prog } from "../../../src/engine";
import {
  AMBER, ARENA, BOARD, LABEL, RADIO, RISER, STRIKE, TABLE, TK, type CrowdHalfEmptyT, type CrowdHalfEmptyView, type V3,
  clamp, crowdHalfEmptySprite as sprite, lerp,
} from "./CrowdHalfEmptyKit";
import { HTM_OSWALD } from "./HersheyTicketMapKit";
import { CrowdHalfEmptyBoard, CrowdHalfEmptyRadio, CrowdHalfEmptyTK41, CrowdHalfEmptyTypewriter, CrowdHalfEmptyChair } from "./CrowdHalfEmptyDraw";

type Font = { ui: string; mono: string; caption: string };
type Props = { f: number; T: CrowdHalfEmptyT; V: CrowdHalfEmptyView; font: Font };

const pts = (V: CrowdHalfEmptyView, ps: V3[]) => {
  const q = ps.map(V.P);
  return q.some((p) => p.z < 0.3) ? null : q.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
};
/** a box in the world: its visible faces, far first */
function Box({ V, x0, x1, y0, y1, z0, z1, top, side, front }: { V: CrowdHalfEmptyView; x0: number; x1: number; y0: number; y1: number; z0: number; z1: number; top: string; side: string; front: string }) {
  const faces: { p: string | null; c: string; d: number }[] = [];
  const cam = V.cam.pos;
  const add = (ps: V3[], c: string, n: V3, at: V3) => {
    if ((cam[0] - at[0]) * n[0] + (cam[1] - at[1]) * n[1] + (cam[2] - at[2]) * n[2] <= 0) return;
    faces.push({ p: pts(V, ps), c, d: Math.hypot(cam[0] - at[0], cam[1] - at[1], cam[2] - at[2]) });
  };
  add([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], top, [0, 1, 0], [x0, y1, z0]);
  add([[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], front, [-1, 0, 0], [x0, y0, z0]);
  add([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], side, [1, 0, 0], [x1, y0, z0]);
  add([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], side, [0, 0, -1], [x0, y0, z0]);
  add([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], side, [0, 0, 1], [x0, y0, z1]);
  faces.sort((a, b) => b.d - a.d);
  return <>{faces.map((q, i) => q.p && <polygon key={i} points={q.p} fill={q.c} stroke="rgba(0,0,0,0.35)" strokeWidth={0.8} strokeLinejoin="round" />)}</>;
}

/** a grey label with a hairline down to what it names */
function Tag({ x, y, tx, ty, text, o, font, size = 34 }: { x: number; y: number; tx: number; ty: number; text: string; o: number; font: Font; size?: number }) {
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      <line x1={x} y1={y + 10} x2={tx} y2={ty} stroke={LABEL} strokeWidth={2} />
      <circle cx={tx} cy={ty} r={4} fill={LABEL} />
      <text x={x} y={y} fill={LABEL} fontFamily={font.ui} fontSize={size} fontWeight={500} textAnchor="middle" stroke="#0D1117" strokeWidth={7} strokeLinejoin="round" paintOrder="stroke">{text}</text>
    </g>
  );
}

export const CrowdHalfEmptyProps: React.FC<Props> = ({ f, T, V, font }) => {
  const P = V.P;
  /* ---- the TV camera: stands dead, struck on "TV", unplugged on "cameras", then its riser sinks ---- */
  const sink = prog(f, T.cameras + 14, 30, ease.in);
  const dy = -2.6 * sink;
  const tkM = sprite(V, [TK.x - 0.78, TK.y + 2.0 + dy, TK.z], [0.01, 0, 0], [0, -0.01, 0]);
  const tkTL = P([TK.x - 0.95, TK.y + 2.1 + dy, TK.z]), tkBR = P([TK.x + 0.85, TK.y + 0.05 + dy, TK.z]);
  const tkStrike = prog(f, T.tv + 1, 10, ease.out);
  const unplug = prog(f, T.cameras - 2, 22, ease.inOut);
  /* ---- the press row ---- */
  const TW = [-4.4, -2.3, -0.2, 1.9, 3.9];
  const tStrike = prog(f, T.reporters - 2, 14, ease.out);
  const tA = P([(TABLE.x0 + TABLE.x1) / 2, TABLE.h + 0.26, TABLE.z0 - 0.1]), tB = P([(TABLE.x0 + TABLE.x1) / 2, TABLE.h + 0.3, TABLE.z1 - 1.05]);
  const pressTag = prog(f, T.reporters + 4, 10);
  const chairTop = P([10.35, 0.86, -2.07]);
  /* ---- the radio ---- */
  const glow = prog(f, T.recording - 1, 10, ease.out);
  const rM = sprite(V, [RADIO.x, RADIO.y + 0.26, RADIO.z + 0.25], [0, 0, -0.01], [0, -0.01, 0]);
  const dial = P([RADIO.x - 0.02, RADIO.y + 0.14, RADIO.z + 0.25 - 0.405]);
  const grille = P([RADIO.x - 0.02, RADIO.y + 0.135, RADIO.z]);
  /* ---- the scoreboard ---- */
  const bM = sprite(V, [BOARD.x - BOARD.w / 2, BOARD.y + BOARD.h / 2, BOARD.z], [0.01, 0, 0], [0, -0.01, 0]);
  const lamp4 = prog(f, T.quarter - 1, 8, ease.out);
  const L4: V3 = [BOARD.x - BOARD.w / 2 + 6.15, BOARD.y + BOARD.h / 2 - 3.15, BOARD.z - 0.05];
  const l4 = P(L4);
  const boardTag = prog(f, T.quarter + 8, 12);
  // the waves: packets leave the grille from "radio" on and travel up the arena to lamp 4
  const R0: V3 = [RADIO.x - 0.05, RADIO.y + 0.14, RADIO.z];
  const packets: React.ReactNode[] = [];
  const TRAVEL = Math.max(30, T.quarter - T.audio + 6);
  for (let n = 0; n < 16; n++) {
    const born = T.radio + n * 5;
    const u = (f - born) / TRAVEL;
    if (u <= 0 || u >= 1 || born > T.quarter + 4) continue;
    const e = ease.inOut(u);
    const at: V3 = [lerp(R0[0], L4[0], e), lerp(R0[1], L4[1], e) + Math.sin(Math.PI * e) * 3, lerp(R0[2], L4[2], e)];
    const ah: V3 = [lerp(R0[0], L4[0], e + 0.01), lerp(R0[1], L4[1], e + 0.01) + Math.sin(Math.PI * (e + 0.01)) * 3, lerp(R0[2], L4[2], e + 0.01)];
    const p = P(at), q = P(ah);
    if (p.z < 1.2 || q.z < 1.2) continue;
    const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
    const sz = clamp(p.s * 0.35, 6, 60);
    const o = Math.min(1, u * 8) * (1 - Math.pow(u, 6));
    packets.push(
      <g key={n} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(1)})`} opacity={o}>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M${-k * sz * 0.45} ${-sz * (0.5 + k * 0.28)} A ${sz * (0.6 + k * 0.3)} ${sz * (0.6 + k * 0.3)} 0 0 1 ${-k * sz * 0.45} ${sz * (0.5 + k * 0.28)}`}
            fill="none" stroke={AMBER} strokeWidth={Math.max(2, sz * 0.1)} strokeLinecap="round" opacity={1 - k * 0.28} />
        ))}
      </g>,
    );
  }
  // the ripples at the grille itself
  const ripples: React.ReactNode[] = [];
  if (grille.z > 0.5) for (let n = 0; n < 8; n++) {
    const born = T.radio - 2 + n * 9;
    const u = (f - born) / 34;
    if (u <= 0 || u >= 1) continue;
    const r = grille.s * (0.12 + 0.55 * u);
    ripples.push(<circle key={n} cx={grille.x} cy={grille.y} r={r} fill="none" stroke={AMBER} strokeWidth={Math.max(2, grille.s * 0.012) * (1 - u * 0.5)} opacity={(1 - u) * 0.9} />);
  }
  // the gate: the arena's cream art-deco end facade at night (2001 main gate photo), its canopy and globe lamps, the
  // glass doors open and the lit hall behind. Drawn while the camera is still outside.
  const outside = V.cam.pos[2] < ARENA.zNear - 0.15;
  let wall: React.ReactNode = null;
  if (outside) {
    const z = ARENA.zNear;
    const DX = 1.8, DY = 2.75;
    const door = pts(V, [[-DX, 0, z], [-DX, DY, z], [DX, DY, z], [DX, 0, z]]);
    const poly = (ps: V3[]) => pts(V, ps);
    if (door) {
      const d = door.split(" ").map((q) => q.replace(",", " ")).join(" L");
      const lampL = P([-4.6, 2.75, z - 0.25]), lampR = P([4.6, 2.75, z - 0.25]);
      const pil = [-8.2, -5.6, 5.6, 8.2];
      wall = (
        <g>
          <defs>
            <radialGradient id="cheFacadeLight" cx="0.5" cy="0.62" r="0.6"><stop offset="0" stopColor="#E9DFC6" /><stop offset="0.55" stopColor="#9C9480" /><stop offset="1" stopColor="#3A3830" /></radialGradient>
            <radialGradient id="cheDoorGlow" cx="0.5" cy="0.75" r="0.8"><stop offset="0" stopColor="#FFE9BE" stopOpacity={0.85} /><stop offset="0.6" stopColor="#C89A55" stopOpacity={0.45} /><stop offset="1" stopColor="#3A2A14" stopOpacity={0.2} /></radialGradient>
            <radialGradient id="cheGlobe"><stop offset="0" stopColor="#FFF6DC" /><stop offset="0.35" stopColor="#FFE6A8" stopOpacity={0.9} /><stop offset="1" stopColor="#FFE6A8" stopOpacity={0} /></radialGradient>
          </defs>
          {/* the night round the facade, with the door cut out of it: the arena shows through the open door */}
          <path d={`M-10 -10 H1090 V1930 H-10 Z M${d} Z`} fill="#0A0D14" fillRule="evenodd" />
          {poly([[-16, 0, z], [-16, 12.5, z], [16, 12.5, z], [16, 0, z]]) && (
            <path d={`M${poly([[-16, 0, z], [-16, 12.5, z], [16, 12.5, z], [16, 0, z]])!.split(" ").map((q) => q.replace(",", " ")).join(" L")} Z M${d} Z`} fill="url(#cheFacadeLight)" fillRule="evenodd" />
          )}
          {/* the stepped parapet and the pilasters */}
          {[-12, -9, -6, -3, 0, 3, 6, 9].map((x) => { const q = poly([[x + 0.4, 12.5, z], [x + 0.4, 13.3, z], [x + 2.6, 13.3, z], [x + 2.6, 12.5, z]]); return q && <polygon key={x} points={q} fill="#5E5A4E" />; })}
          {pil.map((x) => { const q = poly([[x - 0.35, 0, z - 0.05], [x - 0.35, 12.2, z - 0.05], [x + 0.35, 12.2, z - 0.05], [x + 0.35, 0, z - 0.05]]); return q && <polygon key={x} points={q} fill="rgba(255,250,235,0.16)" stroke="rgba(0,0,0,0.25)" strokeWidth={1} />; })}
          {/* the lattice panels above the canopy */}
          {[-3.6, 0, 3.6].map((x) => (
            <g key={x}>
              {Array.from({ length: 7 }, (_, i) => {
                const q1 = poly([[x - 1.2, 4.6 + i * 0.55, z - 0.02], [x + 1.2, 5.15 + i * 0.55, z - 0.02]]), q2 = poly([[x + 1.2, 4.6 + i * 0.55, z - 0.02], [x - 1.2, 5.15 + i * 0.55, z - 0.02]]);
                return q1 && q2 && <g key={i} stroke="rgba(60,56,46,0.55)" strokeWidth={1.4}><polyline points={q1} fill="none" /><polyline points={q2} fill="none" /></g>;
              })}
            </g>
          ))}
          {/* the canopy over the door, its fascia and the bulbs underneath */}
          {(() => {
            const under = poly([[-5, 3.05, z], [5, 3.05, z], [5, 3.05, z - 2.2], [-5, 3.05, z - 2.2]]), face = poly([[-5, 3.05, z - 2.2], [5, 3.05, z - 2.2], [5, 3.75, z - 2.2], [-5, 3.75, z - 2.2]]);
            return (
              <g>
                {under && <polygon points={under} fill="#2E2B25" />}
                {face && <polygon points={face} fill="#4B3B2A" stroke="#1E1A14" strokeWidth={2} />}
                {Array.from({ length: 9 }, (_, i) => { const b = P([-4 + i, 3.02, z - 1.1]); return b.z > 0.3 && <circle key={i} cx={b.x} cy={b.y} r={Math.max(2, b.s * 0.07)} fill="#FFF1C9" />; })}
              </g>
            );
          })()}
          {/* the lit hall behind the door: it gives way to the arena as the camera goes through */}
          <path d={`M${d} Z`} fill="url(#cheDoorGlow)" opacity={clamp((ARENA.zNear - V.cam.pos[2] - 1.2) / 5)} />
          {/* the door frame and the glass doors swung in */}
          <path d={`M${d} Z`} fill="none" stroke="#2A2620" strokeWidth={Math.max(3, P([0, 1, z]).s * 0.12)} />
          {[-1, 1].map((sd) => { const q = poly([[sd * DX, 0, z], [sd * DX, DY, z], [sd * (DX - 0.4), DY, z + 1.4], [sd * (DX - 0.4), 0, z + 1.4]]); return q && <polygon key={sd} points={q} fill="rgba(120,150,170,0.14)" stroke="#2A2620" strokeWidth={3} />; })}
          {/* the warm light spilling out of the door onto the pavement */}
          {(() => { const q = poly([[-DX, 0.01, z], [DX, 0.01, z], [DX + 1.6, 0.01, z - 5], [-DX - 1.6, 0.01, z - 5]]); return q && <polygon points={q} fill="rgba(255,226,170,0.16)" />; })()}
          {(() => { const q = poly([[-16, 0, z], [16, 0, z], [16, 0, z - 30], [-16, 0, z - 30]]); return q && <polygon points={q} fill="#15171B" />; })()}
          {(() => { const q = poly([[-DX, 0.01, z], [DX, 0.01, z], [DX + 1.6, 0.01, z - 5], [-DX - 1.6, 0.01, z - 5]]); return q && <polygon points={q} fill="rgba(255,226,170,0.18)" />; })()}
          {[lampL, lampR].map((l, i) => l.z > 0.3 && (
            <g key={i}>
              <circle cx={l.x} cy={l.y} r={l.s * 1.4} fill="url(#cheGlobe)" opacity={0.7} />
              <rect x={l.x - l.s * 0.05} y={l.y - l.s * 0.42} width={l.s * 0.1} height={l.s * 0.25} fill="#2A2620" />
              <circle cx={l.x} cy={l.y} r={l.s * 0.22} fill="#FFF8E6" />
            </g>
          ))}
        </g>
      );
    }
  }
  // the torn stub, flying in at the door
  const fly = prog(f, T.born, 15, ease.in);
  const doorC = P([0, 1.4, ARENA.zNear + 1.5]);
  // it starts where the hershey scene's torn stub is left (right of centre, tilted), and is the same stub
  const sx = lerp(895, doorC.x, fly), sy = lerp(990, doorC.y, fly), ss = lerp(0.95, 0.06, fly);
  const stub = fly < 1 && (
    <g transform={`translate(${sx} ${sy}) rotate(${7 + 30 * fly}) scale(${ss})`} opacity={1 - prog(f, T.born + 12, 3, ease.linear)}>
      <rect x={-110} y={-200} width={220} height={400} rx={6} fill="#EFE6D2" />
      <path d="M-110 -200 v400" stroke="#C9BFA9" strokeWidth={3} strokeDasharray="2 7" />
      <rect x={-98} y={-186} width={196} height={372} rx={4} fill="none" stroke="#C0322A" strokeWidth={2.4} />
      <text x={0} y={-102} textAnchor="middle" fontFamily={HTM_OSWALD} fontWeight={700} fontSize={46} letterSpacing={6} fill="#1B1B1B">ADMIT</text>
      <text x={0} y={-50} textAnchor="middle" fontFamily={HTM_OSWALD} fontWeight={700} fontSize={46} letterSpacing={6} fill="#1B1B1B">ONE</text>
      <g transform="translate(0 68)">
        <path d="M-44,-80 H-22 V-18 H22 V-80 H44 V80 H22 V18 H-22 V80 H-44 Z" fill="none" stroke="#C0322A" strokeWidth={3.2} />
        <path d="M-38,-74 H-28 V-12 H28 V-74 H38 V74 H28 V12 H-28 V74 H-38 Z" fill="none" stroke="#C0322A" strokeWidth={1.4} />
      </g>
    </g>
  );

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="chePoolGlow"><stop offset="0" stopColor={AMBER} stopOpacity={0.55} /><stop offset="1" stopColor={AMBER} stopOpacity={0} /></radialGradient>
      </defs>
      {/* the scoreboard on the far end wall, chains up to the vault */}
      {P([BOARD.x, BOARD.y, BOARD.z]).z > 1 && (
        <g>
          {[-3.6, 3.6].map((dx) => {
            const a = P([dx, BOARD.y + BOARD.h / 2, BOARD.z - 0.1]), b = P([dx, ARENA.crownY - 2.5, BOARD.z - 0.4]);
            return <line key={dx} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#5B626B" strokeWidth={Math.max(1, a.s * 0.05)} strokeDasharray={`${Math.max(1, a.s * 0.08)} ${Math.max(1, a.s * 0.04)}`} />;
          })}
          <g transform={bM}><CrowdHalfEmptyBoard f={f} lamp4={lamp4} wave={prog(f, T.quarter + 2, 20)} font={font} /></g>
          {lamp4 > 0 && <circle cx={l4.x} cy={l4.y} r={l4.s * 1.6} fill="url(#chePoolGlow)" opacity={lamp4} />}
        </g>
      )}
      {/* the TV camera on its riser */}
      {P([TK.x, TK.y, TK.z]).z > 0.6 && sink < 1 && (
        <g opacity={1 - prog(f, T.cameras + 34, 10, ease.linear)}>
          <Box V={V} x0={RISER.x0} x1={RISER.x1} y0={-0.02 + dy} y1={RISER.h + dy} z0={RISER.z0} z1={RISER.z1} top="#4A3D2F" side="#1E1A16" front="#2A241E" />
          <Box V={V} x0={RISER.x0 - 0.45} x1={RISER.x0} y0={-0.02 + dy} y1={0.26 + dy} z0={RISER.z0 + 0.5} z1={RISER.z0 + 1.4} top="#4A3D2F" side="#1E1A16" front="#2A241E" />
          {/* the plywood sheets of the deck and their screws */}
          {[0.6, 1.2, 1.8].map((u) => { const a = P([RISER.x0 + u, RISER.h + dy + 0.003, RISER.z0]), b = P([RISER.x0 + u, RISER.h + dy + 0.003, RISER.z1]); return a.z > 0.5 && b.z > 0.5 && <line key={u} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(0,0,0,0.35)" strokeWidth={1.4} />; })}
          {(() => { const a = P([RISER.x0, RISER.h + dy, RISER.z0]), b = P([RISER.x1, RISER.h + dy, RISER.z0]); return a.z > 0.5 && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,235,200,0.25)" strokeWidth={2} />; })()}
          <g transform={tkM}><CrowdHalfEmptyTK41 unplug={unplug} /></g>
          {tkStrike > 0 && (
            <line x1={tkTL.x} y1={tkTL.y} x2={lerp(tkTL.x, tkBR.x, tkStrike)} y2={lerp(tkTL.y, tkBR.y, tkStrike)} stroke={STRIKE} strokeWidth={16} strokeLinecap="round" />
          )}
        </g>
      )}
      {/* the press row: the empty chairs behind, the table (in short lengths, so the part in front of the camera
          still draws when it stands at the radio), the covered typewriters with their blank pads */}
      <g>
        {TW.map((z) => P([10.35, 0.84, z]).z > 0.6 && (
          <g key={`c${z}`} transform={sprite(V, [10.35, 0.86, z + 0.23], [0, 0, -0.01], [0, -0.01, 0])}><CrowdHalfEmptyChair /></g>
        ))}
        {Array.from({ length: 8 }, (_, i) => {
          const z0 = TABLE.z0 + ((TABLE.z1 - TABLE.z0) * i) / 8, z1 = TABLE.z0 + ((TABLE.z1 - TABLE.z0) * (i + 1)) / 8;
          return P([TABLE.x0, 0, z0]).z > 0.5 && P([TABLE.x1, 0, z0]).z > 0.5 && (
            <Box key={i} V={V} x0={TABLE.x0} x1={TABLE.x1} y0={0} y1={TABLE.h} z0={z0} z1={z1} top="#5A3E26" side="#241E19" front="#1B2420" />
          );
        })}
        {Array.from({ length: 40 }, (_, i) => {
          const z = TABLE.z0 + ((TABLE.z1 - TABLE.z0) * (i + 0.5)) / 40, a = P([TABLE.x0 - 0.01, TABLE.h - 0.04, z]), b = P([TABLE.x0 - 0.01, 0.02, z]);
          return a.z > 0.5 && <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(0,0,0,0.35)" strokeWidth={Math.max(0.6, a.s * 0.012)} />;
        })}
        {TW.map((z) => {
          const pad = pts(V, [[8.85, TABLE.h + 0.003, z - 0.42], [9.15, TABLE.h + 0.003, z - 0.44], [9.13, TABLE.h + 0.003, z - 0.66], [8.83, TABLE.h + 0.003, z - 0.64]]);
          return P([9.05, TABLE.h, z]).z > 0.6 && (
            <g key={`t${z}`}>
              {pad && <polygon points={pad} fill="#D9D3C4" opacity={0.8} />}
              <g transform={sprite(V, [9.1, TABLE.h + 0.26, z + 0.26], [0, 0, -0.012], [0, -0.012, 0])}><CrowdHalfEmptyTypewriter /></g>
            </g>
          );
        })}
        {glow > 0 && dial.z > 0.4 && <circle cx={dial.x} cy={dial.y} r={dial.s * 0.45} fill="url(#chePoolGlow)" opacity={glow} />}
        {tStrike > 0 && tA.z > 0.5 && (
          <line x1={tA.x} y1={tA.y} x2={lerp(tA.x, tB.x, tStrike)} y2={lerp(tA.y, tB.y, tStrike)} stroke={STRIKE} strokeWidth={12} strokeLinecap="round" />
        )}
        <Tag x={Math.min(800, Math.max(280, chairTop.x))} y={Math.min(chairTop.y - 170, 840)} tx={chairTop.x} ty={chairTop.y - 6} text="no New York press" o={pressTag * (1 - prog(f, T.and2 + 6, 10, ease.linear))} font={font} size={38} />
      </g>
      {P([RADIO.x, RADIO.y, RADIO.z]).z > 0.5 && <g transform={rM}><CrowdHalfEmptyRadio glow={glow} f={f} font={font} /></g>}
      {ripples}
      {packets}
      <Tag x={540} y={Math.max(1180, l4.y + 230)} tx={l4.x} ty={l4.y + l4.s * 1.0} text="the only recording" o={boardTag} font={font} size={38} />
      {wall}
      {stub}
    </svg>
  );
};
