const pptxgen = require('pptxgenjs');

// ─── DATA ────────────────────────────────────────────────────────────────────
// ring: 1=critical  2=high  3=medium  4=monitor
// done: hhri:true in EvalHub
const domains = [
  {
    label: 'Reasoning\n& Math', color: 'E85D4A', span: 1.8,
    benchmarks: [
      { name: 'HLE',          ring: 1, done: true  },
      { name: 'FrontierMath', ring: 1, done: false },
      { name: 'AIME 2025',    ring: 2, done: false },
      { name: 'AIME 2026',    ring: 2, done: false },
      { name: 'ARC-AGI-2',    ring: 2, done: false },
      { name: 'MATH-500',     ring: 3, done: false },
      { name: 'GPQA Diamond', ring: 4, done: false },
      { name: 'MMLU-Pro',     ring: 4, done: false },
    ]
  },
  {
    label: 'Coding\n& SWE', color: '4A90D9', span: 1.8,
    benchmarks: [
      { name: 'SWE-Bench Pro',          ring: 1, done: false },
      { name: 'Terminal-Bench 4.0',     ring: 1, done: false },
      { name: 'FrontierCode Diamond',   ring: 1, done: false },
      { name: 'LiveCodeBench v6',       ring: 2, done: false },
      { name: 'DeepSWE v1.1',           ring: 2, done: false },
      { name: 'SWE-Bench Multilingual', ring: 2, done: false },
      { name: 'BigCodeBench',           ring: 3, done: false },
      { name: 'SciCode',                ring: 3, done: false },
    ]
  },
  {
    label: 'Long\nContext', color: '7B68EE', span: 0.9,
    benchmarks: [
      { name: 'MRCR v2',        ring: 1, done: true  },
      { name: 'GraphWalks BFS', ring: 2, done: false },
      { name: 'NoLiMa',         ring: 2, done: false },
      { name: 'RULER',          ring: 2, done: false },
      { name: 'LongBench v2',   ring: 3, done: false },
    ]
  },
  {
    label: 'Multimodal', color: 'F0A500', span: 1.8,
    benchmarks: [
      { name: 'MathVista',   ring: 2, done: true  },
      { name: 'MMMU-Pro',    ring: 2, done: false },
      { name: 'CharXiv',     ring: 3, done: false },
      { name: 'CharXiv-R',   ring: 3, done: false },
      { name: 'DocVQA',      ring: 3, done: false },
      { name: 'MathVision',  ring: 3, done: false },
      { name: 'MMVU',        ring: 3, done: false },
      { name: 'Chartography',ring: 3, done: false },
    ]
  },
  {
    label: 'Agents\n& Tools', color: '3DAA6E', span: 1.5,
    benchmarks: [
      { name: 'MCP Atlas',        ring: 1, done: false },
      { name: 'tau2-bench',       ring: 1, done: true  },
      { name: 'Agents Last Exam', ring: 1, done: false },
      { name: 'BrowseComp',       ring: 2, done: false },
      { name: 'OSWorld 2.0',      ring: 2, done: false },
      { name: 'BFCL v4',          ring: 2, done: false },
      { name: 'Toolathlon',       ring: 2, done: false },
      { name: 'APEX-Agents',      ring: 3, done: false },
    ]
  },
  {
    label: 'Knowledge\n& Language', color: '9B59B6', span: 1.2,
    benchmarks: [
      { name: 'TMMLU+',        ring: 1, done: true  },
      { name: 'TW-LegalBench', ring: 1, done: false },
      { name: 'AIEC',          ring: 1, done: true  },
      { name: 'MMMLU',         ring: 2, done: false },
      { name: 'GDPval-AA',     ring: 2, done: false },
      { name: 'IFEval',        ring: 2, done: false },
      { name: 'SimpleQA',      ring: 3, done: false },
      { name: 'DRCD',          ring: 3, done: false },
    ]
  },
  {
    label: 'Data\n& ML', color: 'E8A020', span: 0.8,
    benchmarks: [
      { name: 'MLE-Bench',       ring: 2, done: false },
      { name: 'DSBench',         ring: 2, done: false },
      { name: 'SpreadsheetBench',ring: 3, done: false },
    ]
  },
];

// Per-domain sequential index on every benchmark
domains.forEach(d => d.benchmarks.forEach((b, i) => { b._idx = i + 1; }));

