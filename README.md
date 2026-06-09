# FoxBrain Evaluation Dashboard

**Private internal evaluation tracking for FoxBrain models at HHRI/Foxconn.**

Tracks FoxBrain model versions against frontier baselines across 9 capability domains and 47+ benchmarks, as used by leading frontier labs (MAI-Thinking-1, Gemini 2.5, Qwen3, Llama 4, Claude Sonnet 4.6).

---

## Architecture

```
foxbrain-eval-dashboard/
├── docs/                          # GitHub Pages site (private)
│   ├── index.html                 # Main dashboard
│   └── benchmark_registry.json   # Canonical benchmark definitions
├── results/
│   └── benchmark.csv             # All eval results (FoxBrain + frontier baselines)
├── scripts/
│   ├── monitor_models.py          # Scrapes HF Hub + arXiv for new model/benchmark releases
│   ├── update_registry.py         # Adds new benchmarks discovered by monitor
│   └── validate_csv.py            # Validates benchmark.csv structure before commit
├── .github/
│   └── workflows/
│       ├── monitor.yml            # Runs monitor_models.py weekly → opens GitHub Issues
│       └── validate.yml           # Runs validate_csv.py on every PR
└── README.md
```

---

## CSV format

`results/benchmark.csv` uses the same schema as your public TMMLU+ leaderboard so you can reuse your existing eval pipeline:

| Column | Description |
|---|---|
| `task_name` | Benchmark name (e.g. `AIME2025`, `SWE-Bench/verified`) |
| `metric` | Metric name (e.g. `accuracy`, `pass@1`, `mrcr_ratio`, `n_samples`) |
| `FoxBrain_v1.2_70B` | Model column — one per model |
| `FoxBrain_v1.5_...` | Additional FoxBrain versions |
| `claude-sonnet-4-6` | Frontier baseline columns |
| `gemini-2.5-pro` | ... |
| `gpt-5` | ... |
| `deepseek-r1` | ... |
| `qwen3-235b-a22b` | ... |
| `llama-4-maverick` | ... |

Rules:
- `n_samples` rows are automatically excluded from percentage display (already fixed in `docs/index.html`)
- Partial-coverage models (e.g. tau2-bench only) are allowed — they show `—` elsewhere
- FoxBrain model columns should use format: `FoxBrain_v{version}_{date}_{notes}`

---

## Benchmark domains tracked

| Domain | Key benchmarks | Source |
|---|---|---|
| STEM | AIME 2025/2026, GPQA Diamond, LiveCodeBench v6, MATH-500 | MAI-T1 Table 11 |
| Agentic coding | SWE-Bench Verified, SWE-Bench Pro, Aider Polyglot, τ-bench, τ²-bench | MAI-T1 Table 11 |
| Knowledge | MMLU-Pro, MMLU, SimpleQA, FRAMES, DROP | MAI-T1 Table 12 |
| Instruction following | IFEval, Multi-IF, AlpacaEval 2.0 | MAI-T1 Table 12 |
| Long context | MRCR v2, RULER, LOFT, LongBench v2 | MAI-T1 Table 12 |
| Safety | WildGuard, HarmBench, StrongREJECT, XSTest | MAI-T1 Table 12 |
| Honesty | SycophancyEval, TruthfulQA, FrontierMath | MAI-T1 Table 12 |
| Health | MedQA (USMLE), MedBench, JAMA Clinical | MAI-T1 Table 12 |
| Tool calling | BFCL v3, τ-bench tool use, API-Bank | MAI-T1 Table 12 |

Full benchmark registry with descriptions: `docs/benchmark_registry.json`

---

## GitHub Actions workflows

### 1. `monitor.yml` — Weekly frontier model & benchmark monitor

Runs every Monday at 09:00 Taiwan time (01:00 UTC).

**What it does:**
1. Queries Hugging Face Hub API for new open-weight model releases (past 7 days)
2. Queries arXiv cs.CL/cs.AI RSS for new technical reports mentioning benchmark tables
3. Queries Papers With Code leaderboards for new SOTA entries
4. Calls Claude API to extract benchmark names + scores from discovered papers
5. Compares against `docs/benchmark_registry.json`
6. Opens a structured GitHub Issue summarising:
   - New models released this week (open + closed weight)
   - New benchmarks appearing in ≥2 frontier reports
   - Suggested CSV column additions for new models

**Required secrets:**
```
ANTHROPIC_API_KEY      # For paper parsing (Claude API)
GH_TOKEN               # GitHub token with issues:write scope
HF_TOKEN               # HuggingFace read token (optional, increases rate limits)
```

### 2. `validate.yml` — CSV validation on every PR

Runs on every pull request that touches `results/benchmark.csv`.

**What it checks:**
- No duplicate `(task_name, metric)` pairs
- `n_samples` rows present for all benchmarks that need them
- Score values in valid range (0–1 for ratios, 0–100 for percentages, integers for counts)
- No column header changes without a corresponding `benchmark_registry.json` update

---

## Setup

### 1. Create the GitHub repo (private)

```bash
gh repo create HHRI-AI/foxbrain-eval-dashboard --private --description "FoxBrain internal evaluation dashboard"
cd foxbrain-eval-dashboard
git remote add origin git@github.com:HHRI-AI/foxbrain-eval-dashboard.git
```

### 2. Add GitHub secrets

In repo Settings → Secrets → Actions:
```
ANTHROPIC_API_KEY   → your Vertex AI key or direct Anthropic key
GH_TOKEN            → fine-grained PAT with contents:write, issues:write
HF_TOKEN            → huggingface.co read token
```

### 3. Enable GitHub Pages (optional, for private team access)

Settings → Pages → Source: `docs/` folder, branch: `main`

Access is gated by GitHub org membership — only HHRI-AI org members can view.

### 4. Push initial results

Copy your existing `benchmark.csv` from the TMMLU+ leaderboard as a starting point:
```bash
cp /path/to/tmmlu-leaderboard/results/benchmarkJune8.csv results/benchmark.csv
git add . && git commit -m "init: scaffold FoxBrain eval dashboard"
git push origin main
```

---

## Adding a new FoxBrain model run

1. Run your eval pipeline on the H100 server as usual
2. Add a new column to `results/benchmark.csv` with the model name
3. Fill in scores for completed benchmarks, leave blank (NaN) for others
4. Run `python scripts/validate_csv.py` to check for errors
5. Open a PR → `validate.yml` auto-checks the CSV
6. Merge → dashboard auto-updates

---

## Team

| Person | Role |
|---|---|
| Muhammad Saqlain | Lead — eval pipeline, dashboard maintenance |
| Kenny | Reviewer |
| Harry | Reviewer |
| Julia | Reviewer |

---

*Based on MAI-Thinking-1 Technical Report §4.1 benchmark taxonomy (Microsoft AI, June 2026)*
