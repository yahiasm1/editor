# HersheyTicketMap (`hershey`, 5.62-11.76 s)

"March 2, 1962. Not in some big city arena, but in Hershey, Pennsylvania, the chocolate town, against the New York Knicks."

## What I looked at

- `photos/commons-hershey-sports-arena-1936-program-pd.jpg`: the arena's own print of the era. Cream/peach stock with a
  faint wash pattern, black and red ink only. A tall red outline "H" (double stroke) carries HERSHEY; "THE HERSHEY
  SPORTS ARENA" in red, bold, very widely spaced caps; small black caps under it; "Nº 812" in red at bottom left;
  "PRICE 10c" bold black. This is the ticket's print language: red venue line, wide caps, black body, Nº.
- `objects/commons-hershey-kiss-streetlamp-sebwite-pd.jpg` (330 px): the Kiss lamp. Smooth foil-grey Kiss (a tall
  onion/teardrop with a pinched tip), a darker flat underside where the bulb sits, the white paper plume with
  "HERSHEY" in light blue outlined letters curling off the tip like a flag, a plain grey pole straight under it.
  Light comes from the overcast sky: the top half is bright, the belly darkens to the underside.
  Note: the Kiss lamps on Chocolate Avenue went up in 1963, the year after the game (they stand for the town as people
  know it; the plan asks for them). Real detail kept: on the avenue they alternate foil-wrapped (silver) and unwrapped
  (chocolate brown).
- `objects/commons-factory-towers-ccbysa3.jpg`: two red-brown brick smokestacks, slightly tapered, a darker banded
  cap ring at the top, HERSHEY in white block letters stacked top to bottom (7 letters, each about 1/14 of the stack),
  the right stack a little further away so a little thinner. Below: a 4-storey red brick block with cream trim
  bands, 3 x 3 big grid windows (many panes), a cream-brick wing at left, a water tank dome between the stacks,
  power lines crossing. Steam leaks at the base of the right stack.
- `photos/commons-hershey-postcard-1940s-arena-pd.jpg`: the park as a 1940s linen postcard (texture, the town's own
  colours). Context only.
- Old Madison Square Garden (1925-1968, Eighth Avenue between 49th and 50th): Commons answered 429 to every request
  (API and upload.wikimedia.org, with backoff). Drawn from what is well documented about the building: a wide, low,
  flat front of brick and stone, rows of windows above, and the long marquee running the whole width with
  MADISON SQUARE GARDEN in big lit letters on its face and changeable letters below; the busy avenue in front.
  No event copy is invented on its letterboard (bulb rows only).
- Pennsylvania: the map thumbnails were refused too (429). Drawn from real coordinates (lat/lon, equirectangular,
  cos 41 deg): north border 42.00 N, the Erie panhandle up to 42.27 N at 79.76 W and the Lake Erie shore to the Ohio
  line at 80.52 W, west border 80.52 W, Mason-Dixon line 39.72 N, the Delaware as the jagged east border (Hancock,
  Callicoon, Narrowsburg, Port Jervis, the Water Gap, Easton, New Hope, Trenton, Philadelphia, Chester, Marcus Hook,
  the 12-mile arc to Delaware). Susquehanna from Sayre down past Wilkes-Barre, Sunbury (West Branch from Lock Haven,
  Williamsport), Harrisburg, to the Maryland line. Hershey 40.286 N 76.650 W, Philadelphia 39.95 N 75.16 W, New York
  40.71 N 74.01 W (just past the east border).
- `logos/nba-knicks-primary.svg`: the current Knicks mark (white outline shape, grey inverted triangle, blue rim,
  the orange ball and KNICKS). Placed bare, as a stamp would sit.
- Example read: pewdiepie `MapSpace.tsx` (one world, a camera, things projected and drawn every frame) and the
  touchscreen `WireGrid` (one view that dives and pulls back, parts split into helper files).

## The real thing, part by part

1. The ticket (thread of the scene, HAND scale). Cream #EFE6D2 card, 860 x 360, a soft curl shadow, grain, a vertical
   perforation (round holes) separating the stub at right. Printed like the 1936 programme: thin red double rule
   frame, small caps "NATIONAL BASKETBALL ASSOCIATION" (black), the red widely spaced venue line, black typed fields.
   Fields: DATE (typed MARCH 2, then a rotary date stamp rolls its year bands to 1962 and thumps in red ink),
   PLACE (types HERSHEY SPORTS ARENA in red), GAME (types PHILADELPHIA WARRIORS vs, the arched PHILA lettering beside,
   then NEW YORK KNICKS and the Knicks mark stamped). Stub: ADMIT ONE, MAR 2 1962. No price, no serial number.
2. The counter from the hook (white numerals on black flaps, WILT label), small, parked in the top-left corner.
3. NEW YORK: old MSG at night, marquee bulbs, avenue traffic (head and tail lights), people dots, label "New York".
4. PENNSYLVANIA: the state outline drawn as a line, river hairline, two grey city dots, the amber pin (the one amber
   thing: the place that saw it).
