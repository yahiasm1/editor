# HookX1, "The night the windows went out" (`hook`, 0.16-4.92 s, scene to 5.62 s)

"Wilt Chamberlain scored 100 points in one NBA game, and almost nobody saw it."

## What I saw (references at full size)

- `photos/commons-hershey-park-arena-2008-beato-ccby2.jpg` (Eric Beato, CC BY 2.0): the arena from high to the
  south-east. A long barrel vault of weathered grey concrete runs across the frame and recedes to the upper left; ten
  or eleven ribs cross it eave to eave as raised bands. Four small box dormers with dark louvred faces sit low on the
  near slope. A row of pale triangular buttress fins stands on the near eave, one at each rib foot. The long wall is
  cream concrete, two storeys of small square windows in bays. The near end is a tall half-ellipse gable of cream
  precast panels with vertical joints, a lower block with the gate in front of it. Two small towers with red domes off
  the far left end, trees all round, a car park behind. Daylight in the photo; I redraw it at night.
- `photos/commons-hersheypark-arena-outside-2007-pd.jpg`: street level: the vault reads darker than the walls, the
  dormers are dark boxes, a canopy over the doors.
- `objects/commons-hershey-kiss-streetlamp-sebwite-pd.jpg` (Sebwite, PD): a Hershey Kiss streetlamp: a foil-grey
  Kiss with a soft sheen on its left shoulder, a flat dark underside (the lamp is under it, light falls down), a thin
  grey pole, and at the tip the paper plume, a pale blue-white ribbon lettered HERSHEY in blue capitals, curling left.
- `photos/commons-wilt-1963-pd.png` (Kansas yearbook, PD): Wilt close, head and shoulders, short hair, thin moustache,
  a light singlet with a dark piped neckline, grey studio ground. Black and white. Cropped to the photo
  (`public/wilt-100/hookx1-wilt.jpg`); not the 1959 Globetrotters, not the SAN FRANCISCO jersey, not the 100 photo.
- `close` (CloseWitnessesKit/World): the same vault at the same angle in metres (94.6 m long, 72.8 m wide, springing
  15.6 m, crown 31.5 m, 11 ribs), camera yaw 35, pitch -25, distance 255, F 2000, centred (540, 1090). I copy those
  numbers so the close frame is this frame; I draw my own building on them.
- `hershey` (HersheyTicketMapCounter): it picks the counter up at (540, 600), scale 0.9: three black flaps 66 x 96
  with 8 px gaps, Oswald 700 white numerals, a grey "WILT" above. I end exactly there.

What gives a fake away: a dome instead of a ribbed barrel vault, windows that dissolve instead of switching off, a
lamp that is a generic bulb instead of the Kiss, a counter that just swaps numbers instead of falling flaps.

## Word table (the sentence decoded)

| Word | Real thing | Verb done to the hero (the vault) |
|---|---|---|
| (frame 0) | the vault at night, every window and dormer warm, a Kiss lamp near, the flip panel on the end arch | already alive: the panel clacks 0, 23, 41, 69 inside the first second |
| Wilt 0.16 | the real man: the yearbook photo card | rises up behind the roof |
| Chamberlain 0.40 | | the card stands to full height, his head above the crown |
| scored 0.94 | the points landing on him | the flaps speed up; each clack shakes dust off the ribs |
| 100 1.26 | the flip panel, WILT / points | the last flap slams to 100 with an overshoot; the whole roof shivers |
| points / in / one 1.7-2.3 | the one lit building in a dark town | "points" stamps under the panel; the town around dims, the camera eases back |
| NBA / game 2.52-2.94 | the one game that night | the vault holds, every window lit; shadows of people pass behind the windows; the gate lamp spills on the plaza |
| almost nobody 3.66-4.10 | | the windows switch off in a rolling wave down the long side, far arch to near end, rib by rib: each filament flares a hair, drops to red and dies; the dormers next; the Kiss lamp flickers twice and dies; the roof sinks under the dark |
| saw 4.56 | | four small amber points survive; Wilt's card tips back behind the roof into the dark; the 100 panel lifts off the arch and flies up, flat, to the top centre |
| it. / silence | hand-off | counter 100 at (540, 600), the dark vault a silhouette below, fading for `hershey` |

## Sound-off test

A big lit building at night, a famous player towering over it, a scoreboard on its end wall racing to 100. Then
every light goes out but four. The 100 is left floating above a dark building: a huge night, almost no witnesses.

## Built and checked

- Files: `scenes/HookX1.tsx` (composition, keep = true), `HookX1Kit.ts` (times, close's arena numbers, camera,
  counter, filament switch-off), `HookX1World.tsx` (two canvases: town behind the card, building in front),
  `HookX1Panel.tsx` (split flaps), `HookX1Props.tsx` (Wilt card, Kiss lamp). Asset: `public/wilt-100/hookx1-wilt.jpg`
  (the yearbook photo cropped to the photo, PD).
- One change from the brief: the flip panel hangs on a steel board on struts off the end arch, turned square to the
  viewer. Painted flat on the arch it was foreshortened to 40 % and the digits could not be read.
- Camera starts 10 % closer and 52 px left, eases back to close's CW_CAM_A exactly by "nobody".
- Extra beats: the car park's sodium lamps go out on "one" (the vault is the one lit thing), the crowd's roar rolls a
  swell of light down the windows on "game", people's shadows pass behind windows in the hold, dust shakes off the
  ribs on every clack after "scored" and in a burst on the slam.
- Stills read at full size: 0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.27, 1.3, 1.5, 1.75, 2.0, 2.25, 2.4, 2.5, 2.75, 3.0, 3.05,
  3.25, 3.5, 3.75, 4.0, 4.1, 4.17, 4.2, 4.25, 4.3, 4.35, 4.4, 4.45, 4.5, 4.6, 4.68, 4.7, 4.75, 4.9, 5.05, 5.13, 5.15,
  5.17, 5.2, 5.3 (deleted after). Handover: 5.13 (hook) and 5.17 (hershey) show the counter at the same pixels.
- Render needs `--full-public` (another reel's font, as close's notes say).
