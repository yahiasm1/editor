# HookX2 (`hook`, 0.16-5.20 s, hands over in place at 5.30 s): "The FGA cell torn out of the row"

"Wembanyama's 50 points aren't the scary number. The scary number is 29."
Cue frames (lead 80 ms): Wembanyama's 5, 50 44, points 64, aren't 90, scary 109, number 127, (silence 150-214),
The 210, scary 217, number 234, is 264, 29. 274. Scene to 324; `answer` mounts at 318, so `HookX2.keep = true` and
frame 318 must already be `answer`'s first frame.

## What I looked at

- `pages/boxscore-0022600278-clean.json`: NBA.com Spurs rows in NBA.com column order. His row:
  MIN 31:51, FGM 20, FGA 29, FG% 69.0, 3PM 5, 3PA 11, 3P% 45.5, FTM 5, FTA 6, FT% 83.3, OREB 3, DREB 15, REB 18,
  AST 1, STL 4, BLK 5, TO 3, PF 3, PTS 50, +/- 35. Neighbours: J. Champagnie F, D. Vassell F above; S. Castle G,
  D. Fox G below. Score strip NOP 91, FINAL, Sat Nov 21, SAS 114.
- `notes/PhoneBoxScore.md`: NBA.com's own dark-mode stylesheet values (surface #191C23, text #F3F3F3, header muted
  #A4A2A2, rules #1A2E3D, condensed uppercase headers with 1 px tracking, right-aligned numbers, bold MIN, sticky
  PLAYER column with a shadow, Roboto / Roboto Condensed). Desktop NBA.com shows a headshot in the player cell; the
  phone hides it. Here the hero row keeps a headshot, as the brief asks, from Commons, not NBA.com.
- Photo: Commons, Frenchieinportland, CC BY 4.0 (Portland 2024, upright copy): head and shoulders, black Spurs #1,
  white piping, sweat on the forehead, warm light from upper left, crowd soft behind. Cropped square to the face.
- Logos: cdn.nba.com Spurs primary (white spur, silver), Pelicans primary (navy, gold, red), bare.
- `wemby-shots-court.json` (29 shots in feet from the rim centre, fitted from BBR's 500 x 472 court image, rim at
  left 238.1 / top 33.9, 9.88 px/ft) and `pages/bbref-shots.html` (BBR glyphs: filled dot = make, x = miss).
  20 made, 9 missed.
- `answer` (PlayByPlayLog) first frame, which my last frame must equal: court slab at x 160 / y 700 / w 760
  (15.2 px/ft) plus a 2.4 ft apron (box 123.5, 663.5, 833 x 787.4), the same seeded maple, lane, marks lit, sheen
  `-40 + (f * 0.22 % 130)`; and the white Figtree 700 "29" at 176 px, left 434.4, top 530, line-height 1.
- Examples: ps5 HookVC (one hero, each word a physical verb on it), touchscreen HookX1 (keep = true).

What would give it away: a table with invented columns or left-aligned numbers, a cell that pops out flat with no
thickness, a flip with no edge, marks that are not on BBR's spots, a court that is not the next scene's court, a
torn row that just fades.

## The idea

The box score row is the hero. The eye is pulled to the biggest number (PTS 50), then the table is scrolled back to
the small column nobody reads, and that one cell is torn out of the table like a key pulled off a keyboard. Turned
over, the cell is the floor where the 29 shots were taken. The cost was hiding in one small cell.

## Word table

| Word | Real thing | Verb on the hero |
|---|---|---|
| (frame 0) | NBA.com Spurs box score, dark, scrolled to PTS: score strip with both logos, team header, header row, 5 rows, his row tall with the Commons headshot and credit | the whole table is already sliding in from the right, still settling (iOS momentum) |
| Wembanyama's | his pinned PLAYER cell | his row lights, a light sweep crosses it, the headshot pushes in |
| 50 | the PTS cell | swells out of the row toward the lens, the 50 rolls up digit by digit to full size; gold discs (the chances it cost) drop and pile under the cell, one by one |
| points | the PTS header | underlines in white |
| aren't | the row | flings back toward the start (the real phone-table direction), REB 18, FTA 6, 3PA 11, 3PM 5 whipping past; the swollen 50 sinks back into its cell and greys as it goes |
| scary | the FGA column | the scroll stops dead on it, a small jolt; the small 29 sits in its cell |
| number. | FGA | its header lights white, a hairline frame draws round the 29 cell, label "field goal attempts" |
| (silence) | the camera | pushes in on the cell; the other rows dim; light slides over the row; the cell starts to rattle, a dark seam opens around it |
| The scary | the cell | lifts a notch like a loose key, its shadow appears |
| number | the row | bends up with it, glued; the neighbours lean |
| is | the cell | dips (anticipation) |
| 29 | THE BIG MOVE | the cell rips free: the row splits with a gap, FGM 20 and FG% 69.0 sag into it, splinters of the rule fly; the cell rises toward the lens growing to stage height, the 29 peels off its face and flies to the top; the cell flips 180 degrees in depth (its edge shows) and slams face down: its back is the real half court; the impact shakes the 29 marks into their BBR spots; the torn table drops away below |
| (hold) | the court | settles: exactly `answer`'s first frame (keep = true) |

## Sound-off test

A real box score; the 50 swells on a pile of gold discs; the table is swiped back to a small column, FGA, 29; that
cell is ripped out, turned over, and its back is the court with the 29 shots on it, the 29 on top. "The 29 in the
small column is where the 50 came from."

## Built, and checked

- Table: NBA.com dark tokens, 5 real Spurs rows, PLAYER pinned (Commons headshot, credit "Frenchieinportland,
  CC BY 4.0"), game strip with cdn.nba.com logos. Scroll parked at PTS (SC0), fling back on "aren't" with an
  exponential decay that stops dead on FGA on "scary" (jolt), horizontal motion blur from scroll speed.
- 50: PTS cell swells (x1.75, lifted 120 px), drum digits roll 0 -> 50 landing on "50", six gold discs drop and
  pile under it 4 f apart; PTS header underlines on "points"; it deflates and greys on "aren't".
- Silence: camera push to x1.42 centred on the FGA cell, other rows dim, seam opens, rattle grows.
- 29: rip at cue-2 f; neighbours sag 17 deg into the gap, row splits, splinters fly, table falls under gravity;
  the card (CSS 3D, with edge thickness) grows to past stage height, the 29 peels off at rip+5 and lands at the top
  (Roboto -> Figtree crossfade in flight), flip 180 deg ending at max speed, slam at rip+26 with shake, flash, dust;
  the marks are thrown off their spots and shaken back by impact (all settled by frame 316).
- Hand-over: keep = true. Pixel diff of 5.29 s (hook) vs 5.31 s (answer) over the stage: max 3/765, 0 px over 30.
- `check.py render` on 0-6 s: longest still 0.27 s, 0 bare frames at the hand-over.
