// The real Basketball-Reference 2025-26 Team Shooting table (pages/bbref-2026.html, table `shooting-team`), redrawn
// cell for cell: all 35 columns with their over-headers and spacer columns, the 30 team rows and the bold
// League Average row in its tfoot. The look read off pages/bbref-2026-screenshot-top.png: white page, light grey
// row rules, faint dotted column rules, right-aligned numerals without the leading zero, grey Rk, underlined team
// names (the site's link blue drawn in the table's dark ink), League Average bold on #EEE between two dark rules.
// The face is DejaVu Sans, what BBR's Verdana falls back to on the machine the screenshot was taken on.
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

export const LT_FONT = "'LT DejaVu Sans', 'DejaVu Sans', Verdana, sans-serif";

/** the face, loaded once */
export function useLeagueTableFont() {
  const [h] = useState(() => delayRender("DejaVu Sans for the BBR table"));
  useEffect(() => {
    const faces = [
      new FontFace("LT DejaVu Sans", `url(${staticFile("nba-floor/leaguetable-dejavusans.ttf")})`, { weight: "400" }),
      new FontFace("LT DejaVu Sans", `url(${staticFile("nba-floor/leaguetable-dejavusans-bold.ttf")})`, { weight: "700" }),
    ];
    Promise.all(faces.map((x) => x.load()))
      .then((ok) => {
        ok.forEach((x) => (document.fonts as unknown as { add: (ff: FontFace) => void }).add(x));
        continueRender(h);
      })
      .catch(() => continueRender(h));
  }, [h]);
}

// columns: label, over-header group, width in page px (font 21 px)
const SP = 18;
const N = 60;
type Col = { h: string; g?: string; w: number; left?: boolean };
export const LT_COLS: Col[] = [
  { h: "Rk", w: 40 }, { h: "Team", w: 252, left: true }, { h: "G", w: 46 }, { h: "MP", w: 80 }, { h: "FG%", w: 64 }, { h: "Dist.", w: 60 },
  { h: "", w: SP },
  ...["2P", "0-3", "3-10", "10-16", "16-3P", "3P"].map((h) => ({ h, g: "% of FGA by Distance", w: N })),
  { h: "", w: SP },
  ...["2P", "0-3", "3-10", "10-16", "16-3P", "3P"].map((h) => ({ h, g: "FG% by Distance", w: N })),
  { h: "", w: SP },
  { h: "2P", g: "% of FG Ast'd", w: N }, { h: "3P", g: "% of FG Ast'd", w: N },
  { h: "", w: SP },
  { h: "%FGA", g: "Dunks", w: 64 }, { h: "Md.", g: "Dunks", w: 56 },
  { h: "", w: SP },
  { h: "%FGA", g: "Layups", w: 64 }, { h: "Md.", g: "Layups", w: 66 },
  { h: "", w: SP },
  { h: "%3PA", g: "Corner", w: 66 }, { h: "3P%", g: "Corner", w: 62 },
  { h: "", w: SP },
  { h: "Att.", g: "1/2 Court", w: 52 }, { h: "Md.", g: "1/2 Court", w: 52 },
];
export const LT_KEEP_3P = 19; // FG% by Distance, 3P: .360
export const LT_KEEP_CORNER = 31; // Corner, 3P%: .387
export const LT_ROW_H = 34;
export const LT_HEAD_H = 132; // page title + section heading
export const LT_THEAD_H = 66;
export const LT_CARD = { x: 40, y: 556, w: 1000, h: 884, pad: 20 };
/** y of the League Average row's top inside the page */
export const LT_LA_Y = LT_HEAD_H + LT_THEAD_H + 30 * LT_ROW_H;

