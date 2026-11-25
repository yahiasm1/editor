# FreeThrowTally (`freethrows`, 43.83-51.55 s)

"And the wildest part? Wilt was known as a terrible free throw shooter, and that night he made 28 of 32. Other
players couldn't believe it."

## What I saw (references at full size)

- `pages/box-196203020-clean.json`: Wilt's row FT 28, FTA 32, FT% .875 (box score). The order of the 32 attempts is
  not in any reference (the box says no per-quarter FT splits), so the grid is a count, not a play-by-play: the 28
  makes ink first, the 4 misses after.
- `pages/wilt-gamelog-1962-clean.json`: season totals FT 835 of 1,362, FT% .613. The line typed on the sheet is
  exactly "1961-62 SEASON  FT 835-1362  .613".
- `facts.md` line 11: the quote, word for word, "He's the world's worst free-throw shooter and he's 28 out of 32!",
  Johnny Kerr.
- `photos/commons-hershey-sports-arena-1938-interior-pd.jpg`: under the vault the light is a few big round lamps
  hung from the ribs, hot pools on the floor and dark everywhere else; seats rise straight behind the rink boards at
  both ends; the end wall carries the scoreboard. Behind the basket the viewer sees boards, then dark banks of seats.
- `photos/commons-wilt-1959-pd.jpg`: the ball of the era in a hand: a leather ball with deep dark seams, a matte
  grain, a soft highlight, no shine. 1962 colour (plan): brown leather.
- `FoulWarCourtKit.ts` (the scene before): the same 1962 court in feet (FT line z 19, board face z 4, rim centre
  z 5.25, lane 12 ft, FT circle 6 ft), and its camera ends straight down over this half. My camera starts there.
- Period rim and board (plan geometry): rectangular glass board 6 x 4 ft, bottom edge 9.5 ft, rim 10 ft, painted
  orange steel ring 18 in across, white cotton net of 12 loops, braced back to a pipe stanchion behind the baseline.
- No real photo of the scoresheet of that night could be fetched (Commons answered 429 to the second search; the
  first search found no scoresheet). So the paper is NOT titled as the official sheet: it carries only facts from the
  box (teams, date, place, FT 28 of 32) in the reel's cream paper and typewriter look.

What would give a fake away: a modern court (three point arc, wide lane), a glossy orange modern ball, a perfect
vector check mark repeated 28 times, a counter that runs smoothly instead of jumping with each check, numbers that
are not the box's.

## The thinking

- The real things: the free throw line seen low from the shooter's spot (Wilt shot his free throws underhanded that
  season, so the ball rises from low), the basket of the era, and the scorer's cream strip with his line and 32
  boxes. The ball through the rim above and the pencil on the paper below are one mechanism: every ball that drops
  inks one box.
- Details: maple boards and butt joints, the dashed half of the FT circle inside the lane, lamp pools and glare on
  the varnish, amber witnesses sparse in the dark end seats (half empty), the ball's eight seams spinning backward,
  the net whipping up on a swish, the rim kicking a miss off, paper grain and curl, each pencil mark different, the
  box numbers printed small, the red pencil under .613.
- Word, then change:
  - And the wildest (ends on): the camera cranes from straight above the court down into the lane, low behind the
    free throw line, basket above.
  - part? (lands): an underhand ball rises from below, high arc, drops through, the net whips.
  - Wilt was known: the camera backs off and up, the basket moves to the top of the stage; the cream strip slides
    in from the right and types "13  CHAMBERLAIN".
  - terrible (lands): the season line types and the red underline strikes under .613.
  - free throw shooter: a ball clangs off the rim and away; a red x by .613.
  - and that night: the strip unrolls its FREE THROWS section, 32 empty numbered boxes, 4 rows of 8.
  - he made / 28 (lands): balls rain through the rim faster and faster, each one inks a check; a big white counter
    beside the grid jumps 1, 2, 3 ... landing on 28 with the 28th check.
  - of 32 (ends on): four balls rattle out, four pencil x's; "/ 32" lands under the 28; ".875" types beside .613.
  - Other players: the strip eases up a third; the quote types in grey typewriter under it.
  - believe (lands): the quote finishes, "Johnny Kerr" under it, the 28 checked boxes flash white together.
- Sound-off test: a ball and a hoop, a sheet with his name and a red-underlined .613, then 32 boxes filling with 28
  checks, 28 / 32 and .875 beside .613, and a player's stunned line. "A bad shooter went 28 of 32 that night."
- Left out on purpose: the WILT counter. Its value during the free throws is not knowable (they were spread over the
  whole game), and `flood` opens it at 98; a wrong number on it would be worse than its absence.
