# CloseTrophies (`close`, 75.46-88.18 s, hold to 88.82)

"And Shaq? He still won four championships and three Finals MVPs. So yes, teams fouled him on purpose, because it
was the only way to slow him down. Follow for the next wild NBA story, and send this to the friend who can't hit a
free throw either."

## What I looked at

- `photos/commons-shaq-2000-finals-bigmoe797-ccbysa4.jpg` (960 x 2461, full size): Shaq seen from behind his left
  shoulder, Lakers purple road #34 with "O'NEAL" arched over the number in white with gold outline, gold collar,
  sweat sheen on the shoulder and triceps, left hand on hip, right hand hanging; gold side panel on the shorts with
  white piping; black "DUNK" shoes with purple soles; the gold painted lane with a navy line; a crowd courtside, a
  teammate in purple behind him. Cropped head to knees (0..1480) for the big card: `closetrophies-finals.jpg`.
- `photos/commons-larry-obrien-trophy-2016-erikdrost-ccby2.jpg` cropped at 1200..1560 x 180..920 and read at 1.5x:
  the real Larry O'Brien Trophy. A mirror-polished gold ball whose engraved channels read as thin double lines (one
  near-vertical meridian, two curved side channels, one band around); the ball reflects the room (a bright ceiling
  spot top right, a dark horizon band through the middle, warm floor below). A short stem with two collars. A
  tapering vase, wider at the top (vase top ~0.9 of the ball's width, bottom ~0.75), its rim a thin lip with
  twelve small rectangular hooks; from the hooks a net is engraved: cords crossing into three rows of diamonds, a
  small knot at every crossing, the diamonds narrowing downward exactly like a real net. A darker band at the foot,
  then a square gold plinth with a bevelled top. Proportions: ball ~0.39 of the height, vase ~0.47, plinth ~0.07.
  Light: hard specular bands down the vase (two bright verticals, a dark core where it reflects the dark room).
- Shaq's Basketball-Reference page (`sources/bbref-shaq.html`), the honours row `#bling`: "4x NBA Champ" and
  "3x Finals MVP" as rounded tags, background #8f5400, white type, Helvetica Neue ~12 px, radius 5 px. Redrawn at
  scale, with "Basketball-Reference" as the source line.
- The reel's own court world (`PictureCourtWorld.ts`, `PictureCourtFloor.tsx`, `PictureCourtArena.tsx`,
  `PictureCourtGrab.tsx`) and the end still of `picture` (`stills/t_032.50.png`): Shaq on the line behind the
  shooter, house dark, one spotlight cone with dust. The close comes back to exactly this camera and cut-out.
- `nba-floor/scenes/CornerWatchCard.tsx` and the real avatar: the Reels follow row (white outline button,
  "Follow" -> "Following").
- The quarter (`splitrimcoin-quarter-heads.png`, US Mint proof): the coin from `split`.

## Think

- Real things: the 2000 Finals photo; four Larry O'Brien trophies redrawn from the real one; the real
  Basketball-Reference tags; the same court, the same cut-out, the same grab hand, the same spotlight; the real
  follow row; the real quarter.
- Details that make it real: the engraved net with knots and hooks; the room reflected in the ball; the stem
  collars; a mirrored reflection of each trophy in the shelf; a Lakers or Heat logo beside each year (2000, 2001,
  2002 Lakers; 2006 Heat); engraved plates sliding onto the three Finals MVP plinths; the shelf jolting as each
  trophy lands.
- Word, then change:
  - And: the photo card rises big from below, blur in.
  - Shaq? (lands): the card settles with a small pop, slow push in on the photo.
  - He still won: the card shrinks to the top centre; a shelf draws across under it.
  - four (lands): the first trophy drops onto the shelf with weight, then 2001, 2002, 2006, 7 f apart; each year
    and logo blur in on its landing.
  - championships: the "4x NBA Champ" tag pops; light runs across the four.
  - three (lands): the "3x Finals MVP" tag drops in beside it; plates slide onto the 2000, 2001, 2002 plinths.
  - MVPs.: light runs over the three plates.
  - So yes, teams: the trophy room shrinks into the top right corner and stays there small; the court rises in and
    the camera lands on the hook's frame, Shaq on the line behind the shooter.
  - fouled / on purpose (lands): the grab hand reaches in and clamps his forearm, foul red blooms.
  - only: the hand strains (shakes), Shaq does not move.
  - way: the grip slips down his arm, fingers opening.
  - slow (lands): the hand falls away; Shaq steps forward, the floor shakes.
  - him down.: the spotlight drops back on him, slow push in.
  - Follow (lands): the follow row rises under him. next: the button presses. story (lands): "Following".
  - send: the ball lifts out of his hands into the set point over his head.
  - who: release; the ball arcs toward the rim at the top of the stage.
  - either. (lands): clank off the front rim, foul red contact ring, the net shivers, the ball bounces back out
    onto the boards; the quarter drops onto the line and spins.
- Sound-off test: a man in front of his four trophies; then the same man on the line, a hand that cannot hold him,
  and a free throw that clanks anyway. Strong and terrible at once, which is the story.
- Compromise, on purpose: the quarter is drawn about six times its real size so it reads at this distance (at true
  size it would be 8 px); it is the reel's coin-flip callback, not a measurement.
