# PopovichClock (`popovich`, 63.08-68.22 s)

"Even Gregg Popovich joked about it, fouling him five seconds into a season opener and flashing two thumbs up."

## What I looked at

- `photos/commons-popovich-sideline-2010-mike-ccbysa2.jpg` (960 x 1179, Mike, CC BY-SA 2.0, 17 Mar 2010). Seen from
  above and in front: Popovich walking the sideline, head turned to his left (our right), looking back over his
  shoulder. Grey-white hair swept back, a deep crease at the eye. Navy two-button blazer, notched lapels, two brass
  buttons on the front (one at y 375, one at y 440), three small brass buttons on the left cuff (x 330, y 570). Light
  blue shirt with a fine white check, open collar, a clip-on mic on the left lapel. Khaki trousers, brown belt, brown
  shoes. The floor is half black paint (white "...gic.com" lettering) and half maple, the white sideline between.
  Light from above (arena lights): bright top of the head and shoulders, the face mostly in shade. His face is small
  in the frame: head about 110 px wide, so a push stops near 1.2x stage scale, never soft.
- `pages/bbref-pbp-2008-10-29-phx-at-sas.html` (Basketball-Reference): H1 "Phoenix Suns at San Antonio Spurs
  Play-By-Play, October 29, 2008". Table "1st Q", columns Time | Phoenix | (blank) | Score | (blank) | San Antonio.
  Rows: "12:00.0 Start of 1st quarter", "12:00.0 Jump ball: T. Duncan vs. S. O'Neal (M. Barnes gains possession)",
  "11:55.0 Personal foul by M. Finley (drawn by S. O'Neal)" in the Phoenix column, score "0-0". Names are links.
  The next row is "11:45.0 S. O'Neal misses 2-pt jump shot from 6 ft": the foul only gave the ball back, a joke foul.
- NEW: `photos/commons-att-center-spurs-nuggets1-zereshk-ccbysa3.jpg` (Zereshk, CC BY-SA 3.0, AT&T Center, Spurs v
  Nuggets, the 2008-09 era: "Rodeo of the Year 2008" banners, the H-E-B Fan Zone). The real San Antonio game clock:
  a square black box on a steel post above the backboard, two bolts on its roof, a lighter aluminium lip at the
  bottom, diagonal braces under it. The game clock is the TOP row, amber-yellow seven-segment LEDs ("8:50"), the
  colon two small squares, digits slanted a few degrees; the unlit segments stay faintly visible as dark grey LED
  dots (the detail that gives a fake away). The shot clock under it is big red digits. Behind: the dark bowl, the
  centre-hung board, white lights.
- `logos/nba-spurs-primary.svg` (white and silver wordmark with the spur, bare) and `logos/nba-suns-primary.svg`
  (orange and purple sun-ball, bare), both cdn.nba.com.
- `public/shaq-free-throws/grannyshot-shaq.png`: the Suns shooting cut-out (Keith Allison, CC BY-SA 2.0), Suns
  purple #32 "PHOENIX", ball at the chest. Copied as `popovichclock-shaq.png`: he was a Sun that night.
- facts.md: "having Michael Finley commit an intentional foul five seconds into the first game of the regular season
  ... Popovich smiling while giving two thumbs up".
