# FoxBrain Benchmark Priority Radar — handoff

## Goal
A 3-slide deck showing which benchmarks FoxBrain should evaluate, by priority ring (CRITICAL / HIGH / MEDIUM / MONITOR) and capability domain.
- Slide 1 "Act Now": CRITICAL + HIGH radar
- Slide 2 "Roadmap": MEDIUM + MONITOR radar
- Slide 3: full roadmap table (7 domains x 4 priorities)

## Files
- `slide1.html`, `slide2.html`, `slide3.html`, `index.html` — HTML export (open in a browser; scales to window, 16:9)
- `data.json` — all domains, benchmarks, ring (1=CRITICAL..4=MONITOR), `done` flag
- `build.js` — pptxgenjs generator for the PPTX (data lives at the top: `domains`, `ALL_RINGS`)
- `export_html.js` — generates the HTML + data.json from `build.js` data. Run: `node export_html.js`
- `FoxBrain_Benchmark_Priority_Radar.pptx` — current PPTX output (`node build.js` regenerates it)

## Hard rules from the user
- ONLY use benchmarks that appear in the FoxBrain EvalHub **Priority View** tab. The user rejected earlier invented ones (CRUXEval, MedQA, EvoEval, etc.). Do not add any.
- Priority reflects FoxBrain relevance, not benchmark popularity. `done: true` = already evaluated at HHRI-AI (shown green with a check mark).

## OPEN ISSUE (unresolved)
The user's last request was: **"Don't show numbering, write name of the benchmarks"** on the radar itself.
I tried three layouts for names directly on the radar (labels beside dots, staggered radii, leader lines). All collided badly, especially in the CRITICAL ring for Knowledge & Language and Agents & Tools. I fell back to numbered dots plus a right-hand name panel, which is clean but does NOT satisfy the request as worded. The user has not yet confirmed that fallback is acceptable.

Ideas to try next:
- A greedy label-placement pass with collision detection (push labels outward, add leader lines only when displaced).
- Give the radar a larger canvas (drop the right panel, larger ring radii) and put names in fanned columns left/right of the radar with leader lines.
- Split CRITICAL into its own slide, since it holds the densest cluster.

## Notes
- PPTX canvas: LAYOUT_WIDE 13.33 x 7.5 in. HTML uses the same geometry at 100 px per inch (1333 x 750).
- Radar geometry: centre (5.2, 3.9) in, ring radii 0.82 / 1.58 / 2.30 / 3.00 in, start angle -75 deg, wedge width proportional to each domain's `span`.
- Everything is committed and pushed to `main` on github.com/MuhammadSaqlainAslam/foxbrain-eval-dashboard except this handoff folder.
