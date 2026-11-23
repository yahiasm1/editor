// Hook X4, dark, 0-5.30 s: "Wembanyama's fifty points aren't the scary number. The scary number is twenty-nine."
// "Twenty-nine shots at once." One true-geometry world in feet, one camera. It opens low behind the glass: the
// stanchion arm, the glass, the shot clock box, the orange rim and net, the court beyond with a gold disc (a chance)
// on each of his 29 real spots and a ball resting on each; the Onoguchi card left, the Spurs logo bare top right; a
// thin gold stack on the shot clock with a white scoreboard 50 counting on it, a ball already falling at the rim.
// 50: the ball swishes, a disc drops onto the stack, the 50 lands. points: its white trail fades on the rim.
// aren't: the camera rises over the rim, looking down the court. scary: every ball lifts a hair and hangs (the
// silence; the camera swings high round to look back at the basket). The scary number is: they rise and spin up, dip,
// and all 29 fire at the same instant from their real spots. 29: they hit one rim on the same frame: 20 pour through
// and the net whips, 9 clang off the iron and fly away grey, the glass shudders, the shot clock flickers; the camera
// drops overhead, the arcs collapse onto the floor into Basketball-Reference's marks and the 29 lands at the top.
// The last frame is `answer`'s first (keep = true).
// Parts: HookX4Data (the 29 shots), HookX4World (camera, projection, floor homography), HookX4Parts (ball, disc,
// basket), HookX4Court (the court, `answer`'s geometry and look).
import React from "react";
import { Img, staticFile } from "remotion";
import { countTo, ease, prog, useScene } from "../../../src/engine";
import { HOOKX4_SHOTS } from "./HookX4Data";
import { HookX4Court, type HookX4Mark } from "./HookX4Court";
import {
  HK4,
  hookX4FloorMatrix,
  hookX4Lerp as lerp,
  hookX4Lerp3 as lerp3,
  hookX4Path,
  hookX4Projector,
  hookX4Rnd as rnd,
  hookX4Spot,
  type HookX4Cam,
  type HookX4Proj,
  type HookX4V3,
} from "./HookX4World";
import { HookX4Ball, HookX4Beam, HookX4Box, HookX4Clock, HookX4Defs, HookX4Disc, HookX4Glass, HookX4Net, HookX4Rim, HookX4Shadow, type HookX4BallState } from "./HookX4Parts";

const asset = (n: string) => staticFile(`wemby-50/${n}`);
const deg = Math.PI / 180;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const G = 0.016; // ft per frame^2: gravity, a little quicker than life so the fall reads inside the hook
const K = 32; // px per ft the perspective court is drawn at (crisp when the floor is close)
const AP = HK4.apron;

type T = ReturnType<typeof useHookX4T>;
function useHookX4T() {
  const { cue, scene } = useScene();
  const n29 = cue("29");
  const number2 = cue("number", 2);
  return {
    wemb: cue("Wembanyama's"),
    fifty: cue("50"),
    points: cue("points"),
    arent: cue("aren't"),
    scary: cue("scary"),
    number: cue("number"),
    the: cue("The"),
    scary2: cue("scary", 2),
    number2,
    is: cue("is"),
    hit: n29,
    launch: number2 + 8,
    swish: cue("50") - 6,
    settle: n29 + 30,
    end: scene.to,
  };
}

