# ClankSideOn (`clank`, ~32.95-36.3 s)

"Make one of two, and that's one point instead of an easy dunk."

## What I looked at

- `photos/commons-shaq-dunk-suns-2009-keithallison-ccbysa2.jpg` (1662 x 2097, full size): Shaq from the front, chest
  up, both hands hooked over an orange ring, the white cord net bunched in his right fist, sweat on the scalp, the
  grey Suns side panel and "PHOENIX 32" in white with orange piping, the game ball entering at the right edge, the
  board's dark underside across the top. Ring at photo y ~130, hands spread ~610 px apart: about the ring's 18 in,
  so the photo is ~368 px per foot. Cut out by a hand-traced path (no rembg here), ball and background removed,
  turned grey, faded out below the chest: `public/shaq-free-throws/clanksideon-dunk-ghost.png`.
- The reel's own world (`PictureCourtWorld.ts`, `PictureCourtFloor.tsx`, `PictureCourtArena.tsx`) and the last
  still of `picture` (`stills/t_032.80.png`): Shaq (the Lakers 2000 Finals cut-out, facing screen right, ball at his
  left hip) on the line under a spotlight, the house dark, the 15 ft measure still on the boards.
- `pages/nba-rule1-section1.md`: ring 10 ft, 18 in inside, inside edge 6 in from the board, board face 15 ft from the
  line; the ball 9.4 in (29.5 in round). Side-on at 55.8 px per foot the ball is 44 px and the ring 84 px: the
  ball barely fits twice, which is the point of drawing it true.
- How a real miss off the front rim moves: it hits the front iron just past the top of the ball, kicks back toward
  the shooter and up, and the rim shivers. A breakaway rim drops ~30 degrees at the front under a dunk and springs
  back in well under half a second.

## Think

- Real thing: the same court and the same Shaq, seen from the sideline at true scale: line, ring, board, ball.
- Details: the line as a paint strip receding into depth, the board as glass seen edge-on with its white border, the
  bracket and the stanchion arm, the net's diamond cords stretching on the swish, backspin on the ball, a strobe of
  the ball's flight (as sports photographers shoot a shot), the far bowl dark behind with a few flashes.
- Word, then change:
  - Make: the camera swings from behind him to the sideline (one move, ~0.4 s); he dips and lifts the ball.
  - one (lands): first ball swishes, the net stretches and ripples, a white "+1" pops above the ring.
  - of two, (lands on "two"): the second ball hits the front iron, clanks back out, a foul red X marks the contact,
    the rim shivers; the ball bounces away on the boards.
  - and that's: the two strobe arcs gather into a small ledger card above him: one white make, one red X.
  - one (lands): the "+1" lifts from the rim and sits in a score box.
  - instead of an easy: a grey ghost of the real dunk photo rises under the rim.
  - dunk. (lands): the ghost slams, the rim bends down and snaps back, a grey ghost ball drops through, a grey
    "+2" box pops beside the white "+1".
- Sound-off test: a big man shoots two free throws at true scale, one in, one off the rim; one point. Then his own
  dunk, in grey, takes two. The gap between the boxes is the trick.

## Built and checked

- Files: scenes/ClankSideOn.tsx (camera, shots, ghost, marks, boxes), scenes/ClankSideOnBasket.tsx (the basket in two
  layers, net kick, clank rattle, breakaway bend); public/shaq-free-throws/clanksideon-dunk-ghost.png. Reads
  PictureCourtWorld / PictureCourtFloor / PictureCourtArena (not edited).
- Camera: PICTURE_COURT_END_CAM -> sideline (yaw -90, camera 5.45 ft up, 55.8 px/ft) over in..one, then a slow push.
- Cues: release at in+8 and swish on one+4 (white +1 over the ring, net stretch, arena flashes); miss on two+1 (red
  X, white streaks, ring rattles, ball bounces back to the line); gather on "and"; +1 lands in "AT THE LINE" on
  "point"; ghost rises over instead..easy; slam on dunk (bend 0.45 ft, spring back, grey ball through, "THE DUNK +2").
- Richer pass: lower camera so the shot reads side-on, strobe of each flight, ball shadows on the boards, clank
  streaks, net hooks, glass edge, bracket tilting with the bend.
- Stills 32.87-36.15 (14) read at full size; render 32.7-36.5 through check.py render: no hold, 0 bare frames into
  clank and clown. Render needs `--public-only nba-floor`.

## Review round 1 (fresh-eyes notes applied)

- He shoots now. Looked again at `commons-shaq-free-throw-suns-2009` (front-on set: ball on the fingers, elbow under it)
  and `commons-shaq-free-throw-heat-2005` (side-on, knees soft, ball low before the lift). The front-on arms would not
  sit on the side-on Lakers figure, so the Lakers cut-out's own near arm is cut out (`notes/ClankSideOn.cut.py`: skin
  mask inside a traced polygon) into an upper arm and a forearm+hand, and the jersey is filled behind it
  (`clanksideon-shaq-body|upperarm|forearm.png`). The arm turns at the shoulder and elbow: rest (hand on hip, the
  same pixels as `picture`, so the handover is untouched) -> set (elbow under the ball, ball on the fingers in front of
  his face) -> release (arm up and out) -> follow-through (wrist snapped), with the knee dip into each set. The ball
  leaves his fingers: the world arc starts from the fingertips and the gap closes over the first part of the flight.
  The second ball comes back to his fingers right after the first leaves; he sets and shoots again on "one"; holds the
  follow-through while the miss rattles out; the hand goes back to the hip on "and".
- One shot, then the next: the make's strobe is every 6 f and is gone before the second release; the made ball falls
  through and fades within 13 f; the miss keeps its strobe (every 5 f) until the box.
- The LED ribbon (PictureCourtArena, not mine) is clipped out of the arena inside this scene only (same geometry,
  evenodd clip path), and the gap darkened 13% to the house shade.
- Framing: sideline camera F 1330, cx 588, cy 1320, push 3%: Shaq stands at x ~150-260 with room for his arm, the
  whole board stays in frame, the floor under him is ~370 px instead of ~650.
- Ghost dunk: anchored at the ring's centre with the photo point (1180, 175) (mid-fist height, between the left fist
  and the netted right hand), so his left fist lands on the front iron and rides it down with the bend.
- Checked: stills 32.85-36.25 (21) at full size and as sheets; 60 fps bursts across the first release (32.92-33.12)
  and the second (33.26-33.46); render 32.7-36.5 through check.py render: ok, 0 bare frames into clank and clown.
