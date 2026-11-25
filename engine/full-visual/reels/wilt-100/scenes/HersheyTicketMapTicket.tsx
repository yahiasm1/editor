// wilt-100 "hershey": the ticket, the thread of the scene. A cream 1962-style admission ticket printed in the
// arena's own language (the 1936 Hershey Sports Arena programme: black and red ink only, a red double rule, very
// widely spaced red caps for the venue), a perforated stub at right. Its fields fill on the words: the date is typed
// and the year stamped, the venue typed in red, the game typed, the Knicks mark stamped, and the stub torn off.
import React from "react";
import { Img, staticFile } from "remotion";
import { ease, prog } from "../../../src/engine";
import {
  HTM_COURIER, HTM_INK, HTM_OSWALD, HTM_PAPER, HTM_RED, type HersheyT, htmClamp, htmLerp, htmRnd, htmTicketPose,
} from "./HersheyTicketMapKit";

const W = 860;
const H = 400;
const PERF = 640; // the perforation
const FAINT = "#9C8E74"; // printed rules and field labels, a brown-grey ink

/** typed characters, each struck a little differently, like a real typewriter on card */
const Typed: React.FC<{ text: string; f: number; at: number; msPerChar: number; x: number; y: number; size: number; fill: string; font: string; weight?: number; spacing?: number; seed: number }> = ({ text, f, at, msPerChar, x, y, size, fill, font, weight = 700, spacing = 0, seed }) => {
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - at) / 60) * (1000 / msPerChar))));
  if (n <= 0) return null;
  return (
    <text x={x} y={y} fontFamily={font} fontWeight={weight} fontSize={size} letterSpacing={spacing} fill={fill}>
      {text.slice(0, n).split("").map((c, i) => {
        const fresh = i === n - 1 && n < text.length;
        return (
          <tspan key={i} fillOpacity={fresh ? 1 : 0.8 + htmRnd(seed + i) * 0.2} dy={i === 0 ? 0 : 0} baselineShift={(htmRnd(seed + i * 3) - 0.5) * 1.6}>
            {c}
          </tspan>
        );
      })}
    </text>
  );
};

/** one band of the rotary date stamp: rolls from one digit to another with a whole extra turn */
const Band: React.FC<{ i: number; x: number; y: number; from: number; to: number; p: number; font: string }> = ({ i, x, y, from, to, p, font }) => {
  const travel = ((to - from + 10) % 10) + 10;
  const v = from + travel * p;
  const d0 = Math.floor(v);
  const fr = v - d0;
  const dg = (d: number) => String(((d % 10) + 10) % 10);
  return (
    <g>
      <clipPath id={`htm-band-${i}`}><rect x={x - 17} y={y - 44} width={34} height={58} rx={3} /></clipPath>
      <rect x={x - 17} y={y - 44} width={34} height={58} rx={3} fill="#2A2C2F" />
      <g clipPath={`url(#htm-band-${i})`}>
        <text x={x} y={y - fr * 50} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={44} fill="#E8E2D2">{dg(d0)}</text>
        <text x={x} y={y + 50 - fr * 50} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={44} fill="#E8E2D2">{dg(d0 + 1)}</text>
      </g>
      <rect x={x - 17} y={y - 44} width={34} height={58} rx={3} fill="url(#htm-band-shade)" />
    </g>
  );
};

