// wilt-100 hook variant 2, "The camera that wasn't there", dark, 0-5.24 s:
// "Wilt Chamberlain scored 100 points in one NBA game, and almost nobody saw it."
// Hero: the RCA TK-41 studio camera, the one machine that should have been there, one continuous transformation
// from watching to blind. Frame 0: the TK-41 big at three-quarter, viewfinder toward us, red tally lit, Wilt in its
// tube (rolling, locking on "Wilt"), the flip panel clacking 0, 23, 41, 69; the dark vault far behind.
// Chamberlain: the turret clicks one lens, the picture comes back tighter. scored / 100: the panel riffles and slams
// to 100, the tube blooms. points: POINTS types under it, a label names the camera. one NBA game: the vault's windows
// warm up; the camera pans a hair toward it, cable dragging. almost: the picture tears, the cable creeps taut, the
// vault goes dark from the far end. nobody: the tally dies, the cable is yanked off left and rips the plug out, the
// camera rolls back on its casters and tips over backward out of the frame bottom, lands, bounces, its ring spinning;
// its tube collapses to a line, then a dot. saw: the dot holds where its eye was; four amber windows are left.
// it.: the panel at 100 opens out of the dot and floats up to the top centre, where `hershey` picks it up (keep).
// Parts: Kit (times, 3D, pose), Camera (the TK-41), Screen (the tube's picture and the flip panel), Vault.
import React from "react";
import { ease, prog, useScene } from "../../../src/engine";
import { HX2_CRT_CENTRE, HX2_PLUG, HookX2Camera, HookX2CameraDefs } from "./HookX2Camera";
import {
  HX2_DIM, type V3, hx2LandAt, hx2Lerp, hx2P, hx2Pose, hx2Rnd, hx2World, useHookX2T,
} from "./HookX2Kit";
import { HX2_FLAP, HookX2Panel, HookX2Screen, HookX2ScreenDefs } from "./HookX2Screen";
import { HookX2Vault, HookX2VaultDefs } from "./HookX2Vault";

const FULL = { position: "absolute" as const, inset: 0 };
const STAGE_MASK = "linear-gradient(to bottom, transparent 0, transparent 500px, #000 532px, #000 1430px, transparent 1540px)";

