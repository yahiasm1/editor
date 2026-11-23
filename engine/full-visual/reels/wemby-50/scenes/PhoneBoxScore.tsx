// `boxscore`: "Imagine you open the box score. You see fifty next to his name and you think he just shot all night.
// But points only tell you what he got, not what it cost."
// NBA.com's game page, Box Score tab, dark mode, on an iPhone, redrawn from NBA.com's own stylesheet (values in
// notes/PhoneBoxScore.md) at 2.24 px per CSS px. The PLAYER column is pinned, the rest scrolls sideways. On "50" a real
// fling carries the table to PTS and the 50 grows out of it; on "name" his pinned name lights and the Commons photo
// card comes out of the row; on "tell" his row lifts out, the others fall, and the row closes up to FGA 29, FTA 6 and
// PTS 50; "got" lights the 50, "cost" turns the 29 and the 6 gold.
import React from "react";
import { Img, staticFile } from "remotion";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
import { loadFont as loadRobotoCond } from "@remotion/google-fonts/RobotoCondensed";
import { arriveEase, blurIn, countTo, ease, mix, prog, useScene } from "../../../src/engine";
import { PhoneBoxScoreCols as COLS, PhoneBoxScoreRows as ROWS } from "./PhoneBoxScoreData";

const ROBOTO = loadRoboto("normal", { weights: ["400", "500", "700", "900"], subsets: ["latin"] }).fontFamily;
const COND = loadRobotoCond("normal", { weights: ["400", "700", "900"], subsets: ["latin"] }).fontFamily;

// NBA.com dark mode tokens (from its CSS)
const N = {
  page: "#000000",
  surface: "#191C23",
  text: "#F3F3F3",
  muted: "#A4A2A2",
  rule: "#1A2E3D",
  gold: "#F2B33D",
  label: "#8B949E",
  hair: "#30363D",
};

// geometry, absolute stage px. 1 CSS px = 2.24 px (a 393 pt iPhone screen drawn 880 px wide)
const SX = 100;
const SW = 880;
const TOP = 556; // screen top
const Y = { nav: 661, strip: 751, tabs: 861, team: 951, thead: 1031, rows: 1111 };
const RH = 82;
const NAMEW = 290;
const WEMBY = 2;
const PTS = COLS.indexOf("PTS");
const FGA = COLS.indexOf("FGA");
const FTA = COLS.indexOf("FTA");
const KEY = [FGA, FTA, PTS];
const colW = (j: number) => (j === 0 ? 116 : 103);
const colX = (j: number) => {
  let x = 0;
  for (let i = 0; i < j; i++) x += colW(i);
  return x;
};
const CONTENT = NAMEW + colX(COLS.length) + 22;
const MAXS = CONTENT - SW;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const asset = (n: string) => staticFile(`wemby-50/${n}`);

// the final lifted row
const LR = { top: 1078, h: 214, name: 330, key: 182 };

/** a real iOS fling: exponential decay that runs past the end, then the rubber band pulls it back */
function phoneBoxScoreScroll(f: number, start: number) {
  if (f < start) return 0;
  const t = f - start;
  const A = 26;
  const over = 46;
  if (t <= A) return (MAXS + over) * (1 - Math.exp(-t / 7)) / (1 - Math.exp(-A / 7));
  return MAXS + over * (1 - prog(f, start + A, 16, ease.inOut));
}

