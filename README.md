# FoxBrain EvalHub
### Frontier Benchmark & Model Intelligence — HHRI-AI Research

**A curated, up-to-date reference of benchmarks and frontier models used by leading AI labs. Use this to select evaluation targets for FoxBrain model assessments across 12 capability domains.**

---

## 🔗 Live reference page

👉 **[https://muhammadsaqlainaslam.github.io/foxbrain-eval-dashboard/](https://muhammadsaqlainaslam.github.io/foxbrain-eval-dashboard/)** — *FoxBrain EvalHub*

---

## What's inside

The dashboard has 7 tabs: **Benchmark Registry**, **Priority View**, **Models**, **Coding**, **By Lab**, **By Benchmark**, and **Sources**. The Benchmark Registry, Models, and Coding tabs each include a live search box (with a clear/"✕" button) for filtering by name, org, or description.

### 📊 Benchmark Registry tab — 84 benchmarks across 12 domains

| Domain | Key benchmarks |
|---|---|
| STEM Reasoning | AIME 2025/2026, HLE, MATH-500, GPQA Diamond, FrontierMath, ARC-AGI-1/2/3, LiveCodeBench v6/Pro, OlympiadBench, HumanEval+, MBPP+, ProgramBench |
| Agentic Coding | SWE-Bench Verified/Pro/Multilingual, Multi-SWE-Bench, FrontierCode Diamond, Terminal-Bench 2.1, Aider Polyglot, CursorBench 3.1, τ-bench, τ²-bench, Cybench, BigCodeBench, DevBench, VIBE-Pro, Agents Last Exam, DeepSWE v1.1 |
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

### 🤖 Models tab — 84 models across 13 labs

Within each lab, models are sorted **newest release first**.

| Lab | Count | Notable models |
|---|---|---|
| OpenAI | 17 | GPT-5.6 (Sol/Terra/Luna), GPT-5.5, GPT-5.5 Instant, GPT-5.4 (mini/nano), GPT-5.2, GPT-5.1, GPT-5, GPT-5 mini, gpt-oss-120b, gpt-oss-20b, o3, o3-pro, o4-mini |
| Google DeepMind | 15 | Gemini 3.5 Flash, 3.1 Pro, 3.1 Flash Lite, 3.1 Flash Image, 3 Pro/Flash/Deep Think, 2.5 Pro, 2.5 Flash Lite, Gemma 4 (31B/26B A4B/12B/E4B/E2B), DiffusionGemma 26B A4B |
| Anthropic | 12 | **Claude Opus 5**, Sonnet 5, Fable 5, Mythos 5, Opus 4.8/4.7/4.6, Sonnet 4.6, Haiku 4.5, Opus 4.5, Sonnet 4.5, Opus 4.1 |
| DeepSeek | 8 | V4 Pro, V4 Flash, V3.2 Speciale, V3.2, R1-0528, R1, V3, Prover V2 |
| Alibaba | 8 | **Qwen3.8-Max**, Qwen3.7 Max, Qwen3.5, Qwen3.6-35B-A3B, Qwen3-235B, 30B, VL, Coder |
| Mistral AI | 6 | Mistral Medium 3.5, Large 3, Small 3.2, Magistral Medium/Small, Codestral |
| Meta | 5 | Muse Spark 1.1, Muse Spark, Llama 4 Maverick, Scout, Llama 3.3 70B |
| xAI | 5 | Grok 4.5, Grok 4.3, Grok 4.20, Grok 4, Grok 2.5 |
| Moonshot AI | 3 | Kimi K3, Kimi K2.7 Code, Kimi K2.6 |
| Microsoft | 2 | MAI-Thinking-1, Phi-4 |
| NVIDIA | 1 | Nemotron 3 Ultra 550B |
| Zhipu AI (Z.AI) | 1 | GLM-5.2 |
| MiniMax | 1 | MiniMax M3 |
| **Total** | **84** | Includes deprecated models with flags |

Open-weight models (Gemma 4, DeepSeek, Qwen3, Llama 4, Mistral, MiniMax, GLM-5, Kimi, NVIDIA Nemotron) can run directly on HHRI-AI H100s via vLLM. Deprecated models included for historical reference and reproducibility.

### 💻 Coding tab — 26 models across 2 weight classes

Sorted newest release first (independent of tier).

| Class | Count | Examples |
|---|---|---|
| Closed-weight | 10 | Claude Opus 5, GPT-5.6 (Sol/Terra/Luna), Grok 4.5, Claude Fable 5/Sonnet 5, Claude Opus 4.8, GPT-5.5, Gemini 3.1 Pro |
| Open-weight | 16 | Kimi K3, DeepSeek V4 Pro/Flash, Kimi K2.6/K2.7 Code, GLM-5.2, MiniMax M3, Qwen3-Coder-480B-A35B, Qwen3-Coder-Next, Qwen3.6-27B, DeepSeek Coder V2, Devstral Small 2, Codestral 25.01, StarCoder2-15B, NVIDIA Nemotron 3 Ultra 550B, IBM Granite Code 34B |

Filterable by tier (closed/open) and specialty (agentic, local/self-host, autocomplete/FIM). Each card shows: specialty, price, context window, license, benchmark scores (SWE-Bench Verified, SWE-Bench Pro, LiveCodeBench, HumanEval) color-coded by performance, H100-runnable badge, and official page link.

### 🏭 By Lab tab

One card per lab showing every benchmark they evaluated with:
- Exact API model string (e.g. `claude-opus-5`, `gemma-4-31b-it`, `deepseek-r1`)
- Score reported
- Context size and variant notes (crucial for long-context benchmarks)
- **Official source ↗** link to lab's technical report or model card

184 evaluation entries across 11 labs (Anthropic 43, Google DeepMind 30, Microsoft 27, OpenAI 26, HHRI-AI 11, xAI 11, DeepSeek 11, Alibaba 10, Meta 8, Mistral AI 6, NVIDIA 1).

### 📈 By Benchmark tab

One card per benchmark showing every lab that evaluated it with exact model API string and score. Includes **Verify scores ↗** links to authoritative leaderboards.

Cross-check resources: Artificial Analysis, BenchLM, Scale AI Leaderboard, LLM Stats, Papers With Code.

### 📖 Sources tab — 22 reference links

Technical reports, live leaderboards, and benchmark papers, including:
- Claude Opus 5 / Fable 5 & Mythos 5 system cards (Anthropic)
- MAI-Thinking-1 Technical Report §4.1 (Microsoft AI)
- Gemini 3.1 Pro model card + API changelog, Gemma 4 model card & developer guide (Google DeepMind)
- Qwen3 Technical Report (Alibaba)
- DeepSeek V4 Pro & R1-0528 release (DeepSeek)
- Llama 4 Technical Report (Meta)
- xAI Grok 4 & 4.3 release (xAI)
- Magistral & Mistral Large 3 release (Mistral AI)
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

*Last updated: August 2, 2026 — added Qwen3.8-Max (Alibaba, preview) and a Coding tab search bar; fixed the Models/Coding search "✕" clear buttons; Models tab now sorts newest-release-first within each lab. Total: 84 benchmarks across 12 domains, 84 frontier models across 13 labs, 26 coding specialist models, 22 sources.*
