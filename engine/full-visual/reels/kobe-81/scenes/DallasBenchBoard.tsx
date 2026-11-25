// DallasBench drawing kit: the reel's LED scoreboard box (same housing, digits and dot-matrix as StaplesNightBoard)
// with rows that can relabel (LAKERS rolls to BRYANT, the logo flips to Kobe's photo chip), a small corner box for
// the real game score, and the point bulb.
import React from "react";
import { Img, staticFile } from "remotion";
import { StaplesNightDots, StaplesNightLed, StaplesNightReadout } from "./StaplesNightBoard";

export type DallasBenchRow = {
  name: string;
  prevName?: string; // rolls from prevName to name as roll goes 0 -> 1
  roll?: number;
  score: number | null;
  logo: React.ReactNode;
  flash?: number;
  flare?: number;
};

const ROW_H = 70;

const Row: React.FC<{ y: number; row: DallasBenchRow; power: number }> = ({ y, row, power }) => {
  const L = StaplesNightLed;
  const bright = power > 0.5;
  const s = row.score === null ? "  " : String(row.score).padStart(2, " ");
  const flash = row.flash ?? 0;
  const flare = row.flare ?? 0;
  const glow = power * (1 + flash * 0.9 + flare * 0.7);
  const roll = row.prevName ? (row.roll ?? 1) : 1;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 900, height: ROW_H }}>
      <div style={{ position: "absolute", left: 22, top: 7, width: 56, height: 56 }}>{row.logo}</div>
      {/* the name, rolling like a dot-matrix line feed when it changes */}
      <div style={{ position: "absolute", left: 98, top: 12, width: 380, height: 50, overflow: "hidden" }}>
        {row.prevName && roll < 1 && (
          <div style={{ position: "absolute", left: 0, top: -50 * roll }}>
            <StaplesNightDots text={bright ? row.prevName : ""} size={44} w={380} color={bright ? L.amber : L.amberDim} dim={L.amberDim} glow={bright ? power : 0} />
          </div>
        )}
        <div style={{ position: "absolute", left: 0, top: 50 * (1 - roll) }}>
          <StaplesNightDots text={bright ? row.name : ""} size={44} w={380} color={bright ? L.amber : L.amberDim} dim={L.amberDim} glow={bright ? power * (1 + 0.6 * flare) : 0} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 470, top: 8, transform: `scale(${1 + flare * 0.07})`, transformOrigin: "right center" }}>
        <StaplesNightReadout text={s} h={56} w={130} color={bright ? L.red : L.redDim} dim={L.redDim} glow={bright ? glow : 0} />
      </div>
    </div>
  );
};

export type DallasBenchBoardState = {
  power: number;
  top: DallasBenchRow;
  bottom: DallasBenchRow;
  period: string;
  clock: string;
  clockFlare?: number;
};

/** the big box, 900 x 160, at x/y on the stage */
export const DallasBenchBoard: React.FC<{ st: DallasBenchBoardState; x: number; y: number; style?: React.CSSProperties; shade?: number }> = ({ st, x, y, style, shade = 0 }) => {
  const L = StaplesNightLed;
  const bright = st.power > 0.5;
  const cf = st.clockFlare ?? 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 900,
        height: 160,
        borderRadius: 14,
        background: `linear-gradient(180deg, #0d0d0e 0%, ${L.housing} 18%, ${L.housing} 100%)`,
        border: `2px solid ${L.edge}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -2px 6px rgba(0,0,0,0.8), 0 18px 50px rgba(0,0,0,0.65)${st.power > 0 ? `, 0 0 ${40 * st.power}px rgba(255,42,28,${0.1 * st.power})` : ""}`,
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 5px)" }} />
      <Row y={10} row={st.top} power={st.power} />
      <Row y={10 + ROW_H} row={st.bottom} power={st.power} />
      <div style={{ position: "absolute", left: 628, top: 14, width: 2, height: 132, background: "#1f2226" }} />
      <div style={{ position: "absolute", left: 650, top: 18, width: 226, height: 44 }}>
        <StaplesNightDots text={bright ? st.period : ""} size={38} w={226} color={bright ? L.amber : L.amberDim} dim={L.amberDim} glow={bright ? st.power : 0} anchor="end" />
      </div>
      <div style={{ position: "absolute", left: 650, top: 80, transform: `scale(${1 + 0.05 * cf})`, transformOrigin: "right center" }}>
        <StaplesNightReadout text={st.clock} h={60} w={226} color={bright ? L.amber : L.amberDim} dim={L.amberDim} glow={bright ? st.power * (0.9 + 0.8 * cf) : 0} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(165deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 38%)" }} />
      {shade > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shade.toFixed(3)})` }} />}
    </div>
  );
};

/** the small corner box: the real game score, LAL against DAL, period and clock */
export const DallasBenchMini: React.FC<{ lal: number; dal: number; period: string; clock: string; flashLal?: number; flashDal?: number; final?: number }> = ({ lal, dal, period, clock, flashLal = 0, flashDal = 0, final = 0 }) => {
  const L = StaplesNightLed;
  const line = (y: number, name: string, v: number, fl: number) => (
    <div style={{ position: "absolute", left: 0, top: y, width: 380, height: 46 }}>
      <div style={{ position: "absolute", left: 14, top: 6 }}>
        <StaplesNightDots text={name} size={30} w={90} color={L.amber} dim={L.amberDim} glow={0.8} />
      </div>
      <div style={{ position: "absolute", left: 84, top: 4 }}>
        <StaplesNightReadout text={String(v)} h={36} w={96} color={L.red} dim={L.redDim} glow={1 + fl * 0.9 + final * 0.5} pad={3} />
      </div>
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 390,
        height: 112,
        borderRadius: 10,
        background: L.housing,
        border: `2px solid ${L.edge}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.7)",
        overflow: "hidden",
      }}
    >
      {line(8, "LAL", lal, flashLal)}
      {line(58, "DAL", dal, flashDal)}
      <div style={{ position: "absolute", left: 196, top: 10, width: 2, height: 92, background: "#1f2226" }} />
      <div style={{ position: "absolute", left: 210, top: 14, width: 164, height: 34 }}>
        <StaplesNightDots text={period} size={26} w={164} color={L.amber} dim={L.amberDim} glow={0.8 + final * 0.6} anchor="end" />
      </div>
      <div style={{ position: "absolute", left: 210, top: 62 }}>
        <StaplesNightReadout text={clock} h={34} w={164} color={L.amber} dim={L.amberDim} glow={0.8} />
      </div>
    </div>
  );
};