const PhoneBoxScoreStatus: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: Y.nav - TOP, background: N.page }}>
    <div style={{ position: "absolute", left: 96, top: 40, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 38, color: "#fff", letterSpacing: -0.5 }}>10:21</div>
    <div style={{ position: "absolute", left: SW / 2 - 141, top: 24, width: 282, height: 82, borderRadius: 41, background: "#000", boxShadow: "inset 0 0 0 1px #111" }}>
      <div style={{ position: "absolute", right: 30, top: 27, width: 28, height: 28, borderRadius: 14, background: "radial-gradient(circle at 40% 40%, #2a3350, #07080c 60%)" }} />
    </div>
    <svg style={{ position: "absolute", right: 70, top: 44 }} width={190} height={34} viewBox="0 0 190 34">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 13} y={26 - i * 7} width={9} height={8 + i * 7} rx={2} fill="#fff" />
      ))}
      <path d="M78 12 a24 24 0 0 1 34 0 l-4 4 a18 18 0 0 0 -26 0 z M84 18 a15 15 0 0 1 22 0 l-4 4 a9 9 0 0 0 -14 0 z M91 25 a6 6 0 0 1 8 0 l-4 5 z" fill="#fff" />
      <rect x={128} y={6} width={48} height={24} rx={7} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={2.4} />
      <rect x={132} y={10} width={33} height={16} rx={4} fill="#fff" />
      <rect x={179} y={13} width={4} height={10} rx={2} fill="rgba(255,255,255,0.45)" />
    </svg>
  </div>
);

const PhoneBoxScoreChrome: React.FC<{ tabU: number }> = ({ tabU }) => {
  const tabs = [
    { t: "Summary", x: 30, w: 150 },
    { t: "Box Score", x: 206, w: 170 },
    { t: "Game Charts", x: 402, w: 212 },
    { t: "Play-By-Play", x: 640, w: 210 },
  ];
  const ux = lerp(tabs[0].x, tabs[1].x, tabU);
  const uw = lerp(tabs[0].w, tabs[1].w, tabU);
  return (
    <>
      {/* NBA.com bar */}
      <div style={{ position: "absolute", left: 0, top: Y.nav - TOP, width: SW, height: Y.strip - Y.nav, background: "#000", borderBottom: "2px solid #1d1f24" }}>
        <svg style={{ position: "absolute", left: 40, top: 30 }} width={44} height={32} viewBox="0 0 44 32">
          {[0, 1, 2].map((i) => (
            <rect key={i} y={i * 13} width={44} height={5} rx={2} fill="#fff" />
          ))}
        </svg>
        <Img src={asset("phoneboxscore-logoman.svg")} style={{ position: "absolute", left: SW / 2 - 51, top: 16, height: 58 }} />
        <svg style={{ position: "absolute", right: 46, top: 25 }} width={40} height={40} viewBox="0 0 40 40">
          <circle cx={16} cy={16} r={12} fill="none" stroke="#fff" strokeWidth={4} />
          <path d="M25 25 L37 37" stroke="#fff" strokeWidth={4.5} strokeLinecap="round" />
        </svg>
      </div>
      {/* game strip: away left, home right */}
      <div style={{ position: "absolute", left: 0, top: Y.strip - TOP, width: SW, height: Y.tabs - Y.strip, background: N.surface, fontFamily: ROBOTO }}>
        <Img src={asset("phoneboxscore-pelicans.svg")} style={{ position: "absolute", left: 44, top: 14, width: 82, height: 82 }} />
        <div style={{ position: "absolute", left: 140, top: 20, fontSize: 27, color: N.muted, fontFamily: COND, letterSpacing: 1 }}>NOP</div>
        <div style={{ position: "absolute", left: 140, top: 46, fontSize: 52, fontWeight: 700, color: N.muted }}>91</div>
        <div style={{ position: "absolute", left: 0, width: SW, top: 30, textAlign: "center", fontSize: 29, fontWeight: 700, color: N.text, letterSpacing: 1 }}>FINAL</div>
        <div style={{ position: "absolute", left: 0, width: SW, top: 66, textAlign: "center", fontSize: 24, color: N.muted }}>Sat, Nov 21</div>
        <div style={{ position: "absolute", right: 140, top: 20, fontSize: 27, color: N.muted, fontFamily: COND, letterSpacing: 1, textAlign: "right" }}>SAS</div>
        <div style={{ position: "absolute", right: 140, top: 46, fontSize: 52, fontWeight: 700, color: N.text, textAlign: "right" }}>114</div>
        <Img src={asset("phoneboxscore-spurs.svg")} style={{ position: "absolute", right: 44, top: 14, width: 82, height: 82 }} />
      </div>
      {/* inner nav tabs */}
      <div style={{ position: "absolute", left: 0, top: Y.tabs - TOP, width: SW, height: Y.team - Y.tabs, background: N.surface, borderTop: `2px solid ${N.rule}`, borderBottom: `2px solid ${N.rule}`, fontFamily: ROBOTO }}>
        {tabs.map((t, i) => (
          <div key={t.t} style={{ position: "absolute", left: t.x, width: t.w, top: 26, textAlign: "center", fontSize: 31, color: N.text, fontWeight: (i === 0 ? 1 - tabU : i === 1 ? tabU : 0) > 0.5 ? 700 : 400 }}>{t.t}</div>
        ))}
        <div style={{ position: "absolute", left: ux, width: uw, bottom: 0, height: 9, background: N.text }} />
      </div>
      {/* team header */}
      <div style={{ position: "absolute", left: 0, top: Y.team - TOP, width: SW, height: Y.thead - Y.team, background: N.surface }}>
        <Img src={asset("phoneboxscore-spurs.svg")} style={{ position: "absolute", left: 26, top: 12, width: 56, height: 56 }} />
        <div style={{ position: "absolute", left: 96, top: 18, fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 40, color: N.text, transform: "scaleX(1.16)", transformOrigin: "left center", letterSpacing: 0.5 }}>SAN ANTONIO SPURS</div>
      </div>
    </>
  );
};

