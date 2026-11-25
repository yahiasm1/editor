// The shooter's white sneakers from straight above, in world feet (inside the camera group, y up), facing the basket
// (-x) in the right corner. Drawn from the Stanton Street Huarache (white leather upper, midsole lip showing round the
// upper, toe box perforations, seven eyelet pairs and six lace crossings, padded tongue and its pull tab, padded
// collar, heel pull tab) and the Parker heels photo (crew sock rising out of the collar with its ribbing and dark
// stripe, a dark contact shadow and a soft reflection in the satin maple). 13.4 in long, 4.4 in across the ball.
// A set shooter's stance is staggered: the lead foot's toe at the line, the back foot half a shoe behind it.
// Shoe space: toe at u 0, heel at u L, v across (positive = medial side when medial is 1).
import React from "react";

export const RA_SHOE_L = 1.12;
// half widths of the upper from the heel (t 0) to the toe (t 1)
const T = [0, 0.03, 0.08, 0.15, 0.24, 0.33, 0.42, 0.52, 0.62, 0.72, 0.8, 0.87, 0.93, 0.97, 1];
const W = [0.07, 0.11, 0.128, 0.136, 0.138, 0.142, 0.155, 0.17, 0.182, 0.184, 0.176, 0.158, 0.126, 0.084, 0.0];

/** half width of the upper at heel-fraction t (Catmull-Rom through the table) */
function raShoeHalf(t: number) {
  const tt = Math.max(0, Math.min(1, t));
  let i = 0;
  while (i < T.length - 2 && tt > T[i + 1]) i++;
  const p0 = W[Math.max(0, i - 1)], p1 = W[i], p2 = W[i + 1], p3 = W[Math.min(W.length - 1, i + 2)];
  const s = (tt - T[i]) / (T[i + 1] - T[i]);
  const s2 = s * s, s3 = s2 * s;
  return 0.5 * (2 * p1 + (-p0 + p2) * s + (2 * p0 - 5 * p1 + 4 * p2 - p3) * s2 + (-p0 + 3 * p1 - 3 * p2 + p3) * s3);
}
/** the last curves in at the arch, toward the medial side */
const raArch = (t: number, medial: number) => 0.022 * Math.sin(Math.PI * t) * medial;

/** a closed outline: grow pads it outward all round (toe and heel too), from u0 to u1 of the length */
function raOutline(grow: number, medial: number, n = 56) {
  const L: string[] = [];
  const R: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI;
    const t = (1 - Math.cos(a)) / 2; // denser at the toe and heel, so they come out round
    const u = RA_SHOE_L * (1 - t) - grow * (t > 0.5 ? (t - 0.5) * 2 : -(0.5 - t) * 2) * 0.9;
    const w = Math.max(0, raShoeHalf(t) + grow * Math.sin(a) ** 0.35);
    const c = raArch(t, medial);
    L.push(`${u.toFixed(4)} ${(c + w).toFixed(4)}`);
    R.push(`${u.toFixed(4)} ${(c - w).toFixed(4)}`);
  }
  return `M${L.join(" L")} L${[...R].reverse().join(" L")} Z`;
}

/** one side's edge as an open path from u0 to u1, inset by `inset` */
function raEdge(side: 1 | -1, inset: number, uA: number, uB: number, medial: number, n = 20) {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = uA + ((uB - uA) * i) / n;
    const t = 1 - u / RA_SHOE_L;
    pts.push(`${u.toFixed(4)} ${(raArch(t, medial) + side * Math.max(0, raShoeHalf(t) - inset)).toFixed(4)}`);
  }
  return `M${pts.join(" L")}`;
}

const raDash = { strokeDasharray: "0.012 0.009" };

