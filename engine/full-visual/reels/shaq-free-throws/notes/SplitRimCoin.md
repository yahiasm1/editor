# SplitRimCoin (`split`, 9.60-17.29 s)

"But Shaq was the exception, because near the rim he was a seven foot one wrecking ball, and at the free throw line
he was a coin flip."

## What I looked at

- `photos/commons-shaq-2000-finals-bigmoe797-ccbysa4.jpg` (960 x 2461): Shaq full length, Lakers purple #34 with
  O'NEAL arched over the number in gold-trimmed white, gold collar and armhole piping, purple shorts with a wide gold
  side panel edged in white, black socks, black "DUNK" shoes with grey ribbed uppers and lilac soles. Seen from his
  left rear, facing right, left hand on his hip, right hand behind his back. Hard flash-like light from upper left:
  bright highlight on the shoulder and the back of the head, sweat sheen, film grain. A teammate stands overlapping
  in front of him (purple), his face profile is against that teammate's face and headband (blue), and another player's
  shoe sits behind his back leg: the cut-out was traced by hand on 4x gridded crops, then GrabCut on a denoised copy
  (no rembg here), the polygon kept tight on the profile and the back leg so none of it comes along.
  Result: `public/shaq-free-throws/splitrimcoin-shaq-lakers.png` (719 x 2327, head top to sole).
- `photos/commons-shaq-dunk-suns-2009-keithallison-ccbysa2.jpg` (1662 x 2097): Phoenix purple #32 "PHOENIX",
  grey side panels, both hands hooked on an orange rim from under the glass, the white nylon net tangled over his right
  hand, the board's black underside across the top, the ball falling in the right edge, sweat on his face, arena lights
  blurred behind. The rim is at the top right: the push in goes there.
- The quarter: `File:2006_Quarter_Proof.png` (US Mint, public domain, confirmed on Commons; the plan's URL had the
  wrong hash path, a0 not d4). A proof: frosted cameo Washington on a mirror field that reads black, UNITED STATES OF
  AMERICA, LIBERTY, IN GOD WE TRUST, S mint mark, QUARTER DOLLAR, a fine reeded rim. Tails: the same year's proof
  reverse, `File:2006-50-state-quarters-coin-south-dakota-proof-reverse.jpg` (Edmoral000, CC BY-SA 4.0, 300 px):
  Mount Rushmore, the pheasant, SOUTH DAKOTA 1889, 2006, E PLURIBUS UNUM, wheat. Real quarter: 24.26 mm across,
  1.75 mm thick, 119 reeds; the reverse is struck upside down to the obverse (coin alignment), so a top-over-bottom
  flip shows each face upright. Both added to `assets/refs/credits.json`.
- The court: the plan's coordinates and the behind-the-shooter camera, matched to `backwards` (its notes: rim y 942,
  line y 1344, so F = 431 px, horizon y 1021, camera 6 ft up, 8 ft behind the line). Lakers gold lane, purple seam
  lines, maple, the circle's top half solid, the board 6 ft x 42 in with the shooter's square, the orange ring.

## Think

- Real things: the same Lakers cut-out Shaq the reel keeps returning to; Keith Allison's real dunk photo; the real
  2006 proof quarter both faces; the Lakers free throw line from the shooter's seat.
- Details: his contact shadow on the boards; the +1s physically stopping on his shoulder and falling with gravity;
  a real tape with foot ticks and inch ticks against the full-length cut-out (7'1" = his on-screen height); the
  photo's credit inside the card; the torn edge's white paper core and loose fibres; the coin's reeded edge as a
  band when it is edge-on, the mirror field catching the spotlight, its shadow on the floor shrinking as it rises.
- Word, then change:
  - (mount) the court from `backwards`' camera is there, two white +1s hanging up right where the bug paid them.
  - But: the camera pushes in on the line.
  - Shaq: the Lakers cut-out rises onto the line, shadow on the boards.
  - exception, (lands): the two +1s fly at him and stop dead on his shoulder, bounce off, tumble to the floor. He
    does not move.
  - because near the: he steps left, the court dims, a tall photo card opens on the right.
  - rim (lands): the dunk photo fills the card, slow push toward his hands on the rim.
  - seven foot one (ends on "one"): a tape rises beside him from floor to the top of his head, 0'0" rolling to 7'1",
    "7-1, Basketball-Reference" small grey.
  - wrecking (lands): the photo takes an impact, shakes, punches in, specks fly off the rim; the tape shivers.
  - ball, : settles.
  - and at the: he and the tape leave left, the card widens to the full stage.
  - free throw (lands on "free"): the card tears down the middle, a white paper edge; the right piece peels away.
  - line: the empty free throw line from behind the shooter slides into the right half, a spotlight on it, a
    quarter lying on the paint.
  - coin (lands): the quarter is flicked up and spins edge over edge in 3D, reeds catching light.
  - flip. (ends on): it slows enough to read heads, tails, heads, and hangs spinning over the line; the rim half
    stays bright beside it.
- Sound-off test: a free throw doesn't pay off on this guy; at the rim he is a giant hanging on the rim; at the line,
  the same spot is a coin toss.
- Not done from the plan: "the scoreboard tilts down to become the floor" needs `backwards`' object, which I do not
  own; the court that sat behind the bug stays instead and the +1s carry over.

## Built and checked

- Files: `scenes/SplitRimCoin.tsx`, `SplitRimCoinCourt.tsx` (the projected court, shared camera with `backwards`),
  `SplitRimCoinCoin.tsx` (the 3D quarter). Assets in `public/shaq-free-throws/splitrimcoin-*`.
- The left photo keeps its own shape and slides left so the rim and his face stay whole after the tear; the
  torn-off strip of the photo peels over the line half.
- Stills read every ~0.1-0.5 s from 9.55 to 17.2 s, plus a 1/60 s burst through "exception" and the tear, and a
  render of 9.4-17.3 s through `check.py render` (no hold over 1.2 s, no bare handover frames).
- Render note: every bundle loads nba-floor's DejaVu fonts at import, so stills need `--public-only nba-floor`
  (or `--full-public`), otherwise the render dies on a 404.
