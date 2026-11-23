# Visual plan, nba-floor ("The NBA three-point line isn't the same distance everywhere. In the corners, it's almost two feet closer.")

Script: `script.txt` (approved, hook 1, word for word). Caption and scenes: `caption.txt` (11 scenes, all dark).
Facts: `facts.md`; every number on screen is a row there or arithmetic on its rows (the "On screen only" rows were
added with this plan, each with its quote and URL). Voice: `voice.mp3` + `words.json`, 82.9 s, one take, locked.
Look: the creator's saved theme in `reel.json` (navy #0D1117, cards #161B22, hairline #30363D, the blue select marker
for the caption only). Keep `reel.json` exactly; the -h1 and -h2 variants copy it unchanged. Creator: @ballsimplified,
NBA stats explained, house style continued from their first post and `wemby-50`: real Commons photos in rounded
cards with a small grey credit top right, real team logos bare, big white numbers, a lit maple floor on navy.

Read the right-hand columns alone: they should retell the script. "lands" = one event on the word, "ends on" = a
build that finishes on it. Times are word starts from `words.json`.

Critic's pass (2026-11-23), read against `taste.md`, already applied below: shot marks were the main picture of three
scenes in a row (`percent`, `points`, `history`), now only `points` (makes and misses turning into points) and
`history` (where the league shoots, by season); `percent` is now the Basketball-Reference table and the two real
photos. The Bowen photo shows a contested shot, so it never sits under the word "alone" and is not reused in `cta`.
Defenders as shoe-print icons were coded; "alone" is now empty floor. Top-down sneakers show uppers, not soles. The
Korver card no longer arrives while numbers count (two focuses). `width` no longer pretends the backboard was
missing. `history` now shows its cause ("That's why": the 0.80 band emptying into the 1.16 corners). The tape's
blade and ring end were corrected to the Lufkin photo. No blue type on stage (the table's team links are redrawn
without the link blue).

**One main picture per scene, never twice:**

| Scene | Its one picture | Seen nowhere else |
|---|---|---|
| `answer` | the white paint at the kink, at shoe height, repainting itself | the low angle across the boards along the line, the wet paint edge |
| `corner` | the ball swung to an empty corner, then heels at the sideline seen low along it | the ball's passes, the view along the sideline |
| `width` | the Ball Arena floor lifted out of the photo, the tape run sideline to sideline | the tape across the full 50 ft, the pinch at the basket |
| `arc` | the rule, then the tape as a compass, the ghost ring and the corner lines slamming down | the Rule 1 card, the compass swing, the big move, the 15 in fit test top-down |
| `percent` | the real Basketball-Reference table, its League Average row, two real photos | the table, the flights, the Korver card |
| `points` | 1,000 shots per zone, every make popping its points into a total | the popping 3s and 2s, the 16 ft ring |
| `worth` | one step back across the corner line, side-on at shoe height | the step, the multiplication |
| `history` | the whole floor's shots across 22 seasons, the long-two band emptying | the season roll, the MSG 2005 photo |
| `close` | the hook's frame resolved, the four corner teams' logos | the logos, the shortest point lit |
| `cta` | the Capital One Arena from the upper deck, then the creator's card | the full crowd, the avatar |

The sneakers are a second thread (the shooter), seen three times with three jobs and three cameras: low along the
sideline (`corner`), top-down in the fit test (`arc`), side-on across the corner line (`worth`).

## The viewer's wrong picture

"The three-point line is a rainbow: one curve, one distance, painted around the basket." Every fan has stood behind
it, nobody has measured it. They have never noticed that the last 14 feet of it are straight, or why.

## The mechanism, at expert depth (what the viewer must leave with)

- Geometry (Rule 1, `assets/refs/pages/nba-rule1-section1.md`, verbatim): the court is 94 x 50 ft. The middle of the
  basket is 5'3" from the baseline (board face 4 ft out, ring 18" inside, its near edge 6" from the board). The arc is
  23'9" from the middle of the basket. The line also runs "parallel ... 3' from the sidelines, extending from the
  baseline". With the basket centred (25 ft to each sideline) the parallel line is 25 - 3 = 22 ft from the basket.
- Where they meet: `sqrt(23.75^2 - 22^2) = 8.95 ft` past the basket, so the straight corner line is 5.25 + 8.95 =
  14.2 ft long. The closest three on the floor is on that straight line exactly level with the rim: 22'0". At the
  baseline end it is `sqrt(22^2 + 5.25^2) = 22.6 ft`; at the kink, 23'9". The gap at the top vs the corner is 1'9" =
  21 inches.
- Why the straight part exists: a 23'9" arc carried on down to rim level would pass 25 - 23.75 = 1.25 ft = 15 inches
  from the sideline. A shooter's feet would not fit between the line and out of bounds. So the rulebook clips the arc
  3 ft inside the sideline, and that clip is what makes the corner short. Not a mistake: the width of the floor.
