// AllTimeList data: Basketball-Reference's "NBA Single Game Leaders and Records for Points"
// (assets/refs/pages/bbref-leaders-pts-game.html), as the list stood after January 22, 2006: today's rows with the
// two dated later (Luka Doncic 73 on 2024-01-26, Bam Adebayo 83 on 2026-03-10) taken out, ranks recomputed the way
// BBR prints them (a tie keeps one rank, the tied rows show a blank rank cell). Copy exactly as on the page,
// Hall of Fame asterisks included.

export const AllTimeListInk = "#111111";
export const AllTimeListGold = "#FDB927";
export const AllTimeListRule = "#D2D2D2";
export const AllTimeListHeadBg = "#EBEBEB";
export const AllTimeListHover = "#FFF7C2"; // the pale yellow row highlight Kobe's row carries over from `eightyone`

/** the white page */
export const AllTimeListCard = { x: 36, w: 1008, top: 742 };

/** vertical layout: heading, header row, then the rows */
export const AllTimeListY = { h1: 750, rule: 800, head: 806, headH: 44, rows: 850, wiltH: 200, kobeH: 150, lowH: 42 };

/** columns, stage x */
export const AllTimeListCol = { rankR: 100, name: 120, hero: 262, photo: 108, ptsL: 576, ptsR: 692, date: 708, tm: 936 };

export type AllTimeListRowData = { rank: string; player: string; pts: string; date: string; tm: string };

export const AllTimeListWilt: AllTimeListRowData = { rank: "1.", player: "Wilt Chamberlain*", pts: "100", date: "1962-03-02", tm: "PHW" };
export const AllTimeListKobe: AllTimeListRowData = { rank: "2.", player: "Kobe Bryant*", pts: "81", date: "2006-01-22", tm: "LAL" };

/** the rows under Kobe's, top to bottom; they write in from the bottom up */
export const AllTimeListLower: AllTimeListRowData[] = [
  { rank: "3.", player: "Wilt Chamberlain*", pts: "78", date: "1961-12-08", tm: "PHW" },
  { rank: "4.", player: "David Thompson*", pts: "73", date: "1978-04-09", tm: "DEN" },
  { rank: "", player: "Wilt Chamberlain*", pts: "73", date: "1962-11-16", tm: "SFW" },
  { rank: "", player: "Wilt Chamberlain*", pts: "73", date: "1962-01-13", tm: "PHW" },
  { rank: "7.", player: "Wilt Chamberlain*", pts: "72", date: "1962-11-03", tm: "SFW" },
];

export const AllTimeListFiles = {
  wilt: "kobe-81/alltimelist-wilt-100.jpg", // AP, Mar 2 1962, public domain (crop keeps the "100" sign)
  kobe: "kobe-81/alltimelist-kobe-msg.jpg", // David Watterson, CC BY 2.0, MSG Feb 2006
  warriors: "kobe-81/alltimelist-warriors.svg",
  lakers: "kobe-81/nba-lakers-primary.svg",
  arena: "kobe-81/commons-kobe-81-night-staples-2006-endlessbender-ccby2.jpg",
};