5. HERSHEY: Chocolate Avenue at night in one-point perspective toward the two HERSHEY stacks and the factory with lit
   windows; Kiss lamps on both kerbs, alternating foil and brown, each lighting its pool on the road.

## Word, then change

| word | what happens |
|---|---|
| (lead-in) | counter 100 at top centre (hook hand-off), ticket slides up into the centre |
| March 2, | counter shrinks to the top-left corner; DATE field types MARCH 2 |
| 1962. | lands: year bands roll 2026 -> 1962 and the stamp thumps red, ink spreads |
| Not in some big city | ticket rises to the top third; MSG at night arrives below, bulbs lighting left to right, cars running |
| arena, | lands: marquee bulbs blink off in one sweep left to right; the block slides away left |
| but in | PA outline draws in from the right as one line |
| Hershey, | lands: the amber pin drops on Hershey with a bounce; label |
| Pennsylvania, | state fills a shade lighter, camera pushes in on the pin; Philadelphia, New York dots |
| the chocolate | lands: the push continues through the pin into Chocolate Avenue at night; Kiss lamps light one by one, near to far |
| town, | ends on: last lamp under the stacks; PLACE types HERSHEY SPORTS ARENA |
| against the New York | ticket comes back to centre over the dimmed street; GAME types PHILADELPHIA WARRIORS vs, PHILA mark |
| Knicks. | lands: NEW YORK KNICKS typed, the Knicks mark stamps; the stub tears off along the perforation |

## Sound-off test

A dated ticket (1962), a famous big-city arena switched off, a pin on Pennsylvania, a street of chocolate-kiss lamps
and HERSHEY smokestacks, then the ticket filled with HERSHEY SPORTS ARENA, Warriors vs Knicks, torn for the gate: a
stranger reads "a 1962 Warriors-Knicks game played in Hershey, PA, not New York".

## Built, checked

Stills read at 5.30-11.85 s (every key word). Fixes after the first look: dropped a hatch "relief" that read as
decoration and a stray Lake Erie block, moved the PENNSYLVANIA and Philadelphia labels clear of the border, softened
the lamp pools, moved the receding car further down the avenue, shortened the stub's tear so it stays in frame.
Richer pass: each Kiss lamp strikes (flicker, small flash, settles, hums), steam drifts off the stacks, a car's tail
lights recede toward the factory, the marquee bulbs chase, cabs run both ways on Eighth Avenue.
Handover at 11.85 s lands on `crowd`'s own stub at its gate.

## Review round 1, applied

- Opening (lead-in to "Not"): the ticket now lies on the arena's own prints on a dark walnut table under a drifting
  warm lamp: the real 1936 Hershey Sports Arena programme (HERSHEY HOCKEY CLUB, the barrel vault, "THE HERSHEY SPORTS
  ARENA") big behind it, the 1940s Hersheypark linen postcard slid under its corner (`HersheyTicketMapDesk.tsx`,
  both public domain, copied to `public/wilt-100/hersheyticketmap-*.jpg`). Slow push; it drops away on "Not".
- Map: the Ridge-and-Valley drawn from real lines (Blue/Kittatinny Mountain as the south-east edge, the Allegheny
  Front as the north-west edge, 15 folds interpolated across the belt with the plunging zig-zag, a lit crest and its
  shadow, a lighter belt fill), labelled "Appalachian ridges"; the 1962 Pennsylvania Turnpike (Ohio line to the
  Delaware bridge, passing just south of Hershey), labelled; Pittsburgh dot. Labels fade during the push; the
  PENNSYLVANIA label has a halo over the folds.
- New York: real 1950s shapes with body shading, glass, chrome bumpers, whitewalls and road reflections: a '57 Bel
  Air (fins, two-tone roof, side spear), Checker A8 cabs (upright cabin, checker band, TAXI light), a late-'40s
  fastback; a GM "old look" 8 AV bus on the far lane; far lane smaller and hazier. 58 people, each with their own
  height, coat, hat (fedora, small hat, none), dresses, legs and arms swinging when walking, a third standing in line,
  warm rim light from the doors. "New York" moved to clear sky at right (1010, 796) with a dark halo.
- Avenue car: a late-'50s sedan from behind: roof, cabin and rear window, the lamps' light on its roof line and
  trunk edge (brighter as it passes a lit pair), chrome bumper, lit plate, fin tail lights with glow and soft red
  streaks on the road.
- Steam: blurred, wide, low plumes lying right on the wind, staying under the ticket's edge.
- Stills read: 5.2, 5.3, 5.4, 5.45-5.8, 6.3, 7.0, 7.5, 7.6, 8.0, 8.9, 9.3, 9.4, 9.7, 10.0, 10.3, 11.0, 11.4, 11.8.
