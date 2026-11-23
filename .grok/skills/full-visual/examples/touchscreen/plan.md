# Visual plan, touchscreen ("Your phone screen reacts to the lightest brush of your finger")

approved: (waiting)

Read the right-hand side of each line alone: it should retell the script. Every event is tied to a spoken word
("lands on" = one event on the word, "ends on" = a build that finishes on it). Script: `script.txt`, his transcript,
word for word, taken as true. Scene ids and grounds are the ones in `caption.txt`. Times are from `words.json`
(voice locked, 84.5 s). Facts: `facts.md` (the block "Added for the visual plan" holds every number this plan puts on
screen). Fetched material: `assets/refs/`, `assets/logos/`. Type of reel: everyday explainer
(`.agents/skills/full-visual/references/taste.md`, sections 3 to 5 are the bar; the Apple Watch cross-section is the model).

## Once for the reel

- **The wrong picture we kill: "the screen feels me press".** Every scene is the same proof from another side: what
  counts is whether charge leaves a crossing, never how hard anything pushes.
- **One world, three scales, visited in turn.**
  1. **The section** (inside): the iPhone cut open edge-on, as in the Apple Watch reel. From top to bottom: the cover
     glass with its bevelled edge and a real reflection, the thin touch layer with the wires seen end-on (columns as
     small bright dots, one row as a long line under them), the OLED panel with its red, green and blue sub-pixels
     lit, the steel frame. Order of the layers read off `refs/rewa-iphone-x-oled-layers.jpg` (glass lens, touch
     panel, OLED panel) and `refs/ifixit-iphone-x-screen.jpg`. A fingertip above it is a real fingertip: skin ridges,
     nail, the pink of the pad (`refs/wikimedia-fingertips-macro.jpg`).
  2. **The grid** (what the phone sees): the screen with the glass gone, rows and columns as the real diamond pattern
     (`refs/canvys-pcap-diamond-sensor.jpg`, `refs/semanticscholar-electrode-patterns.png`,
     `refs/microtouch-capacitive-technology-chart.jpg`). Flat from above in `grid`; from a low three-quarter angle in
     `touch`, so the height of the charge over each crossing can be read. The phone's picture of a touch is the real
     one: one number per crossing (`refs/mtkit-raw-capacitive-image.jpg`).
  3. **The hand in winter** (the lived scene): a real iPhone 17 (`refs/wikimedia-iphone-17-vector.svg`,
     `refs/apple-iphone-17-og.png`) held in a grey wool glove (`refs/glove-touchscreen-wirecutter.jpg`), snow falling,
     the real locked incoming-call screen ringing (`refs/ios17-locked-slide-to-answer-gadgethacks.webp`: caller name
     top left with a portrait, `slide to answer` with the white knob and green handset). The caller is `Sofia`, with
     the portrait `refs/face-sofia.jpg`. This scene comes back four times: glove fails (`winter`), the call is missed
     (`glove`), she calls back (`thread`), the knob finally slides (`close`).
- **The thread object: the call that cannot be answered.** `slide to answer` is on screen in `winter`, will not move
  in `glove`, rings again in `thread` and slides in the first second of `close`. The knob is the reel's progress
  bar: the viewer waits 57 seconds for it to move.
- **The invisible thing has one shape and one colour all reel: charge is warm gold (`#FFC233`).** It is drawn as a
  small bundle of glowing filaments that arch from the row up through the glass and back down to the column at every
  crossing (the fringe field, as in `refs/atmel-mutual-capacitance-measurement.jpg`), with a slow pulse travelling
  along them. Filaments have weight: they sag, stretch and snap back. Everything else is desaturated (graphite glass,
  grey wool, pale skin), so gold is the only thing that pulls the eye. Real interface colours (the green handset, the
  app icons) keep their own colour and stay small. No second accent, no red stroke.
- **There is no second shape for the charge.** The dip the phone sees is the same filaments standing shorter over the
  touched crossings, with the number on each crossing lower. No gold sheet, no surface plot, no dent in a mattress,
  no bars. A touch the phone has accepted is a thin white ring on the screen, nothing else.
- **The same four-step skeleton for every case, and the last case breaks it.** Something comes near the glass, the
  filaments either lean into it or do not, the numbers on the crossings either drop or stay, the iPhone either reacts
  or does not. Bare finger: lean, drop, reacts. Glove: nothing, nothing, nothing. Raindrop: lean, drop, reacts by
  itself. Thread: the break, the charge travels along one thread through the wool to the skin, and the knob slides.
