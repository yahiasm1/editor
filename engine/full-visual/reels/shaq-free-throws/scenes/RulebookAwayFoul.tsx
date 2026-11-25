// rule, dark, 68.44-75.30 s: "Years later the league changed the rules, so grabbing a guy away from the ball late in any
// quarter now gives his team a free throw and the ball."
// The real NBA Official Rules 2025-26 (cdn.nba.com): the cover rises and swings open on its spine to page 49; on
// "rules" the camera pushes to Section X, Away-From-The-Play Foul, and a highlighter runs over the heading; the
// definition it points to (Rule 4, Section IV(h), page 18) drops onto the page as a cut strip. On "grabbing" the book
// becomes a reading window at the top and the reel's Lakers court rises under it, seen from high above: a guard with
// the ball on the left wing, Shaq (the real cut-out) on the weak-side block, a green defender grabbing his arm, foul
// red at the grip; each highlight lands on its word ("illegal contact by the defense", "deliberately away from the
// immediate area of offensive action", "in the last two minutes of each period"). away: a foul red zone opens round
// the grab. from the ball: a hairline measures ball to Shaq. late / any / quarter: the reel's scorebug, 2:00 going red,
// the period rolling 1ST to 4TH. now: page 49 a(1); the guard walks to the line. throw: one free throw drops, +1.
// ball.: a(2); the ball goes to the sideline at the free throw line extended, "Lakers ball". (notes/RulebookAwayFoul.md)
import React from "react";
import { AbsoluteFill } from "remotion";
import { arrive, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { pcProjector, type PcCam } from "./PictureCourtWorld";
import { RBAF_MARKS, RBAF_PAGE, RulebookAwayFoulBook, rbafFrom18 } from "./RulebookAwayFoulBook";
import { RBAF_GUARD, RBAF_LINE, RBAF_SHAQ, RBAF_SIDE, RulebookAwayFoulCourt, type RulebookAwayFoulCourtState } from "./RulebookAwayFoulCourt";
import { RulebookAwayFoulBug } from "./RulebookAwayFoulBug";
import type { RulebookAwayFoulPose } from "./RulebookAwayFoulPlayer";

const deg = Math.PI / 180;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** the reading window, once the court takes the middle */
const WIN = { x: 30, y: 528, w: 1020, h: 268, r: 28 };
/** the stage band the book lives in before the window forms */
const BAND = { x: 0, y: 512, w: 1080, h: 958, r: 0 };

function useRulebookAwayFoulTimes() {
  const { cue, cueEnd, scene } = useScene();
  return {
    in: scene.from - LEAD,
    years: cue("Years"),
    later: cue("later"),
    league: cue("league"),
    changed: cue("changed"),
    rules: cue("rules"),
    rulesEnd: cueEnd("rules"),
    so: cue("so"),
    grabbing: cue("grabbing"),
    guy: cue("guy"),
    away: cue("away"),
    from: cue("from"),
    ballA: cue("ball"),
    ballAEnd: cueEnd("ball"),
    late: cue("late"),
    any: cue("any"),
    quarter: cue("quarter"),
    now: cue("now"),
    gives: cue("gives"),
    team: cue("team"),
    free: cue("free"),
    throw: cue("throw"),
    and: cue("and"),
    ballB: cue("ball", 2),
    end: scene.to,
  };
}
type T = ReturnType<typeof useRulebookAwayFoulTimes>;

/** the paper camera: a point of the paper world (page-49 px) put at a screen anchor, at a zoom */
type DocCam = { wx: number; wy: number; z: number; ax: number; ay: number };
const mixDoc = (a: DocCam, b: DocCam, t: number): DocCam => ({
  wx: lerp(a.wx, b.wx, t), wy: lerp(a.wy, b.wy, t), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), t)), ax: lerp(a.ax, b.ax, t), ay: lerp(a.ay, b.ay, t),
});
const WA = { ax: WIN.x + WIN.w / 2, ay: WIN.y + WIN.h / 2 };
/** the centre of a passage, in the paper world */
function rbafCentre(key: string, dy = 0): [number, number] {
  const m = RBAF_MARKS[key];
  const ys = m.lines.map((l) => (l[1] + l[3]) / 2);
  const y = (Math.min(...ys) + Math.max(...ys)) / 2;
  const p = m.page === 18 ? rbafFrom18(1050, y) : [950, y];
  return [p[0], p[1] + dy];
}

