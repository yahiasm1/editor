// "In the second half alone, Kobe scored 55 points. The whole Raptors team scored 41. One guy, against five."
// MAN scale. The 9 x 9 board comes to centre and the 4th quarter fills it play by play (53 -> 81). Its 55
// second-half bulbs pour into a gold stack beside Kobe's cut-out, behind the STAPLES scorer's table. Five real
// Raptors bodies, traced from Jeramey Jannene's Jan 27 2006 photo, step in at their roster heights; every Raptors
// point of the second half lights red over the head of the man who scored it, then drains into one shorter red
// stack. On "five" they close into a wall; the 55 holds.
import React from "react";
import { Img, staticFile } from "remotion";
import { blurIn, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { StaplesNightBoard, StaplesNightDots } from "./StaplesNightBoard";
import { DeficitFlowChartCornerBoard } from "./DeficitFlowChart";
import {
  OneAgainstFiveBigBoard,
  OneAgainstFiveFive,
  OneAgainstFiveFloor,
  OneAgainstFiveGoldSpot,
  OneAgainstFiveK,
  OneAgainstFiveKobeX,
  OneAgainstFivePath,
  OneAgainstFiveQ4,
  OneAgainstFiveRedSpot,
  OneAgainstFiveSmallBoard,
  OneAgainstFiveSpread,
  OneAgainstFiveStack,
  OneAgainstFiveTableTop,
  OneAgainstFiveTor,
  OneAgainstFiveTorPlays,
  OneAgainstFiveWall,
} from "./OneAgainstFiveData";

const GOLD = "#FDB927";
const RED = "#CE1141";
const GREY = "#8B949E";
const KOBE = "kobe-81/oneagainstfive-kobe.png"; // 404 x 645, head top at 0, chin at ~120
const RAPTORS = "kobe-81/oneagainstfive-raptors.jpg"; // 960 x 720, Jan 27 2006
const ARENA = "kobe-81/commons-kobe-81-night-staples-2006-endlessbender-ccby2.jpg"; // 960 x 720

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const bell = (f: number, at: number, dur: number) => {
  const t = (f - at) / dur;
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t);
};
/** a fall that lands and settles: 0..1 with a small bounce at the end */
const land = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < 0.78) return Math.pow(t / 0.78, 2);
  const u = (t - 0.78) / 0.22;
  return 1 - Math.sin(Math.PI * u) * 0.06;
};

/** one bulb: a glass globe with a hot core and a halo, or a dark socket when lit = 0 */
const OneAgainstFiveBulb: React.FC<{ x: number; y: number; r: number; color: string; lit: number; glow?: number; alpha?: number; socket?: boolean }> = ({ x, y, r, color, lit, glow = 1, alpha = 1, socket = true }) => {
  if (alpha <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, opacity: alpha }}>
      {lit > 0.02 && (
        <div style={{ position: "absolute", left: -r * 1.5, top: -r * 1.5, width: r * 5, height: r * 5, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 62%)`, opacity: 0.4 * lit * glow }} />
      )}
      {socket && <div style={{ position: "absolute", inset: -Math.max(1.5, r * 0.13), borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #2a3038 0%, #12161c 70%)", border: "1.5px solid #3b424c" }} />}
      <div
        style={{
          position: "absolute",
          inset: socket ? 1 : 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 46% 40%, #FFFDF4 0%, ${color} ${Math.round(38 + 20 * (1 - lit))}%, ${color} 70%, rgba(0,0,0,0.35) 100%)`,
          opacity: lit,
          boxShadow: lit > 0.02 ? `0 0 ${(r * 0.6 * glow * lit).toFixed(1)}px ${color}` : undefined,
        }}
      />
      <div style={{ position: "absolute", left: r * 0.45, top: r * 0.3, width: r * 0.55, height: r * 0.32, borderRadius: "50%", background: "rgba(255,255,255,0.55)", opacity: 0.2 + 0.5 * lit, transform: "rotate(-28deg)" }} />
    </div>
  );
};

