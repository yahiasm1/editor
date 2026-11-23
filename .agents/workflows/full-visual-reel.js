export const meta = {
  name: 'full-visual-reel',
  description: 'The whole Full Visual video from an approved transcript: voice, caption, plan and critic, every scene and five hooks built in parallel with reviewers, renders',
  whenToUse: 'Run by the full-visual skill once the creator approved the transcript, with {slug, keyword, date, project}',
  phases: [
    { title: 'Sound', detail: 'script, voice, caption' },
    { title: 'Plan', detail: 'visual plan with real references, then a critic' },
    { title: 'Scaffold', detail: 'stubs and the five hook variants' },
    { title: 'Build', detail: 'every scene and five hooks at once: builder, reviewer, fixer' },
    { title: 'Deliver', detail: 'five renders, checks, delivery' },
  ],
}

// Every path is from the Keyframes folder's root, where the session runs.
const A = args || {}
const SLUG = A.slug
const FV = 'engine/full-visual'
const REEL = `${FV}/reels/${SLUG}`
const SK = '.agents/skills/full-visual'
const PROJECT = A.project ? `workspace/projects/${A.project}` : ''

const BASE = `You are making one Full Visual reel. Reel folder: ${REEL}. Engine: ${FV} (run its commands from there).
Read first, in full: ${SK}/SKILL.md, ${SK}/references/taste.md (the bar) and ${SK}/references/examples.md, then open the
example reel closest to this subject. Your role's page is named below; read it before you start.${A.direction ? `
The creator's direction for this reel: ${A.direction}` : ''}`

