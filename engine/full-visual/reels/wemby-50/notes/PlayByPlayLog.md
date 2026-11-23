# PlayByPlayLog (`answer`, 5.40-10.31 s)

"That's how many shots he took against the Pelicans on Saturday, and it's what made the fifty so rare."

## What I looked at

- `assets/refs/pages/bbref-pbp.html` (new, fetched for this scene): Basketball-Reference's real play-by-play page,
  "New Orleans Pelicans at San Antonio Spurs Play-By-Play, November 21, 2026". A table, one header row per quarter
  ("1st Q" ... "4th Q"), columns Time | New Orleans | (+pts) | Score | (+pts) | San Antonio. Score is away-home
  ("4-5" = NOP 4, SAS 5). Scoring plays carry `bbr-play-score` and a "+2" / "+3" cell. His 29 field goal attempts
  are 29 rows in the San Antonio column, real copy: "V. Wembanyama makes 2-pt dunk at rim", "misses 3-pt jump shot
  from 27 ft", "makes 2-pt layup from 3 ft (assist by D. Fox)". Shot types: 5 dunks, 7 layups (2 missed), 17 jump
  shots. Assists by D. Fox (6), K. Johnson (4), S. Castle (3), H. Barnes (1). Last one: 4th Q 6:29.0, 82-108.
- `assets/refs/pages/bbref-shots.html`: the same 29 shots as chart tooltips ("San Antonio now leads 108-82") and the
  BBR marker glyphs: `&#9679;` filled dot = make, `&#215;` = miss, on the 500 px court image.
- `assets/refs/wemby-shots-court.json`: the 29 in feet from the rim centre (fitted, < 0.5 ft). Same order and clocks
  as the pbp rows (checked one by one).
- Logos `nba-spurs-primary.svg` (white spur, silver C2CCD2) and `nba-pelicans-primary.svg` (navy 0A2240, gold B4975A,
  red CE0E2D, white): bare.
- The Toronto wide photo: the real maple (honey, boards running baseline to half court, satin sheen from the arena
  lights, white 2 in lines, a dark painted lane). The NBA Cup photo (Daiei Onoguchi, CC BY 4.0): his face, grey road
  #1, for the "who" card.
- The creator's first post: photo cards with a 22 px grey credit top right, logos bare, big white numbers.
- The closest example: ps5-on-pc `KytyLive*` (a live log answered row by row while a board reacts). Its lesson: the
  rows are real copy at real geometry, and each row does something to the object beside it.

What gives a fake away: a log with invented wording, a score that does not match the time, a court with wrong
proportions (lane 16 x 19 ft, arc 23.75 / 22 ft), marks not where BBR put them, all 29 lines arriving at once.

## Think

The real thing: the game in time. BBR's 29 rows are the cost written down; each row is a mark on the floor.

Layout (absolute px): left column x 56-386 = the game (who, where, score); right column x 416-1024 = the record.
- Photo card of him (Onoguchi crop, credit), y 548-700.
- Small court 330 wide (6.6 px/ft), y 716-1026, true geometry, BBR orientation (baseline on top).
- Running score: Spurs logo + SAS n, Pelicans logo + NOP n, game clock "1st Q 10:46.0".
- Tally top right: white counter + grey "/ 29", label "field goal attempts".
- Log card y 720-1340: header "Basketball-Reference · Play-By-Play", column heads Time | San Antonio | Score, quarter
  rows, 29 rows written in and scrolling like a live feed.
- Broadcast strip y 1366-1436 on "Saturday".

Word, then change:
- (hand-over) the hook's frame: court centred big, 29 marks lit, "29" big at the top.
- That's how many: the court slides and shrinks to the left column, its marks dim to outlines; the 29 slides to the
  top right and becomes "/ 29" with a "0" before it; the card unfolds.
- shots (lands): row 1 writes in; its mark relights with a ring; tally 1, clock 1st 10:46.0, score 3-2. Then a row
  every 4.2 f (0.07 s): 29 rows by 478 f, the clock runs through four quarters, the score climbs to 108-82.
- Pelicans (lands): the Pelicans logo drops into the score block opposite the Spurs (row ~12 is writing).
- Saturday (lands): the strip lands "SAT NOV 21 · FROST BANK CENTER · FINAL · SAS 114 · NOP 91".
- and it's what made: the log folds into one column of 29 marks (rows collapse, the text goes), the court returns to
  the centre, bigger, all 29 marks lit.
- 50 ... rare (ends on): a white 50 drops and counts beside the 29: "29 shots", "50 points".

Sound-off test: a stranger sees a list of real game rows ticking his shots off one by one, each landing on the floor,
the clock running a whole game and a counter reaching 29 while the score climbs; then 29 next to 50. "He took 29 shots
and got 50": the ratio is the point.

## Built, and the hand-over

- Frame one (from 5.30 s) is the hook's frame as plan.md describes it: the court top-down, centred, x 160-920
  (15.2 px/ft, court top y 700), 29 marks lit, a white "29" in Figtree 700 at 176 px centred at the top (y 530).
  A hook that ends on a different framing still hands over cleanly (it lifts off over this), but matching it is
  smoother: `HAND` in PlayByPlayLog.tsx is the one constant to change.
- Stills checked at 5.36, 5.5, 5.75, 6.1, 6.3, 6.5, 7.0, 7.2, 7.5, 8.0, 8.05, 8.4, 8.5, 8.6, 8.9, 9.4, 9.95, 10.2 s.

## Review (fresh eyes)

- Stills read at 5.15-10.45 s every ~0.4 s. All 29 rows checked against bbref-pbp.html: times, copy, scores, assists match; 20 makes; quarters 10/5/7/7.
- Fixed: the row scrolling out under the column heads now fades (top mask) instead of a half-cut line; on "and" the log text and card clear in 7 and 10 frames, so the court no longer slides back under a half-visible log.
- Pass. Left for the hook builder: the HAND frame assumes HookX1 ends on the centred court and big 29 (HookX1 is still a stub).
