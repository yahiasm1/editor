# Full Visual

## Goal

Turn anything a creator wants to explain into a full-screen animated explainer reel: a voice, a caption that says each
word as it is spoken with one key word boxed per line, and under it the real thing each sentence is about, drawn with
care and moving on the word. No presenter, zero cuts, 1080x1920 at 60 fps, five hooks.

## Reasoning

The seller's biggest reels were made the same way every time: the transcript first, approved in words, then the whole
video at once by many agents, each scene drawn from real photos of the real thing and reviewed by fresh eyes, with five
hooks built side by side. This pack ships that process, the bar it was built to, and four of those reels as worked
examples. The first version shipped the older method (a plan approved, then one passage first, then one builder at a
time), which produced thinner first results.

## Pattern

- `/full-visual <what I want>`: research, then the transcript with three or four hook sentences
  (`full-visual-script`). The creator picks a hook and edits the words: the only approval.
- Then the video in one go (`references/workflow.md`; in Claude Code the saved workflow `full-visual-reel`): voice,
  caption, plan and critic, every scene and five hooks in parallel, each scene with a reviewer, renders.
- The workspace app runs the same as three steps (research, transcript, video) on one project folder
  (`references/workspace.md`).
- The engine lives at `engine/full-visual/`. Reels are folders in `engine/full-visual/reels/` and register themselves.
  An update replaces the engine and keeps every reel, asset and render the buyer made (`provides.keep`).
- `/full-visual-customization` is optional: it saves the creator's caption look, ground, voice and words.

## Output

Five 1080x1920, 60 fps, H.264 renders (one per hook), the post caption and a cover. Voice only. Sound is asked once,
after the picture.

## Limits

English captions only. No character or presenter ships. Many agents at once need a machine with room: renders queue
themselves and the type check takes turns, and `slots` lowers how many agents build together.

## Counter-examples

Building one passage first and waiting. Asking for the plan to be approved. One builder after another when subagents
exist. A scene drawn from memory instead of real photos. Shipping the seller's face, voice clone or character.
