# starters: StartingFiveSpotlights (8.40-14.90 s)

"The Lakers' starting five was Smush Parker, Kobe, Lamar Odom, Kwame Brown and Chris Mihm. Not exactly a super team."

## What I looked at (full size)

- `photos/commons-smush-parker-1-2006-pragmatopian-ccby2.jpg` (960x2700): Smush in road purple #1, purple headband,
  arms loose at his sides, mid-stride at MSG. Soft focus (a crop of a wider frame), crowd behind in browns and greys.
  "LAKERS" arched in gold with a white edge, gold side panel with white piping on the shorts, black shoes.
- `photos/commons-kobe-ft-gold8-2005-josephalee-pd.jpg` (960x1440): the sharpest of the five. Gold home #8, purple
  "LAKERS" script with white edge, white 8 with purple outline, NBA logoman on chest and shorts, purple wristband on
  the right arm, tattoo (crown) on the right upper arm, sweat sheen, ball held at the waist, eyes up at the rim. Cut
  at mid-thigh: no legs.
- `photos/commons-odom-7-parker-1-2005-jerameyjannene-ccby2.jpg` (1280x960): Odom from behind, purple road jersey,
  "ODOM" in gold block letters with white edge, white 7 with gold edge, gold collar, gold wristband right. Shaved
  head, rim lit from the arena lights. Cut at the shorts.
- `photos/commons-staples-opening-tip-2006-malingering-ccby2.jpg` (1920x1337, Feb 15 2006 vs Hawks at STAPLES):
  Kwame #54 in home gold at the opening tip, gold headband, left arm straight up at the ball, right arm out. He is
  about 180 px tall in the frame: the cut-out is a 2.5x upscale, so it carries a grain pass and stays small.