/** one table line (header or player row), the stat part scrolled, the PLAYER cell pinned over it */
const PhoneBoxScoreLine: React.FC<{
  y: number;
  h: number;
  scroll: number;
  head?: boolean;
  row?: (typeof ROWS)[number];
  idx?: number;
  writeAt: number;
  ptsOverride?: string;
  ptsFade?: number;
  bg?: string;
  nameLit?: number;
}> = ({ y, h, scroll, head, row, writeAt, ptsOverride, ptsFade = 1, bg = N.surface, nameLit = 0 }) => {
  const { f } = useScene();
  if (f < writeAt - 1) {
    if (head) return null;
    // NBA.com's loading skeleton, shimmering until the row's data writes in
    const sh = ((f * 14) % 1600) - 400;
    const bar = (x: number, w: number): React.ReactNode => (
      <div key={x} style={{ position: "absolute", left: x, top: h / 2 - 11, width: w, height: 22, borderRadius: 6, background: `linear-gradient(90deg, #252932 0px, #252932 ${sh - 300}px, #343945 ${sh}px, #252932 ${sh + 300}px, #252932 ${SW}px)`, backgroundSize: `${SW}px 100%`, backgroundPosition: `${-x}px 0px` }} />
    );
    return (
      <div style={{ position: "absolute", left: 0, top: y, width: SW, height: h, background: N.surface, borderTop: `2px solid ${N.rule}` }}>
        {bar(27, 190)}
        {[0, 1, 2, 3, 4, 5].map((j) => bar(NAMEW + colX(j) + colW(j) - 13 - (j === 0 ? 70 : 46), j === 0 ? 70 : 46))}
      </div>
    );
  }
  const fs = head ? 27 : 31;
  const base: React.CSSProperties = {
    position: "absolute",
    top: 0,
    height: h,
    display: "flex",
    alignItems: head ? "flex-end" : "center",
    justifyContent: "flex-end",
    paddingRight: 13,
    paddingBottom: head ? 22 : 0,
    boxSizing: "border-box",
    fontFamily: head ? COND : ROBOTO,
    fontSize: fs,
    color: head ? N.muted : N.text,
    letterSpacing: head ? 2.2 : 0,
    whiteSpace: "nowrap",
  };
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: SW, height: h, background: bg, borderTop: head ? undefined : `2px solid ${N.rule}`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: NAMEW - scroll, top: 0, height: h }}>
        {COLS.map((c, j) => {
          const x = colX(j);
          if (x - scroll + colW(j) < 0 || x - scroll > SW) return null;
          let v = head ? c : row!.cells[j];
          if (!head && j === PTS && ptsOverride !== undefined) v = ptsOverride;
          return (
            <div key={c} style={{ ...base, left: x, width: colW(j), fontWeight: !head && j === 0 ? 700 : 400, ...blurIn(f, writeAt + Math.min(j, 6), { dur: 6, blur: 8 }), ...(!head && j === PTS && ptsFade < 1 ? { opacity: ptsFade } : {}) }}>
              {v}
            </div>
          );
        })}
      </div>
      {/* pinned PLAYER cell */}
      <div style={{ position: "absolute", left: 0, top: 0, width: NAMEW, height: h, background: bg, boxShadow: "8px 0 8px -5px rgba(0,0,0,0.55)", display: "flex", alignItems: head ? "flex-end" : "center", paddingLeft: 27, paddingBottom: head ? 22 : 0, boxSizing: "border-box", ...blurIn(f, writeAt, { dur: 6, blur: 8 }) }}>
        {head ? (
          <span style={{ fontFamily: COND, fontSize: fs, color: N.muted, letterSpacing: 2.2 }}>PLAYER</span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", fontFamily: COND, fontSize: 31, color: nameLit > 0 ? "#FFFFFF" : N.text, fontWeight: nameLit > 0.5 ? 700 : 400, textShadow: nameLit > 0 ? `0 0 ${14 * nameLit}px rgba(255,255,255,${0.45 * nameLit})` : undefined }}>
            {row!.name}
            {row!.pos && <span style={{ marginLeft: 9, fontSize: 22, fontWeight: 900, color: N.text }}>{row!.pos}</span>}
          </span>
        )}
      </div>
    </div>
  );
};