function rulebookAwayFoulDocCam(t: T, f: number): DocCam {
  const C0: DocCam = { wx: 1000, wy: 1400, z: 0.29, ax: 560, ay: 1000 };
  const C1: DocCam = { ...C0, z: 0.305, ax: 540, ay: 990 };
  const C2: DocCam = { wx: 960, wy: 1560, z: 0.6, ax: 540, ay: 990 };
  const C3: DocCam = { wx: 980, wy: 1500, z: 0.6, ax: 540, ay: 990 };
  const [gx, gy] = rbafCentre("grab", 22);
  const C4: DocCam = { wx: gx, wy: gy, z: 0.63, ...WA };
  const [ax_, ay_] = rbafCentre("away", -10);
  const C5: DocCam = { wx: ax_, wy: ay_, z: 0.64, ...WA };
  const [nx, ny] = rbafCentre("any", 10);
  const C6: DocCam = { wx: nx, wy: ny, z: 0.64, ...WA };
  const [ox, oy] = rbafCentre("one");
  const C7: DocCam = { wx: ox, wy: oy, z: 0.64, ...WA };
  const [sx, sy] = rbafCentre("side");
  const C8: DocCam = { wx: sx, wy: sy, z: 0.65, ...WA };
  let c = mixDoc(C0, C1, prog(f, t.in, t.changed - t.in, ease.inOut));
  c = mixDoc(c, C2, prog(f, t.rules - 16, 18, ease.inOut));
  c = mixDoc(c, C3, prog(f, t.rulesEnd, 12, ease.inOut));
  c = mixDoc(c, C4, prog(f, t.so - 4, t.grabbing + 6 - (t.so - 4), ease.inOut));
  c = mixDoc(c, C5, prog(f, t.away - 8, 12, ease.inOut));
  c = mixDoc(c, C6, prog(f, t.any - 8, 10, ease.inOut));
  c = mixDoc(c, C7, prog(f, t.now - 6, 14, ease.inOut));
  c = mixDoc(c, C8, prog(f, t.and - 6, 12, ease.inOut));
  // a held page keeps living: a slow drift
  return { ...c, wx: c.wx + Math.sin(f / 50) * 6, wy: c.wy + Math.cos(f / 60) * 3 };
}

/** the court camera: high above the top of the key, rim at the top, drifting */
function rulebookAwayFoulCourtCam(t: T, f: number): PcCam {
  const d = prog(f, t.so, t.end - t.so, ease.linear);
  // the ball goes to the sideline: the camera follows it across
  const pan = prog(f, t.throw + 14, t.ballB + 6 - (t.throw + 14), ease.inOut);
  return { tx: -8.5 * pan, ty: 8.6 - 0.6 * d, tz: 0, D: 75, yaw: (3 - 4 * d) * deg, pitch: 58 * deg, F: 1750 * (1 + 0.03 * d), cx: 540, cy: 1188 };
}

/** where the guard is and what he does: dribbling on the wing, walking to the line, the free throw */
function rulebookAwayFoulGuard(t: T, f: number): { at: [number, number]; pose: RulebookAwayFoulPose; ball: [number, number, number]; spin: number } {
  const walkT = prog(f, t.now - 2, t.free - 4 - (t.now - 2), ease.inOut);
  const at: [number, number] = [lerp(RBAF_GUARD[0], RBAF_LINE[0], walkT), lerp(RBAF_GUARD[1], RBAF_LINE[1], walkT)];
  const walking = walkT > 0 && walkT < 1;
  // the shot: set and dip from "free", release, the ball through the ring 8 frames after "throw"
  const rel = t.free + 2;
  const inAt = t.throw + 8;
  const dip = f < rel ? prog(f, t.free - 6, 8, ease.out) : 1 - prog(f, rel, 6, ease.out);
  const up = prog(f, t.free - 6, 8, ease.out);
  const pose: RulebookAwayFoulPose = {
    walk: walking ? (walkT * 5.5) % 1 : -1,
    armL: lerp(walking ? 20 : 14, 168, up),
    armR: lerp(walking ? 20 : 30, 172, up),
    bendL: lerp(10, -18, up),
    bendR: lerp(f < t.now ? 45 + 25 * Math.sin(f / 4) : 20, -10, up),
    dip: dip * up,
  };
  // the ball
  let ball: [number, number, number];
  let spin = f * 6;
  if (f < rel) {
    if (up > 0.01) {
      ball = [at[0] - 0.1, at[1] - 0.3, lerp(3.2, 8.7, up)];
    } else {
      // dribbling at his right side: down hard, up into the hand, one bounce every 22 frames
      const ph = ((f - t.in) % 22) / 22;
      const z = 3.2 * Math.abs(Math.cos(ph * Math.PI));
      ball = [at[0] - 0.95, at[1] - 0.2, 0.39 + z * 0.9];
      spin = f * 4;
    }
  } else if (f < inAt) {
    // the flight: release over his head, an arc peaking 4.5 ft above the ring, dropping through its centre
    const u = prog(f, rel, inAt - rel, ease.linear);
    const x0 = at[0] - 0.1, y0 = at[1] - 0.3;
    const z = lerp(8.7, 10.2, u) + 4.5 * 4 * u * (1 - u);
    ball = [lerp(x0, 0, u), lerp(y0, 0.1, u), z];
    spin = -f * 9;
  } else {
    // through the net, down to the boards, then out to the sideline at the free throw line extended, two bounces
    const down = prog(f, inAt, 10, ease.in);
    const outStart = inAt + 10;
    const u = prog(f, outStart, t.ballB - outStart, ease.out);
    const bx = lerp(0.05, RBAF_SIDE[0], u), by = lerp(0.3, RBAF_SIDE[1], u);
    const hop = u < 1 ? Math.abs(Math.sin(u * Math.PI * 2)) * (1 - u) * 4.5 : 0;
    const settle = f > t.ballB ? Math.abs(Math.sin((f - t.ballB) * 0.5)) * 0.5 * Math.exp(-(f - t.ballB) / 6) : 0;
    ball = [bx, by, f < outStart ? lerp(10, 0.39, down) : 0.39 + hop + settle];
    spin = -f * 7;
  }
  return { at, pose, ball, spin };
}

