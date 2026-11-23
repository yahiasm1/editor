# PossessionAtRim (scene `cost`, 18.32-22.28 s)

"So analysts count the cost. Every shot uses up one of his team's chances."
Key words: count 19.08, shot 20.38, one 21.18. Silence before: 17.92-18.32; after: 22.28-22.55.

## What I looked at

- `photos/commons-wemby-spurs-2024-toronto-h4stings-ccbysa4.jpg` at full size, cropped round both baskets. Each
  shot clock is a black box on top of the backboard: a top line of game clock digits (warm white / amber, "9:41"
  readable at the near basket), a big red LED "24" below, a dark sponsor plate (Tissot) under it. The board is clear
  glass with a white painted border and the white shooting rectangle; black padding on the bottom edge; the stanchion
  is a black padded base behind the baseline, a post and a long arm reaching over the baseline to the back of the
  board. The floor is satin: the board, the stanchion and players reflect in it as soft streaks. Arena light from
  high above, warm, no hard shadows, a soft pool round each player's feet.
- `pages/bbref-pbp.html` round 10:04 of the 1st quarter, the real possession of shot 2:
  10:29 Missi 2 of 2 FT (NOP 4-3) / 10:09 D. Vassell misses 3-pt jump shot from 26 ft / 10:09 offensive rebound by
  V. Wembanyama / **10:04 V. Wembanyama makes 2-pt dunk at rim (SAS 5-4)** / 9:55 New Orleans full timeout.
  BBR's shot chart tooltip for it: "1st quarter, 10:04.0 remaining / Victor Wembanyama made 2-pointer from 0 ft /
  San Antonio now leads 5-4". `wemby-shots-court.json` n=2: x 0.19 ft, y -0.49 ft from rim centre, made, 2 pts.
- NBA rule (since 2018-19): an offensive rebound after the ball hits the rim resets the shot clock to 14. So the real
  clocks for this possession: rim hit at 10:09 -> 14; dunk at 10:04 -> shot clock 9; made basket -> 24 for the
  Pelicans. The 24 the plan wants appears where it is true: when the chance is gone and the ball changes hands.
- Hoop geometry (NBA): rim 10 ft, 18 in inner ring, centre 15 in out from the board face (5.25 ft from baseline);
  board 6 x 3.5 ft, face 4 ft from the baseline, bottom edge 6 in below the rim (9.5 ft); shooting rectangle 24 x 18 in
  with its bottom line level with the rim; net 12 loops, about 18 in long, tapering, diamond mesh; ball 9.4 in.
- The court of the other builders (`PlayByPlayLogCourt.tsx`): maple hsl(34-39, 52-64 %, 70-79 %), 2.25 in strips with
  staggered end joints, lane #0A0B0D -> #16181C with a silver #C4CED4 inner edge, apron #0E1013, lines #F4F6F8,
  rim #E2582A, gold #F2B33D, label grey #8B949E. I use the same values so it is the same floor seen from lower.
- The box score's last frame (`PhoneBoxScore.tsx`): the lifted row with FGA 29 and FTA 6 gold, "what it cost".
- What gives a fake away: a hoop seen dead flat like a clip-art icon, a net drawn as a cone with no knots, a ball with
  no seams, a shot clock that counts 24 down for a putback, a floor with no reflection, a disc that floats.

## Think

The real thing: one real possession, 1st quarter 10:09-10:04, seen from low in the side stands at the Spurs' basket.
Camera at 13 ft high, 22 ft out, 4 ft right of centre, looking at the rim: backboard, clock, rim and net in the upper
half, the lane and the floor under the rim in the lower half, so the disc under the rim reads as an ellipse.

