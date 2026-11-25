# HookX2, "The camera that wasn't there" (`hook`, 0.16-4.92 s, hands over at 5.24 s)

"Wilt Chamberlain scored 100 points in one NBA game, and almost nobody saw it."

## What I saw (references at full size)

- `objects/commons-rca-tk41-tv-camera-dogsrnice-ccbysa4.jpg` (DogsRNice, CC BY-SA 4.0), cropped and enlarged: the
  RCA TK-41 on its studio pedestal. Head: a long box of brushed stainless side panels with vertical panel seams and
  rows of small screws, a round porthole window mid-side, the red script "RCA Television" with the round RCA
  lightning mark low on the front half of the side. On top a curved louvred hood (a rounded front, three groups of
  four horizontal slats on its side). The rear quarter of the head is painted black: the control end, with rows of
  small knobs in red, blue, green and white around a big round black dial, a hinged side door. Over the rear sits the
  viewfinder in a big black rubber cowl that sticks out backward. The front carries the lens turret (four lenses on a
  rotating plate; hidden in this photo, known from the TK-41's spec). A chrome tilt handle sticks back and down from
  the pan head. Under it: the pan/tilt cradle, two chrome column tubes, a steering ring on three flat spokes, a grey
  hammertone bell base with a rim band, a three-armed cast base (rounded triangle) with a swivel caster and black
  rubber wheel under each arm. Black cable coiled on the floor. Light is overhead fluorescent: the steel shows long
  soft vertical highlights; the black parts read only by their edges.
- `photos/commons-wilt-1962-pd.jpeg` (public domain): Wilt in a gym, face up, light from above, sweat highlights, the
  backboard behind left. Cropped ABOVE the SAN FRANCISCO lettering (the team moved that autumn), softened, to
  `public/wilt-100/hookx2-wilt-1962.jpg`. It is what the camera's viewfinder shows.
- `photos/commons-hershey-park-arena-2008-beato-ccby2.jpg` (Eric Beato, CC BY 2.0): the barrel vault, eleven raised
  ribs, four box dormers low on the near slope, pale buttress fins at every rib foot, a cream wall with two rows of
  small square windows, the half-ellipse gable at the end. Drawn small and far, at night, as the dark vault the
  camera should have been inside.
- `hershey` (HersheyTicketMapCounter): it picks the counter up at (540, 600), scale 0.9: three flaps 66 x 96 with
  8 px gaps, Oswald 700 numerals 78 px, a grey WILT above at -44 px. My last frames are exactly that panel.

What gives a fake away: a camcorder shape, a single lens instead of the four-lens turret, a pedestal that is a
tripod, a viewfinder that is a flat rectangle instead of a deep cowl with a curved tube face, a screen that fades
instead of collapsing to a line and a dot, a fall with no weight (constant speed, no bounce).

## The drawing

A small 3D world in metres, one viewer behind-left and above the camera, real perspective, every part projected:
the pedestal, the bell, the ring, the column, the head box, the hood, the viewfinder box and cowl, the turret with its
four lens barrels. Face details (script, porthole, louvres, knobs, seams) are drawn flat and mapped onto their face
patch by an affine matrix from that patch's own projected corners. The tip-over is a rotation of the whole object
about its rear caster with gravity (accelerating), then a bounce.

## Word table (the sentence decoded)

| Word | Real thing | Verb done to the hero (the TK-41) |
|---|---|---|
| frame 0 | the TK-41 at three-quarter, viewfinder toward us, red tally lit; Wilt in its CRT, the flip panel clacking; the vault far behind, a few lit windows | already alive: the picture is rolling (vertical hold), panel 0 -> 23 -> 41 -> 69 inside the first second |
| Wilt 0.16 | the real man, seen through a real lens | the vertical hold locks: the roll stops on his face |
| Chamberlain 0.40 | the turret | turns one click with inertia (overshoot, settle); the picture zooms tighter on him, focus pulls back in |
| scored 0.94 | | the panel riffles 69 -> 100 |
| 100 1.26 | the flip panel in the picture | slams to 100; the CRT blooms bright two frames; the head shudders |
| points 1.70 | | POINTS types under the panel in the picture; a grey label names the camera |
| in one NBA 2.04-2.52 | one NBA game = the vault | the vault's windows warm up one by one, light spills through its dormers |
| game 2.94 | | the camera pans a hair toward the vault on its pan head, the cable drags across the floor, label "Hershey, PA" |
| almost 3.66 | | the picture starts to waver, the cable creeps taut, the vault's windows go out from the far end |
| nobody 4.10 | the one machine that should have been there | the tally lamp dies; the cable yanks taut off left and snaps the plug (spark); the camera rolls back on its casters, rocks, and tips over backward, out of the frame bottom, hard landing bounce, the ring spinning; its CRT switches off: picture -> line -> dot |
| saw 4.56 | | the dot holds where the eye was; the vault keeps four tiny amber windows |
| it. 4.78 | what is left | the flip panel at 100 opens out of the dot (line, then panel) and floats up to top centre |
| silence | hand-off | counter 100 at (540, 600), scale 0.9, over dark ground; `hershey` takes it over (keep) |

## Sound-off test

A 1962 TV camera shows Wilt and his score racing to 100. It turns toward the arena, then its light dies, its plug
is ripped out and it falls over, its screen shrinking to a dot. Only the 100 is left: the camera that should have
seen it never did.
