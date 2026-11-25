// EightyOneBoxRow data: the bulb "81" (the scoreboard's seven-segment cell, 9 bulbs on each of its 9 lit segments,
// 81 exactly), where each of the board's bulbs lands in it, and Basketball-Reference's box score copy for the Lakers
// that night (assets/refs/pages/bbref-box-200601220LAL.html, table box-LAL-game-basic, and its line score).
import { OneAgainstFiveBigBoard } from "./OneAgainstFiveData";

type Seg = [number, number, number, number];
// segment centre lines in the 60 x 100 cell of StaplesNightDigit, drawn in chase order (round the 8, then the bar)
const SEG: Record<string, Seg> = {
  a: [11, 6, 49, 6],
  b: [53, 9, 53, 47],
  c: [53, 53, 53, 91],
  d: [49, 94, 11, 94],
  e: [7, 91, 7, 53],
  f: [7, 47, 7, 9],
  g: [11, 50, 49, 50],
};
const EIGHT = ["a", "b", "c", "d", "e", "f", "g"];
const ONE = ["b", "c"];
const ONE_OFF = ["a", "d", "e", "f", "g"];

/** the big digits: cell height, top, and the two cells' left edges, centred on the lit extent */
export const EightyOneBoxRowBig = (() => {
  const h = 700;
  const u = h / 100;
  const dw = h * 0.6;
  const gap = h * 0.16;
  const litL = 7 * u;
  const litR = dw + gap + 53 * u;
  const left = 540 - (litL + litR) / 2;
  return { h, u, top: 730, left, left2: left + dw + gap, r: 12.6 };
})();

const TAN = Math.tan((4 * Math.PI) / 180);
const spotsOf = (cellLeft: number, names: string[], top: number, u: number) => {
  const out: { x: number; y: number }[] = [];
  for (const n of names) {
    const s = SEG[n];
    for (let k = 0; k < 9; k++) {
      const t = (k + 0.5) / 9;
      const cx = s[0] + (s[2] - s[0]) * t;
      const cy = s[1] + (s[3] - s[1]) * t;
      // the board digits lean forward: skewX(-4deg) about the cell centre
      out.push({ x: cellLeft + (cx + TAN * (50 - cy)) * u, y: top + cy * u });
    }
  }
  return out;
};

/** the 81 lit spots in chase order (0..62 the 8, 63..80 the 1) */
export const EightyOneBoxRowSpots = (() => {
  const B = EightyOneBoxRowBig;
  return [...spotsOf(B.left, EIGHT, B.top, B.u), ...spotsOf(B.left2, ONE, B.top, B.u)];
})();
/** the dark sockets of the 1's unlit segments: a real bulb board shows its empty sockets */
export const EightyOneBoxRowOffSpots = (() => {
  const B = EightyOneBoxRowBig;
  return spotsOf(B.left2, ONE_OFF, B.top, B.u);
})();
export const EightyOneBoxRowCentre = (() => {
  const S = EightyOneBoxRowSpots;
  const xs = S.map((p) => p.x);
  const ys = S.map((p) => p.y);
  return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
})();

/** board socket i (the order he scored them) -> spot index: both sorted left to right so the flight fans out cleanly */
export const EightyOneBoxRowTarget: number[] = (() => {
  const Bb = OneAgainstFiveBigBoard;
  const board = Array.from({ length: 81 }, (_, i) => ({ i, k: (Bb.x0 + (i % 9) * Bb.pitch) * 1000 + Bb.y0 + Math.floor(i / 9) * Bb.pitch }));
  const spots = EightyOneBoxRowSpots.map((p, s) => ({ s, k: Math.round(p.x) * 1000 + p.y }));
  board.sort((a, b) => a.k - b.k);
  spots.sort((a, b) => a.k - b.k);
  const out = new Array<number>(81);
  board.forEach((b, n) => (out[b.i] = spots[n].s));
  return out;
})();

/** the 122 sockets under the page: Kobe's 81 then the other Lakers' 41, 25 to a row */
export const EightyOneBoxRowStack = { x0: 84, y0: 1130, pitch: 38, r: 14, cols: 25 };

export const EightyOneBoxRowRand = (i: number, salt = 0) => {
  const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

// ---------------------------------------------------------------- the box score, real copy
/** columns in BBR's order; ORB..PF are folded into one strip, GmSc and +/- run off the card's edge */
export type EightyOneBoxRowCol = { key: string; label: string; w: number; fold?: boolean };
export const EightyOneBoxRowCols: EightyOneBoxRowCol[] = [
  { key: "player", label: "Starters", w: 214 },
  { key: "mp", label: "MP", w: 96 },
  { key: "fg", label: "FG", w: 58 },
  { key: "fga", label: "FGA", w: 66 },
  { key: "fg_pct", label: "FG%", w: 80 },
  { key: "fg3", label: "3P", w: 46 },
  { key: "fg3a", label: "3PA", w: 62 },
  { key: "fg3_pct", label: "3P%", w: 80 },
  { key: "ft", label: "FT", w: 54 },
  { key: "fta", label: "FTA", w: 62 },
  { key: "ft_pct", label: "FT%", w: 80 },
  { key: "fold", label: "", w: 46, fold: true },
  { key: "pts", label: "PTS", w: 72 },
  { key: "game_score", label: "GmSc", w: 84 },
];
export const EightyOneBoxRowFoldLabels = ["ORB", "DRB", "TRB", "AST", "STL", "BLK", "TOV", "PF"];

type Row = { [k: string]: string | string[]; fold: string[] };
export const EightyOneBoxRowOdom: Row = {
  player: "Lamar Odom", mp: "42:53", fg: "1", fga: "7", fg_pct: ".143", fg3: "1", fg3a: "2", fg3_pct: ".500", ft: "5", fta: "6", ft_pct: ".833", pts: "8", game_score: "7.2",
  fold: ["0", "10", "10", "7", "0", "2", "4", "3"],
};
export const EightyOneBoxRowKobe: Row = {
  player: "Kobe Bryant", mp: "41:56", fg: "28", fga: "46", fg_pct: ".609", fg3: "7", fg3a: "13", fg3_pct: ".538", ft: "18", fta: "20", ft_pct: ".900", pts: "81", game_score: "63.5",
  fold: ["2", "4", "6", "2", "3", "1", "3", "1"],
};
export const EightyOneBoxRowTotals: Row = {
  player: "Team Totals", mp: "240", fg: "42", fga: "88", fg_pct: ".477", fg3: "10", fg3a: "23", fg3_pct: ".435", ft: "28", fta: "33", ft_pct: ".848", pts: "122", game_score: "",
  fold: ["18", "33", "51", "18", "9", "9", "16", "23"],
};
/** the rows the page has between Kobe and Team Totals, folded into hairlines */
export const EightyOneBoxRowBetween = ["Smush Parker", "Kwame Brown", "Chris Mihm", "Reserves", "Devean George", "Luke Walton", "Sasha Vujačić", "Brian Cook", "Devin Green", "Andrew Bynum", "Von Wafer"];

/** BBR line score */
export const EightyOneBoxRowLine = [
  { team: "TOR", q: [36, 27, 22, 19], t: 104 },
  { team: "LAL", q: [29, 20, 42, 31], t: 122 },
];
