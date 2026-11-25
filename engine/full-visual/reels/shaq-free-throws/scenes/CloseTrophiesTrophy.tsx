// The Larry O'Brien Trophy, redrawn from Erik Drost's photo (CC BY 2.0, assets/refs/photos/commons-larry-obrien-
// trophy-2016-erikdrost-ccby2.jpg, read at full size, notes/CloseTrophies.md): a mirror-gold ball with engraved
// channels reflecting the room (ceiling light top right, a dark horizon band, a warm floor), a short stem with two
// collars, a vase wider at the top with a lip and hooks, the net engraved on it as three rows of knotted diamonds,
// a darker foot band, a bevelled square plinth. Local units: 200 x 500. `sweep` (-1..2) runs a light across it,
// `plate` (0..1) slides an engraved FINALS MVP plate onto the plinth, `plateShine` runs a light over that plate.
import React from "react";

const W = 200;
const BALL = { cx: 100, cy: 97, r: 95 };
const VASE_TOP = 216, VASE_BOT = 440;
const halfAt = (y: number) => 88 - ((y - VASE_TOP) / (VASE_BOT - VASE_TOP)) * 15; // 176 wide at the lip, 146 at the foot

const VASE = `M${100 - halfAt(VASE_TOP)} ${VASE_TOP} L${100 + halfAt(VASE_TOP)} ${VASE_TOP} L${100 + halfAt(VASE_BOT)} ${VASE_BOT} L${100 - halfAt(VASE_BOT)} ${VASE_BOT} Z`;

/** the engraved net: knots on four rows, cords between them, seen on the front half of the vase */
const CLOSE_TROPHIES_NET = (() => {
  const rows = [226, 290, 352, 412];
  const knot = (row: number, deg: number) => {
    const y = rows[row];
    return { x: 100 + (halfAt(y) - 4) * Math.sin((deg * Math.PI) / 180), y };
  };
  let cords = "";
  const knots: { x: number; y: number }[] = [];
  for (let row = 0; row < rows.length; row++) {
    const off = row % 2 ? 15 : 0;
    for (let a = -75 + off; a <= 75 + off - (off ? 30 : 0) + 0.1; a += 30) {
      const k = knot(row, a);
      if (row > 0) knots.push(k);
      if (row < rows.length - 1) {
        for (const d of [-15, 15]) {
          const n = knot(row + 1, a + d);
          if (Math.abs(a + d) <= 82) cords += `M${k.x.toFixed(1)} ${k.y.toFixed(1)}Q${((k.x + n.x) / 2 + d * 0.06).toFixed(1)} ${((k.y + n.y) / 2 + 3).toFixed(1)} ${n.x.toFixed(1)} ${n.y.toFixed(1)}`;
        }
      } else {
        // the last row: the cords hang a little and stop, as a real net does
        cords += `M${k.x.toFixed(1)} ${k.y.toFixed(1)}l${(-k.x + 100) * 0.04} 16`;
      }
    }
  }
  const hooks = [-75, -45, -15, 15, 45, 75].map((a) => 100 + (halfAt(VASE_TOP) - 4) * Math.sin((a * Math.PI) / 180));
  return { cords, knots, hooks };
})();

