# LeagueTable (scene `percent`, 32.94-43.52 s)

"Twenty-one inches sounds like nothing, but the shot feels it. Last season NBA teams made thirty-eight point seven
percent of their corner threes, and only about thirty-five percent of the threes above the break."

## What I looked at (full size)

- `pages/bbref-2026-screenshot-top.png` (1400x1000) and the raw `pages/bbref-2026.html`, table `shooting-team`.
  The real table, read cell by cell: 35 columns. Over-header row "% of FGA by Distance" (6), "FG% by Distance" (6),
  "% of FG Ast'd" (2), "Dunks" (2), "Layups" (2), "Corner" (2), "1/2 Court" (2), each separated by a narrow blank
  spacer column. Header row: Rk, Team, G, MP, FG%, Dist., 2P 0-3 3-10 10-16 16-3P 3P, 2P 0-3 3-10 10-16 16-3P 3P,
  2P 3P, %FGA Md., %FGA Md., %3PA 3P%, Att. Md. 30 team rows, then the tfoot "League Average": 82 19781 .471 14.3 |
  .585 .231 .209 .095 .049 .415 | .550 .703 .463 .446 .401 **.360** | .537 .854 | .061 398 | .264 1102 | .246
  **.387** | 1.0 0.5. The screenshot is cut before the last column: .387 lives off its right edge, in "Corner 3P%".
  Look: white page, rows 23 px apart, light grey (#DDD) row rules, faint dotted vertical rules between columns,
  right-aligned numerals with the leading zero dropped, Rk in grey, team names underlined (link blue on the site,
  drawn here in the table's dark ink: no blue on stage), an asterisk after playoff teams. League Average: bold,
  #EEE ground, a dark grey (#747678) rule above and below. Face: the screenshot was taken on Linux, so BBR's Verdana
  fell back to DejaVu Sans; I load the same DejaVu Sans (Verdana metrics) so the redraw is the page itself.
  Section heading on the page: "Shooting Stats", with its "Team | Opponent" toggle; page title "2025-26 NBA Season
  Summary".
- `photos/commons-korver-cavs-2017-erikdrost-ccby2.jpg` (1920x1280): Korver in black Cavaliers sleeved jersey at the
  top of his release, ball above his right hand, Aaron Brooks (00, Indiana yellow) contesting at right, Monta Ellis
  (11) below, the wine-and-gold centre logo and the "Quicken Loans Arena" lettering on the maple behind him. Light
  maple, almost white under the arena lights. Credit "Erik Drost, CC BY 2.0".
- `photos/commons-lufkin-50ft-steel-tape-*`: blade dark blued steel, white etched ticks, inch numerals, bent wire
  ring; red pebbled case, chrome rim and face plate. At LINE scale the blade's inch ticks (eighths, quarters, halves
  of different lengths) are what a viewer counts: 22' then 1 to 11, 23', then 1 to 9.
- `photos/commons-clarkson-knicks-2025-*` (paint at shoe level): the white line is a crisp 2 in band with a faint
  glossy lip, the boards are long staggered strips in several honey tones, the lacquer throws long soft
  reflections, fine grey sole scuffs everywhere.
- `notes/RulebookArc.md` and its code (my scene opens on its last frame): ARC FRAME (20.8 px/ft, baseline y 1420),
  the line fully painted, gold slivers lit in both corners, the thin gold ghost ring down to the baseline, the tape
  ring on the pin at the basket, blade along rim level to the right reading 22' 0", case beyond the tip, reading
  window on. Same maple palette (#D9B983 family), charcoal lane #2B2D31, dark apron, the same Lufkin case.

What gives a fake away: a table with invented columns or rounded numbers; a "percent card" instead of the page; a
1 px line at macro; flights that are drawn as dashed lines; two balls that do not share one rim; a corner number
floating with no place on the floor.

## The real thing and its parts

1. The 21 inches at life size: the right corner at rim level, LINE scale (330 px/ft). The 2 in corner line paint
   (lip, gloss), the maple strips at true 2.25 in width with grain, butt joints and scuffs, the thin gold ghost ring
   at 23'9", the gold sliver between them. The blade lies along rim level: its inch ticks 22' 0" .. 23' 9" light gold
   one by one as it pays out; "21 in" counts with them.
2. The floor, top-down then in 3D: one pinhole camera for the whole scene (target, distance, pitch, yaw), the floor
   drawn once in world feet and put on screen by its real homography (CSS matrix3d), the backboard (6 x 3.5 ft glass,
   white border, 24 x 18 in target box, bottom edge 9 ft up), ring at 10 ft, net, stanchion arm, all projected by the
   same camera. Two balls (9.4 in) on real parabolic flights from the top of the arc (23'9") and from the right
   corner at rim level (22'), released together at the same horizontal speed, each with its shadow on the floor.
   Their ground tracks are drawn on the floor: the corner's is shorter, and the missing 21 in is the gold sliver.
3. The record: the BBR Team Shooting table redrawn at its real columns and rows, scrolled to League Average, the
   row lifted, its 33 other cells collapsing so .360 (FG% by Distance, 3P) and .387 (Corner, 3P%) close up.
4. Back on the floor: .387 lands on both corner strips (x 22..25, baseline to the kink) as 38.7%; .360 lands on the
   above-the-break region (outside the arc, above the kink) and becomes 35% (exact .351 typed under it, from facts).
5. The Korver photo: a real shot above the break; it settles on the top of the arc.

## Word, then change

| word | change |
|---|---|
| (mount) | the arc scene's last frame: ARC FRAME, slivers lit, tape at rim level reading 22' 0" |
| 21 | lands: dive to LINE scale on the right sliver at rim level; the blade pays out 22' 0" -> 23' 9" across it, each inch tick lighting gold, "21 in" counting with it |
| inches | the sliver's two edges sharpen: the corner line's lip catches light, the ghost ring brightens; grey labels "corner line 22' 0"" and "arc 23' 9"" |
| sounds like | the camera pulls up fast: the 577 px sliver shrinks to a thin gold slice of the whole floor |
| nothing, | lands: hold; both slivers pulse once; hairline label "21 in" |
| but the shot | the floor tilts to a 3/4 view (one real camera move), the backboard, ring and net stand up; two balls rise, from the top of the arc and from the right corner |
| feels | lands: both drop through the ring; the ground tracks stay: corner 22' 0" white, top 23' 9" white, the corner track's missing 21 in is the gold sliver lit at its start |
| it. | the flights fade, the floor tilts back flat |
| Last season | the BBR page slides up over the dimmed floor, rows scrolling; source line "Basketball-Reference, 2025-26 team shooting" |
| NBA teams | the scroll decelerates and stops on the bold grey League Average row |
| made | the row lifts out; its cells collapse until .360 and .387 stand side by side under their real headers |
| 38.7% | lands: the .387 cell drops into both corner strips; the strips brighten; "38.7%" counts up under each corner |
| corner | the camera leans toward the right corner |
| threes, | the .360 cell travels to the top of the arc |
| and only about | the above-the-break region brightens as one region, hairline edges |
| 35% | lands: "35%" counts up there; ".351 = (.360 - .246 x .387) / .754" types under it in grey |
| of the threes | the floor slides down and dims, the Korver card rises big and centred, slow push |
| above the break. | lands: the card shrinks onto the top of the arc; "above the break" hairline label along the arc |

## Sound-off test

A stranger sees a tape measure the gap between the corner line and the arc (21 in), sees how thin that is on a
whole court, sees two real shots where the corner one travels less, then the real league table giving 38.7% for
the corner and 35% above the break, each number placed on its part of the floor, and a real above-the-break shot.