export const PhoneBoxScore: React.FC = () => {
  const { f, scene, cue, endsOn } = useScene();
  const from = scene.from;
  const tOpen = cue("open");
  const t50 = cue("50");
  const tName = cue("name");
  const tShot = cue("shot");
  const tTell = cue("tell");
  const tGot = cue("got");
  const tCost = cue("cost");

  // the phone rises into the stage with the page loaded, Summary tab
  const rise = prog(f, from - 6, 28, arriveEase(28));
  const tabU = prog(f, tOpen + 2, 12, ease.inOut);
  const rowStart = endsOn("score", 7 * 4 + 6);
  const flingAt = t50 - 16;
  const scroll = phoneBoxScoreScroll(f, flingAt);

  // "name": the row lights, the rest of the page steps back
  const nl = prog(f, tName, 8);
  const s50 = prog(f, t50 + 6, 12);
  // "tell": the row lifts out, the phone sinks back
  const L = prog(f, tTell, 22, ease.inOut);
  const G = prog(f, tTell + 10, 24, ease.inOut);
  const C = prog(f, tTell + 4, 28, ease.inOut);
  const sink = prog(f, tTell, 28, ease.inOut);
  const lifted = f >= tTell;

  // the 50: counts in its cell while the fling lands, grows out of the table, then flies home into the lifted row
  const ptsCount = Math.round(countTo(f, t50 - 4, 14, 0, 50));
  const grow = prog(f, t50 + 6, 22, arriveEase(22));
  const home = prog(f, tTell + 8, 24, ease.inOut);
  const rowY = Y.rows + WEMBY * RH;
  const cellCx = SX + NAMEW + colX(PTS) + colW(PTS) / 2 - scroll;
  const bigAt = { x: 772, y: 812 };
  const push = prog(f, tShot, tTell - tShot, ease.linear);
  const lrTop = lerp(rowY, LR.top, L);
  const lrH = lerp(RH, LR.h, G);
  const lrName = lerp(NAMEW, LR.name, G);
  const keyW = lerp(colW(PTS), LR.key, G);
  const finalPtsCx = SX + LR.name + 2 * LR.key + LR.key / 2;
  const finalPtsCy = LR.top + 64 + (LR.h - 64) / 2;
  let bx = lerp(cellCx, bigAt.x, grow);
  let by = lerp(rowY + RH / 2, bigAt.y, grow);
  let bs = lerp(31, 236, grow) * (1 + 0.07 * push);
  if (home > 0) {
    bx = lerp(bigAt.x, finalPtsCx, home);
    by = lerp(bigAt.y, finalPtsCy, home);
    bs = lerp(236 * 1.07, 100, home);
  }
  const bigOn = f >= t50 + 6 && home < 1;

  // photo card: out of the row's left edge to the top left
  const pc = prog(f, tName - 2, 20, arriveEase(20));
  const card = {
    x: lerp(SX + 12, 84, pc),
    y: lerp(rowY + 6, 572, pc),
    w: lerp(56, 336, pc),
    h: lerp(70, 448, pc),
  };

  const gl = prog(f, tGot, 8);
  const cl = prog(f, tCost, 8);

  return (
    <>
      {/* the phone */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${((1 - rise) * 1000 + 36 * sink).toFixed(1)}px) scale(${(1 - 0.06 * sink).toFixed(4)})`,
          transformOrigin: "540px 900px",
          filter: sink > 0 ? `brightness(${(1 - 0.62 * sink).toFixed(3)})` : undefined,
          WebkitMaskImage: "linear-gradient(180deg, #000 0px, #000 1560px, transparent 1730px)",
          maskImage: "linear-gradient(180deg, #000 0px, #000 1560px, transparent 1730px)",
        }}
      >
        {/* titanium body, side buttons */}
        <div style={{ position: "absolute", left: SX - 20, top: TOP - 20, width: SW + 40, height: 1400, borderRadius: 150, background: "linear-gradient(100deg, #4b4e55 0%, #8d9097 6%, #3a3c41 14%, #2a2c30 50%, #3a3c41 86%, #8d9097 94%, #4b4e55 100%)", boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 2px #15161a" }} />
        <div style={{ position: "absolute", left: SX - 25, top: TOP + 250, width: 8, height: 120, borderRadius: 4, background: "linear-gradient(90deg,#2b2d31,#7d8087)" }} />
        <div style={{ position: "absolute", left: SX - 25, top: TOP + 400, width: 8, height: 120, borderRadius: 4, background: "linear-gradient(90deg,#2b2d31,#7d8087)" }} />
        <div style={{ position: "absolute", left: SX + SW + 17, top: TOP + 320, width: 8, height: 190, borderRadius: 4, background: "linear-gradient(90deg,#7d8087,#2b2d31)" }} />
        <div style={{ position: "absolute", left: SX - 8, top: TOP - 8, width: SW + 16, height: 1380, borderRadius: 136, background: "#050506" }} />
        {/* the screen */}
        <div style={{ position: "absolute", left: SX, top: TOP, width: SW, height: 1360, borderRadius: 128, overflow: "hidden", background: N.page }}>
          <PhoneBoxScoreStatus />
          <PhoneBoxScoreChrome tabU={tabU} />
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <div style={{ position: "absolute", left: 0, top: Y.thead - TOP }}>
              <PhoneBoxScoreLine y={0} h={Y.rows - Y.thead} scroll={scroll} head writeAt={from + 2} />
            </div>
            {ROWS.map((r, i) => {
              if (lifted && i === WEMBY) {
                // the slot it left
                return <div key={r.name} style={{ position: "absolute", left: 0, top: Y.rows - TOP + i * RH, width: SW, height: RH, background: "#0E1015", borderTop: `2px solid ${N.rule}`, zIndex: 0 }} />;
              }
              const dt = lifted ? f - (tTell + 2 + Math.abs(i - WEMBY) * 3) : -1;
              const fall = dt > 0 ? 0.55 * dt * dt : 0;
              const rot = dt > 0 ? (i % 2 ? 1 : -1) * Math.min(6, dt * 0.25) : 0;
              const lit = i === WEMBY ? nl : 0;
              return (
                <div key={r.name} style={{ position: "absolute", left: 0, top: Y.rows - TOP + i * RH, transform: `translateY(${fall.toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`, transformOrigin: `${SW / 2}px ${RH / 2}px`, zIndex: lifted ? 20 - Math.abs(i - WEMBY) : 1 }}>
                  <PhoneBoxScoreLine
                    y={0}
                    h={RH}
                    scroll={scroll}
                    row={r}
                    idx={i}
                    writeAt={rowStart + i * 4}
                    ptsOverride={i === WEMBY ? String(ptsCount) : undefined}
                    ptsFade={i === WEMBY && f >= t50 + 6 ? 0.3 : 1}
                    bg={i === WEMBY ? mix(f, tName, 8, N.surface, "#272E3B") : N.surface}
                    nameLit={lit}
                  />
                </div>
              );
            })}
          </div>
          {/* "name": the page steps back around his row */}
          {(s50 > 0 || nl > 0) && !lifted && (
            <>
              <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: Y.thead - TOP, background: `rgba(0,0,0,${Math.max(0.84 * s50, 0.55 * nl).toFixed(3)})` }} />
              <div style={{ position: "absolute", left: 0, top: Y.thead - TOP, width: SW, height: rowY - Y.thead, background: `rgba(0,0,0,${(0.55 * nl).toFixed(3)})` }} />
              <div style={{ position: "absolute", left: 0, top: rowY - TOP + RH, width: SW, height: 1360, background: `rgba(0,0,0,${(0.55 * nl).toFixed(3)})` }} />
            </>
          )}
          {/* glass */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(118deg, transparent ${(30 + 0.02 * (f - from)).toFixed(2)}%, rgba(255,255,255,0.045) ${(36 + 0.02 * (f - from)).toFixed(2)}%, transparent ${(48 + 0.02 * (f - from)).toFixed(2)}%)`, pointerEvents: "none" }} />
        </div>
      </div>

      {/* the Commons photo card, out of his row */}
      {pc > 0 && (
        <div style={{ position: "absolute", left: card.x, top: card.y, width: card.w, height: card.h, borderRadius: lerp(8, 26, pc), overflow: "hidden", background: "#161B22", boxShadow: `0 ${30 * pc}px ${80 * pc}px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.08)`, opacity: prog(f, tName - 2, 3, ease.linear) }}>
          <Img src={asset("phoneboxscore-wemby-portland.jpg")} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "112%", objectFit: "cover", objectPosition: "50% 0%", transform: `scale(${(1.02 + 0.06 * prog(f, tName, 300, ease.linear)).toFixed(4)})`, transformOrigin: "50% 30%" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, background: "linear-gradient(180deg, rgba(0,0,0,0.55), transparent)" }} />
          <div style={{ position: "absolute", right: 16, top: 12, fontFamily: "Inter, sans-serif", fontSize: 22, color: "rgba(230,232,236,0.82)", opacity: prog(f, tName + 12, 8) }}>Frenchieinportland, CC BY 4.0</div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "linear-gradient(0deg, rgba(0,0,0,0.75), transparent)" }} />
          <div style={{ position: "absolute", left: 22, bottom: 18, fontFamily: COND, fontWeight: 700, fontSize: 38, color: "#fff", opacity: prog(f, tName + 16, 8) }}>V. Wembanyama</div>
        </div>
      )}

      {/* the lifted row */}
      {lifted && (
        <PhoneBoxScoreLifted top={lrTop} h={lrH} nameW={lrName} keyW={keyW} L={L} G={G} C={C} gl={gl} cl={cl} ptsShown={home >= 1} />
      )}

      {/* the 50, out of the table */}
      {bigOn && (
        <div style={{ position: "absolute", left: bx - 400, top: by - bs * 0.6, width: 800, height: bs * 1.2, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ROBOTO, fontWeight: 900, fontSize: bs, lineHeight: 1, letterSpacing: -bs * 0.02, color: "#fff", textShadow: `0 ${bs * 0.08}px ${bs * 0.25}px rgba(0,0,0,0.6)` }}>
          <span style={{ position: "relative" }}>
            50
            <span
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(105deg, transparent ${(-40 + 180 * push).toFixed(1)}%, rgba(255,255,255,0.0) ${(-30 + 180 * push).toFixed(1)}%, rgba(180,200,230,0.55) ${(-20 + 180 * push).toFixed(1)}%, transparent ${(-10 + 180 * push).toFixed(1)}%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              50
            </span>
          </span>
        </div>
      )}
      {bigOn && home < 0.3 && (
        <div style={{ position: "absolute", left: bx - 200, width: 400, top: by - bs * 0.6 - 40, textAlign: "center", fontFamily: COND, fontSize: 34, letterSpacing: 3, color: N.muted, opacity: prog(f, t50 + 18, 8) * (1 - prog(f, tTell + 8, 6)) }}>PTS</div>
      )}

      {/* source */}
      <div style={{ position: "absolute", left: 96, top: 1404, fontFamily: "Inter, sans-serif", fontSize: 26, color: N.label, opacity: prog(f, tTell + 20, 10) }}>NBA.com box score, Nov 21 2026</div>
    </>
  );
};

