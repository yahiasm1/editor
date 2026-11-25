# RulebookAwayFoul (`rule`, 68.44-75.30 s)

"Years later the league changed the rules, so grabbing a guy away from the ball late in any quarter now gives his
team a free throw and the ball."

6.6 s, 29 words, the key words 0.3-0.6 s apart (changed 69.50, grabbing 70.58, away 71.20, any 72.34, throw 74.10,
ball 74.88). "quarter" is only 0.3 s long, then 0.2 s of silence before "now".

## What I looked at

- `pages/nba-official-playing-rules-2025-26.pdf` (cdn.nba.com), the real book, read with pdffonts / pdftotext -bbox:
  - The page is 360 x 504 pt (5 x 7 in), white, text in Times New Roman PS (regular and bold), one column, justified,
    page number centred at the foot "- 49 -". No running header. Headings ("Section X—Away-From-The-Play Foul") are bold,
    flush left at the text margin; paragraphs "a." indented one step, sub-items "(1)" indented two steps with a
    hanging indent. Line pitch ~8.5 pt. Page 49 shows the end of Section VIII (loose ball), all of Section IX
    (Punching Fouls) and Section X with a(1)-(3), EXCEPTION, b(1). The detail that gives a fake away: the real em dash
    in the heading, the hanging indents, "EXCEPTION: Rule 12B, Section X(b)" on its own line, justified word spacing.
  - Rasterised at 400 dpi (2000 x 2800) so the text reads sharp when the camera is close:
    `public/shaq-free-throws/rulebookawayfoul-p49.png`, `-p18.png`; crops kept in `assets/refs/pages/`
    (`nba-rulebook-p49-sectionX-a-400dpi.png`, `nba-rulebook-p18-rule4-IVh-400dpi.png`). Word boxes in page px were
    read off `pdftotext -bbox-layout` (x 400/72), so every highlight sits exactly on its printed words.
  - Page 18, Rule 4 Section IV(h): "h. An away-from-the-play foul is illegal contact by the defense (1) in the last two
    / minutes of each period, and last two minutes of any overtime periods, which occurs deliberately / away from the
    immediate area of offensive action, or (2) prior to the ball being released on a / throw-in at any point during
    the entire game." Four lines, real breaks.
  - Page 49, Section X a(1): "... and one free throw attempt shall / be awarded. The free throw may be attempted by any
    player in the game at the time"; a(2): "... the offended team shall be awarded / the ball on the sideline at the
    nearest point where play was interrupted but no nearer / to the baseline than the free throw line extended."
  - Cover (page 1, 220 dpi): flat NBA red, the logoman tile top left, a white court drawing (circle, lane, dashed
    circle) bleeding off the right edge, "2025-26 / OFFICIAL / RULES" in a condensed white type bottom left.
- The reel's own world: `PictureCourtWorld.ts` (court in feet, one camera, rim at origin), `PictureCourtFloor.tsx`
  (maple strips, gold lane, white 2 in lines), `PictureCourtBasket` (3D board, ring, net), the arena bowl, the Lakers
  cut-out (2000 Finals, Bigmoe797), the green road jersey of the defender in `picture` (Sonics green #00653A, gold
  trim), and the scorebug in `BackwardsScorebugBug.tsx` (Barlow Condensed, dark glass bar, team boxes with a
  gradient and gloss, period over a tabular clock, 900 x 132).
