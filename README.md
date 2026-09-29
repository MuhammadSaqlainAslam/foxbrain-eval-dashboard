# FoxBrain EvalHub
### Frontier Benchmark & Model Intelligence — HHRI-AI Research

**A curated, up-to-date reference of benchmarks and frontier models used by leading AI labs. Use this to select evaluation targets for FoxBrain model assessments across 12 capability domains.**

---

## 🔗 Live reference page

👉 **[https://muhammadsaqlainaslam.github.io/foxbrain-eval-dashboard/](https://muhammadsaqlainaslam.github.io/foxbrain-eval-dashboard/)** — *FoxBrain EvalHub*

---

## What's inside

The dashboard has 7 tabs: **Benchmark Registry**, **Priority View**, **Models**, **Coding**, **By Lab**, **By Benchmark**, and **Sources**. The Benchmark Registry, Models, and Coding tabs each include a live search box (with a clear/"✕" button) for filtering by name, org, or description.

### 📊 Benchmark Registry tab — 87 benchmarks across 12 domains

| Domain | Key benchmarks |
|---|---|
| STEM Reasoning | AIME 2025/2026, HLE, MATH-500, GPQA Diamond, FrontierMath, ARC-AGI-1/2/3, LiveCodeBench v6/Pro, OlympiadBench, HumanEval+, MBPP+, ProgramBench |
| Agentic Coding | SWE-Bench Verified/Pro/Multilingual, Multi-SWE-Bench, FrontierCode Diamond, Terminal-Bench 2.1/4.0, Terminal-Bench-Science 0.1, Aider Polyglot, CursorBench 3.1/4.0, τ-bench, τ²-bench, Cybench, BigCodeBench, DevBench, VIBE-Pro, Agents Last Exam, DeepSWE v1.1 |
| Computer Use | BrowseComp, OSWorld-Verified, OSWorld 2.0, BenchCAD |
| Knowledge & Language | MMLU-Pro, MMLU, SimpleQA, FRAMES, DROP, GDPval-AA, BigBenchHard |
| Instruction | IFEval, Multi-IF, IFBench, AlpacaEval 2.0, MT-Bench, Arena ELO (LMArena) |
| Multimodal | MMMLU, MMMU Pro, MathVista |
| Long Context | MRCR v2/v1, RULER, LOFT, LongBench v2, NoLiMa, InfiniteBench, LV-Eval, GraphWalks BFS |
| Tool Use | BFCL v3, τ-bench tool, API-Bank, AutomationBench, MCP Atlas, Toolathlon |
| Safety & Cyber | WildGuard, HarmBench, ExploitBench, StrongREJECT, XSTest, SEC-Bench Pro, ExploitGym |
| Health & Science | MedQA (USMLE), HealthBench Professional, JAMA Clinical, GeneBench Pro, LifeSciBench |
| Honesty | SycophancyEval, TruthfulQA |
| Chinese/HHRI-AI | TMMLU+, AIEC, MedBench, ClinConsensus |

Each benchmark shows: domain, priority, primary metric, which labs use it, description, and a **Verify scores ↗** link to the authoritative leaderboard.

> ⚠️ **Score verification note:** Always check needle count and context size when comparing MRCR scores. The same model can show 91.5% (4-needle, 128K) vs 54% (8-needle, 128K). Use the verify links to confirm variant used.

### 🔴 Priority View tab

A per-domain, per-lab breakdown of the highest-priority benchmarks (Tier 1 — Critical, Tier 2 — High, Tier 3 — Medium, Tier 4 — Low, and a Watch List), showing each lab's best reported score, headroom to close, and source attribution — used to decide what FoxBrain should be evaluated against next.

### 🤖 Models tab — 116 models across 16 labs

Within each lab, models are sorted **newest release first**.

| Lab | Count | Notable models |
|---|---|---|
| Google DeepMind | 21 | Gemini 3.8 Flash & Flash Cyber (Sep 2), Gemini 3.7 Flash (Aug 13), Gemini 3.6 Flash, 3.5 Flash-Lite, 3.5 Flash Cyber, 3.5 Flash, 3.1 Pro, 3.1 Flash Lite, 3.1 Flash Image, 3 Pro/Flash/Deep Think, 2.5 Pro, 2.5 Flash Lite, Gemma 4 (31B/26B A4B/12B/E4B/E2B), DiffusionGemma 26B A4B |
| OpenAI | 21 | **GPT-6 Sol & Luna** (new, Sep 22 — 50% cheaper GPT-6 tier, new price floor), GPT-6 Astra (flagship, Sep 3), GPT-5.6-Cyber (restricted), GPT-5.6 Sol, Terra, GPT-5.5, GPT-5.5 Instant, GPT-5.4 (mini/nano), GPT-5.2, GPT-5.1, GPT-5, GPT-5 mini, gpt-oss-120b, gpt-oss-20b, o3, o3-pro, o4-mini |
| Anthropic | 16 | **Claude Sonnet 5.5** (new, Sep 28 — surprise Terminal-Bench 4.0 leader), **Claude Opus 5.5** (new, Sep 22 — new HLE leader), Claude Fable 5.1 & Mythos 5.1, Opus 5, Sonnet 5, Fable 5, Mythos 5, Opus 4.8/4.7/4.6, Sonnet 4.6, Haiku 4.5, Opus 4.5, Sonnet 4.5, Opus 4.1 |
| Alibaba | 11 | **Qwen3.8-Omni-Flash** (new, Sep 18 — first omni-modal agentic model), Qwen3.8-Max (refreshed as Qwen3.8-Max-0902, Sep 2), Qwen3.8-Flash-Next, Qwen3.8-27B, Qwen3.7 Max, Qwen3.5, Qwen3.6-35B-A3B, Qwen3-235B, 30B, VL, Coder |
| DeepSeek | 9 | V4 Flash Vision (Exp) (Aug 21), V4 Pro (refreshed as V4-Pro-0813, Aug 13), V4 Flash, V3.2 Speciale, V3.2, R1-0528, R1, V3, Prover V2 |
| Meta | 8 | Muse Spark 1.3 (Sep 2 — first from Meta Superintelligence Labs' post-Llama-4 era), Muse Glimmer, Muse Spark 1.2, Muse Spark 1.1, Muse Spark, Llama 4 Maverick, Scout, Llama 3.3 70B |
| xAI | 7 | **Grok 4.7** (new, Sep 21), Grok 4.6, Grok 4.5, Grok 4.3, Grok 4.20, Grok 4, Grok 2.5 |
| Mistral AI | 6 | Mistral Medium 3.5, Large 3, Small 3.2, Magistral Medium/Small, Codestral |
| Zhipu AI (Z.AI) | 4 | **GLM-5.3-FlashX** (new, Sep 18 — same weights as Flash, ~5-6x faster serving), GLM-5.3-Flash, GLM-5.3, GLM-5.2 |
| Xiaomi | 3 | **NEW LAB** — MiMo-V2.6-Pro/Flash/Distill-Qwen-9B (Sep 22): Pro is #1 open-weight model on the independent Artificial Analysis Intelligence Index |
| Moonshot AI | 3 | Kimi K3, Kimi K2.7 Code, Kimi K2.6 |
| NVIDIA | 2 | Nemotron 3.5 Lightning (Aug 11), Nemotron 3 Ultra 550B |
| Microsoft | 2 | MAI-Thinking-1, Phi-4 |
| MiniMax | 1 | MiniMax M3 |
| Writer | 1 | Palmyra X6 (Aug 13) |
| InclusionAI (Ant Group) | 1 | Ling-3.0-Flash (open, Aug 7; "Flash Fin" finance variant Aug 27) |
| **Total** | **116** | Includes deprecated models with flags |

Open-weight models (Gemma 4, DeepSeek, Qwen3, Llama 4, Mistral, MiniMax, GLM-5, Kimi, NVIDIA Nemotron, Muse Glimmer, Ling-3.0, Xiaomi MiMo-V2.6) can run directly on HHRI-AI H100s via vLLM. Deprecated models included for historical reference and reproducibility.

### 💻 Coding tab — 43 models across 2 weight classes

Sorted newest release first (independent of tier).

| Class | Count | Examples |
|---|---|---|
| Closed-weight | 23 | **Claude Sonnet 5.5, Opus 5.5** (new, Sep 22-28), **GPT-6 Sol, GPT-6 Luna** (new, Sep 22), **Grok 4.7** (new, Sep 21), GPT-6 Astra, Muse Spark 1.3, Claude Fable 5.1, Claude Opus 5, GPT-5.6 (Sol/Terra/Luna), Grok 4.6, Qwen3.8-Max (refreshed -0902), Gemini 3.7 Flash, GLM-5.3, Muse Spark 1.2, Claude Fable 5/Sonnet 5, Claude Opus 4.8, GPT-5.5, Gemini 3.1 Pro |
| Open-weight | 20 | **MiMo-V2.6-Pro** (new lab: Xiaomi, Sep 22 — #1 open-weight on Artificial Analysis), Qwen3.8-Flash-Next, GLM-5.3-Flash, Muse Glimmer, Kimi K3, DeepSeek V4 Pro (refreshed V4-Pro-0813)/Flash, Kimi K2.6/K2.7 Code, GLM-5.2, MiniMax M3, Qwen3-Coder-480B-A35B, Qwen3-Coder-Next, Qwen3.6-27B, DeepSeek Coder V2, Devstral Small 2, Codestral 25.01, StarCoder2-15B, NVIDIA Nemotron 3 Ultra 550B, IBM Granite Code 34B |

Filterable by tier (closed/open) and specialty (agentic, local/self-host, autocomplete/FIM). Each card shows: specialty, price, context window, license, benchmark scores (SWE-Bench Verified, SWE-Bench Pro, LiveCodeBench, HumanEval) color-coded by performance, H100-runnable badge, and official page link.

### 🏭 By Lab tab

One card per lab showing every benchmark they evaluated with:
- Exact API model string (e.g. `claude-opus-5`, `gemma-4-31b-it`, `deepseek-r1`)
- Score reported
- Context size and variant notes (crucial for long-context benchmarks)
- **Official source ↗** link to lab's technical report or model card

223 evaluation entries across 12 labs (Anthropic 56, OpenAI 38, Google DeepMind 35, Microsoft 27, HHRI-AI 13, xAI 12, DeepSeek 11, Alibaba 11, Meta 10, Mistral AI 6, Xiaomi 3, NVIDIA 1).

### 📈 By Benchmark tab

One card per benchmark showing every lab that evaluated it with exact model API string and score. Includes **Verify scores ↗** links to authoritative leaderboards.

Cross-check resources: Artificial Analysis, BenchLM, Scale AI Leaderboard, LLM Stats, Papers With Code.

### 📖 Sources tab — 49 reference links

Technical reports, live leaderboards, and benchmark papers, including:
- GPT-6 Sol & Luna launch (Sep 22), GPT-6 Astra launch & system card (Sep 3), GPT-5.6-Cyber & Daybreak Blue/Red, GPT-5.6 Sol price cut Aug 22 (OpenAI)
- Claude Sonnet 5.5 launch (Sep 28), Claude Opus 5.5 launch (Sep 22), Claude Fable 5.1 & Mythos 5.1 launch (Sep 1), Claude Opus 5 / Fable 5 & Mythos 5 system cards, Claude Sonnet 5 launch (Anthropic)
- MAI-Thinking-1 Technical Report §4.1 (Microsoft AI)
- Gemini 3.8 Flash & Flash Cyber launch (Sep 2), Gemini 3.7 Flash launch, Gemini 3.1 Pro model card + API changelog, Gemini 3.6 Flash/3.5 Flash-Lite/3.5 Flash Cyber launch, Gemma 4 model card & developer guide (Google DeepMind)
- Qwen3.8-Omni-Flash launch (Sep 18), Qwen3 Technical Report, Qwen3.8-Max-0902 post-training refresh (Sep 2), Qwen3.8-Max broad availability & open weights, Qwen3.8-Flash-Next launch (Alibaba)
- DeepSeek V4 Pro & R1-0528 release, DeepSeek V4-Pro-0813 GA & new billing, V4 Flash Vision (Exp) launch (DeepSeek)
- Muse Spark 1.3 launch (Sep 2), Llama 4 Technical Report, Muse Spark 1.2 & Muse Glimmer launch (Meta)
- Xiaomi MiMo-V2.6 series launch (Sep 22, new lab) (Xiaomi)
- NVIDIA Nemotron 3.5 Lightning & NeMo Switchyard (NVIDIA)
- Grok 4.7 launch (Sep 21), xAI Grok 4 & 4.3 release, Grok 4.6 launch (xAI)
- Magistral & Mistral Large 3 release (Mistral AI)
- GLM-5.3-FlashX launch (Sep 18), GLM-5.3 launch, GLM-5.3-Flash open-weight launch (Zhipu AI)
- Writer Palmyra X6 launch (Writer)
- Ling-3.0-Flash & Flash Fin launch (InclusionAI / Ant Group)
- HLE — Humanity's Last Exam (Center for AI Safety / Scale AI)
- ClinConsensus Benchmark (arXiv 2603.02097)
- Scale AI Leaderboard, Artificial Analysis Intelligence Index, Vellum LLM Leaderboard (updated continuously)
- OpenAI Model Release Notes & API Changelog, Gemini API Release Notes
- DeepSeek V3 / R1 Technical Report

---

## Automated monitoring

A GitHub Actions workflow runs every **Monday 09:00 Taiwan time** to scan for:
- New open-weight model releases on Hugging Face Hub
- New benchmark papers on arXiv cs.CL / cs.AI
- New SOTA entries on Papers With Code

Findings are opened as GitHub Issues automatically.

**Required secrets** (Settings → Secrets → Actions):

| Secret | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API — used to parse arXiv papers |
| `GH_TOKEN` | GitHub PAT with `repo` + `issues:write` scope |
| `HF_TOKEN` | HuggingFace read token (optional, raises rate limits) |

To trigger manually: Actions → Frontier Model & Benchmark Monitor → Run workflow.

---

## Repository structure

```
foxbrain-eval-dashboard/
├── docs/
│   ├── index.html                 # Live reference page (FoxBrain EvalHub)
│   └── benchmark_registry.json   # Canonical benchmark + model registry (v2.0)
├── results/
│   └── benchmark.csv             # FoxBrain evaluation results (for future use)
├── scripts/
│   ├── monitor_models.py          # Weekly frontier monitor script
│   ├── update_registry.py         # Add new benchmarks to registry
│   └── validate_csv.py            # Validate benchmark.csv on PRs
├── .github/
│   └── workflows/
│       ├── monitor.yml            # Weekly monitor → GitHub Issues
│       └── validate.yml           # CSV validation on PRs
└── README.md
```

---

## Related projects

- 📊 **HHRI-AI LLM EvalBoard** (TMMLU+ Leaderboard) — [muhammadsaqlainaslam.github.io/tmmlu-leaderboard](https://muhammadsaqlainaslam.github.io/tmmlu-leaderboard/)
- 📁 **TMMLU+ GitHub repo** — [github.com/MuhammadSaqlainAslam/tmmlu-leaderboard](https://github.com/MuhammadSaqlainAslam/tmmlu-leaderboard)

---

*Curated by [Muhammad Saqlain](https://github.com/MuhammadSaqlainAslam) · HHRI-AI / Foxconn AI Research Center*

*Benchmark taxonomy based on MAI-Thinking-1 Technical Report §4.1 (Microsoft AI, June 2026) and additional sources listed in the Sources tab.*

*Last updated: September 29, 2026 — three weeks of dense frontier activity (Sep 8–28), capped by near-simultaneous flagship drops from Anthropic and OpenAI. **Claude Opus 5.5** (Sep 22) and **Claude Sonnet 5.5** (Sep 28) — the new Claude 5.5 family — take over as new HLE leader (Opus 5.5: 67.7% w/ tools) and, more surprisingly, new Terminal-Bench 4.0 leader (Sonnet 5.5: 70.6%, beating every Opus/Mythos-tier model tracked including its own sibling Opus 5.5 at 66.4%). **GPT-6 Sol & Luna** (Sep 22) followed Astra with ~50% API price cuts and a new AutomationBench SOTA (Sol: 33.2%) and price floor (Luna: $0.10/$0.50). **Grok 4.7** (Sep 21) showed the largest vendor-vs-independent gap seen yet — self-reported Terminal-Bench 4.0 of 38.0% drops to 26% under independent Artificial Analysis testing. **Qwen3.8-Omni-Flash** (Sep 18, Alibaba) is the first omni-modal agentic Qwen model. **GLM-5.3-FlashX** (Sep 18, Zhipu) is a same-weights, faster-serving sibling of GLM-5.3-Flash. New lab: **Xiaomi** joined with the MiMo-V2.6 series (Sep 22) — MiMo-V2.6-Pro is the #1 open-weight model in the world on the independent Artificial Analysis Intelligence Index, ahead of Grok 4.6 and Gemini 3.8 Flash. Added CursorBench 4.0 as a new benchmark. Reconciled affected SOTA claims across the Benchmark Registry and Priority View tabs (Terminal-Bench 2.1/4.0, Terminal-Bench-Science 0.1, HLE, AutomationBench, GDPval-AA, DeepSWE v1.1, OSWorld 2.0, FrontierCode Diamond) rather than just adding model cards. Total: 87 benchmarks across 12 domains, 116 frontier models across 16 labs, 43 coding specialist models, 49 sources.*