// ---- the camera: behind the glass -> over the rim -> high round the court -> straight overhead ----
const O: HookX4V3 = [0, 0, 14];
const RHO = 13;
const FINAL: HookX4Cam = { pos: [0, 70, 23.5], a: Math.PI, phi: 90 * deg, foc: 70 * HK4.ppf, cx: 540, cy: HK4.courtY + 23.5 * HK4.ppf };
function camAt(f: number, t: T): HookX4Cam {
  const io = ease.inOut;
  const c0: HookX4Cam = { pos: lerp3([3.0, 12.4, -9.0], [2.7, 12.2, -7.8], prog(f, 0, t.arent, ease.linear)), a: -12 * deg, phi: 10 * deg, foc: 900, cx: 540, cy: 1080 };
  if (f < t.arent) return c0;
  const up = t.arent + 58;
  const c1: HookX4Cam = { pos: [0, 26, O[2] - RHO], a: 0, phi: 60 * deg, foc: 840, cx: 540, cy: 1000 };
  if (f < up) {
    const k = prog(f, t.arent, up - t.arent, io);
    // rise first, then forward: over the top of the glass, not through it
    const ky = prog(f, t.arent, (up - t.arent) * 0.8, io);
    return { pos: [lerp(c0.pos[0], 0, k), lerp(c0.pos[1], c1.pos[1], ky), lerp(c0.pos[2], c1.pos[2], k)], a: lerp(c0.a, 0, k), phi: lerp(c0.phi, c1.phi, k), foc: lerp(c0.foc, c1.foc, k), cx: 540, cy: lerp(c0.cy, c1.cy, k) };
  }
  const orbEnd = t.launch - 6;
  const orbit = (k: number): HookX4Cam => {
    const a = Math.PI * io(k);
    const h = lerp(26, 34, k);
    return { pos: [O[0] - RHO * Math.sin(a), h, O[2] - RHO * Math.cos(a)], a, phi: lerp(60, 66, k) * deg, foc: lerp(840, 740, k), cx: 540, cy: lerp(1000, 1020, k) };
  };
  if (f < orbEnd) return orbit(prog(f, up, orbEnd - up, ease.linear));
  const c2 = orbit(1);
  const c3: HookX4Cam = { pos: [0, 21, 20], a: Math.PI, phi: 50 * deg, foc: 820, cx: 540, cy: 1060 };
  if (f < t.hit) {
    const k = prog(f, orbEnd, t.hit - orbEnd, ease.linear);
    return { pos: lerp3(c2.pos, c3.pos, k), a: Math.PI, phi: lerp(c2.phi, c3.phi, k), foc: lerp(c2.foc, c3.foc, k), cx: 540, cy: lerp(c2.cy, c3.cy, k) };
  }
  const k = prog(f, t.hit + 1, 27, io);
  if (k >= 1) return FINAL;
  return { pos: lerp3(c3.pos, FINAL.pos, k), a: Math.PI, phi: lerp(c3.phi, FINAL.phi, k), foc: lerp(c3.foc, FINAL.foc, k), cx: 540, cy: lerp(c3.cy, FINAL.cy, k) };
}

// ---- the 29 shots: rest on their discs, lift, fire together, hit the rim on one frame ----
const RIM_TOP: HookX4V3 = [0, HK4.rimY + 0.45, HK4.rimZ];
const SHOTS = HOOKX4_SHOTS.map((s, i) => {
  const spot = hookX4Spot(s.x, s.y);
  const dist = Math.hypot(s.x, s.y);
  const a = rnd(i, 1) * Math.PI * 2;
  // where each ball meets the pile over the rim: makes stacked over the hole, misses on the iron
  const rr = s.made ? 0.45 * Math.sqrt(rnd(i, 2)) : 0.75 + 0.35 * rnd(i, 2);
  const tg: HookX4V3 = [RIM_TOP[0] + rr * Math.cos(a), RIM_TOP[1] + (s.made ? 1.9 * rnd(i, 3) : 0.55 * rnd(i, 3)), RIM_TOP[2] + rr * Math.sin(a)];
  return { ...s, spot, dist, tg, apex: 3.2 + 0.36 * dist, tilt: rnd(i, 4) * 6, axis0: [Math.cos(a), 0, Math.sin(a)] as HookX4V3 };
});
// the makes pour through the ring lowest first; the misses fly out from where they hit the iron
const POUR: number[] = (() => {
  const made = SHOTS.map((s, i) => ({ s, i })).filter((o) => o.s.made).sort((a, b) => a.s.tg[1] - b.s.tg[1]);
  const out: number[] = [];
  made.forEach((o, k) => (out[o.i] = k));
  return out;
})();
// order the marks land in: nearest the rim first
const MARK_ORDER: number[] = (() => {
  const idx = SHOTS.map((s, i) => ({ d: s.dist, i })).sort((a, b) => a.d - b.d);
  const out: number[] = [];
  idx.forEach((o, k) => (out[o.i] = k));
  return out;
})();

const restY = HK4.discH + HK4.ballR;
function liftAt(f: number, t: T, i: number) {
  if (f < t.scary) return 0;
  const bob = 0.07 * Math.sin((f - t.scary) * 0.085 + i * 1.7) * prog(f, t.scary, 20);
  return 0.3 * prog(f, t.scary, 14, ease.out) + 0.8 * prog(f, t.the, 26, ease.inOut) - 0.35 * prog(f, t.number2 - 2, 9, ease.inOut) + bob;
}

