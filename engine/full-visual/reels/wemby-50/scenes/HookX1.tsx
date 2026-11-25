// Hook X1, dark, 0-5.40 s: "Wembanyama's fifty points aren't the scary number. The scary number is twenty-nine."
// "The card falls onto the floor." The real Wemby (Daiei Onoguchi's NBA Cup photo, CC BY 4.0) stands on the navy
// floor as a thick rounded slab, a heap of gold discs (his chances) at its foot. Wembanyama's: the key light comes
// on. 50: NBA.com's PTS cell drops onto the heap, counting, and lands. points: his 20 makes tick onto the photo's own
// floorboards. aren't: the slab starts to lean back on its bottom edge. scary: it passes the tipping point, light
// rakes across it. number: his 9 misses tick on. The scary number: the camera starts to rise, the lean creeps, a
// disc slides off the heap. 29: the slab falls flat with weight, bounces twice, throws dust off its edges, and its
// maple becomes the real half court, top-down, lines drawing out from the baseline where it hit; the 29 gold discs
// are flung off the heap and punch down on his 29 real spots (20 white dots, then 9 grey x), the 50 skids off small
// into the corner, and a 29 slams in at the top. The last frame is `answer`'s first (keep = true).
// Parts: HookX1Data (the 29 shots), HookX1Court (the court, `answer`'s geometry), this file (the world and the moves).
import React from "react";
import { Img, staticFile } from "remotion";
import { arriveEase, countTo, ease, prog, useScene } from "../../../src/engine";
import { HOOKX1_SHOTS } from "./HookX1Data";
import { HookX1Court, HOOKX1_APRON, HOOKX1_RIM_Y, type HookX1Mark } from "./HookX1Court";

const asset = (n: string) => staticFile(`wemby-50/${n}`);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const rnd = (i: number, k = 0) => {
  const s = Math.sin(i * 91.37 + k * 47.11 + 13.7) * 43758.5453;
  return s - Math.floor(s);
};

// ---- the world, in floor px: straight overhead these are screen px, and the court lands on `answer`'s ----
const PPF = 15.2; // `answer`'s court: x 160, y 700, 760 wide
const COURT = { x: 160, y: 700, w: 760 };
const AP = HOOKX1_APRON * PPF;
const SLAB = { x: COURT.x - AP, y: COURT.y - AP, w: (50 + HOOKX1_APRON * 2) * PPF, h: (47 + HOOKX1_APRON * 2) * PPF };
const FOOT = SLAB.y + SLAB.h; // the slab's bottom edge: the hinge it falls on
const CARD = { w: 620, h: 827 }; // the photo's own aspect (1280 x 1707)
const CARD_X = 540 - CARD.w / 2;
const THICK = 14;
const PERSP = 2200;
const ORIGIN_Y = 1000;
const courtPt = (x: number, y: number) => ({ x: 540 + x * PPF, y: COURT.y + (HOOKX1_RIM_Y + y) * PPF });

// the heap of chances at the card's right foot, and the PTS cell on it
const HEAP = { x: 318, y: FOOT + 125 };
const DISC = 58; // px across: a chance, big, close to camera
const DISC_T = 8;
const CELL = { w: 236, h: 206 };
const SKID = { x: 150, y: FOOT + 70 }; // where the 50 ends up: small, in the corner

type T = ReturnType<typeof useHookX1T>;
function useHookX1T() {
  const { cue, scene } = useScene();
  const n29 = cue("29");
  return {
    wemb: cue("Wembanyama's"),
    fifty: cue("50"),
    points: cue("points"),
    arent: cue("aren't"),
    scary: cue("scary"),
    number: cue("number"),
    the: cue("The"),
    scary2: cue("scary", 2),
    number2: cue("number", 2),
    is: cue("is"),
    n29,
    hit: n29 + 1, // the slab lands on "29"
    end: scene.to,
  };
}

