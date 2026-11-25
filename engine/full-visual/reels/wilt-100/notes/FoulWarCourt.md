# FoulWarCourt (`fouls`, 37.14-44.02 s)

"Then it got silly. The Knicks started fouling the other Warriors just to keep the ball away from him, and the
Warriors fouled right back to get it again."

## What I saw (references at full size)

- `photos/commons-hershey-sports-arena-1938-interior-pd.jpg`: the floor of Hershey Sports Arena is the hockey rink:
  a long rounded-corner oval of boards with a low rail, the seats rising right behind them. A basketball floor of
  that era is laid inside the rink on the concrete/ice cover, so beyond the court's own lines there is a margin of
  dark floor and then the curved rink boards. Light comes from big round lamps hung under the vault: soft hot pools
  on the floor, not even light.
- `photos/wilt-100-paper-photo-1962-original.jpg`: the PHILA jersey of that night: white with dark arched block
  letters, a dark double piping at the neck and arm holes; #13 under PHILA. Dark ink on white is how the Warriors
  read in every period photo.
- `photos/commons-wilt-1962-pd.jpeg`: same cut of jersey (the SF one, not used), the trim stripes at the waist and
  neck; long socks; it confirms the white home-style kit and dark numerals with a light outline.
- `objects/commons-metal-pea-whistle-reference-only.jpg` (Commons "Metal whistle.jpg", fetched for drawing only,
  licence not verified because Commons' API answered 429; the photo is never shown): a nickel-chrome pea whistle
  seen from the side: a flat rectangular mouthpiece tube, the sound window cut on top where the tube meets the
  barrel (a sharp lip), a round barrel whose side face is a darker flat disc with a polished rim, a small ring
  soldered at the back and a braided lanyard through it. Chrome reads by its hard white streaks and a dark
  reflection band, not by grey.
- `pages/box-196203020-clean.json` (Basketball-Reference box): team personal fouls PHW 25, NYK 32. Officials
  Willie Smith and Pete D'Ambrosio (two referees: two striped discs on the floor). Guy Rodgers 9 of 12 FT, the
  guard the Knicks would foul; names are not put on stage (not in facts.md as such).
- `facts.md` line 10: "the Knicks began fouling other players to keep the ball away from Chamberlain ... The
  Warriors countered by committing fouls of their own".
- 1962 court geometry (plan.md): 94 x 50 ft, 12 ft lane, 6 ft free throw circle (the half inside the lane dashed),
  free throw line 15 ft from the backboard (19 ft from the baseline), backboard 4 ft in, rim 18 in across, no three
  point line, centre circle 6 ft radius. Maple boards 2 1/4 in wide running the length of the court, butt joints
  staggered, varnish that picks up each lamp as a soft glare.

What would give a fake away: a modern court (three point arc, wide lane), plain circles with no jersey, a cartoon
whistle, a flat tan rectangle for wood, tallies typed instead of pencilled, numbers that do not match the box.

## The thinking

- The real thing: the Hershey floor that night seen straight down from the vault, the half at Wilt's basket, with
  ten jerseys and the two striped officials, and the scorer's foul tally in pencil on the cream sheet under it (the
  HAND scale paper of the reel). The ref's whistle is the sound of the scene, drawn from the photo.
- Parts and sources: court geometry (plan), maple strips and lamp glare (1938 interior), rink boards in the margin
  (1938 interior), jerseys (100 photo: white, dark ink, double piping; Knicks navy with orange trim, plan), whistle
  (metal whistle photo), totals (box score), stands of amber witnesses at the very start (same as `crowd`).
- Details a viewer would only miss if gone: board seams and butt joints; the dashed half of the free throw circle;
  the backboard's stanchion behind the baseline; the rim's net seen from above; a soft shadow under each player and
  the ball; the ball's panel seams; heads on the jerseys facing where they play; the ref's arm going up with each
  whistle; pencil tallies in groups of five with the fifth stroke across; the PHILA lettering and the Knicks mark
  as the row labels.
