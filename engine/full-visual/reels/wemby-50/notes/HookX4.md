# HookX4 (`hook`, 0-5.30 s, keep = true): "Twenty-nine shots at once"

"Wembanyama's 50 points aren't the scary number. The scary number is 29."
Cues (s): Wembanyama's 0.16, 50 0.82, points 1.14, aren't 1.58, scary 1.90, number 2.20 (silence 2.50-3.56),
The 3.58, scary 3.70, number 3.98, is 4.48, 29. 4.64 (ends 5.20). `answer` mounts at 5.30 and takes the frame over.

## What I looked at

- Onoguchi NBA Cup photo (1280 x 1707): grey SAN ANTONIO #1 road jersey, black sleeve and tights, ball low at his right
  hip, pale maple boards from y ~740, the Cup's dark centre logo bottom left, NBA logoman bottom centre, black
  scorer's table behind. Soft top light. Used whole (full shot) in a rounded card, credit "Daiei Onoguchi, CC BY 4.0".
- Toronto upper-stands photo (H4stings), crop x 680-1060 / y 620-1060: the real basket assembly. A black padded
  stanchion base well behind the baseline, a long arm angled up to the glass, the glass with a white border and the
  inner shooter's square, an orange rim with a white net, and the shot clock box sitting on top of the glass: black,
  red-amber "24" digits, a game clock line above, readable from the side too (four-sided). A sponsor plate under it
  (not drawn). The net hangs about 1.5 ft below the rim in diamond loops.
- `wemby-shots-court.json` / PlayByPlayLogData: his 29 shots in feet from the rim centre (BBR fit, rim 5.25 ft from the
  baseline). 20 made, 9 missed. Spots range from at the rim (11 within 3 ft) to 27 ft (3s) and both corners.
- `answer`'s first frame (PlayByPlayLog + PlayByPlayLogCourt): court top-down at 15.2 px/ft, rect x 160 / y 700 / w
  760, 2.4 ft apron, baseline on top, rim at screen y 779.8, BBR glyphs (white dot navy stroke, grey x white halo,
  0.62 ft), the white Figtree 700 "29" at 176 px, left 434.4, top 530. My last frame is exactly that.
- Examples: ps5 HookVC (one hero, each word a physical verb on it), HookX1 of this reel (do not repeat: it tips a
  photo slab onto the floor and flings discs; mine never moves the photo into the world, the hero is the rim).
- Real numbers: NBA ball 9.4 in diameter (0.39 ft radius), rim 18 in inner diameter at 10 ft, 15 in from the glass,
  glass 6 x 3.5 ft, bottom 9.5 ft... the camera and every flight are in feet.

What gives a fake away: balls that are flat orange circles (no seams, no light), a rim the size of a ball, flights
that are straight lines, all 29 balls going through an 18 in ring at once (physically 20 go through one after the
other in a fast pour, 9 bounce off), marks not on their BBR spots, a court that jumps at the handover.

## The idea

One hero: the rim. 50 is what fell through it once; 29 is every shot fired at it at the same instant. The court is one
true-geometry 3D world (a pinhole camera in feet; the floor is the same court as `answer`, mapped onto the floor
plane by an exact homography so it lands pixel for pixel). The camera starts low behind the glass, rises over the rim,
swings round high above the floor during the silence, and drops straight overhead as the 29 balls hit.

## Word table

| Word | Real thing | Verb on the hero |
|---|---|---|
| (frame 0) | the basket from behind the glass, low: stanchion arm, glass, shot clock box, orange rim, net; the court beyond with 29 gold discs on his real spots, a ball resting on each; the Onoguchi card left with credit; Spurs logo bare top right; a ball already falling at the rim; a thin gold stack on the shot clock with the white scoreboard "50" counting on it | slow push in |
| Wembanyama's | the man | key light rakes his card; the ball is at the rim |
| 50 | the last points | the ball swishes, the net kicks; a gold disc (the chance) drops onto the stack; the 50 lands, counting 0 -> 50 on the word |
| points | the make | the ball's white trail through the rim fades; the ball bounces under the rim |
| aren't | the camera | rises over the rim, looking down the court: the 29 discs and their balls are already on the real spots |
| scary | the 29 balls | every ball lifts a hair off its disc and hangs there (the brief silence) |
| number. | the 29 discs | gold glints ripple out from the rim, disc by disc |
| (silence) | the court | the camera swings high round the court, the balls turning slowly in the air |
| The scary number | the 29 balls | rise a little more, spinning up; shot clock lit |
| is | the launch | they dip and all 29 fire at the same instant on parabolic arcs, each from its real spot |
| 29 | THE BIG MOVE | 29 balls hit one rim at the same frame: 20 pour through, the net whips; 9 clang off the iron and fly away grey; the glass shudders, the shot clock flickers; the camera drops overhead, the arcs collapse onto the floor into BBR's marks (white dot, grey x), the gold discs spent into them; the "29" lands at the top |
| (hold) | hand-off | straight overhead: `answer`'s first frame |

## Sound-off test

One rim, a 50 resting on a coin or two of gold; then every shot he took is fired at that rim at once: some go in,
many do not, and the floor is left marked with all 29. "The 50 is the made ones; 29 is how many times he shot."

## Built

- `HookX4.tsx` (scene, camera path, the 29 flights), `HookX4World.ts` (pinhole camera in feet, exact floor homography
  as CSS matrix3d), `HookX4Parts.tsx` (ball with seams and pebble, gold disc, stanchion, glass, shot clock, rim, net),
  `HookX4Court.tsx` (`answer`'s court, copied), `HookX4Data.ts` (29 shots). Public: `hookx4-onoguchi.jpg`,
  `hookx4-spurs.svg`.
- Checked: stills every ~0.25 s over 0-5.32 s; the last hook frame (5.27 s) and `answer`'s first (5.32 s) differ by a
  mean 0.1 / 765 per pixel, zero pixels over 30 (no jump at the hand-off).