export const HookX2: React.FC & { keep?: boolean } = () => {
  const { f, theme } = useScene();
  const T = useHookX2T();
  const N = T.nobody;
  const land = hx2LandAt(T);

  // shake: a small shudder on the 100 slam, a hard one when the camera hits the floor
  const shakeAt = (fr: number) => {
    const s1 = fr >= T.hundred ? 4 * Math.exp(-(fr - T.hundred) / 4) : 0;
    const s2 = fr >= land ? 16 * Math.exp(-(fr - land) / 5) : 0;
    // a slow push in on the lens while it watches (held from "nobody" on)
    const push = 1 + 0.07 * prog(fr, 0, T.nobody, ease.inOut);
    return { x: (s1 + s2 * 0.5) * Math.sin(fr * 2.3) + (push - 1) * 440, y: (s1 + s2) * Math.cos(fr * 3.1) + (push - 1) * 130, s: push };
  };
  const shake = shakeAt(f);
  const pose = hx2Pose(T, f);

  // the tube: power from the plug. Collapse to a line, hold, then to a dot.
  const snap = N + 3;
  const offV = prog(f, snap, 4, ease.in);
  const offH = prog(f, snap + 5, 4, ease.in);
  const dotAt = snap + 9;
  const glow = f < snap ? 0.85 - 0.4 * prog(f, T.almost, N - T.almost, ease.in) : Math.max(0, 1 - offH) * 0.9;
  // the tally: lit, flickers twice as the power wavers, dies on "nobody"
  const tally = f < N - 8 ? 1 : f < N ? (Math.floor((f - (N - 8)) / 2) % 2 === 0 ? 0.25 : 0.9) : 0;

  // the cable: slack on the floor, creeping taut from "almost", yanked off left on "nobody", the plug ripped out
  const creep = prog(f, T.almost - 6, N - T.almost + 10, ease.in);
  const yank = prog(f, N, 4, ease.in);
  const far: V3 = [hx2Lerp(-3.2, -3.6, creep) - 2.4 * yank, 0.02 + 0.6 * yank, 0.5];
  const sag = (1 - 0.6 * creep) * (1 - yank);
  const plugOut = f >= snap ? 1 : 0;
  const plugStart = hx2World(HX2_PLUG, hx2Pose(T, snap));
  const ft = Math.max(0, f - snap);
  const plugFly: V3 = [plugStart[0] - 0.16 * ft, plugStart[1] + 0.05 * ft - 0.004 * ft * ft, plugStart[2] - 0.05 * ft];

  // motion blur of the falling camera, from the screen speed of its eye
  const eyeNow = hx2P(HX2_CRT_CENTRE, pose, shake);
  const eyePrev = hx2P(HX2_CRT_CENTRE, hx2Pose(T, f - 1), shakeAt(f - 1));
  const vx = eyeNow.x - eyePrev.x, vy = eyeNow.y - eyePrev.y;
  const blurX = Math.min(7, Math.abs(vx) * 0.12), blurY = Math.min(9, Math.abs(vy) * 0.12);
  // the dot: where the eye was when the raster closed
  const dotPose = hx2Pose(T, dotAt);
  const dot = hx2P(HX2_CRT_CENTRE, dotPose, shakeAt(dotAt));

  // the panel opens out of the dot (a line, then the panel) and floats up to where `hershey` takes it
  const E = T.saw + 6;
  const openH = prog(f, E, 5, ease.out);
  const openV = prog(f, E + 4, 5, ease.out);
  const rise = prog(f, E + 8, 18, ease.inOut);
  const px = hx2Lerp(dot.x, 540, rise), py = hx2Lerp(dot.y, 600, rise);
  const ps = hx2Lerp(0.55, 0.9, rise);
  const W = 3 * HX2_FLAP.w + 2 * HX2_FLAP.gap;

  // the vault fades for the hand-off once "it." is said
  const vaultFade = 1 - prog(f, T.itEnd - 2, 16, ease.inOut);
  // labels
  const camLabel = prog(f, T.points, 10, ease.out) * (1 - prog(f, N - 4, 6, ease.in));
  const placeLabel = prog(f, T.game - 2, 10, ease.out) * vaultFade;
  const bodyMid = hx2P([0.16, 1.32, 0.05], pose, shake);

  // the spark where the plug leaves its socket
  const sock = hx2P(HX2_PLUG, pose, shake);
  const sparkK = f >= snap && f < snap + 9 ? 1 - (f - snap) / 9 : 0;

  return (
    <div style={{ ...FULL, overflow: "hidden" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ ...FULL, WebkitMaskImage: STAGE_MASK, maskImage: STAGE_MASK }}>
        <HookX2CameraDefs />
        <HookX2ScreenDefs />
        <HookX2VaultDefs />
        <defs>
          <radialGradient id="hx2-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#D9D2C2" stopOpacity="0.16" />
            <stop offset="1" stopColor="#D9D2C2" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hx2-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0D1117" stopOpacity="0" />
            <stop offset="0.25" stopColor="#11151B" stopOpacity="1" />
            <stop offset="1" stopColor="#171B21" stopOpacity="1" />
          </linearGradient>
          <filter id="hx2-mblur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={`${blurX.toFixed(2)} ${blurY.toFixed(2)}`} />
          </filter>
          <filter id="hx2-dotglow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        {/* the night: the vault far behind, then the lot the camera stands on */}
        <g transform={`translate(${(shake.x * 0.3).toFixed(1)} ${(shake.y * 0.3).toFixed(1)})`}>
          <HookX2Vault f={f} T={T} x={6} y={546} s={0.32} fade={vaultFade} />
          <rect x={0} y={680} width={1080} height={900} fill="url(#hx2-floor)" opacity={vaultFade} />
          <ellipse cx={850 + shake.x} cy={1380 + shake.y} rx={560} ry={230} fill="url(#hx2-pool)" opacity={vaultFade} />
        </g>
        {/* the camera */}
        <g filter={blurX + blurY > 0.6 ? "url(#hx2-mblur)" : undefined} opacity={vaultFade}>
          <HookX2Camera
            pose={pose}
            shake={shake}
            f={f}
            glow={glow}
            tally={tally}
            cable={{ sag, far, plugOut, plugFly }}
            screen={f < dotAt ? <HookX2Screen f={f} T={T} off={{ offV, offH }} /> : <rect width={1} height={1} fill="none" />}
          />
        </g>
        {/* the tally lamp's red bloom */}
        {tally > 0.05 && (() => {
          const tp = hx2P([0.085, 1.7, -0.25], pose, shake);
          return <circle cx={tp.x} cy={tp.y} r={46} fill="#FF3B2E" opacity={0.22 * tally} filter="url(#hx2-dotglow)" />;
        })()}
        {/* the spark */}
        {sparkK > 0 &&
          Array.from({ length: 14 }, (_, i) => {
            const a = hx2Rnd(i, 3) * Math.PI * 2;
            const r0 = 6 + (1 - sparkK) * (30 + 60 * hx2Rnd(i, 4));
            const r1 = r0 + 10 + 20 * hx2Rnd(i, 5);
            return <line key={i} x1={sock.x + r0 * Math.cos(a)} y1={sock.y + r0 * Math.sin(a)} x2={sock.x + r1 * Math.cos(a)} y2={sock.y + r1 * Math.sin(a)} stroke={i % 3 ? "#FFE8B0" : "#FFFFFF"} strokeWidth={3} opacity={sparkK} strokeLinecap="round" />;
          })}
        {sparkK > 0 && <circle cx={sock.x} cy={sock.y} r={26} fill="#FFF3D6" opacity={sparkK * 0.8} filter="url(#hx2-dotglow)" />}
        {/* the dot the tube left behind */}
        {f >= dotAt && openV < 1 && (
          <g opacity={1 - openV}>
            <circle cx={dot.x} cy={dot.y} r={34 * (1 + 0.12 * Math.sin(f * 0.7))} fill="#FFFFFF" opacity={0.5} filter="url(#hx2-dotglow)" />
            <circle cx={dot.x} cy={dot.y} r={13} fill="#FFFFFF" opacity={0.6} filter="url(#hx2-dotglow)" />
            <ellipse cx={dot.x} cy={dot.y} rx={6 + 120 * openH} ry={5} fill="#FFFFFF" />
          </g>
        )}
      </svg>

      {/* the panel, opened out of the dot and floated up to the hand-off place */}
      {openH > 0 && (
        <div style={{ position: "absolute", left: px - W / 2, top: py - HX2_FLAP.h / 2, width: W, height: HX2_FLAP.h, transform: `scale(${(ps * openH).toFixed(4)}, ${(ps * Math.max(0.02, openV)).toFixed(4)})`, transformOrigin: "50% 50%" }}>
          <HookX2Panel f={f} T={T} />
        </div>
      )}

      {/* labels: small grey type on a hairline */}
      {camLabel > 0.01 && (
        <div style={{ position: "absolute", left: 0, top: 0, opacity: camLabel }}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={bodyMid.x + 10} y1={bodyMid.y + 20} x2={940} y2={1100} stroke={HX2_DIM} strokeWidth={2} />
          </svg>
          <div style={{ position: "absolute", left: 760, top: 1108, width: 300, textAlign: "right", fontFamily: theme.font.ui, fontSize: 34, fontWeight: 500, color: HX2_DIM, lineHeight: 1.2 }}>
            RCA TK-41
            <br />
            TV camera
          </div>
        </div>
      )}
      {placeLabel > 0.01 && (
        <div style={{ position: "absolute", left: 40, top: 712, opacity: placeLabel, fontFamily: theme.font.ui, fontSize: 32, fontWeight: 500, color: HX2_DIM }}>
          <div style={{ position: "absolute", left: 60, top: -30, width: 2, height: 26, background: HX2_DIM }} />
          Hershey, PA
        </div>
      )}
    </div>
  );
};
HookX2.keep = true;

