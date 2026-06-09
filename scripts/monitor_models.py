#!/usr/bin/env python3
"""
FoxBrain Frontier Monitor
=========================
Runs weekly via GitHub Actions. Scans:
  1. Hugging Face Hub  — new open-weight model releases
  2. arXiv cs.CL/cs.AI — new technical reports with benchmark tables
  3. Papers With Code  — new SOTA leaderboard entries

Uses Claude API to parse papers and extract benchmark names + scores.
Writes monitor_output.json for the GitHub Actions issue-creation step.

Usage:
    python scripts/monitor_models.py

Environment variables:
    ANTHROPIC_API_KEY   Required. Claude API key (direct or Vertex AI).
    HF_TOKEN            Optional. Increases HF Hub rate limits.
    LOOKBACK_DAYS       Optional. Default: 7.
    DRY_RUN             Optional. If 'true', prints output but does not write JSON.
"""

import os, sys, json, re, datetime, textwrap, time
import requests
import feedparser
from dateutil import parser as dateparser
from dateutil.tz import tzutc
import anthropic

# ── Configuration ──────────────────────────────────────────────────────────────

LOOKBACK_DAYS = int(os.environ.get("LOOKBACK_DAYS", "7"))
DRY_RUN       = os.environ.get("DRY_RUN", "false").lower() == "true"
HF_TOKEN      = os.environ.get("HF_TOKEN", "")

CUTOFF = datetime.datetime.now(tzutc()) - datetime.timedelta(days=LOOKBACK_DAYS)

# Orgs/authors whose model releases we care about (HF Hub)
TRACKED_ORGS = [
    "google", "anthropic", "meta-llama", "mistralai", "deepseek-ai",
    "Qwen", "microsoft", "nvidia", "cohere", "01-ai", "internlm",
    "tiiuae", "allenai", "EleutherAI", "together", "openchat",
]

# arXiv categories to monitor
ARXIV_FEEDS = [
    "https://rss.arxiv.org/rss/cs.CL",
    "https://rss.arxiv.org/rss/cs.AI",
]

# Keywords that suggest a paper contains benchmark evaluation tables
BENCHMARK_KEYWORDS = [
    "technical report", "benchmark", "evaluation", "leaderboard",
    "AIME", "SWE-bench", "LiveCodeBench", "MMLU", "GPQA", "IFEval",
    "HumanEval", "MATH-500", "BIG-Bench", "HellaSwag", "TruthfulQA",
    "we evaluate", "we report", "Table 1", "Table 2", "outperforms",
    "state-of-the-art", "SOTA", "frontier model",
]

# Benchmarks already tracked — to detect new ones
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT  = os.path.dirname(SCRIPT_DIR)
REGISTRY_PATH = os.path.join(REPO_ROOT, "docs", "benchmark_registry.json")

def load_registry():
    if os.path.exists(REGISTRY_PATH):
        with open(REGISTRY_PATH) as f:
            return json.load(f)
    return {"benchmarks": [], "last_updated": ""}

def known_benchmark_names(registry):
    return {b["name"].lower() for b in registry.get("benchmarks", [])}


# ── HuggingFace Hub scanner ─────────────────────────────────────────────────────

