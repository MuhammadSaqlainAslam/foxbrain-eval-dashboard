# FoxBrain Benchmark Priority Radar — handoff

## Goal
Priority radar of benchmarks for FoxBrain, using ONLY benchmarks that appear in the FoxBrain EvalHub "Priority View" tab (do not add others, e.g. CRUXEval/MedQA/EvoEval were rejected by the user).

## Deliverable structure (3 slides)
1. Act Now — rings CRITICAL + HIGH (radar, numbered dots + right panel of names)
2. Roadmap — rings MEDIUM + MONITOR (same layout)
3. Full roadmap table (7 domains x CRITICAL/HIGH/MEDIUM/MONITOR)

## Files
- html/index.html, slide1-3.html — self-contained, open in a browser
- FoxBrain_Benchmark_Priority_Radar.pptx — pptxgenjs output (LAYOUT_WIDE 13.33x7.5in)
- renders/ — PNG renders of the PPTX
- source/build.js (PPTX generator), source/gen_html.js (HTML generator); both share the same benchmark data, so keep them in sync

## Design decisions / history
- 47 inline labels overlapped badly, so the radar was split into 2 slides (user chose "Option B").
- User then asked: "Don't show numbering, write name of the benchmarks."
- Tried names directly on radar (radial offsets, staggering, leader lines): all collided in the CRITICAL ring (Knowledge & Language, Agents & Tools have 3-4 critical items in narrow wedges).
- Current state: numbered dots + right-side name panel. This does NOT satisfy the literal request.

## Open item
Put benchmark names directly on the radar with no numbering. Untried ideas: collision-aware label placement (greedy/force-based with bounding boxes), larger radar (drop the side panel), one domain per slide, or a bar/lollipop layout per domain.
