# The voice

The voice carries the video. It must sound alive, with emotion that follows each sentence, and fast. A flat, slow or
"AI-sounding" take ruins a good picture. The reference is the touchscreen reel's take: about 3.3 words a second, alive, tags in
`examples/touchscreen/script.v3.txt`.

## Which voice

- **A voice the creator saved wins** (`workspace/library/full-visual.preferences.md`, `full-visual/profile.json`).
- **Otherwise, with an ElevenLabs key, the house voice**: copy the `"voice"` block of `examples/touchscreen/reel.json`
  (Snap, `gWaDC0oXAheKoZfljzuI`, `eleven_v3`, stability 0.5, similarity 0.8, style 0). Never
  `eleven_multilingual_v2` here: it has no emotion. If the account cannot use a library voice, say so and use one of
  the creator's own with the same model and tags.
- **OpenAI or Fish Audio**: no tags; pick a lively, fast voice and run
  `node scripts/narrate.mjs --root ../.. --config reels/<slug>/voice.json --text-file reels/<slug>/script.txt --out reels/<slug>/voice.mp3`.
  `align.py` times it by speech recognition. Say once that ElevenLabs gives the best result for this format.
- No key at all: stop and ask for one.

## One take

- `script.v3.txt` is `script.txt` with one light tag at the start of each paragraph, chosen by what the paragraph
  does: `[curious]` on a question, `[emphasized]` on the answer and the close, `[quickly]` on a lived scene or news,
  `[impressed]` on a payoff, `[matter-of-fact]` for the one long mechanism paragraph at most. Copy
  `examples/touchscreen/script.v3.txt` and `examples/iphone-keyboard/script.v3.txt`. Slow tags on many paragraphs make a
  slow take.
- Numbers and money in words in `script.v3.txt` ("forty-four pixels", "one million dollars"); v3 swallows digits. The
  caption keeps the digits.
- The hook is plain and curious, its last word falling. When a question rises at its end, end it with a full stop in
  `script.v3.txt` only.
- Say the cost before spending: characters of `script.v3.txt`, and the balance left on the account.
- One whole take (`voice.py`), never spliced or patched. Keep it unless it has a named defect (a dropped or
  swallowed word, a hook that sounds wrong, a pace far off). Three full takes at most without asking.

## Pace: the one rule

3.3 to 3.5 words a second, with a 0.30 s breath at the start of each paragraph and every other pause capped at 0.2 s:

```bash
node ../../scripts/py.mjs scripts/tighten.py <slug> --cap 0.2 --keep "<each paragraph's first words>:0.30,..."
```

The hook paragraph is never cut, nor a gap next to a number. `check.py plan` measures the pace and fails outside 3.3
to 3.5.

- If the take is still slow, speed up the raw take first: one uniform `atempo` on the whole of `voice.raw.mp3`, scale
  the alignment times by the same factor, then tighten. Never speed up only a part.
- `tighten.py` restarts from `voice.raw.mp3` when it exists: after a new take, move the old raw files aside first.
- The pace comes from the script as much as the take: whole sentences joined with commas, fewer full stops.

Five hooks that differ only in picture share this one take.
