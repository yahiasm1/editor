# Visual plan, kobe-81 ("Kobe Bryant once scored more points in one half than the entire Toronto Raptors team.")

Script: `script.txt` (approved, hook 1, every word kept). Caption and scenes: `caption.txt` (11 scenes, all dark).
Facts: `facts.md`; every number on stage is in it or is arithmetic on its rows (the plan added dated rows at the foot,
the original rows are unchanged). Voice: `voice.mp3`, 70.9 s, locked. Look: `reel.json` exactly as saved (navy
#0D1117, cards #161B22, hairline #30363D, blue select marker for the caption only). Creator: @ballsimplified, fun
casual NBA stories, very light on analysis (`workspace/library/full-visual.preferences.md`). House style from their
first post (`context/posts/18155407801470375.jpg`) and `wemby-50`: real Commons photos in rounded cards with a small
grey credit top right, real team logos bare, big white numbers. Two hooks, not five (preferences): `-h1`, `-h2`.

**Fact flag, blocking for one scene (`alltime`).** Basketball-Reference's single-game list today reads 1. Wilt 100,
2. **Bam Adebayo 83 (Mar 10 2026)**, 3. Kobe 81. The voice says "That's the second most points in NBA history, behind
only Wilt Chamberlain's 100", and `caption-post.txt` says "Only Wilt Chamberlain's 100 is higher". Both were true for
twenty years and are not true now. The creator decides: re-voice that one sentence (suggested: "For twenty years,
that was the second most points in NBA history, behind only Wilt Chamberlain's 100.") or keep it. The `alltime`
scene below is built from the real list so it works either way: the list is shown as it stood for those twenty years,
dated, then Bam's row slides in above Kobe only if the sentence is re-voiced. Never draw "2nd" undated.

Read the right-hand columns alone: they should retell the story.

**Critic's pass (applied below).** (1) The hook, `secondhalf` and `close` all drew the same picture (Kobe's cut-out
beside a gold pile, five Raptors beside a red one): `secondhalf` now owns it alone; the hook stands on the night photo
and the close resolves that photo. (2) The scoreboard was big and centred in `halftime` and `eightyone` against its own
rule: it now hangs small there. (3) `takeover` carried five things at once (court, play list, flow chart, two
counters, board): the flow chart's return and the extra gold counter are cut; the lead change lands on the scoreboard.
(4) `eightyone` redrew the court a second time: "28 of 46" is now Kobe's real box score row, a new DOCUMENT, and the 81
lands in its PTS cell. (5) `alltime` is built for the voice as locked, dated so the screen stays true.

## The viewer's wrong picture

"81 is a guy who just shot a lot in a blowout." (The close names that friend.) What really happened: his team was
losing by 18 and getting booed, his teammates were not scoring, and his points alone turned a lost game into a win.
The picture to leave with: one side of the scoreboard was almost one person.

## What the viewer must leave with (light, story first)

- The Lakers' score is five players added up. That night the gold share of it, Kobe's, kept growing until it was most
  of it: 26 of 49 at the half, 81 of 122 at the end.
- The turn: 71-53 down (3rd, 9:23) to 91-85 up at the end of the 3rd. Kobe scored 23 of the Lakers' 38 in that run;
  the lines on the game flow chart cross on his dunk (3rd, 1:11, 87-85).
- Second half: Kobe 55, all five Raptors together 41.
- 81 on 28 of 46: his real box score row, the 81 landing in its PTS cell.
- He had nearly done it before: 62 against Dallas's 61 through three quarters, then a fourth on the bench.

## Once for the reel

- **One world, three scales. Travel between them and come back.**
  - ARENA: STAPLES Center on the night, from the one Commons photo taken at the game
    (`photos/commons-kobe-81-night-staples-2006-endlessbender-ccby2.jpg`, upper deck behind the Raptors' bench end: Lakers in home
    white, Raptors in red, the purple lane, the gold sideline band, the gold Lakers centre logo, "STAPLES CENTER" in red
    along the sideline, the red LED shot clock "23" on the stanchion, 18,997 people). The place around it.
  - FLOOR: that same court top-down at true NBA geometry (feet below), painted exactly as in the photo. Kobe's 46
    shots stand on their real spots (`kobe-shots-court.json`). Where it happened.
  - MAN: Kobe and the nine other starters, cut out of real Commons photos, standing at their real heights. Who did it.
  - DOCUMENT, between them: the real records, redrawn at their real copy: BBR's play-by-play lines, Kobe's box score
    row (MP 41:56, FG 28, FGA 46, 3P 7, 3PA 13, FT 18, FTA 20, PTS 81), the line score, the single-game list, the
    Dallas scorebox.
- **Thread object: the scoreboard.** One arena scoreboard, redrawn in the real 2006 STAPLES LED style read off the
  photo's stanchion clock (black box, red seven-segment digits with dim unlit segments, a thin chrome edge), two rows:
  `RAPTORS` and `LAKERS`, the quarter and the clock between. It is built in `night` and flips quarter by quarter from
  the real line score (36 27 22 19 / 29 20 42 31): Q1 in `night`, HALF in `halftime`, 71-53 in `deficit`, END 3RD in
  `takeover`, FINAL in `eightyone`. In `dallas` the same box shows the other night. It is never the main picture
  twice in one framing: big and centred only in `night` (born) and `dallas` (the other night, relabelled); everywhere
  else, `halftime`, `deficit`, `takeover` and `eightyone` included, it hangs small at the top of the stage as the clock
  of the story and flips there.
- **The invisible thing: Kobe's own points. One shape, one colour, the whole reel.** One point = one round lit bulb in
  Lakers gold (#FDB927, the real team gold), a bright core, a soft warm glow, a dark socket ring when unlit. Gold means
  "Kobe's point" and nothing else in the reel (the Lakers logo keeps its own gold, the caption marker stays blue).
  A make lights 2 or 3 bulbs at once, a free throw 1. The other Lakers' points are the same bulb in warm white;
  the Raptors' are the same bulb in Raptors red (#CE1141); the Mavericks' in Mavericks blue (#0064B1): real team
  colours. The bulbs gather on **Kobe's board: 9 x 9 sockets = 81**, born at `halftime` (26 lit, 55 dark), lit by
  `takeover` (where it sits small in the top-right corner as Kobe's live counter) and `secondhalf`, turned into the
  number in `eightyone`. Labels on it, small grey with a hairline:
  "1 bulb = 1 Kobe point" once, on the first lit bulb.
- **Second invisible, the gap:** the game flow chart (two running-score lines by minute, from the play-by-play,
  the broadcast stat screen). Red line Raptors, white line Lakers; from "decided" the Lakers line is drawn in gold
  where Kobe scored. It is the hero of `deficit` and comes back small in `takeover`.
- **Labels:** small grey type (#8B949E) with a hairline, 32 px minimum for evidence copy. Source lines bottom-left of
  the stage, 26 px grey ("Basketball-Reference box score", "Basketball-Reference play-by-play", "Basketball-Reference
  shot chart"). Photo credits top right inside the photo card or beside a cut-out, 22 px, "Author, licence" exactly as
  in the table below. Logos bare (cdn.nba.com), never in a badge.
- **No** pills, badges with dots, step cards, rows of bars, blue on stage, dashed lines, frosted panels, game footage
  (rights), NBA.com action photos on stage, invented scoreboards from other arenas, a fake ticket, a fake broadcast
  bug, emoji. No "pull-up" written on stage (the play-by-play says "jump shot"; the voice can say pull-up). No
  claim the Raptors photos are from that night unless the table says so.
- **Grounds:** all dark, #0D1117 with the house faint grid. Cards #161B22, hairline #30363D. The court is the one large
  warm surface: maple boards (2.25 in strips, satin sheen, a slow light sweep), 2 in white lines, the lane purple
  (#552583, sample the photo), the gold sideline band, the centre logo. It sits as a lit slab on the navy.
- **Real heights:** cut-outs scale 1 ft = the same px across a scene (Parker 6-4, Bryant 6-6, Odom 6-10, Brown 6-11,
  Mihm 7-0; Rose 6-8, Bosh 6-11, James 6-2, Peterson 6-7, Bonner 6-10).
- **One big move (body):** in `eightyone`, on "81", all 81 bulbs leave the 9 x 9 board at once and fly into two huge
  bulb-matrix digits "81" that slam down with weight and a glow bloom. The reel never does anything that loud again.
- **Last shot = first shot, resolved:** both hooks stand on the endlessbender night photo (STAPLES on the night, the
  Raptors in red on that floor). `close` returns to that same photo, now resolved: the scoreboard reads FINAL, its
  bottom row relabelled "BRYANT 55" against "RAPTORS 41" for the second half, and the red jerseys on the real floor
  ringed one by one. Not the `secondhalf` columns again.

## The court, drawn from NBA rules (feet)

Half court 50 wide x 47 deep. Backboard face 4 ft from baseline, 6 ft wide. Rim inner diameter 18 in, centre 5.25 ft
from baseline. Lane 16 ft wide, free throw line 19 ft from baseline (15 ft from the board). Free throw circle radius
6 ft. Restricted arc 4 ft. Three point line 23.75 ft arc, 22 ft in the corners, straight to 14 ft from the baseline.
Lane hash marks (block at 7 ft, then 3 ft spaces). Centre circle radius 6 ft at the far edge. Place shots from
`x_ft`/`y_ft` in `kobe-shots-court.json` (x right of the rim centre, y toward half court), never from raw pixels.
The fit is coarser than wemby's (2006 tracking, max residual 1.6 ft): never draw a spot so it crosses the three point
line against its listed type (a 3 stays outside the arc, a 2 inside; clamp by 0.5 ft if needed).

## Real material (all in `assets/refs/`)

| File | What it is | Used in |
|---|---|---|
| `kobe-shots-court.json` | Kobe's 46 field goal attempts from BBR's shot chart tooltips: quarter, clock, made, 2/3, listed ft, x_ft/y_ft, zone, and the tooltip's running score line ("LA Lakers now leads 87-85") | takeover, hooks |
| `kobe-81-scoring.json` | every scoring play of the game from BBR's play-by-play, running score after each, Kobe's running total, play text ("K. Bryant makes 3-pt jump shot from 27 ft (assist by S. Parker)") | halftime, deficit, takeover, secondhalf, flow chart, counters |
| `dallas-scoring.json` | the same for Dec 20 2005 vs Dallas | dallas |
| `pages/bbref-box-200601220LAL.html` | BBR box score: line score TOR 36 27 22 19 104 / LAL 29 20 42 31 122, both teams' rows, Kobe 28-46, 7-13, 18-20, 81, scorebox "January 22, 2006, STAPLES Center", attendance 18,997 | night, starters, eightyone (Kobe's row, Team Totals) |
| `pages/bbref-pbp-200601220LAL.html`, `pages/bbref-shots-200601220LAL.html` | the raw pages the two JSON files come from (BBR's court image host cdn.ssref.net is blocked here; the court is drawn from the rules above) | builders' eyes |
| `pages/bbref-box-200512200LAL.html`, `pages/bbref-pbp-200512200LAL.html` | Dallas at Lakers, Dec 20 2005: DAL 18 26 17 29 90 / LAL 25 28 42 17 112; Kobe 62 on 18-31, 22-25 FT | dallas |
| `pages/bbref-leaders-pts-game.html` | BBR single-game points list (see the fact flag): Wilt 100 (1962-03-02, PHW), Bam Adebayo 83 (2026-03-10, MIA), Kobe 81 (2006-01-22, LAL), Wilt 78, Luka Doncic 73, David Thompson 73, Wilt 73 x2, Wilt 72, Lillard / Mitchell / Robinson / Baylor 71 | alltime |
| `pages/bbref-roster-LAL-2006.html`, `bbref-roster-TOR-2006.html` | 2005-06 rosters: numbers, positions, heights | starters, secondhalf |
| `logos/nba-lakers-primary.svg`, `nba-raptors-primary.svg`, `nba-mavericks-primary.svg`, `nba-warriors-primary.svg`, `nba-heat-primary.svg`, `nba-logoman.svg` | cdn.nba.com logos, bare. The Warriors logo stands for Wilt's franchise only with the line "Philadelphia Warriors, 1962" under it | night, secondhalf, eightyone, alltime, dallas |
| `profile/ig-ballsimplified-avatar.jpg`, `profile/ig-ballsimplified-profile.json` | the creator's real avatar and profile | close |
| `photos/` | Commons photos, each with its credit in the table below. `photos/raw/` the downloads, `photos/meta/` each file's Commons wikitext (author, licence, source) | see below |

### Photos (Commons; credit = the line to print; verified from each file's wikitext in `photos/meta/`)

Files are in `assets/refs/photos/`. Only the first was taken at the 81 game. Every other photo is the same season or
close, and is never captioned with Jan 22 2006. Cut-outs: mask by hand at full resolution, keep the edge soft 1-2 px,
add a contact shadow; never upscale past 1.5x without a grain pass.

| File | What it shows | Credit to print | Used in |
|---|---|---|---|
| `commons-kobe-81-night-staples-2006-endlessbender-ccby2.jpg` (960x720) | **The 81 game**, Jan 22 2006, from the upper deck: Lakers in home white (#8 near the centre logo), Raptors in red, purple lane, gold sideline band, gold Lakers centre logo, red "STAPLES CENTER" floor lettering, the red LED stanchion clock "23", the full crowd. Commons date field says 2006-02-22 (camera), description and Flickr title "Kobe 81 Points 011" say the 81 game | endlessbender, CC BY 2.0 | night, halftime (stands), court paint reference, hooks |
| `commons-staples-opening-tip-2006-malingering-ccby2.jpg` (1920x1337) | STAPLES, Feb 15 2006, opening tip vs Hawks: **Kwame Brown #54 at the jump** in home gold, Kobe #8 "BRYANT" back, Brian Cook #43, the gold centre logo and purple lines close up (crop around x 650-1350, y 250-800) | malingering, CC BY 2.0 | starters (Kwame), court paint detail |
| `commons-staples-shotclock-2005-nivsinger-ccbysa2.jpg` (1280x853) | STAPLES, Oct 21 2005 preseason: **the real stanchion clock unit**, black box, amber game clock "00.5" over a big red shot clock digit, the yellow backboard support, courtside seats. The LED style of the reel's scoreboard | Niv Singer, CC BY-SA 2.0 | scoreboard look, dallas bench row (courtside chairs) |
| `commons-kobe-ft-gold8-2005-josephalee-pd.jpg` (960x1440) | Kobe in the gold #8 home jersey at the line, ball at the waist, eyes up, Oct 2005 preseason (vs Warriors, Hawaii). Clean, big, the best cut-out | Sgt. Joseph A. Lee, USMC, public domain | hooks, deficit, secondhalf, close |
| `commons-kobe-dunk-2005-meganstiner-pd.jpg` (960x1440) | Kobe hanging on the rim after a dunk, gold #8, Oct 2005 preseason | Cpl. Megan Stiner, USMC, public domain | takeover (drives), hooks |
| `commons-kobe-ft-purple8-msg-2006-davidwatterson-ccby2.jpg` (960x1715) | Kobe in road purple #8 at the line, Madison Square Garden, Feb 2006 | David Watterson, CC BY 2.0 | alltime (row card), dallas (photo chip) |
| `commons-kobe-ft-followthrough-2005-jerameyjannene-ccby2.jpg` (960x1280) | Kobe in purple, follow-through after a free throw, Milwaukee, Dec 2005 | Jeramey Jannene, CC BY 2.0 | takeover (free throws), dallas bench cut-out base |
| `commons-kobe-suit-2006-varonpanganiban-ccbysa2.jpg` (1280x1828) | Kobe in a grey suit, smiling, Oct 2006 | Varon Panganiban, CC BY-SA 2.0 | spare (close) |
| `commons-smush-parker-1-2006-pragmatopian-ccby2.jpg` (960x2700) | **Smush Parker** full length, road purple #1, purple headband, 2006 (crop from "Kobe free throw 2006") | pragmatopian, CC BY 2.0 | starters |
| `commons-odom-7-parker-1-2005-jerameyjannene-ccby2.jpg` (1280x960) | **Lamar Odom #7 "ODOM"** from behind in purple, Smush #1 beside him, Milwaukee, Dec 2005 | Jeramey Jannene, CC BY 2.0 | starters (Odom from behind, turning is not needed: he walks in back first) |
| `commons-odom-ft-2005-jerameyjannene-ccby2.jpg` (1280x960) | Odom at the line, wide, with Brian Cook #43 and Bucks players | Jeramey Jannene, CC BY 2.0 | spare |
| `commons-mihm-31-2005-full-jerameyjannene-ccby2.jpg` (1280x1707), `commons-mihm-31-2005-jerameyjannene-ccby2.jpg` (960x2027, tighter) | **Chris Mihm** in purple, ball palmed in one hand, full length, Dec 2005 ("I am huge and I will palm the ball") | Jeramey Jannene, CC BY 2.0 | starters |
| `commons-mike-james-13-raptors-2006-jerameyjannene-ccby2.jpg` (1920x2880) | **Mike James #13**, Raptors red road jersey, Jan 27 2006 at Milwaukee (five days after the 81 game) | Jeramey Jannene, CC BY 2.0 | secondhalf (trace), hooks |
| `commons-mo-peterson-24-raptors-2006-jerameyjannene-ccby2.jpg` (960x1442) | **Morris Peterson #24**, Raptors red, red headband, Jan 27 2006 | Jeramey Jannene, CC BY 2.0 | secondhalf (trace) |
| `commons-raptors-bucks-2006-bosh-jerameyjannene-ccby2.jpg` (960x720) | Raptors in red on the floor at Milwaukee, Jan 27 2006, **Chris Bosh** among them (small, full body) | Jeramey Jannene, CC BY 2.0 | secondhalf (Bosh and Rose/Bonner body shapes to trace) |
| `commons-raptors-arena-2004-raisinbun-ccbysa2.jpg` (960x720) | Raptors home arena from high up, preseason 2004 jump ball | Raisin Bun, CC BY-SA 2.0 | spare |
| `commons-wilt-100-sign-1962-ap-pd.jpg` (1280x1529) | **Wilt Chamberlain holding the "100" sign**, Hershey, Mar 2 1962, black and white | Associated Press, public domain | alltime |
| `commons-wilt-100-marker-hershey-crazycat8590-cc0.jpg` (960x1280) | the Pennsylvania state marker for the 100-point game | Crazycat8590, CC0 | spare |
| `commons-phil-jackson-bench-2005-jerameyjannene-ccby2.jpg` (1280x960) | Phil Jackson standing at the Lakers bench, the row of seated players and staff, Dec 2005 | Jeramey Jannene, CC BY 2.0 | dallas (the bench row: chairs, towels, how players sit) |
| `commons-nowitzki-ft-mavs-2005-jendrikschmidt-ccbysa3.jpg` (1280x827) | Dirk Nowitzki at the line in Mavericks road blue, Nov 2005 at Charlotte | Jendrik Schmidt, CC BY-SA 3.0 | dallas (the Mavericks side, small card) |
| `nba-headshot-977-kobe-reference-only.png` | NBA.com headshot, **reference only** for the face, never on stage | none (not shown) | builders' eyes |

Not found on Commons in a usable Lakers-era photo: none needed beyond these. Jalen Rose and Matt Bonner have no
Raptors-era Commons photo here: their figures are traced as dark shapes at their real heights (6-8, 6-10) with
numbers 5 and 16; never invent faces.

## Scene by scene

Each scene names its **new real thing**: the main picture nobody has seen yet in this reel.

### 1. `hook`, dark, 0.12-3.90 s
"Kobe Bryant once scored more points in one half than the entire Toronto Raptors team."
Key words: Kobe 0.12, one 1.76, Raptors 3.30 (team ends 3.90).

Two variants, built separately (`-h1`, `-h2`). What both owe the first four seconds:

- Frame 0 is full and moving: Kobe already on stage (a cut-out from a real Commons photo, credit visible), gold bulbs
  already lighting, and behind him the endlessbender photo of the night itself (credit "endlessbender, CC BY 2.0"),
  alive with a slow push. Both hooks share this ground so `close` can resolve it.
- The idea plays once, small and fast, inside the first second: gold bulbs pouring out of Kobe into a pile that
  is already taller than a red pile, before the voice reaches "one half".
- "one" lands on a single, physical thing: one Kobe, one half (the half court or a game clock half run).
- On "Raptors" the whole Raptors team is named as the real red jerseys on that real floor in the night photo (each
  ringed in Raptors red, the Raptors logo bare) and is outweighed by Kobe's gold in one big move with weight (for
  example the gold flood rolling down over the floor and burying the red). No scale: it is a metaphor. The payoff holds
  to 3.90.
- Something new every 0.2-0.4 s.
- Kept for the body, so no hook does them: the 9 x 9 board (born in `halftime`), the "81" slam (`eightyone`), the
  game flow chart (`deficit`), the spotlight lineup (`starters`), the shot chart by type (`takeover`), the five traced
  Raptors with their own red bulbs and the gold-55 and red-41 columns side by side (`secondhalf`), the box score row
  (`eightyone`).
- Hand-off both share: the last frame clears to the navy ground with the scoreboard box small at the top of the stage,
  dark (unlit digits), so `night` lights it.

### 2. `night`, dark, 4.70-7.94 s
"January 22, 2006, and honestly, the night started terribly."

New real thing: **STAPLES Center on the night** (ARENA scale), the Commons photo taken at the game, and the
scoreboard born from its stanchion clock.

| Word | What changes |
|---|---|
| January | the endlessbender photo card rises big and centred (crop the full bowl, the court in the lower two thirds), credit "endlessbender, CC BY 2.0"; a slow push in toward the court |
| 22, | lands: the BBR scorebox line types on under the photo, grey: "Sunday, January 22, 2006" |
| 2006, | lands: "STAPLES Center, Los Angeles" and "Attendance 18,997" write in beside it; the attendance counts up 0 -> 18,997 |
| and honestly, | the camera finds the red LED shot clock "23" on the stanchion in the photo, ring of light on it; the scoreboard box grows out of it in the same red LED style and slides to the top of the stage: RAPTORS 0 / LAKERS 0, 1ST 12:00. The Raptors and Lakers logos land bare at its ends |
| the night started | the clock runs fast (12:00 -> 0:00); both scores roll with the real play-by-play (every scoring play, `kobe-81-scoring.json`) |
| terribly. | lands: END 1ST, RAPTORS 36 LAKERS 29, the 36 a beat brighter; the photo dims one step behind it |

### 3. `starters`, dark, 8.40-14.90 s
"The Lakers' starting five was Smush Parker, Kobe, Lamar Odom, Kwame Brown and Chris Mihm. Not exactly a super team."

New real thing: **the starting lineup introduction**: the dark arena, one spotlight per name, the five real players
cut out of Commons photos at their real heights. MAN scale.

| Word | What changes |
|---|---|
| The Lakers' | the photo darkens to a black arena; the scoreboard shrinks to the top; a hardwood strip lights along the bottom of the stage (the STAPLES maple and the gold sideline band) |
| starting | lands: five empty spotlight circles open on the floor strip, left to right, each with its number plate in grey: 1, 8, 7, 54, 31 |
| Smush Parker, | lands on "Parker": Smush walks into spot 1 (cut-out, `commons-smush-parker-1-2006`, "pragmatopian, CC BY 2.0"), plate "PG #1 6-4" |
| Kobe, | lands: Kobe into spot 2 (the gold #8 cut-out, "Sgt. Joseph A. Lee, USMC, public domain"), a touch brighter, plate "SG #8 6-6" |
| Lamar Odom, | Odom into spot 3 (#7 "ODOM" from behind, walking in back first, `commons-odom-7-parker-1`, "Jeramey Jannene, CC BY 2.0"), plate "SF #7 6-10" |
| Kwame Brown | lands on "Brown": Kwame into spot 4 rising as at the opening tip (his #54 jump cut out of `commons-staples-opening-tip-2006`, "malingering, CC BY 2.0"), plate "PF #54 6-11" |
| Chris Mihm. | lands: Mihm into spot 5, ball palmed (`commons-mihm-31-2005-full`, "Jeramey Jannene, CC BY 2.0"), plate "C #31 7-0"; a thin height ruler draws behind all five, the heads at their true heights |
| Not exactly | the camera pulls back so all five stand small in a row |
| super | lands: the four spotlights other than Kobe's flicker and drop to half; Kobe's spot stays full. Nothing is written over them |
| team. | the lineup slides down and out of the stage, Kobe last |

### 4. `halftime`, dark, 15.26-22.88 s
"At halftime the Raptors were up 63 to 49, and the home crowd was booing. Kobe had 26 points, which sounds like a lot,
until you hear what came next."

New real thing: **the home crowd booing** (the stands of the night photo), then **Kobe's 9 x 9 board** born out of
the Lakers' 49.

| Word | What changes |
|---|---|
| At halftime | the endlessbender photo returns big, cropped to the stands (upper left of the frame: rows of real fans, the stairs and rails, the gold seats); a slow push in. The scoreboard stays small at the top; its clock runs the 2nd quarter fast with the real scoring plays |
| 63 | lands: HALF, RAPTORS 63 (red digits lock), the Raptors logo beside it pulses once |
| to 49, | lands: LAKERS 49 locks |
| and the home crowd | the push in reaches the fans: faces and arms in the stands, the real rows filling the stage |
| booing. | lands: the crowd shakes; from every section of the stands "BOO" glyphs rise in the stands' own white, dozens, of many sizes and tilts, drifting up like sound, the biggest rising toward the small scoreboard, which trembles a pixel or two |
| Kobe had | the BOOs drift off the top and the stands dim; the LAKERS 49 drops out of the small scoreboard to centre and breaks into 49 bulbs, warm white |
| 26 | lands: 26 of them turn gold, one by one in his real scoring order (14 in the 1st, 12 in the 2nd), each make's bulbs lighting together; counter "26" white beside them; label "1 bulb = 1 Kobe point" with a hairline on the first gold bulb. The 23 white bulbs (his teammates) drift to the side and dim |
| a lot, | lands: the 26 gold bulbs snap into the top three rows of a 9 x 9 grid (the first 26 sockets), glowing |
| until you hear | the other 55 sockets of the 9 x 9 fade in as dark empty rings, one row at a time |
| next. | lands: the 55 dark sockets each catch a faint glint, left to right, like a bulb about to fire; the 26 hold. Label under the grid, grey: "81 sockets" (no number words over it) |

### 5. `deficit`, dark, 23.14-28.18 s
"Early in the third quarter, the Lakers fell behind by 18. So Kobe just decided to win it himself."

New real thing: **the game flow chart**, the two teams' running scores minute by minute, from the play-by-play.

| Word | What changes |
|---|---|
| Early in the | the 9 x 9 board shrinks to the top right corner and stays lit there (Kobe's live counter, through `takeover`); the chart draws in: x axis 48 minutes with the four quarters marked Q1 Q2 Q3 Q4, y axis points 0-125; the red Raptors line and the white Lakers line race from 0:00 to halftime (63 / 49) |
| third | lands: the Q3 band lights; both lines keep drawing into the 3rd |
| the Lakers fell | the gap between the lines fills with a dark red wash as it widens |
| 18. | lands at Q3 9:23: the lines stop at 71 and 53; a vertical hairline joins them, "18" counts up beside it, big white; the scoreboard at the top flips to 3RD 9:23, RAPTORS 71 LAKERS 53 |
| So Kobe just | a cut-out of Kobe (the gold #8 photo, credit) rises at the right edge of the chart, at the tip of the Lakers line |
| decided | lands: the tip of the Lakers line turns gold |
| himself. | lands: the gold tip lunges up one step to the next real point (his 21 ft jumper, 3rd 8:42, 71-55) and the 18 rolls down to 16. Hold |

### 6. `takeover`, dark, 28.54-35.40 s
"Pull-up jumpers, threes, drives, free throws. Every time down the floor, it was him. By the end of the third
quarter, the Lakers were in front."

New real thing: **his 3rd quarter on the STAPLES floor**: the court top-down at true geometry, painted as in the
photo, his 15 3rd-quarter shots on their real spots. FLOOR scale. Kobe's live counter is the 9 x 9 board kept small
in the top-right corner: every make lights its bulbs there, with the white number beside it (26 -> 53). Under it one
red counter, "RAPTORS since half", crawls (0 -> 22) on their real baskets. Nothing else joins the court: one focus.

| Word | What changes |
|---|---|
| Pull-up | lands: the chart folds down flat and becomes the court (the camera tilts down over the half court: purple lane, gold band, the STAPLES CENTER lettering along the sideline); the 3 made 3rd-quarter jump shots (10, 21, 18 ft) pop gold at their spots, each throwing 2 bulbs into the corner board (26 -> 32) |
| jumpers, | the three spots hold a small grey label each, real copy: "2-pt jump shot from 21 ft" |
| threes, | lands: the arc lights; his 4 made 3rd-quarter threes pop on it (26, 27, 26, 27 ft), 3 bulbs each (32 -> 44) |
| drives, | lands: 2 layups and 2 dunks pop at the rim, each with a short gold streak drawn from the arc to the rim (the drive), 2 bulbs each (44 -> 52) |
| free throws. | lands: the free throw at 5:48 (and-one after the 18 ft jumper): one bulb rises from the line (52 -> 53). The 4 missed 3rd-quarter shots show as grey x for a beat |
| Every time | the court shrinks to the left; on the right his 12 3rd-quarter scoring lines from the play-by-play stack in fast, real copy, grey clock + white play ("6:22.0  K. Bryant makes 3-pt jump shot from 26 ft"), each landing with its spot relighting on the small court |
| floor, | lands: the list reaches the 1:11 dunk |
| him. | lands: every line's "K. Bryant" goes gold at once |
| By the end of | the scoreboard at the top replays the quarter's last minutes with the real running scores as each line relights: 85-83, then on the 1:11 dunk line it flips to LAKERS 87 RAPTORS 85, the Lakers row turning bright for the first time tonight |
| the third quarter, | the RAPTORS counter settles at 22; the corner board holds 53, its 27 new bulbs glowing |
| front. | lands: the scoreboard flips END 3RD, LAKERS 91 RAPTORS 85, a gold flash along the LAKERS row. Source line "Basketball-Reference play-by-play" |

### 7. `secondhalf`, dark, 35.64-42.02 s
"In the second half alone, Kobe scored 55 points. The whole Raptors team scored 41. One guy, against five."

New real thing: **Kobe alone against the five real Raptors starters**, at real heights, each with his own red
bulbs. MAN scale. The creator's "Kobe alone vs five Raptors silhouettes".

| Word | What changes |
|---|---|
| In the second half | the court slides away; the 9 x 9 board comes to centre and the 4th quarter plays on it: the last 28 sockets light gold in his real order (53 -> 81), fast, the board full |
| alone, | lands: the 55 second-half bulbs lift off the board (the first 26 stay behind and dim) and pour down onto the left of the stage |
| Kobe scored | Kobe's cut-out stands on the left (the gold #8 photo, credit), the 55 bulbs piling into a column at his side |
| 55 | lands: the pile settles with weight; counter rolls to 55, white, big |
| The whole Raptors team | on the right, five dark figures step in at real heights, traced from real photos (Mike James and Morris Peterson from their Jan 27 2006 Commons photos, Bosh from the Raptors-at-Milwaukee wide; Rose and Bonner plain dark shapes at their heights, no faces), filled navy-black with a red rim light, each with name and number below in grey: Rose 5, Bosh 4, James 13, Peterson 24, Bonner 16. The Raptors logo bare above them |
| scored | each Raptor's second-half points light as red bulbs above his head, from the play-by-play: Rose 13, Bosh 8, James 7, Bonner 7, Peterson 2; the bench's 4 (Graham 3, Villanueva 1) as a small heap at their feet labelled "bench" |
| 41. | lands: all the red bulbs flow into one red column, counter 41; it stands clearly lower than the gold 55 |
| One | lands: the camera pulls back; Kobe's column and the Raptors' column side by side, but read as people: one figure under the gold, five under the red |
| against five. | lands on "five": the five figures step together as a wall; Kobe and his 55 hold. Source line "Basketball-Reference play-by-play" |

### 8. `eightyone`, dark, 42.42-47.56 s
"He finished with 81 points on 28 of 46 shooting, and the Lakers won 122 to 104."

New real thing: **the 81 itself, built from his bulbs**, then **Kobe's real box score row** from Basketball-Reference
(DOCUMENT scale), the 81 landing in its PTS cell. Holds the reel's big move. The court is not redrawn here (it was
`takeover`'s picture); the scoreboard stays small at the top.

| Word | What changes |
|---|---|
| He finished | the 55 pour back into the 9 x 9 board, full again, centred |
| 81 | lands: THE BIG MOVE. all 81 bulbs leave their sockets at once and fly into two huge bulb-matrix digits "81" (seven-segment built of bulbs, the scoreboard's own style, filling the stage width), slamming down with weight, a gold bloom, the stage shaking once |
| points | the "81" holds and breathes |
| 28 | lands: the 81 shrinks and drops into the PTS cell of BBR's box score row, which writes out around it at real copy and column order (Starters, MP, FG, FGA, FG%, 3P, 3PA, 3P%, FT, FTA, FT%, ... PTS): "Kobe Bryant 41:56", then FG counts 0 -> 28 gold |
| of 46 | FGA counts 0 -> 46 white beside it, FG% ".609" types on; label "Basketball-Reference box score" |
| shooting, | lands: 3P "7" / 3PA "13" and FT "18" / FTA "20" fill in a quick left-to-right sweep, each cell rolling |
| and the Lakers | the row lifts a step; under it the Lakers' Team Totals row slides in (its PTS cell empty) |
| won | lands: the small scoreboard at the top flips FINAL, LAKERS row bright |
| 122 | the Team Totals PTS rolls to 122 and the scoreboard's LAKERS 122 locks with it |
| to 104. | lands: RAPTORS 104 on the scoreboard; under the rows BBR's line score writes in, real copy: "TOR 36 27 22 19 104 / LAL 29 20 42 31 122" with the 42 and 31 lit |

### 9. `alltime`, dark, 48.22-52.02 s
"That's the second most points in NBA history, behind only Wilt Chamberlain's 100." (See the fact flag.)

New real thing: **Basketball-Reference's single-game points list**, redrawn at its real copy (Rank, Player, PTS,
Date, Tm), with the two men's photos. DOCUMENT scale.

Built for the voice as it is locked now (default): the list is shown as it stood from 2006 to 2026, titled small in
grey "Most points in an NBA game, 2006-2026", so nothing on screen is false; it ends without Bam's row. Only if the
creator re-voices the sentence ("For twenty years, that was the second most...") does Bam Adebayo's 2026 row slide in
above Kobe's as the last beat. The creator is told the caption and voice are out of date either way.

| Word | What changes |
|---|---|
| That's the | Kobe's box score row folds down to a list row (Player, PTS, Date, Tm) and drops out of view while the rest clears; BBR's list writes in from the bottom up, real rows: Wilt 72, Wilt 73, Wilt 73, Thompson 73, Wilt 78 (Luka's 2024 73 is left out: the list is the 2006 one) |
| second | lands: Kobe's row "Kobe Bryant 81 2006-01-22 LAL" drops in above Wilt's 78 with weight; its 81 glows gold (his last gold in this game); the Lakers logo beside it |
| history, | lands: the list's lower rows dim; a Kobe photo card (the MSG purple #8 photo, "David Watterson, CC BY 2.0") slides in at the left of his row |
| behind only | an empty row opens above Kobe's, the rows below slide down |
| Chamberlain's | lands: Wilt's row "Wilt Chamberlain 100 1962-03-02 PHW" lands at the top with the Warriors logo and "Philadelphia Warriors, 1962"; the Commons photo of Wilt holding the "100" sign appears in a card beside it (credit) |
| 100. | lands: the 100 counts up 0 -> 100 in white. Only with the re-voiced sentence: Bam's row "Bam Adebayo 83 2026-03-10 MIA" slides in between with the Heat logo, Kobe's row steps down to 3 |

### 10. `dallas`, dark, 52.66-61.94 s
"And it wasn't even a one-off. A month earlier, Kobe outscored the entire Dallas Mavericks through three quarters,
62 to 61, and then sat on the bench for the fourth because the game was already over."

New real thing: **the other night, December 20, 2005**: the same scoreboard box reading KOBE against DALLAS, and
**the Lakers bench** with Kobe on it while the 4th quarter clock runs.

| Word | What changes |
|---|---|
| And it wasn't even | the list slides up and out; the scoreboard box comes to centre and blanks |
| one-off. | lands: a second, older scoreboard slides in beside the first like a page turning back: same LED style |
| earlier, | lands: "Tuesday, December 20, 2005  STAPLES Center" types in grey under it (from BBR's scorebox) |
| Kobe outscored the entire | the rows relabel: top row "MAVERICKS" with the Mavericks logo, bottom row not "LAKERS" but "BRYANT" with a Kobe photo chip (credit); the scores roll from 0 with the real play-by-play: Kobe's gold bulbs and Dallas's blue bulbs light in two 9-wide strips, the 1st quarter (Kobe 15, DAL 18), the 2nd (32, 44) |
| Mavericks | lands: the Mavericks logo pulses once |
| quarters, | lands: the 3rd quarter runs; Kobe's gold strip races (32 -> 62), the blue crawls (44 -> 61) |
| 62 | lands: BRYANT 62 locks; the clock stops at the real 0:04.4, the moment his total passes theirs |
| to 61, | lands: MAVERICKS 61, END 3RD; source line "Basketball-Reference play-by-play, Dec 20 2005" |
| and then sat | the scoreboard moves to the top; below it a row of courtside chairs with the Lakers' purple and gold, a cut-out of Kobe (posed from the Jannene follow-through photo, credit) sits down in one, a towel over his shoulders; the chairs and the way the row sits come from the Phil Jackson bench photo and the STAPLES courtside seats |
| bench | lands: Kobe settles in the chair |
| fourth | lands: the scoreboard's period flips to 4TH and its clock starts at 12:00, running fast |
| already | the blue Dallas bulbs keep lighting (61 -> 90) while BRYANT stays frozen at 62, its gold steady; LAKERS 95 -> 112 runs small in a corner |
| over. | lands: FINAL 112-90 on the corner board; Kobe on the bench, 62 still lit. Hold |

### 11. `close`, dark, 62.42-70.20 s
"So yes, Kobe once outscored a whole NBA team in a half. Follow for the next wild NBA story, and send this to the
friend who says Kobe just shot a lot."

The hook's ground, resolved: the endlessbender photo of the night, now with the answer on its scoreboard. Then the
creator's real profile and the share sheet. One at a time.

| Word | What changes |
|---|---|
| So yes, Kobe once | the bench fades; the endlessbender photo of the night returns full (credit), the same framing the hooks stood on; Kobe's gold #8 cut-out steps in front at left; the scoreboard at the top reads FINAL 122-104 |
| outscored | lands: the scoreboard's rows relabel for the second half, as in `dallas`: "BRYANT 55" (gold bulbs) over "RAPTORS 41" (red), the digits rolling to their values |
| half. | lands: on the real floor in the photo, each red Raptors jersey gets a thin red ring, one after another; Kobe's 55 holds bright above them |
| Follow | lands: the picture lifts away; the creator's profile header slides up with the real avatar, @ballsimplified, "Ball Simplified"; the Follow button presses (Instagram's own blue is allowed here, it is the real button) and turns "Following" |
| for the next | under the profile, a dim row of the creator's post grid (their real first post thumbnail, `context/posts/18155407801470375.jpg`) |
| send this | lands: the profile leaves; the Instagram share sheet slides up from the bottom of the stage with the paper-plane icon |
| friend | lands: one contact circle lights (a plain grey silhouette, no fake name) |
| lot. | lands: the shared preview in the sheet is the 9 x 9 gold board, full, "81"; hold to the end |

## Not on screen, on purpose

- No "2nd" or "second most" written without its dates (see the fact flag). Bam's 83 only with the re-voiced line.
- No game footage, no NBA.com action photos on stage; Commons photos only, credited. The NBA.com headshot is
  reference for the builders' eyes.
- No "pull-up" label (the play-by-play does not say it). No assist counts, no plus/minus, no "career high" claim.
- No photo labelled as from Jan 22 2006 except the endlessbender photo. The others are the same season or close and
  never captioned with that date. The endlessbender file's Commons date says 2006-02-22 but its description and
  Flickr title ("Kobe 81 Points 011") say the 81 game; treat it as the 81 game, never print its date.
- The Raptors are shown as real people (figures traced from real photos, named), never as generic mannequins.
- No bar charts: comparisons are bulbs piling under people, the flow chart's two lines and the real scoreboard.
- No scale, see-saw or tug-of-war for "more than": the real scoreboard and the real bulbs say it.
- The court top-down is drawn once, in `takeover`. The Kobe-vs-five columns appear once, in `secondhalf`.
