#!/usr/bin/env python3
"""
FoxBrain benchmark.csv validator
=================================
Runs on every PR that touches results/benchmark.csv.
Writes validate_output.json for the GitHub Actions comment step.

Checks:
  1. No duplicate (task_name, metric) pairs
  2. n_samples rows present where needed
  3. Score values in valid ranges
  4. metric='n_samples' rows are not being formatted as percentages (sanity check)
  5. All FoxBrain model columns follow naming convention
"""

import os, sys, json
import pandas as pd

SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT   = os.path.dirname(SCRIPT_DIR)
CSV_PATH    = os.path.join(REPO_ROOT, "results", "benchmark.csv")

METADATA_METRICS = {"total_samples", "correct_samples", "total", "evaluated",
                    "task_accuracies", "n_samples"}

RATIO_METRICS  = {"accuracy", "mrcr_ratio", "prefix_exact_match", "success_rate",
                  "pass@1", "f1", "exact_match"}
COUNT_METRICS  = {"n_samples", "total_samples", "correct_samples", "total"}
SCORE_METRICS  = {"Total_Score"}  # 0–1 aggregate scores

errors   = []
warnings = []

def check(condition, msg, is_warning=False):
    if not condition:
        if is_warning:
            warnings.append(msg)
        else:
            errors.append(msg)


def main():
    print(f"[Validator] Checking {CSV_PATH}...")

    if not os.path.exists(CSV_PATH):
        errors.append(f"benchmark.csv not found at {CSV_PATH}")
        write_output(False)
        return

    try:
        df = pd.read_csv(CSV_PATH)
    except Exception as e:
        errors.append(f"Could not parse CSV: {e}")
        write_output(False)
        return

    model_cols = [c for c in df.columns if c not in ("task_name", "metric")]

    print(f"  Rows: {len(df)} | Model columns: {len(model_cols)}")

    # ── Check 1: Required columns ──────────────────────────────────────────────
    check("task_name" in df.columns, "Missing required column: task_name")
    check("metric"    in df.columns, "Missing required column: metric")

    # ── Check 2: No duplicate (task_name, metric) pairs ──────────────────────
    dupes = df[df.duplicated(subset=["task_name", "metric"], keep=False)]
    if not dupes.empty:
        for _, row in dupes.iterrows():
            errors.append(f"Duplicate row: task_name='{row['task_name']}' metric='{row['metric']}'")

    # ── Check 3: Score ranges ─────────────────────────────────────────────────
    for _, row in df.iterrows():
        metric = str(row.get("metric", "")).lower().strip()
        if metric in METADATA_METRICS:
            continue
        for col in model_cols:
            val = row[col]
            if pd.isna(val) or val == "":
                continue
            try:
                val = float(val)
            except:
                errors.append(f"Non-numeric value in {col} at task='{row['task_name']}' metric='{metric}': '{val}'")
                continue
            # Ratio metrics should be 0–1
            if metric in RATIO_METRICS or "ratio" in metric or "accuracy" in metric:
                check(0.0 <= val <= 1.0,
                      f"Out-of-range ratio in col='{col}' task='{row['task_name']}' metric='{metric}': {val} (expected 0–1)")
            # n_samples should be positive integers
            if metric == "n_samples":
                check(val > 0 and val == int(val),
                      f"Invalid n_samples value in col='{col}' task='{row['task_name']}': {val}",
                      is_warning=True)

    # ── Check 4: FoxBrain column naming convention ────────────────────────────
    foxbrain_cols = [c for c in model_cols if c.lower().startswith("foxbrain")]
    for col in foxbrain_cols:
        check(
            len(col.split("_")) >= 3,
            f"FoxBrain column '{col}' should follow format: FoxBrain_v{{version}}_{{date}}_{{notes}}",
            is_warning=True
        )

    # ── Check 5: MRCR rows have n_samples ────────────────────────────────────
    mrcr_tasks = df[df["task_name"].str.contains("MRCR", case=False, na=False)]["task_name"].unique()
    for task in mrcr_tasks:
        task_rows = df[df["task_name"] == task]["metric"].tolist()
        check(
            "n_samples" in task_rows or "mrcr_ratio" in task_rows,
            f"MRCR task '{task}' has no mrcr_ratio or n_samples rows",
            is_warning=True
        )

    # ── Summary ───────────────────────────────────────────────────────────────
    passed = len(errors) == 0

    lines = []
    if errors:
        lines.append(f"**{len(errors)} error(s):**")
        for e in errors:
            lines.append(f"- ❌ {e}")
    if warnings:
        lines.append(f"\n**{len(warnings)} warning(s):**")
        for w in warnings:
            lines.append(f"- ⚠️ {w}")
    if passed and not warnings:
        lines.append("All checks passed. No issues found.")
    elif passed:
        lines.append(f"\nValidation passed with {len(warnings)} warning(s).")

    summary = "\n".join(lines)
    print("\n" + summary)
    write_output(passed, summary)


def write_output(passed, summary=""):
    output = {"passed": passed, "summary": summary, "errors": errors, "warnings": warnings}
    with open("validate_output.json", "w") as f:
        json.dump(output, f, indent=2)
    print(f"\n[Validator] {'PASSED ✅' if passed else 'FAILED ❌'}")
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
