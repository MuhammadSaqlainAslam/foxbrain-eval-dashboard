// Generates slide1.html, slide2.html, slide3.html, index.html + data.json from the data in build.js
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/build.js', 'utf8');
const domains = new Function(src.match(/const domains = \[[\s\S]*?\n\];/)[0] + '; return domains;')();
const RINGS = new Function(src.match(/const ALL_RINGS = \[[\s\S]*?\n\];/)[0] + '; return ALL_RINGS;')();
domains.forEach(d => d.benchmarks.forEach((b, i) => b.idx = i + 1));
fs.writeFileSync(__dirname + '/data.json', JSON.stringify({ domains, rings: RINGS }, null, 2));

const S = 100, W = 1333, H = 750, cx = 520, cy = 390, START = -75;
const DONE = '#00E5A0', BG = '#0D1B2A';
const pol = (r, deg) => { const a = (deg - 90) * Math.PI / 180; return [cx + r * S * Math.cos(a), cy + r * S * Math.sin(a)]; };
const total = domains.reduce((s, d) => s + d.span, 0); let cum = START;
domains.forEach(d => { d.start = cum; d.wedge = d.span / total * 360; d.mid = cum + d.wedge / 2; cum += d.wedge; });
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const page = (title, body, extraCss = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>html,body{margin:0;height:100%;background:#050b12}#stage{width:${W}px;height:${H}px;position:absolute;left:0;top:0;transform-origin:0 0;background:${BG};font-family:Calibri,Arial,sans-serif;color:#E8F4FF}${extraCss}</style></head><body><div id="stage">${body}</div>
<script>function fit(){const s=Math.min(innerWidth/${W},innerHeight/${H});const st=document.getElementById('stage');st.style.transform='scale('+s+')';st.style.left=(innerWidth-${W}*s)/2+'px';st.style.top=(innerHeight-${H}*s)/2+'px'}addEventListener('resize',fit);fit()</script></body></html>`;

function radar(ids, title, sub, legend) {
  const rings = RINGS.filter(r => ids.includes(r.id)), outer = rings[rings.length - 1];
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0" font-family="Calibri,Arial,sans-serif">`;
  domains.forEach(d => { const [x, y] = pol(outer.r + 0.2, d.start); s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#1E3A52" stroke-width="1" stroke-dasharray="5 4"/>`; });
  [...rings].reverse().forEach(r => s += `<circle cx="${cx}" cy="${cy}" r="${r.r * S}" fill="#${r.bg}" fill-opacity="${(100 - r.bgAlpha) / 100}" stroke="#${r.bg}" stroke-opacity=".45" stroke-width="2"/>`);
  rings.forEach(r => { const [x, y] = pol(r.r - 0.1, 152); s += `<text x="${x}" y="${y}" text-anchor="end" font-size="11" font-weight="700" fill="#${r.textColor}">${r.label}</text>`; });
  domains.forEach(d => {
    const by = {}; d.benchmarks.filter(b => ids.includes(b.ring)).forEach(b => (by[b.ring] = by[b.ring] || []).push(b));
    ids.forEach(id => {
      const list = by[id]; if (!list) return;
      const ri = RINGS.findIndex(r => r.id === id), prev = ri ? RINGS[ri - 1].r : 0, mid = (prev + RINGS[ri].r) / 2 + 0.05;
      list.forEach((b, i) => {
        const t = list.length === 1 ? .5 : .15 + i / (list.length - 1) * .7, [x, y] = pol(mid, d.start + t * d.wedge);
        const col = b.done ? DONE : '#' + d.color;
        if (b.done) s += `<circle cx="${x}" cy="${y}" r="14" fill="${DONE}" fill-opacity=".38" stroke="${DONE}"/>`;
        s += `<circle cx="${x}" cy="${y}" r="${b.done ? 8.5 : 7}" fill="${col}" stroke="${BG}"><title>${esc(b.name)}</title></circle><text x="${x}" y="${y + 3}" text-anchor="middle" font-size="8" font-weight="700" fill="#fff">${b.idx}</text>`;
      });
    });
  });
  domains.forEach(d => { const [x, y] = pol(outer.r + 0.3, d.mid); d.label.split('\n').forEach((ln, i, a) => s += `<text x="${Math.max(50, Math.min(x, 850))}" y="${Math.max(50, Math.min(y, 700)) + i * 15 - (a.length - 1) * 7}" text-anchor="middle" font-size="13" font-weight="700" fill="#${d.color}">${esc(ln)}</text>`); });
  // right panel
  const PX = 960; s += `<rect x="${PX}" y="76" width="${W - PX - 12}" height="${H - 92}" fill="#0A1520" stroke="#1E3A52"/><text x="${PX + 10}" y="98" font-size="10" font-weight="700" letter-spacing="3" fill="#2E5A7E">BENCHMARKS</text>`;
  const vis = domains.filter(d => d.benchmarks.some(b => ids.includes(b.ring))), half = Math.ceil(vis.length / 2);
  [vis.slice(0, half), vis.slice(half)].forEach((col, ci) => {
    const px = PX + 10 + ci * 192; let y = 113;
    col.forEach(d => {
      s += `<rect x="${px - 6}" y="${y}" width="178" height="21" fill="#${d.color}" fill-opacity=".18"/><rect x="${px - 6}" y="${y}" width="5" height="21" fill="#${d.color}"/><text x="${px + 4}" y="${y + 15}" font-size="11.5" font-weight="700" fill="#${d.color}">${esc(d.label.replace('\n', ' '))}</text>`; y += 24;
      d.benchmarks.filter(b => ids.includes(b.ring)).forEach(b => {
        s += `<circle cx="${px + 4}" cy="${y + 8}" r="4.5" fill="${b.done ? DONE : '#' + d.color}"/><text x="${px + 14}" y="${y + 12}" font-size="10.5" font-weight="${b.done ? 700 : 400}" fill="${b.done ? DONE : '#7AAAC5'}">${b.idx}  ${esc(b.name)}${b.done ? ' ✓' : ''}</text>`; y += 16.2;
      }); y += 7;
    });
  });
  s += `<text x="35" y="46" font-size="28" font-weight="700" fill="#E8F4FF" font-family="Cambria,Georgia,serif">${esc(title)}</text><text x="35" y="78" font-size="14" fill="#5A8AAF">${esc(sub)}</text>`;
  legend.forEach((l, i) => s += `<circle cx="${41 + i * 255}" cy="708" r="6.5" fill="${l.c}"/><text x="${54 + i * 255}" y="712" font-size="12" fill="#7A9AB5">${esc(l.l)}  ${esc(l.d)}</text>`);
  s += `<text x="${W / 2}" y="740" text-anchor="middle" font-size="10" fill="#1E3A52">Full SOTA scores &amp; headroom at FoxBrain EvalHub</text></svg>`;
  return s;
}
const L = { 1: { c: '#FF9088', l: 'CRITICAL', d: 'Evaluate now' }, 2: { c: '#FFD060', l: 'HIGH', d: 'Near-term priority' }, 3: { c: '#70B8E8', l: 'MEDIUM', d: 'On roadmap' }, 4: { c: '#A8A8E8', l: 'MONITOR', d: 'Emerging / watch' }, d: { c: DONE, l: '✓ Done', d: 'Already evaluated' } };
const nav = n => `<div style="position:absolute;right:20px;top:14px;font-size:12px;color:#5A8AAF;z-index:9">${[1, 2, 3].map(i => i === n ? `<b style="color:#fff">slide ${i}</b>` : `<a style="color:#5A8AAF" href="slide${i}.html">slide ${i}</a>`).join(' · ')}</div>`;
fs.writeFileSync(__dirname + '/slide1.html', page('FoxBrain Priority Radar - Act Now', nav(1) + radar([1, 2], 'FoxBrain Priority Radar — Act Now', 'CRITICAL & HIGH benchmarks only · Closer to center = evaluate first', [L[1], L[2], L.d])));
fs.writeFileSync(__dirname + '/slide2.html', page('FoxBrain Priority Radar - Roadmap', nav(2) + radar([3, 4], 'FoxBrain Priority Radar — Roadmap', 'MEDIUM & MONITOR benchmarks · On-deck and emerging evaluations', [L[3], L[4]])));

const cell = (d, r, c) => { const l = d.benchmarks.filter(b => b.ring === r); return l.length ? l.map(b => `<span style="color:${b.done ? DONE : c}">${esc(b.name)}${b.done ? ' ✓' : ''}</span>`).join(' · ') : '<span style="color:#1E3A52">—</span>'; };
const rows = domains.map(d => `<tr><td style="color:#${d.color};font-weight:700"><i style="background:#${d.color}"></i>${esc(d.label.replace('\n', ' '))}</td><td>${cell(d, 1, '#FF9088')}</td><td>${cell(d, 2, '#FFD060')}</td><td>${cell(d, 3, '#70B8E8')}</td><td>${cell(d, 4, '#A8A8E8')}</td></tr>`).join('');
fs.writeFileSync(__dirname + '/slide3.html', page('FoxBrain Benchmark Roadmap', nav(3) + `<h1 style="position:absolute;left:35px;top:18px;margin:0;font:700 28px Cambria,Georgia,serif">FoxBrain Benchmark Roadmap</h1><div style="position:absolute;left:35px;top:62px;font-size:14px;color:#5A8AAF">Priority reflects FoxBrain relevance — not benchmark popularity. ✓ = already evaluated at HHRI-AI. Full SOTA scores → FoxBrain EvalHub</div>
<table><thead><tr><th>CAPABILITY</th><th style="color:#FF9088">CRITICAL</th><th style="color:#FFD060">HIGH</th><th style="color:#70B8E8">MEDIUM</th><th style="color:#A8A8E8">MONITOR</th></tr></thead><tbody>${rows}</tbody></table>`,
  `table{position:absolute;left:30px;top:100px;width:1273px;border-collapse:collapse;font-size:14px;font-weight:600}th{text-align:left;padding:12px 14px;background:#132a40;font-size:13px}td{padding:0 14px;height:71px;border-bottom:1px solid #0A1520;background:#0F2033;vertical-align:middle}tr:nth-child(even) td{background:#0B1826}td:first-child{width:170px}td i{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:8px}`));
fs.writeFileSync(__dirname + '/index.html', `<!doctype html><meta charset="utf-8"><title>FoxBrain Radar - handoff</title><body style="background:#0D1B2A;color:#E8F4FF;font-family:Calibri,Arial;padding:40px"><h1>FoxBrain Benchmark Priority Radar</h1><ul><li><a style="color:#8cc" href="slide1.html">Slide 1 — Act Now (CRITICAL + HIGH)</a></li><li><a style="color:#8cc" href="slide2.html">Slide 2 — Roadmap (MEDIUM + MONITOR)</a></li><li><a style="color:#8cc" href="slide3.html">Slide 3 — Full roadmap table</a></li></ul><p>Read HANDOFF.md first.</p></body>`);
console.log('ok');
