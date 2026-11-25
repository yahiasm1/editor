# ShotChartHero (`where`, 56.28-65.32 s; prev `extra` ends 55.94, next `close` at 65.72)

"And look where they came from. Ten of his twelve shots at the rim went in, and five of his eleven threes, in under
thirty-two minutes, in a game the Spurs won by twenty-three."
Key words: came 56.84, 10 57.68, rim 59.02, 5 60.30, 32 62.26, won 64.32. Also cued: 12 58.24, 11 60.84, game
63.52, Spurs 63.98, 23 64.78.

## What I looked at

- `pages/bbref-shots.html`, the SAS shot area: `<div id="shots-SAS" class='shot-area'>` holding
  `<img src=".../court-nba-bbr.svg" style="width:500px;">` (500 x 472 frame, the basket at the top, half court at the
  bottom). Each shot is a `div.tooltip` absolutely placed by `top/left` px, glyph `&#9679;` (made, class `make`) or
  `&#215;` (missed, class `miss`), with a three line `tip`. His 29 tips, real copy, e.g. shot 24 "4th quarter,
  10:16.0 remaining / Victor Wembanyama made 2-pointer from 0 ft / San Antonio now leads 94-68", shot 29 "4th
  quarter, 6:29.0 remaining / ... made 3-pointer from 25 ft / San Antonio now leads 108-82". The court svg itself is on
  cdn.ssref.net (blocked), so the court is drawn from NBA rules; the shots come from `wemby-shots-court.json` (fitted
  rim at div left 238.1 / top 33.9, 9.88 px per ft, residual under 0.5 ft), never from raw pixels.
- The 29 shots in feet: 12 inside 3.4 ft of the rim (shots 2 3 4 5 7 13 18 19 22 24 25 26; misses 4 and 26), so a
  3.5 ft ring holds BBR's whole 0-3 ft bucket and nothing else (the next nearest are 4.0 ft and 5.0 ft). Shots 2 and 5
  sit on the very same spot (0.19, -0.49): two dots in one place, as on BBR. 11 threes: makes 6 (left wing, 25.8 ft),
  12 (left corner, 23.9 ft), 15 (top right, 26.4), 27 (left wing, 25.4), 29 (right wing, 24.7); misses 1, 8, 17, 20,
  21, 28. Plus 2 of 2 from 4-9 ft and 3 of 4 midrange: on the chart, never captioned.
- NBA.com box (`boxscore-0022600278-clean.json`): his MIN "31:51"; SAS 32 29 28 25 = 114, NOP 29 16 21 25 = 91.
  The NBA.com linescore reads: team logo, tricode, four quarter columns, T bold.
- Logos `nba-spurs-primary.svg` (white/black spur, silver chevrons) and `nba-pelicans-primary.svg` (navy, gold, red,
  white), bare, from cdn.nba.com.
- The court, floor and basket of the reel's shared world (`FourteenExtraWorld/Floor`, copied as mine): maple strips
  2.25 in, white 2 in lines, Spurs-black lane with silver edge, the basket on its stanchion, at true NBA geometry.
- `extra`'s handover: court sunk at the bottom from the side stands (camera KE), discs grey to 57.5 %.
- The creator's first post: white big numbers, grey small labels, credits small; no badges.

What would give it away as fake: a shot off its spot, a ring that catches a 4 ft shot, 19 rebounds, a 3 pt line that
is a perfect semicircle to the baseline (it is straight 22 ft in the corners), quarter scores that do not sum.

## Think

The real thing: Basketball-Reference's own shot chart of this game, top-down, the court at true geometry, his 29
marks where they were taken, read twice: once at the rim (inside the restricted area), once on the arc. Then the
NBA.com linescore lands above it, so the efficiency is tied to a blowout, not garbage volume.

| Word | On screen |
|---|---|
| And look where | the camera swings from `extra`'s side stands view up to straight over the court (one continuous move); the grey discs fade off the spots; the floor darkens a step so marks read |
| came (lands) | all 29 marks redraw on their spots in game order, 1.3 f apart, each popping with a ripple; legend counts "29 shots, 20 made, 9 missed"; source "Basketball-Reference shot chart" |
| from. | the camera pushes down toward the rim |
| 10 (lands) | the 3.5 ft ring round the rim draws and lights; everything outside dims; the 10 made dots pulse in turn, counter 0 -> 10 |
| 12 | the 2 misses (shots 4, 26) pulse as x; label reads "10 / 12", "at the rim, 0-3 ft" |
| rim (lands) | the rim glints, the net swings; BBR's tooltip for shot 24 writes in, real copy |
| and | the camera pulls back over the whole half court; the ring stays lit, smaller |
| 5 (lands) | the three point line draws in light (22 ft corners, 23.75 ft arc); the 5 made threes pop in turn, counter 0 -> 5 |
| 11 | the 6 missed threes pulse as x; "5 / 11" settles inside the arc's top |
| 32 (lands) | the court slides down and shrinks; the scoreboard card returns above it: MIN counts 0:00 -> 31:51, lands |
| game, Spurs | NBA.com's linescore writes in, logos and tricodes, quarter scores rolling one by one |
| won (lands) | the finals land: SAS 114, NOP 91, "FINAL" |
| 23 | "+23" drops in beside the finals with weight; source "NBA.com box score, Basketball-Reference shot chart" |

Sound-off test: a real shot chart, his marks clustered under the rim almost all made, a lit ring that says 10 / 12,
the arc that says 5 / 11, then the clock and a final of 114-91, +23. Efficient, close to the basket, in a blowout.
