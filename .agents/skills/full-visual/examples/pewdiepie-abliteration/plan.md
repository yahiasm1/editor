# Visual plan, pewdiepie-abliteration v9 (the map)

approved: his words 2026-10-04: "redo the whole thing ... ultra creative and super illustrative, the same way we did
for distillation and for Hugging Face ... On the map, for example, we should see it if we reduce that direction".
And on v7: "I didn't get anything ... Token is like a huge map ... It shows a direction, and for everything that points
there, we need to delete it." "the position on the map is very weird and not good enough." "The explanation of each
layer is too much." "1:33 [the harmful/refuse lamps] is really bad." Liked in v7: the Heretic chart (1:25), the
server rack (1:47), the CTA (2:00).

Script: script.txt (v9, 442 words). Voice: voice.mp3, 127.4 s. Times below are the real word times (words.json).
Facts: facts.md. His feedback across distillation / HF / math-proof, with the rules: build/FEEDBACK.md (read it).

## Once for the reel

- **THE MAP is the continuous thing** (scenes `map` to `catch`, plus `alarm`). One 3D world: every request is a glowing
  point, the same points, the same colours and the same camera everywhere. Data + maths + camera: `scenes/map.ts`.
  Shared renderer: `scenes/MapSpace.tsx` (extend it in your own files; do not fork the data). The viewer must feel it
  is ONE map being explored, turned, measured, pressed flat and damaged, never a new diagram per sentence.
- **Each map scene still gets its own big new event** (his rule: a new real thing per sentence group). The map is the
  stage; the events are: requests flying in and landing, a request's 4,096 numbers becoming coordinates, the axes
  exploding then folding to three, clusters forming with real request cards, the map turning so refusing is "up",
  two hundred requests being thrown and marked, a hydraulic press / a pane of glass pressing the map flat, the math
  cluster cracking under too much pressure.
- **Points are requests, not abstract dots.** Every point was a real request: show some as small real chat bubbles
  (the text readable for normal requests: "Best carbonara recipe?", "Fix my Python loop", "Cheap flights to Rome?";
  refused requests are always a padlock + unreadable blur, never a readable harmful request) that shrink into their
  point as they land. Hero points keep a tiny bubble/emoji tag.
- **Continuity at handovers:** map scenes hand over IN PLACE (`MyScene.keep = true`, engine: Stage.tsx). The outgoing
  scene ends exactly on the `HAND.*` state in map.ts and the incoming one starts exactly on it. Overlays fade before
  the end and arrive after the start. Every other scene uses the normal lift-off.
- **Colours:** red `NO` (#FF3B30) is ONLY refusing (the refused cluster, the arrow, "no"). Amber is "harmful" (alarm).
  Cluster colours are in map.ts. Ground dark for the map and the model's inside; light for documents (Ajax page, HF,
  the CTA).
- **Real material:** PewDiePie's real thumbnail (public/pewdiepie-abliteration/pewdiepie-thumb.jpg), the real Ajax page
  (build/ref-ajax-page.jpg), real marks (parts.tsx `Logo`: qwenlm, openai, huggingface, github...), the real Hugging
  Face search (ref-hf-search), the real Heretic repo (ref-heretic), the real paper (ref-arxiv). Redrawn at real
  geometry, never a screenshot pasted flat.
- **Reuse what he liked in v7** (copies in `scenes-v7/`): Heretic repo + chart (`Heretic*.tsx`), the server rack +
  model-name display (`OpenRack.tsx`, `Open.tsx` "company/servers/check name" part), the CTA (`Cta*.tsx`). Improve,
  don't downgrade. Everything else from v7 is rejected material: do not reuse the notebook, piles, pen, lamps.

## Scene by scene (who builds it in brackets)

### hook, dark, 0.16-3.42 [5 hook builders, see build/HOOK-BRIEF.md]
"How did PewDiePie make an uncensored AI that never says no?"

