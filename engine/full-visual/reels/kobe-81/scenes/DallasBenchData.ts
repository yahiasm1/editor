// DallasBench data: every scoring play of Dec 20 2005, Mavericks at Lakers (BBR play-by-play), as game time, plus
// one entry per point for the bulbs: Kobe's in gold, Dallas's in Mavericks blue. Nothing here is typed by hand.
import scoring from "../assets/refs/dallas-scoring.json";

type Raw = { q: number; clock: string; team: string; pts: number; kobe: boolean; play: string; dal: number; lal: number; kobe_total: number };
const raw = (scoring as { events: Raw[] }).events;

export const DallasBenchParse = (c: string) => {
  const [m, s] = c.split(":");
  return Number(m) * 60 + Number(s);
};

/** game time elapsed, in seconds from the opening tip (720 s a quarter) */
export type DallasBenchEvent = Raw & { gt: number };
export const DallasBenchEvents: DallasBenchEvent[] = raw.map((e) => ({ ...e, gt: (e.q - 1) * 720 + (720 - DallasBenchParse(e.clock)) }));

/** one per point, in order: which team, the game time it was scored, its index on its own board */
export type DallasBenchPoint = { gt: number; i: number };
const pointsOf = (pred: (e: DallasBenchEvent) => boolean) => {
  const out: DallasBenchPoint[] = [];
  for (const e of DallasBenchEvents) if (pred(e)) for (let k = 0; k < e.pts; k++) out.push({ gt: e.gt, i: out.length });
  return out;
};
export const DallasBenchKobe = pointsOf((e) => e.kobe); // 62
export const DallasBenchDal = pointsOf((e) => e.team === "DAL"); // 90

/** the running scores at a game time */
export const DallasBenchScoreAt = (gt: number) => {
  let dal = 0;
  let lal = 0;
  let kobe = 0;
  for (const e of DallasBenchEvents) {
    if (e.gt > gt) break;
    dal = e.dal;
    lal = e.lal;
    kobe = e.kobe_total;
  }
  return { dal, lal, kobe };
};

/** the moment Kobe's 3 went in, 0:04.4 left in the 3rd: 62 against 61 */
export const DallasBenchGt62 = DallasBenchEvents.find((e) => e.kobe && e.kobe_total === 62)!.gt; // 2155.6

/** arena clock text from seconds left in the period: m:ss, tenths under a minute */
export const DallasBenchClock = (left: number) => {
  if (left >= 60) {
    const s = Math.floor(left);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }
  return (Math.floor(left * 10 + 1e-6) / 10).toFixed(1);
};