- **Every return to the section has a new hero, at a new crop.** The section is the world, never the picture twice:

  | Scene | What fills the frame | What is seen for the first time |
  |---|---|---|
  | `answer` | the pen's brass tip on the glass, then the fingertip | pushing does nothing, a brush does everything |
  | `finger` | the inside of the fingertip, then the pad over three crossings | salt water passing charge on; filaments leaving for the skin |
  | `glove` | the knit, loop by loop, between skin and glass | the charge stopping at the wool |
  | `rain` | one domed drop | water doing exactly what the finger did |
  | `thread` | one metal-wrapped yarn crossing the wool | the charge finding a way through |
  | `close` | one crossing, one filament | the single thing that went missing |

- **A comparison is the same picture twice.** Finger beside pen (`answer`), glove beside the ghost of the bare finger
  (`glove`), raindrop beside the ghost of the finger (`rain`): same section, same framing, only the thing above the
  glass changes.
- **Real numbers only, each with one small grey source line** (from `facts.md`): `120 scans a second` (Apple, iPhone X
  and later), `less than 1 pF` (Texas Instruments). `10 x 15 = 150 crossings` is NOT used on screen (we draw the
  phone's grid, whose real count we do not know). The counts on the crossings (`100`, `62`, `81`, `84`, `71`) are
  illustrative and tagged so. No distance, thickness or gap is ever given a number.
- **Tiny honest tags**, bottom left of the stage, one at a time, 24 px grey: `Magnified illustration`,
  `Charge shown in gold, invisible to the eye`, `The wires are transparent in a real phone`, `Grid spacing
  illustrative`, `Values illustrative`.
- **Labels are a word and a hairline, on the thing, at the word.** `ROW`, `COLUMN`, `CROSSING`, `CHARGE`, `WOOL`,
  `CONDUCTIVE THREAD`. One label lands at a time, and never in the same half second as a tag or a number. No pill,
  no dot, no card around them.
- **Grounds:** dark all reel, a near-black with a faint cold blue tint (winter night). The section glows from the
  OLED below, which lights the scene like a stage. Snow particles fall slowly in the far background of every
  outdoor shot and keep falling, very dim, behind the section too, so the world never changes.
- **The one big move: `finger`, on "pulls".** The fingertip comes down and the filaments under it tear off their
  crossing and whip up through the glass into the skin, with stretch, overshoot and a recoil that ripples across the
  neighbouring filaments. It is the reel's answer, performed. Nothing else in the body is that loud.
- **Nothing appears by magic.** A glove is put on by a hand or arrives on a hand, wool is never knitted out of air,
  an object leaves by being lifted away. The only licence is the section itself and things turning see-through.
- **Motion:** something moves in every frame: the pulse along the filaments, the reading line, the snow, the ringing
  screen, the caption. Travel between scales is one continuous push or pull in the same world (through the glass,
  out of the glass, back along the finger to the hand), never a cut, never a fade to a new world. The first twelve
  seconds carry the most events: no gap longer than half a second without a new one.
- **Pinned chrome:** none (`reel.json`).

## Scene by scene

### 1. `hook`, dark, 0.1 to 6.0 s
"Your phone screen reacts to the lightest brush of your finger and ignores a pen pressed as hard as you can."

Five variants, built separately. All five answer to the same bar (everyday-explainer section 3, the Apple Watch
opening):

- Frame 0 is the section edge to edge, already alive: OLED sub-pixels lit, gold filaments pulsing over every
  crossing, a real fingertip already on its way down, snow drifting far behind. Never an empty ground, never the
  phone as a product shot, never a title.
- The mechanism plays once inside the first second: by 0.6 to 1.0 s the filaments under the finger have leaned up
  into the skin and the pixels below it have flared (the screen reacted), before "reacts" is finished.
- A new event every 0.2 to 0.4 s for four seconds. Three hairline labels in the first 2.5 s, one at a time: `GLASS`,
  `WIRES`, `CHARGE`. Tag: `Magnified illustration`.
- Words acted on the object: "lightest brush" is a pad that barely grazes the glass, "ignores" is the pen arriving
  and the filaments under it staying level, "hard" is the barrel flexing.
- One hard change of scale on the second clause ("and ignores a pen", 3.5 to 4.4 s), inside the same section: from
  the whole width of the phone to the pen's tip. Never a new world.

Hands over: the section, close on the right half: the pen (`refs/wikimedia-bic-cristal.jpg`) pressing, filaments
level under it; the bare fingertip resting lightly on the left, its filaments leaned into the skin.

### 2. `answer`, dark, 6.3 to 12.4 s
"So what is it actually feeling? It isn't really feeling pressure, it's measuring the electricity in your body."

The real thing: the pen's brass tip and ball on the glass (`refs/wikimedia-bic-cristal.jpg`: the tip, the clear
hexagonal barrel, the ink tube), then the fingertip in its place. Verb: press versus measure. Already on screen: the
section from the hook. Eleven events in six seconds.

