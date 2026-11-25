# eightyone: EightyOneBoxRow (42.22-47.89 s)

"He finished with 81 points on 28 of 46 shooting, and the Lakers won 122 to 104."

## What I looked at

- `pages/bbref-box-200601220LAL.html` (comments stripped, table `box-LAL-game-basic`). Section heading
  "Los Angeles Lakers Basic and Advanced Stats", over-header "Basic Box Score Stats" over 21 columns: Starters MP FG
  FGA FG% 3P 3PA 3P% FT FTA FT% ORB DRB TRB AST STL BLK TOV PF PTS GmSc +/-. Starters are listed by minutes, so
  Kobe is the SECOND row, under Lamar Odom (42:53, 1-7, .143, 1-2, .500, 5-6, .833, ... 8 PTS). Kobe: 41:56, 28, 46,
  .609, 7, 13, .538, 18, 20, .900, ORB 2 DRB 4 TRB 6 AST 2 STL 3 BLK 1 TOV 3 PF 1, PTS 81, GmSc 63.5, +25.
  Then Parker, Brown, Mihm, a "Reserves" header row, George, Walton, Vujačić, Cook, Green, two Did Not Play rows
  (Bynum, Wafer), and the tfoot "Team Totals": 240, 42, 88, .477, 10, 23, .435, 28, 33, .848, 18 33 51 18 9 9 16 23,
  PTS 122 (GmSc and +/- empty).
- Same page, `line_score`: caption "Scoring", columns 1 2 3 4 T, rows TOR 36 27 22 19 104 / LAL 29 20 42 31 122.
  Scorebox: "Los Angeles Lakers 122, 22-19", "Toronto Raptors 104, 14-27", "9:30 PM, January 22, 2006",
  "STAPLES Center, Los Angeles, California".
- BBR's look (the stylesheet is on cdn.ssref.net, blocked here, so from what the page is): white page, black type,
  numbers right-aligned in tabular figures, header cells bold on light grey, hairline grey row rules, the tfoot row
  bold on grey, a grey section heading rule with "Share & Export" beside it, the light yellow hover highlight on a
  row. Player names are links (blue on the site): drawn near-black here, the house rule keeps blue off the stage.
- The reel's thread pieces I hang, never edit: `StaplesNightBoard` (x 90-990, y 532-692; `secondhalf` leaves it at
  END 3RD 85-91) and the bulb look from `OneAgainstFive` (glass globe, hot core, halo, dark socket ring).
  `secondhalf` ends with the first 26 bulbs dim on a small board (x0 98, y0 730, pitch 15) and the 55 in a gold stack
  (`OneAgainstFiveGoldSpot`), the red 41 beside it, the arena photo dark behind. I start on exactly that picture.
- The night photo (endlessbender, CC BY 2.0) stays as the dim depth behind the slam: the 81 lands in that arena.

What gives a fake away: a box score with invented columns or a rounded "42 min", Kobe as the first row, a total
that is not 122, the 81 as plain text that never was bulbs.

## Thinking

- Real things: the 81 built of his own 81 bulbs in the scoreboard's seven-segment shape (9 segments lit, 9 bulbs
  each: 81 exactly), then BBR's real box score row and Team Totals, then BBR's real line score.
- Making it fit at 32 px: the row keeps the real column order; ORB..PF (8 columns) are folded into one narrow
  accordion strip carrying their real values as texture, and GmSc/+/- run off the card's right edge. Odom's row sits
  above Kobe's, dim, because that is where the page puts it. The ten rows between Kobe and Team Totals fold into a
  stack of hairlines when the totals slide in.

| word | change |
|---|---|
| He finished | the 26 dim bulbs grow from the small board to centre, the 55 fly back up out of the stack into their sockets; the red 41 sink away; board full, one flash |
| 81 | ends on: all 81 leave the sockets at once, rise toward camera and slam down as the huge bulb "81" (the dark sockets of the unlit segments around the 1); gold bloom, one shake, sparks off the bottom row |
| points | the 81 holds and breathes, a marquee chase runs along its segments |
| points .. on | the whole 81 flies as one rigid shape on one arc (one k, same easing on x and y, the 1's dark sockets with it) and lands in the PTS cell on "on"; the cell flashes gold |
| on .. 28 | the page opens, opaque, around the landed cell (an inset clip from the cell to the full card, never a see-through panel); "Kobe Bryant 41:56" typed; FG rolls 0 -> 28 ending on "28" |
| 46 | FGA rolls to 46, ".609" types |
| shooting | 3P 7, 3PA 13, .538, FT 18, FTA 20, .900 sweep in left to right; source line |
| and the Lakers | Odom's row folds away, Kobe's lifts a step; the folded rows and Team Totals slide in under it; under the page 122 dark sockets appear and Kobe's 81 gold bulbs pour out of his PTS cell into them ("Kobe 81" counts up) |
| won | lands: scoreboard flips FINAL, LAKERS row flashes |
| 122 | Team Totals PTS rolls 81 -> 122 and the scoreboard's LAKERS rolls 91 -> 122 with it; the other Lakers' 41 sockets light warm white as the total rolls: "Kobe 81 of 122, Other Lakers 41" (the plan's takeaway, drawn) |
| 104 | lands: RAPTORS 104 on the scoreboard; the stack pours toward the LAL total and the line score takes that band, 42 and 31 lit |

Review round 1 applied: the frosted-card moment and the skewed shrink are gone (rigid arc, opaque card opening around
the cell); the empty lower band now holds the 122-bulb stack (gold = Kobe only, warm white #FFE9C4 = other Lakers).

Sound-off: bulbs that were his points become the number 81, the 81 becomes a cell in the real box score, the
totals and the scoreboard close the game. A stranger reads "81, in the real stat sheet, in a 122-104 win".
