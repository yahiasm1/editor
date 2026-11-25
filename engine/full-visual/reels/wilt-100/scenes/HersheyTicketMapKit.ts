// wilt-100 "hershey": the shared numbers of the scene. Every time is a word of caption.txt. The world behind the
// ticket fills the whole stage (y 520-1450): New York (old Madison Square Garden at night), then Pennsylvania (the
// real state outline from lat/lon), then Chocolate Avenue at night, which the camera reaches by diving into the pin.
import { Easing } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadCourier } from "@remotion/google-fonts/CourierPrime";
import { ease, prog, useScene } from "../../../src/engine";

export const HTM_OSWALD = loadOswald("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily;
export const HTM_COURIER = loadCourier("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;

export const HTM_AMBER = "#F2B33D"; // witness light: only the pin on Hershey carries it here
export const HTM_PAPER = "#EFE6D2";
export const HTM_INK = "#1B1B1B";
export const HTM_RED = "#C0322A"; // the red of the arena's own 1936 programme print
export const HTM_DIM = "#8B949E";
export const HTM_BG = "#0D1117";
export const HTM_LAMP = "#FFE9B8"; // incandescent street light, warmer than white, paler than the amber

export const htmLerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const htmClamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
/** a fixed pseudo-random number in [0, 1) */
export const htmRnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const HTM_PUSH = Easing.bezier(0.55, 0, 0.2, 1);

export function useHersheyT() {
  const { cue, cueEnd, scene } = useScene();
  return {
    born: scene.from - 6,
    march: cue("March"),
    two: cue("2,"),
    y1962: cue("1962."),
    y1962End: cueEnd("1962."),
    not: cue("Not"),
    big: cue("big"),
    city: cue("city"),
    arena: cue("arena,"),
    arenaEnd: cueEnd("arena,"),
    but: cue("but"),
    hershey: cue("Hershey,"),
    penn: cue("Pennsylvania,"),
    pennEnd: cueEnd("Pennsylvania,"),
    the: cue("the"),
    chocolate: cue("chocolate"),
    town: cue("town,"),
    townEnd: cueEnd("town,"),
    against: cue("against"),
    newY: cue("New"),
    york: cue("York"),
    knicks: cue("Knicks."),
    knicksEnd: cueEnd("Knicks."),
    end: scene.to,
  };
}
export type HersheyT = ReturnType<typeof useHersheyT>;

// ---------- Pennsylvania, from real coordinates (lon, lat), equirectangular at cos 41 deg ----------
export const HTM_PA: [number, number][] = [
  // north border along 42 N, from the Delaware at Hancock westward
  [-75.36, 42.0], [-76.0, 42.0], [-77.0, 42.0], [-78.0, 42.0], [-79.0, 42.0], [-79.76, 42.0],
  // Erie panhandle and the Lake Erie shore
  [-79.76, 42.27], [-79.9, 42.21], [-80.05, 42.15], [-80.12, 42.16], [-80.09, 42.12], [-80.25, 42.06], [-80.52, 41.98],
  // west border along 80.52 W
  [-80.52, 41.0], [-80.52, 40.64], [-80.52, 39.72],
  // Mason-Dixon line along 39.72 N
  [-79.0, 39.72], [-78.0, 39.72], [-77.0, 39.72], [-76.23, 39.72], [-75.79, 39.72],
  // the twelve-mile arc around New Castle, then the Delaware up its jagged course
  [-75.77, 39.76], [-75.7, 39.81], [-75.6, 39.84], [-75.5, 39.84], [-75.42, 39.81], [-75.36, 39.85], [-75.27, 39.88],
  [-75.17, 39.89], [-75.13, 39.95], [-75.07, 40.0], [-74.97, 40.05], [-74.85, 40.1], [-74.76, 40.18], [-74.76, 40.22],
  [-74.86, 40.29], [-74.95, 40.36], [-75.06, 40.42], [-75.1, 40.5], [-75.19, 40.59], [-75.2, 40.69], [-75.1, 40.8],
  [-75.06, 40.87], [-75.14, 40.97], [-75.0, 41.07], [-74.88, 41.15], [-74.8, 41.32], [-74.69, 41.36], [-74.99, 41.48],
  [-75.06, 41.61], [-75.06, 41.77], [-75.15, 41.85], [-75.28, 41.95], [-75.36, 42.0],
];
// the Susquehanna, North Branch from Sayre, West Branch from Lock Haven, joined at Sunbury, out at the Maryland line
export const HTM_SUSQ: [number, number][] = [
  [-76.52, 41.99], [-76.44, 41.77], [-76.2, 41.6], [-75.95, 41.45], [-75.88, 41.25], [-76.05, 41.12], [-76.23, 41.05],
  [-76.6, 40.97], [-76.79, 40.86], [-76.9, 40.6], [-76.98, 40.4], [-76.88, 40.26], [-76.73, 40.2], [-76.55, 40.06],
  [-76.39, 39.92], [-76.23, 39.72],
];
export const HTM_WBRANCH: [number, number][] = [
  [-78.2, 41.0], [-77.75, 41.12], [-77.45, 41.14], [-77.0, 41.24], [-76.87, 41.1], [-76.85, 41.01], [-76.79, 40.86],
];
export const HTM_CITIES = {
  hershey: [-76.6503, 40.2859] as [number, number],
  philadelphia: [-75.1652, 39.9526] as [number, number],
  newyork: [-74.006, 40.7128] as [number, number],
  pittsburgh: [-79.9959, 40.4406] as [number, number],
};
const LON0 = -77.2;
const LAT0 = 40.98;
const K = 187; // px per degree of latitude at scale 1
const COS = Math.cos((41 * Math.PI) / 180);
/** map space (px, at scale 1, origin at the map centre) */
export const htmMap = ([lon, lat]: [number, number]): [number, number] => [(lon - LON0) * COS * K, -(lat - LAT0) * K];
export const htmPath = (pts: [number, number][], close = false) =>
  pts.map((p, i) => { const [x, y] = htmMap(p); return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`; }).join(" ") + (close ? " Z" : "");

/** where the map centre sits on the frame */
export const HTM_MAP_C = { x: 540, y: 1130 };
/** the avenue's vanishing point: the camera dives into the pin and comes out here */
export const HTM_VP = { x: 540, y: 1092 };

/** the map camera: scale about the Hershey pin, and where the pin lands on the frame */
export function htmMapCam(f: number, T: HersheyT) {
  const k1 = prog(f, T.penn - 2, T.the - T.penn + 4, HTM_PUSH); // the push on "Pennsylvania"
  const k2 = prog(f, T.the - 2, 22, Easing.in(Easing.cubic)); // the dive into the pin on "the chocolate"
  const s = htmLerp(1, 2.3, k1) * htmLerp(1, 5.5, k2);
  const [hx, hy] = htmMap(HTM_CITIES.hershey);
  const pin0 = { x: HTM_MAP_C.x + hx, y: HTM_MAP_C.y + hy };
  const pin = { x: htmLerp(pin0.x, HTM_VP.x, k1 * 0.85 + k2 * 0.15), y: htmLerp(pin0.y, HTM_VP.y, k1 * 0.85 + k2 * 0.15) };
  return { s, pin, k1, k2 };
}

/** the avenue's pinhole camera: road at height 0, eye at 1.6 m, frame px per metre at 1 m */
export const HTM_EYE = 1.6;
export const HTM_F = 900;
export function htmProj(X: number, Y: number, Z: number) {
  const s = HTM_F / Z;
  return { x: HTM_VP.x + X * s, y: HTM_VP.y + (HTM_EYE - Y) * s, s };
}

/** the ticket's place on the frame: centre, then the top third, then back to the centre */
export function htmTicketPose(f: number, T: HersheyT) {
  const inK = prog(f, T.born, 20, ease.out);
  const up = prog(f, T.not - 4, 18, ease.inOut);
  const back = prog(f, T.against - 4, 18, ease.inOut);
  const cyC = 1000;
  const cyTop = 668;
  const cy = htmLerp(htmLerp(cyC, cyTop, up), 1010, back) + (1 - inK) * 520;
  const s = htmLerp(htmLerp(1, 0.68, up), 1.08, back);
  // a held paper keeps living: a slow sway, a breath of tilt
  const rot = Math.sin((f - T.born) / 46) * 0.9 + (1 - inK) * -6 + up * (1 - back) * -1.5;
  return { cx: 540, cy, s, rot, inK, up, back };
}
