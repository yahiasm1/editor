# Working from the workspace

The workspace app makes a video in three steps and gives the creator a prompt for each. Each prompt names the video's
project folder. Follow this page whenever a prompt names a project in `workspace/projects/`.

## One video, one folder

- One video is one folder: `workspace/projects/<YYYY-MM-DD>-full-visual-<slug>/`, holding
  `project.json`: `{"format":"full-visual","title":"<the subject>"}`.
- The folder name is the video's name everywhere: in `workspace/projects/` and in `workspace/output/`.
- Never write to `~/Downloads`.

## Step 1: Research

- Create the folder and `project.json` if they are missing.
- Research the subject the creator gave (`research.md` in this skill's references): save `research.md` and
  `facts.md` in the folder, every fact with its link, checked today.

## Step 2: Transcript (`/full-visual-script`)

- Read `research.md` and `facts.md` from the folder.
- Save the three or four hook options with your pick as `hooks.md`, and the spoken words, starting with the picked
  hook, as `transcript.md`. Only the spoken words go in `transcript.md`: no notes, no headings, no word count.
- Show both in chat. The creator may pick another hook or edit the words; update `transcript.md` to match.
- A transcript the creator pasted is saved word for word as `transcript.md`. Do not rewrite it; only point out facts
  that look wrong.

## Step 3: Video (`/full-visual`)

- Check for a voice key first: `ELEVENLABS_API_KEY`, `OPENAI_API_KEY` or `FISH_API_KEY` in `.env.local` at the
  folder root. With none, stop and tell the creator to add one on the video's page in the workspace, then run the
  step again.
- Make the reel in `engine/full-visual/reels/<slug>/`: copy `transcript.md` to its `script.txt` word for word, and
  the project's `facts.md` beside it.
- Run the whole video in one go (`workflow.md`). In Claude Code:
  `Workflow({ name: "full-visual-reel", args: { slug, keyword, date, project: "<the folder name>" } })`.
- Deliver to `workspace/output/<the same folder name>/`:
  - `<slug>-h1.mp4` .. `<slug>-h5.mp4`, the five hooks;
  - `caption.txt`, the post caption;
  - `cover.jpg`, one strong frame from the video;
  - `<slug>.mp4`, a copy of the strongest hook, written last, after every check passed. The app marks the video done
    when it exists.
- Print the full paths.
