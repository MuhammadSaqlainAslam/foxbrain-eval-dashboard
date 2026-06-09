#!/usr/bin/env python3
"""
update_registry.py
==================
Adds a new benchmark to docs/benchmark_registry.json.

Usage:
    python scripts/update_registry.py \
        --name "NewBench" \
        --domain "stem" \
        --priority "high" \
        --metric "accuracy" \
        --description "Brief description" \
        --source "Paper title or URL" \
        --tags "math,reasoning"

Or run interactively:
    python scripts/update_registry.py --interactive
"""

import os, sys, json, argparse, datetime

SCRIPT_DIR    = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT     = os.path.dirname(SCRIPT_DIR)
REGISTRY_PATH = os.path.join(REPO_ROOT, "docs", "benchmark_registry.json")

VALID_DOMAINS   = ["stem", "agentic", "knowledge", "instruction", "longctx",
                   "safety", "honesty", "health", "tool"]
VALID_PRIORITY  = ["high", "medium", "low"]


def load_registry():
    if os.path.exists(REGISTRY_PATH):
        with open(REGISTRY_PATH) as f:
            return json.load(f)
    return {"benchmarks": [], "last_updated": "", "version": "1.0"}


def save_registry(registry):
    registry["last_updated"] = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    with open(REGISTRY_PATH, "w") as f:
        json.dump(registry, f, indent=2, ensure_ascii=False)
    print(f"Registry saved to {REGISTRY_PATH}")


def add_benchmark(registry, name, domain, priority, metric, description, source, tags):
    # Check for duplicate
    existing_names = [b["name"].lower() for b in registry["benchmarks"]]
    if name.lower() in existing_names:
        print(f"Warning: '{name}' already exists in registry. Skipping.")
        return False

    entry = {
        "name": name,
        "domain": domain,
        "priority": priority,
        "primary_metric": metric,
        "description": description,
        "source": source,
        "tags": [t.strip() for t in tags.split(",") if t.strip()],
        "added": datetime.datetime.utcnow().strftime("%Y-%m-%d"),
        "in_mai_thinking_1": False,  # set to True if from Tables 11/12
    }
    registry["benchmarks"].append(entry)
    print(f"Added: {name} ({domain}, {priority})")
    return True


def interactive_mode(registry):
    print("\nAdd a new benchmark to the FoxBrain registry")
    print("=" * 45)
    name        = input("Benchmark name: ").strip()
    print(f"Domains: {', '.join(VALID_DOMAINS)}")
    domain      = input("Domain: ").strip()
    print(f"Priority: {', '.join(VALID_PRIORITY)}")
    priority    = input("Priority: ").strip()
    metric      = input("Primary metric (e.g. accuracy, pass@1, mrcr_ratio): ").strip()
    description = input("Description (1–2 sentences): ").strip()
    source      = input("Source paper/URL: ").strip()
    tags        = input("Tags (comma-separated): ").strip()

    if domain not in VALID_DOMAINS:
        print(f"Invalid domain '{domain}'. Must be one of: {VALID_DOMAINS}")
        sys.exit(1)
    if priority not in VALID_PRIORITY:
        print(f"Invalid priority '{priority}'. Must be one of: {VALID_PRIORITY}")
        sys.exit(1)

    add_benchmark(registry, name, domain, priority, metric, description, source, tags)
    save_registry(registry)


def main():
    parser = argparse.ArgumentParser(description="Add a benchmark to the FoxBrain registry")
    parser.add_argument("--name",        help="Benchmark name")
    parser.add_argument("--domain",      help=f"Domain: {VALID_DOMAINS}")
    parser.add_argument("--priority",    help=f"Priority: {VALID_PRIORITY}")
    parser.add_argument("--metric",      help="Primary metric name", default="accuracy")
    parser.add_argument("--description", help="Description")
    parser.add_argument("--source",      help="Source paper/URL", default="")
    parser.add_argument("--tags",        help="Comma-separated tags", default="")
    parser.add_argument("--interactive", action="store_true", help="Interactive mode")
    parser.add_argument("--list",        action="store_true", help="List all registered benchmarks")
    args = parser.parse_args()

    registry = load_registry()

    if args.list:
        print(f"\nFoxBrain Benchmark Registry ({len(registry['benchmarks'])} benchmarks)")
        print(f"Last updated: {registry.get('last_updated', 'unknown')}\n")
        by_domain = {}
        for b in registry["benchmarks"]:
            by_domain.setdefault(b["domain"], []).append(b)
        for domain in VALID_DOMAINS:
            if domain in by_domain:
                print(f"\n{domain.upper()}")
                for b in by_domain[domain]:
                    print(f"  [{b['priority']:6s}] {b['name']:30s} — {b['description'][:60]}")
        return

    if args.interactive:
        interactive_mode(registry)
        return

    if not all([args.name, args.domain, args.priority, args.description]):
        parser.print_help()
        sys.exit(1)

    if args.domain not in VALID_DOMAINS:
        print(f"Invalid domain. Must be one of: {VALID_DOMAINS}")
        sys.exit(1)
    if args.priority not in VALID_PRIORITY:
        print(f"Invalid priority. Must be one of: {VALID_PRIORITY}")
        sys.exit(1)

    added = add_benchmark(registry, args.name, args.domain, args.priority,
                          args.metric, args.description, args.source, args.tags)
    if added:
        save_registry(registry)


if __name__ == "__main__":
    main()
