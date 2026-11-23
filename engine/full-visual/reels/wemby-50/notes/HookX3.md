# HookX3 (`hook`, 0.16-5.20 s, hands over in place at 5.30 s): "The 50 is the tip of the heap"

"Wembanyama's 50 points aren't the scary number. The scary number is 29."
Cue frames (lead 80 ms): Wembanyama's 5, 50 44, points 64, aren't 90, scary 109, number 127, (silence 150-210),
The 210, scary 217, number 234, is 264, 29. 274. Scene to 324; `answer` mounts at 318, so `HookX3.keep = true` and
from frame 306 the picture is `answer`'s first frame.

## What I looked at

- `photos/commons-wemby-spurs-2025-nbacup-cropped-onoguchi-ccby4.jpg` (1280 x 1657): grey SAN ANTONIO #1 road
  jersey with black piping, Jordan jumpman and LEDGER patch, black arm sleeve on his right arm, ball low at his right
  hand, eyes up and left; black wall behind, the blue and red NBA Cup apron at chest height, pale maple below it from
  y ~830. Soft top light. Waist up = the top 1080 px. Credit "Daiei Onoguchi, CC BY 4.0".
- The creator's first post (`context/posts/18155407801470375.jpg`): rounded dark cards, the photo filling them, a
  dark foot fade, the Spurs spur bare top left, the credit in small grey type top right, big white Figtree numbers.
- `wemby-shots-court.json`: his 29 attempts in feet from the rim centre, fitted from BBR's 500 x 472 chart
  (`pages/bbref-shots.html`: `div.tooltip` at `top/left` px, glyph box origin; the fit puts the rim at left 238.1,
  top 33.9, 9.88 px/ft, so BBR's hoop at about left 250, top 45 is the same point once the 12 px glyph box is
  centred). Zones: rim 12 (10 made), short 2 (2), mid 4 (3), three 11 (5). 20 made, 9 missed. FT 5 of 6.
- `answer` (PlayByPlayLog + Court), first frame, which my last frame must equal: court slab 15.2 px/ft at
  x 160 / y 700 / w 760 plus a 2.4 ft apron (box 123.5, 663.5), radius 9.1, shadow, seeded maple strips, Spurs-black
  lane with a silver edge, white 2 in lines, sheen `-40 + (f * 0.22 % 130)`, his 29 marks in BBR glyphs, lit; and
  a white Figtree 700 "29" at 176 px, left 434.4, top 530, line-height 1.
- The reel's chance (plan): a plain gold disc, 1.6 ft across, 0.19 ft thick, #FFD883 > #F2B33D > #B9801F, darker
  rim, soft contact shadow, no print. A free throw is a 0.44 wedge of one.
- Examples: ps5 HookVC (one hero, each word a physical verb), touchscreen HookX1 (`keep = true`).

What would give it away: discs as flat ellipses with no edge, a heap that pops instead of falling, discs gliding at
constant speed with no braking, discs that land off their BBR spots, a 50 that fades instead of falling with weight,
a court that is not the next scene's court.

## The idea

The 50 is the tip; under it is a heap of gold chances. The camera first looks down on it (a small mound), then drops
low and shows how tall it is. The heap creaks, gives way, the 50 falls flat, and the 29 chances avalanche across the
maple, each braking onto the exact spot where it was spent: the heap turns into the real shot chart, and 29 is the
number left.

## Word table

| Word | Real thing | Verb on the hero |
|---|---|---|
| (frame 0) | the heap of 29 gold discs + 6 free throw wedges at the top of the key, the 50 standing on it reading 46, the photo card upper left | spotlight on the 50, top discs settling with small clinks, the 50's digits already ticking |
| Wembanyama's | the man: Onoguchi photo card, waist up, credit top right, spur top left | the card's key light comes up, its shadow falls long across the maple under it |
| 50 | his PTS | the last tick lands 50 on the word; a light band rakes across the 50's face, the heap shudders under the weight |
| points | NBA.com PTS | "PTS" writes under it with a hairline; source line "NBA.com box score, Nov 21 2026" |
| aren't | the heap | camera pulls down and back, arena light comes up: the mound is a tall tilted heap of chances; label "shots" with a hairline |
| scary | first slip | two base discs slip out, one rolls away on its edge across the floor (it will be the corner three) |
| number. | the heap | settles lower, the 50 leans |
| (silence) | creaking | a disc every ~0.25 s slides off the base, the camera creeps in, the 50 rocks |
| The scary / number | bigger slips | the top tier shifts, the 50 tilts, a run of discs pours down one side |
| is | the give | the base blows out, the heap collapses, the camera starts rising |
| 29 | THE BIG MOVE | the 50 topples off the top and slams flat on the maple (thud, shake, dust); 29 discs slide, roll and wobble out, braking onto their real spots (rim cluster first, the eleven threes skating out to the arc last); the 6 free throw wedges stay on the line; each settled disc becomes BBR's white dot or grey x; "29" rises at the top |
| (hold) | hand-off | straight overhead, `answer`'s first frame exactly; the 50 has sunk into the floor, the wedges melt into the lane |

## Sound-off test

A 50 standing on a heap of gold discs; the heap turns out to be tall; it collapses and the discs slide onto a
basketball court, each onto a shot location, and "29" appears. The 50 sat on 29 shots.

## Built

- One pinhole camera in feet (HookX3World): looking down on the heap (pitch 63, tight), then on "aren't" down and
  back to pitch ~20 with the arena light coming up, a slow creep through the silence, then from "is" a rise to
  straight overhead at 15.2 px/ft, which is `answer`'s court exactly. The court is drawn as projected vector
  polygons (crisp at any distance, 4-strip planks where strips would alias), then the flat replica of `answer`'s
  court for the last frames.
- Heap: 29 discs in 8 leaning layers + 6 free throw wedges; 3 discs drop on in the first second as the 50 ticks
  46 -> 50 (lands on "50", light band across the face). PTS label on "points", source line, "his shots" on "aren't".
- Slips: the roller (shot 12, the far corner three) stands on its edge on "scary" and rolls off to its spot; base
  discs slip on "number", through the silence, "scary", "number"; the 50 leans more at each.
- Collapse from "is": the 50 tips back and slams flat face up on "29" (bounce, camera shake, dust); discs fall,
  hop, slide braking with spun-coin wobble onto their BBR spots (rim first, threes last, by n29+25), each pings and
  turns into BBR's white dot / grey x; wedges brake onto the free throw line and fade; the 50 greys and sinks; the
  card exits left; 29 rises at 176 px, left 434.4, top 530.
- Stills read: 0-5.1 s every ~0.25 s plus burst 5.20/5.267/5.283/5.30/5.317/5.333. Hand-off (answer mounts
  5.30): mean pixel difference 0.02 between consecutive frames (the sheen only).
- Fixed along the way: heap too flat (8 taller layers), 50 clipped by the card and the right edge (reframed),
  gold smears that read as cones (now two faint prints), board moire in the turned rise (plank LOD, yaw to 0 early),
  labels off screen / over the source line.
