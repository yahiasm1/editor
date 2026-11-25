// OneAgainstFive data: Kobe's 4th quarter and the Raptors' second half from the BBR play-by-play, the five traced
// Raptors outlines (photo px of Jeramey Jannene's Jan 27 2006 Raptors at Bucks frame), and where everything stands.
import scoring from "../assets/refs/kobe-81-scoring.json";

type Ev = { q: number; clock: string; team: string; pts: number; kobe: boolean; play: string; tor: number; lal: number };
const events = (scoring as { events: Ev[] }).events;

/** Kobe's 4th quarter, one entry per scoring play: the first socket it lights and how many (53..80) */
export const OneAgainstFiveQ4: { first: number; pts: number }[] = (() => {
  const out: { first: number; pts: number }[] = [];
  let s = 53;
  for (const e of events) {
    if (e.q !== 4 || !e.kobe) continue;
    out.push({ first: s, pts: e.pts });
    s += e.pts;
  }
  return out;
})();

/** who: the five starters (index 0..4 in stage order) or the bench (5) */
const WHO: Record<string, number> = { "J. Rose": 0, "C. Bosh": 1, "M. James": 2, "M. Peterson": 3, "M. Bonner": 4, "J. Graham": 5, "C. Villanueva": 5 };

/** the Raptors' 41 second-half points, one entry per point, in play-by-play order */
export const OneAgainstFiveTor: { who: number; play: number }[] = (() => {
  const out: { who: number; play: number }[] = [];
  let play = 0;
  for (const e of events) {
    if (e.q < 3 || e.team !== "TOR") continue;
    const name = e.play.split(" makes")[0];
    for (let i = 0; i < e.pts; i++) out.push({ who: WHO[name], play });
    play++;
  }
  return out;
})();
export const OneAgainstFiveTorPlays = Math.max(...OneAgainstFiveTor.map((p) => p.play)) + 1; // 26

type Pt = [number, number];
type Body = { poly: Pt[]; top: number; feet: number; cx: number; chest: Pt; photo: boolean; jersey?: Pt[] };

// outlines traced by hand at 4x over a 10 px grid, head to mid-thigh (the scorer's table hides the rest)
const BOSH: Body = {
  top: 390, feet: 700, cx: 500, chest: [500, 503], photo: true,
  poly: [[497.5, 390], [506, 391], [512, 394], [516, 405], [519, 421], [515, 430], [510, 439], [525, 442], [535, 462], [540, 492], [542, 520], [547, 542], [552, 567], [555, 600], [556, 640], [456, 640], [457, 600], [454, 580], [447, 555], [445, 530], [444, 510], [445, 480], [449, 455], [462, 444], [486, 436], [482, 417], [481, 400], [488, 392]],
};
const JAMES: Body = {
  top: 434, feet: 710, cx: 742, chest: [725, 532], photo: true,
  poly: [[727.5, 434], [738, 435], [746, 440], [749, 457], [742, 472], [762, 477], [775, 490], [785, 510], [790, 535], [787, 550], [775, 570], [767, 585], [772, 605], [776, 650], [698, 650], [696, 600], [694, 587], [695, 565], [697, 537], [700, 505], [705, 482], [717, 475], [715, 469], [711, 457], [717, 442]],
};
const PETERSON: Body = {
  top: 414, feet: 700, cx: 868, chest: [848, 507], photo: true,
  poly: [[862, 414], [874, 418], [884, 427], [884, 437], [877, 450], [892, 465], [897, 480], [905, 482], [905, 545], [902, 555], [897, 575], [905, 600], [907, 650], [827, 650], [827, 600], [830, 575], [832, 560], [835, 540], [836, 512], [840, 487], [845, 462], [852, 454], [850, 442], [847, 430], [855, 420]],
};
// Pape Sow #9 in the same frame: the body Rose (mirrored) and Bonner stand in, as plain shapes without a face
const SOW: Body = {
  top: 400, feet: 700, cx: 205, chest: [215, 485], photo: false,
  jersey: [[178, 441], [196, 436], [206, 452], [217, 434], [234, 440], [236, 465], [240, 500], [244, 540], [246, 600], [247, 640], [183, 640], [184, 600], [182, 560], [181, 530], [183, 500], [184, 474]],
  poly: [[202, 400], [211, 401], [217, 405], [220, 417], [217, 432], [235, 439], [242, 455], [245, 485], [247, 510], [250, 535], [247, 545], [245, 560], [246, 600], [247, 640], [183, 640], [184, 600], [182, 560], [181, 530], [183, 500], [184, 474], [176, 486], [170, 510], [164, 538], [157, 562], [150, 567], [145, 556], [148, 530], [153, 505], [158, 480], [164, 458], [175, 442], [195, 435], [190, 422], [191, 407]],
};

export type OneAgainstFiveRaptor = { name: string; num: string; ft: number; inch: string; pts: number; body: Body; mirror: boolean };
export const OneAgainstFiveFive: OneAgainstFiveRaptor[] = [
  { name: "ROSE", num: "5", ft: 6 + 8 / 12, inch: "6-8", pts: 13, body: SOW, mirror: true },
  { name: "BOSH", num: "4", ft: 6 + 11 / 12, inch: "6-11", pts: 8, body: BOSH, mirror: false },
  { name: "JAMES", num: "13", ft: 6 + 2 / 12, inch: "6-2", pts: 7, body: JAMES, mirror: false },
  { name: "PETERSON", num: "24", ft: 6 + 7 / 12, inch: "6-7", pts: 2, body: PETERSON, mirror: false },
  { name: "BONNER", num: "16", ft: 6 + 10 / 12, inch: "6-10", pts: 7, body: SOW, mirror: false },
];

/** a closed Catmull-Rom path through the traced points */
export const OneAgainstFivePath = (pts: Pt[]) => {
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d + " Z";
};

// ---------------------------------------------------------------- the world: one floor, 62 px per foot
export const OneAgainstFiveK = 78;
export const OneAgainstFiveFloor = 1440; // hidden behind the table
export const OneAgainstFiveTableTop = Math.round(1440 - 2.6 * 78); // 1237
export const OneAgainstFiveKobeX = 150;
/** Raptors' centre x before and after they close up into a wall */
export const OneAgainstFiveSpread = [606, 692, 776, 856, 930];
export const OneAgainstFiveWall = [606, 676, 746, 818, 890];

/** the stacks: 4 wide, bottom first, standing on the table top */
export const OneAgainstFiveStack = { pitch: 30, r: 12.5, goldX: 268, redX: 412 };
const stackSpot = (x0: number, i: number) => {
  const S = OneAgainstFiveStack;
  return { x: x0 + (i % 4) * S.pitch, y: OneAgainstFiveTableTop - 18 - Math.floor(i / 4) * S.pitch };
};
/** where Kobe's 55 second-half bulbs stand at the end of the scene (i = 0..54, in the order he scored them) */
export const OneAgainstFiveGoldSpot = (i: number) => stackSpot(OneAgainstFiveStack.goldX, i);
export const OneAgainstFiveRedSpot = (i: number) => stackSpot(OneAgainstFiveStack.redX, i);

/** the 9 x 9 board: big at the centre for the 4th quarter, then small above Kobe holding the first 26 */
export const OneAgainstFiveBigBoard = { x0: 316, y0: 772, pitch: 56, r: 21 };
export const OneAgainstFiveSmallBoard = { x0: 98, y0: 730, pitch: 15, r: 5.8 };

export const OneAgainstFiveRand = (i: number, salt = 0) => {
  const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
};