// 1. Words to sound
phase('Sound')
await agent(`${BASE} Your page: ${SK}/references/voice.md and ${SK}/references/engine.md.

1. Create ${REEL}/. ${PROJECT ? `Copy ${PROJECT}/transcript.md to script.txt word for word, and ${PROJECT}/facts.md beside it when it exists.` : 'script.txt is already there.'}
   The transcript is approved: never rewrite or re-check it.
2. The voice, in one take, per voice.md (if voice.mp3 and voice.alignment.json already exist, keep them). Then the
   pace: tighten.py with the 0.30 s paragraph breaths and the 0.2 s cap, 3.3 to 3.5 words a second.
3. caption.txt per engine.md: scenes split at sentence groups, the first scene id is "hook" and holds only the hook
   sentence. Run align.py, then check.py plan until it exits 0.
4. caption-post.txt: the post caption.${A.keyword ? ` It opens with Comment "${A.keyword}" and I'll send you ...` : ''}
Return the voice length and the scene ids.`, { label: 'voice + caption', phase: 'Sound' })

// 2. Plan, then critic
phase('Plan')
const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    world: { type: 'string' },
    scenes: { type: 'array', items: { type: 'object', properties: {
      id: { type: 'string' }, component: { type: 'string' }, words: { type: 'string' }, picture: { type: 'string' },
    }, required: ['id', 'component', 'words', 'picture'] } },
  },
  required: ['world', 'scenes'],
}
await agent(`${BASE} Your page: ${SK}/references/workflow.md, "The plan".

Write ${REEL}/plan.md from caption.txt, script.txt and facts.md. Once for the reel: the viewer's wrong picture, the one
world and its scales, the thread object, the one colour of the invisible, the grounds. Then per scene: its words, the
real thing, where its pictures come from, and word -> what changes. The hook gets one line ("five variants, built
separately"). Fetch the real references for every scene into ${REEL}/assets/refs/ now: product photos, teardowns,
sections, the real interfaces, logos, documents, footage, named by what they show. Be ultra creative and ultra
illustrative: the viewer must come out understanding the mechanism at expert depth.`, { label: 'plan', phase: 'Plan' })

const plan = await agent(`${BASE} Your page: ${SK}/references/workflow.md, "Critic".

You are the critic. Read ${REEL}/plan.md against taste.md, sentence by sentence, and look at its references. Hunt: a
main picture that repeats an earlier one, a metaphor where a real thing exists, an idea told instead of shown working,
more than one focus, a cause the words give that the picture does not show, a thin first ten seconds, a scene with too
few real references (fetch more). Rewrite plan.md in place to fix every one. Then return the body scenes (skip "hook")
with a PascalCase component name each, and the reel's world in one line.`, { label: 'plan critic', phase: 'Plan', schema: PLAN_SCHEMA })

const scenes = plan.scenes.filter(s => s.id !== 'hook')
log(`${scenes.length} body scenes + 5 hooks`)

// 3. Scaffold
phase('Scaffold')
await agent(`${BASE} Your page: ${SK}/references/engine.md.

Scaffold only, no design. In ${REEL}/scenes/: one stub per scene (${scenes.map(s => `${s.id} -> ${s.component}.tsx`).join(', ')})
and HookX1.tsx .. HookX5.tsx, each exporting a component that renders nothing; index.tsx maps every scene id, "hook" ->
HookX1. Create ${FV}/reels/${SLUG}-h1 .. -h5 as engine.md says (same caption.txt, words.json, reel.json and voice;
each scenes/index.tsx spreads the base scenes and swaps hook for HookXn). Create
${FV}/public/${SLUG}/. The type check passes and one still renders.`, { label: 'scaffold', phase: 'Scaffold', effort: 'low' })

// 4. Build: every body scene and the five hooks at once
phase('Build')
const SHARED = `Other agents build other scenes at the same time: follow ${SK}/references/builder.md, "Working beside
other builders", and ${SK}/references/engine.md, "Many builders at once".`

// How many agents build at once. The render queue and the type-check lock keep the machine safe, so the default lets
// every scene and every hook start together; pass a smaller slots on a small machine.
const SLOTS = Math.max(1, Number(A.slots ?? scenes.length + 5))
let running = 0
const waiting = []
const slot = async (fn) => {
  while (running >= SLOTS) await new Promise((r) => waiting.push(r))
  running++
  try { return await fn() } finally { running--; waiting.shift()?.() }
}

const REVIEW = { type: 'object', properties: { pass: { type: 'boolean' }, notes: { type: 'string' } }, required: ['pass', 'notes'] }

const buildScene = (s) => slot(async () => {
  const brief = `${BASE} Your page: ${SK}/references/builder.md (all of it) and ${SK}/references/engine.md.

You build the scene "${s.id}" in ${REEL}/scenes/${s.component}.tsx (helpers prefixed ${s.component}). Its words: ${s.words}
The plan for it is in plan.md; the picture: ${s.picture}. The reel's world: ${plan.world}.
Follow builder.md in order: look at the real thing first (open every reference at full size, dig for more, write what
you see in ${REEL}/notes/${s.component}.md), think before you build, build, compare side by side, then the richer pass.
${SHARED}`
  await agent(brief, { label: `build ${s.id}`, phase: 'Build' })
  const r = await agent(`${BASE} Your page: ${SK}/references/builder.md, "Review, with fresh eyes".

Review the scene "${s.id}" (${REEL}/scenes/${s.component}.tsx), which you did not build. Its notes are in
${REEL}/notes/${s.component}.md and its references in ${REEL}/assets/refs/. Render stills every ~0.4 s across it and
read each at full size beside the references. Fix small things yourself. Return pass, or notes the builder can act on.
${SHARED}`, { label: `review ${s.id}`, phase: 'Build', schema: REVIEW })
  if (r.pass) return true
  await agent(`${brief}

A reviewer with fresh eyes sent these notes on your scene. Apply every one, then compare side by side again:
${r.notes}`, { label: `fix ${s.id}`, phase: 'Build' })
  return true
})

const CONCEPTS = { type: 'object', properties: { concepts: { type: 'array', minItems: 5, maxItems: 5, items: {
  type: 'object', properties: { title: { type: 'string' }, move: { type: 'string' } }, required: ['title', 'move'] } } },
  required: ['concepts'] }

const hooks = (async () => {
  const c = await agent(`${BASE} Your page: ${SK}/references/builder.md, "The hook".

The hook is the first scene of ${REEL}/caption.txt, the first three to four seconds. Study ${SK}/examples/ps5-on-pc/code/HookVC*
(the bar), ${SK}/examples/touchscreen/code/HookX1* and ${SK}/examples/iphone-keyboard/code/HookX1*, with their stills. Decode the hook sentence
word by word (word, real thing, verb done to the hero). Then invent five hook concepts for THIS story, each a
different big physical move on its real material, each landing on the hook's key word. Five genuinely different
ideas, not five versions of one.`, { label: 'hook concepts', phase: 'Build', schema: CONCEPTS })
  return Promise.all(c.concepts.map((k, i) => slot(() => agent(`${BASE} Your page: ${SK}/references/builder.md (all of it, "The hook" first).

You build hook variant ${i + 1} of 5: "${k.title}". The move: ${k.move}
Write ${REEL}/scenes/HookX${i + 1}.tsx (helpers prefixed HookX${i + 1}). It covers only the "hook" scene and hands over
cleanly into the next scene. Look at the real thing first, write your word table in ${REEL}/notes/HookX${i + 1}.md,
build, compare, then the richer pass. Render stills of ${SLUG}-h${i + 1} every ~0.25 s over the hook and read them at
full size; fix until it is the best hook you have seen. ${SHARED}`, { label: `hook ${i + 1}`, phase: 'Build' }).then(() => true))))
})()

const settled = (p) => p.catch((e) => { log(`failed: ${e && e.message}`); return false })
const [bodyDone, hooksDone] = await Promise.all([Promise.all(scenes.map((s) => settled(buildScene(s)))), settled(hooks)])
log(`body: ${bodyDone.filter(Boolean).length}/${scenes.length}, hooks: ${Array.isArray(hooksDone) ? hooksDone.length : 0}/5`)

// 5. Deliver
phase('Deliver')
return await agent(`${BASE} Your page: ${SK}/references/workflow.md, "Deliver"${PROJECT ? `, and ${SK}/references/workspace.md` : ''}.

From ${FV}: the type check passes. Render ${SLUG}-h1 .. ${SLUG}-h5 one after another, never at once. Run check.py
render on each and fix what fails in the scene that owns it, then re-render. Watch every hook-to-body handover in a
burst of stills at 1/60 s. Stop and say so if the disk has under 2 GB free. Pick the strongest hook against taste.md.
${PROJECT
  ? `Deliver to workspace/output/${A.project}/: ${SLUG}-h1.mp4 .. ${SLUG}-h5.mp4, caption.txt (from caption-post.txt), cover.jpg (one strong frame), and last, once every check passed, ${SLUG}.mp4 as a copy of the strongest hook.`
  : 'Leave the renders in output/.'}
No sound: the creator is asked once, after seeing the picture. Return the full paths, each video's length, the
strongest hook and why in one line, and anything you could not fix.`, { label: 'render + deliver', phase: 'Deliver' })
