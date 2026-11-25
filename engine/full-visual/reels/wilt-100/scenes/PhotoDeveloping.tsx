// wilt-100 "photo": "Even the famous photo was an accident. In the locker room, the team's PR man scribbled 100 on a
// piece of paper, and a photographer who had only come to treat his son snapped Wilt holding it up."
// The payoff. The locker room of the 1962 photo (coats on hooks, a bench), an empty developer tray on the bench. A
// blank print drops onto a hook, slips off and lands in the tray: nobody planned it. The WILT counter floats down, a
// sheet slides under it and the PR man's hand writes the real 100 (the strokes cut from the photo) over the printed
// one. The real Speed Graphic rises, the press bulb fires (amber, a witness) and goes milky; the view drops into the
// tray where the real AP photo comes up out of white, darkest tones first, and is lifted out big on "up."
// Parts: Kit (times, images), Room (wall, coats, bench), Tray (tray, print, tongs, drips), Sheet (counter, sheet, ink,
// hand), Camera (the cut-out Speed Graphic, the bulb).
import React from "react";
import { ease, useScene } from "../../../src/engine";
import { PD_AMBER, pdClamp, pdDown, pdK, pdLerp, pdLift, pdRnd, usePdImages, usePhotoT, type PhotoT } from "./PhotoDevelopingKit";
import { PD_RAIL_Y, PhotoDevelopingRoom, PhotoDevelopingRoomDefs } from "./PhotoDevelopingRoom";
import {
  PD_PRINT,
  PhotoDevelopingCredit,
  PhotoDevelopingDrips,
  PhotoDevelopingLiquid,
  PhotoDevelopingPrint,
  PhotoDevelopingTongs,
  PhotoDevelopingTray,
  PhotoDevelopingTrayDefs,
  pdPrintView,
  type TrayView,
} from "./PhotoDevelopingTray";
import { PhotoDevelopingCounter, PhotoDevelopingHand, PhotoDevelopingSheet, PhotoDevelopingSheetDefs, type SheetView, pdTip } from "./PhotoDevelopingSheet";
import { PhotoDevelopingCamera, pdBulbAt, type CamView } from "./PhotoDevelopingCamera";

const FULL = { position: "absolute" as const, inset: 0 };

/** frame the blank print lands in the tray */
const pdLand = (T: PhotoT) => T.accident + 16;

function trayView(f: number, T: PhotoT): TrayView {
  const d = pdDown(f, T);
  const lift = pdLift(f, T);
  return {
    cx: 540,
    cy: pdLerp(1182, 990, d) + 260 * lift + Math.sin(f / 31) * 2,
    s: pdLerp(1.1, 1.25, d),
    S: pdLerp(0.46, 0.9, d),
  };
}

function sheetView(f: number, T: PhotoT): SheetView {
  const inn = pdK(f, T.man - 6, 16);
  const side = pdK(f, T.photographer - 4, 24);
  const settle = pdK(f, T.paper - 2, 18, ease.back);
  return {
    cx: pdLerp(540, 760, side),
    cy: pdLerp(1700, 880, inn) + pdLerp(0, -120, side),
    s: pdLerp(0.95, 0.5, side),
    rot: pdLerp(pdLerp(-4, 0, inn), 7, settle),
  };
}

function camView(f: number, T: PhotoT): CamView {
  const rise = pdK(f, T.photographer - 8, 22, ease.out);
  const lift = pdK(f, T.who, T.come + 10 - T.who);
  const kick = f >= T.snapped ? Math.exp(-(f - T.snapped) / 5) * Math.sin((f - T.snapped) * 1.3) : 0;
  return { x: -40, y: pdLerp(1750, 700, rise) - 34 * lift + kick * 6, s: 0.86, rot: pdLerp(6, 0, rise) - 3 * lift + kick * 0.6 };
}

/** the hand's marker tip: hover, the strokes (with the quick travel between them), then away */
function handAt(f: number, T: PhotoT, V: SheetView): { x: number; y: number; o: number; press: number } {
  const start = pdTip(T.s1[0], T, sheetView(T.s1[0], T)) ?? [540, 850];
  const enter = pdK(f, T.pr - 4, 18, ease.out);
  const away = pdK(f, T.paper - 4, 16, ease.in);
  let p = pdTip(f, T, V) ?? start;
  // between strokes the pen lifts and travels to the next start
  const gaps: [number, number][] = [
    [T.s1[0] + T.s1[1], T.s2[0]],
    [T.s2[0] + T.s2[1], T.s3[0]],
  ];
  let press = 3;
  for (const [a, b] of gaps) {
    if (f > a && f < b) {
      const k = (f - a) / (b - a);
      const from = pdTip(a, T, V)!;
      const to = pdTip(b, T, V)!;
      p = [pdLerp(from[0], to[0], ease.inOut(k)), pdLerp(from[1], to[1], ease.inOut(k)) - Math.sin(k * Math.PI) * 18];
      press = 0;
    }
  }
  if (f < T.s1[0]) p = [pdLerp(1250, start[0], enter), pdLerp(start[1] + 120, start[1] - 10 * (1 - pdK(f, T.s1[0] - 8, 8)), enter)];
  return { x: p[0] + away * 760, y: p[1] + away * 160, o: pdClamp(enter * 3) * (1 - pdK(f, T.paper + 14, 6)), press };
}

