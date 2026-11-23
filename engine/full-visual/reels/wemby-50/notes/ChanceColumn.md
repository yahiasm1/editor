# ChanceColumn (`attempts`, 29.84-37.08 s, next scene at 37.48)

"Add it up and Wemby used about thirty-one and a half shots. Fifty points on those is one point five eight points
every time he shot."
Key words: up 30.14, 31.5 31.40, 50 33.20, 1.58 34.56, shot 36.80. Silence before 29.44-29.77, after 37.03-37.40.

## What I looked at

- `photos/commons-wemby-spurs-2024-toronto-h4stings-ccbysa4.jpg` at full size: the camera of this scene. Upper side
  stands, about 45-50 degrees down from level, the basket at one end of the frame, the whole half court in
  perspective, the near sideline at the bottom, the far sideline and the benches at the top. Light from the roof,
  soft, a satin sheen on the maple, the lane's lacquer reflecting players. The stanchion stands behind the baseline:
  a black padded base, a post, an arm over the baseline, the glass board, the shot clock box on top. I match its
  height and tilt, never its red paint.
- `wemby-shots-court.json`: his 29 field goal attempts in feet from the rim centre (x right, y toward half court).
  Floor y = y_ft + 5.25. Twelve sit inside 3.5 ft of the rim (two of them on the very same spot, 0.19 / -0.49, at
  1st Q 10:04 and 7:00), eleven threes (left corner 2nd Q 9:03, left wing twice, top right), four mid-range, two
  short. Discs 1.6 ft across cannot lie side by side at the rim: they pile, which is what twelve chances at one
  basket really look like. I stack overlapping discs by game order.
- `pages/bbref-shots.html`: the shot chart frame. 500 px wide court image = 50 ft (10 px/ft), markers with origin
  rim at left 238.1, top 33.9 (the planner's fit, 9.88 px/ft, residual under 0.5 ft), "make" / "miss" classes:
  BBR's filled dot and x. I keep that convention on the floor under each disc.
- `pages/bbref-glossary.html` and facts.md: TSA = FGA + 0.44 * FTA; 29 + 0.44 x 6 = 31.64; 50 / 31.64 = 1.580.
  NBA box: FGA 29, FTA 6, PTS 50. The voice says "about 31.5"; the stage shows the computed 31.64.
- The scene before me (`FreeThrowWedges`): it ends on the camera tx 0, ty 17.6, pitch 0.56, D 26.6 over the free
  throw line, with his six 0.44 wedges lying on it at x -4.9..4.9, five dots and one x, and the glossary formula
  typed under the court. I open on that same floor and those same six wedges, and pull back.
- The floor values shared by the reel's courts (`PlayByPlayLogCourt`, `FreeThrowWedgesFloor`): maple strips
  hsl(33-39, 50-64 %, 66-76 %), 2.25 in, staggered end joints; lane #0B0C0E -> #17191D with a silver #C4CED4 edge;
  lines #F4F6F8; rim #E2582A; gold #F2B33D with the darker rim #B57F1C and edge #6E4A0E -> #D89A2C; labels #8B949E.
- The disc as the reel defines it (plan, FreeThrowWedgesDisc): flat gold, 1.6 ft across, 0.19 ft thick, thin darker
  rim, soft contact shadow, lit from the roof. No print, no stripes. Points fill it white, up to 2 points = full.

What gives it away as fake: a court with the wrong proportions or a stretched three point arc; discs not on his real
spots (a tidy grid, a symmetric spray); discs floating with no shadow; a stack that does not add to 31.64; a fill
that is not the same level in every disc; 31.5 written as a computed number.

## Think

The real thing: his 29 field goal attempts and 6 free throws, on the floor where they were spent, then added up the
way Basketball-Reference adds them (TSA), then divided into his 50.

- Court: true geometry from NBA rules (plan), seen from the side stands like the Toronto photo, basket at the left,
  half court to the right; stanchion, glass board, rim, net, shot clock box behind the baseline.
- Discs: gold solids at their real spots (wemby-shots-court.json), BBR's dot / x on the floor under each.
- Column: beside the court on the right, the discs heavier and nearer, the same light, the same ellipse as on the
  floor; 29 whole discs and the six wedges fused on top into 2.64 (two whole discs and 0.64 of one: the six 0.44
  wedges regroup, nothing added or lost).
- Fill: white liquid inside each disc. In the column you see it as a level on each disc's edge band; on the big disc
  turned to face you it is a level across the face.

Details a viewer would miss only if gone: the pile at the rim, the marks left on the floor when the discs lift, the
shadow of every disc separating from it as it rises, the column's contact shadow and the small settle, the cut faces
of the wedges as they fuse, the meniscus line on every fill, the net and the shot clock behind the baseline, the
light sweep crossing the boards and the column.

| Word | On screen |
|---|---|
| (lead) Add it | the camera pulls back and rises from the free throw line (the last frame of `freethrow`) to the side stands over the whole half court; his 29 discs drop onto their real spots in game order, the six wedges still on the line |
| up (lands) | THE BIG MOVE: every disc dips and lifts at once, the shadows stay on the floor, and they stream in a curve to one column beside the court, landing one on another with weight (29), the counter at the base running 0 -> 29 |
| and Wemby used | the six wedges fly in last and lie in three layers on top; they fuse: two whole discs and 0.64 of one, "+ 2.64" |
| (ends on) 31.5 | "29 + 0.44 x 6 = 31.64" has written itself above the column term by term as the pieces landed; label "shooting chances" with a hairline to the column; the floor keeps his 29 marks |
| 50 (lands) | a white 50 drops from the top of the stage onto the column's top disc |
| points on those | the 50 melts into the top disc and the white runs down the column, filling every disc in turn to the same level |
| (ends on) 1.58 | every disc filled level, "50 / 31.64 = 1.58" under the first line, "points per chance" |
| every time he shot (shot lands) | one disc slides out of the column, grows large and turns up on its edge to face you: white to 79 % of its height, a 0 / 1 / 2 scale on its rim, the level marked 1.58 |

Sound-off test: gold discs sit where he shot on a real court; they all fly into one tall stack, and the stack's
count is written as BBR's formula; white pours into the stack and settles at the same height in every disc; one
disc, pulled out, shows that height is 1.58 on a scale where a made two would be 2. A stranger reads: he used 31.64
chances, and each one gave 1.58 points.

Hand-over out: the last picture is one big disc standing on its edge at stage centre, fill 1.58 on its 0 / 1 / 2
rim scale, the column and court dimmed behind; `trueshooting` starts from a disc standing on edge with that scale.

## Built and checked

Camera: from freethrow's last view (eye 0 / 31.7 / 22.5, target the free throw line) to the side stands (eye -66 / 30
/ 60, basket left, near sideline at the bottom), then a slow push. Column at screen x 860, base y 1392, 105 px/ft,
elevation 0.72 rad; the pulled disc ends at (430, 1085), 280 px/ft, tipped 0.3 rad short of face-on, fill 0.79 with a
0 / 1 / 2 ruler on its right and "1.58" on the level. Stills at 29.6-37.3 and a clip 29.4-37.6 read at full size;
`check.py render` ok (no hold over 1.2 s, no bare handover frame). Fixes from the comparison: the camera turned to a
true side view (the first one read as a corner view), the empty part of every disc darker so the level reads as a
stripe on the column, maple base under the strips (moiré), the ruler only once the disc has arrived, the source line
moved off the court.