export const LT_BBR_ROWS: string[][] = [
  ["1", "Atlanta Hawks*", "82", "19755", ".474", "14.2", "", ".571", ".244", ".200", ".085", ".041", ".429", "", ".552", ".687", ".450", ".474", ".405", ".371", "", ".581", ".909", "", ".059", "396", "", ".246", "1061", "", ".257", ".381", "", "1", "1"],
  ["2", "Boston Celtics*", "82", "19730", ".467", "16.2", "", ".533", ".161", ".196", ".112", ".064", ".467", "", ".555", ".754", ".490", ".481", ".382", ".367", "", ".463", ".794", "", ".039", "255", "", ".235", "1055", "", ".162", ".414", "", "0", "0"],
  ["3", "Brooklyn Nets", "82", "19755", ".443", "14.5", "", ".545", ".235", ".211", ".063", ".036", ".455", "", ".528", ".686", ".419", ".410", ".347", ".340", "", ".548", ".891", "", ".061", "377", "", ".275", "1032", "", ".236", ".366", "", "1", "0"],
  ["4", "Chicago Bulls", "82", "19755", ".469", "13.7", "", ".557", ".310", ".184", ".042", ".021", ".443", "", ".559", ".659", ".429", ".486", ".359", ".356", "", ".553", ".906", "", ".041", "264", "", ".326", "1397", "", ".255", ".374", "", "1", "1"],
  ["5", "Charlotte Hornets", "82", "19755", ".460", "15.5", "", ".513", ".213", ".204", ".072", ".025", ".487", "", ".538", ".706", ".430", ".408", ".363", ".378", "", ".518", ".832", "", ".065", "415", "", ".224", "887", "", ".221", ".436", "", "3", "2"],
  ["6", "Cleveland Cavaliers*", "82", "19755", ".482", "14.4", "", ".558", ".252", ".190", ".082", ".034", ".442", "", ".578", ".708", ".484", ".480", ".372", ".360", "", ".574", ".814", "", ".082", "540", "", ".231", "979", "", ".226", ".377", "", "1", "0"],
  ["7", "Dallas Mavericks", "82", "19855", ".466", "13.4", "", ".645", ".229", ".236", ".108", ".072", ".355", "", ".533", ".715", ".455", ".428", ".368", ".344", "", ".503", ".888", "", ".065", "414", "", ".263", "1057", "", ".289", ".377", "", "1", "0"],
  ["8", "Denver Nuggets*", "82", "19930", ".496", "14.4", "", ".592", ".212", ".224", ".097", ".060", ".408", "", ".565", ".720", ".491", ".486", ".424", ".396", "", ".586", ".829", "", ".046", "288", "", ".266", "1131", "", ".250", ".440", "", "3", "3"],
  ["9", "Detroit Pistons*", "82", "19805", ".485", "12.4", "", ".655", ".252", ".284", ".082", ".037", ".345", "", ".553", ".696", ".487", ".413", ".398", ".356", "", ".565", ".863", "", ".087", "583", "", ".319", "1290", "", ".286", ".376", "", "1", "1"],
  ["10", "Golden State Warriors", "82", "19805", ".461", "15.7", "", ".503", ".198", ".201", ".067", ".037", ".497", "", ".565", ".736", ".483", ".418", ".365", ".356", "", ".593", ".886", "", ".034", "226", "", ".279", "1248", "", ".251", ".398", "", "1", "1"],
  ["11", "Houston Rockets*", "82", "19905", ".479", "13.7", "", ".650", ".211", ".225", ".147", ".067", ".350", "", ".540", ".700", ".492", ".439", ".422", ".364", "", ".494", ".859", "", ".081", "534", "", ".234", "932", "", ".291", ".377", "", "2", "1"],
  ["12", "Indiana Pacers", "82", "19755", ".458", "14.8", "", ".578", ".216", ".197", ".103", ".062", ".422", "", ".533", ".677", ".466", ".453", ".376", ".356", "", ".566", ".907", "", ".047", "302", "", ".260", "1077", "", ".226", ".372", "", "0", "0"],
  ["13", "Los Angeles Clippers", "82", "19780", ".484", "14.3", "", ".596", ".207", ".237", ".106", ".046", ".404", "", ".564", ".732", ".495", ".470", ".379", ".368", "", ".496", ".789", "", ".065", "392", "", ".241", "979", "", ".241", ".415", "", "0", "0"],
  ["14", "Los Angeles Lakers*", "82", "19705", ".502", "14.4", "", ".606", ".209", ".218", ".127", ".052", ".394", "", ".595", ".778", ".531", ".471", ".433", ".359", "", ".569", ".735", "", ".078", "499", "", ".228", "974", "", ".239", ".345", "", "1", "0"],
  ["15", "Memphis Grizzlies", "82", "19730", ".456", "14.7", "", ".564", ".207", ".218", ".096", ".043", ".436", "", ".536", ".673", ".482", ".446", ".354", ".353", "", ".583", ".851", "", ".042", "264", "", ".245", "1049", "", ".226", ".366", "", "1", "1"],
  ["16", "Miami Heat", "82", "19705", ".468", "13.7", "", ".594", ".237", ".243", ".081", ".032", ".406", "", ".542", ".683", ".463", ".432", ".369", ".361", "", ".544", ".923", "", ".050", "345", "", ".279", "1230", "", ".247", ".379", "", "2", "1"],
  ["17", "Milwaukee Bucks", "82", "19755", ".477", "15.5", "", ".543", ".217", ".155", ".098", ".072", ".457", "", ".553", ".746", ".425", ".440", ".401", ".387", "", ".494", ".868", "", ".061", "388", "", ".226", "918", "", ".276", ".433", "", "1", "0"],
  ["18", "Minnesota Timberwolves*", "82", "19780", ".481", "14.2", "", ".580", ".248", ".192", ".094", ".046", ".420", "", ".562", ".715", ".454", ".464", ".386", ".370", "", ".511", ".824", "", ".071", "457", "", ".258", "1108", "", ".246", ".390", "", "2", "0"],
  ["19", "New Orleans Pelicans", "82", "19805", ".466", "12.4", "", ".645", ".319", ".220", ".070", ".036", ".355", "", ".531", ".671", ".405", ".386", ".338", ".347", "", ".509", ".836", "", ".075", "490", "", ".354", "1440", "", ".224", ".388", "", "1", "0"],
  ["20", "New York Knicks*", "82", "19755", ".478", "14.4", "", ".572", ".246", ".170", ".108", ".049", ".428", "", ".556", ".689", ".464", ".449", ".439", ".373", "", ".534", ".860", "", ".058", "387", "", ".237", "1013", "", ".302", ".416", "", "0", "0"],
  ["21", "Oklahoma City Thunder*", "82", "19855", ".484", "14.6", "", ".574", ".233", ".179", ".116", ".046", ".426", "", ".572", ".720", ".441", ".524", ".447", ".365", "", ".474", ".860", "", ".064", "413", "", ".252", "1067", "", ".230", ".380", "", "0", "0"],
  ["22", "Orlando Magic*", "82", "19830", ".464", "13.5", "", ".614", ".247", ".227", ".092", ".047", ".386", "", ".540", ".705", ".438", ".415", ".416", ".343", "", ".564", ".856", "", ".064", "406", "", ".303", "1225", "", ".271", ".385", "", "1", "1"],
  ["23", "Philadelphia 76ers*", "82", "19880", ".462", "14.0", "", ".609", ".266", ".187", ".093", ".064", ".391", "", ".535", ".670", ".434", ".413", ".443", ".349", "", ".499", ".805", "", ".058", "372", "", ".292", "1216", "", ".214", ".372", "", "1", "1"],
  ["24", "Phoenix Suns*", "82", "19755", ".455", "15.8", "", ".547", ".198", ".170", ".117", ".062", ".453", "", ".533", ".690", ".445", ".449", ".425", ".361", "", ".485", ".808", "", ".060", "385", "", ".222", "893", "", ".210", ".395", "", "2", "1"],
  ["25", "Portland Trail Blazers*", "82", "19755", ".453", "14.7", "", ".531", ".257", ".185", ".055", ".035", ".469", "", ".551", ".699", ".424", ".380", ".405", ".343", "", ".499", ".829", "", ".075", "473", "", ".289", "1196", "", ".242", ".340", "", "0", "0"],
  ["26", "Sacramento Kings", "82", "19755", ".467", "13.9", "", ".661", ".169", ".274", ".136", ".082", ".339", "", ".532", ".729", ".503", ".423", ".402", ".340", "", ".538", ".849", "", ".059", "380", "", ".257", "1069", "", ".232", ".359", "", "0", "0"],
  ["27", "San Antonio Spurs*", "82", "19730", ".483", "13.9", "", ".578", ".277", ".171", ".089", ".041", ".422", "", ".574", ".704", ".468", ".422", ".467", ".359", "", ".521", ".920", "", ".074", "498", "", ".264", "1117", "", ".318", ".391", "", "1", "0"],
  ["28", "Toronto Raptors*", "82", "19780", ".482", "13.4", "", ".637", ".266", ".188", ".127", ".056", ".363", "", ".555", ".708", ".444", ".458", ".426", ".354", "", ".600", ".942", "", ".062", "390", "", ".265", "1161", "", ".267", ".388", "", "1", "0"],
  ["29", "Utah Jazz", "82", "19830", ".467", "14.0", "", ".598", ".187", ".273", ".085", ".052", ".402", "", ".550", ".687", ".521", ".430", ".402", ".345", "", ".618", ".882", "", ".062", "403", "", ".279", "1211", "", ".272", ".385", "", "0", "0"],
  ["30", "Washington Wizards", "82", "19755", ".463", "14.6", "", ".597", ".215", ".213", ".105", ".064", ".403", "", ".533", ".732", ".402", ".460", ".419", ".359", "", ".500", ".817", "", ".062", "402", "", ".254", "1042", "", ".212", ".387", "", "0", "0"],
];
export const LT_BBR_LEAGUE: string[] = ["", "League Average", "82", "19781", ".471", "14.3", "", ".585", ".231", ".209", ".095", ".049", ".415", "", ".550", ".703", ".463", ".446", ".401", ".360", "", ".537", ".854", "", ".061", "398", "", ".264", "1102", "", ".246", ".387", "", "1.0", "0.5"];

