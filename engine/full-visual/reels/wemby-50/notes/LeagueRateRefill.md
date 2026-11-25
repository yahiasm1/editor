# LeagueRateRefill (`average`, 46.56-52.08 s, next scene `extra` at 52.42)

"Now give an average scorer the exact same thirty-one and a half shots. They walk off with about thirty-six points."
Key words: average 47.04, 31.5 48.70, 36 51.26. Silence before 46.16-46.53, after 52.15-52.36.

## What I looked at

- `photos/commons-wemby-spurs-2024-toronto-h4stings-ccbysa4.jpg` at full size: the side-stands camera. Upper deck,
  about 45-50 degrees down, basket on one side, the whole half court in perspective; roof light soft and even, a
  satin sheen on the maple, the paint reflecting players; behind the baseline the stanchion with its padded base,
  arm, glass board, shot clock box. The same camera `attempts` built (eye -63 / 29 / 57 ft, target 0 / 20.5 / 0).
- `wemby-shots.json`, `wemby-shots-court.json`: his 29 attempts, feet from the rim, quarter, clock, made. Twelve pile
  at the rim (two on the same spot, Q1 10:04 and 7:00).
- `pages/bbref-pbp.html`: his six free throws in the play-by-play, so the 35 pieces can go in real game order:
  Q1 9:37 made, made (after shot 2); Q1 1:09 missed 1 of 1 (after shot 9, the 4 ft jumper); Q2 9:27 made, made
  (after shot 11); Q2 2:02 made (after shot 15). 5 of 6, as the box score says. Wedge x on the line matches
  `attempts` (the third wedge is the miss).
- `pages/bbref-2027.html` League Average row: TS% .575 (also eFG% .537, Age 26.7). The same row `trueshooting`
  showed, with the NBA logoman (cdn.nba.com) beside "League Average".
- facts.md: same 31.64 chances x 2 x .575 = 36.39, said "about 36". A league chance is worth 2 x .575 = 1.15 points:
  a disc filled to 57.5 %. A 0.44 wedge holds 0.506.
- The scenes around me: `attempts` ends with his column of 32 layers beside the court (29 discs, the six wedges fused
  into 2.64) filled white to 79 % (1.58 points); `trueshooting` ends on one disc standing, grey to 57.5 %, a white
  band to 79 %, and lifts off. `extra` refills every disc white to 79 % on top of my grey.
- The disc as the reel defines it (ChanceColumnDisc): gold top #FFD883-#F2B33D-#B9801F, edge lit from the left,
  darker amber above the fill, a white meniscus, 1.6 ft across, 0.19 ft thick.

What gives it away as fake: discs coming back to spots that are not his, a tidy order, a fill that is not 57.5 % in
every disc, a counter that does not end at 36.4, a person or silhouette for "an average scorer", grey fill above the
white level he had.

## Think

The real thing: his own 31.64 chances, on his own spots on the real court, poured at the league's rate. The only
thing that changes is who is shooting; the picture says that by changing nothing but the fill.

| Word | On screen |
|---|---|
| (lead) Now give an | from the side stands, his column (white to 79 %) topples toward the court; disc by disc it comes apart and every piece hops back along a low arc to its own spot, tumbling, landing with a bounce and a shadow; the top three layers split back into six 0.44 wedges that return to the free throw line |
| average (lands) | every disc empties at once: the white drains out through the floor with a glint; BBR's League Average card (logoman, TS% .575, source line) comes in at the bottom right corner |
| scorer the exact same | in game order, fast, each piece hops once and the BBR mark under it (dot made, x missed) flashes white; a game clock ticks beside the court "Q1 10:46" ... "Q4 6:29" |
| 31.5 (lands) | "29 + 0.44 × 6 = 31.64" writes back in where `attempts` had it, 31.64 white, "same shooting chances" |
| shots | the second line types: "31.64 × 2 × .575", the .575 grey |
| They walk off | the pieces fill one by one in grey, in game order, to 57.5 %; a big counter on the right climbs 1.15 a disc |
| (ends on) 36 | counter lands 36.4, then rounds to 36, "points"; line 2 ends "= 36.4"; label "same chances, league average shooting" |

Sound-off test: the same gold discs go back to the same places on the same court, lose his white, and are filled
again with grey to a lower line, one by one, from a card that says League Average .575. The count reads 36, not 50.

Hand-over out (for `extra`): the camera `LRR_END` (below), every disc on its real spot (rest heights as
`CC_REST`), each filled grey to 57.5 %, the six wedges on the line, the counter 36 at the right.

## Built

Files: `LeagueRateRefill.tsx` (scene), `LeagueRateRefillWorld.ts` (camera, shots in game order with clocks, rests),
`LeagueRateRefillFloor.tsx` (court and basket), `LeagueRateRefillDisc.tsx` (the solid, with a grey or white fill).
Public: `leagueraterefill-logoman.svg` (cdn.nba.com).

Camera: starts on `attempts`' last view (eye -63 / 29 / 57, target 0 / 20.5 / 0, F 1120, cx 375, cy 1092) with the
column at screen x 972, base y 1392; by "average" it moves to `LRR_END`-ish KB (eye -62 / 27.5 / 58, target
-5 / 14 / 0, F 1520, cx 540, cy 1175) and pushes to KC (eye -60 / 27 / 56, F 1575, cy 1180) at the scene's end.
The court is masked in under the equations (top fade at y 790-860). Last frame: every piece on its spot, grey to
57.5 %; "29 + 0.44 × 6 = 31.64" and "31.64 × 2 × .575 ≈ 36" top left, label "points: same chances, league average
shooting"; League Average card bottom right (x 540-1050, y 1300-1432).

Changed from the plan in build: the counter is the result of the equation itself (31.64 × 2 × .575 = climbing to
36.4, then ≈ 36) rather than a separate number, so the stage keeps one number; the blink also ticks BBR's
play-by-play clock ("1st Q 10:46", "free throw 6 of 6"); a grey hairline pours from the .575 cell to each piece as
it fills. Stills read at 46.3-51.95 and a clip 46.0-52.6; `check.py render` ok (longest still 0.67 s, no bare
handover frame). Fixes from the comparison: the court zoomed so the fills read, the big side counter removed (it sat
on the court), the card's logo and source line refitted, the grey fill made solid so gold (empty), white (his) and
grey (league) read apart.
