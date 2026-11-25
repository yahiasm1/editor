# TrueShootingDisc (`trueshooting`, 37.48-46.14 s, next scene at 46.56)

"True shooting halves that, so a made two on every shot would be a hundred percent. His was seventy-nine. The league
average this season is fifty-seven and a half."

## What I looked at

- `pages/bbref-box.html`, table `box-SAS-game-advanced`, over-header "Advanced Box Score Stats", columns as BBR prints
  them: Starters | MP | TS% | eFG% | 3PAr | FTr | ORB% | DRB% | TRB% | AST% | STL% | BLK% | TOV% | USG% | ORtg | DRtg |
  BPM. His row, real copy: Victor Wembanyama 31:51 .790 .776 .379 .207 8.9 41.1 25.6 15.3 6.2 13.7 8.7 46.3 138 63.
  I show Starters, MP, TS%, eFG%, USG% (the plan's copy) at 34 px, so the row is readable as evidence.
- `pages/bbref-2027.html`, "Advanced Stats" team table, row "League Average": Age 26.7, ORtg 114.3, Pace 98.6, FTr
  .280, 3PAr .432, TS% .575, eFG% .537. I show Team, Age, Pace, TS%, eFG%.
- Facts rows 7-9: TS% = PTS / (2 x TSA); his .790 (= 50 / 63.28); league .575.
- The reel's chance disc (`FreeThrowWedgesDisc.tsx`): gold #F2B33D top lit to #F7C350, edge #6E4A0E-#D89A2C, darker
  rim stroke #B57F1C, thickness 0.12 of the width, soft brown contact shadow. I keep that material so it is the same
  object, now big and standing on its edge.
- The maple floor (Toronto wide photo, `PlayByPlayLogCourt`): honey boards 2.25 in, staggered end joints, satin
  lacquer that mirrors what stands on it, white 2 in lines. At this macro the disc is 1.6 ft across, so a board is
  0.23 of its radius: the boards are drawn at that true ratio.
- Photo: Portland Commons photo (Frenchieinportland, CC BY 4.0), cropped to his face as the row's player thumbnail.
  NBA logoman (cdn.nba.com) bare beside "League Average".
- Example: iphone-keyboard `KbZoneGrow` (a real object whose state changes on each word with real numbers on it).

Fake give-aways: a scale that is not linear, 79 not sitting where 1.58 sat, a second disc or bar for the league,
"TS%" values that differ from BBR, a disc that is a coin with print.

## Think

The real thing: the same chance disc, stood on its edge on the floor and read as a measuring cup with a graduated
ruler on its right side, plus BBR's two real rows that pour into it.

Word, then change:

| Word | On screen |
|---|---|
| (frame 0) | the big disc lies tipped back on the boards, filled white to 1.58 on its 0 / 1 / 2 ruler |
| True shooting | it stands up on its edge with weight (pivot on its bottom, small settle) |
| halves (lands) | the ruler's labels flip one by one 0 / 1 / 2 -> 0% / 50% / 100%; the level label rolls 1.58 -> 79; header "points per chance" -> "true shooting" with "÷ 2" |
| so a made | the fill drains to empty |
| two (lands) | a basketball (pebbled orange, black seams) drops from above into the disc, tag "made 2"; white surges up from the bottom |
| every shot | it fills to the brim, a sheen sweeps up |
| 100% (lands) | the brim tick lights, "100%" grows white, then the fill drains out |
| His was | BBR's advanced card rises under the disc; row writes in with his face thumbnail |
| 79 (lands) | the disc fills white to 79, the .790 cell lights, a white hairline runs from it up the ruler to 79, counter 0 -> 79 |
| average (lands) | the League Average row writes in with the NBA logo |
| 57.5 (ends on) | its .575 cell sends a grey hairline up the ruler; a grey level line sweeps across the disc at 57.5 and the fill below turns grey; the white band 57.5-79 stays lit, the rest dims |

Sound-off test: one disc read like a cup: a made two fills it to 100%, his game fills it to 79, the league to 57.5,
and the bright band is how much better than average he was. The two numbers are on the real BBR rows.

Hand-over in: `attempts` ends on one disc grown large with fill at 1.58 on a 0 / 1 / 2 scale: I open on it.
Hand-over out: lifted off by the stage; `average` starts on the court.

## Built

Files: `TrueShootingDisc.tsx` (scene, labels, BBR card), `TrueShootingDiscSolid.tsx` (disc solid with edge quads,
face fill, slosh, contact shadow, lacquer reflection, maple floor strips with end joints, free throw line and paint,
basketball), `TrueShootingDiscWorld.ts` (pinhole camera in feet, disc pose). Public: `trueshootingdisc-wemby-face.jpg`
(Portland Commons crop, credited on the card), `trueshootingdisc-logoman.svg` (cdn.nba.com).

Changed from the plan in build: the made 2 arrives as a shot's arc from the left (the stage top has no room for a
drop from above) and disappears behind the face as it fills; the BBR rows show MP / TS% / eFG% (his) and Age / TS% /
eFG% (league), dropping USG% and Pace so the columns are readable at 34 px; the TS% column sits under the ruler.
Stills checked at 37.5, 37.6, 38.25, 38.3, 38.9, 39.0, 39.1, 39.25, 39.45, 39.6, 40.3, 40.9, 42.0, 42.6, 43.0,
44.2, 44.6, 45.3, 45.6, 46.0.