- "So" (6.30) → the fingertip on the left lifts out of frame; its filaments drop back onto their crossings with a
  small bounce. The pen is alone.
- "what" (6.50) → the view pushes in until the brass tip and its ball fill the upper half, the touch layer and the
  pixels the lower half.
- "actually" (7.26) → the pen leans its whole weight: the barrel flexes, the ink tube bows inside it, the ball digs.
- "feeling?" (7.76) → lands on: a hairline drawn along the top face of the glass under the ball stays dead straight.
  The glass does not give.
- "isn't" (8.46) → a second, harder shove; the hand behind the pen shakes. The sub-pixels under the tip keep their
  colour, unchanged.
- "really" (8.80) → the eye is taken down to the gold: the filaments directly under the ball brighten a touch so we
  look at them. They keep their slow pulse, perfectly level.
- "pressure," (9.54) → lands on: the pen lifts away and leaves the frame. A small blue ink dot is left on the glass.
  Below it nothing ever moved.
- "it's" (10.14) → the bare fingertip comes in from the top left, already descending, slowly.
- "measuring" (10.38) → lands on: a thin white reading line runs along the row under the glass and each crossing
  blinks as it is read. The phone was reading the whole time.
- "electricity" (10.90) → lands on: the pad only grazes the glass (it barely flattens) and every filament under it
  leans up into the skin; the gold goes to full for the first time, and the sub-pixels below flare: the screen
  reacted. Same framing as the pen, same glass, the opposite result.
- "your" (11.84) → the view starts to pull back along the finger.
- "body." (12.00) → ends on: the gold runs faintly up through the fingertip, the knuckle, the hand, the wrist, and
  fades into a coat cuff with snow on it. The body is part of the circuit.

Hands over: the bare right hand over the phone, seen whole for the first time, the phone held in a gloved left hand.

### 3. `winter`, dark, 12.7 to 15.9 s
"Imagine it's winter and you're trying to answer a call with your gloves on."

The real thing: the hand in winter, scale 3. Verb: try to answer. Already on screen: the phone in a gloved left
hand, the bare right hand above it.

- "Imagine" (12.68) → the bare right hand pulls away and out of frame to the right; the pull-back settles on the
  phone in the grey wool glove.
- "winter" (13.24) → lands on: snow thickens, breath fogs across the frame once, two snowflakes land on the glass
  and melt.
- "trying" (14.00) → the right hand comes back in, now in its own grey glove, thumb first.
- "call" (14.74) → lands on: the screen lights with the real locked call screen: `Sofia` and her portrait top left,
  `mobile` under it, `slide to answer` with its shimmer running left to right, the phone buzzing (two short shakes).
- "gloves" (15.32) → the gloved thumb lands on the white knob and drags right. The knob does not follow. The shimmer
  keeps running under the wool.
- "on." (15.68) → the thumb drags a second time, harder, the wool flattening on the glass. Nothing.

Hands over: the thumb pressed on the glass, the knob still at the left.

### 4. `grid`, dark, 16.2 to 30.1 s
"Under the glass of your phone there's a grid of wires you can't see, rows going one way and columns going the other.
Everywhere a row crosses a column, the phone holds a tiny electric charge, and it checks every one of those crossings
over and over."

The real thing: the touch layer of the display, scale 2, flat from above, then one crossing in macro. Sources:
`refs/canvys-pcap-diamond-sensor.jpg`, `refs/semanticscholar-electrode-patterns.png`,
`refs/wikimedia-projected-capacitive-diagram.svg`, `refs/wikimedia-capacitive-touchscreen-phone.jpg` (a real sensor
whose diamonds can be seen), scan rate from Apple's table. Verb: hold, then check. Already on screen: the phone in
the glove.