const Shoe: React.FC<{ id: string; x: number; y: number; rot: number; lift: number; medial: 1 | -1 }> = ({ id, x, y, rot, lift, medial }) => {
  const s = 1 + lift * 0.35;
  const m = medial;
  const UPPER = raOutline(0, m);
  const MIDSOLE = raOutline(0.03, m);
  const OUTSOLE = raOutline(0.036, m);
  const SHADOW = raOutline(0.04, m);
  const AMBIENT = raOutline(0.09, m);
  const c = (u: number) => raArch(1 - u / RA_SHOE_L, m);

  // eyelets: seven pairs up the throat, the rows opening slightly toward the collar
  const EY = 7;
  const eyU = (k: number) => 0.33 + k * 0.071;
  const eyV = (k: number) => 0.074 + k * 0.0035;
  // laces: a straight bar across the first pair, then six crossings, each over-lace drawn last
  const lace = (k: number, side: 1 | -1, key: string) => {
    const u0 = eyU(k), u1 = eyU(k + 1);
    const a = { x: u0, y: c(u0) + side * eyV(k) };
    const b = { x: u1, y: c(u1) - side * eyV(k + 1) };
    const d = `M${a.x} ${a.y} Q${(a.x + b.x) / 2 - 0.006} ${(a.y + b.y) / 2} ${b.x} ${b.y}`;
    return (
      <g key={key}>
        <path d={d} fill="none" stroke="#5B4A36" strokeOpacity={0.35} strokeWidth={0.03} strokeLinecap="round" transform="translate(0.006 -0.008)" filter={`url(#${id}-tight)`} />
        <path d={d} fill="none" stroke="#A7AEB6" strokeWidth={0.026} strokeLinecap="round" />
        <path d={d} fill="none" stroke="#FAFBFC" strokeWidth={0.019} strokeLinecap="round" />
        <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={0.006} strokeLinecap="round" transform="translate(-0.002 0.004)" />
      </g>
    );
  };
  const under: React.ReactNode[] = [];
  const over: React.ReactNode[] = [];
  for (let k = 0; k < EY - 1; k++) {
    under.push(lace(k, k % 2 ? 1 : -1, `lu${k}`));
    over.push(lace(k, k % 2 ? -1 : 1, `lo${k}`));
  }
  const eyelets: React.ReactNode[] = [];
  for (let k = 0; k < EY; k++)
    for (const sd of [1, -1] as const) {
      const cx = eyU(k), cy = c(eyU(k)) + sd * eyV(k);
      eyelets.push(
        <g key={`e${k}${sd}`}>
          <circle cx={cx} cy={cy} r={0.0145} fill="#C9CFD6" />
          <circle cx={cx} cy={cy} r={0.0145} fill="none" stroke="#8D959E" strokeWidth={0.003} />
          <circle cx={cx} cy={cy} r={0.0085} fill="#2B313A" />
          <circle cx={cx - 0.003} cy={cy + 0.004} r={0.004} fill="#FFFFFF" opacity={0.6} />
        </g>,
      );
    }
  // toe box perforations, real size (3 mm holes on an 8 mm grid), in rows that follow the toe cap
  const perf: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const u = 0.075 + i * 0.026;
    const hw = raShoeHalf(1 - u / RA_SHOE_L) - 0.04;
    const nCol = Math.floor((2 * hw) / 0.026);
    for (let j = 0; j <= nCol; j++) {
      const v = c(u) - hw + j * ((2 * hw) / Math.max(1, nCol)) + (i % 2 ? 0.013 : 0);
      if (Math.abs(v - c(u)) > hw) continue;
      perf.push(
        <g key={`p${i}_${j}`}>
          <circle cx={u} cy={v} r={0.0056} fill="#7D858F" />
          <circle cx={u + 0.0022} cy={v - 0.0025} r={0.0032} fill="#3A4049" />
        </g>,
      );
    }
  }
  // the crew sock's ribs: short radial ticks round the cuff
  const ribs: React.ReactNode[] = [];
  for (let k = 0; k < 44; k++) {
    const a = (k / 44) * Math.PI * 2;
    const ca = Math.cos(a), sa = Math.sin(a);
    ribs.push(
      <line key={`r${k}`} x1={0.96 + 0.083 * ca} y1={c(0.96) + 0.066 * sa} x2={0.96 + 0.112 * ca} y2={c(0.96) + 0.09 * sa} stroke="#AEB6BF" strokeWidth={0.004} opacity={0.8} />,
    );
  }
  const vC = c(0.95);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {/* the satin maple's soft reflection of the white shoe, then the ambient shadow and the dark contact line */}
      <path d={AMBIENT} fill="#FFF8EC" opacity={0.22 * (1 - lift * 0.7)} filter={`url(#${id}-wide)`} transform="translate(-0.07 0.09)" />
      <path d={AMBIENT} fill="#2A1A0A" opacity={0.38 * (1 - lift * 0.5)} filter={`url(#${id}-soft)`} transform={`translate(${0.06 + lift * 0.28} ${-0.07 - lift * 0.32}) scale(${1 + lift * 0.12})`} />
      <path d={SHADOW} fill="#120B05" opacity={0.75 * (1 - lift)} filter={`url(#${id}-tight)`} transform="translate(0.012 -0.016)" />
      <g transform={`translate(${RA_SHOE_L / 2} 0) scale(${s}) translate(${-RA_SHOE_L / 2} 0)`}>
        {/* outsole edge (a grey rubber line), then the white midsole lip round the upper */}
        <path d={OUTSOLE} fill="#8E949A" />
        <path d={MIDSOLE} fill={`url(#${id}-mid)`} />
        <path d={raOutline(0.017, m)} fill="none" stroke="#D3D7DB" strokeWidth={0.004} />
        {/* the upper's own shadow falling on the midsole */}
        <path d={UPPER} fill="#5F6770" opacity={0.45} filter={`url(#${id}-tight)`} transform="translate(0.008 -0.01)" />
        <path d={UPPER} fill={`url(#${id}-leather)`} stroke="#B9C0C8" strokeWidth={0.005} />
        {/* the mudguard overlay along both sides and round the toe, stitched */}
        <path d={raOutline(-0.03, m)} fill="none" stroke="#CDD3D9" strokeWidth={0.004} />
        <path d={raOutline(-0.038, m)} fill="none" stroke="#AAB2BB" strokeWidth={0.003} {...raDash} />
        {/* toe cap seam with its double stitch */}
        <path d={`M0.23 ${c(0.23) + 0.16} Q0.15 ${c(0.15)} 0.23 ${c(0.23) - 0.16}`} fill="none" stroke="#BCC3CB" strokeWidth={0.006} />
        <path d={`M0.245 ${c(0.245) + 0.158} Q0.165 ${c(0.165)} 0.245 ${c(0.245) - 0.158}`} fill="none" stroke="#A9B1BA" strokeWidth={0.003} {...raDash} />
        {perf}
        {/* the heel counter, and its stitch */}
        <path d={raEdge(1, 0.012, 0.86, RA_SHOE_L, m)} fill="none" stroke="#C6CCD3" strokeWidth={0.02} />
        <path d={raEdge(-1, 0.012, 0.86, RA_SHOE_L, m)} fill="none" stroke="#C6CCD3" strokeWidth={0.02} />
        <path d={raEdge(1, 0.03, 0.88, 1.08, m)} fill="none" stroke="#A9B1BA" strokeWidth={0.003} {...raDash} />
        <path d={raEdge(-1, 0.03, 0.88, 1.08, m)} fill="none" stroke="#A9B1BA" strokeWidth={0.003} {...raDash} />
        {/* the light catching the vamp's crown */}
        <ellipse cx={0.2} cy={c(0.2) + 0.03} rx={0.12} ry={0.05} fill="#FFFFFF" opacity={0.55} filter={`url(#${id}-tight)`} />
        {/* padded collar: the rolled rim, its dark lining, the crew sock rising out of it */}
        <ellipse cx={0.955} cy={vC} rx={0.17} ry={0.142} fill={`url(#${id}-collar)`} />
        <ellipse cx={0.955} cy={vC} rx={0.17} ry={0.142} fill="none" stroke="#B4BBC3" strokeWidth={0.004} />
        <ellipse cx={0.958} cy={vC} rx={0.132} ry={0.108} fill="#262B33" />
        <ellipse cx={0.958} cy={vC} rx={0.132} ry={0.108} fill="none" stroke="#11151B" strokeWidth={0.006} />
        <ellipse cx={0.962} cy={vC} rx={0.114} ry={0.093} fill={`url(#${id}-sock)`} />
        {ribs}
        {/* the crew sock's dark stripe, on the outside of the leg as in the Parker photo */}
        {(() => {
          const arc = (a0: number, a1: number) => {
            const P = (a: number) => `${(0.962 + 0.1 * Math.cos(a)).toFixed(4)} ${(vC + 0.081 * Math.sin(a) * -m).toFixed(4)}`;
            return `M${P(a0)} A0.1 0.081 0 0 ${m > 0 ? 0 : 1} ${P(a1)}`;
          };
          return <path d={arc(0.55, 1.35)} fill="none" stroke="#1F2A4A" strokeWidth={0.02} opacity={0.92} />;
        })()}
        <ellipse cx={0.962} cy={vC} rx={0.07} ry={0.055} fill="#FFFFFF" opacity={0.5} filter={`url(#${id}-tight)`} />
        {/* the heel pull tab, folded back over the counter */}
        <rect x={RA_SHOE_L - 0.03} y={vC - 0.03} width={0.075} height={0.06} rx={0.016} fill="#E4E8EC" stroke="#9AA2AB" strokeWidth={0.004} />
        <rect x={RA_SHOE_L - 0.012} y={vC - 0.014} width={0.04} height={0.028} rx={0.01} fill="#3A414B" />
        {/* the padded tongue under the laces, its top lying against the sock, with its pull tab */}
        <path
          d={`M0.3 ${c(0.3) + 0.06} L0.84 ${c(0.84) + 0.085} Q0.9 ${c(0.9) + 0.08} 0.905 ${c(0.9)} Q0.9 ${c(0.9) - 0.08} 0.84 ${c(0.84) - 0.085} L0.3 ${c(0.3) - 0.06} Q0.27 ${c(0.27)} 0.3 ${c(0.3) + 0.06} Z`}
          fill={`url(#${id}-tongue)`}
          stroke="#B3BAC2"
          strokeWidth={0.004}
        />
        <path d={`M0.845 ${c(0.845) + 0.07} Q0.89 ${c(0.89)} 0.845 ${c(0.845) - 0.07}`} fill="none" stroke="#A9B1BA" strokeWidth={0.003} {...raDash} />
        <rect x={0.86} y={c(0.88) - 0.032} width={0.062} height={0.064} rx={0.014} fill="#EEF1F3" stroke="#98A0A9" strokeWidth={0.004} />
        <rect x={0.873} y={c(0.88) - 0.02} width={0.036} height={0.04} rx={0.008} fill="none" stroke="#A9B1BA" strokeWidth={0.0025} {...raDash} />
        {/* the lace panel's edges, stitched, where the eyelets are punched */}
        {[1, -1].map((sd) => (
          <path
            key={`pe${sd}`}
            d={`M0.31 ${c(0.31) + sd * 0.098} L0.81 ${c(0.81) + sd * 0.12}`}
            fill="none"
            stroke="#AFB7BF"
            strokeWidth={0.003}
            {...raDash}
          />
        ))}
        {/* a straight bar through the first pair, the under-laces, the eyelets, then the over-laces on top */}
        <path d={`M${eyU(0)} ${c(eyU(0)) + eyV(0)} L${eyU(0)} ${c(eyU(0)) - eyV(0)}`} stroke="#A7AEB6" strokeWidth={0.026} strokeLinecap="round" />
        <path d={`M${eyU(0)} ${c(eyU(0)) + eyV(0)} L${eyU(0)} ${c(eyU(0)) - eyV(0)}`} stroke="#FAFBFC" strokeWidth={0.019} strokeLinecap="round" />
        {under}
        {eyelets}
        {over}
        {/* the bow at the top pair: two loops lying out to the sides and two ends trailing toward the heel */}
        {(() => {
          const bu = eyU(EY - 1) + 0.01, bv = c(bu);
          const loopA = `M${bu} ${bv} C${bu - 0.06} ${bv + m * 0.05} ${bu - 0.02} ${bv + m * 0.17} ${bu + 0.04} ${bv + m * 0.13} C${bu + 0.07} ${bv + m * 0.1} ${bu + 0.03} ${bv + m * 0.03} ${bu} ${bv}`;
          const loopB = `M${bu} ${bv} C${bu - 0.05} ${bv - m * 0.05} ${bu - 0.035} ${bv - m * 0.15} ${bu + 0.025} ${bv - m * 0.135} C${bu + 0.06} ${bv - m * 0.115} ${bu + 0.03} ${bv - m * 0.03} ${bu} ${bv}`;
          const endA = `M${bu} ${bv} C${bu + 0.04} ${bv + m * 0.02} ${bu + 0.1} ${bv + m * 0.05} ${bu + 0.15} ${bv + m * 0.11}`;
          const endB = `M${bu} ${bv} C${bu + 0.05} ${bv - m * 0.01} ${bu + 0.09} ${bv - m * 0.06} ${bu + 0.11} ${bv - m * 0.15}`;
          const strand = (d: string, k: string) => (
            <g key={k}>
              <path d={d} fill="none" stroke="#5B4A36" strokeOpacity={0.3} strokeWidth={0.03} strokeLinecap="round" transform="translate(0.008 -0.01)" filter={`url(#${id}-tight)`} />
              <path d={d} fill="none" stroke="#A7AEB6" strokeWidth={0.025} strokeLinecap="round" />
              <path d={d} fill="none" stroke="#FBFBFC" strokeWidth={0.018} strokeLinecap="round" />
            </g>
          );
          return (
            <g>
              {strand(endA, "ea")}
              {strand(endB, "eb")}
              {/* the aglets */}
              <circle cx={bu + 0.15} cy={bv + m * 0.11} r={0.012} fill="#C7CDD4" stroke="#8D959E" strokeWidth={0.003} />
              <circle cx={bu + 0.11} cy={bv - m * 0.15} r={0.012} fill="#C7CDD4" stroke="#8D959E" strokeWidth={0.003} />
              {strand(loopA, "la")}
              {strand(loopB, "lb")}
              <ellipse cx={bu} cy={bv} rx={0.018} ry={0.014} fill="#F4F6F8" stroke="#A0A8B1" strokeWidth={0.004} />
            </g>
          );
        })()}
      </g>
    </g>
  );
};