/** the ball of shot i at frame f, and the arc it has flown so far */
function shotBall(f: number, t: T, i: number): { b: HookX4BallState; flight: number; after: number } {
  const s = SHOTS[i];
  const T0 = t.launch;
  const dur = t.hit - T0;
  const startP: HookX4V3 = [s.spot[0], restY + liftAt(T0, t, i), s.spot[2]];
  const spinRest = f < t.scary2 ? 0.02 * (f - t.scary) * prog(f, t.scary, 30) : 0.02 * (t.scary2 - t.scary) + 0.12 * prog(f, t.scary2, 20) * (f - t.scary2);
  if (f < T0) {
    return { b: { p: [s.spot[0], restY + liftAt(f, t, i), s.spot[2]], spin: Math.max(0, spinRest), axis: [0, 1, 0], tilt: s.tilt, grey: 0, o: 1 }, flight: 0, after: -1 };
  }
  if (f < t.hit) {
    const k = (f - T0) / dur;
    return { b: { p: arcAt(startP, s.tg, s.apex, k), spin: k * 10 + spinRest, axis: s.axis0, tilt: s.tilt, grey: 0, o: 1 }, flight: k, after: -1 };
  }
  const g = f - t.hit;
  if (s.made) {
    const delay = POUR[i] * 0.55;
    const tt = Math.max(0, g - delay);
    const k = clamp01(tt / 5);
    const jx = (rnd(i, 7) - 0.5) * 0.3;
    const jz = (rnd(i, 8) - 0.5) * 0.3;
    const press = g < delay ? 0.25 * Math.min(1, g / 3) : 0;
    const y = s.tg[1] - press - 0.12 * tt - 0.5 * G * tt * tt;
    const p: HookX4V3 = [lerp(s.tg[0], RIM_TOP[0] + jx, k), y, lerp(s.tg[2], RIM_TOP[2] + jz, k)];
    return { b: { p, spin: 10 + tt * 0.08, axis: s.axis0, tilt: s.tilt, grey: 0, o: 1 - prog(f, t.hit + delay + 20, 8, ease.linear), squash: g < 3 ? 0.12 * (1 - g / 3) : 0 }, flight: 1, after: g };
  }
  // a miss: off the iron and away from the rim, turning grey
  let dx = s.tg[0] - RIM_TOP[0];
  let dz = s.tg[2] - RIM_TOP[2];
  const L = Math.hypot(dx, dz) || 1;
  dx /= L;
  dz /= L;
  const vh = 0.3 + 0.14 * rnd(i, 9);
  const vy = 0.2 + 0.1 * rnd(i, 10);
  const p: HookX4V3 = [s.tg[0] + dx * vh * g, s.tg[1] + vy * g - 0.5 * G * g * g, s.tg[2] + dz * vh * g];
  return { b: { p, spin: 10 - g * 0.15, axis: [dz, 0, -dx], tilt: s.tilt, grey: prog(f, t.hit + 1, 9), o: 1 - prog(f, t.hit + 14, 12, ease.linear), squash: g < 3 ? 0.16 * (1 - g / 3) : 0 }, flight: 1, after: g };
}

/** a projectile from a to b with an apex this many feet above the straight line: horizontal speed constant */
function arcAt(a: HookX4V3, b: HookX4V3, apex: number, k: number): HookX4V3 {
  const p = lerp3(a, b, k);
  return [p[0], p[1] + apex * 4 * k * (1 - k), p[2]];
}

// ---- the opening make: already falling at the rim on frame 0, through on "50" ----
const OPEN_FROM: HookX4V3 = [-2.6, 7.4, 27];
const OPEN_TO: HookX4V3 = [0, HK4.rimY + 0.2, HK4.rimZ];
function openBall(f: number, t: T): { p: HookX4V3; k: number; after: number; o: number } {
  const dur = 80;
  const k = (f - (t.swish - dur)) / dur;
  if (k < 1) return { p: arcAt(OPEN_FROM, OPEN_TO, 6, k), k, after: -1, o: 1 };
  const tt = f - t.swish;
  const v0 = 0.15;
  const tFloor = (-v0 + Math.sqrt(v0 * v0 + 2 * G * (OPEN_TO[1] - HK4.ballR))) / G;
  let y: number;
  if (tt < tFloor) y = OPEN_TO[1] - v0 * tt - 0.5 * G * tt * tt;
  else {
    const vb = 0.5 * (v0 + G * tFloor);
    const u = tt - tFloor;
    y = Math.max(HK4.ballR, HK4.ballR + vb * u - 0.5 * G * u * u);
  }
  return { p: [0.1, y, HK4.rimZ - 0.035 * tt], k: 1, after: tt, o: 1 - prog(f, t.arent + 6, 12, ease.linear) };
}