export const RulebookAwayFoul: React.FC = () => {
  const { f } = useScene();
  const t = useRulebookAwayFoulTimes();

  // the book
  const bookIn = arrive(f, t.in, 16);
  const open = prog(f, t.league - 6, t.changed - (t.league - 6), ease.inOut);
  const strip = prog(f, t.rulesEnd - 2, t.so + 4 - (t.rulesEnd - 2), ease.out);
  const win = prog(f, t.so - 4, t.grabbing + 6 - (t.so - 4), ease.inOut);
  const marks = {
    head: prog(f, t.rules + 2, 12, ease.inOut),
    grab: prog(f, t.grabbing + 2, 10, ease.inOut),
    away: prog(f, t.away - 2, 16, ease.inOut),
    any: prog(f, t.any - 3, 12, ease.inOut),
    one: prog(f, t.now, t.team + 4 - t.now, ease.inOut),
    side: prog(f, t.and, t.ballB + 2 - t.and, ease.inOut),
  };
  const cam = rulebookAwayFoulDocCam(t, f);
  // the clip: the whole stage while it is a book, the reading window once the court is up
  const clip = {
    x: lerp(BAND.x, WIN.x, win), y: lerp(BAND.y, WIN.y, win), w: lerp(BAND.w, WIN.w, win), h: lerp(BAND.h, WIN.h, win), r: lerp(BAND.r, WIN.r, win),
  };
  const coverTilt = (1 - bookIn) * -8 + (1 - open) * 2.5 * (1 - win);
  const bookY = (1 - bookIn) * 520;
  const page = f >= t.now - 2 ? "p. 49" : f >= t.so ? "p. 18" : "p. 49";

  // the court
  const courtIn = prog(f, t.so - 4, 18, ease.out);
  const P = pcProjector(rulebookAwayFoulCourtCam(t, f));
  const g = rulebookAwayFoulGuard(t, f);
  const clamp = t.grabbing + 2;
  const yankF = f - t.guy;
  const yank = yankF >= 0 && yankF < 18 ? Math.sin((yankF / 18) * Math.PI) : 0;
  const release = prog(f, t.now + 4, 10, ease.in);
  const grip = prog(f, t.grabbing - 6, 8, ease.out) * (1 - release);
  const joltK = f >= clamp ? Math.exp(-(f - clamp) / 5) : 0;
  const jolt: [number, number] = [
    Math.sin((f - clamp) * 2.1) * 10 * joltK + 9 * yank,
    Math.cos((f - clamp) * 2.7) * 5 * joltK,
  ];
  const ballToShaq = Math.hypot(RBAF_GUARD[0] - 0.9 - (RBAF_SHAQ[0] + 0.9), RBAF_GUARD[1] + 0.1 - (RBAF_SHAQ[1] + 0.6));
  const hair = prog(f, t.from - 2, t.ballAEnd - (t.from - 2), ease.inOut);
  const inAt = t.throw + 8;
  const st: RulebookAwayFoulCourtState = {
    f,
    guard: g.at,
    guardPose: g.pose,
    ball: g.ball,
    ballSpin: g.spin,
    grip,
    yank,
    hit: f >= clamp && f < t.now + 8 ? f - clamp : -1,
    zone: prog(f, t.away, 10, ease.back),
    zoneOff: prog(f, t.now + 4, 16, ease.out) * 0.75,
    hair: hair * (1 - prog(f, t.now, 10, ease.out)),
    dist: ballToShaq * prog(f, t.from - 2, t.ballAEnd - (t.from - 2), ease.out),
    net: f >= inAt ? Math.exp(-(f - inAt) / 14) * Math.sin((f - inAt) * 0.6) : 0,
    plus: f >= inAt ? prog(f, inAt, 14, ease.out) : -1,
    label: prog(f, t.ballB, 10, ease.out),
    jolt,
    credit: courtIn * 0.9,
  };

  // the scorebug: 2:00, then under it in red, the period rolling 1ST -> 4TH
  const bugIn = prog(f, t.late - 4, 12, ease.out);
  const q = t.quarter;
  const steps = [q, q + 9, q + 18];
  let period = 1;
  for (const s0 of steps) period += prog(f, s0, 5, ease.inOut);
  const lastRoll = steps.filter((s0) => f >= s0).pop();
  let clock = f < t.any ? 120 : 119;
  let red = prog(f, t.any, 4, ease.out);
  if (lastRoll !== undefined && f < lastRoll + 4) {
    clock = 120;
    red = 0;
  } else if (lastRoll !== undefined) {
    red = prog(f, lastRoll + 4, 3, ease.out);
    clock = 119;
  }
  if (f > t.now) clock = 119 - Math.min(1, Math.floor((f - t.now) / 60));

  return (
    <AbsoluteFill>
      {/* the court, rising into the middle of the stage */}
      {courtIn > 0.001 && (
        <AbsoluteFill
          style={{
            opacity: Math.min(1, courtIn * 2),
            transform: `translateY(${((1 - courtIn) * 320).toFixed(1)}px)`,
            filter: courtIn < 1 ? `blur(${((1 - courtIn) * 10).toFixed(2)}px)` : undefined,
            WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 792px, #000 836px, #000 1470px, rgba(0,0,0,0) 1700px)",
          }}
        >
          <RulebookAwayFoulCourt P={P} st={st} />
        </AbsoluteFill>
      )}
      {/* the scorebug under the court */}
      {bugIn > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: 540 - 380 * 0.74,
            top: 1366,
            transformOrigin: "0 0",
            transform: `translateY(${((1 - bugIn) * 60).toFixed(1)}px) scale(0.74)`,
            opacity: bugIn,
            filter: bugIn < 1 ? `blur(${((1 - bugIn) * 8).toFixed(2)}px)` : undefined,
          }}
        >
          <RulebookAwayFoulBug period={period} clock={clock} red={red} sweep={prog(f, t.late, 24, ease.inOut)} lalGlow={prog(f, t.ballB, 6, ease.out) * (1 - 0.5 * prog(f, t.ballB + 10, 20))} />
        </div>
      )}
      {/* the book, then the reading window */}
      <div
        style={{
          position: "absolute",
          left: clip.x,
          top: clip.y,
          width: clip.w,
          height: clip.h,
          borderRadius: clip.r,
          overflow: "hidden",
          boxShadow: win > 0.5 ? `0 0 0 1px rgba(48,54,61,${win.toFixed(2)}), 0 24px 60px rgba(0,0,0,${(0.5 * win).toFixed(2)})` : undefined,
          transform: `translateY(${bookY.toFixed(1)}px)`,
          opacity: Math.min(1, bookIn * 1.6),
          perspective: 5200,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: cam.ax - clip.x - cam.wx * cam.z,
            top: cam.ay - clip.y - cam.wy * cam.z,
            width: RBAF_PAGE.w,
            height: RBAF_PAGE.h,
            transformOrigin: "0 0",
            transform: `scale(${cam.z.toFixed(5)}) rotate(${coverTilt.toFixed(3)}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <RulebookAwayFoulBook marks={marks} open={open} strip={strip} win={win} />
        </div>
      </div>
      {/* the source, under the window */}
      <div style={{ position: "absolute", right: WIN.x + 6, top: WIN.y + WIN.h + 8, fontFamily: "Inter, sans-serif", fontSize: 22, color: "#8B949E", opacity: win }}>
        NBA Official Rules 2025-26, {page}
      </div>
    </AbsoluteFill>
  );
};
