// wilt-100 "record": shared numbers. Every time is a word of caption.txt. The data is the real Basketball-Reference
// 1961-62 game log (assets/refs/pages/wilt-gamelog-1962-clean.json), 80 rows; game 76 is the 100.
import { Easing } from "remotion";
import { loadFont as loadCourier } from "@remotion/google-fonts/CourierPrime";
import { useScene } from "../../../src/engine";
import log from "../assets/refs/pages/wilt-gamelog-1962-clean.json";

export const RGL_COURIER = loadCourier("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
export const RGL_BBR = "'RGL DejaVu Sans', 'DejaVu Sans', Verdana, sans-serif";

export const RGL_PAPER = "#EFE6D2";
export const RGL_INK = "#1B1B1B";
export const RGL_DIM = "#8B949E";
export const RGL_CARD = "#161B22";
export const RGL_HAIR = "#30363D";
export const RGL_PUSH = Easing.bezier(0.55, 0, 0.2, 1);

export type RglRow = { rk: number; date: string; loc: string; opp: string; res: string; pts: number };
type Game = { team_game_num_season: string; date: string; game_location: string; opp_name_abbr: string; game_result: string; pts: string };
export const RGL_ROWS: RglRow[] = (log.games as Game[]).map((g, i) => ({
  rk: i + 1,
  date: g.date,
  loc: g.game_location,
  opp: g.opp_name_abbr,
  res: g.game_result,
  pts: parseInt(g.pts, 10),
}));
/** running season average after n games (n >= 1), the real mean of the real rows */
export const RGL_AVG: number[] = (() => {
  const out = [0];
  let s = 0;
  RGL_ROWS.forEach((r, i) => {
    s += r.pts;
    out.push(s / (i + 1));
  });
  return out;
})();
export const RGL_HUNDRED = 76; // the row whose PTS stays covered

export const rglLerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const rglClamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const rglRnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// page geometry (stage px, before the page's own move)
export const RGL = {
  pageX: 384,
  pageY: 598,
  pageW: 676,
  pageH: 850,
  rowH: 38,
  bodyTop: 150, // inside the page: h1, heading, thead above
  visible: 18, // rows in the window
};

export function useRecordT() {
  const { cue, cueEnd, scene } = useScene();
  const season = cue("season");
  const fifty = cue("50.4");
  // the rows: slow for the first games (readable), then a blur; row 80 lands two frames before "50.4"
  const rowsFrom = season + 2;
  const rowsTo = fifty - 2;
  const rowAt = (i: number) => Math.round(rowsFrom + (rowsTo - rowsFrom) * Math.pow(i / 80, 0.6));
  return {
    born: scene.from - 6,
    so: cue("So"),
    guy: cue("guy"),
    score: cue("score"),
    hundred: cue("100?"),
    hundredEnd: cueEnd("100?"),
    that: cue("That"),
    season,
    wilt: cue("Wilt"),
    averaged: cue("averaged"),
    fifty,
    fiftyEnd: cueEnd("50.4"),
    points: cue("points"),
    game: cue("game,"),
    which: cue("which"),
    still: cue("still"),
    record: cue("record."),
    end: scene.to,
    rowAt,
  };
}
export type RecordT = ReturnType<typeof useRecordT>;

/** how many rows are typed at frame f, and the fractional progress toward the next one */
export function rglTyped(f: number, T: RecordT) {
  let n = 0;
  while (n < 80 && f >= T.rowAt(n + 1)) n++;
  return n;
}