// ---- the hoop's shudder and the net's whip ----
function hoopShake(f: number, t: T) {
  const g = f - t.hit;
  if (g < 0) return { dx: 0, dy: 0 };
  return { dx: 0.11 * Math.exp(-g / 7) * Math.sin(g * 1.9), dy: 0.05 * Math.exp(-g / 6) * Math.sin(g * 2.6 + 1) };
}
function netPull(f: number, t: T) {
  const kick = (g: number, amp: number, decay: number) => (g < 0 ? 0 : amp * (1 - Math.exp(-g / 1.6)) * Math.exp(-g / decay) * (1 + 0.35 * Math.sin(g * 0.9)));
  return kick(f - t.swish, 0.7, 9) + kick(f - t.hit - 2, 1.5, 12);
}

// ---- the scene ----
export const HookX4: React.FC & { keep?: boolean } = () => {
  const { f, ground } = useScene();
  const t = useHookX4T();
  const cam = camAt(f, t);
  // the impact kicks the camera
  const g = f - t.hit;
  const kick = g >= 0 ? 9 * Math.exp(-g / 5) * Math.sin(g * 2.1) : 0;
  const view: HookX4Cam = { ...cam, cy: cam.cy + kick, cx: cam.cx + kick * 0.4 };
  const pr = hookX4Projector(view);
  const settled = f >= t.settle;
  const flatO = prog(f, t.settle - 8, 6, ease.linear);
  const bgO = 1 - prog(f, t.settle - 2, 6, ease.linear);

  // marks: the arcs collapse onto the floor and each lands as BBR's glyph
  const marks: HookX4Mark[] = SHOTS.map((_, i) => {
    const at = t.hit + 13 + MARK_ORDER[i] * 0.3;
    if (f < at) return { lit: 0, ping: -1 };
    return { lit: 1, ping: -1, scale: 1 + 0.4 * (1 - prog(f, at, 7, ease.out)) };
  });

  const floorM = hookX4FloorMatrix(view, 25 + AP, -1 / K, -AP, 1 / K);
  const GRID_L = 540 - 45 * HK4.ppf;
  const GRID_T = 620;
  const gridM = hookX4FloorMatrix(view, (540 - GRID_L) / HK4.ppf, -1 / HK4.ppf, (GRID_T - HK4.courtY) / HK4.ppf, 1 / HK4.ppf);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <HookX4Defs />
      </svg>
      {bgO > 0 && <div style={{ position: "absolute", inset: 0, background: ground.bg, opacity: bgO }} />}
      {!settled && (
        <div
          style={{
            position: "absolute", inset: 0, opacity: 1 - flatO,
            WebkitMaskImage: "linear-gradient(180deg, transparent 0px, transparent 470px, #000 590px, #000 1560px, transparent 1760px)",
            maskImage: "linear-gradient(180deg, transparent 0px, transparent 470px, #000 590px, #000 1560px, transparent 1760px)",
          }}
        >
          {/* the ground's own grid, laid on the floor plane (on the engine grid's phase, so it lands on it) */}
          <div
            style={{
              position: "absolute", left: 0, top: 0, width: 90 * HK4.ppf, height: 75 * HK4.ppf, transformOrigin: "0 0", transform: gridM,
              backgroundImage: `linear-gradient(${ground.grid} 1px, transparent 1px), linear-gradient(90deg, ${ground.grid} 1px, transparent 1px)`,
              backgroundSize: "60px 60px", backgroundPosition: `${(((30 - GRID_L) % 60) + 60) % 60}px 0px`,
            }}
          />
          {/* the court, the same one `answer` uses, lying on the floor under this camera */}
          <HookX4Court r={{ x: AP * K, y: AP * K, w: 50 * K }} marks={marks} f={f} style={{ transformOrigin: "0 0", transform: floorM }} />
          <HookX4LightPool pr={pr} f={f} t={t} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <HookX4World pr={pr} f={f} t={t} />
          </svg>
        </div>
      )}
      {/* the hand-off: `answer`'s court, flat, exactly where it starts */}
      {flatO > 0 && <HookX4Court r={{ x: HK4.courtX, y: HK4.courtY, w: 50 * HK4.ppf }} marks={marks} f={f} opacity={flatO} />}
      <HookX4Card f={f} t={t} />
      <HookX4Logo f={f} t={t} />
      <HookX4Fifty pr={pr} f={f} t={t} />
      <HookX4TwentyNine f={f} t={t} />
    </div>
  );
};
HookX4.keep = true;

