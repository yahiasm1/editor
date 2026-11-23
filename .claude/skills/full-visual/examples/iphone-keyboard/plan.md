# Visual plan, iphone-keyboard ("Every key on your iPhone keyboard is smaller than your thumb...")

approved: (waiting)

Read the right-hand column alone: it should retell the script. Every event is tied to a spoken word ("lands on" = one
event on the word, "ends on" = a build that finishes on it). Script: `script.txt`, his transcript, taken as true.
Voice: `voice.mp3` + `voice.alignment.json`, 78.6 s, one take, locked. Scene ids and grounds are the ones in
`caption.txt` (11 scenes, all dark). Type of reel: everyday explainer (`.agents/skills/full-visual/references/taste.md`): its
sections 3 to 5 are the bar for every scene below and for the five hooks.

The viewer's wrong picture, in five words: "I'm just good at typing."

Everything named below is already fetched into `reels/iphone-keyboard/assets/` (18 MB). Builders copy what a scene
uses into `full-visual/public/iphone-keyboard/`.

## Once for the reel

- **Thread object: one iPhone keyboard, and the thing under it.** The real iOS keyboard in dark mode, redrawn at true
  geometry from real screens (`refs/ios-keyboard-dark-quicktype.jpg`, 1179 x 2676, plus the light twins
  `refs/ios-keyboard-light-quicktype.jpg`, `refs/ios-keyboard-light-lowercase.jpg`, and Apple's own pictures
  `refs/apple-support-onscreen-keyboard-1.png`, `-2.png`): three letter rows, shift, delete, 123, space, return, the
  QuickType bar with its three slots and two hairlines, the text field above it, the home indicator below. Type is
  San Francisco (macOS has it: `/System/Library/Fonts/SFNS.ttf`, CSS `-apple-system`). It is drawn, never pasted,
  because every key has to press, every cap has to lift and every zone has to move.
- **The invisible thing has one shape, one material and one colour for the whole reel: the hit region.** A warm amber
  cell of light under the glass (iOS system orange, `#FF9F0A`), one per letter, the 26 of them tiled edge to edge
  with no gap. A cell is wider and taller than its cap: it owns the dark strips around the key too. It has weight:
  when one swells its neighbours are pushed and bow, and they settle. Everything else on screen is the keyboard's own
  greys. Amber is never used for anything else. The patent's own name, **"hit region"**, lands once as a label with a
  hairline, after it has been shown (`zone`).
- **The zone map is measured, not invented.** For each thing typed on screen, the size of every letter's zone follows
  how often that letter comes next in English: `assets/data/next-letter.json`, counted from Peter Norvig's
  `count_1w.txt` (the 333,333 most frequent words of the Google web corpus, `assets/data/count_1w.txt`). Prefixes
  the json does not hold yet are counted the same way from the same file before a scene uses them (checked today:
  after "y", O 76%; after "yo", U 96%; after "h", A 28%, O 28%, E 24%; after "he", A 33%, R 32%, L 25%; after "what",
  E 70%, S 25%; after "time", S 80%; after "works", H 80%). After "tim", E follows in 96% of uses, then B 1%
  (timber), O 1% (timothy), I 1% (timing); W rounds to 0%. "timw" is not a line of the list; "time" is line 50, with
  908,705,570 uses. Apple's real model is its own, so the honest tag is on screen whenever the map is.
- **Tiny honest tags** (small grey type, a corner of the stage, no pill, no dot):
  "Zones drawn visible. On a real iPhone they are invisible." / "Zone sizes from English word counts, not Apple's
  own model." / "Illustrative" (the 2007 keyboard's zones) / "US Patent 8,232,973, fig. 8B. Colour added."
- **One world, three scales, and the reel travels between them and comes back.**
  - MACRO: two or three keys fill the stage (one key about 330 px wide). Where a thumb, a touch point and a zone
    border can be read.
  - SLAB: the whole keyboard with its text field, about 1000 px wide, y 560-1130. The home pose, and the hook's
    last frame.
  - HAND: the whole phone, 430 x 930, the Messages thread above the keyboard. The lived scene. It is the one thing
    allowed to run below y 1140.