- What it buys (Basketball-Reference, Team Shooting, League Average row, 2025-26): corner threes .387; all threes
  .360; corner threes are .246 of threes, so above the break `(.360 - .246 x .387) / .754 = .351`.
- In points per shot: corner three `3 x .387 = 1.161`; long two (16 ft to the line) `2 x .401 = 0.802`;
  `1.161 / 0.802 = 1.45`, "about 45% more" for one step back.
- What the league did about it: the long two was .236 of every shot in 2004-05 and .049 in 2025-26 (every season in
  between in `bbref-league-shooting-2005-2027.json`: .236 .236 .229 .235 .227 .218 .214 .208 .193 .180 .175 .162 .142
  .120 .092 .077 .072 .070 .063 .058 .048 .049). Threes went .196 -> .415 of shots.
- Spoken vs exact: "almost two feet" = 1'9"; "about 35%" = 35.1%; "0.8" = 0.802 (counters land on 0.80); "45%" =
  1.45x; "nearly a quarter" = 23.6%; "under 1 in 20" = 4.9%. Counters land on the spoken figure; the exact one may sit
  in the small source line.

## Once for the reel

- **One world, three scales. The reel travels between them and comes back.**
  - LINE (macro): the painted line itself on the boards, 2 inches wide, at shoe height: maple grain, satin
    finish, the white paint's slightly raised edge, a sneaker sole beside it. Where "a step", "heels" and "fit" are
    seen. Scale: 1 ft = 300-400 px.
  - FLOOR (the thread object): the real NBA half court, top-down, at Rule 1 geometry. Where the reel measures.
  - ARENA: the court seen from the stands (the Ball Arena 2026 and Capital One Arena photos), and the league itself
    as a record (the Basketball-Reference table, 22 seasons). Where the result shows.