/** the arena light over the basket: a warm pool on the boards */
const HookX4LightPool: React.FC<{ pr: HookX4Proj; f: number; t: T }> = ({ pr, f, t }) => {
  const o = 1 - prog(f, t.hit + 4, 18);
  if (o <= 0) return null;
  const c = pr.P([0, 0, 12]);
  const e = pr.P([12, 0, 12]);
  const n = pr.P([0, 0, 26]);
  const rx = Math.hypot(e.x - c.x, e.y - c.y) * 1.6;
  const ry = Math.hypot(n.x - c.x, n.y - c.y) * 1.3;
  return <div style={{ position: "absolute", left: c.x - rx, top: c.y - ry, width: rx * 2, height: ry * 2, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,238,205,0.12), rgba(255,238,205,0.04) 45%, transparent 70%)", opacity: o, mixBlendMode: "screen" }} />;
};

/** everything standing in the world, painted far to near */
const HookX4World: React.FC<{ pr: HookX4Proj; f: number; t: T }> = ({ pr, f, t }) => {
  const g = f - t.hit;
  const sh = hoopShake(f, t);
  const hoopO = 1 - prog(f, t.hit + 12, 14, ease.linear);
  const items: { d: number; node: React.ReactNode }[] = [];
  const balls = SHOTS.map((_, i) => shotBall(f, t, i));

  // the discs, on the floor, far to near
  const discs = SHOTS.map((s, i) => {
    const glint = Math.max(0, 1 - Math.abs(f - (t.number + MARK_ORDER[i] * 1.1)) / 6);
    const spentK = prog(f, t.launch, 10);
    const goneK = prog(f, t.hit + 9 + MARK_ORDER[i] * 0.3, 12, ease.inOut);
    return { d: pr.depth(s.spot), i, glint, spentK, goneK };
  }).sort((a, b) => b.d - a.d);

  // the arcs: each flight's white (made) or grey (missed) line, collapsing onto its spot after the hit
  const collapse = prog(f, t.hit + 4, 16, ease.inOut);
  const arcs: React.ReactNode[] = [];
  if (f >= t.launch && collapse < 1) {
    SHOTS.forEach((s, i) => {
      const fl = balls[i].flight;
      const startP: HookX4V3 = [s.spot[0], restY + liftAt(t.launch, t, i), s.spot[2]];
      const floor: HookX4V3 = [s.spot[0], 0.02, s.spot[2]];
      const head = f < t.hit ? fl : 1;
      const tail = f < t.hit ? Math.max(0, fl - 0.55) : 0;
      const n = 42;
      const pts = Array.from({ length: n + 1 }, (_, j) => {
        const k = tail + ((head - tail) * j) / n;
        const p = lerp3(arcAt(startP, s.tg, s.apex, k), floor, collapse);
        return pr.P(p);
      });
      const col = s.made ? "#FFFFFF" : "#AEB6BF";
      const base = f < t.hit ? 0.55 : 0.5 * (1 - collapse * 0.5);
      // three passes: the tail fades out behind the ball
      [0, 1, 2].forEach((seg) => {
        const a = Math.floor((seg * n) / 3);
        const b = Math.floor(((seg + 1) * n) / 3);
        arcs.push(<path key={`${i}-${seg}`} d={hookX4Path(pts.slice(a, b + 1), false)} fill="none" stroke={col} strokeOpacity={base * (f < t.hit ? 0.35 + 0.33 * seg : 1)} strokeWidth={Math.max(1.4, 2.6 * (1 - collapse * 0.4))} strokeLinecap="round" />);
      });
    });
  }

  // balls
  balls.forEach((bs, i) => {
    items.push({ d: pr.depth(bs.b.p), node: <HookX4Ball key={`b${i}`} pr={pr} b={bs.b} id={i} /> });
  });
  // the opening make
  const ob = openBall(f, t);
  if (ob.o > 0) items.push({ d: pr.depth(ob.p), node: <HookX4Ball key="open" pr={pr} b={{ p: ob.p, spin: f * 0.09, axis: [1, 0, 0], tilt: 1.1, grey: 0, o: ob.o }} id={99} /> });

  // the basket, piece by piece
  if (hoopO > 0) {
    const dx = sh.dx;
    const dy = sh.dy;
    items.push({ d: pr.depth([0, 4, -5]), node: <g key="stanchion" opacity={hoopO}><HookX4Stanchion pr={pr} dx={dx} dy={dy} /></g> });
    items.push({ d: pr.depth([0, 11.25, HK4.boardZ]), node: <g key="glass" opacity={hoopO}><HookX4Glass pr={pr} dx={dx} dy={dy} sheen={prog(f, 0, 330, ease.linear)} /></g> });
    const flick = g >= 0 && g < 16 && [1, 2, 5, 6, 9, 12].includes(Math.floor(g)) ? 0.15 : 1;
    items.push({ d: pr.depth([0, 13.9, HK4.boardZ]), node: <g key="clock" opacity={hoopO}><HookX4Clock pr={pr} dx={dx} dy={dy} lit={flick} /></g> });
    items.push({ d: pr.depth([0, 9.2, HK4.rimZ]) + 0.01, node: <g key="net" opacity={hoopO}><HookX4Net pr={pr} dx={dx} dy={dy} pull={netPull(f, t)} sway={0.12 * Math.sin(f * 0.07) + (g >= 0 ? 0.35 * Math.exp(-g / 8) * Math.sin(g * 1.3) : 0)} /></g> });
    items.push({ d: pr.depth([0, HK4.rimY, HK4.rimZ]), node: <g key="rim" opacity={hoopO}><HookX4Rim pr={pr} dx={dx} dy={dy} /></g> });
    items.push({ d: pr.depth([0, 14.6, HK4.boardZ]) - 0.02, node: <g key="stack" opacity={hoopO * (1 - prog(f, t.arent + 10, 30))}><HookX4Stack pr={pr} f={f} t={t} dx={dx} dy={dy} /></g> });
  }
  items.sort((a, b) => b.d - a.d);

  // the impact: a white burst at the ring and a flash on the glass
  const burst = g >= 0 && g < 14 ? (
    (() => {
      const c = pr.P([0, HK4.rimY + 0.6, HK4.rimZ]);
      const k = g / 14;
      return <circle cx={c.x} cy={c.y} r={c.s * (1 + 6 * k)} fill="none" stroke="#FFFFFF" strokeOpacity={0.6 * (1 - k)} strokeWidth={3 * (1 - k) + 0.5} />;
    })()
  ) : null;

  return (
    <g>
      {/* shadows of the balls on the boards or their discs */}
      {balls.map((bs, i) => {
        const s = SHOTS[i];
        const onDisc = f < t.launch;
        const h = Math.max(0, bs.b.p[1] - (onDisc ? restY : HK4.ballR));
        const at: HookX4V3 = onDisc ? [s.spot[0], HK4.discH + 0.005, s.spot[2]] : [bs.b.p[0], 0.005, bs.b.p[2]];
        if (!onDisc) return null;
        return <HookX4Shadow key={`s${i}`} pr={pr} at={at} r={HK4.ballR * (0.9 + 0.15 * h)} o={0.55 * Math.exp(-h / 1.4) * bs.b.o} />;
      })}
      {discs.map(({ i, glint, spentK, goneK }) => (
        <HookX4Disc key={`d${i}`} pr={pr} at={SHOTS[i].spot} glint={glint} spent={spentK} scale={1 - 0.3 * goneK} o={1 - goneK} />
      ))}
      {arcs}
      {items.map((it, k) => (
        <React.Fragment key={k}>{it.node}</React.Fragment>
      ))}
      {burst}
      {/* the opening make's trail through the ring, fading on "points" */}
      <HookX4OpenTrail pr={pr} f={f} t={t} />
    </g>
  );
};

