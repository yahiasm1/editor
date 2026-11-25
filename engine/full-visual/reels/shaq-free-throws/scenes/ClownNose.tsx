// clown, dark, 36.17-46.43 s: "That trick got a name: Hack-a-Shaq. Dallas coach Don Nelson made it famous in 1999,
// and Shaq called him a clown. So at their next game, Nelson showed up wearing a clown nose."
// A real desk stamp slams HACK-A-SHAQ onto a navy card in rough white ink. The card shrinks to a label; the real
// Mavericks primary rises bare and leaves before the date. Don Nelson's grinning photo (Sean P. Anderson) arrives,
// 1999 rolls up on its date band. Lipofsky's 1999 photo of Shaq in Lakers gold slides in, tilted at him, and jabs on
// "called". A red foam nose (redrawn from Robert Cudmore's photo) hangs above Nelson on "clown", the card grows, the
// camera pushes into his face, the nose drops onto his real nose (read at 320, 333 of the 725 x 1024 photo),
// squashes, bounces, throws its shadow on his cheek, and the photo shakes with a laugh. (notes/ClownNose.md)
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { arrive, blurHold, countTo, ease, leave, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { CN_IMP, ClownNoseImpression, ClownNoseStampBody, useClownNoseFont } from "./ClownNoseStamp";
import { ClownNoseFoam } from "./ClownNoseFoam";

const NELSON = staticFile("shaq-free-throws/clownnose-nelson.jpg");
const SHAQ99 = staticFile("shaq-free-throws/clownnose-shaq-1999.jpg");
const MAVS = staticFile("shaq-free-throws/clownnose-mavs.svg");
const FONT = "Inter, sans-serif";
const CARD = "#161B22";
const HAIR = "#30363D";
const GREY = "#8B949E";
const CREDIT_SHADOW = "0 1px 6px rgba(0,0,0,0.75)";

// Nelson's card at its base size: the photo's own shape (725 x 1024), so nothing is cropped
const NW = 560;
const NH = Math.round((NW * 1024) / 725); // 791
const NS = NW / 725;
const NOSE = { x: 320 * NS, y: 333 * NS }; // his nose tip, in card pixels
const NOSE_D = 105 * NS; // a 5 cm foam nose against his face, in card pixels

// the stamp card: where HACK-A-SHAQ is stamped
const SC = { x: 540, y: 900, w: 920, h: 360 };

function useClownNoseTimes() {
  const { cue, cueEnd, scene } = useScene();
  return {
    in: scene.from - LEAD,
    name: cue("name"),
    hack: cue("Hack-a-Shaq"),
    dallas: cue("Dallas"),
    don: cue("Don"),
    nelson: cue("Nelson"),
    made: cue("made"),
    famous: cue("famous"),
    y1999: cue("1999"),
    shaq: cue("Shaq"),
    called: cue("called"),
    clown: cue("clown"),
    so: cue("So"),
    nelson2: cue("Nelson", 2),
    wearing: cue("wearing"),
    clown2: cue("clown", 2),
    nose: cue("nose"),
    noseEnd: cueEnd("nose"),
    end: scene.to,
  };
}
type T = ReturnType<typeof useClownNoseTimes>;

/** the stamp's die bottom (y), its tilt and its squash, frame by frame */
function stampPose(t: T, f: number) {
  const contact = SC.y + CN_IMP.h / 2;
  const hover = 690 + Math.sin((f - t.in) * 0.11) * 10;
  const wind = prog(f, t.name - 26, 17, ease.out); // a short wind-up: it rises before it slams
  const slam = prog(f, t.name - 8, 8, ease.in);
  const lift = leave(f, t.hack - 11, 18);
  let y = hover - 70 * wind;
  y = y + (contact - y) * slam;
  y = y - (contact + 420) * lift;
  const rot = (1 - slam) * Math.sin((f - t.in) * 0.07) * 2.2 + lift * -7;
  const u = f - t.name;
  const squash = u >= 0 && u < 14 ? Math.exp(-u / 3) * Math.cos(u * 0.9) : 0;
  return { y, rot, squash: Math.max(0, squash), slam, lift, near: 1 - Math.min(1, Math.max(0, (contact - y) / 380)) };
}

/** one rolling digit, odometer style, landing on `to` at frame `land` */
const ClownNoseDigit: React.FC<{ f: number; land: number; to: number; size: number }> = ({ f, land, to, size }) => {
  const dur = 20;
  const v = countTo(f, land - dur, dur, 0, to + 10, ease.out);
  const h = size * 1.02;
  const seq = Array.from({ length: 21 }, (_, i) => i % 10);
  const moving = f >= land - dur && f < land;
  return (
    <div style={{ position: "relative", width: size * 0.62, height: h, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -v * h, filter: moving ? `blur(${Math.min(3, (land - f) * 0.25).toFixed(2)}px)` : undefined }}>
        {seq.map((d, i) => (
          <div key={i} style={{ height: h, lineHeight: `${h}px`, textAlign: "center", width: size * 0.62 }}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ClownNose: React.FC = () => {
  useClownNoseFont();
  const { f } = useScene();
  const t = useClownNoseTimes();

  // ---- 1. the stamp and its impression -------------------------------------------------------------------
  const sp = stampPose(t, f);
  const cardIn = prog(f, t.in, 7, ease.out);
  const jolt = f >= t.name && f < t.name + 16 ? Math.exp(-(f - t.name) / 4) * Math.cos((f - t.name) * 1.3) * 8 : 0;
  const ink = f >= t.hack - 11 ? 1 : 0; // the ink is under the die until it lifts
  const wet = 1 - prog(f, t.hack, 60, ease.linear);
  const spatter = prog(f, t.name, 5, ease.outHard);
  // the stamped card becomes a label at the top left on "Dallas", and goes on "So"
  const toLabel = arrive(f, t.dallas - 4, 22);
  const label = {
    x: SC.x + (292 - SC.x) * toLabel,
    y: SC.y + (612 - SC.y) * toLabel + jolt,
    s: 1 + (0.42 - 1) * toLabel,
    r: -5 * toLabel + 0.6 * Math.sin(f * 0.03),
  };
  const labelOut = prog(f, t.so, 12, ease.in);

  // ---- 2. the Mavericks logo ---------------------------------------------------------------------------
  const logoRise = arrive(f, t.dallas - 6, 20);
  const logoShrink = arrive(f, t.don - 4, 20);
  const logoSize = 440 + (150 - 440) * logoShrink;
  const logoX = 540 + (905 - 540) * logoShrink;
  const logoY = 1530 + (950 - 1530) * logoRise + (618 - 950) * logoShrink;
  const logoOp = prog(f, t.dallas - 6, 6, ease.linear) * (1 - prog(f, t.nelson + 6, 18, ease.in));

  // ---- 3. Nelson's card ---------------------------------------------------------------------------------
  const nIn = arrive(f, t.don - 8, 20);
  const grow = prog(f, t.so, 28, ease.inOut);
  const nScale = 1 + (650 / NW - 1) * grow;
  const nx = 1240 + (440 - 1240) * nIn + (215 - 440) * grow;
  const ny = 640 + (530 - 640) * grow;
  const laughU = f - t.nose;
  const laugh = laughU >= 0 ? Math.exp(-laughU / 16) : 0;
  const nRot = (1 - nIn) * 6 + (laughU >= 0 ? 1.7 * Math.sin(laughU * 0.95) * laugh : 0);
  const nBob = laughU >= 0 ? -5 * Math.abs(Math.sin(laughU * 0.95)) * laugh : 0;
  const nBlur = blurHold(f, t.don - 8, 6, 10) * 10;
  // the push into his face, always about his nose: the nose point never moves inside the card
  const z = 1 + 0.07 * prog(f, t.nelson, 50, ease.inOut) + 0.36 * prog(f, t.nelson2 - 4, 44, ease.inOut) + 0.00035 * Math.max(0, f - t.nelson);
  // the date band and 1999
  const band = arrive(f, t.made - 2, 16);

  // ---- 4. Shaq, 1999, tilted at him --------------------------------------------------------------------
  const sIn = arrive(f, t.shaq - 10, 18);
  const jab = prog(f, t.called - 2, 7, ease.out) * (1 - prog(f, t.called + 10, 16, ease.inOut));
  const sOut = leave(f, t.so, 14);
  const SW = 290;
  const SH = Math.round((SW * 300) / 199);
  const sx = -440 + (64 - -440) * sIn + 26 * jab - 620 * sOut;
  const sy = 800 - 8 * jab;
  const sRot = 6 + 5 * jab;

  // ---- 5. the nose ----------------------------------------------------------------------------------------
  const hang = { x: NOSE.x + 6, y: NOSE.y - 222 };
  const appear = prog(f, t.clown - 2, 9, ease.back);
  const swingT = Math.max(0, f - t.clown);
  const theta = (9 * Math.sin(swingT * 0.085) * Math.exp(-swingT / 260) * Math.PI) / 180;
  const L = 300;
  const fallK = prog(f, t.wearing, t.clown2 - t.wearing, ease.in);
  const swingFade = 1 - fallK;
  const hx = hang.x + L * Math.sin(theta) * swingFade;
  const hy = hang.y + L * (1 - Math.cos(theta)) * swingFade + Math.sin(swingT * 0.17) * 4 * swingFade;
  const land = { x: NOSE.x - 1, y: NOSE.y - 5 };
  const u = f - t.clown2;
  const hop = u >= 0 ? -16 * Math.abs(Math.sin(u * 0.33)) * Math.exp(-u / 6) : 0;
  const sq = u >= 0 ? Math.exp(-u / 4) * Math.cos(u * 0.55) : 0;
  const stretch = f < t.clown2 ? 0.1 * fallK * fallK : 0;
  const noseX = hx + (land.x - hx) * fallK;
  const noseY = hy + (land.y - hy) * fallK + hop;
  const noseD = NOSE_D * z;
  const hole = 32 + 128 * prog(f, t.wearing, t.clown2 - t.wearing + 2, ease.inOut);
  const noseRot = ((theta * 180) / Math.PI) * 0.7 * swingFade;
  const landed = u >= 0 ? 1 : 0;
  const nearFace = fallK * fallK; // the cast shadow comes onto the face as it closes in

  return (
    <AbsoluteFill>
      {/* ---- the stamped card / label ---- */}
      <div style={{ position: "absolute", left: label.x, top: label.y, transform: `translate(-50%,-50%) rotate(${label.r.toFixed(3)}deg) scale(${label.s.toFixed(4)})`, opacity: cardIn * (1 - labelOut), filter: labelOut > 0 ? `blur(${(labelOut * 10).toFixed(2)}px)` : undefined }}>
        <div style={{ position: "relative", width: SC.w, height: SC.h }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: CARD, border: `1px solid ${HAIR}`, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }} />
          {/* the stamp's shadow on the card, tightening as it comes down */}
          {sp.lift < 1 && (
            <div style={{ position: "absolute", left: SC.w / 2 - 470 + (1 - sp.near) * 40, top: SC.h / 2 - 120, width: 940 - (1 - sp.near) * 80, height: 240, borderRadius: 40, background: "radial-gradient(closest-side, rgba(0,0,0,0.55), rgba(0,0,0,0))", opacity: (0.25 + 0.65 * sp.near) * (1 - sp.lift) * (1 - ink), filter: `blur(${(6 + 30 * (1 - sp.near)).toFixed(1)}px)` }} />
          )}
          <div style={{ position: "absolute", left: SC.w / 2, top: SC.h / 2 }}>
            <ClownNoseImpression ink={ink} wet={wet} spatter={spatter} />
          </div>
        </div>
      </div>

      {/* ---- the Mavericks primary, bare ---- */}
      {logoOp > 0.001 && (
        <Img src={MAVS} style={{ position: "absolute", left: logoX - logoSize / 2, top: logoY - logoSize / 2, width: logoSize, height: logoSize, opacity: logoOp, filter: `drop-shadow(0 18px 40px rgba(0,0,0,0.55))${logoRise < 0.9 ? ` blur(${((1 - logoRise) * 8).toFixed(2)}px)` : ""}` }} />
      )}

      {/* ---- Don Nelson ---- */}
      {f >= t.don - 8 && (
        <div style={{ position: "absolute", left: nx, top: ny + nBob, width: NW, height: NH, transform: `scale(${nScale.toFixed(4)}) rotate(${nRot.toFixed(3)}deg)`, transformOrigin: "0 0", filter: nBlur > 0.3 ? `blur(${nBlur.toFixed(2)}px)` : undefined }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden", background: CARD, boxShadow: "0 30px 90px rgba(0,0,0,0.6)" }}>
            <Img src={NELSON} style={{ position: "absolute", left: 0, top: 0, width: NW, height: NH, transform: `scale(${z.toFixed(4)})`, transformOrigin: `${NOSE.x}px ${NOSE.y}px` }} />
            {/* the nose's cast shadow on his face: sun from the right, so it falls left and a little down */}
            {f >= t.wearing && (
              <div style={{ position: "absolute", left: NOSE.x - noseD * 0.95, top: NOSE.y - noseD * 0.25, width: noseD * 1.25, height: noseD * 0.95, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(40,8,6,0.62), rgba(40,8,6,0))", opacity: 0.25 * nearFace + 0.6 * landed, filter: "blur(4px)" }} />
            )}
            {/* the date band */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 168, transform: `translateY(${((1 - band) * 170).toFixed(1)}px)`, background: "linear-gradient(to bottom, rgba(13,17,23,0), rgba(13,17,23,0.78) 34%, rgba(13,17,23,0.94))" }}>
              <div style={{ position: "absolute", left: 32, bottom: 22, display: "flex", fontFamily: FONT, fontWeight: 800, fontSize: 112, color: "#FFFFFF", letterSpacing: -2, textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                {[1, 9, 9, 9].map((d, i) => (
                  <ClownNoseDigit key={i} f={f} land={t.y1999 - (3 - i) * 6} to={d} size={112} />
                ))}
              </div>
              <div style={{ position: "absolute", right: 30, bottom: 34, textAlign: "right", fontFamily: FONT }}>
                <div style={{ fontWeight: 700, fontSize: 30, color: "#FFFFFF", letterSpacing: 0.5 }}>Don Nelson</div>
                <div style={{ fontWeight: 500, fontSize: 24, color: GREY, marginTop: 2 }}>Dallas coach</div>
              </div>
            </div>
            <div style={{ position: "absolute", right: 24, top: 20, fontFamily: FONT, fontWeight: 500, fontSize: 22, color: "#C9D1D9", opacity: 0.9, textShadow: CREDIT_SHADOW, whiteSpace: "nowrap" }}>
              Sean P. Anderson, CC BY 2.0
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 28, border: `1px solid ${HAIR}`, pointerEvents: "none" }} />
          {/* the nose, in the card's own space so it rides the push and the laugh */}
          {f >= t.clown - 2 && (
            <div style={{ position: "absolute", left: noseX, top: noseY, width: 0, height: 0, opacity: prog(f, t.clown - 2, 4, ease.linear), transform: `scale(${(0.35 + 0.65 * appear).toFixed(4)})` }}>
              {/* a soft shadow under the ball while it hangs, on the photo behind it */}
              {!landed && <div style={{ position: "absolute", left: -noseD * 0.55, top: noseD * 0.38, width: noseD * 1.1, height: noseD * 0.3, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,0.45), rgba(0,0,0,0))", opacity: 1 - fallK, filter: "blur(6px)" }} />}
              <ClownNoseFoam d={noseD} hole={hole} rot={noseRot} sx={1 + 0.16 * sq - 0.05 * stretch} sy={1 - 0.24 * sq + stretch} />
            </div>
          )}
        </div>
      )}

      {/* ---- Shaq, Lakers, 1999 ---- */}
      {f >= t.shaq - 10 && sOut < 1 && (
        <div style={{ position: "absolute", left: sx, top: sy, width: SW, height: SH, transform: `rotate(${sRot.toFixed(3)}deg)`, transformOrigin: "50% 100%", filter: sIn < 0.85 ? `blur(${((1 - sIn) * 10).toFixed(2)}px)` : undefined }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 22, overflow: "hidden", background: CARD, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
            <Img src={SHAQ99} style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transform: `scale(${(1.02 + 0.03 * prog(f, t.shaq, 90, ease.linear)).toFixed(4)})`, transformOrigin: "50% 40%" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: "linear-gradient(to bottom, rgba(13,17,23,0), rgba(13,17,23,0.85))" }} />
            <div style={{ position: "absolute", left: 16, bottom: 14, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#FFFFFF" }}>Shaq</div>
            <div style={{ position: "absolute", right: 12, top: 12, fontFamily: FONT, fontWeight: 500, fontSize: 18, color: "#C9D1D9", opacity: 0.9, textShadow: CREDIT_SHADOW, whiteSpace: "nowrap" }}>
              Steve Lipofsky, CC BY 3.0
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 22, border: `1px solid ${HAIR}` }} />
        </div>
      )}

      {/* ---- the stamp itself, on top of everything while it works ---- */}
      {sp.lift < 1 && (
        <div style={{ position: "absolute", left: SC.x, top: sp.y + jolt * 0.5, transform: `rotate(${sp.rot.toFixed(3)}deg)`, transformOrigin: "50% 100%", opacity: cardIn }}>
          <ClownNoseStampBody squash={sp.squash} wet={1 - prog(f, t.name, 2, ease.linear)} />
        </div>
      )}
    </AbsoluteFill>
  );
};
