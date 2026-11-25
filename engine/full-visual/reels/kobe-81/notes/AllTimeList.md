# alltime: AllTimeList (47.89-52.34 s)

"That's the second most points in NBA history, behind only Wilt Chamberlain's 100."

## What I looked at

- `pages/bbref-leaders-pts-game.html`: H1 "NBA Single Game Leaders and Records for Points", one table, columns
  Rank, Player, PTS, Date, Tm. Ties print no rank (a blank cell), names carry BBR's Hall of Fame asterisk. Today:
  1. Wilt Chamberlain* 100 1962-03-02 PHW, 2. Bam Adebayo 83 2026-03-10 MIA, 3. Kobe Bryant* 81 2006-01-22 LAL,
  4. Wilt 78 1961-12-08 PHW, 5. Luka Doncic 73 2024-01-26 DAL, (tie) David Thompson* 73 1978-04-09 DEN, Wilt 73
  1962-11-16 SFW, Wilt 73 1962-01-13 PHW, 9. Wilt 72 1962-11-03 SFW.
- The list as it stood the night after the 81 (drop the two rows dated after 2006): 1. Wilt 100, 2. Kobe 81,
  3. Wilt 78, 4. Thompson 73, (tie) Wilt 73, Wilt 73, 7. Wilt 72. That is what I draw, ranks recomputed the BBR way.
- Title: the plan suggested "2006-2026", but Luka's 73 (2024) sat on the list for part of those years, so a list
  without it cannot be called 2006-2026. It is dated "as of Jan 22, 2006" instead: every row and rank true that day.
- `commons-wilt-100-sign-1962-ap-pd.jpg` (AP, public domain): black and white, Wilt sitting in the Hershey dressing
  room, Philadelphia home jersey ("PHILA" in dark felt letters, "13" under it, half hidden by his forearm), grinning,
  the hand-lettered "100" on a white card held up at the right, a rubber band on his wrist. Light from the front-left
  flash, hard shadows. The sign is a third of the frame, upper right: it must stay in the crop.
- `commons-kobe-ft-purple8-msg-2006-davidwatterson-ccby2.jpg` (CC BY 2.0): road purple #8, "Lakers" script in gold,
  free throw release, arm across the face, MSG crowd behind; soft (an upscaled Flickr file). Fine at 122 px wide,
  never bigger.
- Warriors logo (cdn.nba.com): the modern Golden State bridge mark. It only stands for Wilt's franchise with the line
  "Philadelphia Warriors, 1962" beside it (plan).
- The handover I start from: `eightyone` ends on BBR's white box score page (x 36, Kobe's row y 906, 70 tall, pale
  yellow highlight #FFF7C2, the 81 bold in a gold cell), the scoreboard FINAL 104-122 parked at y 532-692, the night
  photo dark behind. The whole scene lifts off the top in the silence; my copy of Kobe's row appears in its place as
  the lift clears it.

What gives a fake away: Kobe "2nd" with no date (false today), Bam missing from an undated list, invented ranks for
the ties, a colour Warriors photo of Wilt, the modern Warriors logo labelled "Golden State".

## Thinking

- Real things: Kobe's own box score row (from `eightyone`) becoming his line in BBR's record list, the list itself at
  its real copy, the AP photo of the 100 sign, the MSG photo of Kobe in purple, the two logos bare.
- Details: the BBR grey bold header row, blank rank cells on ties, the asterisks, tabular figures, hairline rules,
  the pale yellow highlight carried over on Kobe's row, the 81 in his gold (the last gold of the game), the 100 in an
  ink cell with white figures, the paper's light sweep, the arena dark behind.

| word | change |
|---|---|
| (mount) | Kobe's box score row is left behind as the page lifts off, on the dark arena |
| That's | the stat columns pleat shut (MP..FT% fold like the ORB..PF strip), the row lifts toward the camera; Date and Tm type in: it is now a list row |
| the | BBR's list writes in under it from the bottom up: Wilt 72, Wilt 73, Wilt 73, Thompson 73, Wilt 78 |
| second | lands: Kobe's row drops into the slot above Wilt 78 with weight, the rows under it jolt, "2." stamps, the 81 glows gold |
| most points | the Lakers logo pops beside LAL; the header row and the H1 write in above |
| in NBA | the dated title types: "Most points in an NBA game, as of Jan 22, 2006" |
| history | lands: the lower rows dim; the Kobe photo card slides in at the left of his row, his name steps right |
| behind only | an empty row opens above his, everything under it slides down; a "1." waits in it |
| Chamberlain's | lands: Wilt's row drops in heavier than Kobe's: the AP photo, the Warriors logo, "Philadelphia Warriors, 1962" |
| 100 | ends on: the 100 counts 0 -> 100 in white figures in an ink cell, one flash; hold with a slow push in |

Re-voice only (flag `AllTimeListBam`): Bam's row slides in between Wilt and Kobe, Kobe's rank steps to "3.".

Sound-off: Kobe's 81 becomes a line in the all-time list; only one line sits above it, Wilt's 100.

## Built and checked

Stills at 47.85-52.25 s were read at full size against the BBR page and the two photos. Fixes made from them: the
Date and Tm columns were overlapping, so the columns were widened and the hero rows' logos moved under Tm. The 100
spilled out of its cell. Kobe's row was doubling at mount, so it now fades in only after `eightyone` has lifted off.
Public files: `public/kobe-81/alltimelist-wilt-100.jpg`, `alltimelist-kobe-msg.jpg` (crops), `alltimelist-warriors.svg`.
Render note: another reel (`nba-floor`) loads a font at module scope, so stills need `--public-only nba-floor`.
