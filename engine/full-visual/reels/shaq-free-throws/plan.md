# Visual plan, shaq-free-throws ("Shaquille O'Neal was so unstoppable that teams started fouling him on purpose.")

Script: `script.txt` (approved, hook 1, word for word). Caption and scenes: `caption.txt` (12 scenes, all dark).
Facts: `facts.md` (unchanged). Voice: `voice.mp3` + `words.json`, 88.8 s, one take, locked. Times below are word starts
from `words.json`. Look: the creator's saved theme in `reel.json` (navy #0D1117, cards #161B22, hairline #30363D, the
blue select marker for the caption only). Keep `reel.json` exactly; `-h1` and `-h2` copy it unchanged. Creator:
@ballsimplified, fun casual NBA stories, very light on analysis: a number appears only when it makes the story land.
House style from `nba-floor` and `wemby-50`: real Commons photos in rounded cards (radius 28, 1 px #30363D hairline)
with a small grey credit top right inside the card (22 px, #8B949E, "Author, licence"), real team logos bare, big
white numbers, a lit maple floor on navy. No sound beyond the voice. No blue on stage, no em dashes on screen.

The approved visual plan (12 scenes) is followed scene by scene; this page adds the real material, the geometry and
the word-by-word moves. Read the right-hand columns alone: they should retell the story. "lands" = one event on the
word, "ends on" = a build that finishes on it.

**One main picture per scene, never twice:**

| Scene | Its one picture | Seen nowhere else |
|---|---|---|
| `hook` | cut-out Shaq at the line, a hand grabs his arm, FOUL | (two variants) |
| `backwards` | a real scoreboard where a foul pays the shooter's team, flipped for Shaq | the scoreboard bug, the +2 |
| `split` | one photo torn in two: the rim side vs the line side, a real quarter spinning | the coin, the dunk photo |
| `percent` | 11,252 attempts as a wall of real ball marks, 5,317 of them falling out; its fill level is the 52.7 meter | the wall, the ".527" cell |
| `picture` | the half court at rulebook geometry, the play acted on it, the arena going dark | the court from above, the spotlight |
| `clank` | the ball's flight at true scale, rim to the ring, the clank | the side-on rim, the +1 vs +2 |
| `clown` | the Hack-a-Shaq stamp, Don Nelson's real photo, the red nose dropping on | the Mavericks logo, the nose, the 1999 Lakers photo |
| `record` | the real Dec 8 2000 box score and play-by-play, eleven misses ticked red | the box score, the Sonics colours |
| `granny` | Shaq's real shooting photo beside Barry's real underhand motion (his photo, his kit), at true heights, the quote stamped | the Barry photos, the strobe sequence, the quote card |
| `popovich` | the real 2008 opener: Popovich photo, Spurs logo, game clock 12:00 -> 11:55 | the clock, the thumbs |
| `rule` | the real NBA rulebook page, Section X lit line by line, then the rule played on a small top-view court | the rulebook, the teammate at the line |
| `close` | the 2000 Finals photo, four trophies, Basketball-Reference's real "3x Finals MVP" badge, back to the line | the trophies, the badge |

## The viewer's wrong picture

"A foul is a mistake. You foul by accident, and it always helps the other team." Every fan knows a foul gives free
throws and free throws are the easy points. Nobody pictures a coach drawing up a foul as the plan, or a superstar for
whom the "free" throw was the hardest shot on the floor.

## What the viewer must leave with (light, story first)

- Near the rim Shaq was almost a sure two: his career field goal rate is .582 (background for builders, not on screen) (Basketball-Reference, career row, in
  `workspace/projects/2026-11-25-full-visual-shaq-free-throws/sources/bbref-shaq.html`). At the line, .527: about a
  coin flip. The foul swaps the sure two for two coin flips. (Shown as pictures, never as a formula: the dunk is +2,
  the line gives +1. No expected-points maths on screen.)
- The foul happens away from the ball on purpose: grab him before he can turn. That is why the league's fix targets
  exactly that: an away-from-the-play foul in the last two minutes of a period now costs one free throw (taken by ANY
  player, so the team picks its best shooter) plus the ball (Rule 12B, Section X, `pages/nba-rule12b-sectionX-*`).
- The story beats: Nelson made it famous (1999), the clown nose, 0 for 11 (Dec 8 2000, Staples Center, Sonics 103
  Lakers 95, Shaq still 13 of 24 from the field, 26 points, 17 rebounds), Barry's underhand offer and "zero percent",
  Popovich at 11:55 of the first quarter of the 2008-09 opener, the rule, four rings and three Finals MVPs.

## Once for the reel

- **One world, three scales. The reel travels between them and comes back.**
  - HANDS (macro): the ball in Shaq's hands, the seams, the fingers, the rim's steel at ring height, the grab on
    the forearm. Where "grabs", "clank" and the nose are seen. Scale: the ball (9.4 in) about 300-420 px.
  - COURT (the thread object): the Lakers half court around the free throw line, at Rule 1 geometry. Where the
    play happens and the distance is measured.
  - ARENA AND RECORD: the stands, the scoreboard, the box score, the rulebook, the people (Nelson, Barry, Popovich).
    Where the story shows.
- **Thread object: the free throw line and Shaq standing on it.** The line is real paint: 2 in wide, across the full 16 ft
  width of the lane, its near edge 15 ft from the face of the backboard (Rule 1.I.3). Shaq on it is always one of the
  two real cut-outs below, the same pixels each time, so every return to the line reads as "back here again". It opens the reel
  (`hook`), is the whole of `picture`, returns in `clank`, `record` (as the place of the eleven misses) and resolves
  the close.
- **Coordinates for every builder (feet):** origin = middle of the basket (rim centre), +x right, +y away from the
  baseline. Baseline y = -5.25, board face y = -1.25 (board 6 ft wide, x +/-3; shooter's square 24 x 18 in), ring
  r = 0.75 (inside edge 6 in from the board), rim 10 ft up, net 18 in. Lane x +/-8 from the baseline to y = 13.75;
  free throw line along y = 13.75 to 13.92 (2 in), x -8 to +8; circle r = 6 around (0, 13.92), upper half solid,
  lower half dashed (the real NBA marking). Restricted area r = 4. Lane space marks per Rule 1.I.6 and 1.I.7.
  Copy the court maths from `../nba-floor/plan.md` (same coordinates) but **a different camera**: this reel's COURT is
  seen from BEHIND THE SHOOTER, a broadcast free-throw angle, the lane receding toward the board at the top of the
  stage (perspective, camera 6 ft up, 8 ft behind the line), and a TOP VIEW used only in `picture` (rim at the TOP of
  the stage, 1 ft = 40 px, lane fills the middle). `nba-floor` looked at the arc with the baseline at the bottom; this
  reel never shows the three-point line as a subject.
- **The floor:** maple boards running baseline to half court, satin sheen, slow light sweep, the lane painted solid
  Lakers gold #FDB927 with dark purple #552583 hairline seams, the way the painted lane reads under Shaq's feet in
  `photos/commons-shaq-2000-finals-bigmoe797-ccbysa4.jpg` (gold paint, its gloss, the scuffs). Lines white, 2 in.
  Navy around the slab, never wood edge to edge.
- **The invisible gets one colour: FOUL RED #E5383B.** The intent to foul: the grabbing hand's contact marks, the
  FOUL tag, the miss ticks, the X's, the off-ball zone in `rule`, the clock's last digit at 11:55. Nothing else on stage is that
  red except the clown nose, a real red thing, which is the joke landing on the foul's own colour. Makes are white. Points are white. Trophies are their real
  gold.
- **Shaq's looks:** the Lakers (purple and gold #552583 / #FDB927, #34) is the story's Shaq for every beat 1999-2002;
  the shooting pose comes from the Suns free throw photo (the only clean free-throw stance on Commons) and is shown as
  shot; in `popovich` the Suns jersey is right (he was a Sun that night: Phoenix at San Antonio, Oct 29 2008).
- **One more real Lakers photo, small:** `photos/commons-shaq-lakers-1999-lipofsky-ccby3.jpg` (Steve Lipofsky, CC BY 3.0,
  20 Dec 1999): Shaq in Lakers gold #34 at the free throw line, ball overhead, mid shot. Only 199 x 300, so it is never a
  cut-out or a full-stage card: a small photo card (about 300 x 450 on stage, no upscaling blur beyond that), used once,
  in `clown` (it is the right year and the right man for "Shaq called him a clown").
- **Cut-outs (two, both real photos, used everywhere):**
  - LAKERS SHAQ STANDING: `photos/commons-shaq-2000-finals-bigmoe797-ccbysa4.jpg` (960 x 2461, 2000 Finals, Lakers
    purple #34, full length head to shoes, standing on the gold paint, hand on hip, seen from his left). The story's
    Shaq: "standing alone at the line", the wrecking ball's size, the close. Its own floor is cut away and he stands on
    our court with a contact shadow.
  - SHAQ SHOOTING: `photos/commons-shaq-free-throw-suns-2009-keithallison-ccbysa2.jpg` (1920 x 2871, square to the
    line, ball at the chest, both elbows visible). Every shooting pose (the hook, `clank`, `granny`). Kept as shot
    (Suns purple #32, credit on screen); no recolouring. `commons-shaq-free-throw-heat-2005-jannene-ccby2.jpg` (the
    Heat, if it downloaded) is the alternative stance.
  - A builder masks with `rembg` if installed, else by a hand-drawn path traced on the photo; a 2 px soft edge, a
    contact shadow on the boards, never a white halo.
  - The LAKERS SHAQ STANDING photo is seen from behind his left shoulder with "34" on his back: that is the post-up
    pose in `picture` (back to the basket) with no invented body. Never mirror a cut-out (the numbers and letters
    would read backwards).
- **Referee:** no colour referee photo was found, but `photos/commons-rick-barry-1976-russreed-pd.jpg` has a real NBA
  referee standing behind Barry (striped shirt, black trousers, the NBA patch on the chest). The striped sleeve in
  `backwards` and `picture` is drawn from it: stripes about 1 in wide, black and white, the cuff hem, a real fist.
- **Credits:** every photo card carries its credit (`assets/refs/credits.json`), small grey, top right inside the
  card. A cut-out carries its credit at the bottom-right of the stage band (y ~ 1420), 20 px grey, while it is on
  screen.
- **Grounds:** all dark. The navy ground always has the faint grid; behind the COURT the stands fall away in navy
  with soft points of light (arena bowl), never a bare ground.
- **Handovers:** only in the silences listed in `words.json`. COURT scenes (`picture` -> `clank`) hand over in
  place: `clank` starts on the exact camera and Shaq pose `picture` ends on (`keep = true`).

## Real material and where it lives (`assets/refs/`)

- `photos/` Commons photos (see `credits.json` for author, licence, page, what it shows).
- `logos/` cdn.nba.com primaries: Lakers, Mavericks, Spurs, Suns, Heat, Magic, NBA logoman. The SuperSonics no
  longer exist on cdn.nba.com: the Sonics are drawn as type in their real colours (green #00653A, gold #FFC200) in
  the box score header, as Basketball-Reference shows them by name.
- `pages/bbref-box-2000-12-08-sea-at-lal.html` the real box score: "SuperSonics vs Lakers, December 8, 2000",
  STAPLES Center, Seattle 103 (10-11), Lakers 95 (14-7). Shaq's line: 38:30 MP, FG 13-24, 3P 0-0, FT 0-11 (.000),
  ORB 8, DRB 9, TRB 17, AST 5, STL 0, BLK 5, TOV 1, PF 3, PTS 26. By quarter FT: Q1 0-0, Q2 0-2, Q3 0-6, Q4 0-3.
- `pages/bbref-pbp-2000-12-08-sea-at-lal.html` the play-by-play: the eleven misses, each with clock and score:
  Q2 0:47.7 (57-52) x2; Q3 9:27.0 (63-59) x2, 3:38.0 (74-70) x2, 1:53.0 (77-74) x2; Q4 5:25.0 (92-90) x1 ("misses
  free throw 1 of 1"), 0:58.8 (100-92) x2. Scores read Seattle first (visitor), as the page prints them. Text exactly "S. O'Neal misses free throw 1 of 2".
- `pages/bbref-pbp-2008-10-29-phx-at-sas.html` the 2008-09 opener play-by-play: 12:00.0 "Jump ball: T. Duncan vs.
  S. O'Neal (M. Barnes gains possession)", 11:55.0 "Personal foul by M. Finley (drawn by S. O'Neal)", 11:45.0
  "S. O'Neal misses 2-pt jump shot from 6 ft". Phoenix Suns at San Antonio Spurs, Wed Oct 29 2008.
- `pages/nba-official-playing-rules-2025-26.pdf` (cdn.nba.com), with `nba-rulebook-p49-rule12b-sectionX-49.png`
  (the page), `nba-rule12b-sectionX-away-from-play.txt` and `nba-rulebook-p18-rule4-definition-18.png` /
  `nba-rule4-away-from-play-definition.txt` (Rule 4, Section IV(h): "An away-from-the-play foul is illegal contact by
  the defense (1) in the last two minutes of each period, and last two minutes of any overtime periods, which occurs
  deliberately away from the immediate area of offensive action ..."). The rule's 2016-17 start is in `facts.md`.
- `pages/nba-rule1-section1.md` Rule 1 verbatim (free throw line 15 ft from the board face, ring, board).
- `workspace/projects/2026-11-25-full-visual-shaq-free-throws/sources/bbref-shaq.html` Shaq's Basketball-Reference
  page: career row FT 5,935, FTA 11,252, FT% .527, FG% .582; per season FT% (.592 as a rookie, .422 in 2006-07,
  .622 in 2002-03).
- `diagrams/` the court dimension diagrams (geometry checks).

Facts on screen beyond `facts.md` are only what the real documents above print (a box score, a play-by-play line, the
rulebook text), shown as those documents. A builder adds no other claim.

## Scenes

### 1. `hook`, dark, 0.12-4.46 s
"Shaquille O'Neal was so unstoppable that teams started fouling him on purpose."

Two variants (`shaq-free-throws-h1`, `-h2`, the creator's saved two-hook delivery), built separately. Approved
material: the cut-out Shaq at the line on the navy ground, a hand grabs his arm, a whistle, the FOUL tag in foul red.
Key words: O'Neal (0.52), unstoppable (1.60), fouling (3.20), purpose (4.04). Frame 0 already full and moving: the
COURT behind him, the lane receding, the ball in his hands.

### 2. `backwards`, dark, 5.34-8.92 s
"Sounds backwards, right? A foul usually hands the other team free points."

New real thing: **a broadcast scoreboard bug**, the real kind (two team boxes, scores, period, game clock, a team
fouls row with the BONUS light), team abbreviations, white numerals, the shot clock beside it. No network name or
logo: no 2000 broadcast graphic was found to copy, so none is imitated. Two generic halves are not allowed: it is LAL vs SEA, the Lakers at 2000 colours, the
Sonics in green and gold. The ball and a referee's arm make the foul happen on the bug itself.

| Word | What changes |
|---|---|
| Sounds | the hook's court slides down and out of focus; the scoreboard bug drops in big and centred over it, SEA 57 / LAL 52, 2nd quarter, 0:47.7 (the real state at Shaq's first trip to the line that night, from the play-by-play; Basketball-Reference's score column reads visitor first) |
| backwards, | lands: the whole bug flips over on its horizontal axis once (a real panel turning, its back side the navy card) and back: "backwards" done physically |
| right? | the flip settles with a small overshoot |
| A foul | lands: a real referee's arm (black and white stripes, fist raised, drawn from the referee in `photos/commons-rick-barry-1976-russreed-pd.jpg`) rises from below; a foul red tick lands in SEA's TEAM FOULS row (no count claimed) and the BONUS light on LAL's side comes on |
| usually hands | the bug splits a little: LAL's score box slides forward toward the viewer |
| the other team | two basketballs (the real ball, pebbled) arc into LAL's box from the line |
| free points. | lands: two white "+1" tags rise toward LAL's box, the score digits starting to roll 52 -> 53 -> 54 as ghosts (dimmed, outlined): what a foul usually pays. The real score never changes: in `split` the +1s bounce off Shaq |

### 3. `split`, dark, 9.60-16.50 s
"But Shaq was the exception, because near the rim he was a seven foot one wrecking ball, and at the free throw line
he was a coin flip."

New real thing: **one photo torn down the middle: the rim side and the line side.** The left half is Shaq at the rim
(`photos/commons-shaq-dunk-suns-2009-keithallison-ccbysa2.jpg`, credit "Keith Allison, CC BY-SA 2.0"), the right
half is the empty free throw line with a real US quarter (`photos/commons-quarter-2006-proof-usmint-pd.png`) spinning
over it. The tear is a real paper tear (fibres, a white torn edge), not a straight cleaver cut.

| Word | What changes |
|---|---|
| But Shaq | the scoreboard tilts down to become the floor; Shaq's cut-out rises out of it, the same cut-out as the hook |
| exception, | lands: the "+1 +1" from the scoreboard swings toward him and stops dead against his chest, bouncing off: he is the one this does not apply to |
| because near the | the cut-out steps left; the stage opens into a tall photo card that fills it |
| rim | lands: the left half fills with the dunk photo, a slow push toward the rim and his hands on it |
| seven foot one | a white measuring line rises beside him from the floor to the top of his head, counting 0 -> 7'1" (feet and inches roll), with a tiny grey "7-1, Basketball-Reference" source line |
| wrecking | lands: the photo half shakes once like an impact; the rim's backboard shivers, a heavy push in, dust of chalk/light off the boards (the "💥" emoji is the caption's) |
| ball, | the shake settles |
| and at the free throw line | the card tears down the middle with a real paper edge; the right half slides in: the free throw line from behind the shooter, empty, under arena light |
| coin | lands: a real US quarter (photo, the Washington side, reeded edge visible) is flipped up from the line, spinning edge-over-edge in 3D, catching light on its rim |
| flip. | ends on: the coin turns slow enough to read heads, tails, heads; it hangs spinning above the line, the left half (the rim) still bright |

### 4. `percent`, dark, 17.34-23.46 s
"Over his career he made just 52.7 percent, and missed 5,317 free throws."

New real thing: **every free throw of his career, 11,252 of them, as one wall of real ball marks**, and the wall is its
own meter: one object, one focus. Each attempt is a tiny ball (pebbled orange disc, 7 px, one seam line) on a navy
card; 19 columns, one per season, each as tall as that season's attempts on Basketball-Reference (only the first and
last season, "1992-93" and "2010-11", are labelled, small grey: light on analysis). The coin from `split` drops in and
becomes the first mark. The only numbers on stage are the two the voice says, plus the real ".527" cell they come from.

| Word | What changes |
|---|---|
| Over his | the spinning coin falls and shrinks into the bottom-left corner of a dark card: it becomes one ball mark |
| career | lands: the wall builds column by column, 1992-93 to 2010-11, marks pouring in like balls into a rack, filling the stage |
| he made just | a grey hairline runs across the wall at half its marks, labelled "coin flip" small grey; the made marks start to glow white-orange from the bottom |
| 52.7 | lands: a big white "52.7%" counts 0 -> 52.7 beside the glowing fill line as it rises and stops just above the coin-flip hairline; the coin sits on that hairline. Under it, small: the real Basketball-Reference cell "FT% .527" with "Career" (their table type, light grey grid, no link blue) |
| percent, | holds; light sweeps across the wall |
| and missed | the unlit marks start leaving: they drop out of the wall column by column, foul red as they fall |
| 5,317 | lands: a big white counter rolls 0 -> 5,317 as the marks fall; the wall is left half empty, a sieve |
| free throws. | ends on: the fallen red marks pile at the bottom like a heap of balls; hold, slow push in |

### 5. `picture`, dark, 23.86-32.82 s
"So picture it. Shaq catches the ball under the basket, and before he can even turn, somebody grabs him. Now he's
standing alone at the line, fifteen feet out, the whole arena watching."

New real thing: **the half court at rulebook geometry, the play acted out on it.** The court is drawn as the TOP VIEW
(rim at the top of the stage, 1 ft = 40 px) and tilted to a 3/4 view, so Shaq stays the upright cut-out and reads as a
person, never a token. The camera then swings to the BEHIND THE SHOOTER view. The reel's big move.

| Word | What changes |
|---|---|
| So | the wall card falls flat and becomes the floor: maple, the Lakers lane, seen 3/4 from above |
| picture | lands: the whole half court finishes drawing itself line by line in white paint at true geometry (board, ring, lane, circle, the line), the arena's stands rising around it in dark tiers |
| it. | a slow push toward the lane |
| Shaq | the LAKERS SHAQ STANDING cut-out appears low in the lane, his back and the 34 toward the basket (the post-up, as the photo was shot) |
| catches | lands: the ball, passed from the wing, slaps into his hands; a small white pass trail on the boards |
| the ball | the ball sits in his hands |
| under the | the camera tightens on the paint |
| basket, | lands: the ring and board above him lock in place, he is 4 ft from the rim, inside the restricted area arc |
| and before he can even | he starts to pivot toward the rim |
| turn, | lands: the pivot freezes half way |
| somebody | a defender's arm (a real forearm and hand, drawn with knuckles, tendons and skin shading, a plain white jersey sleeve edge, no team) reaches in from off frame |
| grabs | lands: the hand clamps on Shaq's forearm; foul red contact marks bloom under the fingers; the whole frame jolts with the stop |
| him. | no whistle sound (the voice is the only sound): a referee's arm, striped sleeve (from the 1976 referee), clenched fist, pops up at the edge of frame |
| Now he's standing | the court rotates: the camera swings behind the free throw line (BEHIND THE SHOOTER view), Shaq walks to the line, the other players and the defender fade off the floor |
| alone | lands: everything on the court except Shaq dims; the lane lines around him stay white |
| at the line, | lands: his feet set on the 2 in white paint; the line brightens under his toes |
| fifteen | lands: a white measuring line runs on the boards from the line's edge to the plane of the backboard, counting 0 -> 15 ft, with "15 ft to the backboard" small grey and "Rule 1" as its tiny source |
| feet out, | the measure holds |
| the whole | the stands rise into view in deep perspective behind the backboard: the real tiers of an arena (from the Capital One Arena photo), thousands of seats as small lights |
| arena | lands: the arena goes dark, one hard spotlight cone drops on Shaq at the line (dust in the beam) |
| watching. | ends on: camera flashes (2000: small white bursts, no phone screens) twinkle across the dark stands; a slow push in on him; hold |

### 6. `clank`, dark, 33.10-35.96 s
"Make one of two, and that's one point instead of an easy dunk."

New real thing: **the shot side-on at true scale**: line to ring, 13.75 ft horizontal, ball release at about 9 ft,
ring 10 ft, ring 18 in inside, the ball 9.4 in: the ball barely fits twice through the ring. Hands over in place from
`picture`.

| Word | What changes |
|---|---|
| Make | the camera swings side-on: Shaq's cut-out at the line, the ring and board at their true distance, the lit spotlight cone still on him |
| one | lands: the ball leaves his hands on a real arc; it drops clean through the net (the net ripples); a white "+1" pops above the rim |
| of two, | lands: the second ball arcs, hits the front of the rim, clanks, bounces out; a foul red X marks it |
| and that's | the two shots shrink into a ledger beside him: one white make, one red X |
| one point | lands: the "+1" lifts and sits on a score box |
| instead of an easy | a grey ghost of the dunk photo from `split`, cut out (both hands on the ring), rises under the rim |
| dunk. | lands: the ghost dunks, the rim bends down and snaps back (real breakaway rim travel), a grey "+2" appears beside the white "+1": the gap between them is the whole trick |

### 7. `clown`, dark, 36.38-46.26 s
"That trick got a name: Hack-a-Shaq. Dallas coach Don Nelson made it famous in 1999, and Shaq called him a clown.
So at their next game, Nelson showed up wearing a clown nose."

New real thing: **the Hack-a-Shaq name stamped, the real Mavericks logo, Don Nelson's real face, the red nose.**
The cdn.nba.com Mavericks primary is today's horse logo (the 1999 team wore the old hat logo, not on cdn.nba.com): it
names the team on "Dallas coach" and leaves before "1999", never sitting beside the date.

| Word | What changes |
|---|---|
| That trick got a | the side-on court slides down; the "+1 / +2" ledger shrinks into the corner |
| name: | lands: a big ink stamp (a real rubber stamp, wood handle, felt pad) slams down centre stage |
| Hack-a-Shaq. | lands: the stamp lifts and leaves "HACK-A-SHAQ" in heavy stamped ink (rough edges, uneven ink), white on the navy card, a hand-cut feel; ink spatters |
| Dallas coach | the stamp card slides up; the real Mavericks primary logo rises bare, then shrinks to a corner and fades as Nelson's card arrives |
| Don | Don Nelson's photo card slides in under the logo (`photos/commons-don-nelson-2012-seanpanderson-ccby2.jpg`, the close-up grinning photo, credit "Sean P. Anderson, CC BY 2.0") |
| Nelson | lands: a slow push in toward his face |
| made it famous | the photo is joined by a newspaper-style date strip (type only, no fake headline): "1999" |
| 1999, | lands: "1999" rolls up digit by digit |
| and Shaq called him | the small Lipofsky card (Shaq, Lakers gold #34, Dec 1999, "Steve Lipofsky, CC BY 3.0") slides in at the left, tilted toward Nelson's card: the two men of the feud face each other |
| a clown. | lands: the word "clown" is not drawn on stage (the caption says it); instead a single red nose (real foam ball redrawn from `photos/commons-clown-nose-robertcudmore-ccbysa2.jpg`: glossy highlight, the foam's slit, a soft shadow) appears high above Nelson's photo, swinging on nothing |
| So at their next game, | the nose hangs; the Nelson card centres and fills more of the stage |
| Nelson showed up | the camera pushes into his face |
| wearing a | the nose starts its fall |
| clown | lands: the red nose drops onto his real nose in the photo, squashes, settles with a bounce, its shadow on his cheek (placed at the nose in the photo: read the nose point off the image) |
| nose. | ends on: the photo gives a tiny shake of laughter; hold |

### 8. `record`, dark, 46.60-53.78 s
"And some nights it really worked. On December 8, 2000, Shaq went zero for eleven at the line against Seattle, still
an NBA record."

New real thing: **the real Basketball-Reference box score of Dec 8 2000 and its play-by-play.** Redrawn exactly from
`pages/bbref-box-2000-12-08-sea-at-lal.html`, real table type, no link blue.

| Word | What changes |
|---|---|
| And some nights | the Nelson card flips over; its back is a dark box score card |
| really | lands: the card snaps flat and big |
| worked. | the header writes in: "SuperSonics vs Lakers, December 8, 2000", STAPLES Center |
| On | the date line brightens |
| December | lands: the scorebox: Seattle 103 (10-11) in Sonics green and gold, Los Angeles Lakers 95 (14-7) with the real Lakers logo |
| 8, 2000, | the Lakers box score table unrolls under it, row by row, Shaq's row highlighted with a white hairline frame |
| Shaq went | the camera slides along Shaq's row to FG 13 / FGA 24 (white: from the field he was fine) |
| zero | lands: the FT cell flips to "0" |
| for | the FTA cell starts counting |
| eleven | lands: the FTA counts 1 -> 11 fast, and for each count a play-by-play line drops in below the table, "S. O'Neal misses free throw 1 of 2" with its real clock (Q2 0:47.7 ... Q4 0:58.8), each line getting a foul red X at its left, eleven X's stacking |
| at the line | the eleven X's gather into one column |
| against | Seattle's name glows in its green |
| Seattle, | the X column slides beside "0-11" |
| still an NBA | the box score dims around "FT 0 / FTA 11 / .000" |
| record. | lands: "0-11" scales up big and white, a foul red underline; a small grey "NBA record" beside it; hold |

### 9. `granny`, dark, 54.02-62.70 s
"The Lakers hired a free throw coach just for him. Hall of Famer Rick Barry offered to teach him his underhand granny
shot, and Shaq said he'd shoot zero percent before he'd shoot underhanded."

New real thing: **two real men and their two shooting motions, at true height.** Left: Shaq, the SHAQ SHOOTING cut-out
(real photo, ball at the chest), 7'1". Right: Rick Barry, cut out of
`photos/commons-rick-barry-warriors-1976-pd.jpg` / `commons-rick-barry-1976-russreed-pd.jpg` (Warriors #24, public
domain, kept black and white as shot), 6'7", so he stands visibly shorter on the same floor line. No photo shows the
underhand shot, so the motion is drawn as a **strobe sequence** like a coaching chronophotograph: five overlapping
ink-line frames of Barry in his real kit (white Warriors jersey, short shorts, striped tube socks, read off the photos),
fading from faint to solid: feet shoulder width, ball held low in both hands, knees bend, the ball swings up from
between his legs, released at chest height with backspin. Real proportions and folds from the photos, his face from
the photo crop: never a grey mannequin or a stick figure. Shaq's motion is never drawn: his real photo stays.

| Word | What changes |
|---|---|
| The Lakers hired a | the 0-11 slides up and shrinks into the corner; Shaq's shooting cut-out returns to the line; the real Lakers logo appears above him (no clipboard or coach silhouette: those are stock icons) |
| free throw coach | a coach's hand (carefully drawn: knuckles, tendons, a shirt cuff) reaches in and nudges Shaq's elbow; a white hairline from elbow to rim shows the line of the shot |
| just for | the hairline straightens |
| him. | lands: the ball leaves his hands on a white arc toward the ring at the top of the stage |
| Hall of Famer | the stage widens: Shaq moves left, a navy card opens on the right with a height hairline at 7'1" across both halves |
| Rick | Barry's photo card (credit "public domain") fades in on the right |
| Barry | lands: his cut-out steps out of the card onto the same floor line, his head well under the 7'1" hairline; a small grey "6-7" at his head |
| offered to | one ring hangs between them at the top |
| teach | lands: Barry's strobe sequence plays frame by frame: knees bend, the ball swings up between his legs, released underhand |
| him his | the soft high arc draws in white, backspin lines on the ball |
| underhand | lands: Barry's ball drops through the ring, the net swishes; his white arc copies itself over to Shaq, starting at Shaq's knees |
| granny shot, | the copied arc reaches Shaq and snaps back off him; Shaq's cut-out turns a few degrees away |
| and Shaq said he'd shoot | Barry's half dims; Shaq's half centres |
| zero | lands: a stamped quote card slams onto the stage over Shaq (same stamp as `clown`, now a white card with black ink: "I'd shoot zero percent before I'd shoot underhanded." and its source line small grey "Shaquille O'Neal, Esquire, 2005") |
| percent | the card settles with a bounce |
| before he'd shoot | Barry's strobe loops once more in the background, dim |
| underhanded. | ends on: "underhanded" in the card gets a foul red strike; hold |

### 10. `popovich`, dark, 63.08-68.22 s
"Even Gregg Popovich joked about it, fouling him five seconds into a season opener and flashing two thumbs up."

New real thing: **the real 2008-09 opener: Popovich's photo, the Spurs logo, the real game clock.** From
`pages/bbref-pbp-2008-10-29-phx-at-sas.html`: Phoenix Suns at San Antonio Spurs, Oct 29 2008, 12:00 jump ball (Duncan
vs O'Neal), 11:55 "Personal foul by M. Finley (drawn by S. O'Neal)".

| Word | What changes |
|---|---|
| Even Gregg | the quote card flies off; the Popovich sideline photo card rises (`photos/commons-popovich-sideline-2010-mike-ccbysa2.jpg`, 960 x 1179, credit "Mike, CC BY-SA 2.0": Popovich in a navy blazer walking the sideline on maple, looking back over his shoulder), the Spurs logo bare beside it |
| Popovich | lands: slow push in to his head and shoulders (his face is small in the photo: stop near 2x, never soft) |
| joked | lands: the photo card tilts a little, a playful wobble |
| about it, | a real arena game clock (the centre-hung scoreboard type, white LED segments on black, red kept for the foul) slides in: "1ST 12:00" |
| fouling | lands: the play-by-play line types in under the clock: "11:55.0 Personal foul by M. Finley (drawn by S. O'Neal)", Shaq's Suns shooting cut-out (number 32) beside it, the "M. Finley" words in foul red |
| him | the clock starts running |
| five | lands: the clock ticks 12:00 -> 11:59 -> 11:58 -> 11:57 -> 11:56 -> 11:55 and stops; the last digit turns foul red |
| seconds into | a grey "5 seconds" bracket spans 12:00 to 11:55 |
| a season | the Suns and Spurs logos sit either side of the clock: "PHX at SAS" |
| opener | lands: "Oct 29, 2008" types under it, "Game 1" small grey |
| and flashing two | Popovich's card scales up, centred |
| thumbs | lands: two thumbs-up hands pop in at both sides of his photo, drawn as real hands (knuckles, nail, skin shading, a navy cuff like his jacket sleeve), never the emoji glyph or an icon, with weight and a bounce (the 👍 emoji is the caption's) |
| up. | ends on: they settle; hold |

### 11. `rule`, dark, 68.50-75.12 s
"Years later the league changed the rules, so grabbing a guy away from the ball late in any quarter now gives his
team a free throw and the ball."

New real thing: **the real NBA rulebook page**: page 49 of the Official 2025-26 Playing Rules, Rule 12B Section X,
redrawn as a real page (cream-white paper, serif text at its real line breaks), plus Rule 4 Section IV(h) for "last two
minutes of each period". Then the rule shown working on the COURT top view. One focus at a time: the page is big and
centred until "grabbing", then it slides to the top third and shrinks while the court takes the middle; it comes
forward again only for its highlighted line. The time window uses the scoreboard bug from `backwards` (a thread
object, small here), not a new invented clock.

| Word | What changes |
|---|---|
| Years later the league | the Popovich card falls away; the rulebook cover (`nba-rulebook-cover-01.png`) rises, its pages fan open |
| changed | lands: the book opens flat on page 49 |
| the rules, | the camera slides to "Section X, Away-From-The-Play Foul"; the heading gets a white highlight sweep |
| so | the definition line from Rule 4 slides in as a strip above the page |
| grabbing | lands: the words "illegal contact by the defense" highlight; next to the page, a small top-view court: the ball with a guard on the wing, Shaq in the post, a defender grabbing him (foul red hand) |
| a guy | the grab pulses |
| away | lands: "deliberately away from the immediate area of offensive action" highlights; on the court, a foul red zone opens around Shaq, far from the ball, with a grey hairline "away from the ball" |
| from the ball | the hairline measures the distance ball to Shaq |
| late in | the scoreboard bug from `backwards` slides in small under the court, its game clock at 2:00 |
| any | lands: "in the last two minutes of each period" highlights; the bug's clock turns foul red under 2:00 |
| quarter | the bug's period rolls 1ST -> 2ND -> 3RD -> 4TH, the clock dropping under 2:00 and turning red each time |
| now gives his team | Section X(a)(1) highlights: "one free throw attempt shall be awarded. The free throw may be attempted by any player in the game" |
| a free | the court: a different teammate (a guard, plain jersey) walks to the line, not Shaq |
| throw | lands: one free throw, the ball goes in, white "+1" |
| and the | (a)(2) highlights: "the offended team shall be awarded the ball on the sideline" |
| ball. | lands: the ball bounces to the sideline nearest the spot, held there; a white "ball" hairline label; hold |

### 12. `close`, dark, 75.46-88.18 s
"And Shaq? He still won four championships and three Finals MVPs. So yes, teams fouled him on purpose, because it was
the only way to slow him down. Follow for the next wild NBA story, and send this to the friend who can't hit a free
throw either."

New real thing: **the 2000 Finals photo, the trophies counting in, then back to the line, resolved.**

| Word | What changes |
|---|---|
| And | the rulebook closes and drops |
| Shaq? | lands: the 2000 Finals photo card (Bigmoe797, CC BY-SA 4.0) rises big, slow push in |
| He still won | the photo moves up; a navy shelf forms below it |
| four | lands: four Larry O'Brien trophies (cut out of `photos/commons-larry-obrien-trophy-2016-erikdrost-ccby2.jpg`, credit "Erik Drost, CC BY 2.0": the gold ball sitting in the rim of a net over a tapering vase) land on the shelf one after another with weight, a small grey year under each: 2000, 2001, 2002, 2006 (Lakers x3, Heat x1, from his Basketball-Reference honours) |
| championships | light runs across the gold |
| and | the shelf slides left |
| three | lands: three Finals MVP badges, the real ones: Basketball-Reference's award tag "3x Finals MVP" from Shaq's page (its real grey rounded tag, beside "4x NBA Champ", their type) drops in under the shelf, and three thin white engraved plates "FINALS MVP" slide onto the bases of the 2000, 2001 and 2002 trophies one by one (no Bill Russell trophy photo is free: none is drawn) |
| Finals MVPs. | they settle; light runs over the three plates |
| So yes, teams fouled him | the trophies shrink into the corner; the camera returns to the hook's frame: Shaq at the line, behind the shooter, the same cut-out |
| on purpose, | lands: the grabbing hand from the hook comes in again and clamps on his arm (foul red) |
| because it was the only | Shaq doesn't move; the hand strains |
| way | the hand slips |
| to slow | lands: the hand falls away; Shaq takes one step forward, the floor shakes |
| him down. | holds on Shaq at the line, the spotlight from `picture` back on him |
| Follow | lands: the creator's follow card (avatar from `../nba-floor/assets/refs/profile/ig-ballsimplified-avatar.jpg`, @ballsimplified, a real Instagram Follow button shape) rises under him |
| for the next wild NBA | the Follow button presses in once |
| story, | lands: it turns to "Following" |
| and send this | the ball in Shaq's hands lifts out toward the viewer |
| to the friend who can't hit a | the ball arcs toward the rim at the top of the stage |
| free throw | the ball hits the front rim |
| either. | ends on: clank, bounces out, the coin from `split` spins once on the line; hold |

## References (state at the critic pass)

Fetched since the first pass: `commons-popovich-sideline-2010-mike-ccbysa2.jpg` (960 px Commons thumb),
`commons-rick-barry-1976-russreed-pd.jpg` and `commons-rick-barry-warriors-1976-pd.jpg` (960 px thumbs). Still missing
(upload.wikimedia.org keeps answering 429): run `assets/refs/fetch-missing.sh` before building the scenes that use them:

- `commons-quarter-2006-proof-usmint-pd.png` (`split`, `percent`; US Mint, public domain). If it still fails at build
  time, redraw the Washington quarter at true detail (profile, "LIBERTY", "IN GOD WE TRUST", reeded edge, 24.26 mm)
  from the US Mint design; never a flat gold disc.
- `commons-shaq-free-throw-heat-2005-jannene-ccby2.jpg` (optional alternative stance; Jeramey Jannene, CC BY 2.0)
- `commons-don-nelson-warriors-2009-brokensphere-ccbysa3-1.jpg` (optional; BrokenSphere, CC BY-SA 3.0)

The Larry O'Brien photo in hand shows the trophy small beside three dancers: redraw the trophy from it (shape, gold,
the ball sitting in the rim), never crop the people; two closer shots by the same author are named in `credits.json`.
No free photo of the Bill Russell Finals MVP trophy was found: the Finals MVPs are Basketball-Reference's real tag
and engraved plates on the real trophies. The referee's striped sleeve is drawn from the 1976 referee in the Barry
photo.
