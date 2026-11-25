# HookX1 (h1): gold flood over the floor

"Kobe Bryant once scored more points in one half than the entire Toronto Raptors team." 0.12-3.90 s, dark.

## What I looked at

- `photos/commons-kobe-81-night-staples-2006-endlessbender-ccby2.jpg` (960x720), at 3x with a source-px grid. Upper deck,
  looking down the sideline at the Raptors' basket (right). Maple in long satin strips, gold sideline band at the far
  side (inner edge runs (0,472) to (550,355)), purple lane at right, the gold Lakers centre logo at (310,540), red
  "STAPLES Center" lettering along both sidelines, the scorer's table bottom right, the coach in a brown suit and the
  referee on the near side. The half-court line is a thin purple line from the far sideline at (65,458) through the
  centre logo to under the scorer's table at about (625,629): y = 461 + 0.2995 (x - 75). Everything with the
  players is beyond it (far half), the near half below it is empty maple.
- The five red jerseys, read off the grid (source px, head top / feet): #5 Jalen Rose (353,413)/(345,492);
  bent-over Raptor in front of the lane (597,363)/(605,448); the one behind him (608,343)/(618,418); #4 Chris Bosh
  (673,332)/(673,416); the one at the right of the lane (728,350)/(733,430). Players are 75-85 src px tall at y~420,
  the referee ~90 at y~620: depth scale h = 80 + 0.104 (y - 420).
- Kobe himself is in the photo: white #8 at (525,370)-(527,433), in a defensive crouch at the top of the key.
- `cutouts/startingfivespotlights-kobe-full.png` (807x1288): the Joseph A. Lee gold #8 free throw photo, head to
  thighs, ball held low in both hands at about (470,1090). Copied as `public/kobe-81/hookx1-kobe.png`.
- `kobe-81-scoring.json`: Kobe's second half is 31 makes = 55 points (2,2,2,3,3,3,2,1,3,...); the Raptors' second
  half is 26 makes = 41. The bulbs pour in that real order and size: a 3 is three bulbs at once, a free throw one.
- `StaplesNightBoard.tsx`: the dark board `night` lights, parked at (90,532,900,160); `night` blurs it in at
  scene.from - 2. The hook leaves the same box dark in the same place.
- Bulb look from the plan and `OneAgainstFive`: Lakers gold #FDB927 globe with a hot core and a halo; Raptors red #CE1141.

## Word table (one hero: the night photo, one continuous transformation)

| Word | Real thing | What happens |
|---|---|---|
| frame 0 | the night photo, Kobe | photo full on the stage on a slow push; Kobe's gold #8 cut-out front left; gold bulbs already arcing out of his hands onto a pile on the near half, red bulbs already dripping off the red jerseys |
| Kobe 0.12 | Kobe | a warm rim light runs up his edge, his credit line writes in |
| Bryant / once | the real night | "January 22, 2006" lands small grey top left; a small gold tick finds the real #8 in the photo |
| scored / more points | his second-half makes | gold pours two or three at a time (his real 2s and 3s), piling at his feet; red drips one or two at a time into five little heaps at the Raptors' feet; gold is taller before 1.0 s |
| one 1.76 | the half-court line | the photo's real half-court line draws on in white; the far half dims, the near half stays lit |
| half 1.94 | one half | the gold pile settles on the lit half: a squash, a glow pulse |
| than the | | camera leans toward the players, the red heaps glint |
| entire 2.54 | the whole team | a Raptors-red ring snaps round each of the five real jerseys, one every 0.08 s |
| Toronto 2.98 | the Raptors | the Raptors logo (cdn.nba.com, bare) lands over them; the five red heaps slide together into one small pile on the far half |
| Raptors 3.30 | THE MOVE | the gold pile leans, tips over the half-court line and rolls up the real maple as a flood, hopping and decelerating, over the ringed jerseys, burying the red pile; the far half's floor glows gold |
| team 3.64-3.90 | | payoff holds, bulbs breathing, light sweeping the gold |
| 3.90-4.2 | handover | the photo dims to navy; the small dark scoreboard box is left at the top for `night` |

## Sound-off test

A man in gold has more lit gold balls than five men in red have red ones; a line splits the floor in two; his pile,
on one half, swallows theirs. Numbers stay honest: 55 gold bulbs, 41 red, his and their real second halves.

## Built and checked

- Piles are settled once at load (disks dropped and rolled to a groove, radii 0.72-1.28 so the heap is not a lattice).
- The flood: the pile leans 13 deg from "Raptors" - 9 f, lets go top first over 10 f, each bulb rolls with a back-out
  ease, 2-3 decaying hops, a floor shadow and a short streak; 39 settle as a mound over the red pile (red pressed into
  the floor and dimmed), 16 roll on toward the lane and #5. The far half's maple lights gold from the line outward,
  camera flashes pop in the stands during the hold.
- Handover: the photo fades out over 16 f after "team"; the dark `StaplesNightBoard` (power 0) blurs in at its parked
  rect and is counter-translated through the Stage lift-off, fading over the last 4 f while `night`'s own copy blurs in.
- Stills read every 0.25 s from 0 to 4.4 s and a 1/60 s burst over 4.13-4.38 s.
