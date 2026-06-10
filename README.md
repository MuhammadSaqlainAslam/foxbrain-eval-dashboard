# FoxBrain Benchmark & Frontier Model Reference

**A curated, up-to-date reference of benchmarks and frontier models used by leading AI labs.**

Maintained by the AI/ML Research team at [Hon Hai Research Institute (HHRI) / Foxconn](https://hhri.foxconn.com). Use this to select evaluation targets for FoxBrain model assessments across 9 capability domains.

---

## 🔗 Live reference page

👉 **[https://muhammadsaqlainaslam.github.io/foxbrain-eval-dashboard/](https://muhammadsaqlainaslam.github.io/foxbrain-eval-dashboard/)**

---

## What's inside

### Benchmarks tab
50 benchmarks across 9 capability domains, filterable and searchable.

| Domain | Key benchmarks |
|---|---|
| STEM | AIME 2025/2026, HLE, GPQA Diamond, LiveCodeBench v6, MATH-500, FrontierMath |
| Agentic coding | SWE-Bench Verified/Pro, Aider Polyglot, τ-bench, τ²-bench, Cybench |
| Knowledge | MMLU-Pro, MMLU, SimpleQA, FRAMES, DROP, TMMLU+, BigBenchHard |
| Instruction following | IFEval, Multi-IF, AlpacaEval 2.0, MT-Bench |
| Long context | MRCR v2, RULER, LOFT, LongBench v2 |
| Safety | WildGuard, HarmBench, StrongREJECT, XSTest, AIEC |
| Honesty | SycophancyEval, TruthfulQA |
| Health | MedQA (USMLE), MedBench, JAMA Clinical, ClinConsensus |
| Tool calling | BFCL v3, τ-bench tool, API-Bank |

Each benchmark shows:
- Capability domain and evaluation priority
- Primary metric (accuracy, pass@1, resolve_rate, etc.)
- Which frontier labs use it
- Description and relevance notes

### Frontier models tab
20 frontier models (open + closed weight), filterable by lab and weight type.

| Lab | Models |
|---|---|
| Anthropic | Claude **Fable 5**, **Mythos 5**, Opus 4.8, 4.7, 4.6 · Sonnet 4.6 |
| OpenAI | GPT-5.5, GPT-5.4, o3 |
| Google DeepMind | Gemini 3.1 Pro, Gemini 2.5 Pro |
| xAI | Grok 4.3 |
| Meta | Llama 4 Maverick |
| DeepSeek | DeepSeek V4 Pro, R1, V3 |
| Alibaba | Qwen3-235B-A22B, Qwen3.7 Max |
| Mistral AI | Mistral Large 3 |
| MiniMax | MiniMax M2.5 |
| Zhipu AI | GLM-5 |
| Moonshot AI | Kimi K2.5 |

Each model card shows weight type, release date, key benchmark scores, and whether it can run locally on H100s.

### Sources tab
10 reference sources with links — technical reports, live leaderboards, and benchmark papers.

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

*Curated by [Muhammad Saqlain](https://github.com/MuhammadSaqlainAslam) · HHRI / Foxconn AI Research Center*

*Benchmark taxonomy based on MAI-Thinking-1 Technical Report §4.1 (Microsoft AI, June 2026) and additional sources listed in the Sources tab.*
*Last updated: June 9, 2026 — added Claude Fable 5 & Mythos 5, FrontierCode Diamond, Terminal-Bench 2.1, HealthBench Professional, ExploitBench, GDPval-AA, CursorBench 3.1*
