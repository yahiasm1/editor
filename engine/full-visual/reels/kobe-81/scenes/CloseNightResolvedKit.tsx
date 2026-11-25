// CloseNightResolved drawing kit: the reel's LED scoreboard with rows that relabel (RAPTORS 104 / LAKERS 122 rolls
// to BRYANT 55 / RAPTORS 41 for the second half), the point bulb, the creator's real Instagram profile (dark mode)
// and Instagram's share sheet whose preview is the reel's 9 x 9 board.
import React from "react";
import { Img, staticFile } from "remotion";
import { StaplesNightDots, StaplesNightLed, StaplesNightReadout } from "./StaplesNightBoard";

export const CloseNightResolvedGold = "#FDB927";
export const CloseNightResolvedRed = "#CE1141";
const GOLD_DIM = "rgba(253,185,39,0.075)";
const IG_BLUE = "#0095F6";
const IG_FONT = "Inter, sans-serif";

// ---------------------------------------------------------------- the board

export type CloseNightResolvedRowSt = {
  name: string;
  prevName: string;
  roll: number; // 0 shows prevName, 1 shows name
  score: number | null;
  gold?: boolean; // digits in Kobe's gold instead of the board's red
  logo: React.ReactNode;
  prevLogo: React.ReactNode;
  flare?: number;
};

const ROW_H = 70;

const Row: React.FC<{ y: number; row: CloseNightResolvedRowSt }> = ({ y, row }) => {
  const L = StaplesNightLed;
  const r = row.roll;
  const flare = row.flare ?? 0;
  const s = row.score === null ? "   " : String(row.score).padStart(3, " ");
  const color = row.gold ? CloseNightResolvedGold : L.red;
  const dim = row.gold ? GOLD_DIM : L.redDim;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 900, height: ROW_H }}>
      {/* the logo slot flips like a card */}
      <div style={{ position: "absolute", left: 22, top: 7, width: 56, height: 56 }}>
        {r < 0.5 ? (
          <div style={{ transform: `scaleY(${1 - r * 2})` }}>{row.prevLogo}</div>
        ) : (
          <div style={{ transform: `scaleY(${(r - 0.5) * 2})` }}>{row.logo}</div>
        )}
      </div>
      {/* the name, rolling like a dot-matrix line feed */}
      <div style={{ position: "absolute", left: 98, top: 12, width: 380, height: 50, overflow: "hidden" }}>
        {r < 1 && (
          <div style={{ position: "absolute", left: 0, top: -50 * r }}>
            <StaplesNightDots text={row.prevName} size={44} w={380} color={L.amber} dim={L.amberDim} glow={1} />
          </div>
        )}
        {r > 0 && (
          <div style={{ position: "absolute", left: 0, top: 50 * (1 - r) }}>
            <StaplesNightDots text={row.name} size={44} w={380} color={L.amber} dim={L.amberDim} glow={1 + 0.6 * flare} />
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 440, top: 8, transform: `scale(${1 + flare * 0.07})`, transformOrigin: "right center" }}>
        <StaplesNightReadout text={s} h={56} w={160} color={color} dim={dim} glow={1 + flare * 0.8} />
      </div>
    </div>
  );
};