// ─── RING DEFS ───────────────────────────────────────────────────────────────
const ALL_RINGS = [
  { id:1, label:'CRITICAL', r:0.82, bg:'CC3322', bgAlpha:88, textColor:'FF9088', dotDefault:'FF9088' },
  { id:2, label:'HIGH',     r:1.58, bg:'B8860B', bgAlpha:78, textColor:'FFD060', dotDefault:'FFD060' },
  { id:3, label:'MEDIUM',   r:2.30, bg:'1A3E5A', bgAlpha:78, textColor:'70B8E8', dotDefault:'70B8E8' },
  { id:4, label:'MONITOR',  r:3.00, bg:'111A28', bgAlpha:65, textColor:'A8A8E8', dotDefault:'A8A8E8' },
];

// ─── COLORS ──────────────────────────────────────────────────────────────────
const DONE_COLOR  = '00E5A0';
const BG_COLOR    = '0D1B2A';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const W = 13.33, H = 7.5;
const cx = 5.2, cy = 3.90;       // radar centre
const START_OFFSET = -75;

function toRad(deg) { return deg * Math.PI / 180; }
function polar(ox, oy, r, deg) {
  const a = toRad(deg - 90);
  return { x: ox + r * Math.cos(a), y: oy + r * Math.sin(a) };
}

// ─── PRESENTATION ────────────────────────────────────────────────────────────
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.theme  = { headFontFace: 'Cambria', bodyFontFace: 'Calibri' };

// ── Precompute wedge angles (shared across both radar slides) ──
const totalSpan = domains.reduce((s, d) => s + d.span, 0);
let cumAngle = START_OFFSET;
domains.forEach(d => {
  d.startAngle = cumAngle;
  d.wedgeAngle = (d.span / totalSpan) * 360;
  d.midAngle   = cumAngle + d.wedgeAngle / 2;
  cumAngle    += d.wedgeAngle;
});

