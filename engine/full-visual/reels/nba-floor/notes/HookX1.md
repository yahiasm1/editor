# HookX1, "The tape reels in" (scene `hook`, 0.08-5.46 s, variant nba-floor-h1)

"The NBA three-point line isn't the same distance everywhere. In the corners, it's almost two feet closer."

## What I looked at (full size)

- `photos/commons-lufkin-50ft-steel-tape-junkyardsparkle-cc0.jpg`: a round case about 6 in across, wrapped in deep
  red pebbled leather (#8C1A1E to #A3252A, the grain catching light as a fine pebble), a polished chrome band round
  the rim stamped THE LUFKIN RULE CO. / SAGINAW, MICH. / MADE IN U.S.A.; a chrome face plate, cool grey-white, with
  "UNIVERSAL" in black bold capitals on an arc and "THE LUFKIN RULE CO. / SAGINAW, MICH. U.S.A." under it, two black
  rule lines; an inner raised boss with a dark hole and a small rivet; a folding chrome crank (a flat arm with a ball
  knob). The blade leaves the case through a slot in the band, tangent to the rim: dark steel, satin grey, with black
  etched inch ticks and big black foot numerals ("2", "3") and a thin light edge; at its end a bent steel wire
  triangle riveted to a small flat tab.
- `photos/commons-steel-tape-chicago-tapes-cantonsdelest-ccbysa4.jpg`: the coiled blade seen edge-on, many thin turns
  of dark steel with bright edges, one loose turn springing outward: how a slack blade bows when it is not taut.
- The reel's floor (`scenes/PaintedKinkFloor.tsx`), drawn from the Clarkson 2025 NBA Cup photo, the Wikideas1 court
  and the Garden / Ball Arena photos: honey maple strips, staggered joints, charcoal lane, white 2 in paint with a
  raised lip at macro, the board and orange ring from above, the dark apron. I draw the hook on that same floor, through
  the same camera, so the hook's last frame is `answer`'s first (keep = true).
- `logos/nba-logoman.svg` (cdn.nba.com): the red, white and blue Logoman with the white NBA letters; on a real floor it
  is painted on the dark baseline apron, beside the stanchion.
- `pages/nba-rule1-section1.md`: arc 23'9" from the middle of the basket, parallel lines 3 ft from the sidelines;
  sqrt(23.75^2 - 22^2) = 8.95 ft is the kink; at rim level the circle is 1.75 ft = 21 in outside the straight line.

## The real thing and its parts

The Rule 1 half court at 20.8 px/ft (ARC FRAME) and 95 px/ft (CORNER FRAME), and the Lufkin "Universal" tape used
as a compass: ring end hooked over a pin at the middle of the basket, the blade out to the reading point, the case
riding at the reading point with the blade entering its slot (that is where a steel tape is read, and how `arc`
already draws it). The brief put the case on the left apron at frame 0; a case away from the reading point cannot
read anything, so the case rides at the tip from frame 0 and is what "reels in" on "closer".

Details a viewer would miss only if they were gone: the slack blade's bow lifting as it goes taut, the blade's
shadow and its gold under-glow, black foot numerals and inch ticks on the steel, the ring's wire triangle over the
pin, the case's chrome band and the slot, the crank turning as blade goes in, the pebble on the leather, a red
reflection of the case on the lacquer, the dust off the boards when it slams down, the paint's raised lip at 95 px/ft.

## Decode (word, the real thing, the verb done to the hero = the steel tape hooked at the middle of the basket)

| word | t | real thing | verb | on screen |
|---|---|---|---|---|
| (frame 0) | 0 | half court, tape running up the middle | pays out | the case racing up the floor, window rolling 0 -> 23'9" by 0.55 s, the bow lifting, gold coming up under the steel; a faint grey 22' tick flashes on the right corner line, gone by 1 s |
| NBA | 0.22 | the real Logoman on the baseline apron | stamped | drops onto the dark apron with a press and a shadow |
| three-point | 0.56 | the 2 in white paint | lit along its whole path | a white light runs left corner -> arc -> right corner, the line left glowing |
| line | 1.02 | the Lufkin blade | pays out, twangs | a last tug out: the blade twangs, one click |
| same | 1.68 | the reading window | reads 23'9" | the loupe locks 23'9" in etched black; a white Figtree 23'9" floats above the arc |
| distance | 1.92 | gold under the blade | glows | the gold brightens; a thin gold ghost circle r 23.75 draws itself out from the tip both ways |
| everywhere | 2.32 | the blade | swings | compass swing down the arc to the right; at the kink the paint turns straight and the tip keeps going on the ghost circle: a gap opens toward the sideline |
| (silence) | 2.7 | | | the case settles at rim level; the camera starts to dive |
| corners | 3.5 | CORNER FRAME | camera dives | lands at 95 px/ft: boards, paint lip, sideline, apron; the case hovering over the ghost circle 21 in outside the line |
| almost | 4.18 | the crank | turns | the crank swings half a turn, ratcheting |
| two | 4.56 | the 21 in | gold sliver opens | gold fills between the ghost circle and the straight line, baseline to the top of the frame; grey "21 in" dimension with hairlines at rim level |
| feet | 4.8 | etched inch graduations | click past | the loupe's ticks rattle past the index, the case creeps in three clicks, reading rolls down |
| closer | 5.0 | the blade | snaps back | THE BIG MOVE: the crank whips, the case is reeled hard onto the painted line, slams, dust puffs off the boards, the blade wobbles twice and settles; 22'0" lands, the floating reading turns gold; the sliver stays lit |
| (hold, out) | 5.1-5.58 | | | 0.3 s hold, then the blade zips home and the case is lifted away as the camera pulls back up to the ARC FRAME: `answer`'s first frame |

Source line, grey, bottom left: "NBA Rule 1, Court Dimensions".

## Sound-off test

A stranger sees a tape measure the three-point line at the top (23'9"), sees the same distance swung into the corner
land outside the paint, sees a gold gap open there, then watches the tape reeled in onto the corner line: 22'0". The
line is closer in the corner, by that gold strip.