const INK = "#222";
const RULE = "#DDDDDD";
const DOT = "#E3E3E3";

/** one table row's cells, laid out on given widths */
const LeagueTableCells: React.FC<{ cells: string[]; widths: number[]; font: number; bold?: boolean; rk?: boolean; h: number; fonts?: number[] }> = ({ cells, widths, font, bold, rk, h, fonts }) => {
  let x = 0;
  return (
    <>
      {cells.map((c, i) => {
        const w = widths[i];
        const x0 = x;
        x += w;
        if (w < 0.5) return null;
        const col = LT_COLS[i];
        const isTeam = i === 1;
        const star = isTeam && c.endsWith("*");
        const name = star ? c.slice(0, -1) : c;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0,
              top: 0,
              width: w,
              height: h,
              overflow: "hidden",
              boxSizing: "border-box",
              borderRight: col.h && i < LT_COLS.length - 1 ? `1px dotted ${DOT}` : undefined,
              display: "flex",
              alignItems: "center",
              justifyContent: col.left ? "flex-start" : "flex-end",
              padding: col.left ? "0 0 0 8px" : "0 6px 0 0",
              fontFamily: LT_FONT,
              fontSize: fonts ? fonts[i] : font,
              fontWeight: bold ? 700 : 400,
              color: rk && i === 0 ? "#6B6E72" : INK,
              opacity: w >= col.w ? 1 : Math.max(0, (w / col.w - 0.75) / 0.25),
              whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {isTeam && !bold ? (
              <span>
                <span style={{ textDecoration: "underline", textDecorationThickness: 1, textUnderlineOffset: 3, color: "#2A2D31" }}>{name}</span>
                {star ? "*" : ""}
              </span>
            ) : (
              c
            )}
          </div>
        );
      })}
    </>
  );
};