- **The lived scene: you are texting a friend.** Messages, real geometry. Her bubble: "dinner tonight?" (grey, left,
  her portrait `people/friend-sofia.jpg`, name "Sofia" in the header). You type "what time works". It comes back
  three times: `tim` (T, I, M), `same` (the E lands, "what time"), `again` (" works", sent, "Delivered"). Her answer
  "8?" is in the thread when the keyboard returns in `close`, and she is the friend the reel is sent to in `cta`.
- **The thumb is real.** A real thumb, photographed, cut out, lit from above with a soft contact shadow that tightens
  as it comes down. References fetched: `refs/thumbs-typing-pexels-6669813.jpg`, `refs/thumbs-typing-pexels-6669795.jpg`
  (Pexels, free), `refs/thumb-on-touchscreen-ccby2-intel.jpg` (CC BY 2.0). **Open point for him:** none of the three
  gives a clean thumb at MACRO size. The best fix is ten seconds of his own thumb shot from above on a white sheet;
  otherwise the builders redraw it photoreal from these three. What the glass feels is drawn the way the patent
  draws it: a soft contact patch and one white "+" at its centre, the touch point (fig. 8B uses the same "+").
- **The letter balloon is real behaviour, so it is there on every press** from `tim` on, at its true size. Before
  `popup` it is never labelled, never pointed at and never the centre of a frame; at MACRO with the thumb on the
  glass the frame is cut so the balloon is above the top edge. `popup` is where the viewer is made to notice it.
- **A new real thing for every sentence group, and no main picture twice:**

  | Scene | Its one picture | Seen nowhere else |
  |---|---|---|
  | `answer` | the keyboard pulled apart into two sheets, tilted | the split |
  | `zone` | one tap that lands on no key at all and is caught | the "+" falling through the glass |
  | `tim` | the real word list, its rows flying to the key of their next letter | the list, the piles, the find bar |
  | `grow` | one cell swelling under a thumb held in the air | the swell, slow, face on |
  | `same` | the same frame with the light off, then on: a tie that is not a tie | callipers, the E/W miss |
  | `again` | one keyboard map becoming fifteen, one per character of the message | the sheet of maps |
  | `first` | the 2007 iPhone, ten 44 px squares that do not fit in 320, then the patent's own drawing | the old phone, the overflow, fig. 8B |
  | `popup` | a thumb turned to glass, and the real switch that takes the balloon away | the Settings row |
  | `close` | three taps played twice: as the eye saw them, then as the keyboard saw them | the rewind |
  | `cta` | his Instagram profile, the share sheet, her reply | Instagram |

  The E/W miss happens once, in `same`. The single-cell swell happens once at full size, in `grow`. The map
  re-forming per keystroke is a far, tilted glimpse in `answer` and a sheet of copies in `again`, never the same
  framing.
