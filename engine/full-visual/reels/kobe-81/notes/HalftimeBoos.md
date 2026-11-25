# HalftimeBoos (scene `halftime`, 15.26-22.88 s)

"At halftime the Raptors were up 63 to 49, and the home crowd was booing. Kobe had 26 points, which sounds like a lot,
until you hear what came next."

## What I looked at
- The endlessbender photo of the 81 game. The 960 px thumbnail was in refs; I fetched the Commons original
  (`upload.wikimedia.org/.../f/fc/Kobe_Bryant_81.jpg`, 1024x768, the largest that exists) and saved it as
  `photos/commons-kobe-81-night-staples-2006-endlessbender-ccby2-1024.jpg`. Credit verified in
  `photos/meta/...endlessbender-ccby2.wikitext`: author endlessbender, cc-by-2.0, Flickr "Kobe 81 Points 011".
- The stands, read at 2x (crop x 0-620, y 0-440 of 1024): the lower bowl behind the Raptors-bench end, roughly 25
  rows climbing to a concourse, black seats, three stair aisles running diagonally down to the floor with chrome
  double handrails catching the arena light, a lit Exit stair top left. Fans mostly seated, dressed in black, white
  and Lakers gold, a few gold caps, a man in a red shirt, people with arms folded. The front row sits on the gold
  sideline band, a ref in grey stands on it. Light is warm overhead sodium, faces lit from above, no flash. Grain is
  heavy (2006 compact camera at night); the image is soft below 2x.
- Right of the stands: the AT&T ribbon board, the stanchion cube with "54.7 / 23" red-orange digits, the yellow
  stanchion: that cube is where the reel's scoreboard came from (`night`).
- Faces: a skin-tone pass over the stands crop finds 145 spread faces (one per 44x38 px cell), saved as
  `assets/refs/halftimeboos-faces.json` (crop px of the 800x560 crop). Checked drawn on the photo: they sit on heads.
- `kobe-81-scoring.json`, Q2: 24 scoring plays, 36-29 to the Mike James three at 0:01.5 that makes it 63-49.
  Lakers' 49 points in order: 29 in Q1 (Kobe 14), 20 in Q2 (Kobe 12: a 3, a dunk, a jumper, a free throw, a 7 ft
  jumper, a layup). facts.md row 7: "the Raptors led after a James three to put them up 63-49 and the Lakers were
  once again booed by the crowd. At this point, Kobe had just 26 points."
- The reel's scoreboard (`StaplesNightBoard.tsx`, owned by `night`): parked at x 90, y 532, 900x160; I import it and
  never edit it. LAKERS score digits sit at x 614 / 656, y 620, 56 tall.

## The real thing, and where each part comes from
- Stands: the endlessbender photo, cropped x 0-800, y 0-560 of the 1024 original, upscaled 2.25x with Lanczos and an
  unsharp mask into `public/kobe-81/halftimeboos-stands-endlessbender.jpg`, so the push-in stays crisp. Credit
  "endlessbender, CC BY 2.0" top right of the card.
- BOOs: rise from the real faces (the json), in the warm white of the fans' shirts.
- Scoreboard: the reel's board, Q2 run by the real plays, HALF 63-49.
- Bulbs: the reel's one invisible thing, Kobe's points. 49 Lakers points in real order, warm white; Kobe's turn
  Lakers gold #FDB927 make by make. 9 x 9 board of sockets.

## Details a viewer would miss only if gone
Stair rails glinting in the push, the photo's grain, the crowd shaking on "booing", the scoreboard trembling, the
red spill of the board on the photo, the dim unlit segments where LAKERS 49 used to be, bulbs born along the
segments of the seven-segment 49 (so the 49 really breaks into its points), a 2-pointer's two bulbs lighting
together, the socket rings with a metal screw-base sheen, the glint across the dark sockets.

## Word, then change
| word | change |
|---|---|
| (mount) | board at the top, Q2 starting 36-29 2ND 12:00; the stands photo card rises from below, already pushing in |
| At halftime | the clock runs Q2 fast, every scoring play rolls a score, the row that scored flashes |
| 63 | lands: James's three, HALF 0.0, RAPTORS 63 flares; Raptors logo pulses |
| to 49, | lands: LAKERS 49 flares and locks |
| and the home crowd | push reaches the fans, rows of real faces fill the card |
| booing. | lands: dozens of BOO glyphs rise out of the faces, many sizes and tilts; the crowd shakes; the board trembles |
| Kobe had | BOOs whip off the top, the stands dim; the LAKERS 49 drops out of the board to centre, huge, and breaks into 49 warm-white bulbs along its segments |
| 26 | lands: Kobe's bulbs turn gold make by make in real order (14 then 12); counter counts 0 to 26 with "Kobe's points"; legend "1 bulb = 1 Kobe point" |
| points, | the 23 white bulbs drift to the left column and dim, "other Lakers 23" |
| a lot, | lands: the 26 gold bulbs fly into the first 26 sockets of the 9 x 9 board (top three rows) |
| until you hear | the other 55 sockets fade in dark, row by row; label "81 sockets" |
| next. | lands: a glint runs across the dark sockets left to right; the gold holds and breathes |

## Sound-off test
The Lakers are losing at halftime and their own fans boo; then their 49 breaks open and more than half of it is one
man's gold, set into a board of 81 with most of it still dark: something is coming.

## Built, checked
Stills at 15.3, 15.9, 16.75, 17.3, 18.3, 18.85, 19.0, 19.1, 19.15, 19.3, 19.45, 19.62, 19.95, 20.3, 20.8, 21.4, 21.95,
22.5 and 22.75 s, each checked beside the photo. Richer pass: I halved the BOOs (they were hiding the faces), kept them
inside the stage width, faded them before they reach the board, faded the credit as the stands dim, the counter glows
gold on each make, sockets have a threaded base, and a gold glint runs across the dark ones.
Render with `--public-only nba-floor`. New files: `scenes/HalftimeBoosKit.ts`, `assets/refs/halftimeboos-faces.json`,
`public/kobe-81/halftimeboos-stands-endlessbender.jpg`.
