# HookX2, "Two planks of the floor" (scene `hook`, 0.08-5.46 s, variant nba-floor-h2)

"The NBA three-point line isn't the same distance everywhere. In the corners, it's almost two feet closer."

## What I looked at (full size)

- `photos/commons-bowen-three-pointer-verizon-keithallison-ccbysa2.jpg` (1280 x 1235), Keith Allison, CC BY-SA 2.0.
  Read off it, not assumed:
  - The camera is across the court, high in the stands, on a long lens: the far sideline (white, y 1043 at x 300,
    sloping 0.037 px/px down to the right) and a second line 118 px nearer (y 1161 at x 300, same slope) are almost
    parallel. That nearer line is the corner three-point line, 3 ft inside the sideline, and on the Wizards' 2009
    floor it is painted **dark** (near black, about 5 px thick), not white. The sideline is white.
  - The backboard is seen edge-on at left (we look parallel to the baseline), the orange ring from the side, its
    far end at x 438 and the board face at x 195: 2 ft over 243 px, about 121 px/ft at rim depth; ring centre
    (347, 746).
  - The Wizards bench sits behind the sideline on a black apron lettered WASHINGTON in big white capitals.
  - Bowen (Spurs #12, black road jersey) is in the air with the ball over his head at (840, 230); his feet are hidden
    behind Caron Butler's shorts (Butler #3, white home kit, navy knee pads), who stands nearer the camera.
  - The maple is pale, honey-grey under arena light, boards running left-right in the photo (along the court
    length), long joints.
- I fitted the reel's camera model (`PaintedKinkWorld.ts`) to the photo by least squares: sideline x = -25 and
  corner line x = -22 onto the two measured lines, the ring centre (0, 0, 10 ft) onto (347, 746), the board face and
  the ring's far edge onto x 195 and 438. With D fixed at 140 ft (a long lens) the residuals are under 6 px:
  `tx -43.36, ty -3.80, D 140, pitch 1.3218, yaw -1.7114, F 12077, cx 640, cy 617` (photo pixels). So the photo is
  the **left** corner seen from the right sideline, and Bowen's spot projects to about (-23.5, 0.6): almost exactly
  level with the rim, the shortest three on the floor. The photo's floor really is the reel's floor.
- `logos/nba-spurs-primary.svg` (cdn.nba.com), bare, copied as `public/nba-floor/hookx2-spurs.svg`.
- `pages/nba-rule1-section1.md`: arc 23'9" from the middle of the basket; parallel lines 3 ft from the sidelines;
  lane 16 ft; free throw line 15 ft from the board face (y 13.75); FT circle r 6; restricted area r 4.
- The reel's floor (`PaintedKinkFloor.tsx`, read only, imported): the ARC FRAME `answer` opens on. I draw the whole
  hook on that floor through that camera so the last frame is `answer`'s first (`keep = true`).

## The real thing and its parts

The hero is the floor itself. Two strips of it are cut along board seams: one along the radius to the top of the
arc (x = 0, y 0 to 23.75), one along the radius to the left corner line at rim level (y = 0, x 0 to -23.75, i.e.
carried on to where the 23'9" circle would be, 21 in past the corner line). Each strip is 6 boards (13.5 in) wide so it
reads on a phone; the boards and their joints are the floor's own (same seeds as the floor), so the plank face
matches the hole it leaves. Each plank carries the paint it crossed, at rulebook distance from the rim:

- top plank: charcoal lane stain from 0 to 13'9" (FT line), the restricted-area arc at 4 ft, the free throw line at
  13'9", the FT circle's top at 19'9", the arc's paint at 23'9" (its far end);
- corner plank: lane stain from 0 to 8 ft, restricted arc at 4 ft, the lane line at 8 ft, the corner line at 22 ft,
  then 21 in of bare maple to 23'9".

Details a viewer misses only if gone: 3/4 in thickness and end grain when it stands, the dark slot left in the floor,
the shadow growing as it lifts, foot ticks etched along the edge, the paint's lip catching light as the plank turns,
the dust when the gold piece breaks off, the rock of the plank after.

The photo's dark corner line stays dark (the real paint); on "three-point" it gets a white rim light and lifts a hair
on its own shadow. Butler's legs are cut out of the photo (`hookx2-butler-legs.png`) and drawn over it, so the line
runs behind him as in the photo.

## Decode (word, the real thing, the verb done to the hero = the floor)

| word | f | real thing | verb | on screen |
|---|---|---|---|---|
| (frame 0) | 0 | the Bowen photo | pushes in | the card fills the stage, already pushing toward his spot; a light sweep crosses the photo's floor; two gold radii flick out of the ring at rim height, one to the shooter (22'0"), one toward the top of the key running out of frame (23'9"), gone by 0.85 s |
| NBA | 8 | Spurs logo | sits | small, bare, under the credit |
| three-point | 29 | the painted corner line | lifts out | the dark 2 in line under his heels gets a white rim light and rises a hair on its shadow, Butler's legs still in front |
| line | 56 | the photo's floor | un-tilts | camera = the fitted photo camera, eased to the ARC FRAME; the photo fades as the floor flattens, the drawn floor exactly under it; the lit corner line becomes the floor's left corner line |
| isn't the | 76 | two board strips | outlined | white outlines draw along the seams of the two strips |
| same | 96 | the strips | lift | they rise out of the floor with weight: shadow, thickness, dark slot behind |
| distance | 110 | the planks | fly, stand | rotate up and fly to stand side by side at centre stage, rims on one baseline, floor dimmed behind |
| everywhere | 134 | the tops | settle level | tops level; foot ticks run up the edges |
| (silence) | 157-190 | | hold | slow turn, light along the grain |
| corners | 205 | corner plank | turns | rolls a hair, its paint stripe catching light; grey "corner" with a hairline |
| almost | 246 | top plank | reads | white 23'9" at its top |
| two | 269 | the 21 in past the corner line | fills gold | gold from the paint stripe to the top |
| feet | 283 | the gold | measured | grey "21 in" with a hairline dimension |
| closer | 295 | the gold piece | breaks off, falls | THE BIG MOVE: it snaps off and drops out of frame, dust puff, the plank rocks and bounces; 22'0" lands on it; its paint stripe sits 21 in under the other's |
| (out) | 313-333 | planks | swing home | both swing back down into their slots, the floor un-dims, the leftover slot glows gold and fades: `answer`'s first frame |

Source line, grey, bottom left, from the floor on: "NBA Rule 1, Court Dimensions".

## Sound-off test

A real corner three; the photo's floor turns into the court; two pieces of the same floor, rim to the top of the arc
and rim to the corner, stand side by side and look equal; the corner one's top 21 in turns gold and falls off. The
corner is shorter, by that much, and it is the floor itself showing it.