- **Grounds:** dark throughout, as `caption.txt` says. Near-black, slightly warm, so the amber is the only colour
  that pulls the eye. The one blue is the Messages bubble (and Instagram's Follow button at the very end). The one
  red is the overflow in `first`.
- **The one big move (body):** in `answer`, between "see" and "touch,", the keyboard splits in depth. The sheet of
  key caps and letters lifts off as one thin pane of glass and hangs above; under it the amber zones are lying there,
  packed edge to edge. Two flat sheets, drawn in 2D with a tilt and real parallax, heavy, with a settle. It closes
  again at the end of `zone`, and the reel never does anything that loud again. After that the zones are seen
  through the caps as an x-ray, switched on and off on the word.
- **The one turn:** at "Apple built this" (`first`) the modern phone shrinks to the side and the 2007 iPhone takes
  the stage. It is the only time the keyboard on stage is not today's.
- **The last shot is the first shot, resolved:** `close` is the hook's own frame (thumb over keys too small for it),
  played once as the eye sees it and once with the x-ray on.
- No pill labels, no dot badges, no dashed lines, no rows of coloured bars, no terminal, no frosted blur, no card
  stack. Labels are plain small type with a hairline to the thing. Evidence type is 32 px or more. The densest frame
  holds seven things, and one of them is always plainly the subject. No em dashes anywhere on screen.

## Scene by scene

### 1. `hook`, dark, 0.3-5.7 s
"Every key on your iPhone keyboard is smaller than your thumb and you still hit the right letter almost every time."

Five variants, built separately. What all five owe the first four seconds (everyday-explainer section 3):

- **Frame 0 is full and already moving.** The real keyboard edge to edge at MACRO or closer, the real thumb already
  on its way down, its shadow already tightening, the amber already alive under the glass. No empty ground, no
  title, no keyboard waiting to be touched.
- **The mechanism plays once inside the first second.** By 0.6 to 1.0 s a tap has landed off its key, a swollen
  amber cell has caught it and the letter has entered the field. The viewer sees the answer work before the voice
  has finished "Every key on your iPhone".
- **The hidden thing is named on a hairline by about 1.2 s:** "touch zone, invisible". (The patent's term "hit
  region" is kept for `zone`.) The tag "Zones drawn visible. On a real iPhone they are invisible." is in a corner
  from frame 0.
- **Each noun is acted on its word:** "key" one cap lit, "smaller" and "thumb" the thumb beside or over that cap,
  plainly wider than it, "right letter" the letter landing, "every time" more letters landing.
- **One hard change of scale at second 3 to 4, on "and you still hit"**, inside the same keyboard. Never a new world.
- **Something new every 0.2 to 0.4 s**; no two frames alike on a 5-frames-a-second sheet.
- **Kept for the body, so no hook does them:** the contact patch with five caps lighting in turn (`answer`), and the
  keyboard splitting into two sheets (`answer`).
- **Hand-off they all share:** the last frame is the SLAB keyboard face on, dark mode, the text field empty above it,
  the amber gone dark, a real thumb just lifted off the glass over the E.

### 2. `answer`, dark, 6.0-12.7 s
"So how is that possible? Because the keys you see are not the keys you touch, and the ones you touch change size
while you type."

Real things: the patch of skin a thumb really puts on the glass, the sheet of key caps, the sheet of hit regions.
On screen from the hook: the SLAB and the thumb. This scene holds the reel's one big move and gives the answer away.
It shows the whole tray, far and tilted; no single cell is the subject here.

| Word | What changes |
|---|---|
| So how | the thumb lifts away and leaves its print on the keys: a soft oval contact patch with a white "+" at its centre. It covers E whole and half of W, R, S and D |
| possible? | the five covered caps light one after the other, round and round, W, E, R, S, D: the keyboard cannot know which one. Ends on "possible?" with all five lit |
| Because | the five go out. The whole slab tips back, its near edge coming toward the viewer, heavy |
| see | the sheet of key caps and letters peels off the slab as one thin pane of glass and rises. Label with a hairline on it: "what you see". Lands on "see" |
| are not | the pane keeps rising, and the E cap drops its own outline straight down, a thin white ghost: it lands inside something wider than itself |
| touch, | the something lights: 26 amber cells left behind on the slab, one per letter, packed edge to edge, each one bigger than the cap outline lying on it. Label: "what you touch". Lands on "touch,". Corner tag: "Zones drawn visible. On a real iPhone they are invisible." |
| the ones you touch | the ghost outline fades. A slow swell starts at the left edge of the tray |
| change | it travels across: each cell rises as the swell reaches it and its neighbours bow out of its way |
| size | the swell reaches the right edge and the tray settles flat. Lands on "size" |
| while you type. | on the upper pane three keys press in turn, h, e, y. At each press the whole tray under it re-forms at once, from the measured counts (after "h": A, O and E large; after "he": A, R and L). Ends on "type." |

Hands on: both sheets stay, apart, the amber map resting with every cell the same size.

### 3. `zone`, dark, 13.0-17.6 s
"Under every letter there's an invisible zone, and that zone is what actually catches your tap."

Real things: one key and its hit region, a touch point. Scale change: the two sheets come forward to MACRO on a part
of the keyboard not seen yet, three caps on the upper pane (J, K, L), their three cells below. The mechanism plays
once, slowly, on one tap that lands on no key at all.

| Word | What changes |
|---|---|
| Under every | a hairline drops from the K cap straight down to its amber cell, then from J, then L, then, as the view eases back a step, from all 26 at once, a comb of 26 lines |
| letter | each line's foot lights its cell for a moment, a wave running across the three rows, ends on "letter" |
| invisible | the amber drains out of the lower sheet until only the cell borders are left, hair-thin, nearly gone. Lands on "invisible" |
| zone, | it floods back to full amber. Back to MACRO on J, K, L |
| that zone | a label lands on the K's cell with a hairline: "hit region". Second line under it, small and grey: "Apple's name for it, US Patent 8,232,973" |
| actually | the real thumb comes down on the upper pane and misses every key: its "+" lands on the dark strip just under the K cap, on bare glass |
| catches | the "+" drops through the pane like a coin through water and falls into the K's cell, which reaches under that strip too. The cell gives under it and springs back, lit. Lands on "catches" |
| your tap. | the cell's light runs up the hairline to the K cap, the cap presses, and a lowercase "k" appears in the text field in the lower left corner. Ends on "tap." |

Hands on: the two sheets close on each other (the pane drops back onto the tray with a soft thud and a settle), the
amber still faintly visible through the caps. The text field clears.

### 4. `tim`, dark, 17.9-27.3 s
"Imagine you're texting a friend and you've just typed T, I, M. Your iPhone already has a guess about what comes
next, because "time" is a word and "timw" is not."

Real things: Messages (the thread, the field, the send arrow), the QuickType bar, and the English word list itself,
shown as the plain two-column file it is (word, count). Scale change: the closed slab shrinks into the whole phone,
HAND, left of centre. The lived scene starts. Two halves, one subject each: first the phone, then the list feeding
the keys.

| Word | What changes |
|---|---|
| Imagine | the phone completes around the keyboard: status bar 9:41, the Messages header with Sofia's portrait and name |
| texting | her grey bubble rises into the thread: "dinner tonight?". Lands on "texting" |
| a friend | the field already reads "what " with the caret blinking |
| T, | the T key presses, "t" enters the field. Lands on "T," |
| I, | same on I. "what ti". Lands on "I," |
| M. | same on M. "what tim". Lands on "M." |
| guess | the QuickType bar fills: its middle slot reads "time", the side slots "times" and "timing". The middle one lifts a little. Lands on "guess" |
| what comes | the keyboard grows to fill the stage (SLAB), the thread slides up and out, the field "what tim" kept just above the keys. In the lower left corner the word list opens, scrolled Apple-smooth to its seven rows that start with t-i-m, real rows, real counts: `time 908705570`, `times 202950880`, `timing 11283175`, `timely 9583522`, `timber 8205739`, `timothy 8103385`, `timer 7488669`. In each row the fourth letter lights |
| next, | the rows leave the list one by one and fly up, each onto the key of its lit letter: "time", "times", "timely", "timer" stack on E; "timber" drops on B, "timothy" on O, "timing" on I. A count on E rolls up and lands: "96%". B, O and I show "1%". Grey source line: "How often each letter follows t-i-m. English web word counts." Ends on "next," |
| "time" | the stacks sink into their keys, the percentages stay. A find bar on the list types "time": one row found, lit, and its count spaced out beside it, "908,705,570 uses". In the field the word completes in grey: "what time" |
| is a word | the row holds, the grey "e" turns to full ink for a beat |
| "timw" | the find bar clears and types "timw". In the field the last letter flips to "w". On the keyboard the W key, next door to the E, shows what fell on it: nothing, "0%" |
| is not. | the find bar returns "0 of 333,333 words". "timw" shakes once and the "w" falls out of the field. Ends on "not." |

Hands on: the field holds "what tim" and the caret. "96%" stays on the E cap and "0%" on the W cap, small. The list
and the find bar leave.

### 5. `grow`, dark, 27.6-33.4 s
"So before your thumb even comes down, the invisible zone around the E gets bigger, and the zones around it get
squeezed."

Real thing: the same keyboard, x-ray on, and a thumb that has not arrived yet. SLAB eases in toward the left half of
the top two rows (Q W E R T over A S D F), so E's cell is about 260 px across. This is the mechanism itself, the
frame the whole reel exists for: it plays slow and heavy, and it is the only time one cell swells at this size.

| Word | What changes |
|---|---|
| before | the real thumb comes into frame from the lower left, high above the glass, its shadow wide and soft on the keys |
| thumb | it keeps coming, the shadow tightening |
| down, | it stops in the air, a hand's breadth of shadow still under it. Time is held: the caret in the field stops blinking. Lands on "down," |
| invisible zone | the x-ray comes on: the amber cells show through the caps, all nine the same size, each centred under its key. Corner tag as before |
| E | the E's cell alone brightens; a hairline joins it to the "96%" sitting on its cap. Lands on "E" |
| bigger, | the cell swells, slowly then all at once: past the edges of its own cap, over the near half of the W cap and of the R cap, and down across the tops of S and D. It overshoots and settles. The cap on top of it has not moved a pixel. Ends on "bigger," |
| zones around it | the four neighbours' borders are lit one after the other, W, R, S, D |
| squeezed. | they are pushed thin: the W's cell, the one with "0%" on its cap, is crushed against the Q's, the R's against the T's, S and D flattened downward, their sides bowing like cushions under a weight. The second ring (Q, T, A, F) gives a little too. Ends on "squeezed." Second corner tag: "Zone sizes from English word counts, not Apple's own model." |

Hands on: the thumb is still hanging in the air; the swollen map stays. The x-ray dims to nothing in the handover,
and the two percentages leave the caps with it.

### 6. `same`, dark, 33.7-42.7 s
"On the screen, nothing moves. Every key looks exactly the same size. But if your thumb lands a little off, halfway
between the E and the W, the iPhone gives it to the E."

Real things: the key caps measured, then the miss. Same framing as `grow`, x-ray off: what the viewer's own eyes
see. Then the x-ray comes back to explain what just happened. The comparison is the same picture twice: with the
light off, with the light on. This is the only time the thumb lands between the E and the W.

| Word | What changes |
|---|---|
| On the screen, | the amber is gone. A plain dark keyboard, exactly as on his phone. The thumb still hangs above it |
| nothing moves. | the caret blinks again, alone. The only motion on the keys is the thumb's shadow breathing |
| Every key | a fine white calliper closes on the W cap, edge to edge |
| same | a second calliper closes on the E cap; the two are slid one under the other and are the same length to the pixel, an "=" between them. Lands on "same" |
| size. | callipers fold away |
| But if | the thumb starts down again |
| off, | it lands, and not on the E: the contact patch spreads over the strip between two caps, the white "+" at its centre. Lands on "off," |
| halfway | a single fine tick marks the middle of the strip between the W cap and the E cap; the "+" is sitting on it. Lands on "halfway" |
| the E and the W, | the E cap lights, then the W cap: on what the eye can see, it is a coin toss |
| the iPhone | the x-ray snaps on under the thumb: the "+" is not on any border. It is well inside the E's swollen cell, the W's crushed cell far off to its left |
| gives it to the | the E's cell catches it, gives, springs |
| E. | the E cap presses under the thumb and the field reads "what time". Lands on "E." |

Hands on: the thumb lifts. The x-ray stays on. The view eases back to SLAB, the field "what time" above the keys.

### 7. `again`, dark, 43.0-47.5 s
"Then you type the next letter and every zone changes again, for every single letter you type."

Real thing: every map this one message needed, laid out side by side. It multiplies: the single map becomes a sheet
of fifteen, one per character of "what time works", each a small amber keyboard about 180 px wide, each visibly
different because each is the measured map for what had been typed by then. The sheet is the subject; the keyboard
under it is where the copies come from. Five to a row, three rows, in the upper stage; SLAB keyboard below, x-ray on.

| Word | What changes |
|---|---|
| Then you type | the nine characters already in the field, w, h, a, t, the space, t, i, m, e, each drop a copy of the map the keyboard held when it was typed. They deal out from the field into the first two rows, its letter small under each. The one under "m" is the map just seen, E huge |
| next letter | the space bar presses. The live map under the keys re-forms, and a copy of it lifts off the keyboard and files in as the tenth |
| every zone | W presses, O presses: two more maps lift off and file in, each with a different cell swollen (after "wo": R, 59%) |
| changes again, | R presses: the thirteenth, K large (50%), L (29%), D (12%). Lands on "again," |
| for every | K presses: the fourteenth |
| single letter | S presses: the fifteenth. The field reads "what time works". Under the sheet, small grey: "15 characters, 15 maps". Lands on "single" |
| you type. | the send arrow presses. The fifteen fold back down into the keyboard as one and the amber relaxes to even. Ends on "type." |

Hands on: the phone pulls back to HAND and the message lands blue in the thread under hers, "what time works",
"Delivered" under it. The phone goes on shrinking to SIDE size (300 x 652), lower right, dimmed, the blue bubble
still readable.

### 8. `first`, dark, 47.8-61.1 s
"Apple built this into the very first iPhone, because a comfortable button needed 44 pixels and the whole screen was
only 320 pixels wide. Ken Kocienda, the engineer who made that keyboard, tells the story in his book, and Apple
later patented it."

Real things, three in a row, one on stage at a time, each leaving as the next arrives: the 2007 iPhone and the
arithmetic that forced the trick; the man and his book; the patent's own drawing. This is the reel's one turn and its
"show the why": the squares that do not fit are the cause, and the amber is what Apple did about it.
Sources: `refs/iphone-original-front-a-ccbysa2.jpg`, `refs/iphone-original-docked-ccbysa2.jpg`,
`refs/iphone-1st-gen-ccbysa4.svg` (the body), `refs/iphone-os-2008-keyboard-320x480.png` (a real 320 x 480
screenshot of that keyboard, the pixel reference), `people/ken-kocienda.jpg` (his own headshot, creativeselection.io),
`refs/creative-selection-cover.jpg`, `refs/patent-US8232973.pdf` (drawing sheet 9 of 16, which carries the real
header "U.S. Patent, Jul. 31, 2012, Sheet 9 of 16, US 8,232,973 B2"; the figure alone is
`refs/patent-figs/US08232973-20120731-D00009-12-9f-99.png`), `refs/patent-US8232973.txt`.
What fig. 8B really shows, checked on the sheet: "Go" in the input field, dotted outlines bigger than their keys
around A, D and O, a smaller one on K, a "+" on the left edge of the F key, and the label "Hidden hit regions".
The patent's text: D grows "because God is a common English word", so the "+" on F goes to D.

| Word | What changes |
|---|---|
| Apple built this | the 2007 iPhone rises into the centre with weight: aluminium back edge, black bezel, the round home button, its old light-grey keyboard on the glass. The amber leaves the small modern phone and crosses into it: the old keys have cells under them too, one swollen. Tag: "Illustrative" |
| first iPhone, | "2007" lands under it, small. Lands on "first" |
| because | the amber goes out. The old keyboard as people saw it |
| comfortable button | a finger-sized square outline arrives over the screen |
| 44 | a count inside it rolls to "44 px". Set on the Q key, it is plainly wider than the key. Lands on "44" |
| and the whole screen | a ruler draws across the top of the glass, left edge to right edge, while nine more 44 px squares line up beside the first, one per key of the top row, Q to P. The row runs off the right side of the phone |
| 320 | the ruler's count lands: "320 px". The last three squares hang over the bezel in the reel's one red, and the sum lands under the phone: "10 x 44 = 440". Lands on "320" |
| pixels wide. | all ten squares are crushed back inside the glass, each now a key wide and narrower than a finger. Under one of them the amber cell comes back and swells out to the size the square used to be: the room the key lost, given back where it cannot be seen. Ends on "wide." |
| Ken Kocienda, | the phone shrinks up and to the right, squares and amber gone. His portrait arrives large, name under it, then the line from his own book cover: "Principal Engineer of iPhone Software, Apple". Lands on "Kocienda," |
| made that keyboard, | a hairline runs from him to the keyboard on the small 2007 phone |
| book, | the phone leaves; the real cover of "Creative Selection" slides in beside him, "2018" under it. Lands on "book," |
| and Apple later | portrait and book leave upward. The patent's drawing sheet rises, real, white, alone on the stage, its header line readable: "U.S. Patent, Jul. 31, 2012, Sheet 9 of 16, US 8,232,973 B2". It scrolls Apple-smooth down to FIG. 8B |
| patented | the reel's amber fills the regions the drawing outlines: A, D and O bigger than their keys, K smaller. The patent's own words on a hairline: "Hidden hit regions". Lands on "patented" |
| it. | the drawing's own "+", sitting on the edge of the F key, is caught by the D's region; the D key lights and the field above goes from "Go" to "God". Ends on "it." Corner tag: "US Patent 8,232,973, fig. 8B. Colour added." |

Hands on: the amber leaves the patent's figure and travels down into the modern keyboard as it comes back; the sheet
goes with the handover.

### 9. `popup`, dark, 61.4-68.4 s
"And it comes with a second trick. Your thumb hides the key you're pressing, which is why the letter pops up above
your finger, so you can see what you actually hit."

Real things: the letter balloon (iOS calls it Character Preview) and the real switch that controls it.
Sources: `refs/ios-character-preview-on-off.png`, `refs/ios-settings-character-preview.png` (Settings, General,
Keyboard, "Character Preview"), `refs/apple-support-onscreen-keyboard-1.png`. MACRO on T, Y, U over G, H, J, x-ray
off: this trick is one the viewer can see, and has been seeing since `tim` without being told.

| Word | What changes |
|---|---|
| second trick. | the modern keyboard is back, MACRO, six caps, and the first trick's amber goes out under them. Lands on "second" |
| Your thumb | the real thumb comes down from the lower right over the H |
| hides | it lands. The H cap is gone under it, and half of G and J with it: from above, the viewer cannot tell what is being pressed. Lands on "hides" |
| the key you're pressing, | the thumb turns to glass for a beat: its outline only, the H cap pressed down under it, lit. Then it is skin again and the key is hidden again |
| pops up | the balloon grows out from under the thumb's tip, up through its narrow neck, and opens above the nail: a big "H" on it, the real shape. Lands on "pops" |
| above your finger, | a hairline label on it: "Character Preview" |
| so you can | the label slides down and becomes the real Settings row it is the name of, with its switch, on. The switch flips off: the balloon is gone, the thumb sits there, nothing to read |
| see | the switch flips back on: the "H" is back above the nail. Lands on "see" |
| what you actually hit. | the Settings row leaves. The thumb lifts, the balloon drops back into its key, and "h" lands in the text field. Ends on "hit." |

Hands on: the view eases back to the SLAB, face on, the field cleared, the thumb above it: the hook's frame. In the
thread above the field, under the blue "what time works", her answer has come in: "8?".

### 10. `close`, dark, 68.7-74.3 s
"So you're not that accurate with your thumbs. Your keyboard is quietly moving the target to where your thumb was
about to land."

Real thing: the first shot of the reel, resolved. SLAB, the real thumb, the field empty. The same three taps are
played twice: once as the eye saw them, once as the keyboard saw them. A new word and new keys (Y, O, U, on the right
of the top row), so nothing from `same` is shown again. The order inside the second pass is the point: the cell
moves first, the thumb comes after.

| Word | What changes |
|---|---|
| So you're not | x-ray off. The thumb taps three keys fast, Y, O, U, and each time it leaves its white "+" behind on the glass |
| accurate | a fine ring marks the true centre of each of the three caps. Not one "+" is inside its ring: the second sits on the strip between I and O, the third on the edge of the Y. Lands on "accurate" |
| with your thumbs. | the field reads "you" all the same |
| Your keyboard | time runs back: the three "+" lift off the glass, the field empties letter by letter. The x-ray comes on, the cells even. The first "+" comes back down on the Y, off centre, inside its cell |
| quietly | nothing has touched the glass yet for the second tap, and the O's cell is already swelling, out over the strip toward the I (after "y", O follows 76% of the time) |
| moving | the cell has finished moving. Only then does the second "+" come down, on the strip, and it is inside the amber. Lands on "moving" |
| the target | hairline label on the swollen cell: "the target" |
| to where your thumb | the map re-forms for the third tap: the U's cell swells out over the edge of the Y (after "yo", U follows 96% of the time) |
| about to land. | the thumb itself comes down for the third, slowly, onto the edge of the Y, and its "+" is dead centre of the U's cell. The field reads "you". Everything but that cell, the thumb and the word dims. Ends on "land." |

Hands on: the keyboard slides down and out with its amber going dark; his Instagram profile header is already
arriving from the top.

### 11. `cta`, dark, 74.6-77.8 s
"Follow me, and send this to the friend who blames autocorrect for everything."

Real things: his Instagram profile header (avatar `people/avatar-creator.png`, "your.handle", the Follow button,
mark `logos/si-instagram.svg`), the reel's share sheet, Sofia's direct messages. Redrawn at Instagram's geometry (the
last round's redraw is in `ps5-on-pc/scenes/LegalCtaIg.tsx`). The ask is performed by the same real thumb, and its
reward is shown. Three seconds, so four events and no more.

| Word | What changes |
|---|---|
| Follow | the thumb taps the blue Follow button, with a contact patch and a "+", dead centre this time. Lands on "Follow" |
| me, | the button turns to "Following" |
| send | the share sheet rises over the profile, Sofia's portrait first in its row; the thumb taps her and a tick lands on her portrait. Lands on "send" |
| to the friend | the sheet drops and her thread is there, this reel sitting in it as a sent card |
| autocorrect | her reply arrives under it: "ok so it was never autocorrect". Lands on "autocorrect" |
| for everything. | the frame holds and reads on its own if paused |

## What is fetched (`reels/iphone-keyboard/assets/`)

- `refs/ios-keyboard-dark-quicktype.jpg`, `ios-keyboard-light-quicktype.jpg`, `ios-keyboard-light-lowercase.jpg`:
  real iPhone screens with the system keyboard, 1179 x 2676 (Mobbin). Geometry reference, never shown.
- `refs/apple-support-onscreen-keyboard-1.png`, `-2.png`: Apple Support, "Type with the onscreen keyboard on iPhone".
- `refs/ios26-liquid-glass-mainframe.jpg`: iOS 26 surfaces, for the phone's chrome.
- `refs/ios-character-preview-on-off.png`, `refs/ios-settings-character-preview.png`: the letter balloon on and off,
  and its Settings row (iDownloadBlog).
- `refs/iphone-os-2008-keyboard-320x480.png`: a real 320 x 480 screenshot of the first keyboard.
  `refs/iphone-original-front-a-ccbysa2.jpg`, `iphone-original-docked-ccbysa2.jpg`, `iphone-2g-8gb-11-ccbysa3.jpg`,
  `iphone-original-2007-back-cc0.png`, `iphone-macworld-2007-ccbysa4.jpg`, `iphone-1st-gen-ccbysa4.svg`: the 2007
  iPhone (Wikimedia Commons, licence in each file name).
- `refs/commoncog-keyboard-1.png`, `-2.png`: Kocienda's early keyboard prototypes, as background only, not planned
  on screen.
- `refs/patent-US8232973.pdf` (31 pages), `patent-US8232973-p1.png`, `patent-US8232973.txt`, `refs/patent-figs/`
  (32 PNG, fig. 1 to 12; FIG. 8A to 8C are `US08232973-20120731-D00009-12-9f-99.png`): "Method, device, and
  graphical user interface providing word recommendations for text input", Kocienda et al., filed June 30, 2008,
  granted July 31, 2012 (Google Patents).
- `refs/creative-selection-cover.jpg`: the book's cover. `people/ken-kocienda.jpg` (creativeselection.io),
  `people/ken-kocienda-macmillan.jpg` (Macmillan author page).
- `refs/thumbs-typing-pexels-6669813.jpg`, `thumbs-typing-pexels-6669795.jpg`, `thumb-on-touchscreen-ccby2-intel.jpg`.
- `people/friend-sofia.jpg` (the synthetic face already used in lg-tv-spy), `people/avatar-creator.png`.
- `logos/si-apple.svg`, `si-ios.svg`, `si-instagram.svg`.
- `data/count_1w.txt`, `data/next-letter.json`: the word counts and the measured share of each next letter for every
  prefix of "what", "time" and "works". The prefixes "h", "he", "y", "yo", "what", "time" and "works" are not in the
  json yet: the builder who needs one counts it from `count_1w.txt` the same way (share of all uses of words that
  start with the prefix, by the letter that follows).

## Not on screen, on purpose

- No millimetre or point size for a key or a thumb: `facts.md` has none. "Smaller than your thumb" is shown by the
  contact patch covering five caps, which needs no number.
- No claim about passwords or about how today's iOS weighs the zones: `facts.md` marks both as not verified. The
  corner tags say what the amber map is and is not.
- No red spelling underline under "timw": iOS does not draw one while a word is still being typed. The find bar on
  the word list carries "is not".
- The zone never follows the thumb. In every scene it moves because of what was typed, and it has finished moving
  before the touch arrives (`grow`, `close`).
- No "32 px": the crushed squares show it, and the script gives two numbers only.
- "96%", "1%", "0%", "908,705,570", "0 of 333,333", "59%", "50%, 29%, 12%", "15 characters, 15 maps" are our
  own counts from the word list and the message, and are labelled as English word counts, never as Apple's numbers.
  The W after "tim" is 49,414 uses in 1.2 billion ("timwn", "timwi"), which rounds to 0%. "44", "320", "440" are the
  script's two numbers and their product.