/** the page: slides up over the floor, scrolls, stops on League Average. The League Average row itself is drawn by
 *  LeagueTableRow once it lifts, so here it can be hidden. */
export const LeagueTableSheet: React.FC<{ enter: number; scroll: number; hi: number; hideLA: boolean; out: number }> = ({ enter, scroll, hi, hideLA, out }) => {
  if (enter <= 0.001 || out >= 0.999) return null;
  const widths = LT_COLS.map((c) => c.w);
  const groups: { g: string; x: number; w: number }[] = [];
  let x = 0;
  LT_COLS.forEach((c) => {
    if (c.g) {
      const last = groups[groups.length - 1];
      if (last && last.g === c.g && Math.abs(last.x + last.w - x) < 0.5) last.w += c.w;
      else groups.push({ g: c.g, x, w: c.w });
    }
    x += c.w;
  });
  const y = (1 - enter) * 1300 + out * 1400;
  return (
    <div
      style={{
        position: "absolute",
        left: LT_CARD.x,
        top: LT_CARD.y + y,
        width: LT_CARD.w,
        height: LT_CARD.h,
        borderRadius: 24,
        overflow: "hidden",
        background: "#FFFFFF",
        boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
        border: "1px solid #30363D",
      }}
    >
      <div style={{ position: "absolute", left: LT_CARD.pad, top: -scroll, width: 2000 }}>
        {/* the page above the table */}
        <div style={{ position: "absolute", left: 0, top: 22, fontFamily: LT_FONT, fontWeight: 700, fontSize: 34, color: "#000", whiteSpace: "nowrap" }}>
          2025-26 NBA Season Summary
        </div>
        <div style={{ position: "absolute", left: 0, top: 84, fontFamily: LT_FONT, fontWeight: 700, fontSize: 27, color: "#000" }}>Shooting Stats</div>
        <div style={{ position: "absolute", left: 270, top: 86, display: "flex", gap: 0, fontFamily: LT_FONT, fontSize: 21 }}>
          <div style={{ padding: "3px 12px", background: "#E6E6E6", border: "1px solid #CCC", borderRadius: "4px 0 0 4px", fontWeight: 700, color: "#000" }}>Team</div>
          <div style={{ padding: "3px 12px", border: "1px solid #CCC", borderLeft: "none", borderRadius: "0 4px 4px 0", color: "#555" }}>Opponent</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 124, width: 1964, height: 2, background: "#CCCCCC" }} />
        {/* over-headers */}
        <div style={{ position: "absolute", left: 0, top: LT_HEAD_H, width: 1964, height: 30 }}>
          {groups.map((g) => (
            <div key={g.g + g.x} style={{ position: "absolute", left: g.x + 3, width: g.w - 6, top: 0, height: 28, borderBottom: "1.5px solid #BBBBBB", textAlign: "center", fontFamily: LT_FONT, fontSize: 18, color: "#333", whiteSpace: "nowrap", overflow: "hidden" }}>
              {g.g}
            </div>
          ))}
        </div>
        {/* header row */}
        <div style={{ position: "absolute", left: 0, top: LT_HEAD_H + 30, width: 1964, height: 36, borderBottom: "2px solid #9C9EA1" }}>
          <LeagueTableCells cells={LT_COLS.map((c) => c.h)} widths={widths} font={19} fonts={LT_COLS.map((c) => (c.h.length >= 5 && c.w <= N ? 16 : 19))} bold h={36} />
        </div>
        {LT_BBR_ROWS.map((r, i) => (
          <div key={i} style={{ position: "absolute", left: 0, top: LT_HEAD_H + LT_THEAD_H + i * LT_ROW_H, width: 1964, height: LT_ROW_H, borderBottom: `1px solid ${RULE}` }}>
            <LeagueTableCells cells={r} widths={widths} font={21} rk h={LT_ROW_H} />
          </div>
        ))}
        {!hideLA && (
          <div style={{ position: "absolute", left: 0, top: LT_LA_Y, width: 1964, height: 38, background: "#EEEEEE", borderTop: "2px solid #747678", borderBottom: "2px solid #747678", boxShadow: hi > 0 ? `0 0 0 ${3 * hi}px rgba(242,179,61,${0.0 * hi})` : undefined }}>
            <LeagueTableCells cells={LT_BBR_LEAGUE} widths={widths} font={21} bold h={36} />
          </div>
        )}
        {hideLA && <div style={{ position: "absolute", left: 0, top: LT_LA_Y, width: 1964, height: 38, background: "#F6F6F6", borderTop: "1px solid #DDD" }} />}
        <div style={{ position: "absolute", left: 0, top: LT_LA_Y + 110, fontFamily: LT_FONT, fontWeight: 700, fontSize: 29, color: "#B0581A" }}>League Awards</div>
        <div style={{ position: "absolute", left: 0, top: LT_LA_Y + 158, width: 600, height: 34, background: "#F3F3F3", border: "1px solid #CCC", display: "flex", fontFamily: LT_FONT, fontWeight: 700, fontSize: 19, color: "#8B1A1A" }}>
          <div style={{ width: 400, textAlign: "center", lineHeight: "34px" }}>Award</div>
          <div style={{ width: 200, textAlign: "center", lineHeight: "34px" }}>Winner</div>
        </div>
      </div>
    </div>
  );
};