// ---- the heap: 29 discs, layer by layer, each dropped in from above ----
type HeapDisc = { x: number; y: number; z: number; rz: number; tx: number; ty: number; land: number };
const HEAP_DISCS: HeapDisc[] = (() => {
  const rows = [11, 8, 6, 3, 1];
  const out: HeapDisc[] = [];
  let j = 0;
  rows.forEach((n, layer) => {
    const rx = 96 - layer * 22;
    const ry = 44 - layer * 9;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + layer * 0.7 + rnd(j, 1) * 0.5;
      const r = n === 1 ? 0 : 0.55 + 0.45 * rnd(j, 2);
      out.push({
        x: HEAP.x + Math.cos(a) * rx * r,
        y: HEAP.y + Math.sin(a) * ry * r,
        z: layer * (DISC_T + 1) + rnd(j, 3) * 3,
        rz: rnd(j, 4) * 360,
        tx: (rnd(j, 5) - 0.5) * (layer ? 22 : 8),
        ty: (rnd(j, 6) - 0.5) * (layer ? 22 : 8),
        land: -30 + j * 2.6, // the last one lands at ~1.0 s, before "points"
      });
      j++;
    }
  });
  return out;
})();
const HEAP_TOP = 4 * (DISC_T + 1) + DISC_T + 2;

// disc j carries shot SHOT_OF[j]: the made ones first (wave 1), then the misses (wave 2)
const MADE = HOOKX1_SHOTS.map((s, i) => ({ s, i })).filter((o) => o.s.made).map((o) => o.i);
const MISS = HOOKX1_SHOTS.map((s, i) => ({ s, i })).filter((o) => !o.s.made).map((o) => o.i);
const SHOT_OF = [...MADE, ...MISS];
// the discs nearest the camera get the shots nearest the camera, so the flights do not cross
const DISC_ORDER = HEAP_DISCS.map((d, j) => j).sort((a, b) => HEAP_DISCS[b].z - HEAP_DISCS[a].z);
const FLIGHT = 13;
const launchOf = (t: T, k: number) => (k < MADE.length ? t.hit + 1 + k * 0.55 : t.hit + 9 + (k - MADE.length) * 0.85);
const landOf = (t: T, k: number) => launchOf(t, k) + FLIGHT;
/** for shot i: which flight k lands it */
const K_OF_SHOT: number[] = (() => {
  const out: number[] = [];
  SHOT_OF.forEach((shot, k) => (out[shot] = k));
  return out;
})();

// ---- the slab's lean (deg back from upright), the camera's elevation, the dolly ----
function leanAt(f: number, t: T) {
  const fall0 = t.hit - 26;
  if (f < t.arent) return 0;
  const tip = t.scary + 8;
  if (f < tip) return 11 * prog(f, t.arent, tip - t.arent, ease.inOut);
  if (f < fall0) return 11 + 15 * prog(f, tip, fall0 - tip, (n) => n * n);
  if (f < t.hit) {
    const u = (f - fall0) / (t.hit - fall0);
    return 26 + 64 * u * u;
  }
  const g = f - t.hit;
  return 90 - 7 * Math.exp(-g / 6) * Math.abs(Math.sin((Math.PI * g) / 8));
}
function camAt(f: number, t: T) {
  const low = 13 + 11 * prog(f, t.the, t.hit - t.the, (n) => n * n);
  if (f <= t.hit + 1) return low;
  return lerp(24, 90, prog(f, t.hit + 1, 27, ease.inOut));
}
const settledAt = (t: T) => t.hit + 30;