// ═══════════════════════════════════════════════════════════════════════════
// SHARED RADAR BUILDER
// activeRingIds: array of ring ids (1-4) to show on this slide
// ═══════════════════════════════════════════════════════════════════════════
function buildRadar(slide, activeRingIds, title, subtitle, legendItems) {
  const activeRings = ALL_RINGS.filter(r => activeRingIds.includes(r.id));
  const outerRing   = activeRings[activeRings.length - 1];

  // Background
  slide.addShape(pres.ShapeType.rect, {
    x:0, y:0, w:W, h:H, fill:{ color: BG_COLOR }, line:{ type:'none' }
  });

  // ── Spoke lines ──
  domains.forEach(d => {
    const end = polar(cx, cy, outerRing.r + 0.20, d.startAngle);
    slide.addShape(pres.ShapeType.line, {
      x: cx, y: cy, w: end.x - cx, h: end.y - cy,
      line: { color: '1E3A52', width: 0.5, dashType: 'dash' }
    });
  });

  // ── Concentric rings (outer → inner) ──
  for (let i = activeRings.length - 1; i >= 0; i--) {
    const ring = activeRings[i];
    slide.addShape(pres.ShapeType.ellipse, {
      x: cx - ring.r, y: cy - ring.r, w: ring.r*2, h: ring.r*2,
      fill: { color: ring.bg, transparency: ring.bgAlpha },
      line: { color: ring.bg, width: 1.5, transparency: 55 }
    });
  }

  // ── Ring labels at ~152° ──
  activeRings.forEach(ring => {
    const pos = polar(cx, cy, ring.r - 0.10, 152);
    slide.addText(ring.label, {
      x: pos.x - 1.05, y: pos.y - 0.13,
      w: 1.02, h: 0.24,
      fontSize: 7.5, bold: true, color: ring.textColor,
      align: 'right', isTextBox: true, margin: 0,
    });
  });

  // ── Dots ──
  domains.forEach(domain => {
    const activeBenches = domain.benchmarks.filter(b => activeRingIds.includes(b.ring));
    const byRing = {};
    activeBenches.forEach(b => {
      if (!byRing[b.ring]) byRing[b.ring] = [];
      byRing[b.ring].push(b);
    });

    activeRingIds.forEach(ringId => {
      const benches = byRing[ringId];
      if (!benches || benches.length === 0) return;
      const ri  = ALL_RINGS.findIndex(r => r.id === ringId);
      const prevR = ri > 0 ? ALL_RINGS[ri-1].r : 0;
      const thisR = ALL_RINGS[ri].r;
      const midR  = (prevR + thisR) / 2 + 0.05;
      const count = benches.length;
      const ringDef = ALL_RINGS[ri];

      benches.forEach((bench, bi) => {
        const pad   = count === 1 ? 0.5 : 0.15;
        const t     = count === 1 ? 0.5 : pad + (bi / (count-1)) * (1 - 2*pad);
        const angle = domain.startAngle + t * domain.wedgeAngle;
        const pos   = polar(cx, cy, midR, angle);

        const isDone = bench.done;
        const dotColor = isDone ? DONE_COLOR : domain.color;
        const dotR     = isDone ? 0.075 : 0.058;

        // Halo for done
        if (isDone) {
          slide.addShape(pres.ShapeType.ellipse, {
            x: pos.x - 0.14, y: pos.y - 0.14, w: 0.28, h: 0.28,
            fill: { color: DONE_COLOR, transparency: 62 },
            line: { color: DONE_COLOR, width: 1.0 }
          });
        }
        // Dot
        slide.addShape(pres.ShapeType.ellipse, {
          x: pos.x - dotR, y: pos.y - dotR, w: dotR*2, h: dotR*2,
          fill: { color: dotColor },
          line: { color: BG_COLOR, width: 0.5 }
        });

        // Number badge on dot
        const numColor = isDone ? BG_COLOR : BG_COLOR;
        slide.addText(String(bench._idx), {
          x: pos.x - 0.13, y: pos.y - 0.10,
          w: 0.26, h: 0.18,
          fontSize: 6, bold: true,
          color: 'FFFFFF',
          align: 'center', isTextBox: true, margin: 0
        });
      });
    });
  });

  // ── Domain arc labels (outside outer ring, clamp to left of panel) ──
  const PANEL_X = 9.60;
  domains.forEach(domain => {
    const pos = polar(cx, cy, outerRing.r + 0.26, domain.midAngle);
    const lw  = 1.30;
    const lx  = Math.max(0.05, Math.min(pos.x - lw/2, PANEL_X - lw - 0.10));
    const ly  = Math.max(0.42, Math.min(pos.y - 0.18, H - 0.54));
    slide.addText(domain.label, {
      x: lx, y: ly, w: lw, h: 0.40,
      fontSize: 8, bold: true, color: domain.color,
      align: 'center', isTextBox: true, margin: 0
    });
  });

  // ── RIGHT PANEL — benchmark name list ──
  const COL1_X  = PANEL_X + 0.10;
  const COL2_X  = PANEL_X + 1.92;
  const COL_W   = 1.72;
  const LINE_H  = 0.162;
  const HDR_H   = 0.215;
  const GAP     = 0.072;

  // Panel background
  slide.addShape(pres.ShapeType.rect, {
    x: PANEL_X, y: 0.76, w: W - PANEL_X - 0.12, h: H - 0.92,
    fill: { color: '0A1520' }, line: { color: '1E3A52', width: 0.5 }
  });
  slide.addText('BENCHMARKS', {
    x: COL1_X, y: 0.82, w: 3.50, h: 0.21,
    fontSize: 7, bold: true, color: '2E5A7E',
    isTextBox: true, margin: 0, charSpacing: 2
  });
  slide.addShape(pres.ShapeType.line, {
    x: PANEL_X + 0.08, y: 1.08, w: W - PANEL_X - 0.22, h: 0,
    line: { color: '1E3A52', width: 0.6 }
  });

  const visibleDomains = domains
    .map(d => ({ ...d, activeBenchmarks: d.benchmarks.filter(b => activeRingIds.includes(b.ring)) }))
    .filter(d => d.activeBenchmarks.length > 0);

  const half  = Math.ceil(visibleDomains.length / 2);
  const cols  = [visibleDomains.slice(0, half), visibleDomains.slice(half)];

  cols.forEach((domList, ci) => {
    const px = ci === 0 ? COL1_X : COL2_X;
    let cy2  = 1.13;
    domList.forEach(domain => {
      const shortLabel = domain.label.replace('\n', ' ');
      // Domain header bar
      slide.addShape(pres.ShapeType.rect, {
        x: px - 0.06, y: cy2, w: COL_W + 0.06, h: HDR_H,
        fill: { color: domain.color, transparency: 82 }, line: { type: 'none' }
      });
      slide.addShape(pres.ShapeType.rect, {
        x: px - 0.06, y: cy2, w: 0.055, h: HDR_H,
        fill: { color: domain.color }, line: { type: 'none' }
      });
      slide.addText(shortLabel, {
        x: px + 0.02, y: cy2 + 0.03, w: COL_W - 0.04, h: HDR_H - 0.04,
        fontSize: 7.5, bold: true, color: domain.color,
        isTextBox: true, margin: 0
      });
      cy2 += HDR_H + 0.02;

      domain.activeBenchmarks.forEach(b => {
        const isDoneB  = b.done;
        const nameText = `${b._idx}  ${b.name}${isDoneB ? ' ✓' : ''}`;
        const c        = isDoneB ? DONE_COLOR : '7AAAC5';
        // Small colored circle matching dot
        slide.addShape(pres.ShapeType.ellipse, {
          x: px - 0.01, y: cy2 + 0.04, w: 0.09, h: 0.09,
          fill: { color: isDoneB ? DONE_COLOR : domain.color },
          line: { type: 'none' }
        });
        slide.addText(nameText, {
          x: px + 0.11, y: cy2, w: COL_W - 0.13, h: LINE_H,
          fontSize: 6.8, color: c, bold: isDoneB,
          isTextBox: true, margin: 0
        });
        cy2 += LINE_H;
      });
      cy2 += GAP;
    });
  });

  // Vertical divider between columns
  slide.addShape(pres.ShapeType.line, {
    x: COL2_X - 0.12, y: 1.10, w: 0, h: H - 1.30,
    line: { color: '1E3A52', width: 0.5 }
  });

  // ── Title ──
  slide.addText(title, {
    x: 0.35, y: 0.18, w: 12.20, h: 0.46,
    fontSize: 20, bold: true, color: 'E8F4FF',
    isTextBox: true, margin: 0, fontFace: 'Cambria'
  });
  slide.addText(subtitle, {
    x: 0.35, y: 0.66, w: 12.20, h: 0.28,
    fontSize: 9.5, color: '5A8AAF',
    isTextBox: true, margin: 0
  });

  // ── FOX BRAIN badge ──
  slide.addShape(pres.ShapeType.roundRect, {
    x:12.58, y:0.18, w:0.60, h:0.72, rectRadius:0.08,
    fill:{ color:'7C3AED' }, line:{ type:'none' }
  });
  slide.addText('FOX',   { x:12.56, y:0.21, w:0.64, h:0.28, fontSize:9,  bold:true, color:'FFFFFF', align:'center', isTextBox:true, margin:0, fontFace:'Cambria' });
  slide.addText('BRAIN', { x:12.56, y:0.50, w:0.64, h:0.22, fontSize:6.5,bold:true, color:'C4B5FD', align:'center', isTextBox:true, margin:0 });

  // ── Legend ──
  const legendY = 7.06;
  legendItems.forEach((item, i) => {
    const lx = 0.35 + i * 2.55;
    slide.addShape(pres.ShapeType.ellipse, {
      x: lx, y: legendY + 0.01, w: 0.13, h: 0.13,
      fill: { color: item.color }, line: { type:'none' }
    });
    slide.addText(`${item.label}  ${item.desc}`, {
      x: lx + 0.19, y: legendY - 0.01, w: 2.30, h: 0.17,
      fontSize: 8, color: '7A9AB5',
      isTextBox: true, margin: 0
    });
  });

  // ── Footer ──
  slide.addText('Full SOTA scores & headroom at FoxBrain EvalHub', {
    x: 0.35, y: 7.30, w: 12.60, h: 0.16,
    fontSize: 7, color: '1E3A52', align: 'center',
    isTextBox: true, margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 1 — CRITICAL + HIGH  (Act Now)
// ═══════════════════════════════════════════════════════════════════════════
buildRadar(
  pres.addSlide(),
  [1, 2],
  'FoxBrain Priority Radar — Act Now',
  'CRITICAL & HIGH benchmarks only · Closer to center = evaluate first',
  [
    { label:'CRITICAL', color:'FF9088', desc:'Evaluate now'       },
    { label:'HIGH',     color:'FFD060', desc:'Near-term priority' },
    { label:'✓ Done',  color: DONE_COLOR, desc:'Already evaluated'},
  ]
);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 2 — MEDIUM + MONITOR  (Roadmap)
// ═══════════════════════════════════════════════════════════════════════════
buildRadar(
  pres.addSlide(),
  [3, 4],
  'FoxBrain Priority Radar — Roadmap',
  'MEDIUM & MONITOR benchmarks · On-deck and emerging evaluations',
  [
    { label:'MEDIUM',  color:'70B8E8', desc:'On roadmap'       },
    { label:'MONITOR', color:'A8A8E8', desc:'Emerging / watch' },
  ]
);

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 3 — ROADMAP TABLE
// ═══════════════════════════════════════════════════════════════════════════
const s3 = pres.addSlide();

s3.addShape(pres.ShapeType.rect, { x:0, y:0, w:W, h:H,
  fill:{ color: BG_COLOR }, line:{ type:'none' } });

s3.addText('FoxBrain Benchmark Roadmap', {
  x:0.5, y:0.20, w:9, h:0.48,
  fontSize:22, bold:true, color:'E8F4FF',
  isTextBox:true, margin:0, fontFace:'Cambria'
});
s3.addText('Priority reflects FoxBrain relevance — not benchmark popularity.  ✓ = already evaluated at HHRI-AI.  Full SOTA scores → FoxBrain EvalHub', {
  x:0.5, y:0.70, w:12.3, h:0.26,
  fontSize:9, color:'4A7A8F',
  isTextBox:true, margin:0
});

// Badge
s3.addShape(pres.ShapeType.roundRect, { x:11.6, y:0.18, w:1.5, h:0.72, rectRadius:0.1,
  fill:{ color:'7C3AED' }, line:{ type:'none' } });
s3.addText('FOX',   { x:11.6, y:0.20, w:1.5, h:0.30, fontSize:14, bold:true, color:'FFFFFF',  align:'center', isTextBox:true, margin:0, fontFace:'Cambria' });
s3.addText('BRAIN', { x:11.6, y:0.50, w:1.5, h:0.30, fontSize:10, bold:true, color:'C4B5FD',  align:'center', isTextBox:true, margin:0 });

// Table
const tY        = 1.10;
const colX      = [0.40, 2.52, 4.88, 7.60, 10.20];
const colWidths = [2.08, 2.30, 2.66,  2.54,  2.80];
const colLabels = ['CAPABILITY', 'CRITICAL', 'HIGH', 'MEDIUM', 'MONITOR'];
const colColors = ['1E3A52', '3D0D0A', '2A1E00', '0A1E2E', '101228'];
const colText   = ['90C8E8', 'FF9088',  'FFD060', '70B8E8', 'A8A8E8'];

colLabels.forEach((label, ci) => {
  s3.addShape(pres.ShapeType.rect, {
    x: colX[ci], y: tY, w: colWidths[ci], h: 0.30,
    fill: { color: colColors[ci] }, line: { type: 'none' }
  });
  s3.addText(label, {
    x: colX[ci]+0.10, y: tY+0.05, w: colWidths[ci]-0.15, h: 0.22,
    fontSize: 8.5, bold: true, color: colText[ci],
    isTextBox: true, margin: 0
  });
});

const tableData = [
  { domain:'Reasoning & Math',  dColor:'E85D4A',
    core:  'HLE ✓ · FrontierMath',
    high:  'AIME 2025 · AIME 2026 · ARC-AGI-2',
    medium:'MATH-500',
    watch: 'GPQA Diamond · MMLU-Pro',
  },
  { domain:'Coding & SWE',      dColor:'4A90D9',
    core:  'SWE-Bench Pro · Terminal-Bench 4.0 · FrontierCode Diamond',
    high:  'LiveCodeBench v6 · DeepSWE v1.1 · SWE-Bench Multilingual',
    medium:'BigCodeBench · SciCode',
    watch: '—',
  },
  { domain:'Long Context',      dColor:'7B68EE',
    core:  'MRCR v2 ✓',
    high:  'GraphWalks BFS · NoLiMa · RULER',
    medium:'LongBench v2',
    watch: '—',
  },
  { domain:'Multimodal',        dColor:'F0A500',
    core:  '—',
    high:  'MathVista ✓ · MMMU-Pro',
    medium:'CharXiv · CharXiv-R · DocVQA · MathVision · MMVU · Chartography',
    watch: '—',
  },
  { domain:'Agents & Tools',    dColor:'3DAA6E',
    core:  'MCP Atlas · tau2-bench ✓ · Agents Last Exam',
    high:  'BrowseComp · OSWorld 2.0 · BFCL v4 · Toolathlon',
    medium:'APEX-Agents',
    watch: '—',
  },
  { domain:'Knowledge & Lang.', dColor:'9B59B6',
    core:  'TMMLU+ ✓ · TW-LegalBench · AIEC ✓',
    high:  'MMMLU · GDPval-AA · IFEval',
    medium:'SimpleQA · DRCD',
    watch: '—',
  },
  { domain:'Data & ML',         dColor:'E8A020',
    core:  '—',
    high:  'MLE-Bench · DSBench',
    medium:'SpreadsheetBench',
    watch: '—',
  },
];

const rowH = 0.72, rowStartY = tY + 0.34;
const rowBg = ['112030', '0D1B28'];

tableData.forEach((row, ri) => {
  const ry = rowStartY + ri * rowH;
  s3.addShape(pres.ShapeType.rect, {
    x: colX[0], y: ry,
    w: colX[4] + colWidths[4] - colX[0], h: rowH,
    fill: { color: rowBg[ri%2] }, line: { type: 'none' }
  });
  s3.addShape(pres.ShapeType.ellipse, {
    x: colX[0]+0.08, y: ry+rowH/2-0.06, w: 0.12, h: 0.12,
    fill: { color: row.dColor }, line: { type: 'none' }
  });
  s3.addText(row.domain, {
    x: colX[0]+0.26, y: ry+0.20, w: colWidths[0]-0.32, h: 0.44,
    fontSize: 10, bold: true, color: row.dColor,
    isTextBox: true, margin: 0
  });
  s3.addText(row.core, {
    x: colX[1]+0.10, y: ry+0.10, w: colWidths[1]-0.15, h: rowH-0.20,
    fontSize: 9, bold: true,
    color: row.core === '—' ? '1E3A52' : row.core.includes('✓') ? DONE_COLOR : 'FF9088',
    isTextBox: true, margin: 0
  });
  s3.addText(row.high, {
    x: colX[2]+0.10, y: ry+0.10, w: colWidths[2]-0.15, h: rowH-0.20,
    fontSize: 9, bold: row.high !== '—',
    color: row.high === '—' ? '1E3A52' : 'FFD060',
    isTextBox: true, margin: 0
  });
  s3.addText(row.medium, {
    x: colX[3]+0.10, y: ry+0.08, w: colWidths[3]-0.15, h: rowH-0.18,
    fontSize: 9, bold: row.medium !== '—',
    color: row.medium === '—' ? '1E3A52' : '70B8E8',
    isTextBox: true, margin: 0
  });
  s3.addText(row.watch, {
    x: colX[4]+0.10, y: ry+0.08, w: colWidths[4]-0.15, h: rowH-0.18,
    fontSize: 9, bold: row.watch !== '—',
    color: row.watch === '—' ? '1E3A52' : 'A8A8E8',
    isTextBox: true, margin: 0
  });
});

// Column dividers
for (let ci = 1; ci < 5; ci++) {
  s3.addShape(pres.ShapeType.line, {
    x: colX[ci]-0.01, y: tY,
    w: 0, h: rowStartY + tableData.length * rowH - tY,
    line: { color: '1A3050', width: 0.75 }
  });
}

// Table legend
const tlegY = rowStartY + tableData.length * rowH + 0.14;
[
  { color:'FF9088', label:'CRITICAL — evaluate now'   },
  { color:'FFD060', label:'HIGH — near-term'           },
  { color:'70B8E8', label:'MEDIUM — on roadmap'        },
  { color:'A8A8E8', label:'MONITOR — emerging'         },
  { color: DONE_COLOR, label:'✓ Already evaluated'    },
].forEach((item, i) => {
  const lx = 0.5 + i * 2.55;
  s3.addShape(pres.ShapeType.ellipse, {
    x: lx, y: tlegY+0.02, w: 0.12, h: 0.12,
    fill: { color: item.color }, line: { type: 'none' }
  });
  s3.addText(item.label, {
    x: lx+0.18, y: tlegY, w: 2.3, h: 0.18,
    fontSize: 8, color: '5A8AAF',
    isTextBox: true, margin: 0
  });
});

s3.addText('Recommended: Slide 1 for strategic discussion · Slide 2 for roadmap · Slide 3 for benchmark-level detail', {
  x:0.4, y:7.28, w:12.6, h:0.18,
  fontSize:7, color:'1E3A52', align:'center',
  isTextBox:true, margin:0
});

// ─── WRITE ───────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: '/tmp/foxbrain-slides/FoxBrain_Benchmark_Priority_Radar.pptx' })
  .then(() => console.log('Done'))
  .catch(e => { console.error(e); process.exit(1); });
