// Scene `corner`: "Picture the ball swinging to a shooter standing alone in the corner, his heels a step from the
// sideline." A real corner three (Bowen, 2009) for two words, its floor laid flat into the reel's top-down court; the
// real ball swung top -> wing -> corner; white sneakers set down behind the corner line; the rest of the floor goes
// dark around him; then one camera drops to shoe height behind his heels, looking along the sideline. Notes:
// notes/CornerSwing.md.
import React from "react";
import { Img, staticFile } from "remotion";
import { useScene, ease, prog, arrive } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { CornerSwingFloor } from "./CornerSwingFloor";
import { CornerSwingShoes } from "./CornerSwingShoes";
import {
  CS_BASE,
  CS_FEET,
  CS_HEEL_X,
  CS_SIDE,
  cornerSwingBasis,
  cornerSwingLerp as lerp,
  cornerSwingPoly as poly,
  cornerSwingProject as proj,
  type CornerSwingCam,
  type CornerSwingV3,
} from "./CornerSwingWorld";

type Pose = { tx: number; ty: number; D: number; pitch: number; yaw: number; F: number };
const deg = Math.PI / 180;

const toCam = (p: Pose): CornerSwingCam => {
  const cp = Math.cos(p.pitch);
  const fw: CornerSwingV3 = [cp * Math.sin(p.yaw), cp * Math.cos(p.yaw), Math.sin(p.pitch)];
  return { eye: [p.tx - p.D * fw[0], p.ty - p.D * fw[1], -p.D * fw[2]], yaw: p.yaw, pitch: p.pitch, F: p.F, cx: 540, cy: 985 };
};
const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  tx: lerp(a.tx, b.tx, t),
  ty: lerp(a.ty, b.ty, t),
  D: Math.exp(lerp(Math.log(a.D), Math.log(b.D), t)),
  pitch: lerp(a.pitch, b.pitch, t),
  yaw: lerp(a.yaw, b.yaw, t),
  F: lerp(a.F, b.F, t),
});

// the camera's stops
const TILT: Pose = { tx: 13, ty: 6, D: 70, pitch: -38 * deg, yaw: 8 * deg, F: 1900 };
// pushed in on the right half of the floor, where the ball travels: top of the key, the right wing, the corner
const ARC: Pose = { tx: 11.2, ty: 11.6, D: 2200 / 29.5, pitch: -90 * deg + 0.0001, yaw: 0, F: 2200 };
const ARC2: Pose = { ...ARC, tx: 13.2, ty: 10.2, D: 2200 / 33 };
const CORNER: Pose = { tx: 22.3, ty: -0.7, D: 2200 / 92, pitch: -90 * deg + 0.0001, yaw: 0, F: 2200 };
const CORNER2: Pose = { ...CORNER, ty: -0.55, D: 2200 / 99 };
// shoe height, behind his heels, looking along the sideline toward half court
const LOW_EYE: CornerSwingV3 = [24.62, -4.4, 0.58];
const LOW_PITCH = -15 * deg;
const LOW_YAW = -15 * deg;
const lowPose = (dy: number): Pose => {
  const D = LOW_EYE[2] / Math.sin(-LOW_PITCH);
  const cp = Math.cos(LOW_PITCH);
  return { tx: LOW_EYE[0] + D * cp * Math.sin(LOW_YAW), ty: LOW_EYE[1] + dy + D * cp * Math.cos(LOW_YAW), D, pitch: LOW_PITCH, yaw: LOW_YAW, F: 1100 };
};

// the ball's path (ft): held at the top of the key, chest pass to the right wing, skip pass to the corner
const TOP: CornerSwingV3 = [1.2, 25.3, 4.2];
const WING: CornerSwingV3 = [17.8, 18.4, 4.3];
const HELD: CornerSwingV3 = [22.95, 0.1, 3.7];
const BALL_R = 0.39;

