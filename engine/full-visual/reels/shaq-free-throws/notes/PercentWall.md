# PercentWall (`percent`, 16.92-23.66 s)

"Over his career he made just 52.7 percent, and missed 5,317 free throws."

## What I looked at

- `workspace/projects/2026-11-25-full-visual-shaq-free-throws/sources/bbref-shaq.html`, table `totals_stats`, read
  row by row. FT / FTA / FT% per season, 19 seasons (2007-08 is the "2TM" row, MIA + PHO):
  1992-93 427/721 .592, 93-94 471/850, 94-95 455/854, 95-96 249/511 .487, 96-97 232/479 .484, 97-98 359/681,
  98-99 269/498, 99-00 432/824, 00-01 499/972 (his most attempts), 01-02 398/717, 02-03 451/725 .622 (his best),
  03-04 331/676, 04-05 353/765, 05-06 221/471, 06-07 124/294 .422 (his worst), 07-08 170/338, 08-09 309/519,
  09-10 112/226, 10-11 73/131. Footer row "19 Yrs": 5935 / 11252 / .527. Sum of the season FTA = 11,252 and of
  misses = 5,317, so every mark on screen is one real attempt, placed in its real season.
- `nba-floor/assets/refs/pages/bbref-2026-screenshot-top.png` (1400 x 1000): what a BBR table looks like on the page.
  White page, light grey row rules, right-aligned numerals with the leading zero dropped (".527"), bold header text,
  the total row in the tfoot set bold on #EEE between two dark grey (#747678) rules ("League Average" there, "19 Yrs"
  on Shaq's page). Verdana falling back to DejaVu Sans on Linux: I load the same DejaVu Sans.
- `photos/commons-basketball-reisio-pd.png` (340 x 340, public domain): the real ball. Pebbled orange leather,
  black channels, light from upper left, darker lower right. Every mark is this photo scaled down (at 4 px it reads
  as an orange grain with a dark side, like a rack of balls seen from far); the loupe shows it at 120 px, seams and
  pebbles visible.
- The quarter from `split` (`splitrimcoin-quarter-heads.png`, the 2006 proof, US Mint, public domain; reverse South
  Dakota proof): mirror field that reads black, frosted cameo, reeded rim, 24.26 mm. Copied as my own files.
- Example: `examples/touchscreen/stills/t_023.32.jpg` (the wire grid): one structure made of hundreds of small lit
  real parts, filling the stage. That is the density to reach.

## Think

- The real thing: Shaq's free throw career as Basketball-Reference counts it, every attempt one real ball, in 19
  season columns. Each column hangs on one horizontal hairline at exactly half its marks (half above, half below),
  so the hairline is a true "coin flip" line for every season at once. Makes fill each column from the bottom: in
  12 of 19 seasons the glow stops just above the line, in 7 just under it (1995-97, 2003-07, 2009-10). Career
  .527 = barely over the line. Misses are the marks above the glow.
- Details that make it real: the ball photo on every mark (shading, a dark side), real per-season heights (the
  decline at the end of his career is visible as short columns on the right), the empty rack outlines before the
  balls pour in, marks falling into their slots with gravity, the glow travelling up, the misses turning foul red and
  tumbling out with weight, bouncing once, piling into a heap on the free throw line of the reel's world (maple,
  Lakers gold lane, the 2 in white line), the BBR cell in BBR's own type.
- Word, then change:
  - (mount, 16.82 s): the quarter from `split` spins big over the empty rack: 19 hairline column outlines on the
    navy card, the floor and line below.
  - Over his: the coin falls, shrinking, toward the bottom of the first column.
  - career (lands): it becomes the first ball mark; a loupe shows it as a real ball, "1 free throw"; then all 11,252
    balls pour in column by column, 1992-93 to 2010-11 (season labels at both ends).
  - he: the grey hairline runs across the wall at half of every column, "coin flip" at its end; the loupe leaves.
  - made just: the glow starts climbing from the bottom of every column, the "52.7%" counter starts.
  - 52.7 (lands): the glow stops just above the hairline, counter at 52.7%, the BBR "19 Yrs | .527" row lands under
    it.
  - percent: light sweeps across the wall.
  - and missed: the marks above the glow flash foul red and drop out, column by column.
  - 5,317 (lands): the counter beside "missed" rolls with the balls actually falling, to 5,317 as the last one goes.
  - free throws. (ends on): the red heap settles on the line, a slow push in, hold.
- Sound-off test: a stranger sees a wall of basketballs, a line at half labelled coin flip, the lit part barely
  above it with 52.7%, then everything above the line falls out red into a pile counted 5,317. "He made about half,
  and missed a mountain."
- Only this reel: it is Shaq's real per-season attempts (his 2000-01 peak, his late-career short columns), the
  coin from the previous line becoming the first ball, the misses piling up on the Lakers line.

## Built (by cue word)

- mount: the spinning quarter (both real faces, reeded edge) over the empty rack, whose outline is the career's own
  stepped silhouette, on the navy card standing on the Lakers line (maple, gold lane, circle solid/dashed).
- Over / his: the coin falls and shrinks into the first slot. career: it becomes ball #1 (a ring), the loupe shows
  the real ball "1 free throw" with a hairline to it, and 11,252 balls pour in season by season (1992-93, 2010-11).
- he: the grey hairline draws across, "coin flip"; the loupe leaves. made: the glow climbs every column, the warm fill
  line on top of each, bloom; "52.7%" counts with it. 52.7: lands at 52.7, BBR's "19 Yrs | .527" row (FT and FTA
  dimmed), the .527 cell ringed. percent: a light sweep crosses the wall.
- and: 52.7% steps back; the "5,317 missed" counter arrives (a red real ball beside "missed"). missed: the balls above
  the glow flash red, pop forward and fall, column by column. 5,317: the counter counts the balls actually leaving and
  lands on 5,317 as the last one goes; they bounce and pile into a sandpile heap on the free throw line.
  free throws.: heap settled, slow 4% push in.

## Checked

Stills at 16.85, 16.9, 17.2, 17.5, 17.6, 18.1, 18.4, 18.6, 18.9, 19.9, 20.4, 21.0, 21.6, 22.0, 22.4, 23.0, 23.45, 23.6.
Render note: stills need `--public-only nba-floor` (another scene's font). The heap shadow is drawn sharp on an
offscreen canvas and blurred once: blurring 5,000 rects one by one hung the page.