Parts and where each comes from: shot clock box, digits and plate (Toronto photo); glass board with border, rectangle,
padding, LED edge strip (Toronto photo, NBA rule sizes); stanchion base and arm (Toronto photo); rim, flange, 12-loop
net (NBA rule); floor, lane, lines, joints (the reel's court); his spot and the make (BBR shot chart + pbp).

Details a viewer would miss only if gone: the floor reflecting the board and clock; the net's knots and its swish;
the rim shaking on the miss; seams on the ball; the shot clock going 14 on the rim hit; the game clock ticking
10:09 -> 10:04 while the shot clock ticks 14 -> 9; the ball's shadow shrinking as it rises.

Word, then change:
- `So analysts` (from scene.from - 6): the camera drops from above the court down to under the rim; the gold FGA 29
  cell falls in from the top of the stage.
- `count` lands: the cell hits the floor at the baseline, left of the lane, and becomes a counter "0 / 29" (FGA).
- `the cost.`: the clock box lights, 10:09; a ball comes off the rim front (Vassell's miss), the rim shakes, the shot
  clock blinks to 14; the ball drops to the floor at his spot and bounces.
- `Every`: the ball rises from his spot, clocks running (10:09 -> 10:04, 14 -> 9).
- `shot` lands: the ball is slammed down through the ring, the net whips; game clock 10:04; BBR's line for it writes
  in by the rim: "1st quarter, 10:04.0 remaining / made 2-pointer from 0 ft".
- `uses`: the ball hits the floor; the shot clock snaps to 24; the ball is inbounded toward the Pelicans' end, past
  the camera, out of frame.
- `up` lands: a gold disc drops onto his spot and settles into the boards with a weight bounce.
- `one` lands: "chance" writes on the disc's hairline label; the counter rolls to "1 / 29".
- `of his team's chances.`: the camera drifts up and back along the lane toward the free throw line, the disc
  staying on its spot, the shot clock counting down for the Pelicans.

Sound-off test: a stranger sees a real basket and its clocks, a ball going in, the clock going to 24 and the ball
leaving the other way, and a gold disc left behind on that spot labelled "chance" while a counter goes 0 -> 1 of 29.
A made shot still spent one of 29 chances.

## Built and checked

Camera at 16 ft high, 21 ft out, 4 ft right, after dropping in from 40 ft above the court; it drifts up the lane to the
free throw line from "of". Stills at 18.25-22.25 and a render of 18.0-22.6 read against the Toronto photo crops:
clock 10:09 lit on "the", 14 on the rim hit, 10:04 / 9 at the dunk on "shot", 24 on "uses", 23 as the Pelicans run;
counter 0 / 29 on "count", 1 / 29 on "one"; `check.py render` ok (no hold over 1.2 s, no bare handover frame).

## Reviewer pass 2 (applied)

Looked again at the Toronto photo cropped round the near basket (x 640-1060, y 640-920 of the original): the stanchion
base is a padded black block with a lit LED panel on its court face; a row of courtside seats sits right behind the
baseline (black padded chairs, fans in mostly dark clothes); photographers sit low along the baseline with white long
lenses on the rim; the shot clock has a plate under the digits (drawn plain, no sponsor name, as the plan says).

- The miss: the ball now hits the front of the ring, pops up in front of the glass, drops to the right in front of the
  rim, bounces once in the lane and checks back on its backspin to his gather spot. It is drawn in front of the net
  whenever it is nearer the camera than the ring. The ring jolt is stronger.
- Who has the ball: a rounded Commons card of Wemby holding the ball (Daiei Onoguchi, CC BY 4.0, the `cropped2` frame,
  public `possessionatrim-wemby-onoguchi.jpg`) rises on "Every" at the top right, with a credit and his name.
- The arena (`PossessionAtRimCourtside.tsx`): three rows of courtside seats on risers with seated fans, out of focus,
  then lit modular LED boards (6 ft panels with the Spurs mark, a silver sweep), then six baseline photographers with
  white long lenses aimed at the rim. The stanchion base got its rolled pad, seams and the lit LED panel with the Spurs
  mark spilling light on the apron. The shot clock unit got its taller backlit plate.
- The camera drift from "of" now pulls back along the lane while it keeps aiming at the basket. The clock box stays
  inside the stage (top at about y 600), and the Pelicans' 23 is readable to the end.
- The play-by-play card leaves on "up" (gone by 21.3 s), so "chance" and 1 / 29 carry the end.
- Checked: stills at 18.4-22.37 s, bursts at 1/60 s across both handovers and the miss, and `check.py render` on
  18.0-22.6 s, all ok.
