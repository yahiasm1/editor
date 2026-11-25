# FansFloodFloor (`flood`, 51.68-58.34 s)

"When the 100th point went in, fans poured onto the court, and the Warriors won 169 to 147."

## What I saw (references at full size)

- `photos/commons-hershey-sports-arena-1938-interior-pd.jpg`: the floor is the hockey rink, a long oval of low pale
  boards with a thin pipe railing on posts above them, the seats starting right behind a narrow walkway. The banks are
  cut every 12-15 seats by stair aisles running straight down to the floor, with boxy portals at mid height. People in
  the photo read as a dark grain, shoulders and heads, packed along the rows; players on the floor stand in lines,
  small, with long shadows from the hanging reflector lamps. The floor is the brightest thing in the building.
- `photos/commons-hersheypark-arena-inside-2024-...` and `-inside-2007-pd.jpg`: the same bowl today. The stair aisles
  are real breaks in the seat rows with handrails; the end bank under the scoreboard rises behind the far boards; the
  boards curve round the corners (the rink's rounded ends), so people coming down a corner aisle reach the boards at an
  angle, not straight.
- `pages/box-196203020-clean.json` (Basketball-Reference box score): line score PHW 42 37 46 44 = 169, NYK 26 42 38
  41 = 147; attendance 4,124; Hershey Sports Arena. `facts.md`: fans poured onto the court after the 100th point.
- This reel's own objects, to stay one world: `QuartersScoreboardBoard.tsx` (the riveted bulb board on its chains,
  the WILT 13 split flaps, lamps 1-4, the dark 3-digit totals waiting for this scene), `CrowdHalfEmptyArena.tsx` /
  `CrowdHalfEmptyKit.ts` (the vault, lamps, banks, the 4,124 seats taken by the same seeded generator). Stills of
  `crowd`, `quarters` and `freethrows` read at full size side by side.
- No photo of the fans on the floor exists (no TV, one photographer who arrived for the locker room). Commons was
  rate-limiting the three reels; I did not find a period "fans rush the court" photo worth a slot, and the scene is
  the reel's drawn world anyway.

What would give a fake away: a liquid or a blob sliding over the floor; dots that teleport instead of using the
aisles;
everyone arriving at once; the boards ignored (people walking through them); the score as type instead of bulbs; the
board's 100 not the same flaps as `quarters`.

## The thinking

- The real thing: the same Hershey arena world (same seats, same 4,124 amber witnesses), the same bulb board. New
  here: the witnesses as people, standing and running, the ten players and two referees on the floor, the line score's
  4th column and the totals lit for the first and only time.
- Details that make it real: each person keeps their own path: along the row to the nearest stair aisle (the real
  14-seat sections), down the aisle, across the walkway, a hop over the boards (they curve at the rink ends), out onto
  the floor to a free spot; lower rows go first, upper rows queue down the aisles behind them; nobody runs through a
  player; a clearing ring round #13; people mill and bounce once there; vacated wooden seats show bare; the never-sold
  seats keep their faint grey outline from `crowd`.
- Word, then change:
  - When the: close on the end wall board under the last rib (the `quarters` close), lamps 1-3 lit warm white, lamp 4
    lit amber (the radio's quarter), WILT flaps at 98, the end bank's top rows of witnesses below it.
  - 100th (lands): 98 -> 99 -> 100, the last flip the heaviest of the reel (all three flaps), dust off the flaps, the
    cabinet swings on its chains, every bulb flickers with the roar, the camera knocks.
  - point went in: the 4th column lights bulb by bulb, WARRIORS 44, then KNICKS 41.
  - (silence) the camera flies back down the vault to the high end view (the 1938 angle): the whole bowl.
  - fans (lands): every amber dot stands up (grows from a seated dot into a person), trembling.
  - poured (lands): the run. Streams down every aisle of both banks and the end bank, over the boards, onto the floor.
  - onto the court: the floor fills round the players; people mill and bounce; the upper rows still pouring down.
  - and the Warriors won: the camera descends over the crowd to eye level among the fans and looks up at the board.
  - 169 (lands): WARRIORS total lights bulb by bulb to 169.
  - 147 (lands): KNICKS total to 147; source line "Basketball-Reference box score, Hershey Sports Arena, attendance
    4,124".
- The ball through the far basket (in the plan) is dropped: no single framing holds the far basket and a readable
  WILT panel (18 m of height between them); the 100 landing on the board's own flaps is the event.
- Sound-off test: an old bulb scoreboard flips to 100 and shakes, then thousands of little amber people leave their
  seats, run down the stairs and over the boards and cover the floor around the players; then from among them the
  board lights 169 and 147. "He got 100, the place went nuts, they won."

## Built, and checked

- Cameras (one world, three moves): close on the board (board ~600 px) -> fly back down the vault to the high end
  view on the silence after "in," -> descend over the crowd to eye level at "and the Warriors won", board up top, the
  crowd with #13 (arm up from "onto") and the basket in the lower stage.
- Runners: 4,124, one per filled seat, each with a polyline (row -> nearest real aisle -> walkway -> hop over the
  boards at their real curve -> a floor spot matched by angle so streams fan out), delay by row and distance to the
  aisle, duration by path length. Seated dots jump once on "100th", stand on "fans", run from "poured".
- Close-range detail pass: dark edge round every figure so a packed crowd reads as people, per-person tone, hair or a
  period felt hat, legs and arms swinging with the distance run, both arms up for the jumpers, shadows on the floor;
  players in PHILA white / Knicks blue with orange trim / striped refs, long socks, #13 on Wilt.
- Stills read at full size across the scene; a 7.2 s clip rendered and diffed frame to frame: no snaps, no still
  stretch; the only spike is the `photo` scene's own entrance at 58.6 s.
- Render note for this machine: the bundle fails on nba-floor's module-level fonts unless `--public-only nba-floor`.