export const OneAgainstFive: React.FC = () => {
  const { f, scene, cue, endsOn, theme } = useScene();
  const mount = scene.from - LEAD;

  const tIn = cue("In");
  const tAlone = cue("alone");
  const tKobe = cue("Kobe");
  const t55 = cue("55");
  const tWhole = cue("whole");
  const tRaptors = cue("Raptors");
  const t41 = cue("41");
  const tOne = cue("One");

  const k = OneAgainstFiveK;
  const floor = OneAgainstFiveFloor;
  const tableTop = OneAgainstFiveTableTop;

  // ---------------------------------------------------------------- the board: corner -> centre -> small, top left
  const C = DeficitFlowChartCornerBoard;
  const Bb = OneAgainstFiveBigBoard;
  const Bs = OneAgainstFiveSmallBoard;
  const toBig = prog(f, scene.from - 4, 18, ease.inOut);
  const toSmall = prog(f, tAlone + 6, 20, ease.inOut);
  const boardAt = (i: number) => {
    const col = i % 9;
    const row = Math.floor(i / 9);
    const xb = lerp(C.x0 + col * C.pitch, Bb.x0 + col * Bb.pitch, toBig);
    const yb = lerp(C.y0 + row * C.pitch, Bb.y0 + row * Bb.pitch, toBig) - Math.sin(Math.PI * toBig) * 40;
    const rb = lerp(C.r, Bb.r, toBig);
    return {
      x: lerp(xb, Bs.x0 + col * Bs.pitch, toSmall),
      y: lerp(yb, Bs.y0 + row * Bs.pitch, toSmall) - Math.sin(Math.PI * toSmall) * 24,
      r: lerp(rb, Bs.r, toSmall),
    };
  };
  // the 4th quarter, play by play, from "In" to just before "alone"
  const q4 = OneAgainstFiveQ4;
  const q4Start = tIn + 2;
  const q4End = tAlone - 5;
  const playAt = (p: number) => Math.round(q4Start + (p * (q4End - q4Start)) / (q4.length - 1));
  const litAt = (i: number) => {
    if (i < 53) return -9999;
    const p = q4.findIndex((e) => i >= e.first && i < e.first + e.pts);
    return playAt(p);
  };
  const board4th = q4.filter((_, p) => f >= playAt(p)).reduce((s, e) => s + e.pts, 0);
  const lastPlay = Math.max(...q4.map((_, p) => (f >= playAt(p) ? p : -1)));
  const counterFlash = lastPlay >= 0 ? bell(f, playAt(lastPlay), 10) : 0;
  const breathe = 0.88 + 0.12 * Math.sin(f * 0.11);

  // the 55 leave the board for the stack: they depart bottom-first, the last lands just before "55"
  const pourStart = tAlone + 2;
  const flight = 18;
  const pourLast = t55 - flight - 2;
  const departAt = (j: number) => pourStart + (j * (pourLast - pourStart)) / 54;
  const landed = Array.from({ length: 55 }, (_, j) => j).filter((j) => f >= departAt(j) + flight).length;
  const squash = bell(f, t55 - 1, 14);

  // ---------------------------------------------------------------- the table and Kobe
  const tableIn = prog(f, tAlone - 2, 16, ease.out);
  const kobeRise = prog(f, endsOn("Kobe", 16), 16, ease.out);
  const kobeH = 6.5 * k;
  const kobeTop = floor - kobeH + (1 - kobeRise) * 260;
  const kobeScale = (0.78 * k) / 120; // head 0.78 ft, 120 px in the image
  const kobeW = 404 * kobeScale;
  const kobeHimg = 645 * kobeScale;

  // ---------------------------------------------------------------- the five
  const five = OneAgainstFiveFive;
  const wallK = prog(f, endsOn("five", 14), 14, ease.inOut);
  const stepAt = (i: number) => tWhole - 8 + i * 5;
  const cx = (i: number) => lerp(OneAgainstFiveSpread[i], OneAgainstFiveWall[i], wallK) + (1 - prog(f, stepAt(i), 16, ease.out)) * (180 + i * 30);
  // the ribbon names stay at the spread positions: closed into the wall, BOSH and PETERSON would touch
  const cxLabel = (i: number) => OneAgainstFiveSpread[i] + (1 - prog(f, stepAt(i), 16, ease.out)) * (180 + i * 30);
  const headY = (i: number) => floor - five[i].ft * k;

  // red points: lit over the scorer's head in play-by-play order, then drained into one stack landing on "41"
  const tor = OneAgainstFiveTor;
  const redStart = tRaptors + 2;
  const drainFlight = 16;
  const drainEnd = t41 - drainFlight; // the last one departs here and lands on "41"
  const drainStart = drainEnd - 10;
  const redEnd = drainStart - 4;
  const redPlayAt = (p: number) => Math.round(redStart + (p * (redEnd - redStart)) / (OneAgainstFiveTorPlays - 1));
  const perWho: number[] = [0, 0, 0, 0, 0, 0];
  const redHome = tor.map((pt) => {
    const n = perWho[pt.who]++;
    if (pt.who === 5) {
      // the bench heap on the table top, right end
      const hx = [0, 1, 0.5, 2][n] ?? n;
      const hy = [0, 0, 1, 0][n] ?? 0;
      return { x: 548 + hx * 19, y: tableTop - 11 - hy * 16, r: 9, bench: true };
    }
    const cols = 3;
    return { x: (cx(pt.who) - 23) + (n % cols) * 23, y: headY(pt.who) - 32 - Math.floor(n / cols) * 23, r: 9, bench: false, who: pt.who, col: n % cols, row: Math.floor(n / cols) };
  });
  const redLanded = tor.filter((_, j) => f >= drainStart + (j * (drainEnd - drainStart)) / (tor.length - 1) + drainFlight).length;

  // ---------------------------------------------------------------- light
  const oneK = prog(f, tOne - 2, 10, ease.out);
  const raptorShade = 1 - 0.3 * oneK;
  const sweep = lerp(-0.2, 1.2, prog(f, mount, scene.to - mount, ease.linear));

  const R = (n: number) => n.toFixed(2);

  return (
    <>
      {/* ---------- the arena behind, the night photo dark and soft */}
      <div style={{ ...blurIn(f, mount, { dur: 14 }), position: "absolute", left: 0, top: 700, width: 1080, height: 760, overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 22%, #000 70%, transparent 100%)" }}>
        <Img src={staticFile(ARENA)} style={{ position: "absolute", left: -260 + sweep * 30, top: -170, width: 1600, height: 1200, maxWidth: "none", filter: "blur(5px) brightness(0.32) saturate(0.8)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(253,185,39,${R(0.06 + 0.07 * oneK)}) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0) 55%, rgba(206,17,65,${R(0.05 + 0.06 * prog(f, tWhole, 20, ease.out))}) 100%)` }} />
      </div>

      {/* ---------- the scoreboard, as takeover left it */}
      <div style={{ position: "absolute", inset: 0 }}>
        <StaplesNightBoard st={{ power: 1, tor: 85, lal: 91, period: "END 3RD", clock: "0.0", logoTor: 1, logoLal: 1, flashLal: 0.15 * Math.sin(f * 0.08) + 0.15 }} />
      </div>

      {/* ---------- "One": a warm light falls on Kobe's side */}
      {oneK > 0.01 && (
        <div style={{ position: "absolute", left: 40, top: 700, width: 520, height: 560, opacity: oneK, background: "radial-gradient(ellipse 46% 64% at 44% 50%, rgba(255,214,140,0.30) 0%, rgba(255,214,140,0.08) 55%, rgba(0,0,0,0) 100%)", mixBlendMode: "screen" }} />
      )}

      {/* ---------- Kobe, behind the table */}
      <div style={{ position: "absolute", left: OneAgainstFiveKobeX - kobeW / 2, top: kobeTop, width: kobeW, height: kobeHimg, opacity: prog(f, endsOn("Kobe", 16), 8, ease.linear) }}>
        <Img src={staticFile(KOBE)} style={{ width: kobeW, height: kobeHimg, filter: `brightness(${R(0.92 + 0.12 * oneK)}) drop-shadow(0 0 ${R(6 + 10 * oneK + 14 * squash)}px rgba(253,185,39,${R(0.25 + 0.3 * oneK + 0.3 * squash)}))` }} />
      </div>

      {/* ---------- the Raptors logo and the credit for the traced bodies */}
      <div style={{ ...blurIn(f, tRaptors - 2, { dur: 8, scaleFrom: 0.8 }), position: "absolute", left: 870, top: 716, width: 92, height: 92, opacity: (prog(f, tRaptors - 2, 7, ease.out)) * raptorShade }}>
        <Img src={staticFile("kobe-81/nba-raptors-primary.svg")} style={{ width: 92, height: 92, objectFit: "contain", transform: `scale(${R(1 + 0.18 * bell(f, t41, 16))})` }} />
      </div>

      {/* ---------- the five, traced, at their heights */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <filter id="oneagainstfive-rim" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <linearGradient id="oneagainstfive-fall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(0,0,0,0)" />
            <stop offset="0.55" stopColor="rgba(5,7,10,0.15)" />
            <stop offset="1" stopColor="rgba(5,7,10,0.6)" />
          </linearGradient>
          <linearGradient id="oneagainstfive-jersey" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a0c1c" />
            <stop offset="0.5" stopColor="#300712" />
            <stop offset="1" stopColor="#1a040a" />
          </linearGradient>
          <linearGradient id="oneagainstfive-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#141922" />
            <stop offset="0.6" stopColor="#0B0F15" />
            <stop offset="1" stopColor="#07090D" />
          </linearGradient>
          <clipPath id="oneagainstfive-above-table">
            <rect x={0} y={0} width={1080} height={tableTop + 4} />
          </clipPath>
        </defs>
        <g clipPath="url(#oneagainstfive-above-table)">
        {five.map((p, i) => {
          const b = p.body;
          const s = (p.ft * k) / (b.feet - b.top);
          const step = prog(f, stepAt(i), 16, ease.out);
          if (step <= 0) return null;
          const bob = Math.sin(Math.PI * clamp((f - stepAt(i)) / 16, 0, 1)) * -10 + Math.sin(f * 0.05 + i) * 1.2;
          const tx = cx(i);
          const ty = floor + bob;
          const mx = p.mirror ? -1 : 1;
          const sw = 1 + 0.04 * wallK;
          const tf = `translate(${R(tx)} ${R(ty)}) scale(${R(s * mx * sw)} ${R(s * sw)}) translate(${-b.cx} ${-b.feet})`;
          const d = OneAgainstFivePath(b.poly);
          const clipId = `oneagainstfive-clip${i}`;
          const scoredFlash = Math.max(0, ...tor.filter((pt) => pt.who === i).map((pt) => bell(f, redPlayAt(pt.play), 12)));
          const glowUp = 1 + 0.6 * wallK + 0.9 * scoredFlash;
          return (
            <g key={i} opacity={step} style={{ filter: step < 1 ? `blur(${R((1 - step) * 8)}px)` : raptorShade < 0.99 ? `brightness(${R(raptorShade)})` : undefined }}>
              <clipPath id={clipId}>
                <path d={d} transform={tf} />
              </clipPath>
              <path d={d} transform={tf} fill="url(#oneagainstfive-body)" stroke="#1d2430" strokeWidth={1 / s} />
              {b.photo ? (
                <g clipPath={`url(#${clipId})`}>
                  <image href={staticFile(RAPTORS)} x={0} y={0} width={960} height={720} transform={tf} preserveAspectRatio="none" style={{ filter: `brightness(${R(0.78 - 0.18 * oneK)}) contrast(1.08) saturate(0.95)` }} />
                  {/* the overhead light falls away down the body */}
                  <path d={d} transform={tf} fill="url(#oneagainstfive-fall)" />
                </g>
              ) : (
                b.jersey && <path d={OneAgainstFivePath(b.jersey)} transform={tf} fill="url(#oneagainstfive-jersey)" />
              )}
              {/* the red rim light, from behind on the right */}
              <g clipPath={`url(#${clipId})`}>
                <path d={d} transform={`translate(${-7 * mx} 2) ${tf}`} fill="none" stroke={RED} strokeWidth={9 / s} opacity={0.85 * glowUp} filter="url(#oneagainstfive-rim)" />
                <path d={d} transform={`translate(${-3 * mx} 0) ${tf}`} fill="none" stroke="#FF5A6E" strokeWidth={2.5 / s} opacity={0.55 * glowUp} />
                {/* top light on the head and shoulders */}
                <path d={d} transform={`translate(0 6) ${tf}`} fill="none" stroke="#3a4558" strokeWidth={5 / s} opacity={0.5} filter="url(#oneagainstfive-rim)" />
              </g>
              {/* his number on the chest of the plain shapes, in the jersey's white */}
              {!b.photo && (
                <text x={tx + (b.chest[0] - b.cx) * s * mx} y={ty + (b.chest[1] - b.feet) * s - 26} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={15} letterSpacing={1} fill="rgba(240,236,230,0.55)">
                  RAPTORS
                </text>
              )}
              {!b.photo && <text
                x={tx + (b.chest[0] - b.cx) * s * mx}
                y={ty + (b.chest[1] - b.feet) * s + 14}
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                fontWeight={800}
                fontSize={40}
                fill="rgba(240,236,230,0.78)"
                stroke="#000"
                strokeWidth={1.2}
                opacity={0.9}
              >
                {p.num}
              </text>}
            </g>
          );
        })}
        </g>
      </svg>

      {/* ---------- the scorer's table: the purple front, its LED ribbon, the top the stacks stand on */}
      <div style={{ position: "absolute", left: 0, top: tableTop + (1 - tableIn) * 260, width: 1080, height: 300, opacity: tableIn }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: -6, height: 12, borderRadius: 4, background: "linear-gradient(180deg, #3c3346 0%, #241c2c 60%, #120e16 100%)", boxShadow: "0 -1px 0 rgba(255,255,255,0.12)" }} />
        <div style={{ position: "absolute", left: 60, right: 60, top: 6, height: 200, background: "linear-gradient(180deg, #2b1745 0%, #1d0f30 55%, #12091d 100%)", borderBottomLeftRadius: 10, borderBottomRightRadius: 10, boxShadow: "inset 0 2px 0 rgba(255,255,255,0.06), 0 20px 50px rgba(0,0,0,0.6)" }}>
          {/* padded seams of the table skirt */}
          {Array.from({ length: 7 }, (_, n) => (
            <div key={n} style={{ position: "absolute", left: 40 + n * 140, top: 0, bottom: 0, width: 1.5, background: "rgba(0,0,0,0.35)", boxShadow: "1px 0 0 rgba(255,255,255,0.04)" }} />
          ))}
          {/* the LED ribbon */}
          <div style={{ position: "absolute", left: 14, right: 14, top: 14, height: 90, borderRadius: 6, background: "#050506", border: "1.5px solid #2c2f35", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent ${R((sweep - 0.1) * 100)}%, rgba(255,255,255,0.05) ${R(sweep * 100)}%, transparent ${R((sweep + 0.1) * 100)}%)` }} />
          </div>
          <div style={{ position: "absolute", left: 30, bottom: 14, fontFamily: theme.font.ui, fontSize: 26, color: GREY, opacity: prog(f, tKobe, 10, ease.out) }}>Basketball-Reference play-by-play</div>
          <div style={{ position: "absolute", right: 24, bottom: 10, textAlign: "right", fontFamily: theme.font.ui, fontSize: 19, lineHeight: 1.22, color: "#7D8590" }}>
            <div style={{ opacity: prog(f, tKobe, 10, ease.out) }}>Kobe: Sgt. Joseph A. Lee, USMC, public domain</div>
            <div style={{ opacity: prog(f, tRaptors + 4, 10, ease.out) }}>Raptors: Jeramey Jannene, CC BY 2.0</div>
            <div style={{ opacity: prog(f, tKobe, 10, ease.out) }}>Arena: endlessbender, CC BY 2.0</div>
          </div>
        </div>
      </div>

      {/* LED labels on the ribbon (drawn in stage coordinates so they track the people above them) */}
      {(() => {
        const ribTop = tableTop + 6 + 14 + (1 - tableIn) * 260;
        const labels: { text: string; x: number; row: number; at: number; color: string; alpha: number }[] = [
          { text: "BRYANT", x: OneAgainstFiveKobeX, row: 0, at: tKobe, color: "#FFF4DC", alpha: 1 },
          { text: "8", x: OneAgainstFiveKobeX, row: 1, at: tKobe + 3, color: "#FFF4DC", alpha: 1 },
          ...five.map((p, i) => ({ text: p.name, x: cxLabel(i), row: 1 - (i % 2), at: stepAt(i) + 6, color: "#FFFFFF", alpha: raptorShade })),
          { text: "BENCH", x: 540, row: 0, at: redPlayAt(12), color: "#FFFFFF", alpha: raptorShade * 0.8 * (1 - prog(f, t41, 10, ease.out)) },
        ];
        return labels.map((l, n) => {
          const a = prog(f, l.at, 6, ease.out) * l.alpha * tableIn;
          if (a <= 0.01) return null;
          const size = 30;
          const w = l.text.length * size * 0.72 + 6;
          // a label never runs off the ribbon
          const x = clamp(l.x - w / 2, 84, 1000 - w);
          return (
            <div key={n} style={{ position: "absolute", left: x, top: ribTop + 8 + l.row * 42, width: w, height: 36, opacity: a }}>
              <StaplesNightDots text={l.text} size={size} w={w} color={l.color} dim="rgba(255,255,255,0.0)" glow={0.8} />
            </div>
          );
        });
      })()}

      {/* ---------- the board's sockets and bulbs */}
      {Array.from({ length: 81 }, (_, i) => {
        const p = boardAt(i);
        const first = i < 26;
        const pre = i < 53; // lit before this scene
        const at = litAt(i);
        const lit = pre ? 1 : prog(f, at, 4, ease.out);
        const flash = pre ? 0 : bell(f, at, 12);
        // the 55 second-half bulbs leave from here
        if (!first) {
          const j = i - 26;
          if (f >= departAt(j)) return <OneAgainstFiveBulb key={`s${i}`} x={p.x} y={p.y} r={p.r} color={GOLD} lit={0} alpha={1} />;
          const lift = prog(f, tAlone - 2, 8, ease.out);
          return <OneAgainstFiveBulb key={`s${i}`} x={p.x} y={p.y - lift * 6} r={p.r * (1 + 0.3 * flash)} color={GOLD} lit={lit} glow={(breathe + 1.4 * flash) * (1 + 0.4 * lift)} />;
        }
        const dimK = prog(f, tAlone, 10, ease.out);
        return <OneAgainstFiveBulb key={`s${i}`} x={p.x} y={p.y} r={p.r} color={GOLD} lit={1 - 0.55 * dimK} glow={breathe * (1 - 0.5 * dimK)} />;
      })}

      {/* the 55 in flight and in the stack */}
      {Array.from({ length: 55 }, (_, j) => {
        const d = departAt(j);
        if (f < d) return null;
        const from = boardAt(26 + j);
        const to = OneAgainstFiveGoldSpot(j);
        const t = clamp((f - d) / flight, 0, 1);
        const y0 = from.y - 6;
        const lt = land(t);
        const x = lerp(from.x, to.x, ease.inOut(t));
        const y = lerp(y0, to.y, lt) - Math.sin(Math.PI * Math.min(1, t * 1.3)) * 50;
        const row = Math.floor(j / 4);
        const sq = squash * (2 + row * 0.9);
        const hit = bell(f, d + flight, 8);
        return <OneAgainstFiveBulb key={`g${j}`} x={x} y={y + sq} r={lerp(from.r, OneAgainstFiveStack.r, t)} color={GOLD} lit={1} glow={breathe * (1 + 1.2 * hit + 0.9 * squash) * (1 + 0.25 * oneK)} socket={false} />;
      })}

      {/* the red: over each scorer's head, then drained into one stack */}
      {tor.map((pt, j) => {
        const home = redHome[j];
        const at = redPlayAt(pt.play);
        if (f < at) return null;
        const pop = prog(f, at, 8, ease.back);
        const d = drainStart + (j * (drainEnd - drainStart)) / (tor.length - 1);
        const to = OneAgainstFiveRedSpot(j);
        const t = clamp((f - d) / drainFlight, 0, 1);
        const x = lerp(home.x, to.x, ease.inOut(t));
        const y = lerp(home.y, to.y, land(t)) - Math.sin(Math.PI * Math.min(1, t * 1.25)) * 70;
        const r = lerp(home.r * (0.5 + 0.5 * pop), OneAgainstFiveStack.r, t);
        const hit = bell(f, d + drainFlight, 8);
        return <OneAgainstFiveBulb key={`r${j}`} x={x} y={y} r={r} color={RED} lit={1} glow={(1 + 1.4 * bell(f, at, 10) + hit) * raptorShade} alpha={0.4 + 0.6 * pop} socket={false} />;
      })}

      {/* ---------- the counters */}
      {/* the board's live count during the 4th quarter */}
      <div style={{ position: "absolute", left: 54, top: 712, width: 210, opacity: prog(f, scene.from, 8, ease.out) * (1 - prog(f, tAlone + 2, 8, ease.in)), fontFamily: theme.font.ui }}>
        <div style={{ fontSize: 96, fontWeight: 800, color: "#FFFFFF", lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: `0 0 ${R(24 * counterFlash)}px rgba(253,185,39,0.9)` }}>{53 + board4th}</div>
        <div style={{ fontSize: 32, color: "#C9D1D9", marginTop: 6 }}>Kobe&apos;s points</div>
        <div style={{ fontSize: 32, color: GREY, marginTop: 4 }}>4th quarter</div>
      </div>
      {/* gold: second half */}
      {(() => {
        const n = landed;
        const a = n > 0 ? 1 : 0;
        const topY = OneAgainstFiveGoldSpot(Math.max(0, n - 1)).y - 30;
        return (
          <div style={{ position: "absolute", left: OneAgainstFiveStack.goldX - 30, top: Math.min(topY, 1100) - 96, width: 160, textAlign: "center", opacity: a, fontFamily: theme.font.ui }}>
            <div style={{ fontSize: 80 + 8 * squash, fontWeight: 800, color: "#FFFFFF", lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: `0 0 ${R(10 + 26 * squash + 10 * oneK)}px rgba(253,185,39,0.85)` }}>{n}</div>
          </div>
        );
      })()}
      {(() => {
        const a = (redLanded > 0 ? 1 : 0) * raptorShade;
        const n = redLanded;
        const topY = OneAgainstFiveRedSpot(Math.max(0, n - 1)).y - 30;
        const lock = bell(f, t41, 16);
        return (
          <div style={{ position: "absolute", left: OneAgainstFiveStack.redX - 30, top: topY - 96 + 16, width: 160, textAlign: "center", opacity: a, fontFamily: theme.font.ui }}>
            <div style={{ fontSize: 80 + 8 * lock, fontWeight: 800, color: "#FFFFFF", lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: `0 0 ${R(8 + 24 * lock)}px rgba(206,17,65,0.9)` }}>{n}</div>
          </div>
        );
      })()}
    </>
  );
};
