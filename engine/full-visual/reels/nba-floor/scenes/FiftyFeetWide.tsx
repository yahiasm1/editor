// Scene `width`: "An NBA court is fifty feet wide, and the basket sits right in the middle, twenty-five feet from each
// sideline." The real Ball Arena floor (2026) lifts out of the photo, turns and lies flat as the reel's top-down
// court ("NBA court"). The Lufkin tape is hooked on the left sideline ("is") and walked to the right one, reading 50'
// 0" ("50"); the blade snaps taut ("feet wide"). The camera dives to the basket, ring and net rising under the lens
// ("basket"); under its middle the blade reads 25 ("sits right in"); a steel pin pinches the blade there ("middle");
// the camera pulls back while gold runs out both halves to 25' 0" ("25 feet from each"); both sidelines pulse
// ("sideline"). Notes: notes/FiftyFeetWide.md.
import React from "react";
import { Img, staticFile } from "remotion";
import { blurIn, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { FiftyFeetWideBasket, FiftyFeetWideFloor } from "./FiftyFeetWideFloor";
import { FiftyFeetWideBlade, FiftyFeetWideCase, FiftyFeetWideMark25, FiftyFeetWidePin } from "./FiftyFeetWideTape";
import {
  FFW_PHOTO_H, ffwApplyH, ffwCamProj, ffwFeet, ffwHomography, ffwHProj, ffwInvH, ffwMatrix3d, ffwMixCam, ffwMulH,
  ffwTurnQuad, type FfwCam,
} from "./FiftyFeetWideWorld";

const GOLD = "#F2B33D";
const GREY = "#8B949E";
const INK = "#F0F3F6";

// the wide frames look down from high (near-orthographic), so the ring 10 ft up sits over its floor point
const wideCam = (ppf: number, baseY: number): FfwCam => ({ tx: 0, ty: 10, D: 400, F: 400 * ppf, cx: 540, cy: baseY - ppf * 15.25 });
const WIDE_A = wideCam(18.5, 1414);
const WIDE_B = wideCam(19.0, 1420);
const CLOSE = { tx: 0, ty: 0, D: 30, F: 30 * 88, cx: 540, cy: 1010 };
const CLOSE2 = { tx: 0.05, ty: 0, D: 27, F: 27 * 98, cx: 540, cy: 1010 };
const WIDE_END = wideCam(19.25, 1424);
const WIDE_END2 = wideCam(19.5, 1427);

// the card: 1000 x 750 on the stage's centre; the photo pushes toward the floor inside it
const CARD = { x: 40, y: 610, w: 1000, h: 750 };
const PW = 1280, PH = 960;
const COURT: [number, number][] = [[-25, -5.25], [25, -5.25], [25, 41.75], [-25, 41.75]];
const PHOTO_INV = ffwInvH(FFW_PHOTO_H);
const FLOOR_CLIP = ([[-28.5, -8.6], [28.5, -8.6], [28.5, 92.1], [-28.5, 92.1]] as [number, number][])
  .map(([x, y]) => ffwApplyH(FFW_PHOTO_H, x, y))
  .map(([u, v]) => `${u.toFixed(1)}px ${v.toFixed(1)}px`)
  .join(",");

function useFiftyFeetWideT() {
  const { cue, scene } = useScene();
  return {
    mount: scene.from - LEAD, end: scene.to, nba: cue("NBA"), court: cue("court"), is: cue("is"), n50: cue("50"),
    feet: cue("feet"), wide: cue("wide"), and: cue("and"), basket: cue("basket"), sits: cue("sits"), right: cue("right"),
    middle: cue("middle"), n25: cue("25"), feet2: cue("feet", 2), each: cue("each"), sideline: cue("sideline"),
  };
}
type FFT = ReturnType<typeof useFiftyFeetWideT>;

function cameraOf(f: number, T: FFT): FfwCam {
  const keys: [number, FfwCam, (t: number) => number][] = [
    [T.mount, WIDE_A, ease.linear],
    [T.is, WIDE_A, ease.linear],
    [T.and - 10, WIDE_B, ease.linear],
    [T.basket + 4, CLOSE, ease.inOut],
    [T.n25 - 14, CLOSE2, ease.linear],
    [T.n25 + 22, WIDE_END, ease.inOut],
    [T.end - LEAD, WIDE_END2, ease.linear],
  ];
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) {
      const [a, ca] = keys[i - 1];
      const [b, cb, e] = keys[i];
      return ffwMixCam(ca, cb, e(Math.max(0, Math.min(1, (f - a) / Math.max(1, b - a)))));
    }
  }
  return keys[keys.length - 1][1];
}