- Word, then change:
  - Then it got: the camera drops from the stands (the amber dots of `crowd` rising behind the baseline) and swings
    to straight down over the court; ten jerseys at their places, the ball with a Warriors guard.
  - silly (lands): the whistle swings in big at the right, blows (breath lines out of its window, the pea rattles),
    the near ref's arm shoots up; a Knicks jersey steps in tight on the guard.
  - The Knicks started: the ball goes guard to guard; #13 posts up in the keyhole.
  - fouling (lands): the Knicks jersey crashes into the guard who has the ball; the whistle (now docked, small,
    at the right) shrills; tick 1 in the KNICKS row.
  - other (lands): a white hairline loop draws round the fouled guard, "not Wilt" beside it.
  - Warriors: the guard walks to the free throw line; one free throw in.
  - just to keep the ball: the Warriors bring it back up; a guard looks inside to #13.
  - away (lands): the pass starts at #13 and bends round him to a wing, who is hit at once (tick 2); the old
    passes appear as faint bent trails, all curving round #13, and ticks rattle in.
  - from him: #13 raises an arm (a short line), ignored; one more bent pass.
  - and the Warriors: the ball is the Knicks' now, inbounded at the baseline; the white jerseys close on the
    ball handler.
  - fouled right: whistle, the ref's arm, tick 1 in the WARRIORS row.
  - back (lands): the ball flies straight back to the Warriors guard.
  - again (ends on): the guard's pass goes dead straight to #13, he catches it and the tallies, which ran from
    "back", land on the box totals: KNICKS 32, WARRIORS 25. Then he turns and drops it in (the hold keeps living).
- Sound-off test: a stranger sees a whistle and a pile of fouls on everyone but #13, the ball always curving round
  him, then the other team fouling back and the ball going straight to him, with two pencil tallies running up.
  "Both teams were fouling on purpose, all about #13."

## Built and checked

- Compared at full size against the 100 photo (jersey piping and dark ink), the 1938 interior (lamp pools, rink),
  the whistle photo (chrome streaks, window, barrel face, ring, braided cord). First pass read as "eyeballs"
  (white disc + off-centre head with a lighter rim); redrawn as real top-down bodies: wide thin shoulders, bare arm
  caps, hair crown with ears. Court lines changed to the cream-white and 7/8/11/14 ft lane marks the `crowd` and
  `freethrows` floors use, so it is one floor.
- Video of 36.6-44.3 s: no frame-to-frame still run longer than one frame; handover in from `quarters` lands on the
  stands of amber dots, out to `freethrows` from straight above.
- Rendering needs `--full-public` at the moment: a module of the `nba-floor` reel loads a font from its own public
  folder at import, which 404s in a wilt-100-only bundle.

## Review (fresh eyes)

- Fixed: the handover out to `freethrows` was a hard snap (players, sheet and whistle gone in one frame, court jumping
  scale). The camera now settles onto freethrows' K0 from "again" + 4 f, and the people, ball, trails, labels, sheet
  and whistle clear over the last 10 visible frames (`fwcClear`, `T.outCam`, `T.out`). Court lines meet freethrows'
  first frame exactly.
- Fixed: while the camera was still low, the drawn-from-above bodies floated above dark shadow blobs; bodies now sit
  on their shadows until the camera is overhead.

## Second pass (review notes A-D)

- A, the way in from `quarters`: our first frame is now quarters' last picture. `fwcCam` starts on quarters' own camera
  (`qsCam`, converted from its metres to our feet; Wilt's basket is its far basket under the scoreboard), and
  `FoulWarCourtArrival.tsx` keeps quarters' arena and board drawn from our moving camera (its exported Arena, Board
  and kit only, no quarters file changed). The lens climbs and tips to straight down, and the arena thins out between
  20% and 65% of the drop. Our floor and the ten jerseys come through underneath, on the same court lines. Our own dot
  stands are off when quarters hands over. Checked 36.80 against 36.82: same pixels. Checked 36.95 to 37.30 at short
  intervals: one continuous crane.
- B, the way out: the floor past 60 ft goes dark and the foot band moves to freethrows' own band (top 1440) as the
  camera settles. The lamp's hot oval slides off too. Sidelines, apron edge, midcourt and the floor's bottom edge now
  meet freethrows' first frame. What still differs is the wood's tone (freethrows is a little more orange) and where
  its glare sits; that is freethrows' to match.
- C, the payoff: the drop-in now runs from "again" + 2 to "again" + 11, and the ball is through the net by 43.60 s.
  The ball clears last, over the final 4 frames.
- D, the whistle on "silly" swings in over the empty floor at the lower right (800, 1310). It is clear of the lane,
  the basket and every jersey, and still docks top right.