export const CornerSwing: React.FC = () => {
  const { f, cue, scene, theme } = useScene();
  const UI = theme.font.ui;
  const t0 = scene.from - LEAD;
  const cPicture = cue("Picture");
  const cBall = cue("ball");
  const cSwing = cue("swinging");
  const cShooter = cue("shooter");
  const cStanding = cue("standing");
  const cAlone = cue("alone");
  const cCorner = cue("corner");
  const cHis = cue("his");
  const cHeels = cue("heels");
  const cStep = cue("step");
  const cSide = cue("sideline");
  const end = scene.to;

  // ---- the camera
  let pose: Pose;
  if (f < cBall - 4) pose = TILT;
  else if (f < cBall + 26) pose = mixPose(TILT, ARC, prog(f, cBall - 4, 30, ease.inOut));
  else if (f < cStanding) pose = mixPose(ARC, ARC2, prog(f, cBall + 26, cStanding - cBall - 26, ease.linear));
  else if (f < cCorner + 6) pose = mixPose(ARC2, CORNER, prog(f, cStanding, cCorner + 6 - cStanding, ease.inOut));
  else if (f < cHis - 8) pose = mixPose(CORNER, CORNER2, prog(f, cCorner + 6, cHis - 8 - cCorner - 6, ease.linear));
  else if (f < cHeels + 4) {
    const t = prog(f, cHis - 8, cHeels + 4 - (cHis - 8), ease.inOut);
    pose = mixPose(CORNER2, lowPose(0), t);
  } else pose = lowPose(0.45 * prog(f, cHeels + 4, end - cHeels - 4, ease.linear) + 0.25 * prog(f, cSide - 10, 40, ease.inOut));
  const cam = toCam(pose);
  const B = cornerSwingBasis(cam);
  const low = Math.min(1, Math.max(0, (pose.pitch / deg + 90) / 70)); // 0 straight down .. ~1 at shoe height
  const lowShoe = prog(f, cHis - 2, 22, ease.inOut);

  // ---- the Bowen photo: rises, pushes in toward the ball, then lies back flat as the floor un-tilts
  const cardIn = arrive(f, t0, 18);
  const push = prog(f, cPicture - 4, cBall - cPicture + 4, ease.out);
  const lay = prog(f, cBall, 24, ease.inOut);
  const cardOp = cardIn * (1 - prog(f, cBall + 6, 18, ease.linear));
  const CARD_W = 900;
  const CARD_H = Math.round((CARD_W * 1235) / 1280);
  const CARD_TOP = 985 - CARD_H / 2;
  const BALL_U = 840 / 1280;
  const BALL_V = 235 / 1235;
  const photoBall = { x: 90 + BALL_U * CARD_W, y: CARD_TOP + BALL_V * CARD_H + (1 - cardIn) * 140, r: 42 * (CARD_W / 1280) * (1 + 0.16 * push) };

  // ---- the ball
  const lift = prog(f, cBall, 18, ease.inOut); // out of the photo onto the top of the key
  const p1s = cSwing - 6;
  const p1e = cSwing + 12;
  const p2s = p1e + 3;
  const p2e = cShooter;
  let bw: CornerSwingV3 = TOP;
  let spin = 0;
  if (f >= p1s && f < p1e) {
    const t = prog(f, p1s, p1e - p1s, ease.linear);
    bw = [lerp(TOP[0], WING[0], t), lerp(TOP[1], WING[1], t), lerp(TOP[2], WING[2], t) + Math.sin(t * Math.PI) * 0.8];
    spin = t;
  } else if (f >= p1e && f < p2s) {
    bw = WING;
    spin = 1;
  } else if (f >= p2s && f < p2e) {
    // a skip pass: down to the boards halfway, up into the corner
    const t = prog(f, p2s, p2e - p2s, ease.linear);
    const zA = t < 0.5 ? lerp(WING[2], BALL_R, Math.pow(t / 0.5, 1.7)) : lerp(BALL_R, HELD[2], 1 - Math.pow(1 - (t - 0.5) / 0.5, 1.7));
    bw = [lerp(WING[0], HELD[0], t), lerp(WING[1], HELD[1], t), zA];
    spin = 1 + t * 1.4;
  } else if (f >= p2e) {
    const settle = prog(f, p2e, 10, ease.out);
    bw = [HELD[0], HELD[1], HELD[2] - 0.25 * Math.sin(settle * Math.PI) * (1 - settle)];
    spin = 2.4;
  }
  const bp = proj(cam, B, bw);
  let ballX = bp ? bp.x : 540;
  let ballY = bp ? bp.y : 985;
  let ballR = bp ? (cam.F * BALL_R) / bp.z : 10;
  if (lift < 1) {
    ballX = lerp(photoBall.x, ballX, lift);
    ballY = lerp(photoBall.y, ballY, lift) - Math.sin(lift * Math.PI) * 60;
    ballR = lerp(photoBall.r, ballR, lift);
  }
  const ballShow = f >= cBall - 1;
  // held over his feet; it leaves the picture as the camera comes down to his heels
  const ballOp = ballShow ? 1 - prog(f, cHis - 10, 8, ease.linear) : 0;
  const shadowP = proj(cam, B, [bw[0] + bw[2] * 0.12, bw[1] - bw[2] * 0.08, 0.004]);
  const shadowR = shadowP ? (cam.F * BALL_R * (1 + bw[2] * 0.09)) / shadowP.z : 0;
  const shadowOp = lift * Math.max(0.12, 0.55 - bw[2] * 0.09);
  // the sheen the ball leaves on the boards as it skips
  const trail: { x: number; y: number; r: number; o: number }[] = [];
  if (f >= p1s && f < p2e + 14) {
    for (let k = 1; k <= 7; k++) {
      const ff = f - k * 2;
      if (ff < p1s) break;
      let q: CornerSwingV3;
      if (ff < p1e) {
        const t = prog(ff, p1s, p1e - p1s, ease.linear);
        q = [lerp(TOP[0], WING[0], t), lerp(TOP[1], WING[1], t), 0];
      } else if (ff < p2s) q = [WING[0], WING[1], 0];
      else {
        const t = prog(ff, p2s, p2e - p2s, ease.linear);
        q = [lerp(WING[0], HELD[0], t), lerp(WING[1], HELD[1], t), 0];
      }
      const pp = proj(cam, B, [q[0], q[1], 0.004]);
      if (pp) trail.push({ x: pp.x, y: pp.y, r: (cam.F * 0.42) / pp.z, o: 0.34 * (1 - k / 8) * (f < p2e ? 1 : 1 - prog(f, p2e, 14)) });
    }
  }

  // ---- the sneakers set down behind the corner line as the ball arrives
  const d0 = prog(f, cShooter - 6, 10, ease.in);
  const d1 = prog(f, cShooter, 10, ease.in);
  const lifts: [number, number] = [1.6 * (1 - d0), 1.6 * (1 - d1)];
  const alphas: [number, number] = [prog(f, cShooter - 8, 6, ease.linear), prog(f, cShooter - 2, 6, ease.linear)];
  const settle = (fs: number) => (f > fs && f < fs + 10 ? Math.sin(((f - fs) / 10) * Math.PI) * 0.015 : 0);
  lifts[0] += settle(cShooter + 4);
  lifts[1] += settle(cShooter + 10);

  // ---- alone: everything but the corner goes dark; the empty boards toward the lane lift a touch
  const dim = prog(f, cAlone - 2, 12, ease.out) * (1 - prog(f, cHis - 6, 16, ease.linear));
  const zone = poly(cam, B, [[12, -9, 0], [29, -9, 0], [29, 12.5, 0], [12, 12.5, 0]], false);
  const empty = poly(cam, B, [[10.5, CS_BASE, 0.004], [21.6, CS_BASE, 0.004], [21.6, 11.5, 0.004], [10.5, 11.5, 0.004]], false);

  // ---- a step: the maple between the near heel and the sideline paint lights, a hairline across it
  const stepOn = prog(f, cStep - 3, 10, ease.out);
  const sy = CS_FEET.near.y - 0.08;
  const strip = poly(cam, B, [[CS_HEEL_X + 0.03, sy - 0.95, 0.004], [CS_SIDE, sy - 0.95, 0.004], [CS_SIDE, sy + 1.35, 0.004], [CS_HEEL_X + 0.03, sy + 1.35, 0.004]], false);
  const ha = proj(cam, B, [CS_HEEL_X + 0.04, sy, 0.01]);
  const hb = proj(cam, B, [CS_SIDE - 0.01, sy, 0.01]);
  const hTick = (p: { x: number; y: number } | null) => (p ? `M${p.x.toFixed(1)} ${(p.y - 14).toFixed(1)}L${p.x.toFixed(1)} ${(p.y + 14).toFixed(1)}` : "");
  const hDraw = prog(f, cStep - 4, 12, ease.inOut);

  const sidelineGlow = prog(f, cSide - 14, 16, ease.inOut);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the world, inside the stage band */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          WebkitMaskImage: "linear-gradient(to bottom, transparent 488px, black 548px, black 1452px, transparent 1520px)",
          maskImage: "linear-gradient(to bottom, transparent 488px, black 548px, black 1452px, transparent 1520px)",
          opacity: arrive(f, t0, 10),
        }}
      >
        <CornerSwingFloor cam={cam} B={B} f={f} look={{ sidelineGlow, apronDark: sidelineGlow, low: lowShoe }} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <filter id="cs-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="26" />
            </filter>
            <filter id="cs-soft2" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <filter id="cs-soft3" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          {dim > 0.001 && zone && <path d={`M-200 -200H1280V2120H-200Z ${zone}`} fillRule="evenodd" fill="#0D1117" opacity={0.8 * dim} filter="url(#cs-soft)" />}
          {dim > 0.001 && empty && <path d={empty} fill="#FFF5E2" opacity={0.09 * dim} filter="url(#cs-soft2)" />}
          {trail.map((t, i) => (
            <ellipse key={i} cx={t.x} cy={t.y} rx={t.r * 1.4} ry={t.r * 0.9} fill="#FFF6E4" opacity={t.o} filter="url(#cs-soft3)" />
          ))}
          {stepOn > 0.001 && strip && <path d={strip} fill="#FFF3DC" opacity={0.3 * stepOn} filter="url(#cs-soft2)" />}
        </svg>
        <CornerSwingShoes cam={cam} B={B} lifts={lifts} alpha={alphas} legK={lowShoe} reflect={0.52 * lowShoe} />
        {/* the ball and its shadow */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {ballShow && shadowP && shadowOp > 0.01 && (
            <ellipse cx={shadowP.x} cy={shadowP.y} rx={shadowR} ry={shadowR * 0.92} fill="#1B0D03" opacity={shadowOp * ballOp} style={{ filter: `blur(${(2 + bw[2] * 2.2).toFixed(1)}px)` }} />
          )}
        </svg>
        {/* the hairline across the step */}
        {hDraw > 0 && ha && hb && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={`M${ha.x.toFixed(1)} ${ha.y.toFixed(1)}L${lerp(ha.x, hb.x, hDraw).toFixed(1)} ${lerp(ha.y, hb.y, hDraw).toFixed(1)}`} stroke="#FFFFFF" strokeWidth={2} opacity={0.95} />
            <path d={hTick(ha)} stroke="#FFFFFF" strokeWidth={2} opacity={hDraw} />
            {hDraw > 0.98 && <path d={hTick(hb)} stroke="#FFFFFF" strokeWidth={2} />}
          </svg>
        )}
      </div>

      {/* the label of the step sits above the floor's band mask, plain and small */}
      {ha && hb && stepOn > 0 && (
        <div
          style={{
            position: "absolute",
            left: (ha.x + hb.x) / 2 - 200,
            top: Math.min(ha.y, hb.y) - 78,
            width: 400,
            textAlign: "center",
            fontFamily: UI,
            fontWeight: 600,
            fontSize: 38,
            color: "#FFFFFF",
            textShadow: "0 2px 14px rgba(13,17,23,0.85), 0 0 3px rgba(13,17,23,0.6)",
            opacity: stepOn,
            filter: stepOn < 1 ? `blur(${((1 - stepOn) * 8).toFixed(1)}px)` : undefined,
            whiteSpace: "nowrap",
          }}
        >
          a step
        </div>
      )}

      {/* the real corner three: Bruce Bowen, Spurs at Wizards, 21 Feb 2009 */}
      {cardOp > 0.001 && (
        <div style={{ position: "absolute", left: 90, top: CARD_TOP, width: CARD_W, height: CARD_H, perspective: 1500, perspectiveOrigin: "50% 100%" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              overflow: "hidden",
              background: "#161B22",
              border: "1px solid #30363D",
              boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
              opacity: cardOp,
              transformOrigin: "50% 100%",
              transform: `translateY(${((1 - cardIn) * 140).toFixed(1)}px) rotateX(${(lay * 72).toFixed(2)}deg)`,
              filter: cardIn < 1 ? `blur(${((1 - cardIn) * 10).toFixed(1)}px)` : undefined,
            }}
          >
            <Img
              src={staticFile("nba-floor/cornerswing-bowen.jpg")}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                transformOrigin: `${(BALL_U * 100).toFixed(2)}% ${(BALL_V * 100).toFixed(2)}%`,
                transform: `scale(${(1 + 0.16 * push + 0.03 * prog(f, t0, 40, ease.linear)).toFixed(4)})`,
              }}
            />
            <div style={{ position: "absolute", right: 22, top: 18, fontFamily: UI, fontSize: 22, fontWeight: 500, color: "#C9D1D9", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
              Keith Allison, CC BY-SA 2.0
            </div>
          </div>
        </div>
      )}

      {/* the real ball, out of the photo and onto the floor */}
      {ballShow && ballOp > 0.001 && (
        <Img
          src={staticFile("nba-floor/cornerswing-ball.png")}
          style={{
            position: "absolute",
            left: ballX - ballR * 1.03,
            top: ballY - ballR * 1.03,
            width: ballR * 2.06,
            height: ballR * 2.06,
            transform: `rotate(${(spin * 300 + (f - cBall) * 0.6).toFixed(1)}deg)`,
            opacity: ballOp,
            filter: "drop-shadow(0 0 1px rgba(0,0,0,0.5))",
          }}
        />
      )}
    </div>
  );
};

