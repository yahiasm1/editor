// His 29 field goal attempts, Basketball-Reference shot chart 202611210SAS (assets/refs/wemby-shots-court.json):
// feet from the rim centre, x to the viewer's right, y toward half court; pts = what a make was worth (2 or 3).
// made = BBR's filled dot, missed = its x. 20 made (15 twos, 5 threes) = 45; with his 5 made free throws, 50.
export type HookX5Shot = { n: number; made: boolean; pts: 2 | 3; x: number; y: number };
export const HOOKX5_SHOTS: HookX5Shot[] = [
  { n: 1, made: false, pts: 3, x: 7.48, y: 26.43 },
  { n: 2, made: true, pts: 2, x: 0.19, y: -0.49 },
  { n: 3, made: true, pts: 2, x: 0.09, y: 0.82 },
  { n: 4, made: false, pts: 2, x: -0.21, y: 2.65 },
  { n: 5, made: true, pts: 2, x: 0.19, y: -0.49 },
  { n: 6, made: true, pts: 3, x: -9.12, y: 24.1 },
  { n: 7, made: true, pts: 2, x: 1.1, y: 0.42 },
  { n: 8, made: false, pts: 3, x: 5.46, y: 26.43 },
  { n: 9, made: true, pts: 2, x: 3.94, y: 0.82 },
  { n: 10, made: true, pts: 2, x: 7.89, y: 15.9 },
  { n: 11, made: true, pts: 2, x: 0.29, y: 4.97 },
  { n: 12, made: true, pts: 3, x: -23.9, y: -0.69 },
  { n: 13, made: true, pts: 2, x: 0.6, y: 0.93 },
  { n: 14, made: true, pts: 2, x: 8.7, y: 12.56 },
  { n: 15, made: true, pts: 3, x: 7.68, y: 25.22 },
  { n: 16, made: true, pts: 2, x: 6.06, y: 13.58 },
  { n: 17, made: false, pts: 3, x: -21.16, y: 12.77 },
  { n: 18, made: true, pts: 2, x: 0.6, y: 0.01 },
  { n: 19, made: true, pts: 2, x: 1.0, y: 0.93 },
  { n: 20, made: false, pts: 3, x: 10.11, y: 22.79 },
  { n: 21, made: false, pts: 3, x: 2.93, y: 25.01 },
  { n: 22, made: true, pts: 2, x: 3.43, y: 0.22 },
  { n: 23, made: false, pts: 2, x: 9.81, y: 14.99 },
  { n: 24, made: true, pts: 2, x: 0.6, y: -0.29 },
  { n: 25, made: true, pts: 2, x: 0.7, y: -0.39 },
  { n: 26, made: false, pts: 2, x: 1.51, y: -0.49 },
  { n: 27, made: true, pts: 3, x: -21.57, y: 13.37 },
  { n: 28, made: false, pts: 3, x: 13.05, y: 22.08 },
  { n: 29, made: true, pts: 3, x: 10.52, y: 22.38 },
];

/** the court in feet: rim centre 5.25 ft from the baseline; the free throw line 19 ft from the baseline */
export const HOOKX5_RIM_Y = 5.25;
export const HOOKX5_FT_Y = 19 - HOOKX5_RIM_Y;

/**
 * What pays into the 50, in order: his 20 makes in game order, then his 5 made free throws on the line (NBA.com row:
 * FTM 5, FTA 6). Each sits on a gold disc, the chance it cost; a free throw's disc is smaller (0.44 of a chance).
 * stack: how far the disc sits up a pile of earlier discs within a disc's width (the rim makes pile up).
 */
export type HookX5Pay = { x: number; y: number; pts: 1 | 2 | 3; ft: boolean; shot: number; stack: number };
export const HOOKX5_PAY: HookX5Pay[] = (() => {
  const out: HookX5Pay[] = [];
  HOOKX5_SHOTS.forEach((s, i) => {
    if (!s.made) return;
    const stack = out.filter((o) => Math.hypot(o.x - s.x, o.y - s.y) < 1.5).length;
    out.push({ x: s.x, y: s.y, pts: s.pts, ft: false, shot: i, stack });
  });
  [-3.4, -1.7, 0, 1.7, 3.4].forEach((x) => out.push({ x, y: HOOKX5_FT_Y, pts: 1, ft: true, shot: -1, stack: 0 }));
  return out;
})();

/** the nine misses, in game order: the order they are hammered in, #28 on "29" */
export const HOOKX5_MISSES: number[] = HOOKX5_SHOTS.map((s, i) => (s.made ? -1 : i)).filter((i) => i >= 0);
