# RecordGameLog (`record`, 22.48-28.16 s)

"So how does a guy score 100? That season Wilt averaged 50.4 points a game, which is still the record."

## What I saw (references at full size)

- `photos/commons-wilt-1962-pd.jpeg` (500 x 1525, public domain): a yearbook halftone print, Wilt full length walking
  on a gym floor, chin up, eyes up and to his right, thin moustache, close-cropped hair, sweat shine on the neck and
  shoulders, white tank with a dark piped collar. A backboard edge and a white wall panel sit behind his left side.
  The jersey lettering (SAN FRANCISCO, 13) starts at y about 360 of the thumb, so the crop ends at 350: head and
  shoulders only, never the city. Saved as `public/wilt-100/recordgamelog-wilt-1962.jpg` (2x, light unsharp mask).
  The fuller original on Commons answered 429.
- `pages/bbref-wilt-gamelog-1962.html` and `wilt-gamelog-1962-clean.json`: page title "Wilt Chamberlain 1961-62 Game
  Log", table "Regular Season", real columns Rk, Gcar, Gtm, Date, Team, (@/N), Opp, Result, GS, MP, FG, FGA, FG%, FT,
  FTA, FT%, TRB, AST, BLK, PF, PTS. 80 rows. Game 76: 1962-03-02, PHW, N, NYK, "W, 169-147", 48:00, 36/63, 28/32,
  PTS 100. First rows 48 57 53 55 43 28 58 58 55 41. Total 4,029 (50.36). The site's own highlight row colour is
  #ffa, its rules #c9cbcd, thead grey #efeeed, body Helvetica/Verdana at 14 px.
- `nba-floor/assets/refs/pages/bbref-2026-screenshot-top.png` (a real BBR screenshot, read for the look): white page,
  thin light grey row rules, faint column rules, right-aligned numerals, grey rank, team names underlined (link blue,
  drawn here in dark ink: no blue on stage), section headings in the site's brown-orange, DejaVu Sans as the face.
- `HersheyTicketMapCounter.tsx`: the thread counter's real look in this reel: three black split flaps 66 x 96, a
  black hinge line across the middle, two grey hinge pins, white numerals, a small grey WILT above.

What gives a fake away: a dark "app" table instead of the white BBR page; invented columns or rounded numbers; an
average that rolls smoothly instead of jumping with each real game; the SAN FRANCISCO lettering in the crop.

## The thinking

- The real thing: Wilt himself (the photo card), the thread counter, and the real BBR game log of his season,
  redrawn as the white page it is (h1, "Regular Season" heading, thead, rows), held at hand scale with a slight tilt.
  The live average is the real running mean of the real rows, game by game (48.0, 52.5, 52.7, 53.3 ... 50.4).
- Details a viewer would only miss if gone: the halftone grain of the print, the credit, the split-flap hinge and
  the fold of each flap, the page's grey Rk numbers and underlined opponents, N for the neutral site, the cream slip
  taped over row 76's PTS (no spoiler), the page scrolling with the typing, the light travelling over the paper.
- Word, then change:
  - So how does a guy: the photo card rises big and centred, slow push in on his face.
  - score (lands): the WILT counter drops in at the top of the stage and its flaps run 0 up to 100.
  - 100? (lands): 100 locks and bounces once, then the flaps run back down to 0 (the night has not started yet).
  - (silence) the counter parks small top right; the card shrinks to the left third.
  - That season Wilt: the white game log page slides in on the right, header first.
  - averaged: the rows type down, slow for the first games, then a blur of 80 rows, page scrolling; beside them, under
    the photo, the white average jumps with every game (swinging early, steadying). Row 76 types with a cream slip
    over its PTS.
  - 50.4 (lands): row 80 types, the average stops on 50.4 and grows big and white beside the photo.
  - points a game: the log dims and slides behind, 50.4 holds with a slow push.
  - record (lands): a cream record-book slip types under it: "Most points per game, season: 50.4, Wilt Chamberlain,
    1961-62"; source line bottom left.
- Hand-off to `quarters`: the dimmed page keeps row 76 (with its slip) visible on the right, so "That night" can tear
  it off. At the scene end row 76 sits at stage x about 486-1070, y about 1300-1340, on the page dimmed to 30% brightness.
- Sound-off test: a stranger sees Wilt, a counter showing 100 then reset, his real season page racing by with an
  average that settles at 50.4, and a record-book line. "He averaged 50 a game; 100 was one of those nights."
