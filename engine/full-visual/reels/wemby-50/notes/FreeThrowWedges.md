# FreeThrowWedges (`freethrow`, 22.60-29.42 s, next scene at 29.84)

"A trip to the free throw line usually means two shots for one chance, so each free throw counts as a little under
half a shot, 0.44."

## What I looked at

- `photos/commons-wemby-toronto-ft-cropped-h4stings-ccbysa4.jpg` (1050 x 1400, full size): Wemby in the black
  Spurs road jersey (silver trim, "SPURS" down the front), ball held at his chest in both hands, right elbow up,
  feet set just behind the line. Seen from the upper side stands, about 35-40 degrees down. The free throw line is
  the left edge of the red lane, photo px (442,737) to (108,1022); his feet at about (240,860), just behind it. The
  lines on this court are black. Players lined on the lane (19 Poeltl, 30 Sochan, 9 Barrett), referee 17 standing
  at the lane's corner, the circle's black arc running from his left. Light from the arena roof: soft, no hard
  shadows, satin sheen on the maple, reflections of the players in the lacquer of the red paint.
  Credit: H4stings, CC BY-SA 4.0. A Feb 2024 game in Toronto, so never labelled as Saturday's game.
- The uncropped Toronto photo: the whole court in perspective from the same seat, backboard and stanchion at the
  right. The angle I tilt to for the shots.
- `pages/bbref-pbp.html`, his free throws, real copy, in order:
  - 1st Q 9:37.0 "makes free throw 1 of 2", "makes free throw 2 of 2" (shooting foul by D. Queen)
  - 1st Q 1:09.0 "misses free throw 1 of 1" (the and-one after a 4 ft jumper)
  - 2nd Q 9:27.0 "makes free throw 1 of 2", "makes free throw 2 of 2" (technical foul)
  - 2nd Q 2:02.0 "makes free throw 1 of 2" (then a lane violation by S. Castle wipes the second)
  Six attempts, five made: matches the NBA box row FTM 5, FTA 6. The trips really were two, one, two and one shots:
  exactly why 0.44 is "a little under half". I show the six; I do not claim the reason on screen.
- `pages/bbref-glossary.html`: "TSA - True Shooting Attempts; the formula is FGA + 0.44 * FTA." (facts.md row 7)
- Rules geometry (plan.md): lane 16 ft wide, free throw line 15 ft from the board face (19 ft from the baseline),
  circle radius 6 ft, rim 18 in inside, centre 5.25 ft from the baseline, board face 4 ft out, board 6 x 3.5 ft with
  its bottom at about 9.5 ft, inner square 24 x 18 in sitting on the rim's height, rim at 10 ft, the block and hash
  marks (7 ft, then 11, 14, 17 ft). Maple strips 2.25 in, lines 2 in. Ball 9.4 in across.
- `PlayByPlayLogCourt.tsx` (sibling scene): the reel's floor look (honey maple strips, staggered end joints, Spurs
  black lane with silver edge, white lines, light sweep). I keep that look so the floor is one world, drawn my own way.
- Example `iphone-keyboard/KbZoneGrow*` and `pewdiepie/map.ts`: one camera, one world, the mechanism shown slowly
  on the words, an honest tag where needed.

What would give it away as fake: a lane with the wrong proportions, the ball not reaching the rim at 10 ft, a disc
that looks like a poker chip, a sliver that is not 0.06 of a disc, six free throws that are not his six, an invented
formula.

## Think

The real thing: one trip to the line. The photo shows it as people know it; the floor shows its geometry; the disc
shows its cost. All on one floor seen through one real 3D camera (feet, pinhole projection, pitch from top-down to
the stands angle), drawn as projected SVG so it stays sharp from 30 to 300 px per foot.

Details that make it real: the maple strips and their end joints and grain at macro, the 2 in white lines with true
width, the lane hash marks and the block, the backboard standing at 4 ft with its inner square, the orange rim at
10 ft with a laced net, the ball's seams spinning backwards, the ball's shadow separating from it as it rises, the
disc's edge and contact shadow, the cut faces of the wedges catching light.

Word, then change:

| Word | On screen |
|---|---|
| (lead in) A trip to the | the photo card is up big and centred over a dim floor, a slow push in on him with the ball at his chest |
| free throw | a white hairline traces the real free throw line in the photo, under his feet |
| line (lands) | the card shrinks to the top left; the lane paints on top-down at true geometry, the free throw line last, then "15 ft" from the board |
| usually means | the camera tilts up to the stands angle; the backboard stands up, the rim lifts to 10 ft |
| two (lands) | ball 1 leaves the line, arcs, drops through the net; ball 2 on "shots"; their arcs stay as two hairlines, "2 shots" |
| one (lands) | one gold disc drops onto the line under both arcs, bounces, settles; "1 chance" |
| chance, ... | the camera comes down to the disc on the line: macro, boards and paint at real width |
| so each free throw | the disc cuts in two along the line's normal and the halves slide apart, "free throw 1 of 2", "2 of 2" |
| counts as a little | round each half the hairline outline of the whole disc draws: what one shot is |
| half (lands) | "0.50" lands over each half with a tick at the cut |
| a shot, | a sliver shaves off each half and falls away; the numbers run 0.50 to 0.44 |
| 0.44. (lands) | "0.44" lands; the camera pulls back: his six real free throws line the free throw line as six 0.44 wedges, 5 made dots, 1 x, each with its clock; BBR's line types on under the court: "TSA = FGA + 0.44 * FTA" |

Sound-off test: a real photo of him at the line, the line itself measured, two balls go in, one gold disc lands
under them, the disc is cut in two and each half is shaved to 0.44, then his six free throws each count 0.44. The
stranger reads: two free throws together are worth one chance, so each is a bit less than half of one.

Hand-over in: `cost` ends drifting up the lane toward the line with its disc; I open on the floor already there,
dim, under the photo. Hand-over out: the last picture is the free throw line with six gold wedges, which `attempts`
picks up from the stands.

## Review (fresh eyes)

Fixed in review: "1 chance" and "2 shots" stayed up for 0.2 s, so the camera dive now starts at chance+14 and the tags,
trails and hoop hold until it does; the "15 ft" measure stays until just before "two"; "1 whole shot" was cut off at the
left edge, now centred above the two outlines; the six made/miss marks and clocks land left to right after the pull-back,
not on the first two wedges while they still travel.
