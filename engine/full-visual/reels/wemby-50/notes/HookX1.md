# HookX1 (`hook`, 0.16-5.20 s, hands over at 5.30 s): "The card falls onto the floor"

"Wembanyama's 50 points aren't the scary number. The scary number is 29."
Cues: Wembanyama's 0.16, 50 0.82, points 1.14, aren't 1.58, scary 1.90, number. 2.20 (silence 2.50-3.56),
The 3.58, scary 3.70, number 3.98, is 4.48, 29. 4.64. Scene ends 5.40; `answer` mounts at 5.30.

## What I looked at

- `photos/commons-wemby-spurs-2025-nbacup-onoguchi-ccby4.jpg` (1280 x 1707, full frame): grey SAN ANTONIO #1 road
  jersey, black trim, black arm sleeve, black tights, ball low at his right hip, eyes up. Pale maple boards fill the
  lower 57% of the frame (from y ~740), a white court line cutting across left, the dark NBA Cup centre logo
  bottom left, the NBA logo bottom centre, the blue/red Cup apron and the black scorer's table behind. Soft top light,
  his shoes at y ~1400-1480. This is the card: same aspect (0.75), the floor in it is the floor he falls onto.
- The creator's first post: rounded dark cards, photo filling them, a dark foot fade so a white number reads, the Spurs
  spur bare top left, credit 22 px grey top right "Daiei Onoguchi, CC BY 4.0".
- `wemby-shots-court.json` (29 shots, feet from the rim centre, fitted from BBR's 500 x 472 chart, rim at
  left 238.1 / top 33.9, 9.88 px per ft) and `pages/bbref-shots.html` (the `div.tooltip` marks, `&#9679;` made,
  `&#215;` missed). 20 made, 9 missed (NBA.com row FGM 20, FGA 29, PTS 50).
- `answer` (PlayByPlayLog) first frame, which my last frame must equal: the court top-down at 15.2 px/ft, court rect
  x 160 / y 700 / w 760 plus a 2.4 ft apron (box 123.5, 663.5, 833 x 787.4, radius 9.1, shadow), maple boards from
  the same seeded random, lane Spurs black with silver edge, BBR glyphs (white dot with navy stroke, grey x with a
  soft white halo), and a white Figtree 700 "29" at 176 px, left 434.4, top 530.
- The reel's chance: a flat gold disc (#FFD883 > #F2B33D > #B9801F top, darker rim), no print.
- Examples: ps5 HookVC (one hero, each word a physical verb on it), touchscreen HookX1 (keep = true, last frame is the
  next scene's first).

What would give it away: a card that falls like a flat sticker (no thickness, no shadow, no bounce), a court with wrong
proportions, marks not on their BBR spots, a cut instead of a fall, a 50 that just vanishes.

## The idea

One hero: the real photo, standing on a real floor as a slab. The cost (a heap of gold discs) sits at its foot under
the 50 from the first second. The sentence knocks the photo over, and the floor in the photo becomes the floor of the
game, with the 29 chances landing where they were spent. 50 was the picture; 29 is the ground under it.

## Word table

| Word | Real thing | Verb on the hero |
|---|---|---|
| (frame 0) | the Onoguchi photo as a standing 620 x 827 slab card on the navy floor (the engine grid tilted into a floor in perspective), credit and spur, a heap of gold discs at its foot already clinking in | camera slowly dollies in |
| Wembanyama's | the man | a key light comes on: the card brightens from the dark, a light pool on the floor under him |
| 50 | NBA.com PTS cell | the cell drops onto the heap at the card's right foot, counting 0 -> 50, lands on the word; the discs jump |
| points | his 20 makes | 20 white made-dots tick onto the photo's own floorboards in the photo's perspective (2 f apart) |
| aren't | the slab | starts to lean back on its bottom edge, its top edge (thickness) shows |
| scary | tipping point | it passes it; a band of light rakes across the photo, the shadow behind it lengthens |
| number. | his 9 misses | 9 grey x tick onto the same floorboards: 29 marks on the photo floor |
| (silence) | the heap | the creeping lean: a disc slides off the heap, the 50 cell tilts |
| The scary | the camera | starts rising; grit trickles off the card's lifting front edge |
| number is | the slab | the lean accelerates, then the fall |
| 29 | THE BIG MOVE | the slab slams flat onto the floor (inertia, two bounces, camera shake, dust off the edges); its maple becomes the true top-down half court, lines drawing outward from the baseline where the top edge hit; the 29 gold discs are flung off the heap and punch down on the 29 real spots in two waves (20 white dots, then 9 grey x); the 50 cell skids off small into the corner and goes; a "29" slams in at the top and holds |
| (hold) | the hand-off | the camera ends straight overhead: `answer`'s first frame exactly (keep = true) |

## Sound-off test

A photo of Wemby with a 50 sitting on a pile of gold coins; marks appear on his floor; the photo topples flat and the
floor turns into a shot chart with 29 marks, the 50 slides away and 29 is the number left standing. "The 50 cost 29
shots, and 29 is the number."

## Built

- One CSS 3D world (perspective 2200 px): the floor is the engine's own 60 px grid tilted into perspective; the camera
  starts low (13 deg) and orbited 22 deg to the side so the slab's thickness and lean read, drifts, rises from "The",
  then cranes straight overhead after the impact. Overhead, floor px = screen px, so the court lands on `answer`'s.
- Slab: 620 x 827 card, 14 px thick, hinged on its foot at y 1450.9 (the court slab's bottom edge). Lean 0 -> 11 deg
  (aren't -> scary), creeps to 26, falls with gravity to 90 on "29" (cue + 1), bounces twice, camera shake.
- Photo: full Onoguchi frame, spur top left, credit 22 px top right; his real 29 shots in the photo floor's perspective
  on the clean maple right of him (20 made on "points", 9 missed on "number."), a gold ring under each in game order
  through the silence (each shot cost a chance). Key light on "Wembanyama's", rakes on "scary" and "The".
- Heap: 29 gold discs (5 layers each) dropped in from frame -30, the NBA.com PTS cell (PTS / 50, Figtree 132 px) drops
  on it counting and lands on "50"; source line "NBA.com box score, Nov 21 2026"; two discs slide off in the silence.
- Impact: the photo is wiped off from the baseline down by a light front, the slab spreads to the court slab, lines
  draw outward from the baseline, dust and grit off the edges; the 29 discs fly from the heap and punch onto their
  real spots (20 made, then 9 missed), each turning into BBR's glyph with a gold ring; the 50 cell skids to the
  bottom-left corner at 40% and fades; the 29 slams in at 176 px, top 530, squashes, holds.
- Last frames (from 5.15 s): `answer`'s first frame. keep = true. Hand-off checked at 5.267 / 5.283 / 5.300 / 5.317 s:
  mean pixel difference 0.03-0.26 (the boards' moving sheen), nothing else changes.
- Stills read: every 0.25 s from 0 to 4.5 s, then 4.58, 4.6, 4.62, 4.65, 4.66, 4.68, 4.7, 4.75, 4.8, 4.9, 5.0, 5.1,
  5.2, 5.25-5.32. Fixed along the way: marks landing on his body (moved to the clean floor), lean too subtle (camera
  orbit + more lean), smoky dust (smaller puffs + grit), muddy photo-to-court dissolve (wipe front), heavy 29 blur,
  the PTS cell cutting into the slab (heap moved forward), a ring on the floor that read as UI (removed).
