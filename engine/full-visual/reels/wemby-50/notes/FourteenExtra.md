# FourteenExtra (`extra`, 52.42-55.94 s, next scene `where` at 56.28)

"Wemby got fifty. Those fourteen extra points are the real story."
Key words: 50 53.06, 14 53.88, story 55.66. Silence before 52.15-52.36, after 55.97-56.28.

## What I looked at

- `photos/commons-wemby-spurs-2024-portland-frenchieinportland-ccby4-upright.jpg` at full size (1536 x 2048): Wemby
  straight on, chest up, mouth a little open, sweat on the forehead, black Spurs association jersey with white and
  silver trim at the V neck and armholes, Nike swoosh, the SPURS wordmark with the spur as the U, "1" cut off at the
  bottom. Behind him a soft crowd, warm faces, black arena. Light from above and front: highlight on the forehead and
  shoulders, the neck in shade. Credit "Frenchieinportland, CC BY 4.0" (plan.md).
- The creator's first post (`context/posts/18155407801470375.jpg`): photo in a rounded card, team logo bare top left,
  grey credit top right ~22 px, one huge white number across the bottom of the photo. This scene uses that card.
- `average`'s last frame (rendered 51.95 s): side-stands court at camera KC, 29 discs + 6 wedges on his spots, every
  one grey to 57.5 %; "29 + 0.44 × 6 = 31.64" and "31.64 × 2 × .575 ≈ 36" top left; League Average card bottom right.
- facts.md: TS% .790 = 50 / (2 × 31.64); league .575; 2 × 31.64 × .575 = 36.4; 50 − 36.4 = 13.6, said "14".
  So his own rate on the same discs is 31.64 × 2 × .790 = 50. Per chance he got 1.58, the league 1.15: 0.43 extra a
  disc, 0.19 a free throw wedge (0.44 × 0.43). 29 × 0.43 + 6 × 0.19 = 13.6.
- `wemby-shots-court.json` via the shared world (same spots and pile at the rim as `attempts` and `average`).

What would give it away as fake: a photo without its credit, a number not equal to 50 / 36 / 13.6, white above
79 % in any disc, a stack that is not made of what left the discs, a different court than the one just seen.

## Think

The real thing: the same discs he spent, now refilled to his own 79 % over the league's 57.5 %; the white band between
the two levels is the 14 points, and it is lifted off and gathered next to the man who scored them.

| Word | On screen |
|---|---|
| (lead) Wemby got | the court sinks to the bottom of the stage and dims a step; the equations and the League card leave; the Portland photo card rises big at the left (Spurs logo top left, credit top right); the "36" flies from the equation into the bottom of the card, big white like the first post |
| 50 (lands) | every disc pours white on top of its grey, 57.5 % → 79 %, in game order, fast, glinting; the card's number rolls 36 → 50, label "31.64 chances × 2 × .790" |
| 14 (lands) | the white bands lift off all the discs at once (35 thin white wafers rise), then stream up in curves to the right of the card, growing as they come, and stack into one white column of point layers; a counter climbs +0.0 → +13.6 as they land |
| extra points | the last wafers land by "points"; the counter rounds to "+14", label "50 − 36.4 = 13.6 extra points" |
| story (lands) | the stack settles with a small bounce; the card's label becomes "36 + 14", the 14 white; slow push in on the photo, a light passes over the card; holds |

Sound-off test: the man, his 50, and the same chances as before, gaining a white layer on top of the league's grey;
that layer alone lifts off and piles into +14 beside him. The extra is visibly made of the difference.

Hand-over in: from `average`'s KC camera and its two equation lines and League card (redrawn here, then leaving).
Hand-over out (for `where`): photo card left (x 60-540, y 548-1150), stack + "+14" right, the court sunk at the
bottom (camera FX_END), the discs grey to 57.5 % with no white.

## Built

Files: `FourteenExtra.tsx` (scene), `FourteenExtraWorld.ts`, `FourteenExtraFloor.tsx` (copies of `average`'s world and
court, ids renamed `fx-`), `FourteenExtraDisc.tsx` (the disc with a `top` level: his white poured over the league's
grey), `FourteenExtraWafer.tsx` (the lifted white band, and the stack with a line at every whole point).
Public: `fourteenextra-wemby-portland.jpg` (Commons, 1100 px), `fourteenextra-spurs.svg` (cdn.nba.com).

Camera: from `average`'s KC to KD (eye -58/30/50, at 0/10/0, F 1380, cx 700, cy 1300) in 40 f, then a slow push to KE.
Court masked from y ~1010, dimmed 22 %. Card x 60-540, y 548-1152; stack centred x 802, base y 1128, 190 px/ft.
Changed from the plan in build: the number on the card is the equation's own 36 flown in and rolled to 50
(31.64 × 2 × .790); a line ".575 → .790" sits right of the card while the discs refill; each refilling disc sends a
white ring so the pour reads at court scale; on "story" the card reads "36 league rate + 14 his own" and a white line
draws from it to the stack. Stills read 52.3-56.0 and a clip 52.0-56.3; `check.py render` ok (longest still 0.17 s,
no bare handover frame).

## Review (fresh eyes)

Stills every 0.3-0.4 s 51.95-56.3 and a 1/60 s burst 55.98-56.23. Fixed in review: KE now equals the camera `where`
starts from (eye -59/30/49, at -3/14/0, F 1165, cx 560, cy 1344) and the court's foot mask eases to `where`'s
1436-1468, so the handover shows one court; our court stops drawing once `where` is mounted (scene.to - LEAD), so the
lift-off no longer carries a second court. The "1 point" side label sat on the backboard and was unreadable: removed;
the counter's label reads "one layer = 1 point" while the wafers land.
