# Facts you may show (everything else on screen is illustrative and carries no claim)

His script is taken as true. These are the real names, numbers and copy for the pictures.

- PewDiePie (Felix Kjellberg), YouTube, 109M subscribers. Video: "I seriously should NOT be dropping this." (Sep 30, 2026). Thumbnail: public/pewdiepie-abliteration/pewdiepie-thumb.jpg. https://www.youtube.com/watch?v=ODDJXGY_1kQ
- Ajax page (data.pewdiepie.com): black hexagon mark + "Ajax" in a black italic serif on cream (#F9F8F4); "Odysseus ↗" top-left; "I've decided to release Ajax when it's ready instead of putting a timer." / "About Ajax ↓". About section: "Ajax is a fine-tuned Qwen 3.5 9B model, trained for Odysseus to be your always on agent." "Ajax's refusal has been ablated for a freer, less restricted AI experience. Please use responsibly." Capture: ref-ajax-page.png.
- Base model: Qwen3.5-9B (Alibaba's Qwen). 32 layers, 4,096 numbers per token (hidden size). https://huggingface.co/Qwen/Qwen3.5-9B
- OpenAI banned him twice (his account; the OpenAI email he shows names "distillation"). Draw the ban as an OpenAI account-deactivated notice; do NOT invent the email body text beyond: "Your OpenAI account has been deactivated" style heading. Never show a fake reason other than "distillation".
- The paper: "Refusal in Language Models Is Mediated by a Single Direction", Andy Arditi, Oscar Obeso, Aaquib Syed, Daniel Paleka, Nina Panickssery, Wes Gurnee, Neel Nanda. arXiv:2406.11717, June 2024 (NeurIPS 2024). "13 popular open-source chat models up to 72B parameters." Capture: ref-arxiv.png.
- Method: 128 harmful + 128 harmless instructions; activations read at the last prompt token; difference in means = refusal direction; ablate it -> refusals stop; add it to harmless prompts -> it refuses; weight orthogonalization = permanent edit, no gradient training. Clouds separate along one axis (PCA figure, Gemma 7B).
- "abliteration" = ablate + obliterate (FailSpy's model card: "Ablate + obliterated = Abliterated").
- Damage: independent study (arXiv 2512.13655), math (GSM8K) down by up to 18.81 points. Paper's own Llama 3 70B: MMLU 79.9 -> 79.8.
- Heretic: github.com/p-e-w/heretic, "Fully automatic censorship removal for language models", 33.1k stars, 3.7k forks, AGPL-3.0, topics abliteration / llm / transformer. Finds the edit that co-minimises refusals and KL divergence (damage). Own test, Gemma 3 12B: refuses 97/100 originally, 3/100 after Heretic, KL 0.16 (vs 1.04 by hand). Capture: ref-heretic.png.
- PewDiePie's words (Tom's Hardware): removing the refusal "without doing 'brain damage'".
- Twist: harmfulness and refusal are separate directions (Zhao et al. 2025, "LLMs Encode Harmfulness and Refusal Separately", arXiv 2507.11878).
- Hugging Face: 8,305 models with "abliterated" in the name (Oct 3, 2026). Capture: ref-hf-search.png. Name suffixes: -abliterated, -uncensored, -heretic.
- Anthropic: "since Claude's weights are not provided to users, they cannot be abliterated" (Sep 29, 2026 report).
- Damage detail (arXiv 2512.13655, Young 2025, Table 3 + conclusion): the -18.81 pp GSM8K drop was HERETIC on Yi-1.5-9B (70.89% -> 52.08%, -26.5% relative); DECCP on the same model kept 72.40%. ErisForge avg GSM8K -0.28 pp, DECCP -0.13 pp. Paper: "suggesting potential overlap between mathematical reasoning circuits and refusal-related representations." Heretic on Mistral-7B: -0.12 pp avg.