- `facts.md`: the 2016-17 change ("off-the-ball fouls now award the fouled team a free throw and possession of the ball
  in the final 2 minutes of each quarter"). Nothing else on screen is a claim; the play on the court is the rule's
  own words acted out.

## Think

- **The real thing**: the real rulebook (the 2025-26 book, its pages as printed), then the rule played on the reel's
  one Lakers court seen from high above, and the reel's scorebug for "late in any quarter".
- **Details that make it real**: the actual printed page (not retyped), its paper edge and a soft page curl shadow,
  page number, highlighter strokes that are a little irregular (two passes, rounded ends, slight overshoot) laid on
  the exact word boxes, the bold heading, the Rule 4 paragraph shown as its own strip from page 18 with its page tag;
  on the court: the maple, the gold lane, the 3D basket and net, the bowl, players with shadows, the ball with seams.
- **Colours**: highlighter is a real yellow marker on paper (it is the paper's own thing, not on-stage type). Foul red
  #E5383B is only the intent: the grab, the off-ball zone, the clock under 2:00. "+1" and the "Lakers ball" label are
  white. No blue on stage beyond the real NBA logo on the cover.
- **Word, then change**
  - in: the real cover rises into the middle, tilted, with weight. Years later: a slow push.
  - the league: the cover swings open on its spine (3D), page 49 under it.
  - changed (lands): the book is open flat, page 49 big and centred.
  - the rules, (lands on "rules"): the camera pushes to Section X; a highlighter runs across its heading.
  - so: the Rule 4(h) strip from page 18 slides in over the page, tagged "Rule 4, Section IV(h), p. 18".
  - grabbing (lands): "illegal contact by the defense" is highlighted; the book shrinks into a reading window at the
    top of the stage and the court rises into the middle: guard with the ball on the left wing, Shaq (the cut-out)
    posting up, a green defender grabbing him, foul red at the grip.
  - a guy: the grab pulses (the defender yanks, Shaq jolts).
  - away (lands): "deliberately / away from the immediate area of offensive action" highlights; a foul red zone opens
    on the floor round Shaq and the grab.
  - from the ball: a grey hairline runs from the ball to Shaq, its distance counting in feet.
  - late in: the scorebug slides in under the court, "1ST 2:00".
  - any (lands): "in the last two / minutes of each period" highlights; the clock ticks under 2:00 and turns red.
  - quarter: the period rolls 1ST -> 2ND -> 3RD -> 4TH, the clock resetting and going red each time.
  - now gives his team: the window slides to page 49, Section X a(1): "one free throw attempt shall be awarded. The
    free throw may be attempted by any player in the game" highlights; the grab lets go.
  - a free: a teammate (a Lakers guard, plain gold jersey, not Shaq) walks from the right wing to the line.
  - throw (lands): he shoots; the ball drops through, the net kicks, a white "+1" pops over the rim.
  - and the: a(2) "the offended team shall be awarded / the ball on the sideline" highlights.
  - ball. (lands): the ball bounces out to the right sideline at the free throw line extended (a(2)'s own spot) and
    is held there; a white hairline label "Lakers ball".
- **Sound-off test**: a rulebook opens on a foul rule; a man without the ball is grabbed far from the ball, the spot
  lights red; a game clock under two minutes in every quarter goes red; someone else shoots one free throw and it is
  +1, then the ball goes to his team on the sideline. "Grabbing away from the ball late now costs one free throw and
  the ball."

## Built and checked

- Files: scenes/RulebookAwayFoul.tsx (times, paper camera, court camera, the play), RulebookAwayFoulBook.tsx (cover,
  page 49, the page-18 strip, highlighter marks on pdftotext word boxes), RulebookAwayFoulCourt.tsx (PictureCourtFloor
  and PictureCourtBasket through a high camera, Shaq cut-out, the grab, zone, hairline, ball, +1, "Lakers ball"),
  RulebookAwayFoulPlayer.tsx (drawn guard and defender), RulebookAwayFoulBug.tsx (the `backwards` scorebug, no scores,
  rolling period, clock red under 2:00). Public: rulebookawayfoul-cover.jpg, -p18.png, -p49.png (400 dpi), -shaq.png,
  -ball.png (copies of picture's cut-out and ball, same pixels).
- Stills checked: 68.3-68.6 (handover in), 69.3, 69.6, 70.1, 70.3, 70.5, 70.62, 70.68, 70.75, 71.05, 71.1, 71.35,
  71.8, 72.25, 72.45, 72.6, 72.75, 73.3, 73.6, 73.95, 74.3, 74.7, 75.0, 75.1, 75.25, 75.35 (handover out).
- Fixes after the first look: the zoomed page was spilling over the caption (now clipped to the stage band until it
  becomes the window); the window tag moved under the window; the court camera brought closer (F 1750) and panning to
  the sideline for "ball."; "+1" moved beside the rim (it was under the window); the rim kept clear of the window.
- Richer pass: grip bloom and shock ring bigger, red grip marks, zone centred on Shaq, a white landing ring where the
  ball reaches the sideline, a slow drift on both cameras, the LAL box glowing on "ball.".
- Deviations from plan.md, on purpose: highlights are a real yellow highlighter on the paper (a white sweep does not
  show on paper); the shooter is the ball-handling guard (one ball on the court, and a(1) lets any player shoot); the
  scorebug shows no scores (the rule is any game, any quarter).
- Renders need `--full-public` (another reel's fonts are requested by the bundle).
