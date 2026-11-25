# LongTwoFades (scene `history`, 60.26-67.80 s)

"That's why the long two disappeared. In two thousand five it was nearly a quarter of every shot in the league. Last
season it was under one in twenty."

## What I looked at (assets/refs/, full size)

- `photos/commons-msg-court-2005-ganley894-pd.jpg` (1600x1200), Madison Square Garden, 2005, empty, from the lower
  side stands. Honey-orange maple lit warm under a dark bowl; the Knicks' solid orange key (16 ft x 19 ft), a red
  "ST JOHN'S" along the baseline apron and in the centre circle (the floor was set up for St. John's that night), red
  stanchion pads, the blue-skirted scorer's table. Two arcs: the white one is the NBA's 23'9" line (my homography
  from the orange key lands the drawn 23'9" arc on it within ~15 px), the thin dark-blue one inside it is the 2005
  college line. Shot from the left side: the baseline runs down-right at about 28 degrees, so un-tilting it into the
  top-down floor is a 28 degree turn plus the perspective, not a 90 degree spin.
  Fitted world->photo homography (world feet, origin the middle of the basket): key corners (-8,-5.25)->(240,623),
  (-8,13.75)->(502,598), (8,13.75)->(637,652), (8,-5.25)->(360,688). Half-court corners land at (140,569),
  (529,780), (1117,667), (666,534); the half-court line's midpoint falls on the centre circle (check.png in my
  scratchpad, drawn back on the photo and looked at).
- `photos/commons-ball-arena-gsw-den-2026-mhcl947-ccbysa4.jpg` (1280x960), Ball Arena, October 2026, from the upper
  deck: a paler, cooler maple, navy Nuggets keys, a full bowl. The "last season" arena.
- `pages/bbref-league-shooting-2005-2027.json`, the League Average row of every season. Long two (16-3P %FGA):
  .236 .236 .229 .235 .227 .218 .214 .208 .193 .180 .175 .162 .142 .120 .092 .077 .072 .070 .063 .058 .048 .049.
  Threes .196 -> .415; corner threes (3PA share x corner share) .053 -> .102; rim (0-3 ft) .304 -> .231;
  3-10 ft .135 -> .209; 10-16 ft .129 -> .095. 2026-27 is partial: never shown.
- `pages/bbref-team-shooting-2005-2026.json`: 2004-05, Sacramento Kings 16-3P %FGA .336, the league's highest
  (Jazz .312, Nets .299 next). `logos/nba-kings-primary.svg` (cdn.nba.com): purple, silver and white crown/ball.
- Siblings: `PointsPerShot*` (the band path, the ARC FRAME floor, BBR's shot-chart glyphs: my marks must NOT look
  like its makes and misses), `StepBack*` (hands me 0.80 and 1.16 and the gold sliver).

What gives a fake away: marks that teleport between seasons, a share that does not match its mark count, a 2005
photo that is just pasted and faded, a floor with no real arena under it, numbers that do not move with the data.

## The real thing, and where each part comes from

1. The same half court as every scene (Rule 1 geometry, plan coordinates), top-down at the ARC FRAME, my own copy
   of the floor (boards, lane stain, paint, board/ring/net) with the three-point line painted.
2. The 2005 Garden photo, rising as a card, then its own floor un-tilting (a per-frame projective warp from the
   fitted homography) until its key, arc and sidelines lie exactly on the drawn floor, where it hands over to it.
   Its warm orange cast stays on the drawn maple through 2005 and cools into Ball Arena's paler maple as the seasons
   roll. A small arena card top left carries the place and credit: MSG 2005, then Ball Arena 2026.
3. 1,000 attempt marks, one per 0.1% of the league's shots, placed by the real zone shares of the season shown (rim,
   3-10, 10-16, long two, corner three, above the break). Neutral style: small white dots, 60% opacity, no x (these
   are attempts, not `points`' makes and misses). Each mark keeps its identity; when a season's shares change, the
   marks that must move hop to their new zone, long twos stepping out past the line.
4. The band (BBR's 16-3P: 16 ft to the line) and the gold slivers (the reel's distance colour), the Kings logo.

## Word, then change

| word | change |
|---|---|
| (mount) | ARC FRAME floor, slightly close; the band lit with "0.80 long two", both corners with "1.16"; a few dozen long twos sit in the band |
| That's why the long two | the camera rises to the full ARC FRAME; the band glows |
| disappeared. | lands: 14 marks hop out of the band, over the line, into the corner strips (a step back each); each corner's 1.16 ticks as they land; the values fade |
| In | the 2005 Garden photo card rises over the floor (credit "Ganley894, public domain") |
| 2005 | lands: the photo's floor un-tilts (28 degree turn + perspective) onto the drawn floor; stands fall away; season label "2004-05" rolls in top right |
| it was | 1,000 marks rain onto the floor at 2004-05's shares, from the rim out |
| nearly a | the band's 236 marks lift and brighten, the rest dim |
| quarter | ends on: "23.6%" counts up over the arc with a hairline to the band; "of all shots" |
| of every shot | the Kings logo sets down at the band's left elbow, "Kings 33.6%" |
| in the league. | lands: a ripple of light runs through all 1,000 marks from the basket out; hold, slow push |
| Last season | the season label rolls through all 22 seasons; the percentage follows each real value; marks migrate season by season (band empties outward, threes grow, corners fill) |
| it was under | the arena card swaps to Ball Arena 2026 (credit "MhcL947, CC BY-SA 4.0"), the floor's tint cools |
| 1 in | the band's last 49 marks brighten alone; everything else dims |
| 20. | lands: "4.9%" settles; hairline label "1 in 20" on the band; the packed corner slivers glow gold |

## Sound-off test

A stranger sees the corner number (1.16) beat the band number (0.80) and shots stepping from one to the other, then
a real 2005 arena floor covered in shots with a crowded band "23.6%", then the years rolling to 2025-26 while the
band empties into the corners and beyond the arc, ending "4.9%, 1 in 20". The story reads without the voice.