def scan_hf_hub():
    """Returns list of new model dicts released in the lookback window."""
    print(f"[HF Hub] Scanning for models released in last {LOOKBACK_DAYS} days...")
    headers = {}
    if HF_TOKEN:
        headers["Authorization"] = f"Bearer {HF_TOKEN}"

    new_models = []
    for org in TRACKED_ORGS:
        try:
            url = f"https://huggingface.co/api/models?author={org}&sort=lastModified&direction=-1&limit=10"
            r = requests.get(url, headers=headers, timeout=15)
            if r.status_code != 200:
                continue
            for m in r.json():
                last_mod = m.get("lastModified", "")
                if not last_mod:
                    continue
                mod_dt = dateparser.parse(last_mod)
                if mod_dt.tzinfo is None:
                    mod_dt = mod_dt.replace(tzinfo=tzutc())
                if mod_dt >= CUTOFF:
                    new_models.append({
                        "name": m.get("id", ""),
                        "org": org,
                        "last_modified": last_mod,
                        "url": f"https://huggingface.co/{m.get('id','')}",
                        "downloads": m.get("downloads", 0),
                        "likes": m.get("likes", 0),
                        "tags": m.get("tags", []),
                    })
            time.sleep(0.3)  # be polite to HF
        except Exception as e:
            print(f"  [HF Hub] Error scanning {org}: {e}")

    # Filter: only instruct/chat models, skip base/gguf/quantized
    filtered = []
    skip_keywords = ["gguf", "gptq", "awq", "quantiz", "-base", "embed", "reward", "classifier"]
    for m in new_models:
        name_lower = m["name"].lower()
        if any(k in name_lower for k in skip_keywords):
            continue
        if any(k in name_lower for k in ["instruct", "chat", "it", "thinking", "coder"]):
            filtered.append(m)
        elif m["likes"] > 50:  # catch high-interest models without explicit suffix
            filtered.append(m)

    print(f"  [HF Hub] Found {len(filtered)} new relevant models.")
    return filtered


# ── arXiv scanner ───────────────────────────────────────────────────────────────

def scan_arxiv():
    """Returns list of new paper dicts from cs.CL and cs.AI with benchmark keywords."""
    print(f"[arXiv] Scanning cs.CL + cs.AI feeds...")
    papers = []
    for feed_url in ARXIV_FEEDS:
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries:
                published = getattr(entry, "published_parsed", None)
                if published:
                    pub_dt = datetime.datetime(*published[:6], tzinfo=tzutc())
                    if pub_dt < CUTOFF:
                        continue
                title   = entry.get("title", "")
                summary = entry.get("summary", "")
                text    = (title + " " + summary).lower()
                if sum(1 for kw in BENCHMARK_KEYWORDS if kw.lower() in text) >= 3:
                    papers.append({
                        "title": title,
                        "summary": summary[:600],
                        "url": entry.get("link", ""),
                        "published": entry.get("published", ""),
                    })
            time.sleep(0.5)
        except Exception as e:
            print(f"  [arXiv] Error scanning {feed_url}: {e}")

    # Deduplicate by URL
    seen = set()
    deduped = []
    for p in papers:
        if p["url"] not in seen:
            seen.add(p["url"])
            deduped.append(p)

    print(f"  [arXiv] Found {len(deduped)} relevant papers.")
    return deduped


# ── Papers With Code scanner ────────────────────────────────────────────────────

def scan_papers_with_code():
    """Returns recent SOTA leaderboard entries from Papers With Code."""
    print("[PwC] Scanning Papers With Code SOTA...")
    # Key benchmark task slugs to monitor
    tasks = [
        "aime-2025", "math", "humaneval", "swe-bench",
        "mmlu", "gpqa", "ifeval", "truthfulqa",
    ]
    results = []
    for task in tasks:
        try:
            url = f"https://paperswithcode.com/api/v1/sota/?task={task}&format=json&limit=5"
            r = requests.get(url, timeout=10)
            if r.status_code != 200:
                continue
            data = r.json()
            for item in data.get("results", []):
                paper_date = item.get("paper", {}).get("published", "")
                if paper_date:
                    try:
                        pub_dt = dateparser.parse(paper_date)
                        if pub_dt.tzinfo is None:
                            pub_dt = pub_dt.replace(tzinfo=tzutc())
                        if pub_dt < CUTOFF:
                            continue
                    except:
                        pass
                results.append({
                    "task": task,
                    "model": item.get("model_name", ""),
                    "score": item.get("best_metric", {}).get("value", ""),
                    "paper_url": item.get("paper", {}).get("url_pdf", ""),
                    "paper_title": item.get("paper", {}).get("title", ""),
                })
            time.sleep(0.3)
        except Exception as e:
            print(f"  [PwC] Error scanning {task}: {e}")
    print(f"  [PwC] Found {len(results)} new SOTA entries.")
    return results


# ── Claude API: paper analysis ──────────────────────────────────────────────────

