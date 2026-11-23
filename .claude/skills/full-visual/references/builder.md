# Building a scene

You build one scene (or one hook) of a reel, as a senior motion designer would. The bar is `taste.md`; read it first.

The note that comes back after almost every first try is the same: not real enough, not detailed enough, not enough
attention, not in depth. A first try that skips the looking and the thinking below gets that note. This page is the
work that makes the first try the good one. Take the time it needs.

## 1. Look at the real thing first

Before a line of code, find what the thing really looks like.

- Start from what the plan already fetched into `reels/<slug>/assets/refs/`, then dig further for your own scene:
  product photos, teardowns (iFixit), cross-sections and diagrams, patents, the real interface's screenshots, the
  company's own pages, real footage. Save each one there, named by what it shows (`ifixit-iphone-13-screen.jpg`).
- Open every reference at full size and really look. Then write down what you see, in a few plain lines at the top of
  `reels/<slug>/notes/<Component>.md`: the parts and how many, the materials, the labels and type, the light and
  where it comes from, the scale, how it moves in real life, the detail that would give a fake away.

The touchscreen reel shows how far this goes: its screen section was read off two teardown photos (glass, touch layer, OLED,
frame, in that order), its grid off real sensor diamond patterns, its fingertip off a macro photo of skin
ridges, its glove off a photo of conductive yarn. Read `examples/touchscreen/plan.md` and its `code/WireGrid*`.

## 2. Think before you build

In the same notes file, before code:

- **the real thing** this scene shows, and which reference each part comes from;
- **every detail that makes it real**: the ones a viewer would miss only if they were gone;
- **word, then change**: for each key word of your sentences, what happens on screen ("lands on" for an event,
  "ends on" for a build);
- **the sound-off test**: what a stranger understands from the pictures alone, and why.

If the scene could be any other reel's scene, think again. It should only belong to this story.

## 3. Build

- **Draw from the references**, at their geometry and copy, in layers: foreground, subject, depth. Light, shadow,
  texture, reflections, wear, real part counts, real labels. Where the real thing is made of thousands of small parts
  (pixels, wires, people, requests), draw thousands.
- **Make the mechanism work on the words.** Something meaningful changes on nearly every key word; nothing holds still
  for more than about a second. Use `cue()` and `endsOn()` (`engine.md`), never typed seconds.
- **Spatial things get a world.** A section, a map, a city, a chip stack: build a small 3D world with one camera,
  real projection and light, on a canvas (`examples/pewdiepie-abliteration/code/map.ts` and `MapSpace.tsx` are a
  whole explanation carried by one 3D map), or with three.js (`@remotion/three`, `three` and `@react-three/fiber`
  are installed; render with `--gl angle`). 3D serves a real thing seen in depth or a camera flowing through one
  world. It never replaces the real thing with a set.
- **Real footage when the thing is footage.** Gameplay, a launch, a demo: cut the real clip (H.264, `-g 1`, muted)
  and put it in its real frame, with a small source line.
- Keep everything inside your own files (`<Component>*.tsx`, helpers prefixed with your component's name).

## 4. Compare, side by side

Render stills across your scene (`engine.md`, all in one call) and read each at full size. Put it next to your
references and next to a still of the closest example scene (`examples.md`), and ask:

- Is mine as detailed as the photo? Would the person who owns this thing recognise it?
- Is it as alive as the example? Does something change on every key word?
- Can I follow the idea with the sound off?

If any answer is no, it is not done.

## 5. The richer pass

Once it works, do one more pass on purpose: more real detail, more happening, more depth, more attention to the small
things (a reflection, a label, a cable, a second motion behind the first). This is the pass the creator would
otherwise ask for. Keep the words, the cues and the handovers exactly as they are.

## The hook

You build one of five hook variants. Each is a different idea, not a version of another.

- **Decode the sentence first.** Write a table in your notes: each word of the hook, the real thing it names, the verb
  done to the hero. Then build the table as one continuous transformation on one hero.
- Frame 0 is the whole scene, already alive. The mechanism plays once inside the first second. Something new every
  0.2 to 0.4 s. One big physical move with weight on the key word, then the payoff holds.
- It hands over cleanly into the next scene. Check that handover in a burst of stills at 1/60 s.
- Study `examples/ps5-on-pc/code/HookVC*` (the bar), then `examples/touchscreen/code/HookX1*` and
  `examples/iphone-keyboard/code/HookX1*`, with each example's first stills.

## Review, with fresh eyes

When you review a scene you did not build:

1. Read the plan for it and open its references.
2. Render stills every ~0.4 s across it and read each at full size next to the references.
3. Judge it the way the creator would on a first viewing. Their recurring first-round notes are your checklist: "it
   should be more real", "more details", "not as detailed as I want", "lacks creativity", "doesn't really explain",
   "not much happening", "looks too AI", "fake games, take actual videos", "looks vibe coded".
4. Fix small things yourself: a handover glitch, unreadable type, a frame where nothing moves.
5. Return **pass**, or concrete notes for the builder: what, where, and what the real thing looks like instead.

## Working beside other builders

Other agents write other scenes at the same time. You own only your files. If a check fails because of a file you do
not own, wait a minute and retry; never edit it. Renders queue themselves; ask for all your stills in one call, never
run a render or the type check in the background, and take turns on the type check (`engine.md`, "Many builders at
once"). Delete your old stills when you are done with them.

Return: what you looked at, what you built (by cue word), the stills you checked.
