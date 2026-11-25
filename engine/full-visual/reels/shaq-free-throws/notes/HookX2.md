# HookX2, hook B "the coach's clipboard" (`hook`, 0.12-4.46 s, variant `shaq-free-throws-h2`)

"Shaquille O'Neal was so unstoppable that teams started fouling him on purpose."

## What I looked at

- `photos/commons-shaq-2000-finals-bigmoe797-ccbysa4.jpg` (Bigmoe797, CC BY-SA 4.0), the plan's LAKERS SHAQ STANDING,
  as the reel's existing hand-traced cut-out (`picturecourt-shaq-lakers.png`, 719 x 2327, copied to my own
  `hookx2-shaq-lakers.png`). Seen from his left: purple road jersey #34, "O'NEAL" across the shoulders, gold side
  panel on the shorts, white piping, black "DUNK" shoes with purple soles, left hand on the hip with the elbow out,
  head turned to his right. Light from above and front left: sheen on the shoulder and the scalp, the forearm darker.
  He stands on gold paint. Cut-out: elbow at (8, 581), forearm to the hand on the hip at about (150, 720), soles at
  the bottom row, the feet centred near x 430.
- `photos/commons-human-hands-front-back-evanamos-ccbysa3.jpg` (Evan-Amos, CC BY-SA 3.0): the back of a right hand,
  knuckle creases, tendons, nails. The grabbing hand is its back, rotated so the fingers wrap over Shaq's forearm and
  are cut where they curl behind it (the fingertips hide behind the arm; the knuckle row is what reads as a grip).
- Logos: cdn.nba.com primaries, Mavericks (Don Nelson's team) and Spurs (Popovich's), copied bare.
- A coach's dry-erase clipboard (no free photo of one answered on Commons: three searches, nothing but programs, so it
  is drawn from the object itself): a black moulded frame about 1 in wide with rounded corners and a raised lip, a
  white glossy dry-erase face, the half court printed in thin black lines (baseline at the top, the lane, the free
  throw circle, restricted arc, the three-point arc, half court at the bottom edge), a chrome lever clip riveted at the
  top centre, a marker tray moulded into the bottom edge holding a capped black marker. Dry-erase marker: chisel tip,
  streaky translucent ink, darker at the end of a stroke, ghost smears where it was wiped. Coach notation: defenders as
  X's, the offensive man as a circle with his number.
- The court is the reel's thread object at Rule 1 geometry (plan.md coordinates), seen from behind the shooter like
  `backwards` so the cut into the scorebug stays in one world: maple boards running baseline to half court, the gold
  lane, white 2 in lines, the free throw circle solid toward the shooter and dashed inside the lane, lane space marks.

## Think

- The real thing: a coach's play, drawn up on a real clipboard before tip-off, against the real Shaq standing at the
  line. The joke is that the play is not a play to stop him scoring; it is a foul.
- Details that make it real: the clip and its rivets, the tray and the parked marker, the marker's streak and ink
  pooling at stroke ends, ghost smears left where the X's peel off, the board's gloss sweep, Shaq's shadow crossing
  the board, the clack of each logo (the board jolts), the cap popping off the red marker, the grip cutting the fingers
  behind the arm, red contact crescents, dust off the boards on the slam, Shaq's reflection in the floor gloss.
- Sound-off test: a giant man at the line; a coach's board draws him blowing through five defenders; two coaches'
  logos clip on; a red marker draws a foul on him and a real hand grabs him at that moment; the board slams down and
  becomes the floor: FOUL HIM, circled, under his feet. Anyone reads "they planned to foul him".

## The sentence decoded

| Word (s) | The real thing | The verb, on screen |
|---|---|---|
| (frame 0) | Shaq on the line, the court, the clipboard tilting up in the bottom third | the marker is already drawing the X's |
| Shaquille O'Neal 0.12-0.84 | the real Lakers cut-out | he stands there huge: light runs down him, the board's 34 circle is drawn on "O'Neal" |
| so 1.30 | the drawn 34 | it shoots up the lane |
| unstoppable 1.60-2.18 | the five X's, the real Shaq | the X's peel off as smudged marker shapes and tumble off stage; Shaq rocks forward a step, his shadow hits the board; "+2" scribbled at the rim |
| teams 2.60 | Mavericks, then Spurs logos | clip onto the board top, a clack each (0.3 s apart) |
| started 2.88 | the red marker | its cap pops off |
| fouling 3.20 | a red X, a red line, a hand | drawn live: the line runs to the 34 and ends in a grabbing hand; the real hand grabs the real arm, red marks |
| him 3.48 | the drawn 34 | the drawn hand drags it back down to the free throw line |
| on purpose 3.88-4.46 | the clipboard | slapped flat: it falls 80 deg about its bottom edge onto the floor, shake and dust, its print snaps onto the real court; FOUL HIM circled twice under his shoes; whistle and FOUL tag pop |
| (silence) | the "+2" | lifts off the floor and flies into the scorebug's LAL score as the bug arrives |

## Built and checked

- Files: `scenes/HookX2.tsx` (timeline, ink, Shaq, peels, dust, the call, the +2, the handover), `HookX2World.ts`
  (camera, board plane, homography, marker handwriting), `HookX2Floor.tsx` (court, crowd, basket), `HookX2Board.tsx`
  (clipboard, print, clip, tray, logo cards, ink layer), `HookX2Parts.tsx` (grab, markers, whistle). Assets in
  `public/shaq-free-throws/`: `hookx2-shaq-lakers.png` (the reel's Bigmoe797 cut-out), `hookx2-hand-back.png`
  (Evan-Amos), `hookx2-mavs.svg`, `hookx2-spurs.svg` (cdn.nba.com).
- By cue: frame 0 the board is tilting up, two X's drawn, the marker on the third; O'Neal: the 34 circled; was: the
  coach's arrow up the lane; so: the 34 runs it; unstoppable: the five X's tear off and tumble out, Shaq rocks a step,
  "+2" at the rim; teams: Mavericks clack, Spurs clack 18 frames later; started: the red cap pops; fouling: red X,
  red line, drawn hand, and the real hand on his arm with red marks; him: the drawn hand drags the 34 to the line;
  on purpose: the slap (11 frames, motion blur), landing shake and dust, the print snaps onto the court, FOUL HIM and
  two circles, whistle and FOUL. Silence: the payoff holds to 4.53 s, then the camera dollies onto the exact court
  `backwards` opens on (its camera, 70 px high) while Shaq and the call blur out and the "+2" stands up and lands on
  the "2" of LAL 52 where the scorebug arrives.
- Stills read every 0.25 s from 0 to 4.75 s and every frame from 4.50 to 4.80 s; `check.py render` on a 0-5.6 s cut:
  longest still 0.03 s, 0 bare frames into `backwards`. Fixed on the way: points behind the lens during the dolly (the
  floor's far half and the three-point arc washed the frame white at 4.72 s), the grab first landing off the arm.
- Renders here need `--public-only shaq-free-throws,nba-floor`: the bundle loads an nba-floor font at start.
