# PointsPerShot (scene `points`, 43.74-54.92 s)

"Now turn that into points. A corner three is worth about one point one six points per shot. A long two, from
sixteen feet out to the line, went in forty percent of the time, which is only zero point eight."

## What I looked at (full size)

- `pages/bbref-curry-2026-shot-chart.html` (fetched for this scene, a real Basketball-Reference shot chart page,
  Curry 2025-26): the chart is a 500 px court image (10 px a foot, basket at the top) with one absolutely placed
  glyph per shot: `class="tooltip make"` is U+25CF "●", `class="tooltip miss"` is U+00D7 "×", 390 makes and 448
  misses on the page. Each tip reads "Made 3-pointer from 27 ft". That is the convention the creator's posts already
  use: filled dot = made, x = missed. Marks overlap freely: a real chart is a cloud, not a grid. Corner threes sit in
  a tight column just behind the straight line, thickest near rim level and the baseline; long twos cluster just
  inside the line (a foot on the line) and at the elbows and baseline.
- `pages/bbref-2026-screenshot-top.png` + LeagueTable.md: League Average row, FG% by Distance: 2P .550, 0-3 .703,
  3-10 .463, 10-16 .446, **16-3P .401**, 3P .360; Corner 3P% **.387**. Type: Verdana (DejaVu Sans on that
  screenshot), bold on the League Average row, #EEE ground, grey rules, numerals right aligned, leading zero dropped.
  The column head is literally "16-3P".
- `photos/commons-lufkin-50ft-*` at full size: red pebbled leather case, chrome band, chrome face "UNIVERSAL / THE
  LUFKIN RULE CO. / SAGINAW, MICH.", folding crank with a ball knob, dark blued blade with white etched graduations
  and big numerals, bent steel triangle ring at the end. The RulebookArc tape was drawn from it; I copy its drawing
  into my own file so the tape is the same object.
- `diagrams/commons-nba-court-dimensions-wikideas1-cc0.webp`: 50 ft wide, 16 ft lane, 15 ft to the free throw line,
  22 ft corner, 14 ft straight run, 23'9" arc. Honey maple in long staggered strips.
- RulebookArc code and notes: the floor palette, the 2 in paint, the camera helpers, the gold slivers. My scene
  continues the same floor.

What gives a fake away: a grid of evenly spaced marks (real charts are clouds), marks the same size as the paint
lines, numbers that do not add up (387 x 3 must be 1,161; 401 x 2 must be 802), a long-two zone drawn as a ring that
ignores the straight corner lines, a "40%" with no source.

## The real thing and where each part comes from

1. The floor: the same half court as `arc` and `percent` (Rule 1 geometry, honey maple, charcoal lane, 2 in paint,
   gold slivers lit), copied from RulebookArcFloor.
2. 1,000 corner threes in the right corner strip (x 22..25 ft, baseline to the kink), placed like a real chart:
   tight to the line, thickest from the baseline to rim level, ● white for 387 makes, × grey for 613 misses.
3. Every make pays 3 points: a white "3" pops off the dot and flies into one total, which counts with each arrival
   (so the counter is the sum of the 3s it has received, 0 -> 1,161), then divides by its 1,000 shots: 1.16.
4. The tape, ring on the pin at the basket, pays out to 16 ft and swings a thin gold ring of radius 16 (gold =
   distance from the basket, the reel's one invisible).
5. The long-two band: between that ring and the three-point line, clipped by the straight corner lines and the
   baseline (the real BBR "16-3P" zone). Its head is BBR's own column head "16-3P", in the table's type.
6. 1,000 shots fill it from the ring out to the line; the League Average ".401" cell drops in; 401 of the x flip to
   dots; each pops a "2" into a total: 802 -> 0.80.
7. The two values stay on the floor, each tied by a hairline to its zone, sized by their value (0.80 is 0.80/1.16
   of the 1.16's size): the gap is seen.

## Word, then change

| word | change |
|---|---|
| (mount) | `percent`'s floor at ARC FRAME, slivers lit, "38.7%" in the corners |
| Now turn that | the camera eases down into the right corner (64 px/ft); the floor dims to a chart ground; "38.7%" rides along |
| points. | lands: 1,000 marks rain onto the right corner strip from the baseline up, 387 ●, 613 × |
| A corner three | from the baseline up, every ● pops a white "3" |
| is worth about | the 3s fly into one white total, counting 0 -> 1,161 as they arrive; grey "points from 1,000 shots" |
| 1.16 | lands: "÷ 1,000" and the total rolls to "1.16"; grey "3 x .387" under it, label "points per shot" |
| points per shot. | the camera rises to the whole floor; the 1.16 parks top right with a hairline to its corner; corner marks fade to texture |
| A | the tape arrives on the pin and pays out from the basket |
| long | lands: the blade stops at 16 ft and swings the gold 16 ft ring |
| two, | lands: the band between ring and line lights; "16-3P" slides on in BBR's type, grey "long two" |
| 16 | lands: reading window "16' 0"" |
| feet out to the line, | 1,000 marks fill the band from the ring out, ending at the line on "line," |
| went in | the ".401" cell drops onto the band (BBR's bold League Average cell) |
| 40% | lands: "40%" counts up, 401 × turn to ● |
| of the time, | every ● pops a white "2" |
| which is only | the 2s fly into a white total, 0 -> 802 |
| 0.8. | lands: rolls to "0.80", grey "2 x .401"; it sits beside the 1.16, smaller by its value |

## Sound-off test

A stranger sees the corner strip filled with a shot chart, every make paying 3 into a pile that comes to 1,161 on
1,000 shots, 1.16 a shot; then a tape measures 16 ft, the zone from there to the line fills with shots, 40% go in,
each pays 2: 802, 0.80 a shot, sitting smaller beside the 1.16. The two zones are a step apart on the same floor.
