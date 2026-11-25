# PictureCourt (`picture`, 23.86-32.82 s)

"So picture it. Shaq catches the ball under the basket, and before he can even turn, somebody grabs him. Now he's
standing alone at the line, fifteen feet out, the whole arena watching."

## What I looked at

- `photos/commons-shaq-2000-finals-bigmoe797-ccbysa4.jpg` (960 x 2461) and its cut-out
  `public/shaq-free-throws/splitrimcoin-shaq-lakers.png` (719 x 2327, the same pixels; copied as
  `picturecourt-shaq-lakers.png`). Shaq in Lakers purple #34, seen from behind his left shoulder, head turned to
  screen right, "O'NEAL" and 34 on the back, gold side panel on the shorts with white piping, black socks, black
  "DUNK" shoes with purple soles. His left arm hangs bent, the hand on the hip. Measured on the cut-out: elbow
  ~(400, 820), wrist ~(570, 1030), mid forearm ~(490, 930), forearm ~90 px wide and running 39 deg off vertical;
  ~330 px per foot (head to sole ~7.1 ft). Light from the upper left (arena), sweat sheen on the shoulder. Never
  mirrored (the letters would flip): he faces screen right, so the pass comes from that wing.
- `diagrams/commons-nba-field-diagram-en-snater-ccbysa4.png` and `pages/nba-rule1-section1.md`: lane 16 ft, line
  15 ft from the board face, circle r 6 (half solid toward half court, half dashed inside the lane), restricted arc
  r 4, ring 10 ft, board 6 x 3.5 ft, 9.5 to 13 ft up, shooter's square 24 x 18 in, lane space marks, 3 pt line
  22 ft in the corners, 23'9" arc.
- `photos/commons-capital-one-arena-playoffs-2017-daniellobo-cc0.jpg`: a full NBA bowl from the upper deck. Two
  bowls of tiers, packed people as tiny specks (mostly dark clothes, white, team colours, skin), a lit LED ribbon
  between the bowls, aisles, the court the only bright thing in a dark room. That is the arena here: ~7,000
  spectators as points in the world, rows 2.75 ft deep and 1.25 ft higher each, a gold/purple ribbon.
- `photos/crop-referee-1976-russreed-pd.png`: the NBA referee's grey shirt with black ringer cuffs (not stripes);
  the referee's fist is the reel's existing `BackwardsScorebugArm` (same arm, same world).
- `photos/commons-msg-court-2005-ganley894-pd.jpg` and the 2000 Finals photo for the floor: honey maple strips
  with butt joints, gloss, scuffs; the lane solid gold with its own gloss.
- A real 2000-era defender hand: dark skin, a white terry wristband (every NBA arm then), knuckle ridges, nails,
  fingers creased at each joint, the thumb hooked under the forearm.
- `../nba-floor/scenes/FiftyFeetWide*` for how this folder draws a floor through a camera (maple strips, paint as
  bands, a 3D basket with real parallax).

## Think

- The real thing: the Lakers half court at Rule 1 geometry (diagram + rulebook), the real Lakers cut-out, the real
  ball (Reisio photo), a bowl from the Capital One photo, the referee arm from the 1976 photo.
- Details that make it real: maple strips and joints, gold lane with purple hairline seams and pale scuffs, the
  dashed half of the circle, lane space marks and the block, the board's white border and square, the bracket, the
  diamond net, padded stanchion in Lakers purple, a contact shadow under his shoes, the wristband's terry ribs.
- Word, then change:
  - So: the percent card's navy falls flat and becomes the slab (camera from straight above, card edge hairline).
  - picture (lands): the paint goes down line by line, the maple fills the card, the lower bowl rises in tiers.
  - it.: camera pushes toward the lane.
  - Shaq: the cut-out blurs in, low in the lane, in the post.
  - catches (lands): the pass from the right wing (in the air 15 frames) slaps into his hands; a white trail on the
    boards fades.
  - basket (lands): camera tightens on the paint, the ring above him; the restricted arc glows white, the net kicks.
  - and before he can even: he starts to pivot (the cut-out turns its shoulders).
  - turn (lands): the pivot freezes half way.
  - somebody: camera punches in to the forearm (the HANDS scale); a defender's arm reaches in from his right.
  - grabs (lands): the fingers close over his forearm, foul red blooms under every fingertip, the frame jolts.
  - him.: the referee's fist pops up at the left edge.
  - Now he's standing: camera swings behind the free throw line, he walks to it, the arm and fist leave.
  - alone (lands): the floor dims, the line and lane edges stay white.
  - line (lands): the line glows under his toes.
  - fifteen (lands): a white measure runs on the boards from the line to the board plane, ticks every foot,
    counting 0 -> 15 ft, "to the backboard", "NBA Rule 1".
  - the whole: the upper bowl rises behind the glass.
  - arena (lands): the house goes dark, one spotlight cone drops on him, dust in the beam.
  - watching. (ends on): 2000-era camera flashes twinkle in the dark stands; slow push in; hold.