export const CloseNightResolvedBoard: React.FC<{ top: CloseNightResolvedRowSt; bottom: CloseNightResolvedRowSt; period: string; prevPeriod: string; periodRoll: number; clock: string }> = ({ top, bottom, period, prevPeriod, periodRoll, clock }) => {
  const L = StaplesNightLed;
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 532,
        width: 900,
        height: 160,
        borderRadius: 14,
        background: `linear-gradient(180deg, #0d0d0e 0%, ${L.housing} 18%, ${L.housing} 100%)`,
        border: `2px solid ${L.edge}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -2px 6px rgba(0,0,0,0.8), 0 18px 50px rgba(0,0,0,0.65), 0 0 40px rgba(255,42,28,0.10)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 5px)" }} />
      <Row y={10} row={top} />
      <Row y={10 + ROW_H} row={bottom} />
      <div style={{ position: "absolute", left: 628, top: 14, width: 2, height: 132, background: "#1f2226" }} />
      <div style={{ position: "absolute", left: 646, top: 20, width: 236, height: 44, overflow: "hidden" }}>
        {periodRoll < 1 && (
          <div style={{ position: "absolute", left: 0, top: -44 * periodRoll }}>
            <StaplesNightDots text={prevPeriod} size={36} w={230} color={L.amber} dim={L.amberDim} glow={1} anchor="end" />
          </div>
        )}
        {periodRoll > 0 && (
          <div style={{ position: "absolute", left: 0, top: 44 * (1 - periodRoll) }}>
            <StaplesNightDots text={period} size={36} w={230} color={L.amber} dim={L.amberDim} glow={1} anchor="end" />
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 650, top: 80 }}>
        <StaplesNightReadout text={clock} h={60} w={226} color={L.amber} dim={L.amberDim} glow={0.9} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(165deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 38%)" }} />
    </div>
  );
};

export const CloseNightResolvedLogo: React.FC<{ file: string; pulse?: number }> = ({ file, pulse = 0 }) => (
  <div style={{ width: 56, height: 56, transform: `scale(${1 + 0.2 * pulse})`, filter: pulse > 0.01 ? `drop-shadow(0 0 ${(10 * pulse).toFixed(1)}px rgba(206,17,65,0.95))` : undefined }}>
    <Img src={staticFile(`kobe-81/${file}`)} style={{ width: 56, height: 56, objectFit: "contain" }} />
  </div>
);

export const CloseNightResolvedChip: React.FC = () => (
  <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", border: `2px solid ${CloseNightResolvedGold}`, boxShadow: "0 0 12px rgba(253,185,39,0.5)" }}>
    <Img src={staticFile("kobe-81/closenightresolved-kobe-chip.jpg")} style={{ width: 52, height: 52, objectFit: "cover" }} />
  </div>
);

// ---------------------------------------------------------------- the point bulb

export const CloseNightResolvedBulb: React.FC<{ x: number; y: number; r: number; color: string; lit: number; glow?: number }> = ({ x, y, r, color, lit, glow = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
    {lit > 0.01 && (
      <div style={{ position: "absolute", left: -r * 1.5, top: -r * 1.5, width: r * 5, height: r * 5, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 62%)`, opacity: Math.min(1, 0.45 * lit * glow) }} />
    )}
    <div style={{ position: "absolute", inset: -1.5, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #2a3038 0%, #12161c 70%)", border: "1px solid #313842" }} />
    <div
      style={{
        position: "absolute",
        inset: 0.5,
        borderRadius: "50%",
        background: `radial-gradient(circle at 44% 38%, #FFFDF4 0%, ${color} 42%, ${color} 72%, rgba(0,0,0,0.35) 100%)`,
        opacity: lit,
        boxShadow: `0 0 ${(r * 0.7 * glow * lit).toFixed(1)}px ${color}`,
      }}
    />
  </div>
);

// ---------------------------------------------------------------- Instagram glyphs (outline, 24-unit grid)

const Glyph: React.FC<{ d: string; size: number; color?: string; stroke?: number; fill?: string }> = ({ d, size, color = "#F5F5F5", stroke = 2, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <path d={d} fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const G = {
  back: "M15 4 7 12l8 8",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  grid: "M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18",
  reels: "M3 3h18v18H3zM3 8h18M8 3l3 5M14 3l3 5M10 12v6l5-3z",
  tagged: "M4 4h16v13h-5l-3 3-3-3H4zM12 7.5a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6zM7.5 15.5c1-1.8 2.6-2.6 4.5-2.6s3.5.8 4.5 2.6",
  plane: "M22 3 9.2 10.2M22 3l-7 18-3.8-10.8L2 7z",
  search: "M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM20 20l-4.8-4.8",
  addStory: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 8v8M8 12h8",
  link: "M10 14a4 4 0 0 0 5.7 0l3.2-3.2a4 4 0 0 0-5.7-5.7L11.6 6.7M14 10a4 4 0 0 0-5.7 0l-3.2 3.2a4 4 0 0 0 5.7 5.7l1.6-1.6",
  share: "M12 3v12M7 8l5-5 5 5M5 13v7h14v-7",
  download: "M12 3v12M7 10l5 5 5-5M5 20h14",
  personPlus: "M10 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM3 20c1-3.5 3.8-5.5 7-5.5s6 2 7 5.5M19 8v6M16 11h6",
  chevron: "M6 9l6 6 6-6",
  check: "M5 12.5l4.2 4.2L19 7",
};

// ---------------------------------------------------------------- the profile (Instagram dark mode, visitor view)

export const CloseNightResolvedProfile: React.FC<{
  press: number; // 0..1 the Follow press dip
  following: number; // 0 Follow (blue), 1 Following (grey)
  followerRoll: number; // 0 shows 605, 1 shows 606
  ripple: number; // 0..1 the tap ripple
  grid: number; // 0..1 the post row arriving
  sweep: number; // -0.4..1.4 light across the real post
}> = ({ press, following, followerRoll, ripple, grid, sweep }) => {
  const W = 900;
  const ink = "#F5F5F5";
  const sub = "#A8A8A8";
  const stat = (x: number, n: React.ReactNode, label: string) => (
    <div style={{ position: "absolute", left: x - 110, top: 128, width: 220, textAlign: "center", fontFamily: IG_FONT, color: ink }}>
      <div style={{ fontSize: 46, fontWeight: 700, height: 56, lineHeight: "56px", overflow: "hidden", position: "relative" }}>{n}</div>
      <div style={{ fontSize: 32, color: ink, marginTop: 2 }}>{label}</div>
    </div>
  );
  const fol = (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: -56 * followerRoll }}>605</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 56 * (1 - followerRoll) }}>606</div>
    </>
  );
  const btnBg = following > 0.5 ? "#363636" : IG_BLUE;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 880, borderRadius: 34, overflow: "hidden", background: "#000", border: "2px solid #30363D", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
      {/* top bar */}
      <div style={{ position: "absolute", left: 30, top: 30 }}><Glyph d={G.back} size={44} /></div>
      <div style={{ position: "absolute", left: 96, top: 28, fontFamily: IG_FONT, fontSize: 40, fontWeight: 700, color: ink }}>ballsimplified</div>
      <div style={{ position: "absolute", right: 104, top: 30 }}><Glyph d={G.bell} size={44} /></div>
      <div style={{ position: "absolute", right: 36, top: 30 }}><Glyph d={G.more} size={44} stroke={3.4} /></div>
      {/* avatar */}
      <div style={{ position: "absolute", left: 40, top: 112, width: 196, height: 196, borderRadius: "50%", overflow: "hidden", border: "2px solid #262626" }}>
        <Img src={staticFile("kobe-81/closenightresolved-avatar.jpg")} style={{ width: 196, height: 196, objectFit: "cover" }} />
      </div>
      {stat(380, "1", "post")}
      {stat(580, fol, "followers")}
      {stat(780, "0", "following")}
      {/* name and bio */}
      <div style={{ position: "absolute", left: 40, top: 332, fontFamily: IG_FONT, color: ink }}>
        <div style={{ fontSize: 36, fontWeight: 700 }}>Ball Simplified</div>
        <div style={{ fontSize: 34, marginTop: 6 }}>Basketball Simplified</div>
      </div>
      {/* buttons */}
      <div style={{ position: "absolute", left: 40, top: 452, width: 372, height: 80, borderRadius: 18, background: btnBg, transform: `scale(${1 - 0.06 * press})`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: IG_FONT, fontSize: 34, fontWeight: 700, color: "#fff" }}>
        {following > 0.5 ? (
          <>
            <span>Following</span>
            <Glyph d={G.chevron} size={30} stroke={2.6} color="#fff" />
          </>
        ) : (
          <span>Follow</span>
        )}
        {ripple > 0 && ripple < 1 && <div style={{ position: "absolute", left: 186 - 220 * ripple, top: 40 - 220 * ripple, width: 440 * ripple, height: 440 * ripple, borderRadius: "50%", background: "rgba(255,255,255,0.28)", opacity: 1 - ripple }} />}
      </div>
      <div style={{ position: "absolute", left: 424, top: 452, width: 372, height: 80, borderRadius: 18, background: "#363636", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: IG_FONT, fontSize: 34, fontWeight: 700, color: "#fff" }}>Message</div>
      <div style={{ position: "absolute", left: 808, top: 452, width: 52, height: 80, borderRadius: 18, background: "#363636", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Glyph d={G.personPlus} size={34} stroke={2.2} />
      </div>
      {/* tabs */}
      <div style={{ position: "absolute", left: 0, top: 586, width: W, height: 74, opacity: 0.35 + 0.65 * grid }}>
        {[G.grid, G.reels, G.tagged].map((d, i) => (
          <div key={i} style={{ position: "absolute", left: 150 + i * 300 - 22, top: 14 }}><Glyph d={d} size={44} color={i === 0 ? ink : sub} stroke={1.9} /></div>
        ))}
        <div style={{ position: "absolute", left: 0, top: 72, width: 300, height: 3, background: ink }} />
      </div>
      {/* the post row: the real first post, then the empty tiles */}
      <div style={{ position: "absolute", left: 0, top: 664, width: 298, height: 398, overflow: "hidden", opacity: 0.6 * grid, transform: `translateY(${(1 - grid) * 60}px)` }}>
        <Img src={staticFile("kobe-81/closenightresolved-post.jpg")} style={{ position: "absolute", left: 0, top: -66, width: 298, height: 530 }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, transparent ${(sweep - 0.2) * 100}%, rgba(255,255,255,0.28) ${sweep * 100}%, transparent ${(sweep + 0.2) * 100}%)` }} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- the share sheet

/** the default Instagram avatar: grey disc, lighter head and shoulders */
const Contact: React.FC<{ x: number; y: number; r: number; lit: number; dimmed: number }> = ({ x, y, r, lit, dimmed }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, opacity: 1 - 0.45 * dimmed }}>
    <svg width={r * 2} height={r * 2} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <clipPath id={`closenightresolved-c${Math.round(x)}${Math.round(y)}`}>
          <circle cx={50} cy={50} r={50} />
        </clipPath>
      </defs>
      <g clipPath={`url(#closenightresolved-c${Math.round(x)}${Math.round(y)})`}>
        <rect width={100} height={100} fill={lit > 0.5 ? "#4a4a4a" : "#3a3a3a"} />
        <circle cx={50} cy={40} r={17} fill="#9a9a9a" />
        <ellipse cx={50} cy={92} rx={32} ry={26} fill="#9a9a9a" />
      </g>
    </svg>
    {lit > 0 && <div style={{ position: "absolute", inset: -9, borderRadius: "50%", border: `4px solid rgba(255,255,255,${lit})`, transform: `scale(${1.15 - 0.15 * lit})` }} />}
    {lit > 0 && (
      <div style={{ position: "absolute", right: -6, bottom: -2, width: 52, height: 52, borderRadius: "50%", background: IG_BLUE, border: "4px solid #262626", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${lit})` }}>
        <Glyph d={G.check} size={30} color="#fff" stroke={3.2} />
      </div>
    )}
  </div>
);

export const CloseNightResolvedSheet: React.FC<{
  plane: number; // 0..1 the plane glyph popping
  lit: number; // 0..1 the picked contact
  swap: number; // 0..1 the action row giving way to the message field and the Send button
  bulbs: number; // how many of the preview's 81 sockets are lit (float)
  bloom: number; // 0..1 the gold bloom when the board is full
  breathe: number; // small living glow on the full board
}> = ({ plane, lit, swap, bulbs, bloom, breathe }) => {
  const W = 900;
  const ink = "#F5F5F5";
  const sub = "#A8A8A8";
  // the preview: the reel's 9 x 9 board on the reel's navy
  const TW = 300;
  const TH = 533;
  const pitch = 29;
  const x0 = TW / 2 - 4 * pitch;
  const y0 = 128;
  const n = Math.floor(bulbs);
  const shown = Math.min(81, Math.round(bulbs));
  const actions: [string, string][] = [
    [G.addStory, "Add to story"],
    [G.link, "Copy link"],
    [G.share, "Share"],
    [G.download, "Download"],
  ];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 870, borderRadius: 40, background: "#262626", overflow: "hidden", boxShadow: "0 -20px 70px rgba(0,0,0,0.65)", border: "2px solid #3a3a3a" }}>
      <div style={{ position: "absolute", left: W / 2 - 44, top: 16, width: 88, height: 9, borderRadius: 5, background: "#5c5c5c" }} />
      {/* header */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: IG_FONT, fontSize: 38, fontWeight: 700, color: ink }}>
        <div style={{ transform: `scale(${0.4 + 0.6 * plane}) rotate(${(1 - plane) * -30}deg)`, opacity: Math.min(1, plane * 2) }}><Glyph d={G.plane} size={46} stroke={2} /></div>
        <span>Send</span>
      </div>
      {/* the preview */}
      <div style={{ position: "absolute", left: 40, top: 124, width: TW, height: TH, borderRadius: 18, background: "#0D1117", border: "2px solid #3a3a3a", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: TW, height: TH, background: `radial-gradient(circle at 50% 42%, rgba(253,185,39,${(0.10 * bloom + 0.06 * breathe).toFixed(3)}) 0%, rgba(0,0,0,0) 60%)` }} />
        {Array.from({ length: 81 }, (_, i) => {
          const lit = i < n ? 1 : i === n ? bulbs - n : 0;
          return <CloseNightResolvedBulb key={i} x={x0 + (i % 9) * pitch} y={y0 + Math.floor(i / 9) * pitch} r={10.5} color={CloseNightResolvedGold} lit={lit} glow={1 + bloom * 0.8 + breathe * 0.3} />;
        })}
        <div style={{ position: "absolute", left: TW / 2 - 70, top: 392, transform: `scale(${1 + 0.08 * bloom})`, transformOrigin: "center" }}>
          <StaplesNightReadout text={String(shown).padStart(2, " ")} h={84} w={140} color={CloseNightResolvedGold} dim={GOLD_DIM} glow={1 + bloom} />
        </div>
        <div style={{ position: "absolute", right: 14, top: 12 }}><Glyph d={G.reels} size={30} stroke={2} /></div>
        <div style={{ position: "absolute", left: 14, bottom: 12, display: "flex", alignItems: "center", gap: 8, fontFamily: IG_FONT, fontSize: 20, fontWeight: 600, color: ink }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden" }}>
            <Img src={staticFile("kobe-81/closenightresolved-avatar.jpg")} style={{ width: 28, height: 28, objectFit: "cover" }} />
          </div>
          ballsimplified
        </div>
      </div>
      {/* search */}
      <div style={{ position: "absolute", left: 376, top: 124, width: 484, height: 72, borderRadius: 16, background: "#363636", display: "flex", alignItems: "center", gap: 14, paddingLeft: 22, fontFamily: IG_FONT, fontSize: 32, color: sub }}>
        <Glyph d={G.search} size={34} color={sub} stroke={2.2} />
        Search
      </div>
      {/* contacts: plain default avatars, no names */}
      {[
        [500, 336],
        [736, 336],
        [500, 560],
        [736, 560],
      ].map(([x, y], i) => (
        <Contact key={i} x={x} y={y} r={86} lit={i === 0 ? lit : 0} dimmed={i === 0 ? 0 : lit} />
      ))}
      {/* the action row, Instagram's own */}
      <div style={{ position: "absolute", left: 0, top: 690 + 40 * swap, width: W, height: 160, opacity: 1 - swap }}>
        {actions.map(([d, label], i) => (
          <div key={i} style={{ position: "absolute", left: 120 + i * 220 - 80, top: 0, width: 160, textAlign: "center" }}>
            <div style={{ width: 92, height: 92, margin: "0 auto", borderRadius: "50%", background: "#363636", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph d={d} size={42} stroke={2} />
            </div>
            <div style={{ fontFamily: IG_FONT, fontSize: 24, color: sub, marginTop: 10 }}>{label}</div>
          </div>
        ))}
      </div>
      {/* the message field and Send button, once someone is picked */}
      <div style={{ position: "absolute", left: 40, top: 690 + 40 * (1 - swap), width: W - 80, opacity: swap }}>
        <div style={{ height: 62, fontFamily: IG_FONT, fontSize: 32, color: sub, borderBottom: "2px solid #3a3a3a", lineHeight: "54px" }}>Write a message...</div>
        <div style={{ marginTop: 18, height: 80, borderRadius: 18, background: IG_BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: IG_FONT, fontSize: 36, fontWeight: 700, color: "#fff" }}>Send</div>
      </div>
    </div>
  );
};