/** the pair. toeX = where the lead toe sits; lift 0..1 = in the air (bigger, shadow spread) */
export const RulebookArcShoes: React.FC<{ toeX: number; lift: number; opacity: number }> = ({ toeX, lift, opacity }) => {
  if (opacity <= 0.001) return null;
  const id = "ra-shoe";
  return (
    <g opacity={opacity}>
      <defs>
        <filter id={`${id}-soft`} x="-40%" y="-80%" width="180%" height="260%">
          <feGaussianBlur stdDeviation={0.05} />
        </filter>
        <filter id={`${id}-wide`} x="-40%" y="-80%" width="180%" height="260%">
          <feGaussianBlur stdDeviation={0.08} />
        </filter>
        <filter id={`${id}-tight`} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation={0.012} />
        </filter>
        <radialGradient id={`${id}-leather`} cx="0.42" cy="0.45" r="0.75">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor="#F1F3F5" />
          <stop offset="0.9" stopColor="#D9DEE3" />
          <stop offset="1" stopColor="#C3CAD1" />
        </radialGradient>
        <radialGradient id={`${id}-mid`} cx="0.5" cy="0.5" r="0.62">
          <stop offset="0.7" stopColor="#F6F6F3" />
          <stop offset="1" stopColor="#D6D8D6" />
        </radialGradient>
        <radialGradient id={`${id}-collar`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.72" stopColor="#B9C0C7" />
          <stop offset="0.82" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D6DBE0" />
        </radialGradient>
        <radialGradient id={`${id}-sock`} cx="0.45" cy="0.42" r="0.62">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.65" stopColor="#E6E9EC" />
          <stop offset="1" stopColor="#A3ABB4" />
        </radialGradient>
        <linearGradient id={`${id}-tongue`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D8DDE2" />
          <stop offset="0.5" stopColor="#F4F6F8" />
          <stop offset="1" stopColor="#D2D8DE" />
        </linearGradient>
      </defs>
      {/* back foot (the left foot of a right-handed shooter facing the basket) half a shoe behind */}
      <Shoe id={id} x={toeX + 0.5} y={-0.62} rot={7} lift={lift} medial={1} />
      <Shoe id={id} x={toeX} y={0.72} rot={-5} lift={lift} medial={-1} />
    </g>
  );
};