export const HersheyTicketMapTicket: React.FC<{ f: number; T: HersheyT }> = ({ f, T }) => {
  const P = htmTicketPose(f, T);
  if (f < T.born) return null;

  // the year: steel bands roll 2026 -> 1962 and land on "1962", the stamp thumps, lifts, leaves red ink
  const rollStart = T.two - 2;
  const thump = T.y1962 + 3;
  const roll = prog(f, rollStart, thump - rollStart, ease.inOut);
  const press = f < thump ? 0 : f < thump + 4 ? prog(f, thump, 4, ease.in) : 1 - prog(f, thump + 4, 10, ease.out);
  const lift = prog(f, thump + 6, 12, ease.in);
  const ink = prog(f, thump + 1, 3, ease.linear);
  const spread = prog(f, thump + 1, 18, ease.out);
  const steelIn = prog(f, rollStart - 4, 6, ease.out);

  // the stub's red H prints on "Hershey"; the Knicks mark stamps on "Knicks"; the stub tears off after it
  const hInk = prog(f, T.hershey, 4, ease.linear);
  const kStamp = prog(f, T.knicks - 1, 7, ease.in);
  const kLand = f >= T.knicks + 6;
  const tear = prog(f, T.knicks + 8, 16, ease.inOut);
  const tearPull = prog(f, T.knicks + 4, 6, ease.out) * (1 - tear); // the tug before it gives

  const pin = { x: 750, y: 330 };
  const knickSize = 128;
  const kS = f < T.knicks - 1 ? 0 : htmLerp(1.7, 1, kStamp) + (kLand ? Math.sin(htmClamp((f - T.knicks - 6) / 8) * Math.PI) * -0.04 : 0);

  const holes = Array.from({ length: 23 }, (_, i) => 18 + i * 16.5);
  // the torn stub ends exactly where the crowd scene picks it up (frame centre 895,990, tilted 7 deg, scale 0.95, see
  // CrowdHalfEmptyProps), so the handover carries one stub, not two. Its target is mapped back into the ticket's own
  // space every frame (the ticket keeps swaying), so once torn it holds still on the frame.
  const rr = (-P.rot * Math.PI) / 180;
  const fx = (895 - P.cx) / P.s, fy = (990 - P.cy) / P.s;
  const tgtX = W / 2 + fx * Math.cos(rr) - fy * Math.sin(rr);
  const tgtY = H / 2 + fx * Math.sin(rr) + fy * Math.cos(rr);
  const stubCx = htmLerp(750, tgtX, tear) + tearPull * 6;
  const stubCy = htmLerp(H / 2, tgtY, tear) + Math.sin(tear * Math.PI) * 18;
  const stubTf = `translate(${stubCx.toFixed(2)} ${stubCy.toFixed(2)}) rotate(${(tear * (7 - P.rot)).toFixed(3)}) scale(${htmLerp(1, 0.95 / P.s, tear).toFixed(4)}) translate(-750 ${-H / 2})`;

  return (
    <div
      style={{
        position: "absolute", left: P.cx - W / 2, top: P.cy - H / 2, width: W, height: H,
        transform: `perspective(1800px) rotateX(${(1 - P.inK) * 22}deg) scale(${P.s}) rotate(${P.rot}deg)`,
        transformOrigin: "50% 50%",
        opacity: prog(f, T.born, 4, ease.linear),
        filter: "drop-shadow(0 26px 30px rgba(0,0,0,0.55)) drop-shadow(0 4px 6px rgba(0,0,0,0.35))",
      }}
    >
      <svg width={W + 200} height={H + 120} viewBox={`0 0 ${W + 200} ${H + 120}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <filter id="htm-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={7} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.18  0 0 0 0.55 -0.12" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id="htm-fibre" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.22" numOctaves={2} seed={3} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.22  0 0 0 0.5 -0.18" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id="htm-ink" x="-10%" y="-20%" width="120%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves={2} seed={11} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={2.2} result="d" />
            <feGaussianBlur in="d" stdDeviation={0.35 + spread * 0.5} />
          </filter>
          <radialGradient id="htm-age" cx="50%" cy="45%" r="75%">
            <stop offset="0.55" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#6B4E22" stopOpacity={0.32} />
          </radialGradient>
          <linearGradient id="htm-band-shade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity={0.7} />
            <stop offset="0.3" stopColor="#000" stopOpacity={0} />
            <stop offset="0.7" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#000" stopOpacity={0.7} />
          </linearGradient>
          <mask id="htm-holes">
            <rect x={0} y={0} width={W} height={H} rx={12} fill="#fff" />
            {holes.map((y, i) => <circle key={i} cx={PERF} cy={y} r={4.6} fill="#000" />)}
            {/* the notches cut at the ends of the perforation */}
            <path d={`M${PERF - 12},0 L${PERF},12 L${PERF + 12},0 Z M${PERF - 12},${H} L${PERF},${H - 12} L${PERF + 12},${H} Z`} fill="#000" />
          </mask>
          <clipPath id="htm-main"><rect x={-10} y={-10} width={PERF + 10} height={H + 20} /></clipPath>
          <clipPath id="htm-stub"><rect x={PERF} y={-10} width={W - PERF + 10} height={H + 20} /></clipPath>
        </defs>

        {[0, 1].map((part) => (
          <g
            key={part}
            clipPath={part === 0 ? "url(#htm-main)" : "url(#htm-stub)"}
            transform={part === 1 ? stubTf : undefined}
          >
            <g mask="url(#htm-holes)">
              <rect x={0} y={0} width={W} height={H} rx={12} fill={HTM_PAPER} />
              <rect x={0} y={0} width={W} height={H} rx={12} fill="#fff" filter="url(#htm-fibre)" />
              <rect x={0} y={0} width={W} height={H} rx={12} fill="#fff" filter="url(#htm-grain)" />
              <rect x={0} y={0} width={W} height={H} rx={12} fill="url(#htm-age)" />
              {/* a faint light across the card: it is held, not printed flat */}
              <rect x={0} y={0} width={W} height={H} rx={12} fill="url(#htm-sheen)" />
            </g>
          </g>
        ))}
        <defs>
          <linearGradient id="htm-sheen" x1="0" x2="1" y1="0" y2="1">
            <stop offset={htmClamp(0.1 + ((f - T.born) / 400) % 1 * 0.6)} stopColor="#fff" stopOpacity={0} />
            <stop offset={htmClamp(0.25 + ((f - T.born) / 400) % 1 * 0.6)} stopColor="#fff" stopOpacity={0.16} />
            <stop offset={htmClamp(0.4 + ((f - T.born) / 400) % 1 * 0.6)} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* ---------- the main body ---------- */}
        <g clipPath="url(#htm-main)">
          <rect x={14} y={14} width={PERF - 28} height={H - 28} rx={4} fill="none" stroke={HTM_RED} strokeWidth={2.4} />
          <rect x={20} y={20} width={PERF - 40} height={H - 40} rx={2} fill="none" stroke={HTM_RED} strokeWidth={1} />
          <text x={44} y={60} fontFamily={HTM_OSWALD} fontWeight={600} fontSize={22} letterSpacing={5.2} fill={HTM_INK}>NATIONAL BASKETBALL ASSOCIATION</text>

          {/* PLACE */}
          <line x1={44} x2={600} y1={124} y2={124} stroke={FAINT} strokeWidth={1.4} />
          <text x={44} y={140} fontFamily={HTM_OSWALD} fontWeight={500} fontSize={13} letterSpacing={3} fill={FAINT}>PLACE</text>
          <g filter="url(#htm-ink)">
            <Typed text="HERSHEY SPORTS ARENA" f={f} at={T.town - 30} msPerChar={24} x={44} y={114} size={40} fill={HTM_RED} font={HTM_OSWALD} weight={700} spacing={6.4} seed={40} />
          </g>

          {/* GAME */}
          <line x1={44} x2={480} y1={200} y2={200} stroke={FAINT} strokeWidth={1.4} />
          <line x1={44} x2={480} y1={252} y2={252} stroke={FAINT} strokeWidth={1.4} />
          <text x={44} y={268} fontFamily={HTM_OSWALD} fontWeight={500} fontSize={13} letterSpacing={3} fill={FAINT}>GAME</text>
          <Typed text="PHILADELPHIA WARRIORS vs" f={f} at={T.against} msPerChar={20} x={44} y={192} size={30} fill={HTM_INK} font={HTM_COURIER} seed={70} />
          <Typed text="NEW YORK KNICKS" f={f} at={T.newY - 2} msPerChar={22} x={44} y={244} size={30} fill={HTM_INK} font={HTM_COURIER} seed={110} />

          {/* the PHILA jersey lettering, arched block letters as on his chest in the 100 photo */}
          {f >= T.against + 14 && (
            <g opacity={prog(f, T.against + 14, 6, ease.linear)} transform={`translate(560 178) scale(${htmLerp(1.25, 1, prog(f, T.against + 14, 8, ease.out))})`}>
              <path id="htm-arch" d="M-62,8 Q0,-30 62,8" fill="none" />
              <text fontFamily={HTM_OSWALD} fontWeight={700} fontSize={34} letterSpacing={2} fill={HTM_INK} stroke={HTM_PAPER} strokeWidth={0.6}>
                <textPath href="#htm-arch" startOffset="50%" textAnchor="middle">PHILA</textPath>
              </text>
            </g>
          )}

          {/* DATE */}
          <line x1={44} x2={600} y1={344} y2={344} stroke={FAINT} strokeWidth={1.4} />
          <text x={44} y={360} fontFamily={HTM_OSWALD} fontWeight={500} fontSize={13} letterSpacing={3} fill={FAINT}>DATE</text>
          <Typed text="MARCH 2" f={f} at={T.march} msPerChar={40} x={44} y={334} size={46} fill={HTM_INK} font={HTM_COURIER} seed={10} />

          {/* the red ink the stamp leaves */}
          <g opacity={ink * 0.93} filter="url(#htm-ink)" transform="rotate(-3.5 345 312)">
            <rect x={268} y={272} width={156} height={68} rx={8} fill="none" stroke={HTM_RED} strokeWidth={3.4 + spread * 0.6} />
            <text x={346} y={326} textAnchor="middle" fontFamily={HTM_COURIER} fontWeight={700} fontSize={54} letterSpacing={2} fill={HTM_RED}>1962</text>
          </g>
        </g>

        {/* the steel date stamp: four rolling bands in a black frame, pressed on "1962" and lifted away */}
        {f >= rollStart - 4 && lift < 1 && (
          <g
            opacity={steelIn * (1 - lift)}
            transform={`translate(${346 + lift * 40} ${306 - lift * 120 - (1 - steelIn) * 40}) rotate(${-3.5 + lift * 8}) scale(${1.08 - press * 0.1})`}
            style={{ filter: `drop-shadow(0 ${(14 - press * 10).toFixed(1)}px ${(16 - press * 10).toFixed(1)}px rgba(0,0,0,0.55))` }}
          >
            <rect x={-92} y={-48} width={184} height={92} rx={10} fill="#141518" stroke="#5A5E66" strokeWidth={2} />
            <rect x={-86} y={-42} width={172} height={80} rx={7} fill="none" stroke="#2E3136" strokeWidth={2} />
            {[0, 1, 2, 3].map((i) => (
              <Band key={i} i={i} x={-57 + i * 38} y={14} from={[2, 0, 2, 6][i]} to={[1, 9, 6, 2][i]} p={htmClamp(roll * 1.15 - i * 0.05)} font={HTM_COURIER} />
            ))}
            {/* the handle above it, seen from the top */}
            <rect x={-26} y={-66} width={52} height={20} rx={6} fill="#3A2B20" />
          </g>
        )}

        {/* ---------- the stub ---------- */}
        <g transform={stubTf}>
          <g clipPath="url(#htm-stub)">
            <rect x={PERF + 12} y={14} width={W - PERF - 26} height={H - 28} rx={4} fill="none" stroke={HTM_RED} strokeWidth={2.4} />
            <text x={pin.x} y={98} textAnchor="middle" fontFamily={HTM_OSWALD} fontWeight={700} fontSize={46} letterSpacing={6} fill={HTM_INK}>ADMIT</text>
            <text x={pin.x} y={150} textAnchor="middle" fontFamily={HTM_OSWALD} fontWeight={700} fontSize={46} letterSpacing={6} fill={HTM_INK}>ONE</text>
            {/* the tall red double-outline H of the arena's programme, printed on "Hershey" */}
            <g opacity={hInk * 0.95} filter="url(#htm-ink)" transform={`translate(${pin.x} 268) scale(${htmLerp(1.2, 1, hInk)})`}>
              <path d="M-44,-80 H-22 V-18 H22 V-80 H44 V80 H22 V18 H-22 V80 H-44 Z" fill="none" stroke={HTM_RED} strokeWidth={3.2} strokeLinejoin="miter" />
              <path d="M-38,-74 H-28 V-12 H28 V-74 H38 V74 H28 V12 H-28 V74 H-38 Z" fill="none" stroke={HTM_RED} strokeWidth={1.4} strokeLinejoin="miter" />
            </g>
          </g>
        </g>
      </svg>

      {/* the Knicks mark, stamped on "Knicks" */}
      {kS > 0 && (
        <div style={{ position: "absolute", left: 556 - knickSize / 2, top: 262 - knickSize / 2, width: knickSize, height: knickSize, transform: `scale(${kS}) rotate(${htmLerp(-14, -5, kStamp)}deg)`, opacity: prog(f, T.knicks - 1, 3, ease.linear), filter: kLand ? "drop-shadow(0 1px 1px rgba(0,0,0,0.35))" : `drop-shadow(0 ${(18 * (1 - kStamp)).toFixed(1)}px ${(14 * (1 - kStamp)).toFixed(1)}px rgba(0,0,0,0.45))` }}>
          <Img src={staticFile("wilt-100/hershey-knicks-primary.svg")} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
    </div>
  );
};