const HookX4OpenTrail: React.FC<{ pr: HookX4Proj; f: number; t: T }> = ({ pr, f, t }) => {
  const ob = openBall(f, t);
  const o = 1 - prog(f, t.points, 20);
  if (o <= 0) return null;
  const head = ob.k;
  const tail = Math.max(0, Math.min(head, 1) - 0.5);
  const n = 18;
  const pts = Array.from({ length: n + 1 }, (_, j) => pr.P(arcAt(OPEN_FROM, OPEN_TO, 6, tail + ((Math.min(head, 1) - tail) * j) / n)));
  // after the swish the trail runs straight down through the net
  if (ob.after >= 0) pts.push(pr.P([0.1, Math.max(ob.p[1], HK4.rimY - 1.6), HK4.rimZ]));
  return (
    <g opacity={o}>
      <path d={hookX4Path(pts, false)} fill="none" stroke="#FFFFFF" strokeOpacity={0.22} strokeWidth={9} strokeLinecap="round" filter="url(#hk4-soft)" />
      <path d={hookX4Path(pts, false)} fill="none" stroke="#FFFFFF" strokeOpacity={0.8} strokeWidth={2.6} strokeLinecap="round" />
    </g>
  );
};

/** the stanchion: the padded base behind the baseline and the arm reaching up to the glass */
const HookX4Stanchion: React.FC<{ pr: HookX4Proj; dx: number; dy: number }> = ({ pr, dx, dy }) => (
  <g>
    <HookX4Box pr={pr} lo={[-2.2, 0, -9.5]} hi={[2.2, 3.4, -4.6]} top="#1B1F26" side="#0C0E11" front="#111419" edge="#262B33" />
    <HookX4Beam pr={pr} a={[0, 3.2, -5.2]} b={[dx, 10.75 + dy, 2.6]} t={0.8} fill="#14171C" hi="#4A525E" />
    <HookX4Beam pr={pr} a={[dx, 10.75 + dy, 2.4]} b={[dx, 10.75 + dy, HK4.boardZ - 0.05]} t={0.8} fill="#1A1E24" hi="#5A636F" />
    <HookX4Beam pr={pr} a={[dx - 1.6, 11.6 + dy, HK4.boardZ - 0.1]} b={[dx, 10.75 + dy, 3.0]} t={0.22} fill="#2A3038" />
    <HookX4Beam pr={pr} a={[dx + 1.6, 11.6 + dy, HK4.boardZ - 0.1]} b={[dx, 10.75 + dy, 3.0]} t={0.22} fill="#2A3038" />
  </g>
);