- Sound-off test: a court is drawn, a big man gets the ball in the post, a hand grabs his arm red, the ref's fist,
  then he stands alone at the line in a dark arena with a spotlight, 15 ft from the board. A stranger reads "they
  fouled him on purpose and sent him to the line".

## Handover to `clank`

`PictureCourt.keep = true`. `clank` starts on `PICTURE_COURT_END_CAM` with Shaq's feet at
`PICTURE_COURT_LINE_SPOT` (both exported from `scenes/PictureCourtWorld.ts`, with `pcProjector`), the floor dimmed,
the house dark and the spotlight on him. Cut-out: `picturecourt-shaq-lakers.png`.

## Built and checked

- Files: scenes/PictureCourt.tsx, PictureCourtWorld.ts (camera, clipping, bowl), PictureCourtFloor.tsx (floor,
  paint, basket), PictureCourtArena.tsx (bowl, ribbon, flashes), PictureCourtGrab.tsx (defender arm and hand);
  public/shaq-free-throws/picturecourt-shaq-lakers.png, picturecourt-ball.png. Imports `BackwardsScorebugArm`
  (read only).
- Render needs `--public-only nba-floor` (see BackwardsScorebug notes).
- Stills checked (final): 23.6, 23.9, 24.25, 25.15, 25.9, 27.0, 27.9, 28.4, 28.7, 29.5, 30.25, 30.9, 31.6, 32.2,
  32.55, 32.8; earlier passes every ~0.4 s across the scene.
- Richer pass: the camera punches in to the forearm on "somebody" (the HANDS scale) so the grab reads; foul red
  crescents at every fingertip and the heel of the hand; the defender arm tapered with flexor bulge, veins, hair and
  a terry wristband; crowd as people (shirt and head) with a soft focus, a gold/purple LED ribbon; spotlight dust;
  restricted arc glows and the net kicks on "basket"; a white pass trail on the boards.
- check.py render on 23.4-33.1: longest still stretch 0.27 s. The handover out of `picture` shows bare ground only
  because `clank` (ClankSideOn) is still a stub: with keep = true, clank must draw from its first frame, starting on
  PICTURE_COURT_END_CAM.

## Review pass (fresh-eyes notes applied)

- grabs: the defender is now a body. Hand, then a 1 ft forearm (400 units at ~412 per foot in the hand frame), a
  bent elbow (olecranon underneath, crease on top), a 1.35 ft upper arm rising to the shoulder, the deltoid and a
  slice of a green road jersey (armhole piping, mesh, folds, shorts below) cut by the right edge. Skin: lit top edge
  from the upper left, dark underside, flexor bulge, triceps shade, sweat sheen like Shaq's own shoulder, a grain,
  a 1.4 px softness to sit in the photo's focus. The defender is counter-scaled against Shaq's pivot squeeze.
  Foul red: the marks pop past full size on "grabs" (7 frames), a red glow on his forearm and a red/white shock
  ring running out from the grip.
- catches: the camera reaches a tight catch framing (Shaq ~690 px tall) on "catches", then eases back on "under the
  basket" until the ring sits above him. The pass comes from off the right edge, bigger, with a blurred streak.
- turn: he leans 6 deg onto the pivot foot with a 15% shoulder squeeze, two motion ghosts while he moves, a chalk
  pivot arrow draws around his feet and lands its head on "turn"; a small camera hit freezes it.
- crowd: rebuilt from the Capital One photo: shoulders and heads of every size, overlapping, jittered off the grid,
  mostly dark clothes, three focus levels (nearer = softer), 72% light; the LED ribbon carries the colour.
- referee fist: smaller (0.4), cropped by the left edge, toned down; the credit fades while it is up.
- arena: a mask darkens the whole house except the spotlight pool and the free throw line; flashes are drawn above
  the darkness, smaller and more of them. Credit moved to the left edge at y 1452, clear of the measure.
- Stills checked: 23.9, 24.25, 24.7, 24.95, 25.4, 25.9, 26.5, 26.9, 27.35, 27.7, 28.1, 28.35, 28.6, 28.85, 29.5,
  30.25, 30.9, 31.3, 31.6, 32.2, 32.5, 32.8. check.py render on 23.4-32.9: longest still 0.27 s, 0 bare frames
  into picture and into clank.