// ---- a chance: a flat gold disc with a little depth ----
const HookX1Disc: React.FC<{ x: number; y: number; z: number; rz: number; tx: number; ty: number; d: number; o?: number; spin?: number }> = ({ x, y, z, rz, tx, ty, d, o = 1, spin = 0 }) => {
  const layers = 5;
  return (
    <div
      style={{
        position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, transformStyle: "preserve-3d",
        transform: `translate3d(0,0,${z.toFixed(2)}px) rotateZ(${rz.toFixed(1)}deg) rotateX(${(tx + spin).toFixed(2)}deg) rotateY(${ty.toFixed(2)}deg)`,
      }}
    >
      {Array.from({ length: layers }, (_, l) => {
        const top = l === layers - 1;
        const zz = (l / (layers - 1)) * DISC_T * (d / DISC);
        return (
          <div
            key={l}
            style={{
              position: "absolute", inset: 0, borderRadius: "50%", opacity: o,
              transform: `translateZ(${zz.toFixed(2)}px)`,
              background: top
                ? "radial-gradient(circle at 36% 30%, #FFE6A6 0%, #FFD883 18%, #F2B33D 55%, #B9801F 100%)"
                : l === 0 ? "#6B470F" : `hsl(38, 72%, ${30 + l * 5}%)`,
              boxShadow: top ? "inset 0 0 0 1.5px rgba(122,78,10,0.85), inset 0 0 6px rgba(255,240,200,0.35)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
};

// ---- the photo card's face: the real photo, the spur, the credit, the marks ticked onto its floor ----
/** a shot placed on the photo's own floor, in its perspective (hoop far away, top; half court near, bottom) */
const photoFloor = (x: number, y: number) => {
  const u = clamp01((y + 1) / 27);
  const s = 0.65 + 0.5 * u;
  return { x: 1062 + x * 8.5 * s, y: 880 + 600 * Math.pow(u, 1.2), s };
};

const HookX1Photo: React.FC<{ t: T; f: number; lean: number }> = ({ t, f, lean }) => {
  const k = CARD.w / 1280; // photo px -> card px
  const lit = prog(f, t.wemb - 2, 14, ease.out);
  const rake = prog(f, t.scary - 4, 40, ease.inOut);
  const rake2 = prog(f, t.the - 2, 44, ease.inOut);
  const push = 1 + 0.035 * prog(f, 0, t.hit, ease.linear);
  // as it leans back the top light lands on its face, then it turns away as it goes down
  const topLight = clamp01(lean / 22) * (1 - clamp01((lean - 40) / 40));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 26 }}>
      <Img src={asset("hookx1-onoguchi.jpg")} style={{ position: "absolute", left: 0, top: 0, width: CARD.w, height: CARD.h, transform: `scale(${push.toFixed(4)})`, transformOrigin: "50% 62%" }} />
      {/* his shots, ticked onto the floorboards in the photo's own perspective */}
      <svg width={CARD.w} height={CARD.h} viewBox="0 0 1280 1707" style={{ position: "absolute", inset: 0, transform: `scale(${push.toFixed(4)})`, transformOrigin: "50% 62%" }}>
        {HOOKX1_SHOTS.map((s, i) => {
          const mi = s.made ? MADE.indexOf(i) : MISS.indexOf(i);
          const at = s.made ? t.points + mi * 2 : t.number + mi * 4;
          if (f < at) return null;
          const p = photoFloor(s.x, s.y);
          const pop = prog(f, at, 7, ease.back);
          const ring = prog(f, at, 16, ease.out);
          const rx = 32 * p.s;
          const ry = rx * 0.42;
          const cost = prog(f, t.number + 46 + i * 2, 16, ease.out);
          return (
            <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
              {cost > 0 && cost < 1 && <ellipse cx={0} cy={0} rx={rx * (1.1 + cost * 1.8)} ry={ry * (1.1 + cost * 1.8)} fill="rgba(242,179,61,0.18)" stroke="#F2B33D" strokeWidth={5 * (1 - cost) + 1} opacity={1 - cost} />}
              <ellipse cx={0} cy={ry * 0.5} rx={rx * 1.15} ry={ry * 1.1} fill="rgba(40,22,5,0.28)" />
              {ring < 1 && <ellipse cx={0} cy={0} rx={rx * (1 + ring * 2.4)} ry={ry * (1 + ring * 2.4)} fill="none" stroke={s.made ? "#FFFFFF" : "#C9D1D9"} strokeWidth={3 * (1 - ring)} opacity={1 - ring} />}
              <g transform={`scale(${(0.4 + 0.6 * pop).toFixed(3)})`}>
                {s.made ? (
                  <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="#FFFFFF" stroke="#0D1117" strokeOpacity={0.6} strokeWidth={2} />
                ) : (
                  <g stroke="#3A4048" strokeWidth={4.2} strokeLinecap="round">
                    <path d={`M${-rx * 0.85} ${-ry * 0.85} L${rx * 0.85} ${ry * 0.85} M${rx * 0.85} ${-ry * 0.85} L${-rx * 0.85} ${ry * 0.85}`} stroke="#F4F6F8" strokeOpacity={0.5} strokeWidth={8} />
                    <path d={`M${-rx * 0.85} ${-ry * 0.85} L${rx * 0.85} ${ry * 0.85} M${rx * 0.85} ${-ry * 0.85} L${-rx * 0.85} ${ry * 0.85}`} />
                  </g>
                )}
              </g>
            </g>
          );
        })}
      </svg>
      {/* the house look: a dark foot so the floor reads under the cell, the spur bare top left, the credit top right */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 16%, transparent 72%, rgba(0,0,0,0.38) 100%)" }} />
      <Img src={asset("hookx1-spurs.svg")} style={{ position: "absolute", left: 22, top: 18, width: 64, height: 64 }} />
      <div style={{ position: "absolute", right: 16, top: 14, fontFamily: "Inter, sans-serif", fontSize: 22, color: "rgba(255,255,255,0.74)", letterSpacing: 0.1 }}>Daiei Onoguchi, CC BY 4.0</div>
      {/* the key light coming on, the top light as it leans, the rakes across the print */}
      <div style={{ position: "absolute", inset: 0, background: "#05080C", opacity: 0.5 * (1 - lit) }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,244,226,0.26) 0%, rgba(255,244,226,0.06) 45%, transparent 70%)", opacity: topLight, mixBlendMode: "screen" }} />
      {rake > 0 && rake < 1 && (
        <div style={{ position: "absolute", left: -CARD.w, top: -200, width: CARD.w * 0.7, height: CARD.h + 400, transform: `translateX(${(rake * CARD.w * 2.6).toFixed(1)}px) rotate(18deg)`, background: "linear-gradient(90deg, transparent, rgba(255,250,238,0.34) 45%, rgba(255,255,255,0.5) 50%, rgba(255,250,238,0.34) 55%, transparent)", mixBlendMode: "screen" }} />
      )}
      {rake2 > 0 && rake2 < 1 && (
        <div style={{ position: "absolute", left: -CARD.w, top: -200, width: CARD.w * 0.5, height: CARD.h + 400, transform: `translateX(${(rake2 * CARD.w * 2.6).toFixed(1)}px) rotate(-14deg)`, background: "linear-gradient(90deg, transparent, rgba(255,250,238,0.22) 50%, transparent)", mixBlendMode: "screen" }} />
      )}
      <div style={{ position: "absolute", inset: 0, borderRadius: 26, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)" }} />
    </div>
  );
};

/** NBA.com's PTS cell: the column head, a hairline, the number */
const HookX1Cell: React.FC<{ value: number; o: number; tilt: number }> = ({ value, o, tilt }) => (
  <div
    style={{
      position: "absolute", inset: 0, opacity: o, background: "#161B22", border: "1px solid #30363D", borderRadius: 14,
      boxShadow: "0 18px 40px rgba(0,0,0,0.55)", transform: `rotate(${tilt.toFixed(2)}deg)`, transformOrigin: "50% 100%",
    }}
  >
    <div style={{ position: "absolute", left: 0, right: 0, top: 14, textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 32, letterSpacing: 1, color: "#8B949E" }}>PTS</div>
    <div style={{ position: "absolute", left: 18, right: 18, top: 60, height: 1, background: "#30363D" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 58, textAlign: "center", fontFamily: "Figtree, sans-serif", fontWeight: 700, fontSize: 132, lineHeight: "140px", color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>{value}</div>
  </div>
);

export const HookX1: React.FC & { keep?: boolean } = () => {
  const { f } = useScene();
  const t = useHookX1T();
  const settled = f >= settledAt(t);
  const lean = settled ? 90 : leanAt(f, t);
  const elev = settled ? 90 : camAt(f, t);
  const g = f - t.hit;
  // the camera: a slow dolly in, kicked by the impact, then craned straight overhead onto `answer`'s frame
  const crane = prog(f, t.hit + 1, 27, ease.inOut);
  const dz = 70 * prog(f, 0, t.hit, ease.linear) * (1 - crane);
  const shake = g >= 0 ? 12 * Math.exp(-g / 4) * Math.sin(g * 2.3) : 0;
  const creak = f >= t.number2 ? 3 * Math.exp(-(f - t.number2) / 5) * Math.sin((f - t.number2) * 1.9) : 0;
  const dy = -26 * (1 - crane) + shake + creak;
  // the slab: the card's rect until it lies flat, then it spreads to the court slab
  const spread = prog(f, t.hit + 1, 18, arriveEase(18));
  const rect = settled
    ? SLAB
    : { x: lerp(CARD_X, SLAB.x, spread), y: lerp(FOOT - CARD.h, SLAB.y, spread), w: lerp(CARD.w, SLAB.w, spread), h: lerp(CARD.h, SLAB.h, spread) };
  const radius = settled ? Math.max(4, PPF * 0.6) : lerp(26, Math.max(4, PPF * 0.6), spread);
  const photoO = f < t.hit + 14 ? 1 : 0;
  // the court is born at the impact: maple from the baseline outward, lines drawn as the spread reaches them
  const reveal = Infinity;
  const wipe = prog(f, t.hit, 13, ease.out) * (CARD.h + 140) - 70; // the impact running down the photo, card px
  const line = (startFt: number) => (settled ? 1 : prog(f, t.hit + 2 + startFt * 0.32, 12, ease.inOut));
  const flash = g >= 0 && !settled ? 0.28 * Math.exp(-g / 5) : 0;
  const marks: HookX1Mark[] = HOOKX1_SHOTS.map((_, i) => {
    const land = landOf(t, K_OF_SHOT[i]);
    if (f < land) return { lit: 0, punch: 0, ring: 0 };
    return { lit: 1, punch: settled ? 0 : 0.8 * Math.exp(-(f - land) / 2.5) * (f - land < 1 ? 1 : 1), ring: settled ? 0 : prog(f, land, 20, ease.out) };
  });

  // ---- everything after this is drawn in the floor's own plane ----
  const yaw = settled ? 0 : lerp(-22, -12, prog(f, 0, t.hit, ease.inOut)) * (1 - crane);
  const floorT = settled ? "none" : `translate3d(0, ${dy.toFixed(2)}px, ${dz.toFixed(2)}px) rotateX(${(90 - elev).toFixed(3)}deg) rotateZ(${yaw.toFixed(3)}deg)`;
  const cardT = settled ? "none" : `translateZ(${(lean > 89 ? 0.6 : 0).toFixed(1)}px) rotateX(${(-(90 - lean)).toFixed(3)}deg)`;
  const bgO = 1 - prog(f, t.hit + 22, 8, ease.linear);
  const heapLit = prog(f, t.wemb - 2, 14);

  // the PTS cell: drops onto the heap on "50" counting, holds, tilts as the heap shifts, skids off on "29"
  const cellDrop = prog(f, t.fifty - 13, 13, (n) => n * n);
  const cellBounce = f >= t.fifty ? 10 * Math.exp(-(f - t.fifty) / 4) * Math.abs(Math.sin((f - t.fifty) * 0.8)) : 0;
  const cellZ0 = HEAP_TOP + 640 * (1 - cellDrop) + cellBounce;
  const skid = prog(f, t.hit, 22, ease.outHard);
  const cellX = lerp(HEAP.x, SKID.x, skid);
  const cellY = lerp(HEAP.y, SKID.y, skid);
  const cellZ = lerp(cellZ0, 0, prog(f, t.hit, 6, ease.in));
  const cellS = lerp(1, 0.4, skid);
  const cellO = (f < t.fifty - 13 ? 0 : 1) * (1 - prog(f, t.hit + 20, 12, ease.linear));
  const value = Math.round(countTo(f, t.fifty - 16, 16, 0, 50));
  const tilt = -4 * prog(f, t.number + 40, 14, ease.inOut) - 3 * prog(f, t.number2, 14, ease.inOut) + (f >= t.hit ? -14 * skid : 0);
  // the cell stands up facing the camera; flat on the floor once the camera is overhead
  const cellFace = settled ? 0 : -(90 - elev) * (1 - prog(f, t.hit + 2, 14, ease.inOut));

  // a shadow under the leaning slab, straight down from the top light
  const shadowLen = CARD.h * Math.sin((lean * Math.PI) / 180);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* the ground the floor stands on: the same navy, its grid now a floor in perspective */}
      {bgO > 0 && <div style={{ position: "absolute", inset: 0, background: "#0D1117", opacity: bgO }} />}
      <div style={{ position: "absolute", inset: 0, perspective: settled ? undefined : `${PERSP}px`, perspectiveOrigin: `540px ${ORIGIN_Y}px` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformStyle: "preserve-3d", transformOrigin: `540px ${FOOT}px`, transform: floorT }}>
          {/* the floor grid: 60 px, on the engine grid's own phase, so overhead it is the ground's grid */}
          {bgO > 0 && (
            <div
              style={{
                position: "absolute", left: -2010, top: -4000, width: 5100, height: 7600, opacity: bgO,
                backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "60px 60px", backgroundPosition: "0px 0px",
                WebkitMaskImage: `radial-gradient(ellipse 1500px 2600px at 2550px ${4000 + FOOT - 300}px, #000 30%, transparent 75%)`,
                maskImage: `radial-gradient(ellipse 1500px 2600px at 2550px ${4000 + FOOT - 300}px, #000 30%, transparent 75%)`,
              }}
            />
          )}
          {/* the key light's pool on the floor */}
          {!settled && (
            <div style={{ position: "absolute", left: 540 - 620, top: FOOT - 700, width: 1240, height: 1100, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,236,200,0.10), rgba(255,236,200,0.03) 45%, transparent 70%)", opacity: heapLit * (1 - prog(f, t.hit, 20)) }} />
          )}
          {/* the slab's shadow on the floor, growing as it leans */}
          {!settled && (
            <div style={{ position: "absolute", left: CARD_X - 10, top: FOOT - shadowLen - 6, width: CARD.w + 20, height: shadowLen + 22, borderRadius: 30, background: "rgba(0,0,0,0.6)", filter: "blur(16px)", opacity: 1 - prog(f, t.hit + 2, 10) }} />
          )}
          {/* the heap's shadow */}
          {!settled && f < t.hit + 4 && (
            <div style={{ position: "absolute", left: HEAP.x - 130, top: HEAP.y - 60, width: 260, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)", opacity: 1 - prog(f, t.hit, 4) }} />
          )}

          {/* the slab: hinged on its bottom edge */}
          <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, transformStyle: "preserve-3d", transformOrigin: "50% 100%", transform: cardT }}>
            {/* its thickness: the back of the slab, layer under layer */}
            {!settled &&
              Array.from({ length: 5 }, (_, l) => (
                <div key={l} style={{ position: "absolute", inset: 0, borderRadius: radius, transform: `translateZ(${(-((l + 1) / 5) * THICK).toFixed(2)}px)`, background: l === 4 ? "#07090C" : "#1A1F27", boxShadow: "inset 0 0 0 1px #30363D", opacity: 1 - spread }} />
              ))}
            <div
              style={{
                position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden", background: "#0E1013",
                boxShadow: `0 ${(PPF * 1.6).toFixed(1)}px ${(PPF * 4).toFixed(1)}px rgba(0,0,0,0.55), 0 0 0 1px #30363D`,
              }}
            >
              {f >= t.hit - 1 && (
                <div style={{ position: "absolute", left: SLAB.x - rect.x, top: SLAB.y - rect.y }}>
                  <HookX1Court ppf={PPF} f={f} reveal={reveal} line={line} marks={marks} flash={flash} />
                </div>
              )}
              {photoO > 0 && (
                <div
                  style={{
                    position: "absolute", left: CARD_X - rect.x, top: FOOT - CARD.h - rect.y, width: CARD.w, height: CARD.h,
                    WebkitMaskImage: f >= t.hit ? `linear-gradient(180deg, transparent ${(wipe - 40).toFixed(1)}px, #000 ${(wipe + 30).toFixed(1)}px)` : undefined,
                    maskImage: f >= t.hit ? `linear-gradient(180deg, transparent ${(wipe - 40).toFixed(1)}px, #000 ${(wipe + 30).toFixed(1)}px)` : undefined,
                  }}
                >
                  <HookX1Photo t={t} f={f} lean={lean} />
                </div>
              )}
              {f >= t.hit && wipe < CARD.h + 40 && (
                <div style={{ position: "absolute", left: CARD_X - rect.x - 40, top: FOOT - CARD.h - rect.y + wipe - 14, width: CARD.w + 80, height: 16, opacity: 1 - prog(f, t.hit + 6, 7), background: "radial-gradient(ellipse at 50% 50%, rgba(255,246,226,0.45), rgba(255,236,200,0.10) 45%, transparent 70%)", mixBlendMode: "screen" }} />
              )}
            </div>
          </div>

          {/* dust thrown off the slab's edges as it lands */}
          {g >= 0 && g < 40 && <HookX1Dust g={g} />}

          {/* the chances: heaped at the foot, then flung onto the 29 spots where they were spent */}
          {!settled &&
            DISC_ORDER.map((j, k) => {
              const d = HEAP_DISCS[j];
              const shot = HOOKX1_SHOTS[SHOT_OF[k]];
              if (f < d.land - 16) return null;
              const fall = prog(f, d.land - 16, 16, (n) => n * n);
              const bounce = f >= d.land ? 7 * Math.exp(-(f - d.land) / 3) * Math.abs(Math.sin((f - d.land) * 0.9)) : 0;
              const jig = f >= t.fifty ? 5 * Math.exp(-(f - t.fifty) / 4) * Math.abs(Math.sin((f - t.fifty) * 1.1 + j)) : 0;
              // the two that slide off the top of the heap in the silence
              const slideAt = j === 28 ? t.number + 42 : j === 27 ? t.scary2 - 4 : -1;
              const sl = slideAt < 0 ? 0 : prog(f, slideAt, 16, ease.in);
              const slX = (j === 28 ? -70 : 80) * sl;
              const slY = (j === 28 ? 40 : 52) * sl;
              let x = d.x + slX;
              let y = d.y + slY;
              let z = d.z * (1 - sl) + 800 * (1 - fall) + bounce + jig;
              let size = DISC;
              let spin = 0;
              let o = 1;
              const launch = launchOf(t, k);
              if (f >= launch) {
                const p = prog(f, launch, FLIGHT, ease.linear);
                const to = courtPt(shot.x, shot.y);
                x = lerp(x, to.x, ease.inOut(p));
                y = lerp(y, to.y, ease.inOut(p));
                z = lerp(z, 0, p) + 360 * 4 * p * (1 - p);
                size = lerp(DISC, 24, p);
                spin = 360 * ease.inOut(p);
                o = 1 - prog(f, launch + FLIGHT, 4, ease.linear);
                if (o <= 0) return null;
              }
              return <HookX1Disc key={j} x={x} y={y} z={z} rz={d.rz} tx={f >= launch ? 0 : d.tx * (1 - sl * 0.5)} ty={f >= launch ? 0 : d.ty} d={size} o={o} spin={spin} />;
            })}

          {/* NBA.com's PTS cell, pinned at the slab's foot on top of the heap */}
          {cellO > 0 && (
            <div
              style={{
                position: "absolute", left: cellX - CELL.w / 2, top: cellY - CELL.h, width: CELL.w, height: CELL.h, transformOrigin: "50% 100%",
                transform: `translateZ(${cellZ.toFixed(2)}px) rotateZ(${(-yaw * (1 - prog(f, t.hit + 2, 14, ease.inOut))).toFixed(3)}deg) rotateX(${cellFace.toFixed(3)}deg) scale(${cellS.toFixed(4)})`,
              }}
            >
              <HookX1Cell value={value} o={cellO} tilt={tilt} />
            </div>
          )}
        </div>
      </div>

      {/* where the 50 comes from */}
      {f < t.hit + 6 && (
        <div style={{ position: "absolute", left: 56, top: 1606, fontFamily: "Inter, sans-serif", fontSize: 26, color: "#8B949E", opacity: prog(f, t.fifty + 4, 10) * (1 - prog(f, t.hit, 6)) }}>NBA.com box score, Nov 21 2026</div>
      )}
      {/* the 29 slams in at the top and holds, where `answer` picks it up */}
      <HookX1TwentyNine f={f} t={t} />
    </div>
  );
};
HookX1.keep = true;

/** dust puffed off the slab's edges by the landing, lying low on the floor */
const HookX1Dust: React.FC<{ g: number }> = ({ g }) => {
  const n = 64;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        // a point on the slab's perimeter, more along the far edge (it hit first and hardest)
        const side = i % 6;
        const u = rnd(i, 7);
        const L = CARD_X;
        const R = CARD_X + CARD.w;
        const top = FOOT - CARD.h;
        const p =
          side <= 2 ? { x: L + u * CARD.w, y: top, nx: 0, ny: -1 } : side === 3 ? { x: L, y: top + u * CARD.h, nx: -1, ny: 0 } : side === 4 ? { x: R, y: top + u * CARD.h, nx: 1, ny: 0 } : { x: L + u * CARD.w, y: FOOT, nx: 0, ny: 1 };
        const grit = i % 3 === 0;
        const v = grit ? 120 + 220 * rnd(i, 8) : 40 + 90 * rnd(i, 8);
        const travel = v * (1 - Math.exp(-g / (grit ? 5 : 8)));
        const spreadA = (rnd(i, 9) - 0.5) * 0.9;
        const dx = (p.nx + spreadA * p.ny) * travel;
        const dy = (p.ny + spreadA * p.nx) * travel;
        const r = grit ? 2 + 2.5 * rnd(i, 10) : 12 + 20 * rnd(i, 10) + g * 1.1;
        const o = grit ? 0.8 * Math.exp(-g / 9) : (0.13 + 0.1 * rnd(i, 11)) * Math.exp(-g / 13) * Math.min(1, g / 2 + 0.3);
        const lift = grit ? 70 * rnd(i, 12) * Math.sin(Math.min(Math.PI, g / 12)) : 2 + rnd(i, 12) * 14 * Math.min(1, g / 8);
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: p.x + dx - r, top: p.y + dy - r, width: r * 2, height: r * 2, borderRadius: "50%",
              transform: `translateZ(${lift.toFixed(1)}px)`,
              background: grit ? "#E8D9BE" : "radial-gradient(circle, rgba(222,205,176,0.85), rgba(190,170,140,0.3) 50%, transparent 72%)", opacity: o,
            }}
          />
        );
      })}
    </>
  );
};

const HookX1TwentyNine: React.FC<{ f: number; t: T }> = ({ f, t }) => {
  const at = t.hit + 3;
  if (f < at) return null;
  const p = prog(f, at, 9, ease.in); // accelerating in: a slam, not a fade
  const g = f - (at + 9);
  const squash = g >= 0 ? 0.07 * Math.exp(-g / 3.5) * Math.cos(g * 0.9) : 0;
  const s = g >= 0 ? 1 - squash : 1.7 - 0.7 * p;
  const blur = g >= 0 ? 0 : (1 - p) * 9;
  const done = f >= settledAt(t);
  return (
    <div
      style={{
        position: "absolute", left: 540 - 0.6 * 176, top: 530, fontFamily: "Figtree, sans-serif", fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap",
        fontSize: 176, lineHeight: 1, color: "#FFFFFF", opacity: prog(f, at, 4, ease.linear),
        transform: done ? undefined : `translateY(${(g >= 0 ? 0 : -46 * (1 - p)).toFixed(1)}px) scale(${s.toFixed(4)})`, transformOrigin: "50% 60%",
        filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : undefined,
      }}
    >
      29
    </div>
  );
};
