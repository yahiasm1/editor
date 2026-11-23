# Visual plan, ps5-on-pc ("GTA 5, Spider-Man, Silent Hill 2.")

approved: (waiting)

English replica of DeNZt-_Nlmu (decode: the decode of the French source, chapter table = what is
shown on each sentence). Script: `script.txt`, his transcript, taken as true. Times below are from `words.json`
(104.7 s, 376 words, 3.59 w/s after the uniform atempo). Read the right-hand columns alone: they retell the script.
"lands on" = one event on the word, "ends on" = a build that finishes on it.

Every real thing named here is already in `refs/` (index at the bottom). Nothing is drawn from memory.

## Once for the reel

- **Cadence (the replica's law).** Something new lands on almost every key word, about once a second. Only ONE stage
  change per chapter (the handover between caption scenes); inside a chapter the same drawing keeps growing, never a
  new card per sentence.
- **The thread object: the wiring board.** Born in `missing`, carried untouched through `kyty` and `anyps5`, its last
  state paid off in `onegame`. One drawing, three states:
  - left: the game, a PS5 game card labelled `eboot.bin` (the executable every PS5 game ships), blue PS5 band on top;
  - three cables out of it, each ending in a socket that carries the real function the game calls, with its emoji:
    💾 `sceSaveDataMount3`, 🔊 `sceAudioOutOutput`, 🎮 `scePadReadState` (real names, each with the real code the
    game actually calls it by, its NID, from KytyPS5's export tables: `ZP4e7rlzOUk` in `refs/kyty/libSaveData.cpp`
    l.1297, `QOQtbeDqsT4` in `refs/kyty/libAudio.cpp` l.131, `YndgXqQVV7c` in `refs/kyty/libPad.cpp` l.182; AnyPS5
    has the same three libraries under `core/libs/prx`);
  - right: the dashed outline of the PS5 (traced from `refs/hardware/ps5-console-dualsense.png`), empty, a "?" in
    each socket;
  - bottom: a stack of three shader cards set in real RDNA 2 instructions (the PS5 GPU's ISA, the one KytyPS5's README
    names as its reference, AMD doc 70648): `v_mul_f32 v0, s0, v1`, `image_sample v[0:3], v4, s[8:15], s[16:19]`,
    `exp mrt0 v0, v1, v2, v3 done`, cabled to a graphics card (a plain PCIe card traced from
    `refs/hardware/gtx1050ti.jpg`, no brand yet) with a "?".
  - State 1 `missing`: everything "?" and dashed. State 2 `kyty`: a KytyPS5 frame (teal mark) wraps the board and
    answers LIVE, sockets go green one by one, a shader card becomes Vulkan. State 3 `anyps5`: the frame is peeled
    off, the game itself is rebuilt BEFORE: `eboot.bin` becomes `GAME.EXE`, sockets become soldered `libs/*.prx`.
    The viewer sees the difference between the two projects as two different things happening to the same board.
    In state 3 the shader stack and graphics card are not the sentence's subject: they stay dimmed to ~35% in their
    translated state (AnyPS5 also recompiles RDNA to SPIR-V for Vulkan, `refs/anyps5/README.md` l.23 and
    ARCHITECTURE "Graphics"), never back to "?", so no "?" is left on stage while the converted game runs.
  - The board is born from the previous chapter's real material: the three console calls that are left behind on the
    game's code sheet in `why` (the lines that do not "just run") become its three cables. That is the cause of
    "what's missing", shown.
  - It is the hero of `missing`, `kyty` (until "works") and `anyps5` and moves aside (shrinks to the top-left, ~45%,
    dimmed) whenever a GitHub proof clipping or the game screen takes the stage. Never two heroes at once. A proof
    that belongs to one socket (the `libPad.cpp` line) opens inside that socket instead of pushing the board away:
    a 0.5 s shrink-and-return is a glitch, not a beat.
- **Proof = real GitHub clippings**, cut from the captures in `refs/` (README lines, release rows, compatibility
  tables, issue #810, the weekly report #887, screenshots), the key phrase under a highlight box that sweeps on the
  word, and a small grey source line under each (`github.com/KytyPS5/KytyPS5 · README`). Only the rows the sentence
  needs, text never below 32 px.
- **Real numbers, live today (2026-10-09):** KytyPS5 ★ 6,555 (shows "6.6k"), GPL-2.0, 408 releases, 84 contributors;
  AnyPS5 ★ 14,917 ("14.9k"), created 2026-08-03, 3,003 commits. Numbers count up and land on their word.
- **Grounds (from caption.txt):** dark for the hook, the boot and the whole machine room (`missing`, `kyty`,
  `anyps5`, `legal`); light (GitHub white) for `why`, `onegame`, `speeding`. The board lives only on dark, so it never
  crosses a ground change. Accents: KytyPS5 teal (its mark's `#93D7C6`) for "answered live", Vulkan red-maroon for the
  shader card once translated, AnyPS5 orange (its avatar's) for "converted before". Red only for the catch (bugs, "not",
  "emulator" struck through).
- **The one big move:** in `kyty` on "translated on the fly", one shader card lifts out of the stack, its RDNA 2 line
  rewrites itself glyph by glyph into SPIR-V (`%12 = OpFMul %float %10 %11`) while the card flips, lands on "Vulkan"
  with the Vulkan mark stamped on its back, and on "speaks" slides into the graphics card, whose "?" turns into a lit
  fan and a picture. Nothing else in the body is that loud.
- No terminal panel at the bottom, no dashed connector lines between cards (the dashed PS5 outline is the "missing"
  state itself, it turns solid), no stack of floating cards, no blur as content.

## Scene by scene

### 1. `hook` (0-3.5 s, dark)

Five variants, built separately.

### 2. `boot` (3.5-10.2 s, dark)
"Their PS5 versions already boot on a PC, with a free emulator called KytyPS5. And another project skips the emulator
entirely."

Real things: the three PS5 covers handed over by the hook (`refs/covers/*-steam-600x900.jpg`, PS5 band redrawn on
top; Spider-Man = Miles Morales, the one KytyPS5's weekly report has in-game), the real PS5 console
(`refs/hardware/ps5-console-dualsense.png`), a PC (monitor + tower), the KytyPS5 and AnyPS5 GitHub repo chips (mark,
`owner / repo`, ★, from `refs/captures/kyty-repo.png`, `anyps5-repo.png`). One road, left to right: PS5 → PC, and what
sits on that road is the whole story of the reel. The first 10 s carry the most motion: every key word moves the
covers or the road.

| Word | What changes |
|---|---|
| PS5 (3.6) | lands on: a white PS5 console stands up on the left with weight (slight overshoot, shadow settling); the three covers, still big from the hook, drop into a stack in front of it and each snaps on the blue PS5 band |
| boot (4.8) | lands on: the covers fly in an arc, one after the other (60 ms apart), off the PS5 to the right, into a PC monitor that rises in from below |
| PC (5.2) | the monitor powers on as they land: three tiles on its screen, a white play triangle on each, "BOOTS" stamps in green; tower LED pulses |
| free (5.9) | lands on: a road draws between PS5 and PC (solid teal line), and a KytyPS5 repo chip drops onto its middle like a bridge (teal mark, `KytyPS5 / KytyPS5`), price chip `$0 · GPL-2.0` |
| KytyPS5 (6.8) | ends on: the name finishes typing, ★ counts 0 → 6.6k; a cover travels the road through the chip to the PC (the emulator sits between the game and the PC) |
| another (8.1) | a second chip drops in above the road, held: AnyPS5 (orange avatar, `boykopovar / AnyPS5`) |
| skips (8.8) | lands on: ★ counts to 14.9k; an orange arc launches PS5 → PC OVER the KytyPS5 chip, a cover rides it and lands straight in the PC |
| entirely (9.5) | the KytyPS5 chip under the arc dims to 40%; the arc and the road hold, the stage hands over |

### 3. `why` (10.2-24.3 s, light)
"But first, why is this even possible? On the PS3, the processor was so different from a PC's that every line of code
had to be translated. The PS5 uses the same family of processor as your PC, Intel or AMD. Same language. So most of
the game's code just runs, directly on your processor."

Real things: the PS3 Cell chip (`refs/hardware/ps3-cell-chip.jpg`, redrawn as a chip with its real "CELL" marking),
an x86 chip (PC), the PS5's AMD chip, Intel and AMD marks (`refs/logos/intel.svg`, `amd.svg`), one line of real
machine code in each instruction set. Mechanism shown, not a translator cartoon: the code itself.

| Word | What changes |
|---|---|
| why (10.8) | lands on: a big "?" between two chips, left slot empty, right slot a PC chip labelled `x86-64` |
| PS3 (12.2) | lands on: the left slot fills with the Cell chip (PS3 console outline behind it, from `ps3-console.jpg`) |
| different (13.7) | lands on: each chip "speaks" one line of its own code in a bubble: Cell `lwz r3, 0(r4)` (PowerPC), PC `mov eax, [rsi]` (x86); the two bubbles' glyphs are visibly different, a red "≠" drops between |
| translated (15.9) | ends on: a row of Cell lines flows right through a narrow gate, each line rewritten into x86 as it passes; the flow is slow, the lines queue up (the cost of translation, visible) |
| PS5 (16.7) | lands on: the Cell chip, its gate and its queue slide out together (nothing of the PS3 stays); the PS5's chip slides into the left slot (AMD mark on its lid, label `x86-64 · Zen 2`) |
| same (17.6) | lands on: the "≠" flips to "=" |
| Intel (19.3) | the PC chip's lid shows the Intel mark; on "AMD" (19.9) the same lid flips like a coin to the AMD mark (one PC chip, never two) |
| language (20.6) | lands on: both bubbles now show the identical line `mov eax, [rsi]`, the two strings highlight together |
| code (21.9) | the two chips settle low; a sheet of the game's code (twelve x86 lines) rises above them, centred, the bubbles fade |
| runs (22.4) | lands on: the lines pour straight down into the PC chip, no gate, fast, the chip's pins light up; three lines do NOT go: `call sceSaveDataMount3`, `call sceAudioOutOutput`, `call scePadReadState` stay on the sheet and turn amber ("most" of the code, shown) |
| processor (23.6) | the PC chip glows; the three amber call lines are the only thing left on the sheet, they lift and hand over (they become the board's three cables) |

### 4. `missing` (24.3-39.0 s, dark): the board is born
"What's missing is the rest of the console. A game spends its whole time asking the PS5 for things. Save my progress.
Play this sound. What is the controller doing? On a PC, nobody answers. And the game draws with tiny programs called
shaders, written in the PS5's own graphics language. Your graphics card can't read them."

Real things: the wiring board (see above), the PS5 outline, the three real function names, real RDNA 2 lines.

| Word | What changes |
|---|---|
| missing (24.5) | lands on: the code sheet from `why` folds into one card, `eboot.bin`, left of stage, a green tick on its CPU corner (that part runs); the three amber call lines hang out of its right edge |
| console (25.5) | ends on: the dashed outline of a PS5 draws itself on the right, empty inside |
| asking (27.3) | lands on: the three call lines stretch into three cables that shoot toward the outline, each ending in an empty socket head; small packets start firing down them on a loop (the game asks all the time) |
| Save (28.6) | lands on: socket 1 labels 💾 `sceSaveDataMount3`, its packet travels the cable and stops at the outline |
| sound (29.9) | lands on: socket 2 🔊 `sceAudioOutOutput`, a waveform packet travels and stops |
| controller (30.7) | lands on: socket 3 🎮 `scePadReadState`, a DualSense icon packet travels and stops |
| PC (31.6) | a small grey `on PC` tag under the dashed outline: this empty space is where your PC stands |
| nobody (32.1) | lands on: a "?" pops in each socket, the three packets bounce back unanswered, the cables go slack and grey |
| shaders (34.8) | lands on: a stack of three shader cards slides up under `eboot.bin` |
| language (36.9) | ends on: the cards' RDNA 2 lines finish typing (`v_mul_f32 v0, s0, v1` / `image_sample ...` / `exp mrt0 ...`), a small `PS5 GPU · RDNA 2` tag |
| can't (38.1) | lands on: a graphics card draws on bottom-right, the top card is pushed toward it and bounces off; a red "?" on the card |
| them (38.5) | the full board holds, complete, every "?" visible: this is the picture the next two chapters fix |

### 5. `kyty` (39.0-61.4 s, dark): the board answered live
"KytyPS5 fixes that while you play. It launches the game, and every time the game asks the PS5 for something, KytyPS5
answers instead, with its own copy of that function. Every shader gets translated on the fly, into Vulkan, a language
your graphics card speaks. And it works. Big games already reach playable scenes. Silent Hill 2 runs, at 6 frames per
second. There are still bugs, crashes, and very uneven performance. Reaching a scene is not finishing the game."

Real things: the KytyPS5 mark, the real lookup line from its source (`refs/kyty/libPad.cpp` line 182:
`LIB_FUNC("YndgXqQVV7c", Controller::PadReadState);`, the game asks by a code, KytyPS5's table answers), the Vulkan
mark, the README's in-game screenshots (`refs/kyty/readme-ps5-01.png` Astro Bot, `-02` Demon's Souls, `-06.jpg`
UFC 6, each captioned "... running in KytyPS5"), GTA V report #810 (`refs/kyty/issue-810.json`, title
`[GAME STATUS]: Grand Theft Auto V`, its three-mode table: Performance "Starts and is playable ... pretty laggy",
Performance RT "characters are drawn as black silhouettes", Fidelity "Story mode does not load"), the Silent Hill 2
frame with its real title bar (`refs/kyty/sh2-fps6.jpg`, "... frame: 2076, fps: 6"), the real crash line from #810
(`vkQueueSubmit failed: ErrorDeviceLost`). After "works" the stage hero is the game screen the graphics card lit; the
board waits small and dimmed top-left.

| Word | What changes |
|---|---|
| KytyPS5 (39.0) | lands on: the KytyPS5 mark slaps onto the empty PS5 outline, which turns solid teal: KytyPS5 takes the console's place |
| play (40.6) | lands on: a badge `WHILE YOU PLAY` with a live red rec dot; a clock in the badge starts running |
| launches (41.2) | lands on: the frame wraps `eboot.bin` too; the game card's PS5 band lights, a boot bar fills |
| asks (42.9) | the 💾 packet leaves again down cable 1 |
| answers (45.2) | lands on: the packet reaches the frame, a teal reply comes back, socket 1's "?" becomes a green check; 🔊 and 🎮 fire and are answered at 45.5 and 45.8 |
| copy (46.5) | lands on: socket 3 opens in place (the board does not move) into a strip of KytyPS5's real export table: the game's packet carries the code `YndgXqQVV7c`, the strip finds the row `LIB_FUNC("YndgXqQVV7c", Controller::PadReadState);`, the code glows teal on both sides; source line `KytyPS5 · src/libs/libPad.cpp` |
| function (47.0) | ends on: `Controller::PadReadState` (KytyPS5's own copy) highlights, the strip holds to 47.7 then closes back into the socket |
| shader (47.7) | lands on: the top shader card lifts out of the stack (the one big move begins) |
| fly (48.9) | the RDNA 2 line rewrites itself glyph by glyph into SPIR-V `%12 = OpFMul %float %10 %11` as the card flips |
| Vulkan (49.4) | lands on: the card lands face up, Vulkan mark stamped on it, the card turns Vulkan maroon |
| speaks (51.0) | ends on: the card slides into the graphics card; its "?" turns into a spinning fan, and a small monitor above the card lights. Every "?" on the board is now answered |
| works (51.8) | lands on: the board shrinks top-left and dims; the monitor grows to centre stage and shows KytyPS5's real in-game screenshots, Astro Bot, then Demon's Souls, then UFC 6 (one per ~0.4 s), each with its README caption "... running in KytyPS5" |
| playable (53.3) | lands on: the GTA V report #810 clipping slides up under the monitor, title `[GAME STATUS]: Grand Theft Auto V`, the `Performance` row with "Starts and is playable" highlighted on the word; source `KytyPS5 · issue #810` |
| Silent Hill 2 (54.2) | the clipping slides down out of frame; the monitor's picture becomes the real Silent Hill 2 frame with its title bar (`SILENT HILL 2, PPSA08710 ... fps: 6`) |
| 6 (55.6) | lands on: the `fps: 6` in the title bar zooms and a red ring draws round it; a big "6" lands beside it; the picture judders at 6 fps |
| bugs (57.0) | lands on: under the frame, the real error line from #810 types in red `vkQueueSubmit failed: ErrorDeviceLost` |
| crashes (57.5) | the Silent Hill 2 window snaps shut to black with a Windows-style close |
| uneven (58.4) | lands on: the black window becomes #810's three-mode table, one row per beat: `Performance` playable, pretty laggy (amber) / `Performance RT` black silhouettes (amber) / `Fidelity` story mode does not load (red). Same game, three different results: uneven, from the real report |
| not (60.1) | lands on: the table fades; a game progress line from START to END, a teal pin at "first scene" just past START, the END flag struck with the reel's red stroke |
| game (60.7) | the line fades; the board comes back to centre for the handover, KytyPS5 frame still on it |

### 6. `anyps5` (61.4-75.5 s, dark): the board converted before
"AnyPS5 does that work before you play. It converts the game itself into a normal Windows or Linux program, already
wired to rewritten PS5 functions. No emulator to open. You double-click the game, and it starts, like any app. That's
why AnyPS5 calls itself a porting tool, not an emulator."

Real things: AnyPS5 mark, its real conversion command (`relinker --windows source/input.elf app.exe`, from
`refs/anyps5/USAGE.md`), the Windows and Tux marks, the real rewritten-library names (`libSceSaveData.prx`,
`libSceAudioOut.prx`, `libScePad.prx`, the runtime `libs/` folder from USAGE.md), a Windows desktop icon and a
window, the README lines "Tool for automatic PS5 executables porting to Linux and Windows" and "No emulation or
separate runtime process." (`refs/anyps5/README.md`, `refs/captures/anyps5-repo.png`).

| Word | What changes |
|---|---|
| AnyPS5 (61.4) | lands on: the KytyPS5 frame peels off the board like tape; the AnyPS5 mark lands where it was; the three sockets fall back to "?" (nobody answers live any more); the shader stack and graphics card dim to ~35% and stay out of focus for the chapter |
| before (62.7) | lands on: badge `BEFORE YOU PLAY`, the rec dot off, a timeline under it `convert ▸ play` with the playhead on `convert` |
| converts (63.5) | lands on: `eboot.bin` drops into a slot under the AnyPS5 mark; the real command types on one line above it, `relinker --windows source/input.elf app.exe` |
| Windows (65.2) | lands on: the card comes out the other side as `GAME.EXE`, Windows mark on it, the PS5 band gone |
| Linux (65.7) | the card flips once and shows `GAME.elf` with Tux, flips back (both outputs are real: `app.exe` / `app.elf`) |
| wired (66.7) | lands on: the three cables snap into `GAME.EXE` as soldered pins, no PS5 outline left on the right |
| functions (68.2) | ends on: the three sockets become small library files, `libSceSaveData.prx`, `libSceAudioOut.prx`, `libScePad.prx`, in a `libs/` folder beside the exe, each with an orange "rewritten" pencil mark and a green check |
| No (68.7) | lands on: the ghost of the KytyPS5 frame from the previous chapter flashes in and is struck through in red |
| double-click (69.9) | lands on: the board compacts into a Windows desktop icon `GAME.EXE`; a cursor double-clicks it, two ripples |
| starts (71.0) | lands on: a window opens from the icon with a real Windows title bar `GAME.EXE`, and the game's picture fills it (Dreaming Sarah's Steam header art, `refs/covers/dreaming-sarah-steam-header.jpg`, unnamed here: the name lands in the next chapter); no launcher, no other window on the desktop |
| app (71.8) | the window holds alone on the desktop, the taskbar shows one item, `GAME.EXE` |
| porting (73.9) | lands on: the window moves aside; the AnyPS5 README clipping, "porting" in "Tool for automatic PS5 executables porting to Linux and Windows" highlighted |
| emulator (74.8) | lands on: the next README line, "No emulation or separate runtime process.", "No emulation" highlighted; a word chip `emulator` beside it struck in red |

### 7. `onegame` (75.5-83.1 s, light)
"For now, its official list has exactly one game. Dreaming Sarah, a small 2D platformer, at 60 frames per second on a
GTX 1050 Ti."

Real things: AnyPS5's `docs/user/COMPATIBILITY.md` table (`refs/captures/anyps5-compat.png`, one row: Dreaming Sarah,
PPSA02929, In game, playable, 60 FPS, 36 FPS), the Dreaming Sarah key art (`refs/covers/dreaming-sarah-steam-600x900.jpg`),
the GTX 1050 Ti (`refs/hardware/gtx1050ti.jpg`), the README line "runs at a stable 60 fps on a GTX 1050 Ti".

| Word | What changes |
|---|---|
| list (76.4) | lands on: the GitHub file view `AnyPS5 / docs / user / COMPATIBILITY.md` slides in, title "Tested compatibility" |
| one (77.3) | lands on: the table draws its single row; a big "1" stamps beside it; empty rows below stay ghosted |
| Dreaming (77.9) | lands on: the row's game cell `Dreaming Sarah` highlights; the `GAME.EXE` window from `anyps5` flies in small and docks beside the row, its title bar now reads `Dreaming Sarah`: the thread object's payoff, the converted game has a name |
| 2D (79.3) | lands on: the README line "Dreaming Sarah (2D platformer) runs at a stable 60 fps on a GTX 1050 Ti" slides under the table, "(2D platformer)" highlighted; source `AnyPS5 · README` |
| 60 (80.5) | lands on: "60 fps" in the README line highlights, a counter rolls 0 → 60 at hero size, everything above dims |
| GTX (81.7) | lands on: the GTX 1050 Ti card (`refs/hardware/gtx1050ti.jpg`) slides under the counter, "GTX 1050 Ti" highlights in the line; source `AnyPS5 · README` |

### 8. `speeding` (83.1-94.9 s, light)
"And it's speeding up. At the end of July, KytyPS5 shipped 2 to 3 new versions a day. Since mid-September, more than 7.
More than 80 people have worked on its code, and its last weekly report shows progress on about fifteen games, in one
week."

Real things: the KytyPS5 Releases page (`refs/captures/kyty-releases.png`), real tags of two real days from
`refs/kyty/releases.tsv` (2026-07-30: `ecb48f9`, `d04938c`, `77aa28b`; 2026-10-08: eleven tags `aa3b2cd` ...
`2f4b8a3`), the 84 real contributor avatars (`refs/kyty/contributors/`), the weekly update #887
(`refs/captures/kyty-weekly-887.png`, "KytyPS5 weekly update , September 28,October 4, 2026", author Nmzik).
No coloured bars: the stack of real release rows is the chart.

| Word | What changes |
|---|---|
| speeding (83.4) | lands on: the Releases page header slides in, "Release list", a release count rolling up to 408 |
| July (84.4) | lands on: a day column `Jul 30` opens on the left |
| 2 (86.2) | lands on: release rows drop into the column, `KytyPS5-2026-07-30-ecb48f9`, then `d04938c` |
| day (87.2) | the third row `77aa28b` lands; the column is short |
| mid-September (87.8) | a second column `Oct 8` opens on the right |
| 7 (89.1) | lands on: eleven real rows rain into it, much taller than the July column; a chip `7+ / day since mid-Sept` |
| 80 (89.7) | lands on: the columns slide up; 84 real contributor avatars fill a grid row by row, a counter running to 84, it lands "80+" |
| weekly (91.6) | lands on: the grid shrinks; the weekly update #887 card slides in, title and date range highlighted |
| fifteen (93.2) | lands on: game-name chips from the report stamp in fast under it (UFC 5, UFC 6, Dragon Ball FighterZ, Hi-Fi RUSH, Hades II, GTA V, Silent Hill 2, Silent Hill f, Miles Morales, Stray, MotoGP 23, Astro's Playroom, Beast of Reincarnation, God of War: Sons of Sparta, New Super Lucky's Tale), a counter to 15 |
| one (94.3) | lands on: the date range "September 28,October 4" highlights: one week |

### 9. `legal` (94.9-104.7 s, dark)
"Neither one gives you games. You need your own, dumped from your own PS5, legally. Send this to the friend still
waiting for a PC port. And comment "PS5", I'll send you both official GitHub pages."

Real things: KytyPS5's README IMPORTANT box ("The project does not distribute games or copyrighted system software.
Use only game files that you have obtained legally.", `refs/kyty/README.md` l.20-22), AnyPS5's usage syntax
(`refs/anyps5/USAGE.md` l.15), the PS5 console, a game folder named by its real ID (`PPSA08710`), the Instagram
share sheet, comment box and DM. The repo chips from `boot` are not re-shown as a picture: they come back only inside
the final DM, as the reward.

| Word | What changes |
|---|---|
| Neither (94.9) | lands on: two real clippings stacked, one per project, each under its small mark: KytyPS5's README IMPORTANT box, and AnyPS5's USAGE line `relinker [options] <input.elf> <output>` |
| games (95.6) | "does not distribute games" highlights in the KytyPS5 box, and `<input.elf>` highlights in the AnyPS5 line: the game is an input you bring, neither ships one |
| own (96.5) | lands on: the clippings shrink up; a real PS5 console (`ps5-console-dualsense.png`) slides in centre |
| PS5 (97.5) | lands on: a game folder `PPSA08710` slides out of the console into a PC folder `Your games` |
| legally (98.4) | lands on: "Use only game files that you have obtained legally." highlighted, a green check on the folder |
| port (100.5) | lands on: an Instagram share sheet rises, a row of friends' realistic portrait faces (never initials), the send arrow fills on one |
| PS5 (101.5) | lands on: a comment box, the cursor types `PS5` and sends; the comment appears with his avatar |
| GitHub (103.3) | lands on: the reward, a DM bubble arrives with both links, `github.com/KytyPS5/KytyPS5` and `github.com/boykopovar/AnyPS5`, each with its mark and star count; last frame reads alone |

## Notes for him

- **July number.** The script says 2 to 3 versions a day at the end of July. The release list as it stands today has
  more on most late-July days (Jul 27-31: 7, 4, 9, 3, 7), with 2026-07-30 at 3. The plan shows Jul 30's three real
  tags so the screen matches the voice and stays true. Mid-September onwards checks out: 187 releases in 24 days, 7.8
  a day. 84 contributors, 16 game names in report #887.
- **Spider-Man** on screen is Miles Morales (the cover the French reel used and the one report #887 has in-game).
- **GAME.EXE** is the label his direction asked for; AnyPS5's own docs name the output `app.exe`, which is what the
  typed command shows.
- **Save function.** On PS5 the save call KytyPS5 exports is `sceSaveDataMount3` (NID `ZP4e7rlzOUk`), so the socket
  shows that, not the PS4-era `sceSaveDataMount`.
- **AnyPS5 and shaders.** The script says nothing about shaders for AnyPS5. Its docs show it recompiles RDNA to SPIR-V
  at runtime with a disk cache, so the board's graphics card stays in its translated state, dimmed, rather than
  claiming a "before" conversion of shaders.
- **Critic pass (2026-10-09).** Fixed: `boot` had arrows from a PS5 that was not on stage (the console is now there,
  the road carries the story); the `copy` proof shrank the board for 0.5 s (now opens inside socket 3); the "uneven"
  frame-time trace was invented data (now #810's real three-mode table); "works" showed nothing real (now KytyPS5's
  README in-game screenshots); the `anyps5` window used a KytyPS5 screenshot as AnyPS5 output (now the game's art,
  named in `onegame`); `onegame` re-opened the same art as a fake running sprite (now the README's "(2D platformer)"
  line); `legal` re-showed the `boot` repo headers (now the two real "no games" proofs); `why` gained the cause of
  `missing` (three console calls left behind on the code sheet become the board's cables) and lost the second PC chip
  and the leftover PS3 gate.

## refs/ index (fetched 2026-10-09)

- `refs/covers/`: GTA V, Spider-Man Miles Morales, Silent Hill 2, Dreaming Sarah key art (Steam 600x900 @2x), plus
  the Wikipedia PS-edition box art (low res, for the PS5 band reference).
- `refs/logos/`: KytyPS5 org mark, AnyPS5 avatar (boykopovar), PlayStation, PS5 wordmark, Vulkan, Windows, Tux,
  Intel, AMD, NVIDIA, GitHub (svg from Wikimedia, png from logo.dev).
- `refs/captures/`: KytyPS5 repo page, AnyPS5 repo page, KytyPS5 Releases, kytyps5.github.io, AnyPS5
  COMPATIBILITY.md, weekly update #887, contributors graph (Jina screenshots, 1280 px).
- `refs/kyty/`: README.md, releases.tsv (all 408 tags + dates), contributors.tsv + 84 avatars, weekly-862/887.json,
  sh2-fps6.jpg (fps: 6 title bar), sh2-pr654-a/b.png, ufc5-weekly.jpg, README screenshots ps5-01..06, libPad.cpp,
  libSaveData.cpp, libAudio.cpp, audio.cpp, issue-810.json (GTA V report), tree.txt.
- `refs/anyps5/`: README.md, COMPATIBILITY.md, USAGE.md, ARCHITECTURE.md, status badges + progress.svg.
- `refs/hardware/`: PS3 Cell chip, PS3 console, PS5 + DualSense, GTX 1050 Ti (Wikimedia Commons).

## Body revision 2026-10-09 (his note on 26-60 s: no pills, real games)

- No status pills anywhere: `WHILE YOU PLAY` and `BEFORE YOU PLAY` are gone, `on PC` and `$0 · GPL-2.0` are plain text.
- `missing`: the real PS5 photo stands in the outline on "console", then goes, leaving the dashed outline; on "PC" the
  PC's monitor rises under the board, dark; the graphics card is cabled to it.
- `kyty`: the same monitor powers on on "play" (KytyPS5's real launcher, then Astro Bot running, real capture) and the
  game keeps running while the calls get answered: that is "while you play". The shader card lifts over the dimmed
  board; on "speaks" the display cable lights. From "works": real KytyPS5 captures per word (Astro Bot, God of War
  Sons of Sparta on "games", GTA V on "playable" beside #810), Silent Hill 2 on "Silent" with the window's own title
  bar reading fps 6 on "6" (the loupe is the same capture zoomed). "not": the first scene is a real Astro Bot thumbnail.
- `anyps5`: "before" is a timeline, the conversion block first and the play mark after it; the playhead stays in the
  conversion and reaches play on "double-click".
- Clips (assets/kyty-clip-*.mp4, H.264 -g 1, muted): KSd7ZDaWMXk 30.4-31.45 + 31.4-44.2 (Christo Gevedjov),
  1uc2yO7L4Zs 95.0-97.6 (Zatt), KEmNUR46uCI 532.0-535.5 (KimiSha19), eQ7PKfK4q_w 309.6-313.8 (PSXTech, 1080p).