/** screen layout of the lifted League Average row: c = 0 in the table, 1 = only .360 and .387 left */
export function ltRowLayout(c: number, rowY: number, lift: number) {
  const s = 1 + 0.2 * lift;
  const widths = LT_COLS.map((col, i) => {
    const keep = i === LT_KEEP_3P || i === LT_KEEP_CORNER;
    return col.w * (1 - c) + (keep ? 250 : 0) * c;
  });
  const total = widths.reduce((a, b) => a + b, 0);
  const cs = c * c * (3 - 2 * c);
  const left0 = LT_CARD.x + LT_CARD.pad;
  const left = left0 + (540 - (total * s) / 2 - left0) * cs;
  let x = 0;
  const pos: number[] = [];
  widths.forEach((w) => {
    pos.push(x);
    x += w;
  });
  const cell = (i: number) => ({ x: left + (pos[i] + widths[i] / 2) * s, w: widths[i] * s });
  return { s, widths, left, y: rowY - 40 * lift, cell, total };
}

/** the lifted row: the real cells, closing up */
export const LeagueTableRow: React.FC<{ c: number; rowY: number; lift: number; o: number }> = ({ c, rowY, lift, o }) => {
  if (o <= 0.001) return null;
  const L = ltRowLayout(c, rowY, lift);
  const headH = 92 * Math.min(1, c * 1.4);
  const fonts = LT_COLS.map((_, i) => (i === LT_KEEP_3P || i === LT_KEEP_CORNER ? 21 + 23 * c : 21));
  return (
    <div style={{ position: "absolute", left: L.left, top: L.y + 38 * L.s - (38 + headH), width: L.total, height: 38 + headH, transform: `scale(${L.s})`, transformOrigin: "0 100%", opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: -12 * c, background: "#EEEEEE", borderRadius: 6 + 10 * c, borderTop: c < 0.3 ? "2px solid #747678" : undefined, borderBottom: c < 0.3 ? "2px solid #747678" : undefined, boxShadow: `0 ${12 * lift}px ${36 * lift}px rgba(0,0,0,${0.45 * lift})` }} />
      {headH > 1 &&
        [LT_KEEP_3P, LT_KEEP_CORNER].map((i) => {
          let x0 = 0;
          for (let k = 0; k < i; k++) x0 += L.widths[k];
          return (
            <div key={i} style={{ position: "absolute", left: x0, top: 8, width: L.widths[i], height: headH - 8, overflow: "hidden", textAlign: "center", opacity: Math.min(1, Math.max(0, c * 2 - 0.9)), fontFamily: LT_FONT, whiteSpace: "nowrap" }}>
              <div style={{ fontSize: 22, color: "#555", borderBottom: "1.5px solid #BBB", margin: "0 14px", paddingBottom: 4 }}>{LT_COLS[i].g}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#111", marginTop: 6 }}>{LT_COLS[i].h}</div>
            </div>
          );
        })}
      <div style={{ position: "absolute", left: 0, top: headH, width: L.total, height: 38 }}>
        <LeagueTableCells cells={LT_BBR_LEAGUE} widths={L.widths} font={21} fonts={fonts} bold h={38} />
      </div>
    </div>
  );
};
