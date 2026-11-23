# CornerSwing (scene `corner`, 10.67-16.05 s)

"Picture the ball swinging to a shooter standing alone in the corner, his heels a step from the sideline."

## What I looked at (assets/refs/)

- `photos/commons-bowen-three-pointer-verizon-keithallison-ccbysa2.jpg` (1280x1235). Bowen #12 at the top, ball
  above his head at about (840, 235), Butler #3 contesting in the foreground, rim and board cut at the left, a black
  baseline apron with "WASHINGTON" in white block capitals across the bottom third, then a strip of honey maple, a
  dark line, more maple. Light is flat arena top light; the floor is glossy, the paint crisp.
- `photos/commons-clarkson-knicks-2025-nbacup-*`: maple at shoe height. Pale gold boards, strong satin glare, every
  shoe has a mirror reflection under it, white lines 2 in wide that keep a hard edge even at a grazing angle.
- `photos/commons-jabari-parker-sneakers-heels-2013.jpg` (new, Commons "20130316 Jabari Parker's sneakers (1).JPG"):
  the heels shot I needed. Seen from behind at knee height: crew socks rising out of a padded collar, a stiff heel
  counter, a thick white midsole (about 1.5 in) with a clear air unit, the lace cage seen past the ankle, and under
  each shoe a clean mirror copy in the polished floor. The boards behind show staggered butt joints every few feet
  and a dark apron with a coloured border line.
- `photos/commons-nike-huarache-white-upper-stanton.jpg` and `commons-kobe-ad-on-court-line-stanton.jpg` (new,
  Commons, Stanton Street Courts): white leather uppers from above, lace rows (6-7 crossings), a pull tab at the heel,
  toe box perforations, the midsole wrapping up at the toe. The Kobe shoe sits on a painted court line: the line is
  as wide as half the shoe.
- `photos/commons-basketball-reisio-pd.png` (new, Commons "Basketball.png", Reisio, public domain): a real pebbled
  ball, eight black channels. Used as the ball itself (copied to `public/nba-floor/cornerswing-ball.png`).
- `diagrams/commons-nba-court-dimensions-wikideas1-cc0.webp`: board pattern (short staggered boards), line weight.

What would give a fake away: lines drawn as 1 px strokes, a floor without glare at a low angle, shoes without a
reflection, a flat white shoe with no midsole, a ball as an orange circle, perfectly regular boards.

## The real thing and its parts

- One floor in feet (plan coordinates): rim centre origin, x right, y toward half court; baseline outer edge y -5.42,
  sideline 25..25.17 (boundary lines are out of bounds), corner line 21.83..22, arc r 23.75, lane 16 ft to the free
  throw line y 13.75, restricted area r 4, board face y -1.25. Maple strips 2.25 in running along y, staggered butt
  joints, grain streaks on the close boards, a 3 ft stained apron, then navy.
- One pinhole camera (eye, yaw, pitch, focal length) moving continuously: tilted -> top-down (ARC view) -> CORNER
  FRAME -> shoe height looking along the sideline. Polygons are clipped at the near plane so the floor survives the
  low camera.
- Sneakers built in 3D (sole, white midsole, upper lofted from sections, laces, pull tab, collar, sock, lower leg that
  rises in only as the camera comes down), painted back to front, each with its floor reflection.
- The ball is the real photo, rolled as it travels, its contact shadow tightening at each catch.

## Word, then change

| word | change |
|---|---|
| Picture | the Bowen card rises big over a tilted floor, credit "Keith Allison, CC BY-SA 2.0", slow push toward the ball |
| ball | lands: push stops; the card lies back flat and fades as the floor un-tilts to top-down; the ball lifts out of the photo and drops onto the top of the key |
| swinging | lands: pass 1 top -> right wing lands on "-ging", pass 2 wing -> right corner, sheen trail on the boards |
| shooter | lands: the ball reaches the corner; the white sneakers set down behind the corner line, the ball held over them |
| standing | the camera eases toward the corner |
| alone | lands: the rest of the floor dims; the empty boards between the corner and the lane brighten a touch |
| corner | ends on: CORNER FRAME, top-down: corner line, baseline, sideline, the 3 ft strip |
| heels | lands: the camera drops to shoe height behind him, looking along the sideline: heels, socks, the white paint running into depth, the dark apron |
| step | lands: the strip of maple between the near heel and the sideline paint lights, grey hairline across it, "a step" |
| sideline | ends on: the sideline paint brightens to crisp white, the apron darkens; slow push along the line to the handover |

## Sound-off test

A real corner three, then a ball moving across a real court to the corner, a pair of shoes alone there, and finally
the shoes from behind with the sideline a step away. A stranger reads: the corner shooter stands right at the edge of
the floor. That is exactly what the next scene (the width) measures.

## Review pass (shoe height, 14.1-16.05 s)

Read again next to the Parker heels and the Clarkson floor, after the reviewer's notes:

- Shoes: every surface is now a fine mesh (52 stations x 40 around the upper) lit per vertex with two diffuse lights
  and a glossy highlight, faces blended from their lit corners, plus a 1 px soften at shoe height. There are no seam
  strokes. Silhouette from the Parker photo: a round heel with a moulded counter that swells back at mid height,
  the collar highest at the Achilles and dipping where the sock comes out, the padded tongue rising in front. The
  midsole is 1.8 in under the heel and thins to the toe, with a grey air window under the heel and a dark outsole
  edge. A navy side overlay is drawn as its own panel on the leather, so its edges are clean curves. Laces sit on the
  tongue's slope. White crew socks with two navy stripes; the leg above has a calf taper, side light and a shadow side,
  and fades upward into the dark arena. From above, each sock shows as a circle with the leg's cross-section in it,
  and the player's soft shadow falls beside his feet.
- Mirror: about 0.52 at shoe height. Each shoe's reflection is sharp at the sole and fades over 9 in, as in the photo.
  Four soft light streaks run down from the horizon, the glare band seen at a grazing angle in the Clarkson photo.
- Boards: 22 grain streaks per close board (light, dark and mid), redder heartwood boards one in seven, and hairline
  butt joints up close.
- Above the horizon: the far-baseline and right-side stands in 16 tiers with a dim crowd, a courtside row, a ribbon
  board, and the arena haze. The camera is pitched 15 degrees and turned 15 degrees, so the whole pair sits in
  frame and the floor fills most of the band.
- On "swinging" the camera sits closer over the right half (29.5 then 33 px per ft), so the ball and the shoes read.
