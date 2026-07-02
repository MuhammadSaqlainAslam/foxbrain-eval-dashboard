# FoxBrain EvalHub
### Frontier Benchmark & Model Intelligence — HHRI-AI Research

**A curated, up-to-date reference of benchmarks and frontier models used by leading AI labs. Use this to select evaluation targets for FoxBrain model assessments across 9 capability domains.**

---

## 🔗 Live reference page

👉 **[https://muhammadsaqlainaslam.github.io/foxbrain-eval-dashboard/](https://muhammadsaqlainaslam.github.io/foxbrain-eval-dashboard/)** — *FoxBrain EvalHub*

---

## What's inside

### 📊 Benchmarks tab — 65 benchmarks across 9 domains

| Domain | Key benchmarks |
|---|---|
| STEM | AIME 2025/2026, HLE, GPQA Diamond, ARC-AGI-2, LiveCodeBench v6, MATH-500, FrontierMath, OlympiadBench, MathVista |
| Agentic coding | SWE-Bench Verified/Pro, FrontierCode Diamond, Terminal-Bench 2.1, Aider Polyglot, CursorBench 3.1, τ-bench, τ²-bench, Cybench |
| Knowledge | MMLU-Pro, MMLU, MMMLU, MMMU Pro, SimpleQA, FRAMES, DROP, GDPval-AA, TMMLU+, BigBenchHard |
| Instruction following | IFEval, Multi-IF, AlpacaEval 2.0, MT-Bench, Arena ELO, IFBench |
| Long context | MRCR v2, MRCR v1, RULER, LOFT, LongBench v2, NoLiMa, InfiniteBench, LV-Eval |
| Safety | WildGuard, HarmBench, ExploitBench, StrongREJECT, XSTest, AIEC |
| Honesty | SycophancyEval, TruthfulQA |
| Health | MedQA (USMLE), HealthBench Professional, MedBench, JAMA Clinical, ClinConsensus |
| Tool calling | BFCL v3, τ-bench tool, API-Bank |

Each benchmark shows: domain, priority, primary metric, which labs use it, description, and a **Verify scores ↗** link to the authoritative leaderboard.

> ⚠️ **Score verification note:** Always check needle count and context size when comparing MRCR scores. The same model can show 91.5% (4-needle, 128K) vs 54% (8-needle, 128K). Use the verify links to confirm variant used.

### 🤖 Frontier models tab — 82 models across 10 labs

| Lab | Count | Notable models |
|---|---|---|
| Anthropic | 12 | **Claude Sonnet 5**, Fable 5, Mythos 5, Opus 4.8/4.7/4.6, Sonnet 4.6, Haiku 4.5, Opus 4.5/4.1 |
| OpenAI | 14 | GPT-5.5, GPT-5.4 (Thinking/Pro/mini/nano), GPT-5.2, GPT-5, o3, o3-pro, gpt-oss-20b/120b |
| Google DeepMind | 14 | Gemini 3.5 Flash, 3.1 Pro, 3.1 Flash Image, 3.1 Flash Lite, Gemma 4 family (6 models), Gemini 3 Flash, 2.5 Pro |
| DeepSeek | 8 | V4 Pro, V4 Flash, V3.2 Speciale, V3.2, R1-0528, R1, V3, Prover V2 |
| Alibaba | 7 | Qwen3.5, Qwen3.6-35B-A3B, Qwen3.7 Max, Qwen3-235B, 30B, VL, Coder |
| Mistral AI | 6 | Mistral Large 3, Small 3.2, Medium 3.5 (NEW), Magistral Medium/Small, Codestral |
| xAI | 4 | Grok 4.3, Grok 4.20, Grok 4, Grok 2.5 |
| Meta | 3 | Llama 4 Maverick, Scout, Llama 3.3 70B |
| NVIDIA | 3 | Nemotron Ultra 550B (NEW), Nemotron-3 Super 120B, Nemotron-3 Nano 30B |
| Moonshot AI | 3 | Kimi K2.7 Code, Kimi K2.6, (K2.5 deprecated) |
| Microsoft | 2 | MAI-Thinking-1, Phi-4 |
| Zhipu AI | 1 | GLM-5.2 |
| MiniMax | 1 | MiniMax M3 |
| **Total** | **82** | Includes deprecated models with flags |

Open-weight models (Gemma 4, DeepSeek, Qwen3, Llama 4, Mistral, MiniMax, GLM-5, Kimi, NVIDIA Nemotron) can run directly on HHRI-AI H100s via vLLM. Deprecated models included for historical reference and reproducibility.

### 🏭 By Lab tab

One card per lab showing every benchmark they evaluated with:
- Exact API model string (e.g. `claude-opus-4-6`, `gemma-4-31b-it`, `deepseek-r1`)
- Score reported
- Context size and variant notes (crucial for long-context benchmarks)
- **Official source ↗** link to lab's technical report or model card

171 evaluation entries across 10 labs (Anthropic 34, Google DeepMind 28, Microsoft 27, OpenAI 25, HHRI-AI 11, xAI 11, DeepSeek 11, Alibaba 10, Meta 8, Mistral AI 6).

### 📈 By Benchmark tab

One card per benchmark showing every lab that evaluated it with exact model API string and score. Includes **Verify scores ↗** links to authoritative leaderboards.

Cross-check resources: Artificial Analysis, BenchLM, Scale AI Leaderboard, LLM Stats, Papers With Code.

### 📖 Sources tab — 21 reference links

Technical reports, live leaderboards, and benchmark papers:
- Claude Fable 5 & Mythos 5 system card (Anthropic)
- MAI-Thinking-1 Technical Report §4.1 (Microsoft AI)
- Gemini 3.1 Pro model card + API changelog (Google DeepMind)
- Gemma 4 model card & developer guide (Google DeepMind)
- Qwen3 Technical Report (Alibaba)
- DeepSeek V4 Pro & R1-0528 release (DeepSeek)
- Llama 4 Technical Report (Meta)
- xAI Grok 4 & 4.3 release (xAI)
- Magistral & Mistral Large 3 release (Mistral AI)
- HLE — Humanity's Last Exam (Center for AI Safety / Scale AI)
- ClinConsensus Benchmark (arXiv 2603.02097)
- Scale AI Leaderboard (updated continuously)
- Artificial Analysis Intelligence Index (updated continuously)
- Vellum LLM Leaderboard (updated continuously)
- OpenAI Model Release Notes & API Changelog
- Gemini API Release Notes (Google DeepMind)
- DeepSeek V3 / R1 Technical Report (DeepSeek)

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

*Last updated: July 2, 2026 — 82 models, 65 benchmarks, 21 sources. Added Claude Sonnet 5, NVIDIA Nemotron Ultra 550B, Kimi K2.6/K2.7, GLM-5.2, MiniMax M3, DeepSeek V4 Flash, Mistral Medium 3.5, Gemini 3.1 Flash Image. Added official links to all model cards.*
