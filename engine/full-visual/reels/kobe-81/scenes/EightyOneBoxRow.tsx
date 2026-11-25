// "He finished with 81 points on 28 of 46 shooting, and the Lakers won 122 to 104."
// The reel's big move. It opens on the picture `secondhalf` leaves (the 26 dim on the small board, the 55 in the
// gold stack, the red 41 beside it, the arena dark behind, the scoreboard at END 3RD 85-91). The 55 fly back and the
// 9 x 9 board stands full at centre; on "81" every bulb leaves its socket at once and slams down as a huge "81" in
// the scoreboard's own seven-segment shape, 9 bulbs on each of its 9 lit segments: a gold bloom, one shake, sparks.
// Then the 81 flies, rigid, on one arc into the PTS cell of Kobe's real Basketball-Reference row, and the page opens
// around that cell, already opaque, writing out at real copy (41:56, 28, 46, .609, 7, 13, .538, 18, 20, .900). Team
// Totals slides in; under it the 81 gold bulbs pour out of the PTS cell into a stack of 122 sockets, and the other
// Lakers' 41 light warm white as the total rolls to 122. The scoreboard goes FINAL, 122-104, and the stack pours into
// the LAL total of BBR's line score, which takes the band on "104" with the 42 and 31 lit.
import React from "react";
import { Img, staticFile } from "remotion";
import { blurIn, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { StaplesNightBoard } from "./StaplesNightBoard";
import { OneAgainstFiveBigBoard, OneAgainstFiveGoldSpot, OneAgainstFiveRedSpot, OneAgainstFiveSmallBoard, OneAgainstFiveStack } from "./OneAgainstFiveData";
import {
  EightyOneBoxRowBig,
  EightyOneBoxRowCentre,
  EightyOneBoxRowKobe,
  EightyOneBoxRowOdom,
  EightyOneBoxRowOffSpots,
  EightyOneBoxRowRand,
  EightyOneBoxRowSpots,
  EightyOneBoxRowStack,
  EightyOneBoxRowTarget,
  EightyOneBoxRowTotals,
} from "./EightyOneBoxRowData";
import { EightyOneBoxRowColX, EightyOneBoxRowLineScore, EightyOneBoxRowRows, EightyOneBoxRowTable, makeRow } from "./EightyOneBoxRowTable";

const GOLD = "#FDB927";
const RED = "#CE1141";
const WARM = "#FFE9C4"; // the other Lakers' points: the same bulb in warm white
const GREY = "#8B949E";
const ARENA = "kobe-81/commons-kobe-81-night-staples-2006-endlessbender-ccby2.jpg";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const bell = (f: number, at: number, dur: number) => {
  const t = (f - at) / dur;
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t);
};

