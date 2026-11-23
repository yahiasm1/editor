---
name: full-visual-script
description: "Write the transcript of a full-visual explainer reel on any subject, before anything is built: three or four hook sentences to pick from (each made to stop the scroll), your pick and why, then the spoken words: the answer given early, one lived scene, the mechanism explained deep but ultra simple, a second layer, a close that echoes the first sentence, and something the viewer can save or send. Also cleans up a transcript the creator brings, word for word. Use for '/full-visual-script', 'write the transcript', 'give me hooks', a rewrite, or the first half of '/full-visual' on a subject. NOT the build (voice, caption, scenes, render: the full-visual skill)."
---

# The transcript

The transcript is the reel. It is written first, before any pixel, and it is the one thing the creator approves.
People save and send what taught them something real, so every reel leaves the viewer understanding a thing they use
or a story they heard, deeply enough to explain it to a friend.

Read the four finished transcripts before writing: `.agents/skills/full-visual/examples/{touchscreen,iphone-keyboard,ps5-on-pc,pewdiepie-abliteration}/script.txt`,
the one closest to the subject first. Copy their thinking, never their words. Then `references/hooks.md` and
`references/shapes.md`.

## 1. The creator's words come first

When the creator brings a transcript, it is true and it is the structure: keep their hook and their order, make it
flow and make it clear, never swap in a template, never cut their explanations to hit a length. Only point out facts
that look wrong. When they bring only a subject, research it (`full-visual/references/research.md`) and write.

## 2. Find the wrong picture

Before a line, say the viewer's wrong picture in five words: "the screen feels me press", "the keys are the size I
see", "an emulator just runs the game". The transcript exists to break it. When a subject has no wrong picture, find
the question everyone has heard and nobody can answer ("How did PewDiePie make an uncensored AI?").

## 3. Three or four hooks

The hook decides whether anyone hears the rest. Write three or four genuinely different ones, each the first one or
two sentences exactly as spoken, then pick one and say why in a line. `references/hooks.md` holds the kinds that
worked and our real lines.

- The thing is named in the first three words, in plain words people already use.
- It stops the scroll: something that looks impossible, a belief turned over, news big enough to stop for, or a
  question people already have. A contradiction often does it; it is not the only way.
- One idea, never two. Absolute and concrete over soft and vague. True, every word.
- It can be drawn: the hook's picture is decoded word by word later, so each noun should be a real thing.

## 4. The body

Pick the shape the subject asks for (`references/shapes.md`). Whatever the shape:

- **Give the answer away early**, by second 8 to 10: "it isn't really X, it's Y". The strange new phrase is the next
  question, so nothing is lost.
- **One lived scene** carries the mechanism: "Imagine it's winter and you're trying to answer a call with your gloves
  on." It comes back so the viewer never loses where they are.
- **Go deep, stay simple.** The real terms, each grounded from zero the first time with something familiar. One
  physical event per sentence, each caused by the last. Why before how. Every setup paid off.
- **One picture held all the way.** Put every new idea on the same picture (the grid, the map). Switching metaphors
  every sentence loses people.
- **A second layer**: "But your glove doesn't conduct anything", the case where it fails or the trick on top, which
  proves the mechanism. Then "That's also why..." pays it off in the viewer's own life.
- **The close echoes the first sentence**, resolved: "So your screen never felt your finger."
- **Something to save or send**, woven in: a check they can run, a setting, a tool, a fix, or the understanding
  itself. The ask names who to send it to: "send this to someone whose phone never works with wet hands." It asks for
  the share before the follow, or for `comment "KEYWORD"` when there is a real thing to send.

## 5. Spoken, not written

It sounds like a person talking to a friend. Whole sentences that flow with commas, "you" and "your" often. Glue is
good when it voices the viewer's question ("So how is that possible?") or carries a fact; it is bad when it only
announces ("here's the thing"). No "step one, step two", no fragments for rhythm, no em dashes.

About 280 words in 18 to 20 sentences lands near 80 to 85 s at the house pace (3.3 to 3.5 words a second); a story
that needs more gets more. Clarity wins over the count.

## 6. Facts

Every claim is a row in `facts.md` (claim, a verbatim quote, the URL, checked today). Keep scope words ("up to", "on
supported iPhones"). Never invent a number, a tool or a capability; cut what cannot be confirmed and say so.

## Output

Show it whole in chat, in this order: the wrong picture, the hooks with your pick and why, the transcript, then one
line naming what the viewer saves or sends. Save it in the project folder when there is one (`hooks.md`,
`transcript.md`, `facts.md`, per `full-visual/references/workspace.md`), otherwise as
`engine/full-visual/reels/<slug>/script.txt` beside `facts.md`. The creator picks a hook and edits the words; once
they approve, the full-visual skill makes the whole video with no further stop.

## Before showing it, read it as a viewer

1. Would someone who never thought about this stop on the first sentence?
2. After the reel, could they explain the mechanism to a friend?
3. Is there a word where they would think "wait, what's that?" Ground it.
4. What do they save or send, and to whom?
5. Read it aloud: does every sentence follow from the last?