def analyze_papers_with_claude(papers, known_benchmarks):
    """
    Sends paper titles+abstracts to Claude API.
    Asks it to extract: model names, benchmark names, any benchmarks not in our registry.
    Returns structured extraction.
    """
    if not papers:
        return []

    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    # Batch papers into groups of 10 to stay within context
    batch_size = 10
    all_extractions = []

    for i in range(0, len(papers), batch_size):
        batch = papers[i:i+batch_size]
        paper_text = "\n\n".join([
            f"Paper {j+1}: {p['title']}\nAbstract: {p['summary']}\nURL: {p['url']}"
            for j, p in enumerate(batch)
        ])

        prompt = textwrap.dedent(f"""
            You are an AI research assistant helping track frontier LLM benchmarks.
            
            Below are {len(batch)} recent papers from arXiv cs.CL/cs.AI.
            
            For each paper, extract:
            1. Model names mentioned (new models being introduced or evaluated)
            2. Benchmark names used for evaluation
            3. Any benchmarks NOT in our known list below
            
            Known benchmarks (already tracked):
            {', '.join(sorted(known_benchmarks)[:60])}
            
            Papers:
            {paper_text}
            
            Respond ONLY with a JSON array. Each element:
            {{
              "paper_title": "...",
              "paper_url": "...",
              "models_mentioned": ["model1", "model2"],
              "benchmarks_used": ["bench1", "bench2"],
              "new_benchmarks": ["bench_not_in_known_list"],
              "is_new_model_release": true/false,
              "summary_one_line": "one sentence about what this paper is"
            }}
            
            Return only the JSON array, no markdown fences or other text.
        """).strip()

        try:
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
            raw = response.content[0].text.strip()
            # Strip markdown fences if present
            raw = re.sub(r'^```json\s*', '', raw)
            raw = re.sub(r'\s*```$', '', raw)
            extractions = json.loads(raw)
            all_extractions.extend(extractions)
        except Exception as e:
            print(f"  [Claude] Error analyzing batch {i//batch_size + 1}: {e}")

        time.sleep(1)  # rate limit

    return all_extractions


# ── Issue body builder ──────────────────────────────────────────────────────────