- "Under" (16.20) → the view dives at the screen: the call screen's pixels grow, and the phone turns flat to face us.
- "glass" (16.52) → lands on: the cover glass lifts off toward us as one thick clear slab (bevel, reflection, the two
  melted snowflakes still on it). The gloved thumb goes with it.
- "phone" (17.08) → the slab slides up and parks, thin, along the top of the stage. The call screen is left bare.
- "grid" (17.86) → lands on: a bar of raking light sweeps across the screen, and inside the bar the whole lattice of
  diamonds shows, sharp, for a third of a second (the real look of `wikimedia-capacitive-touchscreen-phone.jpg`
  tilted under a lamp).
- "wires" (18.30) → the light moves on; behind it the lattice thins to a glint.
- "can't" (18.88) → lands on: the light is gone and so is the grid. Only the call screen, ringing.
- "see," (19.20) → the call screen dims to 15 % and the lattice is relit in pale grey, to stay. Tag: `The wires are
  transparent in a real phone`.
- "rows" (19.62) → ends on "way": the rows draw left to right, one after the other from the top, each a chain of
  small diamonds. Label `ROW` on one.
- "columns" (21.10) → ends on "other.": the columns draw top to bottom, their diamonds fitting between the rows'.
  Label `COLUMN`.
- "Everywhere" (22.40) → every crossing gets a pinpoint, in a wave from the top left corner to the bottom right.
- "crosses" (23.34) → lands on: a hard push in to one crossing, forty times closer, tilted so it has depth: two row
  diamonds joined by a thin neck, the column passing over it on a tiny bridge, a clear gap between them. Label
  `CROSSING`, ends on "column,". Tag after it: `Magnified illustration`.
- "holds" (24.98) → the row lights from the left: a gold pulse arrives along it.
- "tiny" (25.34) → the first filament rises out of the row diamond and arches over the gap.
- "charge," (26.34) → ends on: a dozen filaments now arch from the row diamonds down onto the column diamonds,
  sagging slightly, the pulse running along each. Label `CHARGE`. Tag after it: `Charge shown in gold, invisible to
  the eye`.
- "checks" (27.24) → lands on: a thin white reading line passes over the crossing and a small number is left on it:
  `100`. That is what the phone took away from the look.
- "every" (27.66) → pull back out to the whole grid: every crossing carries its small arch of gold; the reading line
  sweeps down row by row and leaves a `100` on each crossing as it passes. Ends on "crossings". Tag: `Values
  illustrative`.
- "over" (29.12) → the sweep reaches the bottom and starts again from the top, twice as fast.
- "over." (29.82) → ends on: the sweep becomes a shimmer too fast to follow; a counter beside the grid runs and lands
  on `120 scans a second`, grey line `Apple, iPhone X and later`.

Hands over: the whole grid, shimmering, every crossing at `100`.

### 5. `finger`, dark, 30.4 to 40.0 s
"Your body is mostly salty water, so it conducts electricity. When your bare fingertip gets close to the glass, it
pulls a little of that charge away from the crossings right under it."

The real thing: the inside of a fingertip, then the pad over three crossings, scale 1, closer than `answer` ever
went. Sources: `refs/wikimedia-fingertips-macro.jpg`, `refs/atmel-mutual-capacitance-measurement.jpg` (the field
lines bending into the finger), TI and MicroTouch lines in `facts.md`. Verb: pull away. Already on screen: the grid.

- "body" (30.58) → the grid tips back into the section (we are edge-on again, the parked glass comes back down onto
  the layers and seals), and a bare fingertip enters from the top, large, stopping well above the glass.
- "salty" (31.40) → lands on: the skin of the fingertip turns glassy and we see inside: water, with small ions
  drifting in it, each marked `Na+` or `Cl−`, slowly, in every direction. Tag: `Magnified illustration`.
- "water," (31.80) → a ripple passes through it; the ions bob.
- "conducts" (32.54) → lands on: a faint gold push enters at the top of the finger and all the ions shift the same
  way at once, passing the push along down to the pad, where it glows. The cause is on screen: because there is
  salt in the water, charge can move through you.
- "electricity." (32.98) → the skin closes back to real skin, only the pad keeps a faint gold warmth.
- "bare" (34.14) → the ridges of the fingerprint come into focus, a hair of light on the nail.
- "fingertip" (34.46) → the fingertip starts down; the view tightens to the pad and the three crossings under it.
- "close" (35.30) → lands on: the pad stops with a clear gap of air above the glass, and the filaments under it
  already lean toward it, stretching up inside the glass. Nothing has touched anything yet.
