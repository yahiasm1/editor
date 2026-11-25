# FiftyFeetWide (scene `width`, ~16.05-21.83 s)

"An NBA court is fifty feet wide, and the basket sits right in the middle, twenty-five feet from each sideline."

## What I looked at

- `photos/commons-ball-arena-gsw-den-2026-mhcl947-ccbysa4.jpg` (1280x960, "MhcL947, CC BY-SA 4.0"). Upper side
  stands, Warriors at Nuggets warm-ups. The floor is a small honey-maple slab in the lower middle (photo x 470-960,
  y 600-800), seen at a steep oblique: the left basket's half is on the left, the near sideline hidden under the crowd
  at the bottom. Navy lanes with a gold free throw circle, the Nuggets mile-high logo in navy/gold at centre court,
  "Ball Arena" script logo on the boards, a dark navy apron. Above it: the hanging centre-hung board (Warriors x
  Nuggets, "BALL ARENA" on top), retired-number banners, the truss and lights. Light is warm and even on the floor,
  dark everywhere else: the floor is the brightest thing in the arena, a lit slab in the dark. Players stand all over
  it (warm-ups).
- I measured the court in the photo on a 10 px grid (both lanes' four corners, the centre circle) and fitted a
  homography court(ft) -> photo(px), max error ~7 px. Overlaying the fitted court, both three-point arcs and the
  half court line land on the real paint. Matrix in `FiftyFeetWideWorld.ts` (`FFW_PHOTO_H`).
- `photos/commons-lufkin-50ft-steel-tape-junkyardsparkle-cc0.jpg`: round case in red pebbled leather, a chrome band
  round the rim stamped THE LUFKIN RULE CO. / SAGINAW, MICH., a chrome face plate with UNIVERSAL on an arc, the
  centre boss with its winding hole, the folding crank with a ball knob, the blade dark blued steel with bright
  etched ticks and big numerals, ending in a bent wire triangle on a brass clip.
- `photos/commons-steel-tape-chicago-tapes-*`: the coiled blade, its graduations every inch, a longer tick at 6 in.
- Neighbours: `PaintedKinkFloor.tsx` (the reel's floor look: maple strips, charcoal lane, 2 in paint) and the plan's
  ARC FRAME. `answer` ends on 19.25 px/ft top-down with both aprons in view; I measure in that frame.

What would give it away: a photo that just cross-fades into a diagram (no physical lift), a tape as a ruler graphic,
a basket as a circle, readings that appear instead of counting, gold used for anything but distance from the basket.

## The real thing and its parts

- The real 2026 floor in the real arena (photo) -> the same floor lifted out: the photo's floor quad is re-projected
  every frame through a homography whose four court corners travel (polar, around their centroid, so it turns 90
  degrees instead of collapsing) from where they are in the photo to where the top-down camera puts them. The stands
  dim and drop away; the photo's floor fades into the reel's drawn floor at the same geometry.
- Drawn floor: maple strips 2.25 in, staggered joints, charcoal lane, 2 in white paint (all Rule 1 markings), dark
  apron, light pool and sweep. The far half fades past half court.
- The basket from above, in 3D: stanchion arm at 11 ft, the shot clock box on top of the board, the 6 ft board edge
  with its aluminium frame and red LED strip, the orange ring at 10 ft with its bracket, the cord net in diamond mesh
  hanging to 8.5 ft, and the shadows on the boards. Parallax is real (one pinhole camera): close up, the ring is 1.5x
  the floor's scale.
- The Lufkin tape: case seen from above, crank, the blade with ticks each inch (close) and numerals each foot.
  Hooked on the left sideline's outer edge; the case is walked to the right sideline at shoe height, so the blade
  reads 50 there and 25 exactly under the basket's middle, which is the sentence.
- Gold = distance from the basket only: it starts at the pin and runs out both halves.

## Word, then change

| word | change |
|---|---|
| (mount) | the Ball Arena card fills the stage, already pushing toward the floor; credit top right |
| NBA court | lands: the stands dim around the floor; the floor lifts out, turns and un-tilts into the top-down frame, the drawn floor taking over |
| is | lands: the tape's ring hook clips onto the left sideline's outer edge |
| 50 | the case runs to the right sideline, blade paying out with a bow, white reading counts 0 -> 50' 0", landing in the word |
| feet wide | lands: the blade snaps taut (small recoil); white "50 ft" with end ticks above it |
| and the | the camera slides to the middle and dives toward the basket, ring and net rising under the lens with parallax |
| basket | lands: the net sways once, a white cross on the floor under the ring's middle |
| sits right in | the blade's etched 25 under the cross lights, hairline label "the tape reads 25 here" |
| middle | lands: the steel pin drops through the net onto the cross and pinches the blade, two halves |
| 25 | the camera pulls back to the whole width; gold runs out from the pin along both halves, both readings count 0 -> 25' 0" |
| feet from each | the two gold readings hold at the sidelines |
| sideline | lands: both sidelines pulse white where the blade meets them |

## Sound-off test

A real arena; its floor lifts out flat; a real steel tape is pulled across it and reads 50; the camera dives to the
basket and the tape reads 25 right under it; a pin splits the tape and two gold halves each read 25 to the
sidelines. A stranger reads: the floor is 50 wide and the basket is dead centre, 25 from each edge.

## Handover

Last frame: top-down, 19.25 px/ft, basket centre at (540, ~1323), baseline at y ~1424, both aprons in view; the blade
across the basket line, pinned at the basket's middle, both halves gold, readings 25' 0" near each sideline, the case
on the right apron.

## After review 1

- Handover to `arc`: agreed end frame. The camera lands on RA_ARC (19.5 px/ft, baseline y 1427) at `scene.to - LEAD`;
  the scene is `keep = true`, so `arc` mounts on the same picture: both blade halves, gold under them, the two gold
  25' 0" readings at the same places, the case tangent above the blade's end on the right sideline (R = 1.9 ppf, as
  RulebookArcTape draws it), crank at 0 deg. The cross, the pin head and the source line fade out by `to - LEAD`.
- The case now rides tangent above the blade's end (slot at the bottom of the rim, as in the Lufkin photo), fully on
  screen in every wide frame.
- "the tape reads 25 here": the etched 25 is lit and drawn above the ring and net (FiftyFeetWideMark25).
- "middle": the pin is drawn above the cross and the net, 0.3 ft head, a white seat ring, and the blade visibly
  pinched (notches show the lane paint) (FiftyFeetWidePin).
- Lane scuffs are short straight rubber skids, fainter; on the lane paint a pale smudge.
- Gold readings appear once the pull-back is past halfway (n25 + 4 frames).
