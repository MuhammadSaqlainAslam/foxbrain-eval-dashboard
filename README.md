# FoxBrain EvalHub
### Frontier Benchmark & Model Intelligence — HHRI-AI Research

**A curated, up-to-date reference of benchmarks and frontier models used by leading AI labs. Use this to select evaluation targets for FoxBrain model assessments across 9 capability domains.**

---

## 🔗 Live reference page

👉 **[https://muhammadsaqlainaslam.github.io/foxbrain-eval-dashboard/](https://muhammadsaqlainaslam.github.io/foxbrain-eval-dashboard/)** — *FoxBrain EvalHub*

---

## What's inside

### 📊 Benchmarks tab — 55 benchmarks across 9 domains

| Domain | Key benchmarks |
|---|---|
| STEM | AIME 2025/2026, HLE, GPQA Diamond, LiveCodeBench v6, MATH-500, FrontierMath, OlympiadBench, MathVista |
| Agentic coding | SWE-Bench Verified/Pro, FrontierCode Diamond, Terminal-Bench 2.1, Aider Polyglot, CursorBench 3.1, τ-bench, τ²-bench |
| Knowledge | MMLU-Pro, MMLU, MMMLU, MMMU Pro, SimpleQA, FRAMES, DROP, GDPval-AA, TMMLU+, BigBenchHard |
| Instruction following | IFEval, Multi-IF, AlpacaEval 2.0, MT-Bench, Arena ELO |
| Long context | MRCR v2, RULER, LOFT, LongBench v2 |
| Safety | WildGuard, HarmBench, ExploitBench, StrongREJECT, XSTest, AIEC |
| Honesty | SycophancyEval, TruthfulQA |
| Health | MedQA (USMLE), HealthBench Professional, MedBench, JAMA Clinical, ClinConsensus |
| Tool calling | BFCL v3, τ-bench tool, API-Bank |

Each benchmark shows domain, priority, metric, which frontier labs use it, and description.

### 🤖 Frontier models tab — 72 models across 9 labs

| Lab | Models | Notable |
|---|---|---|
| Anthropic | 10 | Fable 5, Mythos 5, Opus 4.8/4.7/4.6, Sonnet 4.6, Haiku 4.5, Opus 4.5/4.1 |
| OpenAI | 14 | GPT-5.5, GPT-5.4 (4 variants), GPT-5.2, GPT-5, o3, o3-pro, gpt-oss-20b/120b |
| Google DeepMind | 13 | Gemini 3.5 Flash, 3.1 Pro, 3 Flash, 2.5 Pro + Gemma 4 full family (6 models) |
| Meta | 3 | Llama 4 Maverick, Scout, Llama 3.3 70B |
| DeepSeek | 7 | V4 Pro, V3.2 Speciale, R1-0528, R1, V3, Prover V2 |
| Alibaba | 6 | Qwen3.5, Qwen3.7 Max, Qwen3-235B, 30B, VL, Coder |
| xAI | 4 | Grok 4.3, 4.20, 4, Grok 2.5 |
| Mistral AI | 5 | Mistral Large 3, Small 3.2, Magistral Medium/Small, Codestral |
| Other | 7 | MiniMax M2.5, GLM-5, Kimi K2.5, NVIDIA Nemotron x2, MAI-Thinking-1, Phi-4 |
| **Total** | **72** | Includes deprecated models with flags |

> Open-weight models marked with Apache 2.0 or MIT license can run directly on HHRI-AI H100s via vLLM. Deprecated models are included for historical reference and reproducibility.

### 📖 Sources tab — 12 reference links

Technical reports, live leaderboards, and benchmark papers including Gemma 4 model card, MAI-Thinking-1, Gemini 3.1, Qwen3, DeepSeek, Llama 4, HLE, ClinConsensus, Scale AI, Artificial Analysis, and Vellum leaderboards.

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
│   ├── index.html                 # Live reference page
│   └── benchmark_registry.json   # Canonical benchmark definitions (JSON)
├── results/
│   └── benchmark.csv             # Evaluation results (for future use)
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

- 📊 **TMMLU+ Public Leaderboard** — [muhammadsaqlainaslam.github.io/tmmlu-leaderboard](https://muhammadsaqlainaslam.github.io/tmmlu-leaderboard/)
- 📁 **TMMLU+ GitHub repo** — [github.com/MuhammadSaqlainAslam/tmmlu-leaderboard](https://github.com/MuhammadSaqlainAslam/tmmlu-leaderboard)

---

*Curated by [Muhammad Saqlain](https://github.com/MuhammadSaqlainAslam) · HHRI-AI / Foxconn AI Research Center*

*Benchmark taxonomy based on MAI-Thinking-1 Technical Report §4.1 (Microsoft AI, June 2026) and additional sources listed in the Sources tab.*
*Last updated: June 15, 2026 — expanded to 72 frontier models across 9 labs with all variants, deprecated flags, and exact API strings*
