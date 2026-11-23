# The video, in one go

From an approved transcript to five finished renders, with no stop in between. In Claude Code this page is the saved
workflow `full-visual-reel` (`.claude/workflows/full-visual-reel.js`); any other agent runs the same stages itself,
starting one subagent per role where it can.

Inputs: the reel's `slug`, the approved transcript (`reels/<slug>/script.txt`, or the project's `transcript.md`), the
comment keyword when the close asks for one, and the workspace project folder when there is one.

Every agent reads `SKILL.md`, `taste.md` and the closest example in `examples.md` before its own page.

## 1. Words to sound (one agent)

1. `reels/<slug>/script.txt` is the transcript, word for word. It is approved: never rewrite it.
2. The voice, in one take (`voice.md`).
3. `caption.txt`: scenes split at sentence groups, the first scene id is `hook` and holds only the hook sentence
   (`engine.md`). `align.py`, then `check.py plan` until it exits 0.
4. `caption-post.txt`, the post caption: the hook, then what the viewer learns, then the ask.

## 2. The plan, then its critic (two agents)

**Plan.** `reels/<slug>/plan.md`. Once for the reel: the viewer's wrong picture, the one world and its scales, the
thread object, the one colour of the invisible, the grounds. Then per scene: its words, the real thing, where its
pictures come from, and `word -> what changes`. The hook gets one line ("five variants, built separately").
Fetch the real references for every scene now into `reels/<slug>/assets/refs/`: photos, teardowns, sections,
screens, logos, documents, footage. Be ultra creative and ultra illustrative: the viewer must come out understanding
the mechanism at expert depth.

**Critic** (a fresh agent). Read the plan against `taste.md`, sentence by sentence. Hunt: a main picture that repeats
an earlier one, a metaphor where a real thing exists, an idea told instead of shown working, more than one focus, a
cause the words give that the picture does not show, a thin first ten seconds, a scene with too few references.
Rewrite the plan in place, then list the body scenes with a component name each.

## 3. Scaffold (one agent)

A stub per scene and `HookX1` .. `HookX5`, `scenes/index.tsx` mapping every scene id (`hook` to `HookX1`), and the
five variant reels `reels/<slug>-h1` .. `-h5` (same voice, caption, words and `reel.json`; each index spreads the
base scenes and swaps the hook, `engine.md`). The type check passes and one still renders.

## 4. Build, all at once

Every body scene and all five hooks start together.

- **Each body scene:** a builder (`builder.md`, sections 1 to 5), then a reviewer with fresh eyes (`builder.md`,
  "Review"). When the reviewer returns notes, a fixer takes the builder's brief plus the notes and applies them.
- **The hooks:** one agent invents five hook concepts for this story, five genuinely different big moves on its real
  material, each landing on the hook's key word (`builder.md`, "The hook"). Then five builders, one per concept.

Many builders share one machine safely through the render queue and the type-check lock (`engine.md`), not by
building fewer at once. An agent without subagents builds the scenes one after another, with the same steps.

## 5. Deliver (one agent)

1. The type check passes.
2. Render `<slug>-h1` .. `-h5` one after another, run `check.py render` on each, fix what fails in the scene that owns
   it, re-render. Watch every hook-to-body handover in a burst at 1/60 s.
3. Pick the strongest hook against `taste.md` and say why in one line.
4. Deliver: with a workspace project, `workspace.md`; otherwise print the five full paths in `output/`.

No sound: the creator is asked once, after they have seen the picture.
