# DeficitFlowChart (scene `deficit`, 23.14-28.18 s)

"Early in the third quarter, the Lakers fell behind by 18. So Kobe just decided to win it himself."

## What I looked at
- `kobe-81-scoring.json` (BBR play-by-play, 128 scoring plays). First half 63-49. Third quarter to the low point:
  11:20 James three 66-49 (17), 10:43 Bryant layup 66-51 (15), 9:55 Bonner three 69-51 (18), 9:36 Bryant 10 ft
  jumper 69-53 (16), 9:23 Peterson free throws 70-53, 71-53 (18). Next: 8:42 Bryant 21 ft jumper 71-55 (16).
  The gap first touches 18 at 9:55, the plan and facts.md row 19 use 9:23 (the last time it reads 18): kept.
  Lakers led only twice, at 0-2 and 3-2 in the first two minutes.
- ESPN's gamecast of this game (`pages/espn-gamecast-260122013.html`, gameId 260122013): it has a real "Game Flow"
  card for this game: two running-score lines across the four quarters, Raptors #CE0F41, Lakers purple / gold on dark,
  team logos at the ends of the header. Its team stats list "Largest Lead: TOR 18, LAL 20", which confirms the 18.
  That card is the real thing this scene redraws: a broadcast-style game flow chart, score up, game clock across.
- The reel's scoreboard (`StaplesNightBoard.tsx`, owned by `night`): parked x 90-990, y 532-692. I import it, never
  edit it. Halftime ends it at HALF 63-49.
- `HalftimeBoos.tsx` ends on the 9 x 9 board at x0 458, y0 870, pitch 62, r 23, 26 gold. I start mine on that exact
  picture and shrink it into the top right corner.
- Kobe: the gold #8 free throw photo (Sgt. Joseph A. Lee, USMC, public domain, Oct 2005), from the reel's hand cut-out
  (`assets/refs/cutouts/startingfivespotlights-kobe-full.png`, 807x1288) resized to 520 wide as my own
  `public/kobe-81/deficitflowchart-kobe.png`. Eyes up, mouth open, sweat on the shoulders, purple armband, the ball at
  the waist. The cut ends at the shorts: he rises from behind the chart's floor line, so the waist is never seen.

## The real thing, part by part
- Chart: the game flow card. y axis 0-125 points with hairline gridlines every 25, x axis 48 minutes with a tick each
  minute and a taller tick at each quarter, Q1 Q2 Q3 Q4 under the bands, HALF marked at minute 24. Lines are steps
  (a score changes at once, on the play), Raptors red #CE1141, Lakers white. Source "Basketball-Reference play-by-play".
- Logos ride the two line tips (bare, cdn.nba.com), as the gamecast puts them on the legend.
- The wash: between the lines wherever Toronto leads, dark red, deeper as the gap widens.
- The gap: a hairline at the tip, the live gap beside it in big white, rolling with every real play: 14, 17, 15, 18,
  16, 18. On "himself", 16.
- Under the chart, the play that made the tip move, BBR copy: "9:23  M. Peterson makes free throw 2 of 2".
- Scoreboard: HALF 63-49, then 3RD running the real clock with the chart, 9:23 71-53, then 8:42 71-55.
- The 9 x 9 board waits in the corner with its 26 gold (no number on it: it is not live in this scene).

## Word, then change
| word | change |
|---|---|
| (mount) | the 9 x 9 board, as halftime left it, shrinks into the top right corner; the axes draw in left to right |
| Early in the | the two lines race through the first half (0:00 to HALF 63-49), logos riding the tips |
| third | lands: the Q3 band lights; the scoreboard flips HALF to 3RD 12:00; the gap readout appears (14) |
| the Lakers fell | the lines crawl through the real Q3 plays at game rhythm, the wash deepens, the gap rolls 17, 15, 18, 16; the camera pushes in on the tip |
| 18. | lands at 3RD 9:23: lines stop at 71 and 53, hairline between them, the 18 pops big; scoreboard 9:23 71-53 |
| So Kobe just | Kobe's cut-out rises from behind the floor line right at the Lakers tip, the Lakers logo steps aside |
| decided | lands: a gold ripple runs along the white line over every step Kobe made, ending at the tip, which turns into a gold bulb |
| himself. | lands: the gold tip jumps up to 8:42 71-55, the gap rolls 18 to 16, the scoreboard and the play line flip to "8:42  K. Bryant makes 2-pt jump shot from 21 ft". Hold, slow push |

## Sound-off test
Two lines, red over white, the red gap filling, 18 between them; then Kobe stands at the end of the white line, it
turns gold and climbs. A stranger reads: the Lakers were way down, and this one guy started taking it back.

## Geometry left for the next scene
`DeficitFlowChartCornerBoard` (exported): the 9 x 9 board parked top right, centres x0 822, y0 726, pitch 19, r 7.

## Built, checked
Stills at 23.05, 23.15, 23.3, 23.62, 23.7, 24.3, 24.65, 24.9, 25.1, 25.35, 25.4, 25.8, 26.6, 26.8, 26.95, 27.2, 27.45,
27.85, 27.9 and 28.3 s, read beside the gamecast card and the halftime end frame. Fixes from the comparison: the play
line showed a 2nd quarter play labelled 3RD (now third-quarter plays only), Kobe's glow drew a box edge (glow moved
onto the image), his credit sat on the floor line (moved under the corner board), the 18 sat on the Raptors logo
(raised). Richer pass: each real 3rd-quarter play rings out on its step as the clock crosses it, gold ripple over all
of Kobe's steps on "decided", the tip becomes one of his bulbs, the gap number rolls 18 to 16 in a drum, a slow push
keeps going through the hold, a soft light drifts over the card. Files: `scenes/DeficitFlowChart.tsx`,
`public/kobe-81/deficitflowchart-kobe.png`, `assets/refs/pages/espn-gamecast-260122013.html`.
Render with `--public-only nba-floor` (as halftime). The board is not lit further here; `takeover` starts it at 26.

## Review (fresh eyes)
Stills every ~0.4 s from 22.95 to 28.35 s. Fixed in review: the gold glow on Kobe (a drop-shadow on the masked image)
darkened a box around him and hid the 25 gridline, now a radial light behind him; a dark wedge of the original photo
left of his shoulder cleared in `public/kobe-81/deficitflowchart-kobe.png`; the 18 climbed into the play line, now
held under it, and the Raptors logo rides right of the red tip; the 8:42 play line was cut at "21 f" (clock only now,
the scoreboard says 3RD); a left label gutter keeps the zoomed lines off the y labels.