/** photo px -> screen: the card's push toward the floor */
function photoView(f: number, T: FFT) {
  const p = prog(f, T.mount, T.court + 8 - T.mount, ease.inOut);
  const k = (1000 / 1280) * (1 + 0.5 * p);
  const au = 640 + (712 - 640) * p;
  const av = Math.min(480 + (690 - 480) * p, PH - (CARD.y + CARD.h - 985) / k);
  const ox = 540 - k * au, oy = 985 - k * av;
  return { k, ox, oy, S: [k, 0, ox, 0, k, oy, 0, 0, 1] };
}

const FiftyFeetWideCross: React.FC<{ x: number; y: number; at: number; f: number; size: number }> = ({ x, y, at, f, size }) => {
  const p = prog(f, at, 9, ease.back);
  if (p <= 0) return null;
  const s = size * p;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: prog(f, at, 3, ease.linear) }}>
      <g transform={`translate(${x} ${y}) rotate(${45 * (1 - p)})`} strokeLinecap="round">
        <line x1={-s} y1={-s} x2={s} y2={s} stroke="#0D1117" strokeWidth={10} />
        <line x1={-s} y1={s} x2={s} y2={-s} stroke="#0D1117" strokeWidth={10} />
        <line x1={-s} y1={-s} x2={s} y2={s} stroke="#FFFFFF" strokeWidth={5} />
        <line x1={-s} y1={s} x2={s} y2={-s} stroke="#FFFFFF" strokeWidth={5} />
      </g>
    </svg>
  );
};

const FiftyFeetWideReading: React.FC<{ x: number; y: number; text: string; color: string; a: number; size?: number; pop?: number }> = ({ x, y, text, color, a, size = 60, pop = 0 }) =>
  a <= 0 ? null : (
    <div style={{ position: "absolute", left: x - 300, width: 600, top: y - size * 0.6, textAlign: "center", fontFamily: "Figtree, sans-serif", fontWeight: 800, fontSize: size, lineHeight: 1.2, color, opacity: a, whiteSpace: "nowrap", textShadow: "0 3px 14px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)", transform: `scale(${1 + pop})`, fontVariantNumeric: "tabular-nums" }}>
      {text}
    </div>
  );

