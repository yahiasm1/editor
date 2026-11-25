# dallas: DallasBench (52.66-61.94 s)

"And it wasn't even a one-off. A month earlier, Kobe outscored the entire Dallas Mavericks through three quarters,
62 to 61, and then sat on the bench for the fourth because the game was already over."

## What I looked at (full size)

- `pages/bbref-box-200512200LAL.html`: the scorebox reads "December 20, 2005, STAPLES Center, Los Angeles,
  California" (a Tuesday), Dallas 90 (18-7 after it). Line score DAL 18 26 17 29 = 90, LAL 25 28 42 17 = 112.
- `dallas-scoring.json` (every scoring play from BBR's play-by-play), summed by quarter here:
  Q1 DAL 18 Kobe 15, half DAL 44 Kobe 32, end of Q3 DAL 61 Kobe 62, Q4 DAL 90 Kobe 62 (0 in the 4th, 29 for Dallas).
  Q3 is almost all Kobe: 21 scoring plays, a pile of free throws (two techs and a flagrant), and the 3 from 25 ft at
  0:04.4 that takes him from 59 to 62, past Dallas's 61 (D. Harris free throw at 0:16.8). Q4: the Lakers' bench
  (Profit, Vujacic, Walton, Bynum, Green) take it 95 -> 112, Dallas 61 -> 90 (last basket D. Armstrong, 0:14.4).
- `commons-staples-opening-tip-2006-malingering-ccby2.jpg` (1920x1337, STAPLES, Feb 15 2006): Kobe from behind at the
  jump, home gold #8, "BRYANT" arched in purple-edged letters, white 8 with purple and gold outline, purple collar,
  a gold wristband on the left arm, right arm bent out with a fist. About 160 px wide at the shoulders: small, so the
  cut-out is a 4x denoised GrabCut from a hand polygon (`cutouts/dallasbench-kobe-back.png`), shown at 2x with grain.
  It is the right uniform: the Lakers wore home gold at STAPLES on a Tuesday that season.
- `commons-staples-shotclock-2005-nivsinger-ccbysa2.jpg` (STAPLES, Oct 2005): the real courtside row: black padded
  chairs with a horizontal seam, thin black frames, the yellow apron of the floor, the gold Porter stanchion, fans
  sitting low. Light from the overheads: hot tops, dark under the seats. This is the room behind the bench.
- `commons-phil-jackson-bench-2005-jerameyjannene-ccby2.jpg` (Dec 2005): how a bench row sits: chairs shoulder to
  shoulder right on the sideline, white towels across laps and chair backs, players slumped back, coaches standing.
- `commons-kobe-ft-gold8-2005-josephalee-pd.jpg`: Kobe's face for the BRYANT row chip (clear, front lit).
- The thread object as left by `eightyone`: `StaplesNightBoard` parked at x 90 y 532 (900 x 160), FINAL 104-122,
  red seven-segment scores with dim unlit segments, amber dot-matrix names and period, amber clock.

What would give a fake away: a board that says KOBE vs DALLAS with numbers that do not add up by quarter; Kobe in
purple at home; a bench of folding chairs that STAPLES never had; bulbs that light without a play behind them; a
clock that does not stop at the real 0:04.4.

## Thinking

- The real thing: the other night, Dec 20 2005, told by the same scoreboard. One board turned back a page, its
  LAKERS row relabelled BRYANT (photo chip), the bulbs the reel uses for points: Kobe gold on a 9 x 9 board (the
  reel's 81 board: he fills 62 of it), Dallas in Mavericks blue on a 9 x 10 board (90 sockets, their final).
  Then the bench: the camera behind the Lakers bench row, Kobe's real back (BRYANT 8) in a black STAPLES courtside
  chair, a white towel on his shoulders, the real STAPLES courtside photo across the floor, out of focus.
- Details that make it real: the board's dim unlit segments; the clock in tenths under a minute ("4.4"); every bulb
  from a real play in real order; the Mavericks logo bare (cdn.nba.com); the chair seam and frame; grain on the
  upscaled cut-out; a towel with terry texture; the arena light falling from above on his head and shoulders;
  the corner box showing the real game score (LAL 95 -> 112) while the big board keeps the joke (BRYANT 62).

| Word | What changes |
|---|---|
| And it wasn't even | the parked board (FINAL 104-122) travels down to centre; on "even" its digits go dark |
| one-off. | lands: a second board turns down over it from its top edge like a page going back (same LED box), MAVERICKS (logo) / LAKERS (logo), 1ST 12:00 |
| A month earlier, | the date line above it backspaces "Sunday, January 22, 2006" and retypes "Tuesday, December 20, 2005" (lands on "earlier"); "STAPLES Center" writes in; the two empty socket boards fade in under it, labelled |
| Kobe | the LAKERS row rolls to BRYANT, the Lakers logo flips to Kobe's photo chip |
| outscored the entire | the 1st quarter runs on the clock, every scoring play lights its bulb (gold Kobe, blue Dallas): 15-18, then the 2nd: 32-44 |
| Mavericks | lands: HALF, the Mavericks logo pulses once |
| through three quarters, | the 3rd races: the gold board fills row after row (free throws one bulb each), the blue crawls; under the board the latest BBR play line runs ("Q3 0:04.4  K. Bryant makes 3-pt jump shot from 25 ft", his name gold) |
| 62 | lands: the 3 at 0:04.4: BRYANT 62 locks, the clock freezes at 4.4, the gold board flares |
| to 61, | lands: MAVERICKS 61 brightens, the clock runs out, END 3RD; source line |
| and then sat | the board lifts to the top; the 171 bulbs fly into two thin strips under it; the bench card rises: black chairs from behind, the real courtside across the floor; Kobe stands at his chair |
| bench | lands: he sits down (60 px drop, a small settle); a white towel drops over his left shoulder |
| fourth | lands: 4TH, the clock restarts at 12:00 and runs |
| because the game / was already | the blue strip and MAVERICKS climb 61 -> 90 past his 62; the corner box rolls LAL 95 -> 112; BRYANT holds 62, steady gold |
| over. | lands: FINAL on both boards, 112-90 in the corner; hold |

Sound-off test: a scoreboard with BRYANT against MAVERICKS, gold beating blue through three quarters, then the same
man sitting down while blue walks past his frozen 62, and the real final in the corner. It reads: he beat a team by
himself, then sat because it was over.

## Built and checked

- Files: `scenes/DallasBench.tsx`, `DallasBenchBoard.tsx` (board with relabelling rows, corner box, bulb, logo, chip),
  `DallasBenchData.ts` (play-by-play as game time; points per bulb). Public: `dallasbench-kobe-back.png` (cut-out,
  chroma-smoothed, skin denoised, letters kept), `dallasbench-kobe-chip.jpg`, `dallasbench-staples-courtside.jpg`,
  `dallasbench-mavericks.svg`, `dallasbench-lakers.svg`.
- Rendered stills across 52.5-62.2 s and a 52.2-62.4 s clip: longest still stretch 0.43 s; flip and the
  bench handover checked at 30 fps. Richer pass: the play-by-play ticker, chair stitching and frame, the light
  travelling along the row, the cut-out redone (the first had JPEG mottling on the skin), the towel redrawn on one
  shoulder (two shoulders read as a horseshoe), the chair-back towels dropped (they read as paper).

## Review pass 2: the bench, made real (59.9-61.94 s)

The reviewer: the upscaled back cut-out (160 px source at 4x) read as a painting, kept the jump-ball pose, and the
CG chairs and vector towel read as clip art. Commons search and the full-size Niv Singer original both returned 429
all session, so no larger seated or from-behind Kobe could be found. I took the honest route the note offered:

- The chairs are no longer drawn. The card is the real STAPLES courtside photo (Niv Singer, Oct 21 2005, 1280 px),
  cropped tight on four empty padded chairs, the rim and net, and the fans behind: hot tops, dark under the seats,
  leather sheen, the photo's own grain. A Bobcats player's head in front of chair 2 is filled from the identical
  chair one seat over (the row repeats every 82 px); the print lands on that spot.
- Kobe is his real photo, not a cut-out: Sgt. Joseph A. Lee's Oct 11 2005 shot (full 2048 x 3072 original, home
  gold 8, LAKERS), cropped head to chest above the ball, as a bordered print with grain. On "sat" it drops into chair 2
  (blur-in, 170 px fall), lands on "bench" with a settle. Resting, looking up, breathing out: no jump-ball fist.
- The towel is thrown over the print's corner across his right shoulder: lit terry (turbulence through diffuse
  lighting), a fuzzy displaced edge, creases fanning from the hang point, a slanted woven band, a thick roll on top,
  and a soft shadow on the jersey. It hangs low, to the print's bottom edge.
- Credits sit under the card beside the source line: "STAPLES courtside, Oct 2005: Niv Singer, CC BY-SA 2.0" and
  "Kobe photo: Sgt. Joseph A. Lee, USMC, public domain". The malingering credit is gone with the cut-out.
- Note 5: the socket boards now fade in 6 frames after the older board lands, so 53.5 s is no longer bare.
- Asset prep: `assets/refs/cutouts/dallasbench-prep.py`. Public: `dallasbench-kobe-print.jpg`,
  `dallasbench-courtside-row.jpg` (the old back cut-out and blurred courtside plate removed).
