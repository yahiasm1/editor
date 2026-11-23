# HookX5 (`hook`, 0-5.30 s, keep = true): "The nine misses hammered in"

"Wembanyama's 50 points aren't the scary number. The scary number is 29."
Cues (s): Wembanyama's 0.16, 50 0.82, points 1.14, aren't 1.58, scary 1.90, number 2.20 (silence 2.50-3.56),
The 3.58, scary 3.70, number 3.98, is 4.48, 29. 4.64 (ends 5.20). `answer` mounts at 5.30 on the same picture.

## What I looked at

- `photos/commons-wemby-spurs-2025-nbacup-cropped-onoguchi-ccby4.jpg` (1280 x 1657): waist-up crop of the NBA Cup
  photo. Grey SAN ANTONIO #1 road jersey with black piping, Jordan jumpman and LEDGER patch, black arm sleeve on his
  right arm, ball low at his right hand, eyes up and to the left. Black arena wall top, the Cup's blue and red apron
  band behind at mid height, pale maple boards from y ~840 with a white court line. Soft even top light. Credit
  "Daiei Onoguchi, CC BY 4.0" (the first post's style: 22 px grey, top right inside the card).
- `pages/bbref-shots.html`: the court is `court-nba-bbr.svg` at width 500 px (500 x 472, a 50 x 47 ft half court,
  baseline on top). Each shot is a `div` at `top/left` px with a `tip` holding the real play-by-play
  ("1st quarter, 10:46.0 remaining / Victor Wembanyama missed 3-pointer from 27 ft / San Antonio leads 3-2"). The
  glyph is `&#9679;` for a make and `&#215;` for a miss. `wemby-shots-court.json` holds the same 29 in feet from the rim
  centre (fit: rim at div left 238.1 / top 33.9, 9.88 px per ft, residual < 0.5 ft). 20 made (15 twos, 5 threes = 45
  points), 9 missed. NBA.com row: FTM 5, FTA 6, PTS 50. 45 + 5 = 50.
- The 9 misses in game order (n, quarter, clock, listed): #1 Q1 10:46 3PT 27 ft, #4 Q1 7:03 2PT 3 ft, #8 Q1 1:36
  3PT 27 ft, #17 Q3 8:04 3PT 25 ft (left wing), #20 Q3 1:25 3PT 25 ft, #21 Q3 1:19 3PT 25 ft, #23 Q4 11:37 2PT 18 ft,
  #26 Q4 7:36 2PT 1 ft, #28 Q4 6:56 3PT 26 ft (right wing). They are hammered in in this order; #28 lands on "29".
- `answer`'s first frame (PlayByPlayLog + PlayByPlayLogCourt): court top-down at 15.2 px/ft, rect x 160 / y 700 /
  w 760, 2.4 ft apron (Spurs black), radius 9.1 px, a deep shadow; maple boards from a seeded random (2.25 in strips,
  staggered end joints); lane in Spurs black with a silver inner edge; BBR glyphs (white dot with a navy stroke,
  dark x with a soft white halo, 0.62 ft); a white Figtree 700 "29" at 176 px, left 434.4, top 530. My last frame is
  exactly that and nothing else.
- Real floor physics for the impacts: hard maple strips flex along their length (the bend runs along the boards, not
  round), splinters come off as long thin slivers along the grain, finish dust is pale.
- Examples: ps5 HookVC (one hero, each word a physical verb), HookX1 and HookX4 of this reel (not repeated: X1 tips
  the photo onto the floor, X4 fires balls at the rim; here the court is the hero from frame 0 and the move is the
  misses hammered into it).

What gives it away: a counter that ticks with nothing feeding it, points that do not add to 50 (they must: 15 x 2 +
5 x 3 + 5 x 1), x marks that just fade in, an impact with no weight (no shadow before, no dent, no rock), marks off
their BBR spots, a court that jumps at the hand-off.

## The idea

One hero: the real court. First it holds only the makes: a clean, bright picture of 50, each made shot paying its
points into a big white count, each resting on the gold disc it cost. Then the light turns, the shadows of the nine
misses grow over their empty spots, and the nine misses are driven into the maple one by one like steel stakes,
the last on "29". The 50 is knocked aside; the count flips to shots, 20 + 9 = 29.

## Word table

| Word | Real thing | Verb on the hero |
|---|---|---|
| (frame 0) | the top-down half court (answer's geometry), lit, sheen sliding; the Onoguchi card tilted at the slab's left edge with its credit; makes already landing, a white count already climbing | makes land, points fly up |
| Wembanyama's | the man | a key light rakes the card, it lifts a hair; his name writes on the card's foot |
| 50 | his 20 made field goals + 5 made free throws | each make lands as a gold disc (the cost) with a white dot on it, its +2 / +3 flies into the count; the 5 free throws drop on the line (smaller discs: a free throw is less than a chance) as +1s; the count lands 50 on the word |
| points | the 50 | lands and glows; a light pass runs over the boards and every gold disc glints: clean, only makes |
| aren't | the light | the arena light swings and the court darkens from one side; 9 empty spots darken on the boards |
| scary | the 9 misses, unseen | grey x-shaped shadows grow over the 9 spots, one after another |
| number. | something heavy above | the shadows sharpen and close in |
| (silence) | the stakes | the first steel x falls out of the camera and is driven into the maple (2.64 s), then one every 0.25 s |
| The scary number is | the stakes | 5th, 6th, 7th, 8th: each impact bends the boards, kicks splinters and a ring of dust, rocks the slab, jolts the 50 |
| 29 | THE BIG MOVE, the 9th stake | the heaviest hit, the slab rocks hard; the 50 is knocked off its place and slides small to the top-right corner; the count flips: "20 made + 9 missed" rolls into "29" at the top |
| (hold) | hand-off | dust settles, the dents and the gold discs (spent) sink away, the stakes settle into BBR's x: `answer`'s first frame |

## Sound-off test

A court where every make pays into a big white 50, each sitting on gold. Then nine heavy grey x come down and are
hammered into the floor, the 50 is knocked aside and 29 is left: "the 50 came with 29 shots, and the misses count".

## Built

- `HookX5.tsx` (timeline, rock, count, flyers, card, the 20 + 9 roll), `HookX5Court.tsx` (answer's court in feet,
  glyphs identical), `HookX5Parts.tsx` (gold disc, steel stake, stake shadow, impact floor and air), `HookX5Data.ts`
  (29 shots with pts, the 25 scorings: 20 makes in game order + 5 free throws on the line). Public:
  `hookx5-onoguchi-cropped.jpg`.
- Points: 15 x 2 + 5 x 3 + 5 x 1 = 50; each flyer arrives in the count, the 25th on "50". Two are already in at frame 0.
- Free throw discs are smaller (radius x 0.66, area 0.44 of a chance); the wedge itself stays for `freethrow`.
- Stakes: head 1.7 ft half extent (the ninth 2.2), fall 11 f from out of the camera (pinhole about the court centre,
  motion blur), hits at "29" minus 8..0 x 15 f (2.63 s to 4.64 s). They stay steel through the silence and settle
  into BBR's x after "29". Rock: damped swing toward each hit, the ninth 3.4x with a shake and a floor flash; forced
  to rest by "29" + 30 f.
- On "29": the 50 is knocked to the top-right corner and fades; the card is thrown off the slab; "20 made + 9 missed"
  rolls into answer's 29 (176 px, left 434.4, top 530) by 5.07 s. Discs spent, dents healed, source line gone.
- Checked: stills every 0.25 s over 0-5.0 s plus 4.62-4.9 and 5.1-5.333 at 1/60 s. Hand-off: 5.267-5.317 s vs
  answer's first frame, mean difference 0.01-0.05 per channel, zero pixels over 30 (only the boards' sheen moves).
- Fixed along the way: source line over the 50 (moved to the apron), flyers piling on the digits, shadows too soft to
  read as x, stakes too small and settling too soon, the 50 sliding over "+ 9", mark draw order at the hand-off.
