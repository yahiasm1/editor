// His 29 field goal attempts, Basketball-Reference shot chart 202611210SAS (assets/refs/wemby-shots-court.json):
// feet from the rim centre, x to the viewer's right, y toward half court. made = BBR's filled dot, missed = its x.
export type HookX1Shot = { n: number; made: boolean; x: number; y: number };
export const HOOKX1_SHOTS: HookX1Shot[] = [
  { n: 1, made: false, x: 7.48, y: 26.43 },
  { n: 2, made: true, x: 0.19, y: -0.49 },
  { n: 3, made: true, x: 0.09, y: 0.82 },
  { n: 4, made: false, x: -0.21, y: 2.65 },
  { n: 5, made: true, x: 0.19, y: -0.49 },
  { n: 6, made: true, x: -9.12, y: 24.1 },
  { n: 7, made: true, x: 1.1, y: 0.42 },
  { n: 8, made: false, x: 5.46, y: 26.43 },
  { n: 9, made: true, x: 3.94, y: 0.82 },
  { n: 10, made: true, x: 7.89, y: 15.9 },
  { n: 11, made: true, x: 0.29, y: 4.97 },
  { n: 12, made: true, x: -23.9, y: -0.69 },
  { n: 13, made: true, x: 0.6, y: 0.93 },
  { n: 14, made: true, x: 8.7, y: 12.56 },
  { n: 15, made: true, x: 7.68, y: 25.22 },
  { n: 16, made: true, x: 6.06, y: 13.58 },
  { n: 17, made: false, x: -21.16, y: 12.77 },
  { n: 18, made: true, x: 0.6, y: 0.01 },
  { n: 19, made: true, x: 1.0, y: 0.93 },
  { n: 20, made: false, x: 10.11, y: 22.79 },
  { n: 21, made: false, x: 2.93, y: 25.01 },
  { n: 22, made: true, x: 3.43, y: 0.22 },
  { n: 23, made: false, x: 9.81, y: 14.99 },
  { n: 24, made: true, x: 0.6, y: -0.29 },
  { n: 25, made: true, x: 0.7, y: -0.39 },
  { n: 26, made: false, x: 1.51, y: -0.49 },
  { n: 27, made: true, x: -21.57, y: 13.37 },
  { n: 28, made: false, x: 13.05, y: 22.08 },
  { n: 29, made: true, x: 10.52, y: 22.38 }
];
