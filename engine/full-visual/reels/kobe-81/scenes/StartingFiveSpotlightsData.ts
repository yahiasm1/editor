// The five starters of Jan 22 2006, read off Basketball-Reference's 2005-06 Lakers roster (number, position, height)
// and placed at one scale: 110 px per foot. Each cut-out's own scale was read off its photo (full height for Parker
// and Mihm, head length 0.79 ft for Bryant and Brown, head width for Odom), so every crown sits at its true height
// above one hidden floor line behind the scorer's table. Notes: ../notes/StartingFiveSpotlights.md
import { StartingFiveSpotlightsKwameSrc } from "./StartingFiveSpotlightsKwame";

export const StartingFiveSpotlightsK = 110; // px per foot
export const StartingFiveSpotlightsFloor = 1570; // the hidden floor line the five stand on (behind the table)
export const StartingFiveSpotlightsTableTop = 1180; // the scorer's table top, nearer the camera: it covers the hips

export type StartingFiveSpotlightsPlayer = {
  key: string;
  file: string; // public/kobe-81/<file>, exported at 1.5x the size drawn
  w: number; // drawn size
  h: number;
  crownY: number; // crown, in drawn px from the image top
  bodyX: number; // the body's centre line, in drawn px from the image left
  trace?: boolean; // drawn as a traced figure (StartingFiveSpotlightsKwame), not a photo cut-out
  headDx?: number; // the head's offset from the spot centre, when he leans (Mihm reaches forward with the ball)
  x: number; // spot centre on the stage
  ft: number; // height in feet
  num: string;
  pos: string;
  height: string; // BBR notation
  word: string; // the caption word he lands on
  from: "left" | "right" | "below";
  credit: string[];
  grade: { b: number; s: number }; // per-photo exposure and saturation, matched by eye under the spot
};

const S = 1 / 1.5;
// Kwame: the tip-off frame's box mapped at his own scale (6-11 from crown to feet in that frame)
const KW = StartingFiveSpotlightsKwameSrc;
const KS = ((6 + 11 / 12) * StartingFiveSpotlightsK) / (KW.feet - KW.top);
export const StartingFiveSpotlightsPlayers: StartingFiveSpotlightsPlayer[] = [
  { key: "smush", file: "startingfivespotlights-smush.png", w: 348 * S, h: 698 * S, crownY: 1.6, bodyX: 120, x: 110, ft: 6 + 4 / 12, num: "#1", pos: "PG", height: "6-4", word: "parker", from: "left", credit: ["pragmatopian", "CC BY 2.0"], grade: { b: 1.22, s: 1.05 } },
  { key: "kobe", file: "startingfivespotlights-kobe.png", w: 425 * S, h: 679 * S, crownY: 1, bodyX: 167, x: 284, ft: 6.5, num: "#8", pos: "SG", height: "6-6", word: "kobe", from: "left", credit: ["Sgt. Joseph", "A. Lee, USMC,", "public domain"], grade: { b: 1, s: 1 } },
  { key: "odom", file: "startingfivespotlights-odom.png", w: 366 * S, h: 584 * S, crownY: 0.5, bodyX: 137, x: 458, ft: 6 + 10 / 12, num: "#7", pos: "PF", height: "6-10", word: "odom", from: "right", credit: ["Jeramey Jannene", "CC BY 2.0"], grade: { b: 1.04, s: 1 } },
  { key: "kwame", file: "startingfivespotlights-kwame-tip.jpg", trace: true, w: (KW.box[2] - KW.box[0]) * KS, h: (KW.box[3] - KW.box[1]) * KS, crownY: (KW.top - KW.box[1]) * KS, bodyX: (KW.cx - KW.box[0]) * KS, headDx: (KW.headCx - KW.cx) * KS, x: 644, ft: 6 + 11 / 12, num: "#54", pos: "C", height: "6-11", word: "brown", from: "below", credit: ["malingering", "CC BY 2.0"], grade: { b: 0.9, s: 0.9 } },
  { key: "mihm", file: "startingfivespotlights-mihm.png", w: 520 * S, h: 760 * S, crownY: 3, bodyX: 69, headDx: 56, x: 806, ft: 7, num: "#31", pos: "C", height: "7-0", word: "mihm", from: "left", credit: ["Jeramey Jannene", "CC BY 2.0"], grade: { b: 1.06, s: 0.95 } },
];

/** the y of a height on the ruler */
export const StartingFiveSpotlightsY = (ft: number) => StartingFiveSpotlightsFloor - ft * StartingFiveSpotlightsK;

/** a small deterministic hash, 0..1 */
export const StartingFiveSpotlightsRand = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
