# RulebookArc (scene `arc`, 21.83-32.93 s)

"The rulebook draws the arc twenty-three feet nine inches from the basket, but it also keeps the line three feet
inside the sideline, so a shooter's feet still fit. That leaves twenty-two feet in the corner."

## What I looked at (full size)

- NEW `pages/nba-official-rule1-screenshot.png` (Firecrawl screenshot of official.nba.com/rule-no-1-..., 1280x1600,
  saved 2026-11-23). The real page: an NBA blue (#1D428A) top bar with the logoman and "NBA Official" in a very
  condensed white face; a light grey page (#F8F8F8); a breadcrumb "Rulebook Home > RULE NO. 1: Court Dimensions -
  Equipment"; the heading "RULE NO. 1: Court Dimensions – Equipment" in a black ultra-condensed face (Action NBA Cond,
  closest here: Oswald); "Section I—Court and Dimensions" in grey; the items are a LETTERED list (a. to i.), grey Open
  Sans 16 px. The reel's sentence is item **d.**, not "line 4": "The three-point field goal area has parallel lines 3’
  from the sidelines, extending from the baseline and an arc of 23’9” from the middle of the basket which intersects
  the parallel lines." Curly quotes for feet and inches. I redraw it with "d." and the real typography.
- `pages/nba-rule1-section1.md`: the same text verbatim; Section II.3 "a steel tape".
- `photos/commons-lufkin-50ft-steel-tape-*`: red pebbled leather case, chrome rim band stamped THE LUFKIN RULE CO. /
  SAGINAW MICH., chrome face plate "UNIVERSAL" on an arc, centre boss with a winding hole, folding chrome crank with a
  ball knob; the blade leaves TANGENT to the case rim, dark blued steel, bright etched ticks, big numerals, a bent
  wire ring end. So the case rides beside the reading point, not on top of it.
- `photos/commons-nike-huarache-white-upper-stanton.jpg`, `commons-jabari-parker-sneakers-heels-2013.jpg`: white
  leather upper, 6-7 lace crossings, toe box perforations, padded collar and pull tab, midsole lip showing around
  the upper from above, a crew sock rising from the collar, a dark contact shadow and a reflection on satin maple.
- `diagrams/commons-nba-court-dimensions-wikideas1-cc0.webp`: short staggered board pieces, 2 in lines, the straight
  corner run 14 ft, the 3 ft between line and sideline, the dashed half of the free throw circle inside the lane.
- `notes/PaintedKink.md`, `notes/CornerSwing.md`: the floor and tape as the neighbouring scenes draw them (honey
  maple #D9B983 family, charcoal lane, dark apron, the same Lufkin case), so the reel stays one world.

What gives a fake away: a 1 px line, a blade without graduations, a case pasted on top of the reading point,
shoes that are white blobs, a rule card in generic type, an arc that just appears instead of being drawn.

## The real thing and its parts

The rule as the real web page, then the rule executed on the real floor at Rule 1 geometry (world in feet, origin
middle of the basket, baseline -5.25, sidelines +/-25, arc 23.75, corner lines' outer edge at +/-22, kink y 8.95).
The tape is the compass: ring hooked on a pin at the basket, case carried round, the blade the radius.
Arithmetic shown: 25 - 23.75 = 1.25 ft = 15 in; 25 - 3 = 22 ft; sliver = 23.75 - 22 = 1.75 ft = 21 in.
Feet fit: drawn shoes 13.4 in long in a staggered stance (back foot half a shoe behind), so the stance needs about
19 in: it fits the 36 in strip with room behind, and in the 15 in gap the back heel lands on the sideline paint.

## Word, then change

| word | change |
|---|---|
| (mount) | ARC FRAME floor with the line painted, the tape hooked at the basket, case at the left sideline reading 25' 0" |
| The | the floor slides down and dims; the official.nba.com page rises over it; the old line fades to a faint trace |
| rulebook | lands: a gold highlighter sweeps "an arc of 23’9” from the middle of the basket" in item d. |
| draws the arc | the page condenses into a strip under the floor (header + item d.), the floor slides back up; the case reels in to the basket |
| 23 | ends on: the case pays out straight up the middle, the reading rolls 0 -> 23' (inches land on "9") |
| feet 9 inches | the case swings left like a compass, white paint wet under the slot, the arc ending where the rule ends it |
| from the | past the end the paint turns into a thin gold ghost ring, down to rim level on the left |
| basket, | ends on: the case whips back over the top and down the right, ghost to rim level; "15 in" dimension between ghost and sideline |
| but it also keeps the line | the case swings back up to the top; the highlighter sweeps "parallel lines 3’ from the sidelines..."; two straight lines hang in the air over the corners, their shadows sharpening |
| 3 | THE BIG MOVE, lands: both corner lines slam down 3 ft inside the sidelines, light dust along them, the floor shudders; the ghost's ends are cut and fall away dim |
| feet inside the sideline | "3 ft" dimensions settle in both corners |
| so a shooter's | the strip leaves; the camera dives to the right corner, top-down |
| feet | lands: the white sneakers set down in the 3 ft strip, toes behind the line |
| still | the 15 in gap and the ghost relight; the sneakers slide out to it: back heel on the sideline paint, which flashes; "out of bounds" on the apron |
| fit. | lands: they slide back into the strip with a small bounce; the clear maple behind the heels brightens |
| That leaves | the camera rises to the ARC FRAME; the case swings from the top down to the right corner |
| 22 | lands: the case reels in to the corner line, reading 23' 9" -> 22' 0"; the gold 21 in sliver fills between ghost and line |
| corner. | lands: the left corner's sliver lights too; hold, slow push, the slivers breathing |

## Sound-off test

A stranger sees the actual NBA rule text, a tape drawing the rainbow arc, the arc running into the sideline with
too little room, two straight lines slamming in to fix it, shoes proving it (fit / do not fit), and two thin gold
slivers of floor that the fix gives away, with the tape reading 22' 0" there against 23' 9" at the top.

## Built (deviations from the plan, and why)

- The page is item **d.** of the real lettered list, not "line 4". It condenses into a strip at the TOP of the stage
  (item d. only, 32 px) instead of a small card top left, so the rule stays readable through "but it also keeps the line".
- While the strip is up the floor sits in a lower frame (`RA_LOW`, 19 px/ft, baseline 1478) so the arc top clears it.
- Instagram's right-hand buttons cover the ARC FRAME's right corner (x > 950, y 1100-1700), so: the compass swings
  right first and whips to the LEFT, the 15 in dimension sits in the left corner, the closing tape reads 22' 0" in the
  left corner and its sliver lights first on "22", the right one on "corner". The closing frame (`RA_END`, 17.5 px/ft)
  keeps both slivers clear of the buttons.
- The fit test is at 150 px/ft in the right corner with "3 ft" and then "15 in" dimensions under the sneakers.
- Checked: stills at 21.9-32.6 s every key word, a guides still, and a rendered clip (no still stretch over 0.67 s).
- Review pass on the sneakers (`RulebookArcShoes.tsx`, cues and positions unchanged): grey outsole edge and white
  midsole lip round the upper; mudguard and toe cap with stitching; toe box perforations at 3 mm on an 8 mm grid;
  seven eyelet pairs, a bar and six lace crossings, a bow with aglets; padded tongue and its pull tab; rolled collar,
  dark lining, ribbed crew sock with its navy stripe; heel counter and pull tab; dark contact shadow, ambient shadow
  and a soft warm reflection on the satin maple. Checked at 29.5, 29.75, 30.25, 30.6 s beside both photos.