### ajax, light, 3.62-12.10 [B1]
"This week, he announced Ajax, his own AI model that runs on your computer, and OpenAI banned him twice while he built
it. And I wanted to understand how you create one."
The news, as a launch film: his real thumbnail and the real Ajax mark/page (cream #F9F8F4, black serif). "Ajax" = the
mark assembling with weight; "computer" = it lands on a real laptop / his desk; "OpenAI" + "twice" = two bans hit
(real OpenAI mark, bare); "understand / create" = we open Ajax up: the mark comes apart to show there is a model inside
(this leads into `open`). Big, centred, deep motion, never a UI story.

### open, light, 12.30-21.74 [B1]
"The method is called abliteration. You take an open model, one whose weights anyone can download: the billions of
numbers it calculates with. Ajax started from Qwen, Alibaba's open model."
"abliteration" = the word forms (ablate + obliterate is a fact, FailSpy). "open model" / "download" = a real Hugging
Face model page (Qwen/Qwen3.5-9B) and its weight files actually downloading onto the machine (real file names and sizes
are in the v7 OpenFinder.tsx). "billions" = open one file: it is literally billions of numbers, a counter rolls to
9,000,000,000 while a wall of real-looking numbers scrolls. "Qwen" = the real Qwen mark; Ajax's mark is shown sitting
on top of it ("Ajax started from Qwen").

### numbers, dark, 21.94-28.98 [B2]
"Computers only work with numbers, so Qwen turns your request into a list of 4,096 numbers. Think of those numbers as
coordinates."
One real request typed into a chat box ("Best carbonara recipe?"). "request" = it is sent into the Qwen mark;
"4,096" = out comes a long list of numbers that unrolls and counts to 4,096 (show the first numbers, then the length).
"coordinates" = the first two numbers detach, glow, and become an (x, y) pair: this sets up the map.

### map, dark, 29.18-41.74 [B2]  (ends on HAND.empty, `keep`)
"On a normal map, two numbers give you a position: left-right and up-down. Here, 4,096 numbers give your request a
position on a map with 4,096 dimensions. Nobody can picture that, so let's shrink it to three, like a 3D model."
"map" = a real-looking map (top-down, real colours, streets/terrain); "left-right" / "up-down" = the two coordinates
slide along their axes and a pin drops exactly where they cross. "4,096 dimensions" = from the pin, axes explode out in
every direction, hundreds then thousands, a counter racing to 4,096, impossible to follow (this must feel overwhelming,
it is the "oh wow"). "picture" = it all strains; "three" = the axes collapse down to three coloured ones; "3D" = the
flat map tilts and becomes a 3D space you see in depth (grid floor, three axes), the pin is now ONE white point, "your
request". End on HAND.empty.

### clusters, dark, 41.96-50.42 [B3]  (starts HAND.empty, ends HAND.cloud, `keep`)
"On that map, similar requests land close together. Cooking questions end up in one area, coding questions in another,
and requests the model refuses gather in their own corner."
Requests rain in as real chat bubbles and land as points (the white point joins its cooking cluster). "Cooking" = the
cooking cluster lights, its bubbles readable; "coding" = the coding one; "refuses" + "corner" = the refused requests
(padlocked, blurred) gather in a red corner, the camera makes us feel how far it is. Travel/music/math clusters fill in
quietly. End on HAND.cloud (labels and bubbles gone).

### direction, dark, 50.62-60.20 [B3]  (starts HAND.cloud, ends HAND.turned, `keep`)
"And in 2024, researchers found that refusing is just one direction on that map. Turn the map so that direction points
up, and the higher a request lands, the more likely the model says no."
"2024" = the real paper lands briefly (arXiv 2406.11717 "Refusal in Language Models Is Mediated by a Single
Direction", ref-arxiv), then gives way. "direction" = a single straight line runs through the cloud from the normal
requests to the red corner, like a compass bearing. "up" = THE WHOLE MAP ROTATES (`turn` in map.ts) until that line
points straight up: the red corner is now on top. "higher" = a height ruler / altitude scale appears along it; one
request rises along it and its reply changes from an answer to "I can't help with that." on "no". End on HAND.turned.

### find, dark, 60.54-72.90 [B4]  (starts HAND.turned, ends HAND.arrow, `keep`)
"So how do you find that direction? You send the model hundreds of requests it refuses, and hundreds of normal ones,
and mark where each one lands. Then you find the middle of each group, and draw an arrow from one to the other. That
arrow is the refusal direction."
"hundreds" = a stream of hundreds of request bubbles thrown at the model; "refuses" = the padlocked ones land red,
"normal" = the rest land in their colours; "mark" = each landing leaves a marker pin. "middle" = each group pulls in
toward its centre and a centre marker drops with weight on each (computed by `middle()` in map.ts). "arrow" = the red
arrow DRAWS from the normal middle up to the refused middle. "refusal" = it locks, glows, labelled "refusal
direction". End on HAND.arrow.

### flatten, dark, 73.12-85.20 [B4]  (starts HAND.arrow, ends HAND.flat, `keep`)
"Then you change the weights, because they decide where each request lands. You edit them so every request stays at the
same height, like pressing the map flat. Everything else stays where it was, so the model keeps what it knows. It just
can't climb to "no" anymore."
"weights" = the weights appear as the machinery under the map (a real-looking matrix of numbers / the model's layers)
whose numbers decide where each point lands; "decide" = one request is routed by them to its spot. "same height" /
"flat" = a heavy pane of glass / hydraulic press comes down along the arrow and presses the whole map flat (`flatten`
s 0 -> 1): the red corner is squeezed down to the same height as everything else, the weight numbers visibly change.
"Everything else" = the clusters' left-right/forward-back positions don't move (show it: their footprints stay
identical). "climb" = a refused request tries to rise along the arrow and is stopped at the glass; its reply is now an
answer. End on HAND.flat.

### catch, dark, 85.42-96.58 [B5]  (starts HAND.flat, normal lift-off at the end)
"But here's the catch. That arrow isn't perfectly clean, so flatten it too hard and you damage other skills too. In one
study, math scores dropped by up to 18.8 points. That's what PewDiePie calls brain damage."
"clean" = zoom on the arrow: the math cluster sat partly along it (map.ts puts math a bit up the arrow on purpose).
"too hard" = the press pushes further; "damage" = the math cluster cracks, its points smear and scatter into the
others. "math" / "18.8" = a real-looking math test sheet (GSM8K style) gets red marks, a score drops by 18.8 points
landing on the word (study: arXiv 2512.13655, "up to"). "PewDiePie" + "brain damage" = his real photo and his quote,
the brain idea drawn as the damaged map (no stock MRI).

### heretic, dark, 96.80-106.22 [B5]
"That's why free tools like Heretic test the edit again and again, until they find the fewest refusals with the least
damage. Obviously, you shouldn't do anything illegal, but this is just a teaching video."
Reuse and improve the v7 Heretic scene he liked (repo card, 33.1k stars, then the tries landing on a refusals-vs-damage
chart until the best one, Gemma 3 12B: 97/100 -> 3/100, KL 0.16 vs 1.04 by hand). The disclaimer is a calm, clean
note, his words verbatim.

### alarm, dark, 106.42-115.18 [B6]
"And here's the strange part: the model still knows your request is harmful, because "harmful" is a different
direction, and it stays untouched. Like a smoke alarm with its siren unplugged."
Back on the map (draw it with MapSpace, flattened, CAM_UP): "knows" / "harmful" = a second, AMBER direction `H` lights
through the refused requests, pointing sideways; "different" = it is clearly not the red one (show the angle between);
"untouched" = the press/flat plane has no effect along it, the amber stays lit. "smoke alarm" = a real, beautifully
built smoke alarm (the v7 device was good) with its sensor light still blinking amber and its siren unplugged. NOT the
v7 two-lamp panel (rejected).

### servers, light, 115.40-123.14 [B6]
"So if your company runs an open model on its own servers, check the model's name, because over 8,000 models on Hugging
Face have "abliterated" in theirs."
Reuse and improve the v7 server rack he liked: the rack, the front display pulled out reading the model name with
"-abliterated" marked red on "name"; then the real Hugging Face search, the count rolling to 8,305 on "8,000",
"abliterated" lighting in every model name.

### cta, light, 123.34-126.64 [B6]
"And if you want more breakdowns like this, follow me, and share this video."
The v7 CTA he liked (profile, Follow, share sheet, Sent), with this reel's poster.