/** one point: a round bulb in its socket. lit 0..1, glow multiplies the halo */
export const DallasBenchBulb: React.FC<{ x: number; y: number; r: number; color: string; lit: number; glow?: number; socket?: number; alpha?: number }> = ({ x, y, r, color, lit, glow = 1, socket = 1, alpha = 1 }) => {
  if (alpha <= 0.001) return null;
  const big = r > 8;
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, opacity: alpha }}>
      {lit > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: -r * 1.6,
            top: -r * 1.6,
            width: r * 5.2,
            height: r * 5.2,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 62%)`,
            opacity: Math.min(1, 0.42 * lit * glow),
          }}
        />
      )}
      {socket > 0.01 && (
        <div style={{ position: "absolute", inset: big ? -3 : -1, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #2a3038 0%, #12161c 70%)", border: big ? "1.5px solid #3b424c" : "1px solid #2b3139", opacity: socket }} />
      )}
      <div
        style={{
          position: "absolute",
          inset: big ? 1 : 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 46% 40%, #FFFDF4 0%, ${color} ${Math.round(38 + 20 * (1 - lit))}%, ${color} 70%, rgba(0,0,0,0.35) 100%)`,
          opacity: lit,
          boxShadow: `0 0 ${(r * 0.6 * glow * lit).toFixed(1)}px ${color}`,
        }}
      />
      {big && <div style={{ position: "absolute", left: r * 0.45, top: r * 0.3, width: r * 0.55, height: r * 0.32, borderRadius: "50%", background: "rgba(255,255,255,0.55)", opacity: 0.25 + 0.5 * lit, transform: "rotate(-28deg)" }} />}
    </div>
  );
};

/** a team logo, bare, with an optional pulse */
export const DallasBenchLogo: React.FC<{ file: string; k?: number; pulse?: number }> = ({ file, k = 1, pulse = 0 }) => (
  <div style={{ width: 56, height: 56, opacity: k, transform: `scale(${(0.6 + 0.4 * k) * (1 + 0.22 * pulse)})`, filter: pulse > 0.01 ? `drop-shadow(0 0 ${(10 * pulse).toFixed(1)}px rgba(0,100,177,0.9))` : undefined }}>
    <Img src={staticFile(`kobe-81/${file}`)} style={{ width: 56, height: 56, objectFit: "contain" }} />
  </div>
);

/** Kobe's face, a small photo chip with the Lakers gold edge */
export const DallasBenchChip: React.FC<{ k: number }> = ({ k }) => (
  <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", border: "2px solid #FDB927", boxShadow: "0 0 12px rgba(253,185,39,0.45)", opacity: Math.min(1, k * 1.5), transform: `scale(${0.4 + 0.6 * k})` }}>
    <Img src={staticFile("kobe-81/dallasbench-kobe-chip.jpg")} style={{ width: 56, height: 56, objectFit: "cover" }} />
  </div>
);
