# StaplesNight (scene `night`, 4.26-8.17 s): "January 22, 2006, and honestly, the night started terribly."

## What I looked at
- `photos/commons-kobe-81-night-staples-2006-endlessbender-ccby2.jpg` (960x720, the only photo from the 81 game; the
  full-size Commons original refused with 429 twice, so the 960 thumbnail is used, max 1.2x on stage). Upper deck behind
  the Raptors-bench end. Court maple, warm yellow under sodium-ish light. Purple lane at right with gold lines and the
  free throw circle half dashed. Gold sideline band along the near-left stands, "LAKERS" in gold on the purple baseline
  band, the gold Lakers centre logo (purple "LAKERS" over a gold disc, "LOS ANGELES" small), red "STAPLES CENTER"
  lettering twice on the floor (upside down for us). Lakers in home white, Raptors in red road jerseys; Kobe #8
  "BRYANT" back to us left of the lane (about x 523, y 400). Two refs in grey, a man in a tan suit near the bottom.
  Crowd fills every seat, gold and white shirts, stair rails catching light. AT&T ribbon board top right.
- The stanchion clock (crop x 690-900, y 150-320): a two-faced black cube on top of the yellow Porter stanchion,
  each face shows a small red-orange game clock "54.7" over a big red seven-segment shot clock "23". Face centre in
  the photo: about (797, 198). Dim, slightly bloomed red digits, black housing with a lighter top lid.
- `photos/commons-staples-shotclock-2005-nivsinger-ccbysa2.jpg`: the same unit close: a Daktronics box, amber game
  clock "00.5" (dot-style seven segment) over a big red "0", thin grey edge, the yellow support. This is the LED style:
  black box, red/amber seven-segment digits, unlit segments faintly visible, a little bloom.
- BBR box page scorebox_meta: "9:30 PM, January 22, 2006 / STAPLES Center, Los Angeles, California", "Attendance:
  18,997". facts.md row: "Sunday, January 22, 2006, STAPLES Center, Los Angeles; attendance 18,997". BBR time is
  Eastern, so the time is left off (it would read as a wrong local tip).
- `kobe-81-scoring.json`: 34 first-quarter scoring plays, 10:55 Parker dunk (0-2) to 0:01 Bryant FT (36-29). Kobe 14.

## The real thing and where each part comes from
- The photo card: endlessbender photo, credit "endlessbender, CC BY 2.0" top right.
- The scoreboard: the stanchion cube's LED look (both photos): black housing, chrome hairline edge, red seven-segment
  scores with dim unlit segments, amber period and clock like the game clock, team names in dot-matrix amber.
  Raptors and Lakers logos bare (cdn.nba.com) at the row starts. Two rows RAPTORS / LAKERS, period and clock right.
- Scorebox lines: BBR copy, grey type, source "Basketball-Reference box score".
- Scores: every Q1 scoring play in order, clock 12:00 to 0:00.

## Geometry left for the other scenes (thread object)
Scoreboard parked at the top of the stage: x 90-990 (stage width 900), y 532-692 (160 tall), radius 14,
housing #050505, edge #3a3f46. Row 1 RAPTORS, row 2 LAKERS, period + clock block at the right.

## Word, then change
| word | change |
|---|---|
| (mount) | unlit scoreboard box at the top (as the hook leaves it); the photo card rises from below, already pushing in |
| January | photo card landed, slow push toward the court; credit visible |
| 22, | "Sunday, January 22, 2006" types on under the photo, the 22 lands on the word |
| 2006, | "STAPLES Center, Los Angeles" writes in, "Attendance" counts 0 to 18,997 |
| and honestly, | the camera turns to the stanchion clock in the photo: a red ring of light; its LED face lifts off, grows and flies up into the box, which lights: RAPTORS 0 / LAKERS 0, 1ST 12:00, logos land |
| the night started | clock runs 12:00 to 0.0; every real scoring play rolls a score; the team that scored flashes its row |
| terribly. | END 1ST, clock 0.0, RAPTORS 36 LAKERS 29, the 36 flares and stays brighter; the photo dims a step |

## Sound-off test
A stranger sees the real arena on a real night with its date and crowd count, the arena's own shot clock becomes the
scoreboard, and it fills fast with the Raptors pulling ahead: the Lakers start losing at home.

## Built, checked
Stills at 4.32, 4.8, 5.2, 5.7, 6.25, 6.45, 6.6, 6.75, 6.8, 6.9, 7.0, 7.3, 7.6, 8.0, 8.1 s, read beside the photo.
Richer pass: unlit cabinet shows no lettering (only dim segments, as a dark LED does), power-on flicker, the lit
board's red spill on the photo top pulsing with each basket, a light sweep and grain on the photo, tenths under a
minute on the game clock (as the photo's "54.7").
Render note: bundling needs `--public-only nba-floor` (nba-floor loads its font at module load from public/nba-floor).

## Review (fresh eyes)
Stills every ~0.4 s plus 1/60 bursts at the entrance (3.95-4.6), the clock lift-off (6.42-6.72) and the exit (8.02-8.15).
Fixed: the photo card's measured entrance (dist 300, 18 f) still carried motion blur on "January"; now dist 220, 12 f,
sharp by 4.68 s. The "Basketball-Reference box score" source line now arrives after the STAPLES line (2006 + 10 f)
instead of under an empty row. Bare navy 3.95-4.25 s belongs to the hook (HookX1 is still a stub), not to this scene.