/** the blank print before it lands: arriving on the centre hook, swinging, then slipping off into the tray */
function fallingPrint(f: number, T: PhotoT, Vt: TrayView) {
  const land = pdLand(T);
  if (f < T.photo - 14 || f >= land) return null;
  const hw = 250;
  const hangY = PD_RAIL_Y + 30;
  if (f < T.accident) {
    const drop = pdK(f, T.photo - 14, 14, ease.in);
    const swing = f >= T.photo ? 9 * Math.exp(-(f - T.photo) / 14) * Math.sin((f - T.photo) / 3.2) : 0;
    return { cx: 540, top: pdLerp(-500, hangY, drop), s: hw / PD_PRINT.w, S: 1, rot: swing, pivot: true };
  }
  const k = (f - T.accident) / (land - T.accident);
  const P = pdPrintView(Vt, 0);
  const g = ease.in(k);
  const topNow = pdLerp(hangY, P.cy - (PD_PRINT.h / 2) * P.s * P.S, g);
  return {
    cx: pdLerp(540, P.cx, k) + Math.sin(k * Math.PI) * 50,
    top: topNow,
    s: pdLerp(hw / PD_PRINT.w, P.s, ease.out(k)),
    S: pdLerp(1, P.S, ease.in(k)),
    rot: Math.sin(k * Math.PI) * 24,
    pivot: false,
  };
}

const Splash: React.FC<{ f: number; land: number; cx: number; cy: number }> = ({ f, land, cx, cy }) => {
  const t = f - land;
  if (t < 0 || t > 34) return null;
  return (
    <g>
      {Array.from({ length: 26 }, (_, i) => {
        const a = -Math.PI * (0.08 + 0.84 * pdRnd(i * 1.9));
        const v = 7 + 9 * pdRnd(i * 4.1);
        const x = cx + (pdRnd(i * 2.7) - 0.5) * 380 + Math.cos(a) * v * t;
        const y = cy + (pdRnd(i * 6.3) - 0.5) * 120 + Math.sin(a) * v * t + 0.5 * 0.9 * t * t;
        const o = pdClamp(1 - t / 34);
        return <ellipse key={i} cx={x} cy={y} rx={3 + pdRnd(i) * 3} ry={4 + pdRnd(i) * 4} fill="rgba(228,232,224,0.8)" opacity={o} />;
      })}
    </g>
  );
};

