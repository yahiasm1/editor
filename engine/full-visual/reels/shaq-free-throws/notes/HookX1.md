# HookX1 (`hook`, variant 1 of 2, `shaq-free-throws-h1`): "the yank, rim to line"

"Shaquille O'Neal was so unstoppable that teams started fouling him on purpose."

## What I looked at

- `photos/commons-shaq-dunk-suns-2009-keithallison-ccbysa2.jpg` (Keith Allison, CC BY-SA 2.0): Shaq hanging on the
  ring for Phoenix, purple #32 PHOENIX road jersey with orange piping and grey side panels, sweat on the brow, both
  arms straight up, right hand wrapped round the orange ring with the white nylon net over his wrist, left hand on the
  board's bottom edge. Shot from the baseline under the board, so he faces the lens. Upper body only, waist down out
  of frame. Arena light from above: bright on the scalp and the forearms, the chest in the jersey's shadow.
- `photos/commons-shaq-2000-finals-bigmoe797-ccbysa4.jpg` (Bigmoe797, CC BY-SA 4.0): 2000 Finals, Lakers purple road
  #34, O'NEAL across the shoulders, seen from behind his left side, left hand on the hip behind him (the elbow
  sticking out to the left: the arm a hand can grab), right arm hanging, black DUNK shoes, standing on the gold paint.
- `photos/commons-human-hands-front-back-evanamos-ccbysa3.jpg`: the back of a right hand, knuckles, tendons, nails:
  the defender's grabbing hand (turned so it comes in from the left, thumb on top).
- `logos/` (cdn.nba.com primaries, bare): Mavericks (Nelson started it), Spurs (Popovich), Kings, Blazers and Pacers
  (fetched today: the 2000-2002 playoff teams that fouled him). No SuperSonics on cdn.nba.com.
- Court geometry: `plan.md` coordinates (ring 10 ft, 0.75 ft radius, board face y -1.25, board 6 x 3.5 ft, lane 16 ft,
  free throw line 15 ft from the board face). The behind-the-shooter court is drawn like `BackwardsScorebugCourt`
  (same maple, gold lane, stands, LED board) so that the last frame of the hook is the first frame of `backwards`.

## Word table (word starts from words.json, frames = (t - 0.08 s) x 60)

| word | t | real thing | verb done to the hero |
|---|---|---|---|
| Shaquille O'Neal | 0.12-0.84 | the real Suns dunk photo, cut out, at the rim | he is already rising into the dunk |
| so unstoppable | 1.30-2.18 | the same, hanging on the ring | he hammers it: ring bends 6 deg, board flexes, net snaps, ball through, dust off the boards, 3-frame shake |
| teams | 2.60 | five real logos (Mavericks, Spurs, Kings, Blazers, Pacers) | they close in from the edges and bounce off his shoulders like pins, spinning out |
| fouling | 3.20 | a real hand (Evan-Amos photo) on his arm, FOUL RED contact marks | it clamps and YANKS: 22-frame whip, camera and Shaq dragged 15 ft back down the lane; the dunk cut-out swaps for the standing Lakers cut-out on a blur frame, feet thud on the line |
| on purpose | 3.88-4.46 | the whistle (red blast rings) and the FOUL tag | the whistle blasts by his head; the tag stamps on the arm, 4 px overshoot |
| (silence) | 4.46-4.87 | | payoff holds; then the hand drags him out of the left of the frame while the camera settles on the `backwards` court |

## Handover

`backwards` mounts at frame 288 with its own court (no Shaq) drawn over the whole stage, starting at dy -70, blur 1,
brightness 0.95. So the hook's last frame (287) must be that court, empty: in the silence the hand drags Shaq out of
frame left (a second tug, the joke continuing) while my camera eases onto the backwards camera exactly. keep = true.

## Sound-off test

A huge real Shaq dunk; every team logo bounces off him; a hand grabs his arm and pulls him all the way from the rim
to the free throw line; whistle; FOUL. A stranger reads: he can't be stopped near the rim, so they grab him and send
him to the line.

## Notes

- The dunk photo faces the lens (baseline camera); on the behind-the-shooter court it reads as the dunk; no other
  Commons dunk photo of him exists in colour at this size.

## Built and checked

- Files: `scenes/HookX1.tsx` (cameras, Shaq, logos, hand, whistle, tag, hand-over), `scenes/HookX1Court.tsx` (the projected
  court with a moving camera: ring bend, board flex, net, streaks, contact shadow; its end camera is the backwards
  camera). Assets: `public/shaq-free-throws/hookx1-*` (colour dunk cut-out with and without the photo's net, the
  standing Lakers cut-out, the hand cut-out, five cdn.nba.com logos, the ball). New refs: `logos/nba-kings|blazers|pacers-primary.svg`.
- At the rim the photo's own net hangs from his fist; the drawn net fades in as the yank starts (the cut-out swaps to
  the no-net version on the blur frame), so the net never travels with him.
- Stills read every ~0.25 s over 0-4.8 s; handover frame 287 vs backwards frame 288: mean stage diff 0.6/765, 0 pixels
  over 60. `check.py render` on a 0-5.6 s clip: longest still 0.07 s, handover into backwards 0 bare frames.
- Known limits: the dunk photo was shot from the baseline (he faces the lens) on a behind-the-shooter court; the
  hand is drawn about 2x real size at the line so it reads.