- **Thread object: the half court at true geometry, and a steel tape anchored at the middle of the basket.** One
  coordinate system for every builder: feet, origin = middle of the basket (rim centre), +x to the right, +y away
  from the baseline toward half court. Baseline y = -5.25. Sidelines x = +/-25. Half court y = 41.75. Board face
  y = -1.25, board 6 ft wide (x +/-3), 2 in white rim-box line. Ring r = 0.75 (18" inside), orange #E35205 rim,
  white net seen from above. Lane x +/-8 from the baseline to the free throw line at y = 13.75 (15 ft from the board
  face); free throw circle r = 6 (lower half dashed, the real NBA marking); restricted area r = 4 from the rim centre,
  then straight to the board face; lane space marks and the 3 ft x 6 in hash marks (Rule 1.6, 1.7); 28 ft hash marks
  on the sidelines (y = 22.75). Three-point line: straight x = +/-22 from y = -5.25 to y = 8.95, arc r = 23.75 between.
  All lines 2 in (0.167 ft) wide, white. Lines are drawn as the real paint: 2 in wide at scale, never a 1 px stroke.
  **Camera:** baseline at the BOTTOM of the stage, arc opening upward like the rainbow the viewer pictures (the
  opposite of `wemby-50`, which put the rim at the top; this reel must not look like that reel). Two standard frames:
  ARC FRAME (50 x 33 ft at 20.8 px/ft: sidelines at x 20 and 1060, baseline at y 1420, the arc's top at y ~ 815) and
  CORNER FRAME (one corner, 10 x 16 ft at ~ 95 px/ft). The floor is a lit slab on navy, never edge to edge bare wood
  with no ground around it: maple boards running baseline to half court (2.25 in boards at scale), satin sheen, a slow
  light sweep, faint scuffs in the corners and at the top of the key where players stand most. Lane paint: charcoal
  stain #2B2D31 (neutral; no team is the subject). Out of bounds beyond the sidelines: a 3 ft apron of darker stained
  wood, then navy. Reference for the look of real paint on maple: `photos/commons-clarkson-knicks-2025-nbacup-*`
  (lines at shoe level), `photos/commons-msg-court-2005-*`, `diagrams/commons-nba-court-dimensions-wikideas1-cc0.webp`.
  Geometry checks: `diagrams/commons-nba-field-diagram-en-snater-*.png`, `diagrams/commons-fiba-vs-nba-diagram-*`
  (its "23 ft 9 in" and "22 ft" arrows; FIBA is never drawn).
- **The steel tape is the reel's one tool, and it is real.** The rulebook itself asks every arena to keep "a steel
  tape" (Rule 1, Section II.3), so the tape belongs on this floor. Its body is the Lufkin "Universal" 50 ft tape of `photos/commons-lufkin-50ft-steel-tape-junkyardsparkle-cc0.jpg`: a round case in red pebbled leather, a chrome face plate stamped UNIVERSAL / THE LUFKIN RULE CO., a folding chrome crank, the steel blade leaving through a slot with black feet numerals and a brass ring end; the open-reel Chicago Tapes Co. tape (`photos/commons-steel-tape-chicago-tapes-*`) is the detail reference for the coiled blade. Drawn photoreal, not pasted. The blade, as
  in the Lufkin photo: dark blued steel, 1/2 in wide at scale (wider at MACRO), bright etched feet-and-inches
  graduations with a large numeral every foot, a bent steel triangle ring at its end. The ring is hooked over a pin at
  the middle of the basket: the blade is the radius of everything this reel measures.
  It pays out and reels in with weight (a slight sag, a click per foot at MACRO), swings like a compass, and its
  reading window shows feet and inches in the tape's own black type.
- **The invisible thing: distance from the middle of the basket. One colour, gold #F2B33D, the whole reel.** The
  creator's gold data accent. Gold is the tape's reading (the stretch of blade between the hook and the reading
  point glows gold underneath, like light through the edge of the steel), the ghost circle of equal distance (a thin
  gold ring of radius 23.75 drawn on the floor where the arc would keep going), and above all **the 21-inch sliver**:
  the gold band between that ghost circle and the straight corner line, the floor you gain in the corner. Gold means
  distance and nothing else. Points and percentages are white. Makes and misses keep the Basketball-Reference shot
  chart convention the creator already used: filled white dot = made, grey x = missed. Real team colours stay real.
- **Labels:** plain small grey type (#8B949E) with a hairline, 32 px minimum for anything that is evidence; dimension
  readings in the tape's own etched type when they are on the blade, white Figtree when they float. Source
  lines bottom left of the stage, 26 px grey: "NBA Rule 1, Court Dimensions", "Basketball-Reference, 2025-26 team
  shooting", "Basketball-Reference, league averages 2004-05 to 2025-26". Photo credits top right inside the photo
  card, 22 px grey (`assets/refs/credits.json` has each one, word for word).
- **Grounds:** all dark, #0D1117 with the house faint grid; cards #161B22, hairline #30363D, 24 px corner radius.
- **No** pills, badges, dots-with-labels, step cards, bars for comparisons (two zones filling with real shot marks is
  the comparison), blue on stage, dashed connector lines (the free throw circle's dashed half is real court paint and
  stays), frosted panels, game footage (rights), a hand, a silhouette or a mannequin standing in for a shooter, FIBA
  lines, team names that are not in facts.
- **One big move (body):** in `arc`, on "3 feet inside", the two straight corner lines slam down onto the floor 3 ft
  inside the sidelines with weight and cut the gold ghost circle; the cut-off ends of the ghost fall away and the 21
  in gold sliver is left lying in the corner. The reel never does anything that loud again.
- **Last shot = first shot, resolved:** `close` is the hook's frame (the half court, the tape at the top reading 23'9"
  and at the corner reading 22'), now with the gold slivers lit in both corners and the league's shots lying on the
  floor in their 2025-26 places.

## Real material (all in `assets/refs/`)

| File | What it is | Used in |
|---|---|---|
| `pages/nba-rule1-section1.md` | NBA Rule 1 Sections I and II, verbatim (official.nba.com, via Firecrawl; that host is blocked here). Line 4 is the reel's sentence: "The three-point field goal area has parallel lines 3' from the sidelines, extending from the baseline and an arc of 23'9" from the middle of the basket which intersects the parallel lines." Section II.3: "a steel tape or extension ruler and a level" | arc, width, hooks |
| `pages/bbref-2026.html`, `bbref-2005.html` | Basketball-Reference season pages (raw), Team Shooting table id `shooting-team` | percent, points, history |
| `pages/bbref-2026-screenshot-top.png` | screenshot of the real BBR Team Shooting table, 2025-26, rows 1-30 and the bold grey "League Average" row (82, 19781, .471, 14.3, .585 .231 .209 .095 .049 .415, .550 .703 .463 .446 .401 .360, ... .246). The look to redraw: white ground, thin grey rules, right-aligned numerals, the over-headers "% of FGA by Distance", "FG% by Distance", "Corner", the distance columns "0-3 3-10 10-16 16-3P 3P". Team names keep their underline but are drawn in the table's dark text, not the link blue (no blue type on stage) | percent, points |
| `pages/bbref-league-shooting-2005-2027.json` | League Average row of every season 2004-05 .. 2026-27, BBR field names (pct_fga_16_xx = long two share, fg_pct_16_xx, pct_fga_fg3a, pct_fg3a_corner, fg3_pct_corner, pct_fga_00_03 ...). 2026-27 is partial: never shown | history, points |
| `pages/bbref-team-shooting-2005-2026.json` | all 30 team rows for 2004-05 and 2025-26 | close, history |
| `photos/commons-bowen-three-pointer-verizon-keithallison-ccbysa2.jpg` | **the corner three.** Bruce Bowen (Spurs #12) rising for a three from the baseline corner, Caron Butler's hand up, the rim and board at left, courtside seats behind, "WASHINGTON" lettering on the baseline under his feet. 21 Feb 2009. "Keith Allison, CC BY-SA 2.0". A defender is contesting, so it is never on screen under "alone" | corner (first two words only), hooks |
| `photos/commons-korver-cavs-2017-erikdrost-ccby2.jpg` | **the three above the break.** Kyle Korver shooting over Aaron Brooks far out by the centre logo, 2017. "Erik Drost, CC BY 2.0" | percent |
| `photos/commons-curry-warriors-at-wizards-2017-keithallison-ccbysa2.jpg` | Curry in the air on a jumper, Gortat contesting, 2017. "Keith Allison, CC BY-SA 2.0" | spare (points) |
| `photos/commons-ball-arena-gsw-den-2026-mhcl947-ccbysa4.jpg` | Ball Arena, 26 Oct 2026, Warriors at Nuggets, from the upper side stands: the whole floor in perspective, both corner lines readable. The "from the stands" camera angle and this season's floor. "MhcL947, CC BY-SA 4.0" | width, history, cta |
| `photos/commons-capital-one-arena-playoffs-2017-daniellobo-cc0.jpg` | Capital One Arena from the upper deck in a 2017 playoff game, full crowd. "Daniel Lobo, CC0" | cta |
| `photos/commons-msg-court-2005-ganley894-pd.jpg` | Madison Square Garden court, 2005, empty. The 2005 floor. "Ganley894, public domain" | history |
| `photos/commons-clarkson-knicks-2025-nbacup-onoguchi-ccby4.jpg` | Clarkson in a stance on the 2025 NBA Cup floor: paint and maple at shoe level, real sneakers on the boards. "Daiei Onoguchi, CC BY 4.0". Reference only, never shown as a card (he is defending, not shooting); his sneakers are gold, so the drawn ones are white | answer, corner, arc, worth (paint, maple and sneaker reference) |
| `photos/commons-jalen-williams-okc-2025-nbacup-onoguchi-ccby4.jpg`, `commons-battier-heat-2012-*`, `commons-curry-shooting-denver-*`, `commons-lakers-nbacup-court-2024-troutfarm27-ccby4.jpg` | spares (the last: the Lakers' 2024 NBA Cup floor from the upper deck, "Troutfarm27, CC BY 4.0"): floor texture, a famous corner shooter, a warm-up jumper (never presented as a game shot) | spare |
| `photos/commons-steel-tape-chicago-tapes-cantonsdelest-ccbysa4.jpg`, `commons-lufkin-50ft-*` | the real steel tapes the reel's tape is drawn from | every scene with the tape |
| `diagrams/*` | court diagrams (geometry checks and floor look), credits in `credits.json` | builders' eyes |
| `logos/nba-spurs-primary.svg`, `nba-knicks-`, `nba-bucks-`, `nba-warriors-`, `nba-bulls-`, `nba-kings-primary.svg`, `nba-logoman.svg` | cdn.nba.com logos, bare. Spurs, Knicks, Bucks, Warriors = the four teams with the most corner threes per shot in 2025-26 (13.4, 12.9, 12.6, 12.5% of all their shots); Kings = most long twos in 2004-05 (33.6%) | close, history |
| `profile/ig-ballsimplified-avatar.jpg`, `ig-ballsimplified-post-netrating.jpg` | the creator's avatar and first post (house style) | cta |
| `credits.json` | every photo's credit line, Commons page and what it shows | all |

Builders copy what a scene uses into `engine/full-visual/public/nba-floor/` (resize photos to <= 1600 px).
`wemby-50` already holds a top-down court component: read it for craft, but this reel's court is redrawn to the
geometry above (baseline at the bottom, true 2 in lines, the tape), not reused.

## Scenes

### 1. `hook`, dark, 0.08-5.46 s
"The NBA three-point line isn't the same distance everywhere. In the corners, it's almost two feet closer."

Two variants (`nba-floor-h1`, `-h2`, the creator's saved two-hook delivery), built separately; material for them: the
ARC FRAME floor, the steel tape measuring 23'9" at the top then 22' in the corner, the gold 21 in sliver, the Bowen
corner photo.

### 2. `answer`, dark, 5.92-10.46 s
"So why would the league paint it that way? It isn't a mistake, it's the width of the floor."

New real thing: **the paint on the floor, at the kink.** LINE scale, low over the boards at the exact point where the
arc turns into the straight corner line (y = 8.95, x = 22): a white 2 in line on maple, the curve on one side, the
straight on the other. Then out to the whole floor to find what forces the kink.

| Word | What changes |
|---|---|
| So | the hook's floor rushes in toward the right corner's kink, the camera tilting down to a low angle across the boards (grain, sheen, the paint's raised edge catching light) |
| why | lands: the light sweep stops on the kink; a hairline drops to it, grey label "the arc ends here" |
| paint | lands: the line repaints itself along its path from the top of the arc down through the kink to the baseline, a wet white edge running ahead, so the viewer sees one stroke change from curve to straight |
| that way? | ends on: the painted stroke reaches the baseline; the camera holds on the straight segment, 14.2 ft long, a grey dimension along it "14.2 ft straight" |
| It isn't a | the camera rises fast from LINE to FLOOR, the kink shrinking to a point on the ARC FRAME court |
| mistake, | lands: both kinks get a small white cross and a grey dimension along each straight run, "14.2 ft" left and right, mirror images: the same on both sides, on purpose |
| it's the | the camera keeps rising: the sidelines, out of frame until now, slide in from both edges |
| width | lands: both sidelines light white along their full length and press inward a hair, then settle: the floor has edges and the arc is boxed in by them |
| of the floor. | the tape body (steel reel, crank) drops onto the left apron with a soft bounce: the tool for the next scenes arrives |

### 3. `corner`, dark, 10.88-15.86 s
"Picture the ball swinging to a shooter standing alone in the corner, his heels a step from the sideline."

New real thing: **a real corner three, then the swing that gets the ball there, then his heels at the sideline.**
The Bowen photo opens it (two words only: a defender is in it, so it is gone before "alone"); its floor un-tilts into
the top-down floor where only the ball moves, and the empty floor around the corner is what "alone" means. It ends
low on the boards, looking along the sideline: the one time the reel sees the corner from shoe height.

| Word | What changes |
|---|---|
| Picture | the Bowen photo card rises big and centred over the floor (credit "Keith Allison, CC BY-SA 2.0"), a slow push in toward the ball above his head |
| the ball | lands: the push stops on the ball in his hands; the card's floor un-tilts flat and becomes the ARC FRAME floor, the ball now a real leather ball seen from above (pebbled, black channels, a soft contact shadow) at the top of the key; the photo fades out with the tilt |
| swinging | lands: two real passes, top -> right wing -> right corner, the ball skipping across the boards with its shadow tightening at each catch and a short sheen trail on the maple; each pass lands on a syllable |
| to a shooter | the ball arrives in the right corner; a pair of white sneakers (uppers and laces from above, drawn from the Clarkson photo, no brand) sets down behind the corner line and the ball settles between them |
| standing | the camera eases toward the corner |
| alone | lands: everything else on the floor dims; the empty boards between the corner and the lane brighten slightly: nobody is there (no number, no defender drawn) |
| in the corner, | lands: CORNER FRAME on him: the straight line, the baseline, the sideline, the 3 ft strip of floor between line and sideline |
| his heels | lands: the camera drops to shoe height at the sideline, looking along it: heels of the two sneakers in the foreground, the 2 in white sideline paint running away into depth, the darker apron beyond, the boards' grain and the scuffs of the corner |
| a step | lands: the strip of maple between heel and sideline paint lights a little brighter, a grey hairline across it, grey label "a step" (no number here) |
| from the sideline. | ends on: the sideline's paint sharpens and the apron beyond it darkens: out of bounds; hold, a slow push along the line |

### 4. `width`, dark, 16.24-21.70 s
"An NBA court is fifty feet wide, and the basket sits right in the middle, twenty-five feet from each sideline."

New real thing: **the real floor from the stands, then the tape across it.** The Ball Arena 2026 photo (both corner
lines visible) straightens into the top-down floor; the steel tape is run sideline to sideline.

| Word | What changes |
|---|---|
| An NBA court | the Ball Arena photo card fills the stage (credit "MhcL947, CC BY-SA 4.0"), slow push; the floor inside it is lifted out of the photo and un-tilts into the top-down ARC FRAME (the stands fade, the floor stays) |
| is | the tape's hook clips onto the left sideline's outer edge |
| 50 | lands: the tape pays out across the floor to the right sideline, the reading window counting 0 -> 50 ft as the blade unspools with a slight sag, landing on "50' 0"" |
| feet wide, | the blade snaps taut along the baseline's width; a white "50 ft" sits above it |
| and the | the camera slides along the taut blade to the middle of it; the backboard and ring, seen from above, come up under the lens with their shadow on the boards |
| basket | lands: the orange ring and white net from above, the net swaying once in the push; the middle of the basket gets a tiny white cross and the tape's steel pin |
| sits right in | the tape's middle lifts and folds up to the basket's cross |
| middle, | lands: the blade pinches at the cross: two halves, each with its own reading |
| 25 | lands: both halves count 0 -> 25 together, out from the basket to each sideline, gold under the blade (distance from the basket begins here, in gold) |
| feet from each | the two gold readings "25' 0"" hold at the sidelines |
| sideline. | lands: both sidelines pulse white once where the tape touches them |

### 5. `arc`, dark, 21.96-32.74 s
"The rulebook draws the arc twenty-three feet nine inches from the basket, but it also keeps the line three feet
inside the sideline, so a shooter's feet still fit. That leaves twenty-two feet in the corner."

New real thing: **the rule itself, then the rule doing its job.** The Rule 1 text as a real document, then the tape as
a compass drawing the arc, the ghost circle running into the sideline, and the corner lines cutting it. Holds the
reel's big move.

| Word | What changes |
|---|---|
| The | the floor slides down; a document card rises above it: "RULE NO. 1: Court Dimensions - Equipment / Section I - Court and Dimensions", NBA Official look (white page, black serif heading, grey body) |
| rulebook | lands: line 4 highlights word by word as a reading strip: "an arc of 23'9" from the middle of the basket"; source line "NBA Rule 1, Court Dimensions" |
| draws the arc | the card shrinks to the top left; the tape, hook on the basket's cross, pays out up the middle of the floor |
| 23 | lands: the reading window rolls to "23' 9"" (feet on "23", inches on "9", 24.30); gold glows along the blade |
| feet 9 inches | the tape swings like a compass, left and right from the top, a fresh white arc painting under its tip as it goes |
| from the | the swing keeps going down past where the real arc ends, now drawing only a thin gold ghost ring |
| basket, | ends on: the ghost ring reaches rim level on both sides; there it sits 15 inches from the sideline; a grey measured band "15 in" between ghost and sideline at the right |
| but it also keeps the line | the card's line 4 highlights its other half: "parallel lines 3' from the sidelines, extending from the baseline" |
| 3 | THE BIG MOVE. lands: both straight corner lines slam down onto the floor, 3 ft inside each sideline, from the baseline up, with weight (a dust puff of light, the boards flex); the gold ghost ring is cut where they cross it, the cut-off ends fall away |
| feet inside the sideline, | a grey dimension "3 ft" settles between each corner line and its sideline |
| so a shooter's | the camera drops to CORNER FRAME on the right corner, top-down; the white sneakers from `corner` return, seen from above |
| feet | lands: the sneakers set down in the 3 ft strip, toes behind the corner line, heels clear of the sideline, a thin strip of maple behind them |
| still | the ghost ring's 15 in gap lights; the sneakers slide out to it: toes on the ghost, heels over the sideline paint and onto the dark apron (out of bounds), the sideline paint flashes white once under them |
| fit. | lands: the sneakers slide back into the 3 ft strip and settle with a small weight bounce; clear floor behind the heels |
| That leaves | the camera rises to the ARC FRAME; the tape swings from the top down to the right corner and stops at rim level, square to the straight line |
| 22 | lands: the reading window rolls 23' 9" -> 22' 0"; the gold between the 23'9" ghost and the corner line fills in: the 21 in sliver, lit |
| feet in the corner. | lands on "corner": the left corner mirrors it, a second sliver lights; hold |

### 6. `percent`, dark, 33.14-43.30 s
"Twenty-one inches sounds like nothing, but the shot feels it. Last season NBA teams made thirty-eight point seven
percent of their corner threes, and only about thirty-five percent of the threes above the break."

New real thing: **the league's own record.** The 21 in at life size on the tape, two real flights over a tilted
floor, then the real Basketball-Reference Team Shooting table, its League Average row giving up its two cells, and a
real above-the-break shot. One focus at a time: the table, then the corner number, then the Korver photo. No shot
marks here (they belong to `points` and `history`).

| Word | What changes |
|---|---|
| 21 | lands: LINE scale, the gold sliver fills the stage; the tape blade lies across it, graduations 0 to 21 in at true size against the boards, the reading "1' 9"" |
| inches | the sliver's two edges (ghost ring, corner line) sharpen |
| sounds like | the camera pulls up fast: the sliver shrinks to a thin gold slice of the whole floor |
| nothing, | lands: hold on how thin it is on the full floor |
| but the shot | the floor tilts to a low three-quarter view from behind half court (real perspective, the rim and board standing up in 3D); two balls rise, one from the top of the arc (23'9"), one from the right corner (22'), each on a real flight arc to the rim |
| feels | lands: both reach the rim; the corner ball got there first, its flight visibly shorter; a gold hairline at the corner ball's start marks the 21 in |
| it. | the two flights fade, the floor tilts back flat |
| Last season | the BBR table slides up over the floor (white page, the `bbref-2026-screenshot-top.png` look, rows 1-30 scrolling), source line "Basketball-Reference, 2025-26 team shooting" |
| NBA teams | the scroll decelerates and stops on the bold grey "League Average" row |
| made | the row lifts out of the table; its cells close up so only "Corner 3P% .387" and "3P% .360" stay; the table slides down and away |
| 38.7% | lands: the .387 cell drops onto the floor's two corner strips and becomes a white "38.7%" counting up from 0, the strips' boards brightening as it counts |
| of their corner | the camera leans toward the right corner strip; its number holds |
| threes, | the .360 cell moves to the top of the arc |
| and only about | the area behind the arc above the corners (above the break) brightens as one region, edges hairline |
| 35% | lands: white "35%" counts up on it; the derived line types in small grey under it: "(.360 - .246 x .387) / .754 = .351"; the two numbers now sit on the same floor, 38.7 in the corners, 35 at the top |
| of the threes | the floor slides down and dims; the Korver photo card rises big and centred (credit "Erik Drost, CC BY 2.0"): a real shot from far above the break, slow push in |
| above the break. | lands: the card shrinks onto the top of the arc where it was taken; hairline label "above the break" along the arc |

### 7. `points`, dark, 43.74-54.92 s
"Now turn that into points. A corner three is worth about one point one six points per shot. A long two, from sixteen
feet out to the line, went in forty percent of the time, which is only zero point eight."

New real thing: **1,000 real-rate shots per zone, and the points they score.** The first time shots are drawn on the
floor, in the creator's Basketball-Reference shot chart convention (filled white dot = made, grey x = missed). Every
make pays its points out of the floor into one total, then the total is divided by the shots. The long two's band is
found with the tape and named by BBR's own column, "16-3P".

| Word | What changes |
|---|---|
| Now turn that | the 38.7% from `percent` stays on the corner strips; the 35% and the above-the-break region fade |
| into points. | lands: the corner strips fill with 1,000 shot marks along their length, fast, from the baseline up: 387 white dots, 613 grey x |
| A corner three | every made dot pops a small white "3" that rises off the floor |
| is worth about | the "3"s stream into one white total above the corner, counting 0 -> 1,161 |
| 1.16 | lands: the total divides by its 1,000 shots and rolls to "1.16"; small grey "3 x .387" beneath, label "points per shot" |
| points per shot. | the 1.16 moves to the right edge and holds; the corner marks fade to a texture |
| A | the tape pays out from the basket again |
| long | lands: the tape stops at 16 ft and swings a thin gold ring of radius 16 |
| two, | lands: the band between the 16 ft ring and the three-point line lights as a region of floor (boards brighter, edges hairline); the BBR column head "16-3P" (16 ft to the three-point line) slides onto it in the table's own type, grey label "long two" |
| from 16 | lands: the reading window "16' 0"" |
| feet out to the line, | the band fills with its own 1,000 shot marks, from the ring out to the line, inside the arc and along the corner lines |
| went in | the League Average row's ".401" cell (FG% by Distance, 16-3P) drops onto the band |
| 40% | lands: white "40%" counts up (exact .401 in the small source line); 401 of the marks turn to white dots |
| of the time, | each made dot pops a white "2" |
| which is only | the "2"s stream into a white total, counting 0 -> 802 |
| 0.8. | lands: rolls to "0.80", small grey "2 x .401"; it sits beside the corner's 1.16 on the same floor, smaller type: the gap is seen |

### 8. `worth`, dark, 55.26-59.88 s
"So stepping back behind that short corner line makes the shot worth about forty-five percent more."

New real thing: **one step, at shoe height.** LINE scale on the right corner line, side-on at shoe height, the white
sneakers just inside it (a long two), then one step back across the paint.

| Word | What changes |
|---|---|
| So | the camera dives to LINE scale, side-on at shoe height across the right corner line (the sideline and apron far behind); the white sneakers stand just inside the line, toes toward the basket: a long two |
| stepping | lands: the sneakers step back: the right foot lifts (shadow tightens and opens), crosses the 2 in white paint, sets down behind it, the left follows; a small grey "1 step" along the move |
| back behind that short | the gold sliver lights under the floor between ghost and line, beside the feet |
| corner | the corner line glows once along its straight length |
| line | lands: the feet settle behind the line with a weight bounce; the paint under the toes is clean: a three |
| makes the shot | the 0.80 and 1.16 from `points` drop in on either side of the feet, 0.80 behind (where they stood), 1.16 where they stand |
| worth about | an arrow-free multiplication writes between them: "0.80 x 1.45 = 1.16" |
| 45% | lands: white "+45%" counts up from 0 over the feet |
| more. | hold, a slow push in on the sneakers behind the line |

### 9. `history`, dark, 60.26-67.80 s
"That's why the long two disappeared. In two thousand five it was nearly a quarter of every shot in the league. Last
season it was under one in twenty."

New real thing: **the league's floor across 22 seasons, filling and emptying.** The 2005 Garden floor turns into the
top-down floor carrying 1,000 real-share shot marks; the seasons roll and the marks move out of the long-two band.
These marks are attempts, not makes: one neutral style (small white dots at 60% opacity, no x), so they never read
as `points`' makes and misses. The cause the words give ("That's why") is shown first: the 0.80 band and the 1.16
corners from `worth`, and shots leaving one for the other.

| Word | What changes |
|---|---|
| That's why the long two | the camera rises to the ARC FRAME; the long-two band glows with its grey "0.80", the corner strips with their "1.16" |
| disappeared. | lands: a handful of marks hop out of the band, across the line, into the corner strips (each a step back, as in `worth`); the two values fade |
| In | the Madison Square Garden 2005 photo card rises (credit "Ganley894, public domain"); the floor inside it un-tilts to top-down |
| 2005 | lands: a season label "2004-05" rolls in at the top right; the floor is covered by 1,000 shot marks placed by the league's real shares that season (rim, 3-10 ft, 10-16 ft, long two, corner threes, above the break, all from `bbref-league-shooting-2005-2027.json`) |
| it was nearly a | the long-two band's 236 marks lift slightly and brighten, the rest dim |
| quarter | lands: "23.6%" counts up beside the band; every 4th mark on the floor is a long two, the band visibly crowded |
| of every shot in the | the Kings logo (most long twos that season, 33.6%) rests small at the band's edge |
| league. | lands: hold the crowded band |
| Last season | the season label rolls 2004-05 -> 2025-26 through all 22 seasons, one per 0.1 s; marks migrate each season by the real shares: the band empties outward, the marks crossing the line into the corners and above the break (threes .196 -> .415), and inward to the rim |
| it was under | the Ball Arena 2026 floor's tint replaces the Garden's (credit "MhcL947, CC BY-SA 4.0") |
| 1 in | the band's last marks (49) sit alone |
| 20. | lands: "4.9%" counts down from 23.6; a hairline label "1 in 20" on the band; the gold slivers in the corners are packed |

### 10. `close`, dark, 68.24-74.62 s
"So the line really isn't the same distance everywhere, and the smartest teams spend every possession trying to reach
the shortest part of it."

The hook's frame, resolved. **The real 2025-26 floor and the teams that live in its corners.**

| Word | What changes |
|---|---|
| So the line | the marks thin to a faint texture; the ARC FRAME court centred, the line bright white |
| really isn't the | the tape swings to the top of the arc: "23' 9"" |
| same | lands: the tape swings to the corner: "22' 0""; both slivers glow gold |
| distance everywhere, | the tape sweeps the whole line once from corner to corner, its reading rolling 22' 0" -> 23' 9" -> 22' 0" |
| and the | four logos from cdn.nba.com drop to the floor's two corners, two per corner, bare: Spurs, Knicks, Bucks, Warriors |
| smartest | lands: under each logo its share of all its shots taken from the corner counts up (13.4%, 12.9%, 12.6%, 12.5%), one small grey line under them "of all their shots were corner threes"; source line "Basketball-Reference, 2025-26 team shooting" |
| teams spend every | the leather ball from `corner` appears at the top of the key |
| possession | lands: the ball swings once to each side, top -> wing -> corner, fast, each swing ending on a corner logo |
| trying to reach | the tape swings to rim level in the right corner |
| the shortest | lands: the exact point on the corner line level with the rim lights as one white cross, reading "22' 0"", the shortest three on the floor |
| part of it. | hold: the full floor, both slivers lit, the point glowing |

### 11. `cta`, dark, 74.94-82.24 s
"Next game, watch who's waiting in the corner. Follow for the next number the floor hides, and send this to the friend
who still loves a long two."

The ARENA scale again, the reel's last travel: from the floor out to the stands, then the creator.

| Word | What changes |
|---|---|
| Next game, | the Capital One Arena photo fills the stage (credit "Daniel Lobo, CC0"), full crowd, slow push toward the floor |
| watch | lands: the push accelerates down toward the photo's court |
| who's waiting in the | the push keeps going into the near corner of that real floor, the crowd sliding out of frame |
| corner. | lands: a thin white ring settles on the photo's real corner, the gold 21 in sliver drawn onto that real floor in its perspective for a beat |
| Follow | lands: the creator's avatar card (`profile/ig-ballsimplified-avatar.jpg`) rises with "@ballsimplified" |
| for the next number | the floor from `close` slides under the card, small |
| the floor | the floor tilts to the stands' angle |
| hides, | lands: the gold slivers glow once |
| and send this | the avatar card moves aside |
| to the friend | the long-two band lights faint on the floor |
| who still loves a long | the band's last few marks |
| two. | lands: the last long-two mark pops a grey "0.80"; hold |

## Not on screen, on purpose

- No shoe size, foot length or ball size: `facts.md` has none. "Feet fit" is shown by real sneakers inside the 3 ft strip
  and over the sideline in the 15 in gap.
- No claim that the corner shot is "easier" for a reason (flatter flight, less defence): the script says only that
  the shot "feels it", and the picture shows the shorter distance and the real make rates.
- No distance between the shooter and a defender: "alone" is shown by empty floor, not a number.
- No 2026-27 numbers (partial season). No FIBA lines. No team colour on the generic floor.
- Every percentage is a League Average value or arithmetic on it; team shares only in `close` and the Kings mark in
  `history`, each with its source line.