export const PhotoDeveloping: React.FC = () => {
  const { f, theme } = useScene();
  const T = usePhotoT();
  const img = usePdImages();
  if (!img) return <div style={{ ...FULL, background: "#0D1117" }} />;
  const font = theme.font.ui;
  const down = pdDown(f, T);
  const lift = pdLift(f, T);
  const Vt = trayView(f, T);
  const land = pdLand(T);
  const Vs = sheetView(f, T);
  const Vc = camView(f, T);

  // the room: the bulb comes on, a slow push toward the sheet while it is written, then the view drops to the tray
  const light = pdK(f, T.born, 26, ease.out);
  const push = 1 + 0.05 * pdK(f, T.inn, T.paper - T.inn, ease.linear);
  const roomY = -1100 * down;
  const roomO = 1 - 0.75 * down;

  // the counter, floating down into the room, then sinking into the sheet as the ink takes its place
  const cin = pdK(f, T.inn - 4, T.locker + 20 - (T.inn - 4), ease.out);
  const onSheet = pdK(f, T.man - 4, 16);
  const cOut = pdK(f, T.s1[0], T.s3[0] - T.s1[0], ease.linear);
  const cx = pdLerp(540, Vs.cx, onSheet), cy = pdLerp(pdLerp(330, 760, cin), Vs.cy - 6, onSheet);
  const cs = pdLerp(1, 1.96, onSheet);

  // the print in the tray: developing after the flash, then lifted out
  const devK = pdK(f, T.snapped + 6, T.up - 6 - (T.snapped + 6), ease.linear);
  const amp = pdClamp(devK / 0.15);
  const gamma = 1 + 22 * Math.pow(1 - devK, 2.4);
  const P = pdPrintView(Vt, lift);
  const wet = 0.15 + 0.85 * (1 - pdK(f, T.up, 30, ease.linear)) * pdK(f, T.up - 16, 6);
  const fall = fallingPrint(f, T, Vt);

  // the flash
  const fire = f >= T.snapped ? (f - T.snapped < 3 ? 1 : Math.exp(-(f - T.snapped - 3) / 3)) : 0;
  const spent = pdK(f, T.snapped + 2, 10, ease.linear);
  const glow = f >= T.snapped ? Math.exp(-(f - T.snapped) / 22) : 0;
  const [bx, by] = pdBulbAt(Vc);
  const flashO = f >= T.snapped && f < T.snapped + 16 ? (f - T.snapped < 3 ? 0.94 : 0.94 * Math.exp(-(f - T.snapped - 3) / 3.5)) : 0;

  const trayDim = 1 - 0.6 * pdK(f, T.photographer - 4, 20) * (1 - down);
  const tongs = pdK(f, T.up - 26, 8, ease.out);
  return (
    <div style={{ ...FULL, overflow: "hidden", background: "#0D1117" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={FULL}>
        <PhotoDevelopingRoomDefs />
        <PhotoDevelopingTrayDefs amp={amp} gamma={gamma} />
        <PhotoDevelopingSheetDefs />
        <g opacity={roomO} transform={`translate(0 ${roomY}) translate(540 900) scale(${push}) translate(-540 -900)`}>
          <PhotoDevelopingRoom f={f} light={light} />
        </g>
        <PhotoDevelopingTray V={Vt} f={f} o={(1 - lift) * trayDim} />
        {f >= land && lift <= 0 && <g opacity={trayDim}><PhotoDevelopingPrint P={P} dev={amp} wet={wet} src={img.photo} /></g>}
        {f >= land - 2 && <PhotoDevelopingLiquid V={Vt} f={f} land={land} fade={(1 - lift) * trayDim} />}
        {fall && (
          <g transform={`translate(${fall.cx} ${fall.top}) rotate(${fall.rot}) scale(${fall.s} ${fall.s * fall.S})`}>
            {/* the corner hole it hung by */}
            <rect x={-PD_PRINT.w / 2 + 10} y={18} width={PD_PRINT.w} height={PD_PRINT.h} fill="rgba(0,0,0,0.45)" filter="url(#pdSoft)" />
            <rect x={-PD_PRINT.w / 2} y={0} width={PD_PRINT.w} height={PD_PRINT.h} fill="#F6F4EE" />
            <rect x={-PD_PRINT.w / 2} y={0} width={PD_PRINT.w} height={PD_PRINT.h} fill="url(#pdWet)" opacity={0.35} />
            {fall.pivot && <circle cx={0} cy={22} r={9} fill="#2B2B2B" />}
          </g>
        )}
        <Splash f={f} land={land} cx={Vt.cx} cy={Vt.cy} />
        {/* the sheet and its 100, then the PR man's hand */}
        <g transform={`translate(0 ${roomY * 1.05})`} opacity={1 - down}>
          <PhotoDevelopingSheet f={f} T={T} V={Vs} ink={img.ink} font={font} inK={pdK(f, T.man - 6, 6, ease.linear)} />
          <PhotoDevelopingCounter x={cx} y={cy} s={cs} o={cin * (1 - cOut)} blur={cOut * 10} font={font} />
          {(() => {
            const H = handAt(f, T, Vs);
            return <PhotoDevelopingHand x={H.x} y={H.y} o={H.o} press={H.press} />;
          })()}
        </g>
        <g transform={`translate(${-500 * down} ${roomY * 0.6})`} opacity={1 - down}>
          <PhotoDevelopingCamera V={Vc} o={pdK(f, T.photographer - 8, 4, ease.linear)} spent={spent} fire={fire} glow={glow} src={img.camera} label={pdK(f, T.son, 9)} font={font} />
        </g>
        {/* the lifted print over everything, with its tongs and drips */}
        {lift > 0 && <PhotoDevelopingPrint P={P} dev={amp} wet={wet} src={img.photo} />}
        <PhotoDevelopingTongs P={P} o={tongs * (1 - pdK(f, T.upEnd + 4, 10))} />
        <PhotoDevelopingDrips P={P} f={f} from={T.up - 10} />
        <PhotoDevelopingCredit o={pdK(f, T.up, 10)} font={font} y={P.cy + (PD_PRINT.h / 2) * P.s + 54} />
        {/* the burn: white at the bulb, amber at the edges, filling the stage for three frames */}
        {flashO > 0.002 && (
          <>
            <defs>
              <radialGradient id="pdBurst" cx={bx} cy={by} r={1500} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FFFFFF" />
                <stop offset="0.25" stopColor="#FFF4DA" />
                <stop offset="1" stopColor={PD_AMBER} stopOpacity={0.9} />
              </radialGradient>
            </defs>
            <rect x={0} y={0} width={1080} height={1920} fill="url(#pdBurst)" opacity={flashO} />
            <rect x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={flashO * 0.7} />
          </>
        )}
      </svg>
      {/* the caption's band and the foot of the frame: the picture runs behind both, dimmed */}
      <div style={{ ...FULL, height: 620, background: "linear-gradient(180deg, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.93) 66%, rgba(13,17,23,0.5) 84%, rgba(13,17,23,0) 100%)", opacity: 1 - 0.85 * flashO }} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1440, height: 480, background: "linear-gradient(180deg, rgba(13,17,23,0) 0%, rgba(13,17,23,0.85) 40%, rgba(13,17,23,0.98) 75%)", opacity: 1 - 0.85 * flashO }} />
    </div>
  );
};
