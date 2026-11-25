// `cta`: "Follow for the next number the box score hides, and send this to the friend who only checks points."
// The creator's real Instagram profile (read from their own account today: 1 post, 605 followers, 0 following, bio
// "Basketball Simplified", their real avatar and their one real post) in iOS dark mode. Follow is pressed and turns
// Following, 605 rolls to 606. The profile pulls back and NBA.com's dim box row for Wembanyama writes in under it, all
// 20 columns; on "hides" FGA 29 and FTA 6 light gold. On "send" the reel's paper plane is tapped, the profile leaves,
// the share sheet rises; on "friend" one grey contact is picked (blue check, Send). On "points" the row has folded down
// to its PTS column alone: 50, what that friend sees. Notes: notes/FollowAndSend.md.
import React from "react";
import { Img, staticFile } from "remotion";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
import { loadFont as loadRobotoCond } from "@remotion/google-fonts/RobotoCondensed";
import { Column, arrive, blurIn, ease, mix, pop, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import {
  FollowAndSendAddPerson,
  FollowAndSendBell,
  FollowAndSendChevron,
  FollowAndSendDownload,
  FollowAndSendGrid,
  FollowAndSendLink,
  FollowAndSendMore,
  FollowAndSendPlane,
  FollowAndSendReels,
  FollowAndSendSearch,
  FollowAndSendShareOut,
  FollowAndSendSilhouette,
  FollowAndSendStatus,
  FollowAndSendStoryAdd,
  FollowAndSendTagged,
} from "./FollowAndSendIcons";

const ROBOTO = loadRoboto("normal", { weights: ["400", "500", "700", "900"], subsets: ["latin"] }).fontFamily;
const COND = loadRobotoCond("normal", { weights: ["400", "700", "900"], subsets: ["latin"] }).fontFamily;
const SF = "Inter, sans-serif";

// Instagram iOS dark mode
const IG = { bg: "#000000", text: "#F5F5F5", sub: "#A8A8A8", btn: "#363636", blue: "#0095F6", sep: "#262626", sheet: "#262626", field: "#363636" };
// NBA.com dark mode (its CSS, see notes/PhoneBoxScore.md)
const N = { surface: "#191C23", text: "#F3F3F3", muted: "#A4A2A2", rule: "#1A2E3D", gold: "#F2B33D", label: "#8B949E" };

// the creator's account, read through their own connection on 23 Nov 2026 (assets/refs/profile/)
const ACCOUNT = { handle: "ballsimplified", name: "Ball Simplified", bio: "Basketball Simplified", posts: 1, followers: 605, following: 0 };

// Wembanyama's NBA.com row, NOP at SAS, 21 Nov 2026 (boxscore-0022600278-clean.json), NBA.com column order
const COLS = ["MIN", "FGM", "FGA", "FG%", "3PM", "3PA", "3P%", "FTM", "FTA", "FT%", "OREB", "DREB", "REB", "AST", "STL", "BLK", "TO", "PF", "PTS", "+/-"];
const ROW = ["31:51", "20", "29", "69.0", "5", "11", "45.5", "5", "6", "83.3", "3", "15", "18", "1", "4", "5", "3", "3", "50", "35"];
const WID = [66, 37, 37, 56, 37, 37, 56, 37, 37, 56, 44, 44, 37, 37, 37, 37, 33, 33, 44, 40];
const NAME_W = 172;
const PTS = 18;
const COST = [2, 8]; // FGA, FTA

// the phone, a 393 pt iPhone screen drawn 800 px wide
const SW = 800;
const k = SW / 393;
const pt = (n: number) => n * k;
const SH = 906; // the screen is cropped here, under the first row of the grid

const FollowAndSendProfile: React.FC<{ f: number; press: number }> = ({ f, press }) => {
  const dip = prog(f, press, 4) - prog(f, press + 5, 7);
  const flip = f >= press + 6;
  const btnBg = mix(f, press + 5, 5, IG.blue, IG.btn);
  const roll = prog(f, press + 8, 9, ease.inOut);
  const ring = prog(f, press, 16, ease.out);
  const avatarSize = pt(88);
  return (
    <div style={{ position: "absolute", inset: 0, background: IG.bg, fontFamily: SF, color: IG.text, overflow: "hidden", borderRadius: `${pt(54)}px ${pt(54)}px 0 0` }}>
      {/* status bar */}
      <div style={{ position: "absolute", left: pt(34), top: pt(16), fontSize: pt(17), fontWeight: 600, letterSpacing: -0.3 }}>9:41</div>
      <div style={{ position: "absolute", left: SW / 2 - pt(62), top: pt(11), width: pt(124), height: pt(36), borderRadius: pt(18), background: "#0A0A0A", boxShadow: "inset 0 0 0 1px #141414" }} />
      <div style={{ position: "absolute", right: pt(26), top: pt(19) }}><FollowAndSendStatus k={k} /></div>
      {/* nav */}
      <FollowAndSendChevron size={pt(28)} style={{ position: "absolute", left: pt(8), top: pt(62) }} />
      <div style={{ position: "absolute", left: pt(42), top: pt(64), fontSize: pt(20), fontWeight: 700, letterSpacing: -0.4 }}>{ACCOUNT.handle}</div>
      <FollowAndSendBell size={pt(27)} style={{ position: "absolute", right: pt(52), top: pt(62) }} />
      <FollowAndSendMore size={pt(27)} style={{ position: "absolute", right: pt(12), top: pt(62) }} />
      {/* avatar, name, counts */}
      <div style={{ position: "absolute", left: pt(16), top: pt(106), width: avatarSize, height: avatarSize, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 1px rgba(255,255,255,0.12)" }}>
        <Img src={staticFile("wemby-50/followandsend-avatar.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: pt(124), top: pt(110), fontSize: pt(15), fontWeight: 600 }}>{ACCOUNT.name}</div>
      {[
        { n: String(ACCOUNT.posts), l: "post" },
        { n: "", l: "followers" },
        { n: String(ACCOUNT.following), l: "following" },
      ].map((c, i) => (
        <div key={c.l} style={{ position: "absolute", left: pt(124 + i * 86), top: pt(134) }}>
          <div style={{ fontSize: pt(17), fontWeight: 700, height: pt(22), lineHeight: `${pt(22)}px`, display: "flex", overflow: "hidden" }}>
            {i === 1 ? (
              <>
                <span>60</span>
                <span style={{ display: "inline-block", height: pt(22), overflow: "hidden" }}>
                  <span style={{ display: "block", transform: `translateY(${(-roll * pt(22)).toFixed(2)}px)` }}>
                    <span style={{ display: "block" }}>5</span>
                    <span style={{ display: "block" }}>6</span>
                  </span>
                </span>
              </>
            ) : (
              c.n
            )}
          </div>
          <div style={{ fontSize: pt(14), marginTop: pt(1) }}>{c.l}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: pt(16), top: pt(204), fontSize: pt(14) }}>{ACCOUNT.bio}</div>
      {/* buttons */}
      <div
        style={{
          position: "absolute",
          left: pt(16),
          top: pt(234),
          width: pt(157),
          height: pt(34),
          borderRadius: pt(9),
          background: btnBg,
          transform: `scale(${(1 - 0.06 * dip).toFixed(4)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: pt(5),
          fontSize: pt(14),
          fontWeight: 600,
          color: "#FFFFFF",
        }}
      >
        {flip ? "Following" : "Follow"}
        {flip && (
          <svg width={pt(11)} height={pt(11)} viewBox="0 0 12 12" style={{ opacity: prog(f, press + 6, 5) }}>
            <path d="M2 4.2 6 8l4-3.8" fill="none" stroke="#F5F5F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {/* the tap */}
      <div
        style={{
          position: "absolute",
          left: pt(16 + 157 / 2) - pt(40),
          top: pt(234 + 17) - pt(40),
          width: pt(80),
          height: pt(80),
          borderRadius: "50%",
          background: "rgba(255,255,255,0.35)",
          transform: `scale(${(0.2 + 1.1 * ring).toFixed(3)})`,
          opacity: f >= press ? 0.9 * (1 - ring) : 0,
        }}
      />
      <div style={{ position: "absolute", left: pt(179), top: pt(234), width: pt(157), height: pt(34), borderRadius: pt(9), background: IG.btn, display: "flex", alignItems: "center", justifyContent: "center", fontSize: pt(14), fontWeight: 600 }}>Message</div>
      <div style={{ position: "absolute", left: pt(342), top: pt(234), width: pt(35), height: pt(34), borderRadius: pt(9), background: IG.btn, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <FollowAndSendAddPerson size={pt(18)} stroke={2.2} />
      </div>
      {/* tabs */}
      {[FollowAndSendGrid, FollowAndSendReels, FollowAndSendTagged].map((Icon, i) => (
        <div key={i} style={{ position: "absolute", left: (SW / 3) * i, width: SW / 3, top: pt(286), height: pt(40), display: "flex", justifyContent: "center", alignItems: "center", opacity: i === 0 ? 1 : 0.6 }}>
          <Icon size={pt(24)} stroke={i === 0 ? 2.1 : 1.8} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, top: pt(327), width: SW, height: 2, background: IG.sep }} />
      <div style={{ position: "absolute", left: 0, top: pt(326), width: SW / 3, height: pt(1.5), background: IG.text }} />
      {/* the grid: their one post, then nothing yet */}
      <div style={{ position: "absolute", left: 0, top: pt(329), width: pt(130.3), height: pt(173.7), overflow: "hidden", background: "#111" }}>
        <Img src={staticFile("wemby-50/followandsend-post-netrating.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 45%" }} />
        <FollowAndSendReels size={pt(17)} color="#FFFFFF" stroke={2.2} style={{ position: "absolute", right: pt(7), top: pt(7), filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))" }} />
      </div>
    </div>
  );
};

const FollowAndSendRow: React.FC<{ f: number; writeAt: number; lit: number; gold: number; fold: (i: number) => number; grow: number; sweep: number }> = ({ f, writeAt, lit, gold, fold, grow, sweep }) => {
  const headH = 50 + 14 * grow;
  const valH = 74 + 110 * grow;
  // the lit cost cells take room so their grown numbers never touch a neighbour ("20 29" must not read "2029")
  const widths = WID.map((w, i) => (i === PTS ? w + (260 - w) * grow : (w + (COST.includes(i) ? 26 * lit : 0)) * (1 - fold(i))));
  const nameW = NAME_W * (1 - fold(-1));
  const total = nameW + widths.reduce((a, b) => a + b, 0) + 28 * (1 - grow) + 40 * grow;
  const cardIn = blurIn(f, writeAt - 6, { dur: 8, rise: 16 });
  const cell = (i: number, head: boolean) => {
    const isCost = COST.includes(i);
    const isPts = i === PTS;
    const c = fold(i);
    const at = writeAt + (i + 1) * 2 + (head ? -1 : 0);
    const appear = prog(f, at, 6, ease.out);
    const up = isCost ? lit : 0;
    const base = head ? 14 : 22;
    const size = isPts ? (head ? 14 + 20 * grow : 22 + 138 * grow) : base;
    const color = isCost
      ? interpolateGold(head ? N.muted : N.text, gold)
      : isPts && !head
        ? "#FFFFFF"
        : head
          ? N.muted
          : N.text;
    const dimOthers = !isCost && !isPts ? 1 - 0.45 * lit : 1;
    const baseOp = isPts ? 0.95 : head ? 0.75 : 0.6;
    return (
      <div
        key={i}
        style={{
          width: widths[i],
          flex: "none",
          height: head ? headH : valH,
          position: "relative",
          overflow: "visible",
          opacity: appear * Math.max(0, 1 - c * 1.6) * (isCost ? Math.max(baseOp, gold) : baseOp) * dimOthers,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: isPts ? undefined : 6 + (isCost ? 13 * lit : 0),
            left: isPts ? 0 : undefined,
            width: isPts ? "100%" : undefined,
            textAlign: isPts ? "center" : "right",
            bottom: head ? 10 : (valH - size * 1.1) / 2,
            fontFamily: head ? COND : ROBOTO,
            fontWeight: head ? 400 : isPts ? (grow > 0.3 ? 900 : 500) : isCost && gold > 0.5 ? 700 : 400,
            fontSize: size,
            lineHeight: 1.1,
            letterSpacing: head ? 1 + 1.5 * grow : -size * 0.01,
            whiteSpace: "nowrap",
            color,
            transform: up > 0 ? `translateY(${(-(head ? 8 : 12) * up).toFixed(2)}px) scale(${(1 + (head ? 0.5 : 0.95) * up).toFixed(3)})` : undefined,
            transformOrigin: head ? "100% 100%" : "70% 50%",
            textShadow: isCost && up > 0 ? `0 0 ${18 * up}px rgba(242,179,61,${0.55 * up})` : isPts && !head && grow > 0 && grow <= 0.2 ? `0 ${8 * grow}px ${30 * grow}px rgba(0,0,0,0.6)` : undefined,
            // a text-shadow shows through a clipped transparent fill and turns the 50 grey: shadow it with a filter instead
            filter: isPts && !head && grow > 0.2 ? `drop-shadow(0 ${8 * grow}px ${18 * grow}px rgba(0,0,0,0.6))` : undefined,
            ...(isPts && !head && grow > 0.2
              ? {
                  backgroundImage: `linear-gradient(105deg, #FFFFFF 0%, #FFFFFF ${sweep * 140 - 30}%, #FFF4DA ${sweep * 140 - 15}%, #FFFFFF ${sweep * 140}%, #FFFFFF 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
              : {}),
          }}
        >
          {head ? COLS[i] : ROW[i]}
        </div>
        {isCost && !head && up > 0 && (
          <div style={{ position: "absolute", left: -6, right: -6, top: 6, bottom: 6, borderRadius: 8, background: `rgba(242,179,61,${0.13 * up})`, boxShadow: `inset 0 0 0 2px rgba(242,179,61,${0.55 * up})` }} />
        )}
      </div>
    );
  };
  const nameAppear = prog(f, writeAt, 6);
  return (
    <div style={{ position: "absolute", left: 540 - total / 2, width: total, top: 0, ...cardIn, transform: `${cardIn.transform ?? ""} scale(${Math.min(1, 1042 / total).toFixed(4)})`, transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", inset: 0, height: headH + valH, background: N.surface, borderRadius: 14, boxShadow: "0 18px 50px rgba(0,0,0,0.55), inset 0 0 0 2px #232833", overflow: "hidden" }}>
        {/* a light passing along the row */}
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 220, left: -260 + sweep * (total + 520), background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.07), rgba(255,255,255,0))", opacity: grow > 0 ? 0 : 1 }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: headH, height: 2, background: N.rule }} />
      </div>
      <div style={{ position: "relative", display: "flex", paddingLeft: 14 * (1 - grow) + 20 * grow }}>
        {/* pinned PLAYER column */}
        <div style={{ width: nameW, flex: "none", overflow: "hidden", opacity: nameAppear * Math.max(0, 1 - fold(-1) * 1.6) * (1 - 0.45 * lit) }}>
          <div style={{ height: headH, display: "flex", alignItems: "flex-end", paddingBottom: 10, fontFamily: COND, fontSize: 15, letterSpacing: 1.6, color: N.muted, opacity: 0.75 }}>PLAYER</div>
          <div style={{ height: valH, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", fontFamily: COND, fontSize: 23, color: N.text, opacity: 0.8 }}>
            V. Wembanyama<span style={{ fontSize: 15, fontWeight: 900, color: N.muted }}>C</span>
          </div>
        </div>
        <div>
          <div style={{ display: "flex" }}>{COLS.map((_, i) => cell(i, true))}</div>
          <div style={{ display: "flex" }}>{ROW.map((_, i) => cell(i, false))}</div>
        </div>
      </div>
    </div>
  );
};

// recolour toward the reel's gold for the cost cells
const interpolateGold = (from: string, t: number) => {
  const a = parseInt(from.slice(1), 16);
  const b = parseInt(N.gold.slice(1), 16);
  const ch = (s: number) => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};

const FollowAndSendSheet: React.FC<{ f: number; enter: number; friend: number }> = ({ f, enter, friend }) => {
  const SHW = 800;
  const lit = prog(f, friend, 7, ease.out);
  const cols = [SHW / 6, SHW / 2, (SHW * 5) / 6];
  const A = 122;
  const actions = [
    { l: "Add to story", I: FollowAndSendStoryAdd },
    { l: "Copy link", I: FollowAndSendLink },
    { l: "Share", I: FollowAndSendShareOut },
    { l: "Download", I: FollowAndSendDownload },
  ];
  const sendIn = prog(f, friend + 4, 8, ease.out);
  return (
    <div style={{ position: "absolute", inset: 0, background: IG.sheet, borderRadius: "36px 36px 0 0", fontFamily: SF, color: IG.text, boxShadow: "0 -20px 60px rgba(0,0,0,0.55)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: SHW / 2 - 37, top: 16, width: 74, height: 10, borderRadius: 5, background: "#5E5E5E" }} />
      {/* search */}
      <div style={{ position: "absolute", left: 32, top: 48, width: SHW - 64 - 82, height: 76, borderRadius: 20, background: IG.field, display: "flex", alignItems: "center", gap: 16, paddingLeft: 24, ...blurIn(f, enter + 4, { dur: 8 }) }}>
        <FollowAndSendSearch size={34} color={IG.sub} stroke={2.2} />
        <span style={{ fontSize: 32, color: IG.sub }}>Search</span>
      </div>
      <FollowAndSendAddPerson size={52} stroke={1.9} style={{ position: "absolute", right: 34, top: 60, ...blurIn(f, enter + 6, { dur: 8 }) }} />
      {/* recent contacts: grey default pictures, names blurred */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = cols[i % 3];
        const y = i < 3 ? 156 : 338;
        const me = i === 1;
        const l = me ? lit : 0;
        const dim = me ? 1 : 1 - 0.45 * lit;
        const appear = blurIn(f, enter + 8 + i * 3, { dur: 8, scaleFrom: 0.85 });
        return (
          <div key={i} style={{ position: "absolute", left: x - A / 2, top: y, width: A, height: A + 60, ...appear, opacity: Number(appear.opacity) * dim }}>
            <div style={{ position: "absolute", inset: 0, height: A, borderRadius: "50%", boxShadow: l > 0 ? `0 0 0 ${5 * l}px ${IG.sheet}, 0 0 0 ${10 * l}px rgba(245,245,245,${0.95 * l}), 0 0 ${40 * l}px rgba(255,255,255,${0.25 * l})` : undefined }}>
              <FollowAndSendSilhouette size={A} bg={mix(f, friend, 7, "#4B4B4B", "#6B6B6B")} fg={me ? mix(f, friend, 7, "#9A9A9A", "#E6E6E6") : "#9A9A9A"} />
            </div>
            <div style={{ position: "absolute", left: A / 2 - (me ? 52 : 46 + (i % 2) * 10), top: A + 22, width: me ? 104 : 92 + (i % 2) * 20, height: 20, borderRadius: 10, background: me ? mix(f, friend, 7, "#4A4A4A", "#7A7A7A") : "#4A4A4A", filter: "blur(2px)" }} />
            {me && l > 0 && (
              <div style={{ position: "absolute", left: A - 40, top: A - 40, width: 46, height: 46, borderRadius: "50%", background: IG.blue, boxShadow: `0 0 0 5px ${IG.sheet}`, display: "flex", alignItems: "center", justifyContent: "center", ...pop(f, friend, { dur: 9, from: 0.3 }) }}>
                <svg width="26" height="26" viewBox="0 0 24 24">
                  <path d="M5 12.5 10 17.5 19 7.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
      {/* the bottom row: actions, then Send once someone is picked */}
      {actions.map((a, i) => {
        const appear = blurIn(f, enter + 14 + i * 2, { dur: 8 });
        return (
          <div key={a.l} style={{ position: "absolute", left: 100 + i * 200 - 80, width: 160, top: 532, textAlign: "center", ...appear, opacity: Number(appear.opacity) * (1 - sendIn) }}>
            <div style={{ width: 84, height: 84, margin: "0 auto", borderRadius: "50%", background: IG.btn, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <a.I size={38} stroke={1.9} />
            </div>
            <div style={{ marginTop: 10, fontSize: 22, color: IG.text, whiteSpace: "nowrap" }}>{a.l}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 32, width: SHW - 64, top: 548, height: 84, borderRadius: 18, background: IG.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 600, color: "#fff", opacity: sendIn, transform: `translateY(${((1 - sendIn) * 24).toFixed(1)}px)` }}>Send</div>
    </div>
  );
};

export const FollowAndSend: React.FC = () => {
  const { f, cue, endsOn, scene } = useScene();
  const mount = scene.from - LEAD;
  const tFollow = cue("Follow");
  const tNext = cue("next");
  const tBox = cue("box");
  const tHides = cue("hides");
  const tSend = cue("send");
  const tFriend = cue("friend");
  const tWho = cue("who");
  const tPoints = cue("points");

  // the profile: rises in, Follow pressed, pulls back, leaves on "send"
  const pE = arrive(f, mount, 14);
  const pB = arrive(f, tNext - 12, 22);
  const pX = prog(f, tSend, 10, ease.in);
  const pScale = 1 - 0.32 * pB;
  const pTop = 538 - 14 * pB + (1 - pE) * 420 - 300 * pX;
  const press = tFollow + 2;

  // the box row
  const writeAt = tNext - 4;
  const rowTop = 1168 + (546 - 1168) * arrive(f, tSend + 1, 18);
  const lift = prog(f, tHides, 6, ease.out);
  const settle = prog(f, tHides + 26, 14, ease.inOut);
  const lit = lift * (1 - 0.75 * settle);
  const gold = lift;
  const foldAt = (i: number) => {
    // cells fold from the far ends in toward PTS; the PLAYER column (-1) first
    if (i === PTS) return 0;
    const d = i === -1 ? 19 : Math.abs(i - PTS);
    return prog(f, tWho - 6 + (19 - d) * 1.2, 15, ease.inOut);
  };
  const grow = prog(f, tPoints - 3, 13, ease.back);
  const sweep = f < tSend ? prog(f, tBox - 6, 30, ease.inOut) : prog(f, tPoints + 14, 40, ease.inOut);
  const rowH = 50 + 14 * grow + 74 + 110 * grow;

  // the sheet
  const sheetTop = 1470 + (806 - 1470) * arrive(f, tSend + 1, 16);

  // the reel's own share button, tapped on "send"
  const planeIn = pop(f, endsOn("send", 8), { dur: 8, from: 0.4 });
  const planeTap = prog(f, tSend, 4) - prog(f, tSend + 4, 6);
  const planeRing = prog(f, tSend, 16);
  const planeOut = prog(f, tSend + 6, 8, ease.in);

  // the hold: a slow push
  const push = 1 + 0.03 * prog(f, tPoints + 8, 60, ease.linear);

  return (
    <Column width={1080}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push.toFixed(4)})`, transformOrigin: "540px 780px" }}>
        {/* the profile */}
        {pX < 1 && (
          <div
            style={{
              position: "absolute",
              left: 540 - SW / 2,
              top: pTop,
              width: SW,
              height: SH,
              transform: `scale(${pScale.toFixed(4)})`,
              transformOrigin: "50% 0",
              opacity: prog(f, mount, 4, ease.linear) * (1 - pX),
              filter: pX > 0 ? `blur(${(pX * 14).toFixed(1)}px)` : undefined,
            }}
          >
            <div style={{ position: "absolute", inset: -6, borderRadius: `${pt(54) + 6}px ${pt(54) + 6}px 0 0`, background: "linear-gradient(180deg, #4A4C52, #2A2C30 40%, #1C1D20)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", WebkitMaskImage: "linear-gradient(180deg, #000 82%, transparent 100%)" }} />
            <div style={{ position: "absolute", inset: 0, WebkitMaskImage: "linear-gradient(180deg, #000 80%, transparent 100%)" }}>
              <FollowAndSendProfile f={f} press={press} />
            </div>
          </div>
        )}

        {/* NBA.com's row */}
        {f >= writeAt - 6 && (
          <div style={{ position: "absolute", left: 0, width: 1080, top: rowTop, height: rowH }}>
            <FollowAndSendRow f={f} writeAt={writeAt} lit={lit} gold={gold} fold={foldAt} grow={grow} sweep={sweep} />
            <div style={{ position: "absolute", left: 44, top: rowH + 16, fontFamily: SF, fontSize: 26, color: N.label, whiteSpace: "nowrap", opacity: prog(f, writeAt + 30, 10) * (1 - prog(f, tSend, 8)) }}>
              NBA.com box score, Nov 21 2026
            </div>
          </div>
        )}

        {/* the paper plane */}
        {f >= endsOn("send", 8) && planeOut < 1 && (
          <div style={{ position: "absolute", left: 905 - 60, top: 860 - 60, width: 120, height: 120 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(255,255,255,0.3)", transform: `scale(${(0.3 + 1.1 * planeRing).toFixed(3)})`, opacity: f >= tSend ? 1 - planeRing : 0 }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...planeIn, opacity: Number(planeIn.opacity) * (1 - planeOut) }}>
              <div style={{ transform: `scale(${(1 - 0.12 * planeTap).toFixed(3)}) translate(${(planeOut * 40).toFixed(1)}px, ${(-planeOut * 40).toFixed(1)}px)` }}>
                <FollowAndSendPlane size={96} stroke={1.9} color="#FFFFFF" style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.6))" }} />
              </div>
            </div>
          </div>
        )}

        {/* the share sheet */}
        {f >= tSend && (
          <div style={{ position: "absolute", left: 140, width: 800, top: sheetTop, height: 1450 - 806 }}>
            <FollowAndSendSheet f={f} enter={tSend + 1} friend={tFriend} />
          </div>
        )}
      </div>
    </Column>
  );
};
