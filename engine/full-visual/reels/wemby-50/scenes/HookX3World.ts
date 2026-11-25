// HookX3's one world, in feet: x to the right as you face the basket from half court (Basketball-Reference's chart),
// y from the baseline toward half court, z up. One pinhole camera; the court, the heap, the 50 and every chance are
// projected through it. Straight overhead at 15.2 px/ft it is `answer`'s court exactly (x 160 / y 700 / w 760).

export type HookX3V = [number, number, number];
export type HookX3Cam = { E: HookX3V; r: HookX3V; u: HookX3V; f: HookX3V; F: number; cx: number; cy: number };

export const HX3_RIM_Y = 5.25;
export const HX3_R = 0.8; // a chance: 1.6 ft across
export const HX3_T = 0.19; // 0.12 of that thick
export const HX3_PPF = 15.2; // `answer`'s court scale
export const HX3_APRON = 2.4;
export const HX3_FT_Y = 19 - 1 / 12; // centre of the free throw line

export const hx3Lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const hx3Clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const hx3Rnd = (i: number, k = 0) => {
  const s = Math.sin(i * 91.37 + k * 47.11 + 13.7) * 43758.5453;
  return s - Math.floor(s);
};
export const hx3Add = (a: HookX3V, b: HookX3V): HookX3V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const hx3Sub = (a: HookX3V, b: HookX3V): HookX3V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const hx3Mul = (a: HookX3V, s: number): HookX3V => [a[0] * s, a[1] * s, a[2] * s];
export const hx3Dot = (a: HookX3V, b: HookX3V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const hx3Cross = (a: HookX3V, b: HookX3V): HookX3V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const hx3Norm = (a: HookX3V): HookX3V => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const G = 32 / 3600; // ft per frame^2
const smooth = (t: number) => t * t * (3 - 2 * t);
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const outC = (t: number) => 1 - Math.pow(1 - t, 3);
const seg = (f: number, a: number, b: number) => hx3Clamp((f - a) / Math.max(1, b - a));

/** camera from a target, a pitch below horizontal, a yaw, a distance, px per ft at the target and a principal point */
export function hx3Camera(T: HookX3V, pitchDeg: number, yawDeg: number, d: number, k: number, cx: number, cy: number): HookX3Cam {
  const p = (pitchDeg * Math.PI) / 180;
  const y = (yawDeg * Math.PI) / 180;
  const back: HookX3V = [-Math.sin(y), Math.cos(y), 0];
  const dir: HookX3V = [Math.cos(p) * back[0], Math.cos(p) * back[1], Math.sin(p)];
  const E = hx3Add(T, hx3Mul(dir, d));
  const f = hx3Mul(dir, -1);
  const r: HookX3V = [Math.cos(y), Math.sin(y), 0];
  const u = hx3Cross(f, r);
  return { E, r, u, f, F: k * d, cx, cy };
}

export type HookX3P = { x: number; y: number; z: number };
export function hx3Project(c: HookX3Cam, p: HookX3V): HookX3P {
  const v = hx3Sub(p, c.E);
  const Z = Math.max(0.05, hx3Dot(v, c.f));
  return { x: c.cx + (c.F * hx3Dot(v, c.r)) / Z, y: c.cy - (c.F * hx3Dot(v, c.u)) / Z, z: Z };
}
/** px per ft of a small thing at p */
export const hx3ScaleAt = (c: HookX3Cam, p: HookX3V) => c.F / Math.max(0.05, hx3Dot(hx3Sub(p, c.E), c.f));

// ---- his 29 field goal attempts, Basketball-Reference shot chart 202611210SAS (wemby-shots-court.json) ----
// [n, x ft right of the rim centre, y ft from the rim centre toward half court, made, zone]
export type HookX3Zone = "rim" | "short" | "mid" | "three";
export const HX3_SHOTS: { n: number; x: number; y: number; made: boolean; zone: HookX3Zone }[] = (
  [
    [1, 7.48, 26.43, 0, "three"], [2, 0.19, -0.49, 1, "rim"], [3, 0.09, 0.82, 1, "rim"], [4, -0.21, 2.65, 0, "rim"],
    [5, 0.19, -0.49, 1, "rim"], [6, -9.12, 24.1, 1, "three"], [7, 1.1, 0.42, 1, "rim"], [8, 5.46, 26.43, 0, "three"],
    [9, 3.94, 0.82, 1, "short"], [10, 7.89, 15.9, 1, "mid"], [11, 0.29, 4.97, 1, "short"], [12, -23.9, -0.69, 1, "three"],
    [13, 0.6, 0.93, 1, "rim"], [14, 8.7, 12.56, 1, "mid"], [15, 7.68, 25.22, 1, "three"], [16, 6.06, 13.58, 1, "mid"],
    [17, -21.16, 12.77, 0, "three"], [18, 0.6, 0.01, 1, "rim"], [19, 1.0, 0.93, 1, "rim"], [20, 10.11, 22.79, 0, "three"],
    [21, 2.93, 25.01, 0, "three"], [22, 3.43, 0.22, 1, "rim"], [23, 9.81, 14.99, 0, "mid"], [24, 0.6, -0.29, 1, "rim"],
    [25, 0.7, -0.39, 1, "rim"], [26, 1.51, -0.49, 0, "rim"], [27, -21.57, 13.37, 1, "three"], [28, 13.05, 22.08, 0, "three"],
    [29, 10.52, 22.38, 1, "three"],
  ] as [number, number, number, number, HookX3Zone][]
).map(([n, x, y, m, zone]) => ({ n, x, y, made: !!m, zone }));
export const hx3Spot = (i: number): HookX3V => [HX3_SHOTS[i].x, HX3_RIM_Y + HX3_SHOTS[i].y, 0];
// his six free throws (5 of 6) come to rest on the free throw line as 0.44 wedges
export const HX3_FT_X = [-4.9, -2.94, -0.98, 0.98, 2.94, 4.9];

// ---- the heap: top of the key, just past the arc ----
export const HX3_HEAP: HookX3V = [1.6, 31.6, 0];
const LAYERS = [6, 5, 4, 4, 3, 3, 2, 2]; // 29
const LAYER_R = [1.25, 1.02, 0.84, 0.68, 0.52, 0.4, 0.26, 0.14];
const LAYER_DZ = 0.43;
const LEAN: HookX3V = [0.3, -0.1, 0]; // ft per layer: the heap leans right and a little away

export type HookX3Pose = { c: HookX3V; tilt: number; az: number };
export type HookX3Slot = { pose: HookX3Pose; layer: number };

// shots nearest the rim go to the base (they leave first), the threes ride the top; shot 12 (the far corner three)
// sits at the front of the base: it is the disc that rolls away on "scary"
const BY_DIST = HX3_SHOTS.map((s, i) => ({ i, d: Math.hypot(s.x, s.y) }))
  .sort((a, b) => a.d - b.d)
  .map((o) => o.i);
export const HX3_ROLLER = 11; // index of shot 12

export const HX3_SLOTS: HookX3Slot[] = (() => {
  const out: HookX3Slot[] = [];
  let n = 0;
  LAYERS.forEach((cnt, L) => {
    for (let j = 0; j < cnt; j++) {
      const a = (j / cnt) * Math.PI * 2 + L * 0.7 + (hx3Rnd(n, 1) - 0.5) * 0.5;
      const rr = LAYER_R[L] * (0.85 + 0.3 * hx3Rnd(n, 2)) * (L === 0 && j === 0 ? 1.08 : 1);
      const c: HookX3V = [
        HX3_HEAP[0] + LEAN[0] * L + rr * Math.cos(a),
        HX3_HEAP[1] + LEAN[1] * L + rr * Math.sin(a),
        0.13 + L * LAYER_DZ + (hx3Rnd(n, 3) - 0.5) * 0.12,
      ];
      const tilt = L === 0 ? 0.1 + 0.18 * hx3Rnd(n, 4) : 0.14 + 0.3 * hx3Rnd(n, 4);
      out.push({ pose: { c, tilt, az: a + (hx3Rnd(n, 5) - 0.5) * 0.6 }, layer: L });
      n++;
    }
  });
  return out;
})();
export const HX3_TOP: HookX3V = [HX3_HEAP[0] + LEAN[0] * 7.2, HX3_HEAP[1] + LEAN[1] * 7.2, 0.13 + 7 * LAYER_DZ + 0.2];
/** the slots that drop onto the heap in the first second, as the counter ticks: [slot, landing frame] */
export const HX3_LATE: [number, number][] = [[23, 4], [24, 16], [25, 28]];

/** which slot each shot sits in: the base front slot (slot 0, a = 0.0 + jitter, toward +x) is the roller */
export const HX3_SLOT_OF: number[] = (() => {
  const order = BY_DIST.filter((i) => i !== HX3_ROLLER);
  const res = new Array<number>(29).fill(0);
  res[HX3_ROLLER] = 0;
  order.forEach((shot, k) => (res[shot] = k + 1));
  return res;
})();

// free throw wedges wedged into the base between the bottom discs
export const HX3_WEDGES: HookX3Pose[] = HX3_FT_X.map((_, j) => {
  const a = (j / 6) * Math.PI * 2 + 0.35;
  return {
    c: [HX3_HEAP[0] + 1.75 * Math.cos(a), HX3_HEAP[1] + 1.75 * Math.sin(a), 0.1 + 0.08 * hx3Rnd(j, 9)],
    tilt: 0.14 + 0.1 * hx3Rnd(j, 8),
    az: a,
  };
});

// ---- time ----
export type HookX3T = {
  wemb: number; fifty: number; points: number; arent: number; scary: number; number: number;
  the: number; scary2: number; number2: number; is: number; n29: number; end: number;
};

/** the heap's sag: it settles lower and leans further at every slip */
export function hx3Sag(f: number, t: HookX3T) {
  return (
    0.05 * outC(seg(f, t.scary, t.scary + 10)) +
    0.04 * outC(seg(f, t.number, t.number + 10)) +
    0.03 * outC(seg(f, t.number + 44, t.number + 54)) +
    0.03 * outC(seg(f, t.number + 70, t.number + 80)) +
    0.08 * outC(seg(f, t.scary2, t.scary2 + 9)) +
    0.07 * outC(seg(f, t.number2, t.number2 + 9))
  );
}
/** shudder: small fast shakes after each slip and on each tick of the counter */
export function hx3Shudder(f: number, t: HookX3T) {
  const hits = [4, 16, 28, t.fifty, t.scary, t.number, t.number + 44, t.number + 70, t.scary2, t.number2, t.number2 + 6];
  let s = 0;
  for (const h of hits) {
    if (f >= h && f < h + 14) s += Math.sin((f - h) * 1.9) * Math.exp(-(f - h) / 4);
  }
  return s;
}

// discs that slip off before the collapse: [slot, frame offset key]
export function hx3Slips(t: HookX3T): Record<number, number> {
  return {
    3: t.scary + 2,
    5: t.number + 1,
    1: t.number + 44,
    4: t.number + 70,
    2: t.scary2 + 3,
    8: t.number2,
    10: t.number2 + 6,
  };
}

/** heap pose of a slot at frame f, with the sag and the lean growing */
export function hx3HeapPose(slot: number, f: number, t: HookX3T): HookX3Pose {
  const s = HX3_SLOTS[slot];
  const sag = hx3Sag(f, t);
  const sh = hx3Shudder(f, t) * 0.012 * (1 + s.layer * 0.5);
  const L = s.layer;
  let drop = 0;
  for (const [ls, lf] of HX3_LATE) {
    if (ls !== slot) continue;
    if (f < lf) drop = 0.5 * G * (lf - f + 6) * (lf - f + 6) - 0.5 * G * 36;
    else drop = 0.07 * Math.abs(Math.sin((f - lf) * 0.6)) * Math.exp(-(f - lf) / 4);
  }
  return {
    c: [s.pose.c[0] + sag * 0.9 * L * 0.5 + sh, s.pose.c[1] - sag * 0.3 * L * 0.5, s.pose.c[2] - sag * L * 0.42 + Math.abs(sh) * 0.3 + Math.max(0, drop)],
    tilt: s.pose.tilt + sag * 0.5 * (L > 0 ? 1 : 0),
    az: s.pose.az,
  };
}

/** where a slipped disc comes to rest, just off the base, flat */
function slipRest(slot: number): HookX3Pose {
  const s = HX3_SLOTS[slot];
  const dx = s.pose.c[0] - HX3_HEAP[0];
  const dy = s.pose.c[1] - HX3_HEAP[1];
  const l = Math.hypot(dx, dy) || 1;
  const out = 1.5 + 1.4 * hx3Rnd(slot, 11) + s.layer * 0.5;
  return { c: [HX3_HEAP[0] + (dx / l) * (l + out), HX3_HEAP[1] + (dy / l) * (l + out), HX3_T / 2], tilt: 0, az: s.pose.az };
}

export type HookX3DiscState = { c: HookX3V; n: HookX3V; spin: number; v: number; settled: number; onFloor: boolean };


const tiltN = (tilt: number, az: number): HookX3V => [Math.sin(tilt) * Math.cos(az), Math.sin(tilt) * Math.sin(az), Math.cos(tilt)];
const floorZ = (tilt: number) => HX3_R * Math.sin(tilt) + (HX3_T / 2) * Math.cos(tilt);

/** a flight from pose S at frame L to spot P (flat) at frame A: falls with gravity, hops, slides braking, wobbles down */
function flight(S: HookX3Pose, P: HookX3V, L: number, A: number, f: number, seed: number): HookX3DiscState {
  const u = hx3Clamp((f - L) / (A - L));
  const s = 1 - Math.pow(1 - u, 2.3);
  const dx = P[0] - S.c[0];
  const dy = P[1] - S.c[1];
  const dist = Math.hypot(dx, dy) || 1;
  const bend = (hx3Rnd(seed, 21) - 0.5) * 0.22 * dist * Math.sin(Math.PI * s);
  const x = S.c[0] + dx * s + (-dy / dist) * bend;
  const y = S.c[1] + dy * s + (dx / dist) * bend;
  // tilt: from its heap tilt, wobbling down like a spun coin, flat on arrival
  const wob = 0.42 * Math.sin(Math.PI * Math.pow(u, 0.6)) * Math.pow(1 - u, 0.7);
  const tilt = S.tilt * Math.pow(1 - u, 1.6) + wob;
  const spin = S.az + (f - L) * (0.25 + 0.6 * u) * (hx3Rnd(seed, 22) > 0.5 ? 1 : -1);
  const fz = floorZ(tilt);
  const tFall = Math.sqrt((2 * Math.max(0, S.c[2] - fz)) / G);
  const el = f - L;
  let z: number;
  if (el < tFall) z = S.c[2] - 0.5 * G * el * el;
  else {
    const hopT = 9;
    const h = Math.min(0.45, 0.2 * S.c[2]);
    const e = el - tFall;
    z = fz + (e < hopT ? h * 4 * (e / hopT) * (1 - e / hopT) : 0);
  }
  z = Math.max(fz, z);
  const v = f > L && f < A ? (dist * (2.3 * Math.pow(1 - u, 1.3))) / (A - L) : 0;
  return { c: [x, y, z], n: tiltN(tilt, spin), spin, v, settled: u >= 1 ? 1 : 0, onFloor: el >= tFall };
}

export type HookX3Plan = { L: number; A: number; slip: number };

/** when each shot's disc launches (L) and lands on its spot (A); the rim cluster first, the threes last */
export function hx3Plan(t: HookX3T): HookX3Plan[] {
  const slips = hx3Slips(t);
  const zoneRank: Record<HookX3Zone, number> = { rim: 0, short: 1, mid: 2, three: 3 };
  const byArrive = HX3_SHOTS.map((s, i) => ({ i, k: zoneRank[s.zone] * 100 + Math.hypot(s.x, s.y) }))
    .sort((a, b) => a.k - b.k)
    .map((o) => o.i);
  const plan: HookX3Plan[] = [];
  HX3_SHOTS.forEach((_, i) => {
    const slot = HX3_SLOT_OF[i];
    const L0 = HX3_SLOTS[slot].layer;
    const order = byArrive.indexOf(i);
    const A = t.n29 + 9 + Math.round(order * 0.68);
    const L = Math.min(A - 14, t.is + 1 + L0 * 2 + Math.round(hx3Rnd(i, 31) * 3));
    plan[i] = { L, A, slip: i === HX3_ROLLER ? t.scary : slips[slot] ?? Infinity };
  });
  return plan;
}

/** the roller: rolls away on its edge from "scary" to its spot (the far corner three), then wobbles down flat */
function roller(f: number, t: HookX3T): HookX3DiscState {
  const S = HX3_SLOTS[0].pose;
  const P = hx3Spot(HX3_ROLLER);
  const L = t.scary;
  const A = t.scary + 64;
  const u = hx3Clamp((f - L) / (A - L));
  const s = 1 - Math.pow(1 - u, 1.8);
  const dx = P[0] - S.c[0];
  const dy = P[1] - S.c[1];
  const dist = Math.hypot(dx, dy);
  const bend = 2.2 * Math.sin(Math.PI * s);
  const x = S.c[0] + dx * s + (-dy / dist) * bend;
  const y = S.c[1] + dy * s + (dx / dist) * bend;
  // stands up onto its edge in the first frames, rolls, then spirals down flat in the last quarter
  const up = hx3Clamp((f - L) / 7);
  const down = hx3Clamp((u - 0.72) / 0.28);
  const tilt = hx3Lerp(S.tilt, Math.PI / 2 - 0.12, smooth(up)) * (1 - smooth(down)) + 0.18 * Math.sin(down * Math.PI) * (1 - down);
  const head = Math.atan2(dy, dx) + Math.PI / 2; // the normal points sideways to the travel
  const az = down > 0 ? head + down * 9 : head;
  const z = floorZ(tilt);
  return { c: [x, y, z], n: tiltN(tilt, az), spin: (f - L) * 0.4, v: u < 1 ? dist / (A - L) : 0, settled: u >= 1 ? 1 : 0, onFloor: true };
}

export function hx3Disc(i: number, f: number, t: HookX3T, plan: HookX3Plan[]): HookX3DiscState {
  if (i === HX3_ROLLER && f >= t.scary) return roller(f, t);
  const slot = HX3_SLOT_OF[i];
  const p = plan[i];
  const restAt = (ff: number): HookX3Pose => {
    if (ff < p.slip) return hx3HeapPose(slot, ff, t);
    const S = hx3HeapPose(slot, p.slip, t);
    const R = slipRest(slot);
    const st = flight(S, R.c, p.slip, p.slip + 20, ff, i + 50);
    const tilt = Math.acos(hx3Clamp(st.n[2], -1, 1));
    return { c: st.c, tilt, az: Math.atan2(st.n[1], st.n[0]) };
  };
  if (f < p.L) {
    const q = restAt(f);
    const st: HookX3DiscState = { c: q.c, n: tiltN(q.tilt, q.az), spin: q.az, v: 0, settled: 0, onFloor: f >= p.slip };
    if (f >= p.slip && f < p.slip + 20) st.v = 0.12;
    return st;
  }
  const S = restAt(p.L);
  return flight(S, hx3Spot(i), p.L, p.A, f, i);
}

// the free throw wedges: they slide out with the base and come to rest on the free throw line
export function hx3Wedge(j: number, f: number, t: HookX3T): HookX3DiscState & { rot: number } {
  const S = HX3_WEDGES[j];
  const L = t.is + 2 + j;
  const A = t.n29 + 13 + j * 2;
  const P: HookX3V = [HX3_FT_X[j], HX3_FT_Y, 0];
  if (f < L) {
    const sag = hx3Sag(f, t);
    return { c: [S.c[0], S.c[1], S.c[2] - sag * 0.1], n: tiltN(S.tilt, S.az), spin: S.az, v: 0, settled: 0, onFloor: true, rot: S.az * 1.7 };
  }
  const st = flight(S, P, L, A, f, 80 + j);
  // the wedge's point turns to face the basket as it brakes
  const u = hx3Clamp((f - L) / (A - L));
  const rot = hx3Lerp(S.az * 1.7, -Math.PI / 2 + 4 * Math.PI * Math.sign(j - 2.5), 1 - Math.pow(1 - u, 2.2));
  return { ...st, rot };
}

// ---- the camera's path ----
export function hx3CamAt(f: number, t: HookX3T, shake: { x: number; y: number }): HookX3Cam {
  const T0: HookX3V = [HX3_TOP[0] + 0.1, HX3_TOP[1], HX3_TOP[2] + 0.6];
  const T1: HookX3V = [HX3_HEAP[0] + 1.2, HX3_HEAP[1] - 0.4, 2.6];
  const T2: HookX3V = [0, 23.5, 0];
  // 0 .. aren't: looking down on it, slow push in
  const a = seg(f, 0, t.arent);
  let T = T0;
  let pitch = hx3Lerp(63, 60, a);
  let yaw = hx3Lerp(-9, -12, a);
  let d = 34;
  let k = hx3Lerp(128, 138, a);
  let cx = 650;
  let cy = hx3Lerp(900, 912, a);
  // aren't: down and back, the heap shows its height
  const b = inOut(seg(f, t.arent, t.arent + 42));
  // the silence: a slow creep in, drifting round
  const c = seg(f, t.arent + 42, t.is);
  if (b > 0) {
    T = [hx3Lerp(T0[0], T1[0], b), hx3Lerp(T0[1], T1[1], b), hx3Lerp(T0[2], T1[2], b)];
    pitch = hx3Lerp(pitch, hx3Lerp(19, 23, c), b);
    yaw = hx3Lerp(yaw, hx3Lerp(-24, -15, smooth(c)), b);
    d = hx3Lerp(d, 70, b);
    k = hx3Lerp(k, hx3Lerp(88, 100, c), b);
    cx = hx3Lerp(cx, 610, b);
    cy = hx3Lerp(cy, hx3Lerp(960, 950, c), b);
  }
  // is .. : the rise, straight overhead, `answer`'s court
  const e = inOut(seg(f, t.is - 2, t.n29 + 26));
  if (e > 0) {
    const ee = e; // target and scale travel together
    T = [hx3Lerp(T[0], T2[0], ee), hx3Lerp(T[1], T2[1], ee), hx3Lerp(T[2], T2[2], ee)];
    pitch = hx3Lerp(pitch, 90, Math.pow(e, 0.8));
    yaw = hx3Lerp(yaw, 0, Math.min(1, e * 1.5));
    // the scale moves in log space so the zoom out feels even
    k = Math.exp(hx3Lerp(Math.log(k), Math.log(HX3_PPF), outC(e) * 0.3 + e * 0.7));
    d = hx3Lerp(d, 150, e);
    cx = hx3Lerp(cx, 540, e);
    cy = hx3Lerp(cy, 1057.2, e);
  }
  return hx3Camera(T, pitch, yaw, d, k, cx + shake.x, cy + shake.y);
}
