# PhoneBoxScore (scene `boxscore`, 10.52-17.92 s)

## What I looked at

- `pages/boxscore-0022600278-clean.json`: the 12 Spurs rows in NBA.com order, 20 stat columns
  (MIN FGM FGA FG% 3PM 3PA 3P% FTM FTA FT% OREB DREB REB AST STL BLK TO PF PTS +/-). Wemby is row 3:
  31:51 20 29 69.0 5 11 45.5 5 6 83.3 3 15 18 1 4 5 3 3 50 35. Starters carry F F C G G, bench no position.
- NBA.com's own stylesheet for the box score (fetched `_next/static/css/4e078d3637bec0e2.css` and the token sheet),
  dark mode values, read off the CSS rather than guessed:
  - table ground `--surface #191c23`, text `#f3f3f3`, header text muted `#a4a2a2`, row rules `--abyss #1a2e3d`
    (1 px border-top on every td), page ground black `#000000`;
  - `thead th`: 12 px, uppercase, letter-spacing 1 px, condensed, padding 14px 6px, bottom aligned;
    the first th is sticky left with a shadow `1px 0 5px -2px rgb(0 0 0 / 10%)`;
  - `tbody td`: 14 px, padding 10px 6px on a phone, right aligned numbers; first td sticky left, shadow
    `3px 0 3px -2px`; MIN cell bold (`GameBoxscoreTable_minutes`);
  - player cell: Roboto Condensed, on a phone the SHORT name ("V. Wembanyama", full name hidden under 768 px),
    position after it at 10 px weight 900 ("C"); the 27 px headshot is hidden on a phone;
  - body font Roboto; team header in Knockout Wide uppercase 22 px;
  - inner nav tabs 45 px tall, active tab bold with a 4 px underline in text colour.
- Logos: cdn.nba.com Spurs primary (white and silver, reads on the dark table), Pelicans primary, NBA logoman.
- Photo: Commons, Frenchieinportland, CC BY 4.0, Portland 2024 (upright copy): Wemby head and shoulders, black Spurs
  #1 jersey with white piping, mouth open, sweat on the forehead, warm arena light from upper left, crowd soft behind.
- The creator's first post: photo cards with rounded corners, a thin light rim, grey credit top right ~22 px,
  logos bare in the corner, big white numbers in a heavy sans.

What gives a fake away: a box score with made-up columns or a light theme on a dark reel; names in full on a phone;
numbers left aligned; a header that does not scroll with the body; the pinned column scrolling away; a fling that
stops dead (iOS decelerates and rubber-bands at the end, and shows the thin scroll indicator while moving).

## Think

The real thing: NBA.com's game page, Box Score tab, in dark mode, on an iPhone, at the moment it is opened.
Phone screen 393 pt wide drawn at 2.24 px/pt (880 px), so every CSS number above is multiplied by 2.24.

Details that make it real: status bar (time, island, signal, wifi, battery), the black NBA.com bar with the logoman,
the score strip NOP 91 FINAL 114 SAS with both logos, the tabs (Summary, Box Score, Game Charts, Play-By-Play),
the "SAN ANTONIO SPURS" team header, the sticky PLAYER column with its shadow, the 1 px rules, the bold MIN,
the iOS horizontal scroll indicator, the rubber band at the end of the fling.

Word, then change:
- `Imagine you open` (entrance from scene.from - 6): the phone rises into the stage with the page loaded to the
  Summary tab; on "open" the tab underline slides to Box Score.
- `score.` ends on: the 12 rows write in, 4 f apart, cell by cell left to right.
- `50` lands: a real fling: the body and header scroll left together (decay curve), indicator visible, rubber band
  at the end; PTS is in view as "50" is said; Wemby's PTS cell counts 0 -> 50 and the number grows out of the table.
- `name` lands: the pinned "V. Wembanyama C" lights (row tint, the other rows dim), the Portland photo card slides
  in from the row's left edge to the top left with its credit.
- `shot all night`: slow push in on the big 50, a light sweep across it. Nothing new enters.
- `tell` lands: his row lifts out of the table; the other rows fall away; the phone sinks back and darkens. The
  row scrolls back to its start while every cell but FGA, FTA and PTS collapses to nothing; the big 50 flies home
  into the PTS cell; a hairline separates FGA/FTA from PTS.
- `got,` lands: PTS 50 lit white, "what he got" under it with a hairline tick.
- `cost.` lands: FGA 29 and FTA 6 turn gold (#F2B33D) and lift 8 px; "what it cost" under both. Gold enters here.

Sound-off test: a stranger sees a real box score, the 50 pulled out of it next to Wembanyama's face, then the row
stripped to three numbers, 50 labelled what he got and 29 + 6 in gold labelled what it cost.