/** one bulb, the reel's: a glass globe with a hot core and a halo, or a dark socket when lit = 0 */
const EightyOneBoxRowBulb: React.FC<{ x: number; y: number; r: number; lit: number; glow?: number; alpha?: number; socket?: boolean; sx?: number; sy?: number; color?: string }> = ({ x, y, r, lit, glow = 1, alpha = 1, socket = true, sx = 1, sy = 1, color = GOLD }) => {
  if (alpha <= 0.01 || r <= 0.2) return null;
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, opacity: alpha, transform: sx !== 1 || sy !== 1 ? `scale(${sx.toFixed(3)}, ${sy.toFixed(3)})` : undefined }}>
      {lit > 0.02 && glow > 0.02 && (
        <div style={{ position: "absolute", left: -r * 1.5, top: -r * 1.5, width: r * 5, height: r * 5, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 62%)`, opacity: Math.min(1, 0.4 * lit * glow) }} />
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

export const EightyOneBoxRow: React.FC = () => {
  const { f, fps, scene, cue, endsOn, theme } = useScene();
  const N = (n: number) => n.toFixed(2);
  const mount = scene.from - LEAD;

  const t81 = cue("81");
  const tPoints = cue("points");
  const t28 = cue("28");
  const t46 = cue("46");
  const tShoot = cue("shooting");
  const tAnd = cue("and");
  const tWon = cue("won");
  const t122 = cue("122");
  const t104 = cue("104");

  const Bb = OneAgainstFiveBigBoard;
  const Bs = OneAgainstFiveSmallBoard;
  const B = EightyOneBoxRowBig;
  const SP = EightyOneBoxRowSpots;
  const CEN = EightyOneBoxRowCentre;

  // ---------------------------------------------------------------- phase A: the board fills again, centred
  const holdA = scene.from + 3; // the outgoing scene whips off the top first: no moving copy under it
  const growK = prog(f, holdA, 20, ease.inOut);
  const pourStart = holdA + 1;
  const pourFlight = 16;
  const pourSpan = 10;
  // top of the stack leaves first
  const pourAt = (j: number) => pourStart + ((54 - j) * pourSpan) / 54;
  const fullAt = pourStart + pourSpan + pourFlight; // the last socket filled
  const fullFlash = bell(f, fullAt - 2, 12);
  const socketsIn = prog(f, holdA - 2, 10, ease.out);
  const redGo = prog(f, holdA - 2, 9, ease.in);

  // ---------------------------------------------------------------- phase B: the slam on "81"
  const liftStart = Math.max(fullAt + 1, t81 - 15);
  const departB = (i: number) => liftStart + Math.floor(i / 9) * 0.5; // all at once, a ripple of half a frame a row
  const slamAt = t81;
  const impact = bell(f, slamAt, 14);
  const squash = bell(f, slamAt, 8);
  const shakeT = f - slamAt;
  const shake = shakeT >= 0 && shakeT < 18 ? Math.exp(-shakeT / 5) * Math.sin(shakeT * 1.9) : 0;
  const shakeX = shake * 7;
  const shakeY = shake * 16;
  const boardGone = prog(f, liftStart + 4, 10, ease.in);

  // ---------------------------------------------------------------- phase C: breathing, a marquee chase
  const chaseHead = (f - (slamAt + 10)) * 1.35;
  const breathe = 0.9 + 0.1 * Math.sin(f * 0.12);

  // ---------------------------------------------------------------- phase D: into the PTS cell, one rigid arc
  const R = EightyOneBoxRowRows;
  const tAndLakers = tAnd - 2;
  const lift = prog(f, tAndLakers, 14, ease.inOut);
  const kobeY = R.head + R.headH + R.odomH * (1 - lift);
  const pts = EightyOneBoxRowColX.pts;
  const cellC = { x: pts.x + pts.w / 2, y: kobeY + R.kobeH / 2 };
  const smallScale = 46 / B.h;
  const landAt = cue("on") + 2; // the 81 sits in its cell as "on" is said; the page then opens on "28"
  const flyAt = landAt - 20;
  const flyK = prog(f, flyAt, landAt - flyAt, ease.inOut); // one k for every bulb: the digits stay one shape
  const flySc = Math.pow(smallScale, flyK);
  const rigid = (p: { x: number; y: number }) => ({
    x: lerp(CEN.x, cellC.x, flyK) + (p.x - CEN.x) * flySc,
    y: lerp(CEN.y, cellC.y, flyK) + (p.y - CEN.y) * flySc - Math.sin(Math.PI * flyK) * 150,
  });
  const shrinkEnd = landAt;
  const inCell = prog(f, landAt, 8, ease.out); // bulbs hand over to the cell's own "81"
  const cellFlash = bell(f, landAt, 16);

  // ---------------------------------------------------------------- the page, opaque, opening around the landed cell
  const openAt = landAt + 1;
  const open = prog(f, openAt, 13, ease.out);
  const cardAt = openAt;
  const cardIn = f >= landAt ? 1 : 0;
  const clipOf = (o: number) => {
    if (f < landAt) return "inset(0 0 1920px 0)";
    if (o >= 0.999) return undefined;
    const cTop = kobeY + 2;
    const cBot = kobeY + R.kobeH - 2;
    const top = lerp(cTop, 690, o);
    const left = lerp(pts.x, 0, o);
    const right = lerp(1080 - (pts.x + pts.w), 0, o);
    const bottom = lerp(1920 - cBot, 1920 - 1160, o);
    return `inset(${N(top)}px ${N(right)}px ${N(bottom)}px ${N(left)}px)`;
  };
  const headIn = prog(f, openAt + 2, 14, ease.out);
  const totalsIn = prog(f, tAndLakers + 6, 16, ease.out);
  const hover = prog(f, t28 - 8, 10, ease.out);
  const sweep = lerp(-0.3, 1.3, prog(f, t28, 70, ease.inOut));

  const sw = [0, 4, 8, 12, 16, 20]; // the "shooting" sweep, left to right
  const kobe = makeRow(
    f,
    {
      player: { text: String(EightyOneBoxRowKobe.player), at: openAt + 3, type: 1, bold: false },
      mp: { text: String(EightyOneBoxRowKobe.mp), at: openAt + 6, type: 1 },
      fg: { text: "28", at: endsOn("28", 12) + 2, roll: [0, 28, 12], bold: f >= t28 + 2, flash: bell(f, t28 + 2, 14) }, // gold is Kobe's points only: the 28 goes bold, not gold
      fga: { text: "46", at: endsOn("46", 12) + 2, roll: [0, 46, 12], flash: bell(f, t46 + 2, 12) },
      fg_pct: { text: String(EightyOneBoxRowKobe.fg_pct), at: t46 + 6, type: 1 },
      fg3: { text: "7", at: tShoot + sw[0], roll: [0, 7, 8] },
      fg3a: { text: "13", at: tShoot + sw[1], roll: [0, 13, 8] },
      fg3_pct: { text: String(EightyOneBoxRowKobe.fg3_pct), at: tShoot + sw[2], type: 1 },
      ft: { text: "18", at: tShoot + sw[3], roll: [0, 18, 8] },
      fta: { text: "20", at: tShoot + sw[4], roll: [0, 20, 8] },
      ft_pct: { text: String(EightyOneBoxRowKobe.ft_pct), at: tShoot + sw[5], type: 1 },
      pts: { text: "81", at: shrinkEnd, gold: inCell, flash: cellFlash, bold: true },
      game_score: { text: String(EightyOneBoxRowKobe.game_score), at: tShoot + 24 },
    },
    fps,
  );
  const odomAt = openAt + 3;
  const odom = makeRow(
    f,
    Object.fromEntries(
      ["player", "mp", "fg", "fga", "fg_pct", "fg3", "fg3a", "fg3_pct", "ft", "fta", "ft_pct", "pts", "game_score"].map((k, i) => [
        k,
        { text: String(EightyOneBoxRowOdom[k]), at: odomAt + i },
      ]),
    ),
    fps,
  );
  const totAt = tAndLakers + 8;
  const totPtsAt = endsOn("122", 14);
  const totals = makeRow(
    f,
    {
      ...Object.fromEntries(
        ["player", "mp", "fg", "fga", "fg_pct", "fg3", "fg3a", "fg3_pct", "ft", "fta", "ft_pct"].map((k, i) => [
          k,
          { text: String(EightyOneBoxRowTotals[k]), at: totAt + Math.round(i * 0.8) },
        ]),
      ),
      pts: { text: "122", at: totPtsAt, roll: [81, 122, 14], flash: bell(f, t122, 16), bold: true },
    },
    fps,
  );

  // ---------------------------------------------------------------- the scoreboard: END 3RD, FINAL, 122-104
  const lalRoll = Math.round(lerp(91, 122, prog(f, totPtsAt, 14, ease.outHard)));
  const torAt = endsOn("104", 12);
  const torRoll = Math.round(lerp(85, 104, prog(f, torAt, 12, ease.outHard)));
  const final = f >= tWon;
  const board = {
    power: 1,
    tor: torRoll,
    lal: lalRoll,
    period: final ? "FINAL" : "END 3RD",
    clock: "0.0",
    logoTor: 1,
    logoLal: 1,
    flashLal: Math.max(0.15 * Math.sin(f * 0.08) + 0.15, 0) * (final ? 0 : 1) + bell(f, tWon, 16) + 1.2 * bell(f, t122, 16),
    flashTor: bell(f, t104, 16),
    flareTor: 0,
  };
  const wonFlip = bell(f, tWon - 1, 8);

  // ---------------------------------------------------------------- the arena, dark behind it all
  const arenaFlare = impact;
  const arenaDim = prog(f, cardAt, 16, ease.inOut);


  // a bulb's place for this frame: socket on the board -> big digit -> the PTS cell
  const bulbs = Array.from({ length: 81 }, (_, i) => {
    const col = i % 9;
    const row = Math.floor(i / 9);
    const sock = { x: Bb.x0 + col * Bb.pitch, y: Bb.y0 + row * Bb.pitch };
    const s = EightyOneBoxRowTarget[i];
    const spot = SP[s];
    // phase A: where it comes from
    let x: number;
    let y: number;
    let r: number;
    let lit = 1;
    let glow = breathe;
    let sx = 1;
    let sy = 1;
    if (i < 26) {
      const small = { x: Bs.x0 + col * Bs.pitch, y: Bs.y0 + row * Bs.pitch };
      x = lerp(small.x, sock.x, growK);
      y = lerp(small.y, sock.y, growK) - Math.sin(Math.PI * growK) * 30;
      r = lerp(Bs.r, Bb.r, growK);
      lit = lerp(0.45, 1, growK);
      glow = lerp(0.5, breathe, growK);
    } else {
      const j = i - 26;
      const st = OneAgainstFiveGoldSpot(j);
      const t = clamp((f - pourAt(j)) / pourFlight, 0, 1);
      const e = ease.inOut(t);
      x = lerp(st.x, sock.x, e);
      y = lerp(st.y, sock.y, e) - Math.sin(Math.PI * t) * 90;
      r = lerp(OneAgainstFiveStack.r, Bb.r, e);
      glow = breathe * (1 + 1.2 * bell(f, pourAt(j) + pourFlight, 8));
    }
    glow *= 1 + 0.9 * fullFlash;
    // phase B: socket -> digit, rising toward the camera, then slamming down
    const d = departB(i);
    if (f >= d) {
      const t = clamp((f - d) / (slamAt - d), 0, 1);
      const up = Math.sin(Math.PI * Math.min(1, t * 1.15)) * (170 + 60 * EightyOneBoxRowRand(i, 3));
      x = lerp(sock.x, spot.x, ease.inOut(t));
      y = lerp(sock.y, spot.y, ease.in(t)) - up;
      r = lerp(Bb.r, B.r, t) * (1 + 0.55 * Math.sin(Math.PI * t));
      const v = t > 0.55 && t < 1 ? (t - 0.55) / 0.45 : 0;
      sy = 1 + 0.35 * v;
      sx = 1 - 0.12 * v;
      glow = 1 + 0.6 * Math.sin(Math.PI * t);
      if (t >= 1) {
        // landed: squash, then breathe with the marquee chase
        const row = (spot.y - B.top) / B.h;
        sy = 1 - 0.22 * squash * (0.6 + 0.4 * row);
        sx = 1 + 0.16 * squash;
        let dd = Math.abs(s - (((chaseHead % 81) + 81) % 81));
        dd = Math.min(dd, 81 - dd);
        const chase = f > slamAt + 10 ? Math.exp(-(dd * dd) / 10) : 0;
        glow = breathe * (1 + 1.6 * impact + 1.1 * chase);
        r = B.r * (1 + 0.12 * chase);
        y = spot.y + 3 * squash;
        x = spot.x;
      }
    }
    // phase D: the whole 81 flies as one shape into the PTS cell
    const k = flyK;
    if (k > 0) {
      const p = rigid(spot);
      x = p.x;
      y = p.y;
      r = Math.max(1.4, B.r * flySc * lerp(1, 1.25, k));
      glow = lerp(glow, 1.4, k);
      sx = lerp(sx, 1, k);
      sy = lerp(sy, 1, k);
    }
    return { i, s, x, y, r, lit, glow, sx, sy, alpha: 1 - inCell };
  });

  // sparks off the slam, from the bottom of the digits
  const sparks = Array.from({ length: 44 }, (_, n) => {
    const t = f - slamAt;
    if (t < 0 || t > 34) return null;
    const src = SP[[27, 28, 29, 30, 31, 32, 33, 34, 35, 72, 73, 74, 75, 76, 77, 78, 79, 80][n % 18]];
    const ang = -Math.PI * (0.1 + 0.8 * EightyOneBoxRowRand(n, 1));
    const sp = 9 + 13 * EightyOneBoxRowRand(n, 2);
    const x = src.x + Math.cos(ang) * sp * t;
    const y = src.y + 10 + Math.sin(ang) * sp * t + 0.55 * t * t;
    const a = (1 - t / 34) * (0.6 + 0.4 * EightyOneBoxRowRand(n, 4));
    const len = 6 + sp * 0.9;
    const vx = Math.cos(ang) * sp;
    const vy = Math.sin(ang) * sp + 1.1 * t;
    const rot = (Math.atan2(vy, vx) * 180) / Math.PI;
    return <div key={n} style={{ position: "absolute", left: x, top: y, width: len, height: 3, borderRadius: 2, background: "linear-gradient(90deg, rgba(255,240,200,0), #FFE9A8)", opacity: a, transform: `rotate(${N(rot)}deg)`, transformOrigin: "100% 50%", boxShadow: "0 0 6px rgba(253,185,39,0.9)" }} />;
  });

  const digitsAlive = f >= liftStart;
  const bloom = digitsAlive ? (impact * 1.0 + (f > slamAt ? 0.32 : 0)) * (1 - prog(f, flyAt, 14, ease.in)) : 0;
  const offSock = prog(f, slamAt - 2, 8, ease.out) * (1 - prog(f, flyAt + 2, 10, ease.in));

  // ---------------------------------------------------------------- 81 of 122: the Lakers' total as bulbs, under the page
  const ST = EightyOneBoxRowStack;
  const slot = (n: number) => ({ x: ST.x0 + (n % ST.cols) * ST.pitch, y: ST.y0 + Math.floor(n / ST.cols) * ST.pitch });
  const stackIn = prog(f, tAnd - 4, 10, ease.out);
  const goldAt = (j: number) => tAnd - 2 + (j * 20) / 80; // they leave the PTS cell one after another
  const goldFlight = 14;
  const totRolled = Math.round(lerp(81, 122, prog(f, totPtsAt, 14, ease.outHard)));
  const othersLit = f >= totPtsAt ? totRolled - 81 : 0;
  const goldLanded = Array.from({ length: 81 }, (_, j) => (f >= goldAt(j) + goldFlight ? 1 : 0)).reduce((a: number, b: number) => a + b, 0);
  const lsAt = endsOn("104", 14);
  const pourAway = lsAt - 6; // the stack pours into the LAL total of the line score as it writes in
  const lsCell = { x: 36 + 16 + 360 + 38, y: 1104 + 70 + 58 * 2 + 29 };
  const awayAt = (n: number) => pourAway + (n * 12) / 121;
  const awayDur = 16;
  const stackLabel = stackIn * (1 - prog(f, pourAway, 8, ease.in));
  const floorY = B.top + 94 * B.u + 30;

  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${N(shakeX)}px, ${N(shakeY)}px)` }}>
      {/* ---------- the arena behind, the night photo dark and soft (as `secondhalf` leaves it) */}
      <div style={{ position: "absolute", left: 0, top: 700, width: 1080, height: 760, overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 22%, #000 70%, transparent 100%)", opacity: 1 - 0.25 * arenaDim }}>
        <Img src={staticFile(ARENA)} style={{ position: "absolute", left: -224 + prog(f, mount, 380, ease.linear) * 26, top: -170, width: 1600, height: 1200, maxWidth: "none", filter: `blur(5px) brightness(${N(0.32 + 0.4 * arenaFlare)}) saturate(0.8)` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 55% at 50% 62%, rgba(253,185,39,${N(0.10 + 0.12 * arenaFlare)}) 0%, rgba(0,0,0,0) 70%)` }} />
      </div>

      {/* ---------- the scoreboard */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${N(-4 * wonFlip)}px)` }}>
        <StaplesNightBoard st={board} />
      </div>

      {/* ---------- the red 41 sink away */}
      {redGo < 1 &&
        Array.from({ length: 41 }, (_, j) => {
          const p = OneAgainstFiveRedSpot(j);
          return <EightyOneBoxRowBulb key={`r${j}`} x={p.x} y={p.y + redGo * 160} r={OneAgainstFiveStack.r} lit={1} glow={1 - redGo} alpha={1 - redGo} socket={false} color={RED} />;
        })}

      {/* ---------- the board's sockets, waiting at centre */}
      {boardGone < 1 &&
        Array.from({ length: 81 }, (_, i) => (
          <EightyOneBoxRowBulb key={`s${i}`} x={Bb.x0 + (i % 9) * Bb.pitch} y={Bb.y0 + Math.floor(i / 9) * Bb.pitch} r={Bb.r} lit={0} alpha={socketsIn * (1 - boardGone)} />
        ))}

      {/* ---------- the page writes out behind the 81 */}
      <EightyOneBoxRowTable f={f} clip={clipOf(open)} cardIn={cardIn} headIn={headIn} odom={odom} kobe={kobe} totals={totals} lift={lift} totalsIn={totalsIn} hover={hover} sweep={sweep} />

      {/* ---------- the bloom of the slam */}
      {bloom > 0.01 && (
        <>
          <div style={{ position: "absolute", left: CEN.x - 620, top: CEN.y - 520, width: 1240, height: 1040, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(253,185,39,0.55) 0%, rgba(253,185,39,0.16) 45%, rgba(0,0,0,0) 100%)", opacity: bloom, mixBlendMode: "screen" }} />
          {/* the shock on the floor line */}
          <div style={{ position: "absolute", left: CEN.x - 80 - 520 * prog(f, slamAt, 18, ease.out), top: floorY - 14 - 26 * prog(f, slamAt, 18, ease.out), width: 160 + 1040 * prog(f, slamAt, 18, ease.out), height: 28 + 52 * prog(f, slamAt, 18, ease.out), borderRadius: "50%", border: "3px solid rgba(255,226,150,0.8)", opacity: f >= slamAt ? 1 - prog(f, slamAt, 18, ease.in) : 0, filter: "blur(1.5px)" }} />
        </>
      )}

      {/* ---------- the empty sockets of the 1's unlit segments, flying with the digits */}
      {offSock > 0.01 &&
        EightyOneBoxRowOffSpots.map((p, n) => {
          const q = flyK > 0 ? rigid(p) : p;
          return <EightyOneBoxRowBulb key={`o${n}`} x={q.x} y={q.y} r={B.r * 0.92 * flySc} lit={0} alpha={offSock * 0.85} />;
        })}

      {/* ---------- the 81 bulbs */}
      {bulbs.map((b) => (
        <EightyOneBoxRowBulb key={`b${b.i}`} x={b.x} y={b.y} r={b.r} lit={b.lit} glow={b.glow} alpha={b.alpha} socket={false} sx={b.sx} sy={b.sy} />
      ))}
      {sparks}

      {/* ---------- 81 of 122: the sockets, Kobe's gold out of his cell, the other Lakers' 41 warm white */}
      {stackIn > 0.01 &&
        Array.from({ length: 122 }, (_, n) => {
          const p = slot(n);
          const gone = prog(f, awayAt(n), awayDur, ease.inOut);
          if (gone >= 1) return null;
          const isGold = n < 81;
          let x = p.x;
          let y = p.y;
          let r = ST.r;
          let lit = 0;
          let glow = 1;
          let sockA = stackIn;
          if (isGold) {
            const t = clamp((f - goldAt(n)) / goldFlight, 0, 1);
            if (t > 0 && t < 1) {
              const e = ease.inOut(t);
              x = lerp(cellC.x, p.x, e);
              y = lerp(cellC.y, p.y, e) - Math.sin(Math.PI * t) * 70;
              r = lerp(4, ST.r, e);
            }
            lit = t > 0 ? 1 : 0;
            glow = breathe * (1 + 1.3 * bell(f, goldAt(n) + goldFlight, 8));
          } else {
            const j = n - 81;
            lit = j < othersLit ? 1 : 0;
            glow = 1 + 1.2 * bell(f, totPtsAt + 2, 12) + 1.0 * bell(f, t122, 14);
          }
          glow *= 1 + 0.5 * bell(f, t122, 16);
          // the pour into the line score's 122
          if (gone > 0) {
            x = lerp(x, lsCell.x, gone);
            y = lerp(y, lsCell.y, gone) - Math.sin(Math.PI * gone) * 40;
            r = lerp(r, 3, gone);
            sockA *= 1 - gone;
          }
          const a = gone > 0.7 ? (1 - gone) / 0.3 : 1;
          return (
            <React.Fragment key={`k${n}`}>
              {sockA > 0.01 && <EightyOneBoxRowBulb x={p.x} y={p.y} r={ST.r} lit={0} alpha={sockA * 0.9} />}
              {lit > 0 && <EightyOneBoxRowBulb x={x} y={y} r={r} lit={1} glow={glow} alpha={a * stackIn} socket={false} color={isGold ? GOLD : WARM} />}
            </React.Fragment>
          );
        })}
      {stackLabel > 0.01 && (
        <div style={{ position: "absolute", left: 0, top: ST.y0 + ST.pitch * 4 + 30, width: 1080, height: 50, opacity: stackLabel, fontFamily: theme.font.ui, fontSize: 34, color: "#C9D1D9" }}>
          <div style={{ position: "absolute", left: ST.x0 - ST.r, top: 0, whiteSpace: "nowrap" }}>
            Kobe <span style={{ marginLeft: 10, fontSize: 42, fontWeight: 800, color: GOLD, fontVariantNumeric: "tabular-nums" }}>{goldLanded}</span>
          </div>
          <div style={{ position: "absolute", left: 540, top: 0, transform: "translateX(-50%)", whiteSpace: "nowrap", opacity: prog(f, totPtsAt - 2, 6, ease.out) }}>
            of <span style={{ marginLeft: 8, fontSize: 42, fontWeight: 800, color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>{totRolled}</span>
          </div>
          <div style={{ position: "absolute", right: 1080 - (ST.x0 + (ST.cols - 1) * ST.pitch + ST.r), top: 0, whiteSpace: "nowrap" }}>
            Other Lakers <span style={{ marginLeft: 10, fontSize: 42, fontWeight: 800, color: WARM, fontVariantNumeric: "tabular-nums" }}>{othersLit}</span>
          </div>
        </div>
      )}

      {/* ---------- BBR's line score, and the scorebox lines beside it */}
      <EightyOneBoxRowLineScore f={f} at={endsOn("104", 14)} litAt={[t104 + 4, t104 + 9]} x={36} y={1104} />
      <div style={{ ...blurIn(f, endsOn("104", 14) + 10, { dur: 8, rise: 10 }), position: "absolute", left: 560, top: 1150, width: 480, fontFamily: theme.font.ui, fontSize: 30, lineHeight: "42px", color: "#C9D1D9" }}>
        <div>9:30 PM, January 22, 2006</div>
        <div>STAPLES Center, Los Angeles</div>
        <div style={{ color: GREY }}>Attendance: 18,997</div>
      </div>

      {/* ---------- source and credit */}
      <div style={{ position: "absolute", left: 40, top: 1396, fontFamily: theme.font.ui, fontSize: 26, color: GREY, opacity: prog(f, cardAt + 10, 10, ease.out) }}>Basketball-Reference box score</div>
      <div style={{ position: "absolute", right: 40, top: 702, fontFamily: theme.font.ui, fontSize: 22, color: "#7D8590", opacity: 1 - 0.4 * arenaDim }}>Arena: endlessbender, CC BY 2.0</div>
    </div>
  );
};
