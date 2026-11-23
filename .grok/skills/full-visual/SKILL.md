---
name: full-visual
description: "Make a full-screen animated explainer reel on any subject: the transcript first (researched, with three or four hook sentences to pick from), then the whole video in one go: voice, a word-by-word caption with one boxed key word per line, the real thing each sentence is about redrawn with care and moving on its word, five visual hooks, renders. No presenter, zero cuts, 1080x1920 at 60 fps. Use for '/full-visual' followed by what they want, 'make a full visual about X', 'make the video from transcript.md', or to edit or re-render a reel in engine/full-visual/reels/. NOT talking-head edits, NOT still slides."
---

# Full Visual

A voice explains; the screen is the explanation. A caption says each word as it is spoken, and under it the real
thing the sentence is about is drawn with care and changes on the word that changes it. Someone with the sound off
follows the whole argument. Someone who watched once can explain it to a friend.

## How a video is made

Two moments, and one approval between them.

1. **The transcript.** The creator says what they want, on any subject, in their own words ("/full-visual why your
   phone screen ignores a pen"). Research it (`references/research.md`), then write the transcript with the
   `full-visual-script` skill: three or four hook sentences on top with your pick, then the spoken words. Show it.
   The creator picks a hook and edits the words. **This is the only approval.** A transcript the creator brings is
   true and kept word for word.
2. **The video, the whole reel at once.** Once the words are approved nothing waits for anyone: voice, caption, the
   visual plan and its critic, every scene and five visual hooks built in parallel, each scene with its own reviewer,
   then checks and renders. The stages are `references/workflow.md`. In Claude Code run the saved workflow
   (`Workflow({ name: "full-visual-reel", args: { slug, keyword, date, project } })`); any other agent follows the
   same page with its own subagents, or one stage after another when it has none.

Never build a first passage and wait, never ask for the plan to be approved, never stop after the hook. The creator
next sees a finished reel with five hooks.

When the prompt names a project in `workspace/projects/`, read `references/workspace.md` first and follow it.

## Read before you start

Reading is the job, not a formality: these pages and the reels they point at are what makes the result good.

- `references/taste.md`: the bar, in the words of the creator who built this format. Everyone reads it.
- `references/examples.md`: four finished reels in `examples/`. Open the one closest to the subject: its
  `script.txt`, `plan.md`, `stills/` and the code of two of its scenes.
- Your role's page: the words `full-visual-script`; the voice `references/voice.md`; a scene or a hook
  `references/builder.md`; the engine and its commands `references/engine.md`.
- The creator's saved choices, when they exist: `workspace/library/full-visual.preferences.md` and
  `workspace/library/full-visual/profile.json` (written by `/full-visual-customization`). They dress the format: the
  caption look, the ground, the voice, the words. They never change its method.

## What never changes

1. No presenter, no character, no music. The voice is the only clock.
2. Three bands on one centre axis: caption y 300-500, stage y 520-1450, the last 220 px left to Instagram.
3. The caption is one word per spoken word, and a word not yet said does not exist. One key word per block, boxed.
4. A scene hands over only in a silence between sentences, as one move, and the ground is never bare.
5. Real things only: redrawn from real photos and screens at their real geometry and copy, or real footage when the
   thing is footage (gameplay, a launch). Never a metaphor where a real thing exists, never a stock icon.
6. A number is never static: it counts, rolls or fills, and lands on its word.
7. A change of state happens to the object already on screen. It recolours, opens, breaks, grows. It is not replaced.

What a reel may change lives in `src/theme.ts` and its `reel.json`: fonts, grounds, the marker, role colours, the
handover verb, the pinned chrome.

## Where things are

The engine is `engine/full-visual/`; every command runs from there (`references/engine.md`). One reel is one folder,
`reels/<slug>/`, and registers itself. Its five hook variants are `reels/<slug>-h1` .. `-h5`, each sharing the body's
voice and scenes and swapping only the hook. Renders land in `output/`; finished videos go to
`workspace/output/<project folder>/` when the reel belongs to a workspace project.

## After the first cut

The first cut is not always the one. The creator says what they want in plain words, the way they would to an editor:
"hook three, more real", "the scene at forty seconds, more detail, more motion", "be more creative", "more
illustrative". For each note:

1. Find what it points at: a hook variant, a moment (seconds map to a scene through `words.json`), or the whole reel.
2. Reopen only that scene or hook, with `references/builder.md` and the note: look at the real thing again, dig for
   more references, then the richer pass, going further than the note asks. Everything else stays untouched.
3. A reviewer with fresh eyes checks it against the note and `taste.md`.
4. Render again only the videos that contain it, run the checks, and deliver them in place of the old ones.

A note about one video stays in that video. A note that would hold for every video ("always more motion") is saved
in `workspace/library/full-visual.preferences.md` too.

Sound is asked once, after the creator has seen the picture: sound or none.