- Examples: `examples/touchscreen` stills and the sibling scenes `GrannyShot` and `RecordBoxScore` (the dark BBR card
  #161B22, hairline #30363D, real copy at real geometry), so the log here reads as the same page.

## Think

The real thing: the night itself written three ways. Pop's real photo, the real arena clock of the building it
happened in, and the real line of the play-by-play. The joke is that the foul is on paper as a normal personal foul,
five seconds in, with nothing at stake.

Choices:
- The clock is the AT&T Center shot-clock unit, drawn: amber game clock (the real colour, not white), each segment
  made of LED dots, unlit segments as dark dots, the housing, bolts, aluminium lip, post and braces. I keep only the
  game clock row: the real shot clock row is red, and red on this reel means the foul. The last digit of 11:55
  turns foul red, the only red on the unit.
- The arena photo sits behind the clock as a dark, blurred band: the place it happened. Credit in the corner.
- Spurs logo starts beside Pop's card, then travels under the clock into the matchup line, and the Suns logo joins
  it: one object moved, not replaced.
- The play-by-play is the BBR log card in the reel's dark BBR style: 1st Q header, the jump ball row, then the foul
  row typing on, "M. Finley" in foul red, score 0-0 in its own column.
- Shaq is the Suns cut-out beside the log; on "fouling" three foul red contact strokes land on his forearm (the
  reel's grab mark).
- The thumbs are drawn hands (palm side, fingers stacked, thumb up with its nail), white shirt cuff with Pop's blue,
  navy blazer sleeve with three brass buttons, as on his real cuff.

Layout (px): stage band 520-1450.
- A, y 560-1040: Pop's card left (x 40-460); clock unit right (x 500-1040, y 590-860); matchup line under it
  (y 890-1030).
- B, y 1060-1440: Shaq cut-out left (crown y 1075, x 0-420), the log card right (x 420-1040, y 1090-1400).

Word, then change (frames from words.json):
- mount (from - 6): Pop's card rises centred, full photo; Spurs logo bare beside it.
- Even Gregg: the card settles; credit fades in.
- Popovich: lands: slow push in to head and shoulders (to 1.2x).
- joked: lands: the card wobbles, a playful tilt left-right-settle.
- about it: the card shrinks to the top left; the dark arena band fades in behind the right; the clock unit drops in
  on its post showing 12:00, "1st quarter" small grey; the Spurs logo travels down into the matchup slot.
- fouling: lands: the log card slides up, the jump ball row in place, the foul row types on; Shaq's cut-out rises
  beside it; three foul red contact strokes snap onto his forearm.
- him: the clock starts running: 11:59, 11:58, ...
- five: lands: 11:55, it stops; the last 5 flips to foul red with a ring; the log's 11:55.0 brightens.
- seconds into: a grey bracket under the digits draws left to right, "5 seconds".
- season: the Suns logo pops into the matchup line left of "at": "PHX at SAS".
- opener: lands: "Oct 29, 2008" types under it, "Game 1" small grey.
- and flashing two: everything else dims and steps back; Pop's card comes to the centre, bigger.
- thumbs: lands: two drawn thumbs-up hands drop in at both sides of the card with weight (overshoot, squash, wobble).
- up.: ends on: they settle; slow push; hold.

Sound-off test: Popovich, the Spurs, a game clock running five seconds from 12:00, the play-by-play saying "Personal
foul by M. Finley (drawn by S. O'Neal)" at 11:55, Shaq in a Suns jersey, a date that is the first night of the
season, then Pop with two thumbs up. A stranger reads "Pop fouled Shaq on purpose five seconds in, as a joke".

## Built (after two compare passes)

- Files: `scenes/PopovichClock.tsx`, `PopovichClockLed.tsx` (the LED unit), `PopovichClockLog.tsx` (the BBR log),
  `PopovichClockThumb.tsx` (the hand). Public: `popovichclock-pop.jpg`, `-arena.jpg` (new ref, 1920 px Commons
  thumb), `-shaq.png` (copy of the granny cut-out), `-spurs.svg`, `-suns.svg`.
- Credits on screen: "Mike, CC BY-SA 2.0" in Pop's card, "Keith Allison, CC BY-SA 2.0" and "AT&T Center: Zereshk,
  CC BY-SA 3.0" at y 1452. The arena photo is not yet in `assets/refs/credits.json` (not my file): page
  https://commons.wikimedia.org/wiki/File:AT%26T_Center_Spurs_Nuggets1.JPG, licence read from Commons extmetadata.
- Fixed on compare: "M. Finley" wrapped (columns widened), the Spurs logo crossed in front of the clock (now passes
  behind it), the Suns logo sat on "PHX", "5 seconds" collided with the matchup line (now sits in the bracket), the
  grab marks floated off Shaq's arm, the thumbs were too long and pink (shorter thumb, real fist proportions, roll
  shadows, the sleeves and brass buttons out from behind the card), the card credit was unreadable on the maple.
- Richer pass: unlit LED dots, hot LED centres that pop on each tick, the arena lights sliding across the clock's
  glass, a slow push on the whole stage while it holds, the 11:55.0 row lighting on "five".
- Render check on a 62.6-68.6 clip: longest still stretch 0.23 s. The hand-over into `rule` is bare only because
  `RulebookAwayFoul` is still a stub.
