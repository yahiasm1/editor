# RecordBoxScore (`record`, 46.43-53.90 s)

"And some nights it really worked. On December 8, 2000, Shaq went zero for eleven at the line against Seattle, still
an NBA record."

## What I looked at

- `pages/bbref-box-2000-12-08-sea-at-lal.html` (Basketball-Reference, read in full, comments unwrapped). H1:
  "Seattle SuperSonics at Los Angeles Lakers Box Score, December 8, 2000". Scorebox: Seattle SuperSonics 103, record
  10-11; Los Angeles Lakers 95, record 14-7; meta "10:30 PM, December 8, 2000" and "STAPLES Center, Los Angeles,
  California". Page tabs: Box Score / Play-By-Play / Shot Charts / Plus/Minus. Line score SEA 30 27 25 21 103, LAL 26
  31 19 19 95. The Lakers table "Basic Box Score Stats", 22 columns (Starters MP FG FGA FG% 3P 3PA 3P% FT FTA FT% ORB
  DRB TRB AST STL BLK TOV PF PTS GmSc +/-). Starters in order: Horace Grant 41:00 2-10, Kobe Bryant 39:48 8-25,
  Shaquille O'Neal 38:30 13-24 .542 0-0 FT 0 FTA 11 .000 ORB 8 DRB 9 TRB 17 AST 5 STL 0 BLK 5 TOV 1 PF 3 PTS 26,
  Rick Fox 23:59 5-10, Ron Harper 19:36 4-7. The detail that gives a fake away: BBR marks zero cells with class `iz`
  and prints them in a lighter grey, so Shaq's FT "0" is printed faint on the real page; empty percentages (0-0) are
  blank, not ".000". Shaq's 3P% cell is blank.
- `pages/bbref-pbp-2000-12-08-sea-at-lal.html`: the eleven misses, real copy, each "S. O'Neal misses free throw 1 of
  2" (Q4 5:25.0 is "1 of 1", the and-one after his hook shot). Clock and score (visitor first): 2nd Q 0:47.7 57-52
  (x2), 3rd Q 9:27.0 63-59 (x2), 3:38.0 74-70 (x2), 1:53.0 77-74 (x2), 4th Q 5:25.0 92-90 (1 of 1), 0:58.8 100-92
  (x2). The fouls that sent him there: R. Lewis, P. Ewing, J. McCoy, V. Baker, P. Ewing, R. Lewis.
- `logos/nba-lakers-primary.svg` (cdn.nba.com, purple 542C81, gold FAB624, white): bare. The Sonics are gone from
  cdn.nba.com and ESPN (sea.png 404), and BBR's own 2001 logo sits on cdn.ssref.net (blocked); so, as in
  `BackwardsScorebug`, Seattle is a Sonics-green box with gold letters, type only, no imitated logo. (The 2000-01
  Sonics still wore their 1995 kit with red and bronze; green is the colour common to every era, so green leads and
  gold is only the letters, matching the reel's scorebug.)
- wemby-50 `PlayByPlayLog` (the creator's own finished reel): the log card on #161B22, hairline #30363D, rows of real
  copy written one by one, BBR glyph x for a miss. Its lesson: real copy at real geometry, each row doing something.

## Think

The real thing: the night written down. The box score proves he was fine from the field (13 of 24) and empty at the
line; the play-by-play proves it was eleven separate trips' worth of misses across three quarters, not one bad
moment. Everything stays on one card, the box score's own page, so the stage is a document being read.

Details that make it real: the page tabs with "Box Score" underlined, the H1 in full, the meta line, the records under
the scores, Kobe in the row above Shaq, the grey zero cells, the blank 3P%, the sticky name column with the stats
scrolling sideways (how BBR reads on a phone), the play-by-play's own clocks and visitor-first scores, the "1 of 1".

Layout (absolute px, card x 40-1040, y 540-1440). Two states, moved between on "Shaq":
- A: tabs, H1 (two lines), meta, scorebox (SEA left, LAL right), table header + five starters at 30 px.
- B: H1 folds away, the scorebox rises to the top, other rows fold, Shaq's row grows to 36 px, the tab underline
  slides to Play-By-Play and the log of eleven rows writes under it at 30 px.

Word, then change:
- frame 0 (from - 6): the card is turning over, edge-on, at Nelson's card's size; its back is the dark BBR page.
- And some nights: the card finishes its turn, the tabs and source line on it.
- really: lands: it snaps flat and big to the full card, a small overshoot.
- worked: the H1 types on.
- On: the date in the H1 brightens to white.
- December: lands: the scorebox drops in, the two scores counting up to 103 and 95.
- 8, 2000: the table unrolls row by row; Shaq's row gets a white hairline frame.
- Shaq: other rows fold, his row grows; the scorebox rises.
- went: FG 13 and FGA 24 light up bold white.
- zero: the row slides sideways to FT; the FT cell flips over (split-flap) from faint grey 0 to bold white 0.
- for -> eleven: ends on: eleven log rows drop in one every ~4 frames, each with a foul red X drawn on, and FTA rolls
  1 -> 11 with them; 11 lands as "eleven" finishes; FT% lands ".000".
- at the line: the log text dims; the eleven X's gather into one tight column.
- against Seattle: the SEA box glows in its green, its letters brighten.
- still an NBA: the card dims around FT 0 / FTA 11 / .000.
- record: ends on: the 0 and the 11 fly out of their cells and become one big white "0-11"; the X column lays down
  under it as a row of eleven red X's, its underline; a small grey "NBA record" beside it. Hold, slow push.

Sound-off test: a real box score, Shaq's row, a 0 where his free throws should be, eleven red misses written down
one by one, and the result printed big: 0-11, NBA record. A stranger sees "the night he made none of eleven".