def build_issue(new_models, arxiv_papers, pwc_results, extractions, registry):
    """Builds a structured GitHub Issue body from all findings."""
    known = known_benchmark_names(registry)

    # Aggregate new benchmarks across all extractions
    all_new_benchmarks = {}
    for ext in extractions:
        for nb in ext.get("new_benchmarks", []):
            if nb.lower() not in known and len(nb) > 3:
                if nb not in all_new_benchmarks:
                    all_new_benchmarks[nb] = []
                all_new_benchmarks[nb].append(ext.get("paper_url", ""))

    # New model releases from Claude extraction
    model_release_papers = [e for e in extractions if e.get("is_new_model_release")]

    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    title = f"[Monitor] Frontier update — week of {date_str}"

    lines = [
        f"## 🔭 Frontier model & benchmark monitor — {date_str}",
        f"*Auto-generated by `monitor_models.py` · lookback: {LOOKBACK_DAYS} days*",
        "",
    ]

    # Section 1: New HF models
    lines += ["### 🤖 New open-weight model releases (Hugging Face Hub)", ""]
    if new_models:
        for m in new_models[:15]:
            tags = ", ".join([t for t in m.get("tags", []) if len(t) < 20][:5])
            lines.append(f"- **[{m['name']}]({m['url']})** — {m['org']} · ⬇️ {m['downloads']:,} · ❤️ {m['likes']}")
            if tags:
                lines.append(f"  - Tags: `{tags}`")
    else:
        lines.append("_No new open-weight releases found this week._")
    lines.append("")

    # Section 2: New model papers from arXiv
    lines += ["### 📄 New model / evaluation papers (arXiv cs.CL + cs.AI)", ""]
    if model_release_papers:
        for e in model_release_papers[:10]:
            lines.append(f"- **[{e['paper_title']}]({e['paper_url']})**")
            lines.append(f"  - {e['summary_one_line']}")
            if e.get("models_mentioned"):
                lines.append(f"  - Models: {', '.join(e['models_mentioned'][:5])}")
            if e.get("benchmarks_used"):
                lines.append(f"  - Benchmarks used: {', '.join(e['benchmarks_used'][:8])}")
    else:
        lines.append("_No new model release papers found this week._")
    lines.append("")

    # Section 3: New benchmarks not in our registry
    lines += ["### 🆕 New benchmarks detected (not in `benchmark_registry.json`)", ""]
    if all_new_benchmarks:
        lines.append("These appeared in ≥1 recent paper. Add to registry if they appear in ≥2 frontier reports:")
        for bname, urls in sorted(all_new_benchmarks.items()):
            url_links = ", ".join([f"[paper]({u})" for u in urls[:2] if u])
            lines.append(f"- `{bname}` — {url_links}")
    else:
        lines.append("_No new benchmarks detected beyond our current registry._")
    lines.append("")

    # Section 4: Papers With Code SOTA updates
    lines += ["### 🏆 Papers With Code SOTA updates", ""]
    if pwc_results:
        for p in pwc_results[:10]:
            lines.append(f"- **{p['task']}**: {p['model']} — score: {p['score']}")
    else:
        lines.append("_No new SOTA entries this week._")
    lines.append("")

    # Section 5: Action items
    lines += [
        "### ✅ Suggested actions",
        "",
        "- [ ] Review new HF models above — add any to `results/benchmark.csv` as new columns",
        "- [ ] Check new arXiv papers for benchmark scores to add to frontier baselines",
        "- [ ] Evaluate new benchmarks against your H100 pipeline compatibility",
        "- [ ] Update `docs/benchmark_registry.json` if new benchmarks are confirmed valuable",
        "",
        "---",
        "*Triggered by `.github/workflows/monitor.yml` · [View workflow](../../actions/workflows/monitor.yml)*",
    ]

    has_findings = bool(new_models or model_release_papers or all_new_benchmarks or pwc_results)

    return {
        "has_findings": has_findings,
        "issue_title": title,
        "issue_body": "\n".join(lines),
        "new_model_count": len(new_models),
        "new_paper_count": len(model_release_papers),
        "new_benchmark_count": len(all_new_benchmarks),
    }


# ── Main ────────────────────────────────────────────────────────────────────────

def main():
    print(f"\n{'='*60}")
    print(f"FoxBrain Frontier Monitor")
    print(f"Lookback: {LOOKBACK_DAYS} days | Dry run: {DRY_RUN}")
    print(f"Cutoff: {CUTOFF.strftime('%Y-%m-%d %H:%M UTC')}")
    print(f"{'='*60}\n")

    registry = load_registry()
    known    = known_benchmark_names(registry)
    print(f"[Registry] {len(registry.get('benchmarks', []))} known benchmarks loaded.\n")

    # Run all scanners
    new_models  = scan_hf_hub()
    arxiv_papers = scan_arxiv()
    pwc_results  = scan_papers_with_code()

    # Use Claude to parse arXiv papers
    extractions = []
    if arxiv_papers and os.environ.get("ANTHROPIC_API_KEY"):
        print(f"\n[Claude] Analyzing {len(arxiv_papers)} papers...")
        extractions = analyze_papers_with_claude(arxiv_papers, known)
        print(f"  [Claude] Extracted info from {len(extractions)} papers.")
    elif not os.environ.get("ANTHROPIC_API_KEY"):
        print("[Claude] Skipping paper analysis — ANTHROPIC_API_KEY not set.")

    # Build issue
    output = build_issue(new_models, arxiv_papers, pwc_results, extractions, registry)

    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  New HF models:     {output['new_model_count']}")
    print(f"  New model papers:  {output['new_paper_count']}")
    print(f"  New benchmarks:    {output['new_benchmark_count']}")
    print(f"  Has findings:      {output['has_findings']}")
    print(f"{'='*60}\n")

    if DRY_RUN:
        print("=== DRY RUN: Issue body preview ===\n")
        print(output["issue_body"])
    else:
        with open("monitor_output.json", "w") as f:
            json.dump(output, f, indent=2)
        print("Output written to monitor_output.json")

if __name__ == "__main__":
    main()
