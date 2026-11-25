# BackwardsScorebug (`backwards`, 5.34-8.92 s)

"Sounds backwards, right? A foul usually hands the other team free points."

## What I looked at

- `photos/commons-rick-barry-1976-russreed-pd.jpg`, cropped to the referee (`photos/crop-referee-1976-russreed-pd.png`).
  The NBA referee shirt is NOT striped: a light grey crew-neck shirt, a black ribbed ringer collar, a black ribbed
  band about 1 in deep at the end of each short sleeve, the NBA logoman patch on the left chest, black trousers, a
  whistle on a lanyard in his mouth. The sleeve ends a hand above the elbow, loose, with soft vertical folds. Light
  from above (arena lights): the top of the arm bright, the underside in shadow. NBA referees wore grey with black
  trim, not the black and white stripes of college and football; a quick search agrees ("NBA refs were wearing gray
  long before"). So the sleeve is drawn grey with the black ringer cuff, as in the photo, not striped.
- The NBA foul signal is a closed fist raised straight up (it stops the clock). Fist seen from the front: four
  curled fingers as four stacked rounded pads, the knuckle ridge on top, the thumb folded across the index and middle
  fingers, a crease at each finger joint, a lighter tone on the knuckles.
- `pages/bbref-pbp-2000-12-08-sea-at-lal.html`, the trip the scoreboard shows: 0:48.9 "Offensive rebound by
  S. O'Neal" (57-52), 0:47.7 "Shooting foul by R. Lewis" (57-52), then "S. O'Neal misses free throw 1 of 2", "2 of 2".
  Seattle (visitor) 57, Lakers 52, 2nd quarter. So: the clock runs down from 0:49.6 and stops dead at 0:47.7 on
  "foul" (the whistle stops the clock: a real mechanism), the strip under SEA reads SHOOTING FOUL / R. LEWIS, and
  the strip under LAL reads 2 FREE THROWS. A BONUS light would claim a team-foul state the page does not give
  (it was a shooting foul), so there is no BONUS light. No shot clock (its value is not in any source).
- `photos/commons-basketball-reisio-pd.png`: the real ball, pebbled leather, black channels; used as the two balls
  (`public/shaq-free-throws/backwards-ball.png`).
- Broadcast bugs of the era (from memory, no image allowed to imitate): one dark bar, team boxes in team colour with
  the three-letter abbreviation, big white tabular score, a period and a clock box, a thin info strip under the bar
  that slides out for fouls and free throws. No network name, no logo.
- Team colours: Lakers purple #552583, gold #FDB927; Sonics green #00653A and gold #FFC200 as the plan sets them for
  the box score (kept the same so the reel is one world).
- Court behind (one world): the plan's coordinates and the behind-the-shooter camera (6 ft up, 8 ft behind the line),
  projected for real: rim at y 942, free throw line at y 1344, gold lane, maple, out of focus and dimmed.

## Think

- The real thing: the in-game scoreboard bug of that night at Shaq's first trip to the line (pbp), over the Lakers'
  lane from the shooter's seat (court maths from plan.md), a real NBA referee's arm (1976 photo) and real balls.
- Details that make it real: the clock tenths ticking then freezing on the whistle; tabular numerals; gloss and a
  bevel on the bar; the team colour gradient; the strip that slides out of the bar's underside; the cuff's knit
  ribs; the knuckle creases; the ball pebbling; the board, rim and net behind; light points of the stands.
- Word, then change:
  - (in, 286-312) the court is already there; the bug drops in big and centred, clock running.
  - Sounds: a light sweep crosses the bar; clock keeps running.
  - backwards, (lands): the bug flips over once on its horizontal axis, its back (navy panel) passing the camera.
  - right? : the flip settles with a small overshoot.
  - A foul (lands): the referee's fist punches up from below, the clock freezes at 0:47.7, the strip under SEA
    slides out in foul red, SHOOTING FOUL / R. LEWIS.
  - usually hands: the strip under LAL slides out, 2 FREE THROWS; LAL's box comes forward, the rest dims.
  - the other team: ball one leaves the free throw line behind and arcs into LAL's box.
  - free (lands): ball two lands; two white +1 tags stand over LAL's box; a ghost score (outlined) rolls 53.
  - points. (ends on): the ghost lands on 54 while the real 52 never moves.
- Sound-off test: a real game scoreboard; it flips (something is reversed); a referee calls a foul and the clock
  stops; the other team's box gets two free throws, two balls and +1 +1, its score ghosting up to 54. A stranger
  reads "a foul gives the other team free points".

## Built and checked

- Files: scenes/BackwardsScorebug.tsx, BackwardsScorebugBug.tsx (the bar, strips, rolling digits), BackwardsScorebugCourt.tsx
  (projected lane, board, ring, net, stands, light sweep), BackwardsScorebugArm.tsx; public/shaq-free-throws/backwards-ball.png.
- Stills checked at 4.82, 5.0, 5.4, 5.68, 5.72, 5.78, 6.1, 6.8, 6.9, 7.0, 7.4, 7.6, 8.0, 8.2, 8.25, 8.45, 8.75, 8.8, 9.15, 9.2.
- Richer pass: the clock digits flash foul red once when the whistle stops them, the knit ribs on the cuff, tendons,
  thumbnail and knuckle creases on the fist, twinkling stands, the baseline LED board, a light crossing the boards.
- Render note: this reel's bundle currently needs `--public-only nba-floor` because nba-floor's PointsPerShotNumbers
  loads a font from public/nba-floor at import time; without it every shaq-free-throws render fails on a NetworkError.

## Review pass (referee arm redrawn)

- Tried to fetch a real raised-fist photo (Commons `File:Raised_fist.jpg`); Commons answered 429 three times, so the
  fist is drawn from hand anatomy plus the 1976 referee crop. One view only: palm side, a right hand. Top down: four
  curled middle finger segments pressed together, smaller toward the little finger, a fold crease and a joint crease
  on each, the fingertip pads tucked below; the thumb across the index and middle fingers, nail toward us; thumb pad
  and little finger pad, palm crease, two wrist creases.
- Arm proportions: forearm tapering from a muscle belly near the elbow to the wrist, an inner elbow crease and hollow,
  a little upper arm, then the black ribbed cuff standing off the arm with the dark inside of the sleeve showing.
- Shading: cylinder shade round both sides, light from above (darkens toward the elbow), fine sparse hair, faint
  veins and the inner wrist tendon; the grey sleeve has soft blurred folds and the cuff's shadow under the band.
- Motion: punches up with an overshoot in height and angle, settles, then a visible ~2.4 degree sway; the fist
  pulses 7 % on "free". Smaller in frame and lower right (fist top ~y 1045), so the strips and the ball stay the focus.
- Ghost score: opens on "the" before ball one arrives, taller so its digits sit inside, solid #30363D hairline
  instead of dashes.
- Stills checked: 6.92, 6.95, 7.1, 7.3, 7.4, 7.6, 7.95, 8.15, 8.3, 8.6, 8.8.