/** the thin gold stack on top of the shot clock: the chances under the points */
const STACK_N = 3;
const HookX4Stack: React.FC<{ pr: HookX4Proj; f: number; t: T; dx: number; dy: number }> = ({ pr, f, t, dx, dy }) => {
  const base = HK4.boardTop + 0.05 + 1.35 + dy;
  const land = t.fifty - 3;
  const fall = prog(f, land - 14, 14, (n) => n * n);
  const bounce = f >= land ? 0.35 * Math.exp(-(f - land) / 3) * Math.abs(Math.sin((f - land) * 0.9)) : 0;
  const jig = (j: number) => (f >= land ? 0.04 * Math.exp(-(f - land) / 4) * Math.sin((f - land) * 1.4 + j) : 0);
  return (
    <g>
      {Array.from({ length: STACK_N }, (_, j) => (
        <HookX4Disc key={j} pr={pr} at={[dx + jig(j) + (rnd(j, 30) - 0.5) * 0.08, base + j * HK4.discH, HK4.boardZ + (rnd(j, 31) - 0.5) * 0.08]} />
      ))}
      {f >= land - 14 && <HookX4Disc pr={pr} at={[dx, base + STACK_N * HK4.discH + 5 * (1 - fall) + bounce, HK4.boardZ]} />}
    </g>
  );
};
export const hookX4StackTop = (dy = 0) => HK4.boardTop + 0.05 + 1.35 + dy + (STACK_N + 1) * HK4.discH;

/** the scoreboard 50: white LED digits standing on the stack, counting up and landing on "50" */
const HookX4Fifty: React.FC<{ pr: HookX4Proj; f: number; t: T }> = ({ pr, f, t }) => {
  const o = 1 - prog(f, t.arent + 8, 24, ease.linear);
  if (o <= 0) return null;
  const a = pr.P([0, hookX4StackTop() + 0.05, HK4.boardZ]);
  const size = a.s * 1.7;
  const v = Math.round(countTo(f, t.fifty - 40, 40, 0, 50, ease.inOut));
  const pop = f >= t.fifty ? 1 + 0.12 * Math.exp(-(f - t.fifty) / 4) * Math.cos((f - t.fifty) * 0.8) : 1;
  const dots = "radial-gradient(circle, #000 58%, transparent 62%)";
  const pitch = Math.max(4, size / 26);
  return (
    <div style={{ position: "absolute", left: a.x - size, top: a.y - size * 0.96, width: size * 2, height: size, opacity: o, transform: `scale(${pop.toFixed(4)})`, transformOrigin: "50% 100%", filter: `blur(${(4 * prog(f, t.arent + 8, 24)).toFixed(1)}px)` }}>
      <div style={{ position: "absolute", inset: 0, textAlign: "center", fontFamily: "Figtree, sans-serif", fontWeight: 800, fontSize: size, lineHeight: `${size}px`, color: "#FFFFFF", fontVariantNumeric: "tabular-nums", filter: "blur(6px)", opacity: 0.45 }}>{v}</div>
      <div
        style={{
          position: "absolute", inset: 0, textAlign: "center", fontFamily: "Figtree, sans-serif", fontWeight: 800, fontSize: size, lineHeight: `${size}px`, color: "#FFFFFF", fontVariantNumeric: "tabular-nums",
          WebkitMaskImage: dots, maskImage: dots, WebkitMaskSize: `${pitch}px ${pitch}px`, maskSize: `${pitch}px ${pitch}px`,
        }}
      >
        {v}
      </div>
    </div>
  );
};

