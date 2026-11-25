# secondhalf: OneAgainstFive (35.64-42.02 s)

"In the second half alone, Kobe scored 55 points. The whole Raptors team scored 41. One guy, against five."

## What I looked at (full size)

- `photos/commons-raptors-bucks-2006-bosh-jerameyjannene-ccby2.jpg` (960x720, Jan 27 2006 at Milwaukee, five days
  after the 81 game). Four Raptors stand full length at the same depth on the Bucks floor, red road jerseys with the
  white-edged black "RAPTORS" arch and number: #9 Pape Sow (headband, arms hanging away from the body), #4 Chris Bosh
  (long, narrow shoulders, black wristband on the right arm, head turned right), #13 Mike James (short, thick
  shoulders, right hand on the hip, head turned left), #24 Morris Peterson (red headband, profile looking up and
  left, the jersey back hanging loose). Feet at y ~700, heads 390-435: about 44-45 px per foot for all four, so
  their heights in the photo agree with the roster (Bosh 6-11 tallest, James 6-2 a head shorter). The light is the
  arena's overheads, hard from above: bright tops of the shoulders and head, the faces in shadow.
- Zoomed crops with a 10 px grid (`/tmp`, not kept) to trace every outline by hand: GrabCut took only the red cloth
  and lost the dark skin against the crowd, so the outlines are traced point by point (head, neck, shoulders, arms,
  the shorts down to mid-thigh).
- `commons-mike-james-13-raptors-2006-jerameyjannene-ccby2.jpg` and `commons-mo-peterson-24-raptors-2006-...`: the
  close crops of the same moment (same poses): they confirm the outlines, the V collar, the headband, the arm on hip.
- `commons-kobe-ft-gold8-2005-josephalee-pd.jpg` and its hand cut-out (`cutouts/startingfivespotlights-kobe-full.png`,
  head to mid-thigh): gold #8 at the line, ball at the waist, eyes up, sweat sheen, crown tattoo, purple wristband.
- `kobe-81-scoring.json`: Kobe's 4th quarter, 19 scoring plays, 28 points (53 -> 81). Raptors' second half from
  the same play-by-play: Rose 13, Bosh 8, James 7, Bonner 7, Peterson 2, Graham 3, Villanueva 1 = 41 (checked by
  summing; the facts.md row says the same). Raptors starters and heights in facts.md: Rose #5 6-8, Bosh #4 6-11,
  James #13 6-2, Peterson #24 6-7, Bonner #16 6-10.
- Searched Commons for Matt Bonner (only Spurs-era photos: "Bonner free throw1", "Bonner focusing", Zereshk,
  CC BY-SA 3.0) and Jalen Rose: the upload host refused every download (429, rate limit from the other builders), so,
  as the plan allows, Rose and Bonner are plain dark shapes traced from a real Raptors body in the same photo (Pape
  Sow #9, 6-10, mirrored for Rose), scaled to their own heights, no faces, their own numbers.
- The thread objects as left by the scenes before: the scoreboard (`StaplesNightBoard`, parked at y 532-692) and the
  9 x 9 board waiting small top right (`DeficitFlowChartCornerBoard`, x0 812, y0 778, pitch 19, r 7), lit to 53.

What would give a fake away: five identical mannequins, equal heights, numbers that do not add up, red bulbs that
appear without anyone scoring them.

## Thinking

- The real thing: the second half as people. Kobe, a real photo, on the left. Five real Raptor bodies, traced, on the
  right, each at his roster height on one floor (60 px per foot). The bulbs are the reel's invisible thing: gold =
  Kobe's point, red = a Raptors point, one bulb per point.
- One place: everyone stands behind the courtside scorer's table (the same table the starters stood behind), so the
  cut-out's legs are hidden and the two columns stand on the table top like stacks. Its LED ribbon labels what is
  above it: BRYANT, 55, 41, the five names.
- Behind: the endlessbender night photo, very dark and soft, so the bowl of the arena is there without competing.
- The red bulbs come from the play-by-play, play by play (26 scoring plays): each lights over the head of the man who
  scored it; Graham and Villanueva's 4 drop into a small heap labelled "bench".
- Sound-off test: a full board of gold, its second half pours into a gold stack beside Kobe; five Raptors each get a
  few red bulbs that drain into one shorter red stack; the five close into a wall and the gold stack still stands
  taller. A stranger reads: one man outscored a whole team.

| word | change |
|---|---|
| (mount) | the board flies from the top-right corner to the centre, big; the scoreboard hangs at the top, END 3RD 85 / 91 |
| In the second half | the 4th quarter plays on the board: 28 sockets light gold in Kobe's real order, play by play, the counter 53 -> 81 |
| alone, | lands: the 55 second-half bulbs lift off the board; the first 26 stay and dim; the board shrinks to the top left |
| Kobe scored | the scorer's table rises along the bottom; Kobe's cut-out rises behind it on the left; the 55 rain into a 4-wide gold stack beside him, bottom first |
| 55 | lands: the stack settles with weight (a squash and a glow), counter 55 lands above it, ribbon reads BRYANT 55 |
| The whole Raptors team | five traced Raptors step in from the right one after another at their real heights, red rim light, numbers on the chest, names on the ribbon; the Raptors logo bare above them |
| scored | red bulbs light over each head as the play-by-play runs (Rose 13, Bosh 8, James 7, Bonner 7, Peterson 2), bench heap 4 |
| 41. | lands: every red bulb drains into one red stack beside the gold, counter 41, clearly lower |
| One | lands: a warm light falls on Kobe and his stack; the Raptors side drops into red shade |
| against five. | lands: the five step together into a wall, shoulder to shoulder; Kobe's 55 holds, glowing |

Handover to `eightyone` ("He finished": the 55 pour back into the board): the 55 gold bulbs end at
`OneAgainstFiveGoldSpot(i)` (i = 0..54, bottom-left first), the 26 dim ones in the small board at
`OneAgainstFiveSmallBoard`.

## Built, checked

- Built as planned above, at 78 px per foot (floor y 1440, table top y 1237). Bosh, James and Peterson are the real
  photo clipped to the traced outline, graded into the arena's shade with a red rim; Rose and Bonner are dark shapes
  with a shadowed red jersey, "RAPTORS" and their own number. Each man's rim flares as his points light.
- Stills read at full size: 35.42 (takeover's last frame, board in the corner), 35.6, 35.8, 36.0, 36.15, 36.3, 36.5,
  36.6, 36.85, 37.0, 37.2, 37.3, 37.35, 37.9, 38.5, 38.6, 38.7, 38.95, 39.1, 39.2, 39.3, 39.45, 39.5, 39.65, 39.75,
  40.0, 40.3, 40.75, 40.9, 41.0, 41.75, 41.85, 41.9, 42.05, 42.3. `check.py render` on 35.4-42.4: longest still
  stretch 0.57 s, no bare handover frames.
- Fixes after comparing: labels on the ribbon collided (two rows, measured widths), credits moved to the table skirt,
  figures no longer see-through when dimmed (brightness, not opacity), Bonner clipped at the table top, the red
  counter shows only once the first bulb lands.
- Weakest part: Rose and Bonner have no photo of their own (Commons refused the Spurs-era Bonner downloads, 429).
- Handover: `eightyone` should pick up the 55 at `OneAgainstFiveGoldSpot(i)`, the 26 dim in `OneAgainstFiveSmallBoard`,
  the scoreboard still END 3RD 85 / 91 (the 4th quarter's team score is left for its FINAL flip).