- `photos/commons-mihm-31-2005-full-jerameyjannene-ccby2.jpg` (1280x1707): Mihm in profile facing right, purple
  road, gold side panel, "L" logo on the shorts, the ball palmed in his right hand far out in front ("I am huge and I
  will palm the ball"). Full length.
- `commons-kobe-81-night-staples-2006-endlessbender-ccby2.jpg`: the arena behind them, the real crowd of that night.
- Rosters (`pages/bbref-roster-LAL-2006.html`): Parker #1 PG 6-4, Bryant #8 SG 6-6, Odom #7 PF 6-10, Brown #54
  C 6-11, Mihm #31 C 7-0. BBR lists Odom PF and Kwame C (the plan said SF and PF): the plates follow BBR.
- Credits checked in each `photos/meta/*.wikitext`: pragmatopian CC BY 2.0; Sgt. Joseph A. Lee, USMC, public domain
  (PD-USGov-Military-Marines); Jeramey Jannene CC BY 2.0 (Odom, Mihm); malingering CC BY 2.0.
- Searched Commons for a full-length Lakers-era Kobe and a better Kwame: only later-era Kobe and Pistons-era Kwame;
  kept the plan's photos.
- The thread scoreboard is `StaplesNightBoard` (built by `night`), parked at x 90-990, y 532-692. I hang it there,
  reading END 1ST, RAPTORS 36, LAKERS 29, clock 0.0, the 36 still flared (as `night` leaves it).

What gives a fake away: equal heights, the same photo pose five times, a figure with clean vector edges, legs that
float. Two of the five photos stop at the waist.

## Thinking

- Real thing: a starting-lineup introduction in a dark arena. Five real players, cut out by hand (GrabCut with hand
  polygons at full resolution, `assets/refs/cutouts/`), each scaled from his own photo to one px-per-foot (110 px/ft):
  scale read from a known length in each photo (full height for Smush and Mihm, head length 0.79 ft for Kobe and
  Kwame, head width for Odom).
- The waist problem: Kobe and Odom stop at the waist. They stand behind the courtside scorer's table, nearer the
  camera, so its purple padded front and LED ribbon cover everyone from the hip down (perspective makes a 30 in table
  stand tall in front of players a few feet behind it). Every head still sits at its true height above the hidden
  floor line.
- The plates are the table's own LED ribbon: one segment per spot, the number first, then position and height type
  on as each man arrives. White LEDs (red is the scoreboard's, gold is Kobe's points).
- Maple strip with the gold sideline band in front of the table, the spot light spilling onto it.
- Height ruler: hairlines at 6-0, 6-6 and 7-0 behind the five, labels at the left in BBR's notation, a crown tick on
  each head.

| word | change |
|---|---|
| (mount) | the night photo, darkened, fills the back; scoreboard hangs at the top reading END 1ST 36-29 |
| The Lakers' | the arena drops to black; the table's LED ribbon and the maple strip light along the bottom |
| starting | lands: five spotlights open left to right with a flicker, each LED segment shows its number dim |
| Parker, | lands: Smush walks in from the left into spot 1; his segment brightens, "PG 6-4" types |
| Kobe, | lands: Kobe walks into spot 2, his beam a touch brighter; "SG 6-6" |
| Odom, | lands: Odom backs into spot 3 from the right (we see "ODOM 7"); "PF 6-10" |
| Brown | lands: Kwame rises from behind the table into spot 4 as at the tip, arm up; "C 6-11" |
| Mihm. | lands: Mihm walks in palming the ball; "C 7-0"; the height ruler draws across behind all five, crown ticks |
| Not exactly | the camera pulls back so all five stand small in a row |
| super | lands: the four spots other than Kobe's flicker and drop to half, the four men and their plates dim |
| team. | Kobe's beam swells a little; the four sink a step into the dark |

Secondary motion: phone-camera flashes twinkle in the dark stands, dust turns in the beams, slow push.

Sound-off test: five real Lakers walk into spotlights one by one with their numbers and heights; then every light but
Kobe's goes down. A stranger reads: this team was Kobe and four guys.

## Built, checked

Stills read at full size: 8.34, 8.40, 8.80, 8.95, 9.70, 9.90, 10.45, 11.30, 11.95, 12.15, 12.30, 13.10, 13.20, 13.70,
14.10, 14.30, 14.55, 14.60, 14.80, 14.85, 14.95, 15.10, 15.30 (the lift into `halftime` is clean).
Richer pass: per-photo exposure grade so the five read as one lighting; Kwame's 2.5x upscale denoised and its edge
eroded, his arms tucked behind Odom and Mihm; hot lens at each beam's apex, dust and haze in the cones; phone flashes
in the dark stands; the LED ribbon's scan sweep and the Lakers logo in its last segment; idle sway on each man; the
ruler labels in front with a dark halo; credits drawn outside the camera so they stay 22 px after the pull back.
Weakest part: Kwame (the only Lakers-era Kwame on Commons is 180 px tall in the tip-off frame).
Render: `--public-only nba-floor`, `flock /tmp/fv-render.lock`, CHROME=chrome-via-proxy.

## Review fixes (Kwame)

- The 2.5x upscaled, painted Kwame read as fake. Searched Commons again for a Wizards-era Kwame (2001-05): the
  category holds only Pistons (2009, Keith Allison) and later shots, so no sharper Lakers-era or Wizards photo exists.
- Kwame is now traced, the plan's rule for Rose and Bonner: an outline traced by hand at 4x over a 10 px grid in the
  tip-off frame's px (`StartingFiveSpotlightsKwame.tsx`), dark with no face, home gold jersey and shorts with purple
  trim, gold headband, white 54 and LAKERS, warm top light from the spot, a light grain. Scaled from that frame
  (crown 387, feet 740) to 6-11 at 110 px/ft. The rise keeps only a small overshoot so his fist stops short of the board.
- The real photo rides under his credit: the tip-off crop (x 800-1000, y 330-690) at half size, #54 ringed in white,
  credit "malingering, CC BY 2.0" above it. The denoised cut-out is deleted from public/.
- Smush got a light grain (sigma 5.5) to sit with Mihm and Odom.
- Checked at 11.6-11.95 (the rise), 12.15, 12.3, 12.6, 13.8, 14.5, 14.6, 14.85, 14.98, 15.05.