export const CloseTrophiesTrophy: React.FC<{ id: string; sweep: number; plate: number; plateShine: number; f: number }> = ({ id, sweep, plate, plateShine, f }) => {
  const g = (n: string) => `ct-${id}-${n}`;
  const net = CLOSE_TROPHIES_NET;
  // the room's reflection on the ball drifts a hair, as it would when the camera breathes
  const drift = Math.sin(f / 50) * 3;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} 500`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={g("vase")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4A2E07" />
          <stop offset="0.07" stopColor="#A9741C" />
          <stop offset="0.16" stopColor="#FFEBAE" />
          <stop offset="0.24" stopColor="#D69F37" />
          <stop offset="0.38" stopColor="#6B440E" />
          <stop offset="0.5" stopColor="#3B2507" />
          <stop offset="0.61" stopColor="#8C5D17" />
          <stop offset="0.73" stopColor="#F3CC72" />
          <stop offset="0.79" stopColor="#FFF4CC" />
          <stop offset="0.87" stopColor="#C38A28" />
          <stop offset="1" stopColor="#4F3108" />
        </linearGradient>
        <linearGradient id={g("vaseV")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="0.75" stopColor="#000" stopOpacity={0.05} />
          <stop offset="1" stopColor="#000" stopOpacity={0.3} />
        </linearGradient>
        <radialGradient id={g("ball")} cx="0.62" cy="0.3" r="0.78">
          <stop offset="0" stopColor="#FFF6D6" />
          <stop offset="0.18" stopColor="#F7D47E" />
          <stop offset="0.5" stopColor="#C68E2C" />
          <stop offset="0.82" stopColor="#7A4E10" />
          <stop offset="1" stopColor="#3E2706" />
        </radialGradient>
        <linearGradient id={g("floor")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD98A" stopOpacity={0} />
          <stop offset="1" stopColor="#FFC560" stopOpacity={0.55} />
        </linearGradient>
        <linearGradient id={g("plinth")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5A3A0A" />
          <stop offset="0.2" stopColor="#E9BE62" />
          <stop offset="0.45" stopColor="#8A5C16" />
          <stop offset="0.7" stopColor="#F4D488" />
          <stop offset="1" stopColor="#5A3A0A" />
        </linearGradient>
        <linearGradient id={g("plate")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F6F8" />
          <stop offset="0.5" stopColor="#C9D0D6" />
          <stop offset="1" stopColor="#9AA3AC" />
        </linearGradient>
        <linearGradient id={g("sweep")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
          <stop offset="0.5" stopColor="#FFFBEA" stopOpacity={0.85} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
        <clipPath id={g("ballclip")}><circle cx={BALL.cx} cy={BALL.cy} r={BALL.r} /></clipPath>
        <clipPath id={g("all")}>
          <circle cx={BALL.cx} cy={BALL.cy} r={BALL.r} />
          <rect x={80} y={188} width={40} height={30} />
          <path d={VASE} />
          <rect x={10} y={436} width={180} height={62} />
        </clipPath>
        <filter id={g("soft")} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={5} /></filter>
      </defs>

      {/* the ball: mirror gold reflecting the room */}
      <circle cx={BALL.cx} cy={BALL.cy} r={BALL.r} fill={`url(#${g("ball")})`} />
      <g clipPath={`url(#${g("ballclip")})`}>
        {/* the dark horizon band of the room, bent by the sphere */}
        <path d={`M0 ${92 + drift} C 50 ${118 + drift}, 150 ${118 + drift}, 200 ${88 + drift} L200 ${126 + drift} C 150 ${150 + drift}, 50 ${150 + drift}, 0 ${124 + drift} Z`} fill="#24160A" opacity={0.85} filter={`url(#${g("soft")})`} />
        {/* the room in the mirror: a lit doorway and the bright strip of the ceiling above the horizon */}
        <rect x={44 + drift} y={70} width={22} height={30} rx={2} fill="#FFE2A0" opacity={0.6} filter={`url(#${g("soft")})`} />
        <path d={`M14 ${84 + drift} C 60 ${100 + drift}, 140 ${100 + drift}, 186 ${80 + drift}`} stroke="#FFF1C4" strokeWidth={3} fill="none" opacity={0.5} />
        {/* warm floor below */}
        <rect x={0} y={130} width={200} height={70} fill={`url(#${g("floor")})`} />
        {/* the ceiling light and a window strip */}
        <ellipse cx={136 + drift} cy={42} rx={17} ry={10} fill="#FFFFFF" opacity={0.95} filter={`url(#${g("soft")})`} />
        <ellipse cx={136 + drift} cy={42} rx={7} ry={4.5} fill="#FFFFFF" />
        <path d={`M28 ${70} C 34 40, 52 22, 74 14`} stroke="#FFF3CC" strokeWidth={6} fill="none" opacity={0.55} filter={`url(#${g("soft")})`} />
        {/* the engraved channels: a dark cut with a lit edge beside it */}
        {[
          "M100 2 C 84 60, 84 136, 100 192",
          "M18 46 C 60 80, 62 122, 20 156",
          "M182 46 C 140 80, 138 122, 180 156",
          "M4 98 C 60 122, 140 122, 196 98",
        ].map((d, i) => (
          <g key={i}>
            <path d={d} stroke="#3E2706" strokeWidth={3} fill="none" opacity={0.85} />
            <path d={d} stroke="#FFE7A6" strokeWidth={1.4} fill="none" opacity={0.6} transform="translate(2 1.5)" />
          </g>
        ))}
        {/* the rim shadow at the bottom of the sphere */}
        <circle cx={BALL.cx} cy={BALL.cy} r={BALL.r} fill="none" stroke="#2A1A05" strokeWidth={10} opacity={0.35} />
      </g>

      {/* the stem: two collars and a neck */}
      <rect x={86} y={190} width={28} height={8} rx={2} fill={`url(#${g("plinth")})`} />
      <rect x={91} y={198} width={18} height={8} fill="#6B440E" />
      <rect x={80} y={205} width={40} height={10} rx={2} fill={`url(#${g("plinth")})`} />

      {/* the vase */}
      <path d={VASE} fill={`url(#${g("vase")})`} />
      <path d={VASE} fill={`url(#${g("vaseV")})`} />
      {/* the lip */}
      <rect x={8} y={212} width={184} height={8} rx={2} fill={`url(#${g("plinth")})`} />
      <rect x={8} y={219} width={184} height={1.5} fill="#2A1A05" opacity={0.6} />
      {/* the hooks the net hangs from */}
      {net.hooks.map((x, i) => (
        <rect key={i} x={x - 4} y={219} width={8} height={10} rx={1.5} fill="none" stroke="#3E2706" strokeWidth={1.6} opacity={0.85} />
      ))}
      {/* the engraved net: knotted diamonds narrowing downward */}
      <path d={net.cords} stroke="#3B2507" strokeWidth={2.2} fill="none" opacity={0.75} />
      <path d={net.cords} stroke="#FFE6A0" strokeWidth={0.9} fill="none" opacity={0.55} transform="translate(1.4 1)" />
      {net.knots.map((k, i) => (
        <g key={i}>
          <circle cx={k.x} cy={k.y} r={4} fill="none" stroke="#3B2507" strokeWidth={1.8} opacity={0.8} />
          <circle cx={k.x + 1} cy={k.y + 0.8} r={4} fill="none" stroke="#FFE6A0" strokeWidth={0.7} opacity={0.5} />
        </g>
      ))}
      {/* the foot band */}
      <rect x={100 - halfAt(VASE_BOT) + 2} y={VASE_BOT} width={2 * halfAt(VASE_BOT) - 4} height={14} fill="#2B1B05" />
      <rect x={100 - halfAt(VASE_BOT) + 2} y={VASE_BOT} width={2 * halfAt(VASE_BOT) - 4} height={2} fill="#F3CC72" opacity={0.6} />

      {/* the plinth: bevelled top, front face */}
      <path d="M22 454 L178 454 L190 464 L10 464 Z" fill="#F2CF7E" />
      <rect x={10} y={464} width={180} height={34} fill={`url(#${g("plinth")})`} />
      <rect x={10} y={496} width={180} height={2} fill="#2A1A05" opacity={0.6} />

      {/* the engraved FINALS MVP plate slides on */}
      {plate > 0.001 && (
        <g transform={`translate(${((1 - plate) * -150).toFixed(1)} 0)`} opacity={Math.min(1, plate * 1.6)}>
          <rect x={40} y={468} width={120} height={26} rx={3} fill={`url(#${g("plate")})`} stroke="#6C747C" strokeWidth={1} />
          <text x={100} y={486.5} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={13.5} letterSpacing={1.6} fill="#2C3136">FINALS MVP</text>
          {plateShine > 0 && plateShine < 1 && (
            <rect x={40 + plateShine * 150 - 40} y={468} width={30} height={26} fill={`url(#${g("sweep")})`} opacity={0.9} />
          )}
        </g>
      )}

      {/* the light running across the gold */}
      {sweep > -0.5 && sweep < 1.5 && (
        <g clipPath={`url(#${g("all")})`}>
          <rect x={-60 + sweep * 260} y={-40} width={56} height={600} fill={`url(#${g("sweep")})`} transform={`rotate(14 ${-32 + sweep * 260} 250)`} style={{ mixBlendMode: "screen" }} />
        </g>
      )}
    </svg>
  );
};