/** the real Wemby, the creator's way: Onoguchi's photo in a rounded card, the credit top right */
const HookX4Card: React.FC<{ f: number; t: T }> = ({ f, t }) => {
  const out = prog(f, t.arent - 2, 16, ease.in);
  if (out >= 1) return null;
  const lit = prog(f, t.wemb - 4, 14, ease.out);
  const rake = prog(f, t.wemb - 2, 30, ease.inOut);
  const push = 1 + 0.05 * prog(f, 0, t.arent, ease.linear);
  const W = 270;
  const H = 360;
  return (
    <div
      style={{
        position: "absolute", left: 36 - 340 * out, top: 640, width: W, height: H, borderRadius: 20, overflow: "hidden", border: "1px solid #30363D",
        boxShadow: "0 24px 60px rgba(0,0,0,0.6)", background: "#000", transform: `rotate(${(-2 - 6 * out).toFixed(2)}deg)`, opacity: 1 - out * 0.6,
        filter: out > 0.05 ? `blur(${(out * 10).toFixed(1)}px)` : undefined,
      }}
    >
      <Img src={asset("hookx4-onoguchi.jpg")} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${push.toFixed(4)})`, transformOrigin: "50% 45%" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, transparent 18%, transparent 70%, rgba(0,0,0,0.35) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "#05080C", opacity: 0.42 * (1 - lit) }} />
      {rake > 0 && rake < 1 && (
        <div style={{ position: "absolute", left: -W, top: -100, width: W * 0.7, height: H + 200, transform: `translateX(${(rake * W * 2.6).toFixed(1)}px) rotate(16deg)`, background: "linear-gradient(90deg, transparent, rgba(255,250,238,0.32) 50%, transparent)", mixBlendMode: "screen" }} />
      )}
      <div style={{ position: "absolute", right: 12, top: 10, fontFamily: "Inter, sans-serif", fontSize: 19, color: "rgba(255,255,255,0.76)" }}>Daiei Onoguchi, CC BY 4.0</div>
    </div>
  );
};

const HookX4Logo: React.FC<{ f: number; t: T }> = ({ f, t }) => {
  const out = prog(f, t.arent - 2, 14, ease.in);
  if (out >= 1) return null;
  return <Img src={asset("hookx4-spurs.svg")} style={{ position: "absolute", left: 892, top: 592 - 120 * out, width: 132, height: 132, opacity: 1 - out, filter: out > 0.05 ? `blur(${(out * 8).toFixed(1)}px)` : undefined }} />;
};

/** the 29 lands at the top, where `answer` picks it up */
const HookX4TwentyNine: React.FC<{ f: number; t: T }> = ({ f, t }) => {
  const at = t.hit + 8;
  if (f < at) return null;
  const p = prog(f, at, 8, ease.in);
  const g = f - (at + 8);
  const squash = g >= 0 ? 0.07 * Math.exp(-g / 3.5) * Math.cos(g * 0.9) : 0;
  const s = g >= 0 ? 1 - squash : 1.6 - 0.6 * p;
  const blur = g >= 0 ? 0 : (1 - p) * 8;
  const done = f >= t.settle;
  return (
    <div
      style={{
        position: "absolute", left: 540 - 0.6 * 176, top: 530, fontFamily: "Figtree, sans-serif", fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap",
        fontSize: 176, lineHeight: 1, color: "#FFFFFF", opacity: prog(f, at, 4, ease.linear),
        transform: done ? undefined : `translateY(${(g >= 0 ? 0 : -40 * (1 - p)).toFixed(1)}px) scale(${s.toFixed(4)})`, transformOrigin: "50% 60%",
        filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : undefined,
      }}
    >
      29
    </div>
  );
};