export const FiftyFeetWide: React.FC = () => {
  const { f } = useScene();
  const T = useFiftyFeetWideT();
  const cam = cameraOf(f, T);
  const camP = ffwCamProj(cam);

  // ---- the lift: the real floor leaves the photo, turns 90 degrees and lies flat in the camera's frame
  const view = photoView(f, T);
  const liftAt = T.nba + 1;
  const liftDur = T.is - 3 - liftAt;
  const lt = prog(f, liftAt, liftDur, ease.inOut);
  const from = COURT.map(([x, y]) => {
    const [u, v] = ffwApplyH(FFW_PHOTO_H, x, y);
    return [view.ox + view.k * u, view.oy + view.k * v] as [number, number];
  });
  const to = COURT.map(([x, y]) => {
    const p = camP(x, y);
    return [p.x, p.y] as [number, number];
  });
  const lifting = lt < 1;
  const quad = lifting ? ffwTurnQuad(from, to, lt, -Math.PI / 2, 0.07 * Math.sin(Math.PI * lt)) : to;
  const Ht = ffwHomography(COURT, quad);
  const floorP = lifting ? ffwHProj(Ht) : camP;
  const photoFloorM = ffwMatrix3d(ffwMulH(Ht, PHOTO_INV));
  const photoFloorA = 1 - prog(f, liftAt + liftDur * 0.18, liftDur * 0.3, ease.linear);
  const drawnA = prog(f, liftAt + liftDur * 0.12, liftDur * 0.32, ease.linear);
  const basketA = prog(f, liftAt + liftDur * 0.82, liftDur * 0.18 + 2, ease.linear);
  const dim = prog(f, T.nba - 6, 14, ease.out);
  const cardA = prog(f, T.mount, 8, ease.out) * (1 - prog(f, liftAt + 8, 18, ease.in));
  const shadowQuad = lifting ? ffwTurnQuad(from, to, lt, -Math.PI / 2, 0.07 * Math.sin(Math.PI * lt) + 0.02) : null;

  // ---- the tape
  const hookAt = T.is;
  const payA = T.n50 - 10, payB = T.n50 + 11;
  const pay = prog(f, payA, payB - payA, ease.inOut);
  const xf = f < payA ? -24.3 : -24.3 + (25 - -24.3) * pay;
  const snap = T.feet;
  const dts = f - snap;
  const bow = f < snap ? 0.85 * Math.min(1, pay * 3) : 0.85 * Math.exp(-dts / 3.5) * Math.cos(dts * 0.75);
  const tapeIn = prog(f, hookAt - 9, 9, ease.in);
  const pinDrop = prog(f, T.middle - 12, 12, ease.in);
  const dtp = f - T.middle;
  const pinZ = f < T.middle ? 9.5 * (1 - pinDrop) : Math.max(0, Math.sin(dtp / 3) * Math.exp(-dtp / 4) * 0.35);
  const pinA = prog(f, T.middle - 12, 4, ease.linear);
  const goldA = T.n25 - 6, goldB = T.feet2 - 4;
  const gold = prog(f, goldA, goldB - goldA, ease.inOut);
  const mark = prog(f, T.sits + 2, 8) * (1 - prog(f, T.n25 - 4, 12));
  const markLabel = prog(f, T.sits + 2, 8) * (1 - prog(f, T.n25 - 16, 8, ease.in));
  const sway = f >= T.basket ? 0.32 * Math.sin((f - T.basket) / 5) * Math.exp(-(f - T.basket) / 22) : 0;
  const sidePulse = prog(f, T.sideline - 2, 6) * (1 - 0.75 * prog(f, T.sideline + 8, 26, ease.linear));

  // the case, held at shoe height at the blade's end; dropped in just before "is"
  const caseZ = 6 * (1 - tapeIn);
  const caseTip = camP(xf, 0, caseZ);
  const caseR = Math.max(34, Math.min(70, 1.9 * caseTip.s)) * (1 + 0.6 * (1 - tapeIn));
  const caseC = { x: caseTip.x, y: caseTip.y - caseR };
  const crank = -30 + pay * 1470;

  // readings
  const b0 = camP(0, 0);
  const front = camP(xf, 0);
  const payRead = f >= hookAt && f < snap + 14;
  const readX = Math.max(150, Math.min(930, front.x));
  const fiftyA = prog(f, snap, 8) * (1 - prog(f, T.and, 12, ease.in));
  const fiftyAt = camP(0, 4.2);
  const gL = camP(-25 * gold, 0), gR = camP(25 * gold, 0);
  const goldTxt = ffwFeet(25 * gold);
  // the gold readings wait until the pull-back is past halfway, clear of the restricted arc
  const goldRA = prog(f, T.n25 + 4, 6);
  const pop = f >= T.sideline ? 0.08 * Math.sin(Math.min(1, (f - T.sideline) / 12) * Math.PI) : 0;
  const tickA = prog(f, snap, 8) * (1 - prog(f, T.and, 10));
  const sideL = camP(-25, 0), sideR = camP(25, 0);
  const n25 = camP(0.5, 0);
  // the cross and the pin's head give way to the arc scene's ring on the pin at the handover
  const crossA = 1 - prog(f, T.end - LEAD - 10, 10);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the arena photo card: the stands go dark around the floor, then drop away */}
      {cardA > 0 && (
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 24, overflow: "hidden", background: "#161B22", border: "2px solid #30363D", opacity: cardA, transform: `translateY(${(1 - cardA) * 30}px) scale(${1 - 0.03 * (1 - cardA)})` }}>
          <Img src={staticFile("nba-floor/fiftyfeetwide-ballarena.jpg")} style={{ position: "absolute", left: view.ox - CARD.x, top: view.oy - CARD.y, width: PW * view.k, height: PH * view.k, filter: `brightness(${1 - 0.6 * dim}) saturate(${1 - 0.3 * dim})` }} />
          <div style={{ position: "absolute", right: 18, top: 14, fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 22, color: GREY, textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>MhcL947, CC BY-SA 4.0</div>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: "linear-gradient(to bottom, transparent 0, transparent 505px, #000 590px, #000 1560px, transparent 1700px)" }}>
        {shadowQuad && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs><filter id="ffw-liftsh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={18} /></filter></defs>
            <path d={`M${shadowQuad.map((p) => `${(p[0] + 14).toFixed(1)} ${(p[1] + 26).toFixed(1)}`).join("L")}Z`} fill="#000" opacity={0.55 * Math.sin(Math.PI * lt)} filter="url(#ffw-liftsh)" />
          </svg>
        )}
        {drawnA > 0 && (
          <div style={{ position: "absolute", inset: 0, opacity: drawnA }}>
            <FiftyFeetWideFloor P={floorP} f={f} side={[sidePulse, sidePulse]} />
          </div>
        )}
        {photoFloorA > 0 && (
          <Img
            src={staticFile("nba-floor/fiftyfeetwide-ballarena.jpg")}
            style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, transformOrigin: "0 0", transform: photoFloorM, clipPath: `polygon(${FLOOR_CLIP})`, opacity: photoFloorA, filter: `brightness(${1 + 0.12 * dim})` }}
          />
        )}
        {/* the tape: blade on the boards, the basket's middle, the pin */}
        {f >= hookAt - 9 && !lifting && (
          <div style={{ opacity: tapeIn }}>
            <FiftyFeetWideBlade P={camP} f={f} st={{ xf, bow, pin: f >= T.middle - 12 ? 1 : 0, pinZ, gold, mark }} />
          </div>
        )}
        {!lifting && crossA > 0 && <div style={{ opacity: crossA }}><FiftyFeetWideCross x={b0.x} y={b0.y} at={T.basket} f={f} size={Math.max(9, b0.s * 0.2)} /></div>}
        <FiftyFeetWideBasket P={camP} f={f} sway={sway} opacity={basketA} />
        {!lifting && <FiftyFeetWideMark25 P={camP} a={mark} />}
        {!lifting && <FiftyFeetWidePin P={camP} pinZ={pinZ} a={pinA * (1 - prog(f, T.end - LEAD - 10, 10))} seatAge={f - T.middle} />}
        {f >= hookAt - 9 && !lifting && <FiftyFeetWideCase x={caseC.x} y={caseC.y} R={caseR} crank={crank} lift={1 - tapeIn} f={f} />}
      </div>

      {/* the payout reading rides the case, counting to 50' 0" */}
      {payRead && <FiftyFeetWideReading x={readX} y={front.y - 92} text={ffwFeet(xf + 25)} color={INK} a={prog(f, hookAt, 6) * (1 - prog(f, snap + 4, 10))} size={58} />}
      {/* taut: 50 ft across the floor, bracketed at both sidelines */}
      {tickA > 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: tickA }}>
          {[sideL, sideR].map((p, i) => (
            <line key={i} x1={p.x} y1={p.y - 30} x2={p.x} y2={p.y - 120} stroke="#FFFFFF" strokeWidth={3} />
          ))}
          <line x1={sideL.x} y1={sideL.y - 75} x2={sideL.x + (sideR.x - sideL.x) * 0.36} y2={sideL.y - 75} stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={2} />
          <line x1={sideL.x + (sideR.x - sideL.x) * 0.64} y1={sideL.y - 75} x2={sideR.x} y2={sideL.y - 75} stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={2} />
        </svg>
      )}
      <FiftyFeetWideReading x={fiftyAt.x} y={sideL.y - 77} text="50 ft" color={INK} a={fiftyA} size={70} pop={0.1 * (1 - prog(f, snap, 10))} />
      {/* the tape reads 25 right under the basket's middle */}
      {markLabel > 0 && (
        <>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: markLabel }}>
            <line x1={n25.x + 6} y1={n25.y + 30} x2={n25.x + 150} y2={n25.y + 330} stroke={GREY} strokeWidth={2.5} />
            
          </svg>
          <div style={{ position: "absolute", left: n25.x + 150 - 300, width: 600, top: n25.y + 338, textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 40, color: "#E6EDF3", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.9)", ...blurIn(f, T.sits + 4, { dur: 8, rise: 8 }), opacity: markLabel }}>
            the tape reads 25 here
          </div>
        </>
      )}
      {/* gold: distance from the basket, counted out both halves */}
      {gold > 0 && (
        <>
          <FiftyFeetWideReading x={Math.max(150, Math.min(390, gL.x))} y={gL.y - 92} text={goldTxt} color={GOLD} a={goldRA} pop={pop} />
          <FiftyFeetWideReading x={Math.min(930, Math.max(690, gR.x))} y={gR.y - 92} text={goldTxt} color={GOLD} a={goldRA} pop={pop} />
        </>
      )}
      <div style={{ position: "absolute", left: 60, top: 1500, fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 26, color: GREY, ...blurIn(f, T.wide, { dur: 8 }), opacity: Math.min(1, prog(f, T.wide, 8) * (1 - prog(f, T.and, 8)) + prog(f, T.n25 + 10, 10)) * (1 - prog(f, T.end - LEAD - 10, 10)) }}>
        NBA Rule 1, Court Dimensions
      </div>
    </div>
  );
};

// hands over in place: `arc` mounts on this same picture (camera, both blade halves, case on the right sideline)
(FiftyFeetWide as unknown as { keep: boolean }).keep = true;