- "glass," (35.78) → the pad lands and flattens slightly on the glass. The wires are still a full glass thickness
  below it: the finger never touches a wire.
- "pulls" (36.60) → lands on: THE BIG MOVE. The filaments of the crossings under the pad tear off their column
  diamonds and whip up through the glass into the skin, stretching, overshooting, settling. The glow in the pad
  jumps. A ripple of recoil runs along the neighbouring filaments left and right, which stay on their crossings.
- "little" (37.02) → not all of them: at each crossing under the finger three or four filaments went up, the rest
  still arch from row to column, thinner and lower.
- "away" (38.16) → ends on: the numbers on those crossings roll down, `100` to `62` at the centre, `81` and `84`
  beside it. Tag: `Values illustrative`.
- "under" (39.64) → lands on: a soft bracket marks the three crossings under the pad; every other crossing on the
  row still reads `100`, level, pulsing.

Hands over: the pad down on the glass, three crossings with lower numbers.

### 6. `touch`, dark, 40.4 to 50.9 s
"The phone sees a small dip at those exact crossings and says, that's a touch. And because it measures every crossing
separately, it can follow two fingers at once, which is how you pinch to zoom."

The real thing: the grid from a low three-quarter angle with the glass gone, a number and its gold arches on every
crossing (the phone's raw touch picture, `refs/mtkit-raw-capacitive-image.jpg`), then the real Photos app under two
real fingertips (`logos/apple-photos-icon.png`). Verb: see, then follow. Already on screen: the pad and three lower
numbers. New here: the charge seen as a field with a hollow in it, and what the phone does with the hollow.

- "phone" (40.54) → the view rises out of the section and swings round to a low angle over the grid: a field of
  small gold arches, all the same height, a `100` on each crossing. The finger thins to a faint outline: the phone
  has no picture of a finger, only of this field.
- "sees" (40.92) → the reading line sweeps the field once.
- "dip" (41.64) → lands on: under the outline the arches stand shorter, the centre one a third lower with `62`,
  the ring around it at `81` and `84`. From this angle it is a hollow in the field. That is the dip, made of the
  charge itself.
- "exact" (42.20) → ends on "crossings": the diamonds of the nine crossings that moved turn pale on the grid; the
  rest of the grid dims one step.
- "says," (43.54) → the phone works out the middle of the hollow: two hairlines close in from the edges, one along
  the rows, one along the columns, and cross between the wires, finer than the grid.
- "touch." (44.34) → lands on: a thin white ring snaps onto that cross point. The screen wakes under the grid for
  half a second: the ring sits on the knob of `slide to answer`, and the knob lights under it. This is what the
  glove has to produce.
- "measures" (45.46) → the screen dims again; the reading line slows right down.
- "every" (45.94) → ends on "separately,": it stops on one crossing at a time and each answers with its own number:
  `100`, `100`, `84`, `62`, `81`, `100`. No crossing shares a reading with its neighbour.
- "two" (48.10) → lands on: because each one is read alone, a second hollow can sit in the same field: it sinks
  lower right, with its own low numbers and its own ring. Two outlines of fingers above them.
- "once," (48.92) → both rings drift a little, independently; each hollow travels under its ring, the arches
  shortening ahead of it and growing back behind.
- "pinch" (50.02) → lands on: the screen comes back to full brightness and the grid fades to a tenth: the real Photos
  app, one photo full screen (a snowy street). The two outlines fill back in as a real thumb and index, pads on the
  two rings, spreading apart.
- "zoom." (50.56) → ends on: the photo scales up with the fingers, exactly as far as they travel.

Hands over: the phone, face on, the photo zoomed, two fingertips on it.

### 7. `glove`, dark, 51.2 to 59.3 s
"But your glove doesn't conduct anything. So your finger is right there, pressing on the glass, and the charge never
moves. For the phone, nobody touched it."

The real thing: the knit of a wool glove in macro, loop by loop, between skin and glass (same section as `finger`,
but the wool is the hero and fills the frame); then the call screen. Sources: `refs/glove-touchscreen-wirecutter.jpg`,
`refs/wikimedia-isotoner-touch-gloves.jpg` (the knit), the ktcplay line in `facts.md`. Verb: nothing moves (every
step of the skeleton fails). Already on screen: the phone face on.

- "But" (51.22) → the two fingers lift away, the photo closes, the phone tips edge-on: the section, filaments back
  on their crossings, every number back to `100`.
- "glove" (51.54) → lands on: a gloved fingertip comes down into frame from the top and stops above the glass, close
  enough that the knit fills the upper half: real yarn, fuzzy, loops with air between the fibres. Label `WOOL`.
- "conduct" (52.20) → the wool goes see-through enough to show the pad inside; the gold warmth of the pad reaches
  the inner face of the wool and stops there: it spreads along the skin and cannot enter a single fibre.
- "anything." (52.60) → lands on: the gloved fingertip comes down and lands on the glass.
- "finger" (53.56) → the view tightens on the contact: skin, a few loops of yarn, glass.
- "there," (54.32) → lands on: a hairline bracket spans the wool from the skin to the glass. A few fibres, no more.
  The filaments below stand straight.
- "pressing" (54.78) → ends on "glass,": the finger presses: the wool compresses to half its thickness, the bracket
  closes with it, the pad flattens, the knuckle bends with effort, exactly the pen's shake from `answer`.
- "charge" (56.22) → the reading line passes under it; each crossing blinks as it is read.
- "never" (56.70) → lands on: `100`, `100`, `100`.
- "moves." (56.98) → ends on: the same picture twice: the bare fingertip of `finger` appears beside the glove at
  40 %, its filaments up in the skin and `62` under it. Under the glove, not one filament leans.
- "phone," (57.90) → the ghost goes; the view rises straight up through the glove to the screen it is pressing on.
- "nobody" (58.48) → lands on: the real call screen: the gloved thumb dragging across `slide to answer`, no ring
  under it, the knob still at the left.
- "it." (59.16) → the call screen gives up: it slides away and the real lock screen shows `Missed Call`, `Sofia`,
  `now`.

Hands over: the lock screen with the missed call, snow on the glass.

### 8. `rain`, dark, 59.6 to 65.3 s
"That's also why your screen goes crazy in the rain. Water conducts too, so every drop looks like a finger."

The real thing: the iPhone home screen under rain, then one drop in section beside the finger, then the home screen
again. Sources: `refs/wet-phone-freerange.jpg` (how drops bead on the glass), the touchpro line in `facts.md`, the
real icons in `logos/` (Phone, Messages, Maps, Photos, Weather, Instagram). Verb: looks like. Already on screen: the
lock screen.

- "That's" (59.64) → the gloved hand leaves; the snow on the glass melts into beads.
- "screen" (60.54) → the lock screen opens to the real home screen, six icons.
- "crazy" (61.12) → lands on: a drop lands on Maps and Maps opens by itself. Nobody is touching the phone.
- "the" (61.64) → a second drop lands low on the screen; Maps closes and the page slides halfway to the next and back.
- "rain." (61.76) → ends on: rain proper: a dozen drops beading on the glass, each a real lens that magnifies the
  pixels under it. Weather starts to wiggle as if held.
- "Water" (62.32) → the phone tips edge-on, the section, tight on one drop: domed, with its highlight, the pixels
  bent inside it.
- "conducts" (62.68) → lands on: the filaments under the drop lean up into it, exactly as they did for the finger,
  and gold glows inside the water.
- "too," (63.18) → the bare fingertip of `finger` appears beside the drop at 40 %, at the same height: the same
  picture twice. Under both, the same three numbers, `81`, `62`, `84`.
- "every" (63.86) → the ghost goes; the view rises back to the home screen from above, a dozen beads on it.
- "drop" (64.18) → white touch rings start to snap onto the beads, one after another.
- "finger." (65.00) → lands on: the last ring lands: every drop wears the ring a fingertip gets, and the screen
  twitches under all of them at once.

Hands over: the home screen, a dozen ringed drops on the glass.

### 9. `thread`, dark, 65.7 to 72.5 s
"And it's why touchscreen gloves work. They have a thread in the fingertips that conducts, and it carries your body's
electricity to the glass."

The real thing: a touchscreen glove's fingertip, where the grey knit turns to a lighter metallic patch, then one
silver-wrapped yarn crossing the wool in section. Sources: `refs/glove-mackweldon-silver-swipe.png` (the pale
fingertip patches), `refs/glove-conductive-yarn-etsy.jpg` and `refs/conductive-thread-spool.jpg` (how the yarn
looks), the Olympia line in `facts.md`. Verb: carry. Already on screen: the home screen with ringed drops.

- "touchscreen" (66.18) → a gloved hand wipes the drops off the glass in one pass, the rings going with them: the
  same grey glove, but the tips of the thumb and index are a paler, slightly shiny knit.
- "gloves" (66.72) → the phone buzzes: the real call screen again, `Sofia`, `slide to answer`. She is calling back.
- "work." (67.08) → the thumb goes for the knob, and the view pushes in on its tip until single loops of yarn fill
  the stage.
- "thread" (67.98) → lands on: among the grey wool loops, one yarn is different: a core wrapped in a fine bright
  metal filament, glinting as it turns. Label `CONDUCTIVE THREAD`.
- "fingertips" (68.52) → the view tips to the section, the crop of `glove`: skin, wool, glass, and now the bright
  yarn running through the knit from the skin side to the glass side.
- "conducts," (69.26) → lands on: the gold warmth that stopped at the wool in `glove` finds the metal and enters it.
- "carries" (70.24) → ends on "electricity": the gold travels down the yarn, loop by loop, through the whole
  thickness of the wool, and arrives at its outer face.
- "glass." (72.06) → lands on: the yarn's end is on the glass, and the filaments below whip up to it; the number
  under it drops, `100` to `71`. The skeleton's first two steps finally happen through a glove.

Hands over: the section, a gold path from the skin through the wool to the wires.

### 10. `close`, dark, 72.9 to 79.6 s
"So your screen never felt your finger. It felt a tiny bit of charge go missing, and your finger was just the thing
that took it."

The real thing: the knob finally sliding, then the first shot of the reel, resolved: one fingertip, one crossing,
one filament. Source: TI, "less than 1pF". Verb: took. Already on screen: the section with the thread. "felt",
"your" and "finger" are each spoken more than once here: the times below say which one.

- "So" (72.86) → the view pulls back up the thumb to the hand and the phone: a ring under the thumb, the thumb
  drags, and the knob of `slide to answer` follows it all the way right.
- "screen" (73.24) → lands on: the call connects: `Sofia`, `00:01`. The wait is over.
- "never" (73.84) → the view dives back under the thumb into the section: the pad presses hard, and the hairline
  along the top of the glass stays dead straight, as it did under the pen. The wool and its thread thin to an
  outline.
- "finger." (74.58) → lands on: the finger thins to a pale outline too. What is left bright is only the gold that
  rose from the crossing. That is all the phone ever had.
- "tiny" (75.62) → push in to a single crossing: from its bundle of filaments exactly one has lifted off. Hairline
  label on it: `less than 1 pF`, grey line `Texas Instruments`.
- "charge" (76.30) → the number on that crossing starts to roll down.
- "missing," (76.92) → lands on: the number stops, and in the bundle there is a clear gap where the filament was.
  Everything else in the frame dims; the gap is the only bright thing.
- "finger" (77.80, the second one) → the view follows the lifted filament up through the glass; the outline fills
  back in as the bare fingertip of the first shot, real skin.
- "took" (79.24) → lands on: the one gold filament is in the fingertip, curled, glowing, held there.

Hands over: the fingertip with its filament, the phone under it.

### 11. `cta`, dark, 79.9 to 83.7 s
"Follow me, and send this to someone whose phone never works with wet hands."

The real thing: this reel on Instagram, on the same iPhone (`logos/instagram-logo.png`, `assets/avatar-creator.png`;
the reel page geometry as built in `lg-tv-spy/scenes/CommentCtaSheet.tsx`: account row with `Follow`, the action
rail, the share sheet). The cursor is the real fingertip, and each tap wears the white touch ring. Verb: follow,
send.

- "Follow" (79.90) → lands on: the phone turns face on, the reel page on it; the bare fingertip (still carrying its
  gold filament) taps `Follow` beside `your.handle`. A ring blinks under the tap, the button becomes `Following`.
- "send" (80.80) → lands on: the fingertip taps the paper plane; the share sheet rises with a row of portraits.
- "someone" (81.28) → it taps the first portrait (`Sofia`), a tick lands on her, `Send` lights.
- "never" (82.30) → drops fall on the glass over the sheet.
- "wet" (83.12) → lands on: the fingertip, wet now, goes for `Send`: rings pop under the drops around it and the
  sheet jitters once. Its own tap gets through: `Sent`.
- last frame, paused: the phone with `Following` and `Sent`, drops on the glass each wearing a small ring.

## What a builder must not do

- No pill labels, no dot before a label, no cards, no dashed lines, no frosted panel, no coloured bar chart for the
  numbers, no gold sheet or surface plot (the dip is shorter filaments and lower numbers on the real grid).
- No second accent colour, no red strike. Negation is shown by stillness beside effort, and by a line that stays
  straight.
- No drawn hand standing in for a real one: fingertip, glove, pen and drops are real-looking, lit by the screen.
- Nothing knitted, grown or materialised out of air: gloves arrive on hands.
- No count for the iPhone's rows and columns, no glass thickness, no wire spacing, no gap distance written on screen.
- A bare finger on the glass always pulls charge. The filaments stay level only under the pen and the plain glove.
- Never more than one label, tag or number landing in the same half second.
- No em dashes in any on-screen text. No "reel" in on-screen copy.
- `Sofia` is an invented caller with a synthetic portrait; no real name is used.

## Fetched into the reel folder

`assets/logos/`: `apple.svg`, `apple-phone-icon.png`, `apple-messages-icon.jpg`, `apple-maps-icon.png`,
`apple-photos-icon.png`, `apple-weather-icon.jpg`, `instagram-logo.png`. `assets/avatar-creator.png`.

`assets/refs/`: the phone (`wikimedia-iphone-17-vector.svg`, `wikimedia-iphone-16-vector.svg`,
`apple-iphone-17-og.png`), its layers (`ifixit-iphone-x-screen.jpg`, `ifixit-iphone-13-screen.jpg`,
`rewa-iphone-x-oled-layers.jpg`), the grid (`canvys-pcap-diamond-sensor.jpg`,
`semanticscholar-electrode-patterns.png`, `microtouch-capacitive-technology-chart.jpg`,
`wikimedia-projected-capacitive-diagram.svg`, `wikimedia-capacitive-touchscreen-phone.jpg`), the field and the dip
(`atmel-mutual-capacitance-measurement.jpg`, `3ds-capacitive-field-simulation.png`,
`mtkit-raw-capacitive-image.jpg`), the call screens (`ios17-locked-slide-to-answer-gadgethacks.webp`,
`ios14-unlocked-accept-decline-macrumors.png`, `ios17-in-call-screen-reddit.jpg`,
`ios9-incoming-call-slide-to-answer-a.jpg`, `-b.jpg`), the finger, pen and stylus
(`wikimedia-fingertips-macro.jpg`, `wikimedia-bic-cristal.jpg`, `wikimedia-capacitive-stylus.jpg`), gloves and
thread (`glove-touchscreen-wirecutter.jpg`, `glove-mackweldon-silver-swipe.png`,
`wikimedia-isotoner-touch-gloves.jpg`, `glove-conductive-yarn-etsy.jpg`, `conductive-thread-spool.jpg`), rain
(`wet-phone-freerange.jpg`), the caller (`face-sofia.jpg`).

## Critic pass (2026-10-11), what changed and why

- **Repeat:** the gold sheet with dimples was the main picture three times (`touch`, `glove`, `rain`) and was a
  metaphor ("dents in a mattress") where a real thing exists. It is gone. The dip is the filaments themselves
  standing shorter on the real grid, seen once at a low angle in `touch`; `glove` and `rain` end on the real screen.
- **Repeat:** the section came back six times at the same framing. Each visit now has its own hero and crop (table
  above).
- **Told, not shown:** "grid" landed on an empty screen; it now lands on the lattice caught in raking light, lost on
  "can't". "never felt" in `close` showed a bare finger pressing with level filaments, which contradicted the
  mechanism; the glass line stays straight and the finger goes to outline instead.
- **Magic:** the glove knitting itself onto the hand (twice) is replaced by gloved hands arriving.
- **Clutter:** label, tag and number no longer land together (`grid` "charge,"); `CHARGE` and `COVER GLASS` are out
  of `answer`; the gap gauge with invented numbers is out of `finger`; the nine leaders are out of `touch`; `thread`
  no longer does the whip and the knob in one word (the knob opens `close`); `rain` fires one thing per drop.
- **Cause:** "because it measures every crossing separately" is read out crossing by crossing before the second
  finger arrives; "so it conducts" keeps its ions; the comparison bare finger beside glove, promised but missing, is
  on "moves.".
- **First 10 s:** `answer` goes from six events to twelve, and the screen itself now reacts under the finger and not
  under the pen. The hook's bar is written down for the five variants.
- **Story:** the call was missed at 59 s and answered at 72 s with no second call; `Sofia` now calls back on
  "gloves".