const PhoneBoxScoreLifted: React.FC<{ top: number; h: number; nameW: number; keyW: number; L: number; G: number; C: number; gl: number; cl: number; ptsShown: boolean }> = ({ top, h, nameW, keyW, L, G, C, gl, cl, ptsShown }) => {
  const { f, cue } = useScene();
  const tCost = cue("cost");
  // the row scrolls back to its start while every other cell closes to nothing
  const scrollBack = MAXS * (1 - C);
  const wOf = (j: number) => (KEY.includes(j) ? lerp(colW(j), keyW, G) : colW(j) * (1 - C));
  const xs: number[] = [];
  let acc = 0;
  for (let j = 0; j < COLS.length; j++) {
    xs.push(acc);
    acc += wOf(j);
  }
  const headH = 64 * G;
  const valFs = lerp(31, 100, G);
  const row = ROWS[WEMBY];
  const gold = (j: number) => (j === FGA || j === FTA ? mix(f, tCost, 8, "#FFFFFF", N.gold) : "#FFFFFF");
  const ptsX = SX + nameW + xs[PTS] - scrollBack;
  const fgaX = SX + nameW + xs[FGA] - scrollBack;
  const bottom = top + h;
  return (
    <>
      <div style={{ position: "absolute", left: SX, top, width: SW, height: h, borderRadius: 22 * L, background: "#20262F", boxShadow: `0 ${40 * L}px ${90 * L}px rgba(0,0,0,${0.75 * L}), inset 0 0 0 2px rgba(255,255,255,${0.06 * L})`, overflow: "hidden" }}>
        {/* stat cells */}
        <div style={{ position: "absolute", left: nameW, top: 0, right: 0, height: h, overflow: "hidden" }}>
          {COLS.map((c, j) => {
            const w = wOf(j);
            const x = xs[j] - scrollBack;
            if (w < 1 || x + w < 0 || x > SW) return null;
            const key = KEY.includes(j);
            const isPts = j === PTS;
            const isCost = j === FGA || j === FTA;
            const lift = isCost ? -8 * cl : 0;
            const op = key ? 1 : 1 - C;
            return (
              <div key={c} style={{ position: "absolute", left: x, top: 0, width: w, height: h, opacity: op, overflow: "hidden" }}>
                {isCost && cl > 0 && <div style={{ position: "absolute", inset: "10px 8px", borderRadius: 14, background: `rgba(242,179,61,${(0.1 * cl).toFixed(3)})` }} />}
                {isPts && gl > 0 && <div style={{ position: "absolute", inset: "10px 8px", borderRadius: 14, background: `rgba(255,255,255,${(0.09 * gl).toFixed(3)})` }} />}
                {key && G > 0 && (
                  <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", fontFamily: COND, fontSize: 32, letterSpacing: 3, color: isCost ? mix(f, tCost, 8, N.muted, N.gold) : N.muted, opacity: G }}>{c}</div>
                )}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: key ? 0 : 13,
                    top: headH,
                    height: h - headH,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: key && G > 0.02 ? "center" : "flex-end",
                    fontFamily: ROBOTO,
                    fontWeight: key ? lerp(400, 900, G) : j === 0 ? 700 : 400,
                    fontSize: key ? valFs : 31,
                    color: isPts ? "#FFFFFF" : gold(j),
                    transform: `translateY(${lift.toFixed(1)}px)`,
                    opacity: isPts && !ptsShown ? 0 : 1,
                    textShadow: isPts && gl > 0 ? `0 0 ${(30 * gl).toFixed(1)}px rgba(255,255,255,${(0.55 * gl).toFixed(3)})` : isCost && cl > 0 ? `0 0 ${(26 * cl).toFixed(1)}px rgba(242,179,61,${(0.45 * cl).toFixed(3)})` : undefined,
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.cells[j]}
                </div>
              </div>
            );
          })}
          {/* hairline between the cost and what he got */}
          <div style={{ position: "absolute", left: xs[PTS] - scrollBack, top: 24, width: 2, height: h - 48, background: N.hair, opacity: G }} />
        </div>
        {/* pinned name, full name once the row is wide */}
        <div style={{ position: "absolute", left: 0, top: 0, width: nameW, height: h, background: "#272E3B", boxShadow: "8px 0 8px -5px rgba(0,0,0,0.55)", display: "flex", alignItems: "center", paddingLeft: lerp(27, 34, G), boxSizing: "border-box" }}>
          <div style={{ position: "relative", fontFamily: COND, fontWeight: 700, color: "#fff", fontSize: lerp(31, 44, G), lineHeight: 1.05 }}>
            <div style={{ opacity: 1 - prog(G, 0.4, 0.2, ease.linear) }}>
              {row.name}
              <span style={{ marginLeft: 9, fontSize: 22, fontWeight: 900 }}>{row.pos}</span>
            </div>
            <div style={{ position: "absolute", left: 0, top: 0, width: 260, opacity: prog(G, 0.4, 0.2, ease.linear) }}>
              Victor
              <br />
              Wembanyama
              <span style={{ marginLeft: 10, fontSize: 26, fontWeight: 900 }}>{row.pos}</span>
              <div style={{ fontFamily: ROBOTO, fontWeight: 400, fontSize: 28, color: N.muted, marginTop: 10 }}>31:51 MIN</div>
            </div>
          </div>
        </div>
      </div>

      {/* what he got */}
      {gl > 0 && (
        <>
          <div style={{ position: "absolute", left: ptsX + keyW / 2 - 1, top: bottom + 8, width: 2, height: 40 * gl, background: N.hair }} />
          <div style={{ position: "absolute", left: ptsX + keyW / 2 - 150, width: 300, top: bottom + 58, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 34, color: "#E6EDF3", ...blurIn(f, cue("got"), { dur: 7, rise: 10 }) }}>what he got</div>
        </>
      )}
      {/* what it cost */}
      {cl > 0 && (
        <>
          <svg style={{ position: "absolute", left: fgaX + 18, top: bottom + 8, overflow: "visible" }} width={2 * keyW - 36} height={44}>
            <path d={`M1 0 V18 H${2 * keyW - 37} V0 M${keyW - 18} 18 V40`} fill="none" stroke={N.hair} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl} />
          </svg>
          <div style={{ position: "absolute", left: fgaX + keyW - 180, width: 360, top: bottom + 58, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 34, color: N.gold, ...blurIn(f, tCost, { dur: 7, rise: 10 }) }}>what it cost</div>
        </>
      )}
    </>
  );
};
