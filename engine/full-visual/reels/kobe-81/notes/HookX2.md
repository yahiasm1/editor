# HookX2 (`hook`, kobe-81-h2), 0-4.26 s: "Kobe Bryant once scored more points in one half than the entire Toronto Raptors team."

h2: Sideline race, dunk to finish. A race along a track ended by one slam (h1 is a pile flooding the floor).

## What I looked at

- **The night photo** (`photos/...-endlessbender-ccby2-1024.jpg`, the Commons 1024 px of the only photo from the 81
  game). Measured on gridded zooms and colour masks (1024 px coords):
  - the **gold sideline band** in front of the far seats: centreline y = 498 - 0.222 x, 17 px thick, from the
    half-court line (77, 481) to the far baseline corner (765, 328), under the "VISIT HILTON.COM" table. It runs
    exactly one half of the floor, toward the far basket.
  - the **half-court line** through the gold LAKERS centre logo: (77, 481) on the far sideline to (645, 662) at
    the scorer's table, slope 0.33, thin purple.
  - the **near sideline** is the scorer's table front edge, purple, (560, 693) to (920, 585); the red "STAPLES
    Center" lettering sits on the floor just above it, (610-800, 570-640).
  - the **basket**: rim (812, 305), glass board (735-810, 210-300), the yellow support arm out to the padded
    stanchion (880-920, 300-400), the red LED shot clock cube "23" on top (800-860, 190-220).
  - **five red jerseys**: #5 Jalen Rose alone at (372, 470); #13 Mike James (650, 380) behind a defender turned
    away in black shorts (640, 425); #4 Chris Bosh on the lane (720, 400); #11 at the low post (778, 410). 25-30
    px wide, 95-115 px tall: blurry, so they become stickers with a white edge, never redrawn faces.
  - warm sodium light from above, maple gone amber, grain of a 2006 compact camera.
- **Kobe gold #8** (Sgt. Joseph A. Lee, USMC, public domain, verified in `photos/meta`): the reel's hand cut-out,
  cut at the shorts, so its foot fades.
- **Kobe's dunk** (Cpl. Megan Stiner, USMC, public domain, Oct 11 2005, verified): hanging from the orange rim by the
  left hand, net still bunched in the ring, ball falling past his hip, gold #8, purple side panel, white shoes. Cut
  by me (`cutouts/hookx2-kobe-dunk-full.png`): hand polygon + two GrabCut passes, rim and net kept, the dome seen
  through the net removed.
- The bar: `examples/ps5-on-pc/code/HookVC*` (one hero, each noun a real thing on its word, one big move with
  weight) and the touchscreen and keyboard hooks' first stills.

## The real things and where each comes from

| Part | From |
|---|---|
| the ground, slow push, small grey credit | endlessbender, CC BY 2.0 |
| gold marquee sockets | the photo's gold sideline band, at its measured centreline, smaller toward the far end |
| red sockets, five strings | the scorer's table edge under the STAPLES Center lettering |
| the lit line | the photo's half-court line |
| the clock | the stanchion's own red seven-segment LED style (`StaplesNightDigit`), on the scorer's table at half court |
| five stickers, their shadows | the five real red jerseys, cut from the photo, their silhouettes left dark on the maple |
| the logo | cdn.nba.com Raptors primary, bare |
| the slam | the Megan Stiner dunk cut-out, its own rim landing on the photo's rim; the support arm flexing |

## Decoding the sentence

| Word (s) | Real thing | What happens |
|---|---|---|
| frame 0 | night photo, gold #8 Kobe | full picture already moving: photo pushing in, Kobe in front bottom left with his credit, the band already a row of sockets with four gold bulbs lit beside him |
| Kobe 0.12 | Kobe | a gold rim light flares on him and the first burst of bulbs runs out of his hands up the band |
| Bryant 0.38 | the near sideline | the red sockets under STAPLES Center take their first bulb: the race is on, two strings |
| once / scored 0.68-0.86 | the race | gold lights two or three at a time, a hot head racing toward the far basket; red one at a time, slower |
| more points 1.12-1.54 | | the gap opens; every gold step sparks |
| one 1.76 | the half-court line | the line lights white end to end, one line, both strings start on it |
| half 1.94 | one half | a small LED clock in the stanchion's style pops up on the scorer's table at half court: 2ND HALF 24:00, and runs |
| entire 2.54 | the five red jerseys | a red ring snaps round each, one after another |
| (2.6-2.95) | | each peels off the maple like a sticker, leaving its dark shadow behind, and flies to a lineup, shoulder to shoulder |
| Toronto 2.98 | the Raptors | the logo lands bare above them; the five red strings slide together into one team string |
| (3.10-3.25) | | gold #8 Kobe crouches and springs out of the top of the frame |
| Raptors 3.30 | THE MOVE | the dunk cut-out swings down out of the top and slams the photo's rim at the end of the gold track: the photo jolts, the support arm flexes, the clock hits 0:00, the last gold bulbs whip to the rim with a finish flash. Red stops short, a dark tail of empty sockets |
| team 3.64-3.90 | | held: gold track full and chasing, red short, Kobe swinging on the rim |
| 3.92-4.26 | | photo dims away to the navy; the dark scoreboard box is left at the top for `night` |

Race arithmetic: gold 55 sockets lit to 55; red 30 sockets lit to 22 (41/55 of its track): Kobe's 55 against the
Raptors' 41 in the second half (facts.md), shown as a ratio, never as a number on screen.

One deviation from the direction, by the photo: the half-court line is at the start of the gold band, not the end
(the band runs from half court to the far basket), so the lit line marks the half both strings race across and the
rim is the finish.

## Sound-off test

A stranger sees Kobe, a gold light racing along his side of a real NBA floor and a red one crawling along the other,
the Raptors peeled off the floor and lined up as one team, and Kobe slamming the rim at the end of his finished track
while theirs stops short. One man beat a whole team in one half.
