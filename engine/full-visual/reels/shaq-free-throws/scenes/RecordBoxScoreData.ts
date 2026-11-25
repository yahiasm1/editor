// Real copy from Basketball-Reference, read off assets/refs/pages/bbref-box-2000-12-08-sea-at-lal.html and
// bbref-pbp-2000-12-08-sea-at-lal.html (notes/RecordBoxScore.md). Nothing here is typed from memory.

export const RECORDBOXSCORE_H1 = ["Seattle SuperSonics at Los Angeles Lakers", "Box Score, ", "December 8, 2000"];
export const RECORDBOXSCORE_META = "10:30 PM, December 8, 2000  ·  STAPLES Center, Los Angeles, California";
export const RECORDBOXSCORE_TABS = ["Box Score", "Play-By-Play", "Shot Charts", "Plus/Minus"];

export const RECORDBOXSCORE_COLS = ["MP", "FG", "FGA", "FG%", "3P", "3PA", "3P%", "FT", "FTA", "FT%", "ORB", "DRB", "TRB", "AST", "STL", "BLK", "TOV", "PF", "PTS"];
// a zero cell is printed faint on the real page (class "iz"); an empty percentage (0 of 0) is blank
export type RecordBoxScoreRow = { name: string; cells: string[] };
export const RECORDBOXSCORE_STARTERS: RecordBoxScoreRow[] = [
  { name: "Horace Grant", cells: ["41:00", "2", "10", ".200", "0", "0", "", "0", "0", "", "8", "6", "14", "5", "1", "1", "1", "3", "4"] },
  { name: "Kobe Bryant", cells: ["39:48", "8", "25", ".320", "0", "1", ".000", "3", "5", ".600", "0", "4", "4", "2", "3", "1", "2", "4", "19"] },
  { name: "Shaquille O'Neal", cells: ["38:30", "13", "24", ".542", "0", "0", "", "0", "11", ".000", "8", "9", "17", "5", "0", "5", "1", "3", "26"] },
  { name: "Rick Fox", cells: ["23:59", "5", "10", ".500", "1", "6", ".167", "0", "0", "", "0", "1", "1", "1", "0", "0", "2", "2", "11"] },
  { name: "Ron Harper", cells: ["19:36", "4", "7", ".571", "0", "2", ".000", "0", "0", "", "1", "2", "3", "3", "1", "1", "1", "3", "8"] },
];
export const RECORDBOXSCORE_RESERVES: RecordBoxScoreRow[] = [
  { name: "Isaiah Rider", cells: ["28:24", "6", "13", ".462", "2", "3", ".667", "2", "2", "1.000", "1", "3", "4", "1", "0", "0", "1", "4", "16"] },
  { name: "Brian Shaw", cells: ["15:09", "1", "4", ".250", "1", "3", ".333", "0", "0", "", "0", "2", "2", "3", "0", "1", "0", "3", "3"] },
];
export const RECORDBOXSCORE_SHAQ = 2;

// the eleven misses, in game order: quarter, clock, the play as printed, score (Seattle first, as the page prints it)
export const RECORDBOXSCORE_MISSES: { q: string; clock: string; play: string; score: string }[] = [
  { q: "2nd", clock: "0:47.7", play: "1 of 2", score: "57-52" },
  { q: "2nd", clock: "0:47.7", play: "2 of 2", score: "57-52" },
  { q: "3rd", clock: "9:27.0", play: "1 of 2", score: "63-59" },
  { q: "3rd", clock: "9:27.0", play: "2 of 2", score: "63-59" },
  { q: "3rd", clock: "3:38.0", play: "1 of 2", score: "74-70" },
  { q: "3rd", clock: "3:38.0", play: "2 of 2", score: "74-70" },
  { q: "3rd", clock: "1:53.0", play: "1 of 2", score: "77-74" },
  { q: "3rd", clock: "1:53.0", play: "2 of 2", score: "77-74" },
  { q: "4th", clock: "5:25.0", play: "1 of 1", score: "92-90" },
  { q: "4th", clock: "0:58.8", play: "1 of 2", score: "100-92" },
  { q: "4th", clock: "0:58.8", play: "2 of 2", score: "100-92" },
];
