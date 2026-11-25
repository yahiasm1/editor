# QuartersScoreboard (`quarters`, 28.40-36.68 s)

"That night he had 23 after one quarter, 41 at the half, and 69 after three. By then the crowd was chanting 'Give it
to Wilt!'"

## What I saw (references at full size)

- `photos/commons-hershey-sports-arena-1938-interior-pd.jpg`, the far end, cropped 4x: the arena's own board hangs on
  the end wall under the last curve of the vault. A wide pale box, the score digits in two blocks left and right of a
  big round clock face in the middle, small labels under each block; below it a second tier of three panels (a
  framed bank of lamps left, a dark lamp grid centre, a lettered sign right). Rods and chains run up into the dark.
  Round loudspeaker horns sit on the wall either side.
- `photos/commons-hersheypark-arena-inside-2007-pd.jpg` (watermarked, read only), the same wall later: a grey steel
  cabinet on a shelf bracket, dark square digit windows in rows, HOME / VISITOR plates on top, period and penalty
  windows below, and two round horn speakers in square housings either side of it. The board is a riveted box of
  sheet steel, not a screen.
- `photos/commons-hersheypark-arena-inside-2024-...`: the end wall today, the board hung at the same place, centred
  under the vault's last rib; the end bank of wooden seats rises right under it. That is the angle of the tilt.
- `CrowdHalfEmptyDraw.tsx` (the `crowd` scene, built from the same photos): this reel's version of the board seen
  from far: black cabinet with a rivet row top and bottom, WARRIORS and KNICKS painted in white, 3 digits of 5 x 7
  dead bulbs under each, a QUARTER label and four round lamps 1 2 3 4 (lamp 4 lit amber: the radio). The thread
  counter (`HersheyTicketMapCounter.tsx`, `RecordGameLogCounter.tsx`): three black split flaps 66 x 96, a hinge line,
  two hinge pins, white numerals, small grey WILT above.
- Period bulb boards (Naden, Fair-Play, 1950s school and arena boards; Commons answered 429 to every image request,
  so read from memory and the two Hershey photos): each digit is a 5 x 7 grid of small incandescent bulbs, each bulb
  sitting in a black round collar on the panel; dead bulbs are dark glass with a pin of reflection, lit ones are warm
  white (about 2700 K), with a halo and a hotter core. A bulb takes a few frames to come up to full (the filament
  warms) and glows a hair after it goes off.

What would give a fake away: digits drawn as type instead of bulbs; even lit bulbs with no warm-up; a flat sticker
board with no frame, rivets, chains or depth; the board floating in black instead of hung on the arena's end wall.

## The thinking

- The real thing: the end-wall board of Hershey Sports Arena, close, the night by quarters. Same layout as `crowd`
  (so it is one object), drawn at hero size with what only shows close: steel frame and rivets, painted names with
  wear, every bulb in its collar, the four quarter lamps as column heads of a line score (WARRIORS row, KNICKS row,
  two bulb digits per quarter), the big 3 digit TOTALS dark (kept for `flood`), and the WILT 13 flip panel docked in
  the bottom rail. Chains up into the vault, the two horn speakers either side, the end wall and the vault's last rib
  around it. Then the same canvas world as `crowd` (vault, ribs, lamps, banks, 4,124 amber witnesses on the same
  seats).
- Board geometry for `flood` (board units, cabinet 1000 x 760, world 9 m wide, centre (0, 19.4, 48.35)): totals
  under the names at y 130-270, lamps at y 352 (x 385 535 685 835), WARRIORS line score row y 404-474, KNICKS row
  y 494-564, WILT panel y 600-740 at the centre.
- Word, then change:
  - That night: the row 76 strip ("76 1962-03-02 N NYK W, 169-147", its PTS still under the slip) tears off the
    game log where `record` left it and flies up; the WILT counter (at 0, top right) flies with it; the camera rises
    from the floor up the end wall to the board, all bulbs dead. The strip slides into the board's slot and the
    counter docks into the WILT panel.
  - 23 (lands): the WILT flaps clack up to 23, ending on the word, the cabinet jolts; column 1 lights bulb by bulb,
    WARRIORS 42, KNICKS 26.
  - after one quarter: lamp 1 lights (warm white; amber stays the radio's lamp 4).
  - 41 (lands): flaps to 41; column 2 lights 37 / 42.
  - at the half: lamp 2.
  - 69 (lands): the biggest clack; the cabinet swings once on its chains; column 3 lights 46 / 38.
  - after three: lamp 3; column 4 stays dark, waiting.
  - By then the crowd: the camera pulls back and tilts down past the board: the board small at the top, the banks
    of amber witnesses below.
  - chanting (lands): a wave of light rolls down both banks and back through the dots.
  - Give / to / Wilt! : three pulses through every dot, the biggest on "Wilt!", on which every dot leans toward the
    floor at once and the board's bulbs flicker with the noise.
- Sound-off test: a stranger sees an old bulb scoreboard light up quarter by quarter while one player's own counter
  jumps 23, 41, 69, then a half-full arena of lights pulsing and leaning toward the floor. "He was on his way and the
  crowd knew it."

## Review pass (fresh-eyes notes applied)

- Pullback ("By then the crowd"): the camera now ends behind the near free-throw line (pos 0,10,-16, aim 0,3.2,30), so
  the lit maple court (boards in tones, the lamps mirrored in the varnish), keyhole, centre circle and far basket fill
  y ~1120-1450, the board small at the top, the banks either side. The floor is the brightest real thing.
- The 1962 basket: steel stanchion behind the baseline, arm and two braces, a steel-framed painted backboard with its
  border and shooting square, the rim on its bracket 15 cm off the board, a 12-strand crossed cotton net.
- The lean on "Wilt!": everyone toward the court centre, along the floor, 0.6 of the old length; a thin body stroke
  from the seat to the neck, the head a sharp round dot, the glow damped while they lean.
- Close view: framed 0.7 m higher so the board sits lower; under it the end wall reads as board-formed concrete
  (strips, seams, grain, panel joints, form-tie holes), a concrete ledge on wall-strap brackets (2007/2024 photos),
  the lamp and horn conduits clamped down into a pull box, the board's warm light pooling down the wall, dust drifting.
- The torn row 76 now veers right and climbs past the board's right edge and out, never across its face.
- On "Wilt!" the totals stutter on faintly with the running totals after three (125, 106: 42+37+46, 26+42+38).
