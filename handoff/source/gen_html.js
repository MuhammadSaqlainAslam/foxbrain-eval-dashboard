// Generates html/slide1.html, slide2.html, slide3.html, index.html from the same data as build.js
const fs = require('fs'), path = require('path');
const domains = [
 {label:'Reasoning & Math',color:'E85D4A',span:1.8,b:[['HLE',1,1],['FrontierMath',1,0],['AIME 2025',2,0],['AIME 2026',2,0],['ARC-AGI-2',2,0],['MATH-500',3,0],['GPQA Diamond',4,0],['MMLU-Pro',4,0]]},
 {label:'Coding & SWE',color:'4A90D9',span:1.8,b:[['SWE-Bench Pro',1,0],['Terminal-Bench 4.0',1,0],['FrontierCode Diamond',1,0],['LiveCodeBench v6',2,0],['DeepSWE v1.1',2,0],['SWE-Bench Multilingual',2,0],['BigCodeBench',3,0],['SciCode',3,0]]},
 {label:'Long Context',color:'7B68EE',span:0.9,b:[['MRCR v2',1,1],['GraphWalks BFS',2,0],['NoLiMa',2,0],['RULER',2,0],['LongBench v2',3,0]]},
 {label:'Multimodal',color:'F0A500',span:1.8,b:[['MathVista',2,1],['MMMU-Pro',2,0],['CharXiv',3,0],['CharXiv-R',3,0],['DocVQA',3,0],['MathVision',3,0],['MMVU',3,0],['Chartography',3,0]]},
 {label:'Agents & Tools',color:'3DAA6E',span:1.5,b:[['MCP Atlas',1,0],['tau2-bench',1,1],['Agents Last Exam',1,0],['BrowseComp',2,0],['OSWorld 2.0',2,0],['BFCL v4',2,0],['Toolathlon',2,0],['APEX-Agents',3,0]]},
 {label:'Knowledge & Language',color:'9B59B6',span:1.2,b:[['TMMLU+',1,1],['TW-LegalBench',1,0],['AIEC',1,1],['MMMLU',2,0],['GDPval-AA',2,0],['IFEval',2,0],['SimpleQA',3,0],['DRCD',3,0]]},
 {label:'Data & ML',color:'E8A020',span:0.8,b:[['MLE-Bench',2,0],['DSBench',2,0],['SpreadsheetBench',3,0]]},
].map(d=>({...d,b:d.b.map(([name,ring,done],i)=>({name,ring,done:!!done,idx:i+1}))}));
const RINGS=[{id:1,label:'CRITICAL',r:.82,bg:'#CC3322',tc:'#FF9088'},{id:2,label:'HIGH',r:1.58,bg:'#B8860B',tc:'#FFD060'},{id:3,label:'MEDIUM',r:2.30,bg:'#1A3E5A',tc:'#70B8E8'},{id:4,label:'MONITOR',r:3.00,bg:'#111A28',tc:'#A8A8E8'}];
const DONE='#00E5A0', BG='#0D1B2A', PX=96, cx=5.2*PX, cy=3.9*PX;
const total=domains.reduce((s,d)=>s+d.span,0); let cum=-75;
domains.forEach(d=>{d.start=cum;d.wedge=d.span/total*360;d.mid=cum+d.wedge/2;cum+=d.wedge;});
const pol=(r,deg)=>{const a=(deg-90)*Math.PI/180;return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)};};
const css=`*{box-sizing:border-box}body{margin:0;background:#050b12;font-family:Calibri,Arial,sans-serif;color:#E8F4FF}
.slide{position:relative;width:1280px;height:720px;background:${BG};margin:0 auto;overflow:hidden}
h1{position:absolute;left:34px;top:16px;margin:0;font:700 26px Cambria,serif}
.sub{position:absolute;left:34px;top:60px;font-size:13px;color:#5A8AAF}
.badge{position:absolute;right:20px;top:17px;width:58px;height:69px;border-radius:8px;background:#7C3AED;text-align:center;font:700 12px Cambria,serif;padding-top:8px}
.badge small{display:block;font:700 9px Calibri;color:#C4B5FD;margin-top:8px}
.panel{position:absolute;left:922px;top:73px;width:346px;height:625px;background:#0A1520;border:1px solid #1E3A52;padding:8px 10px;display:grid;grid-template-columns:1fr 1fr;gap:0 14px;align-content:start}
.panel h3{grid-column:1/3;margin:0 0 6px;font-size:9px;letter-spacing:2px;color:#2E5A7E;border-bottom:1px solid #1E3A52;padding-bottom:6px}
.dh{padding:3px 6px;font-weight:700;font-size:10px;margin-top:6px;border-left:4px solid}
.bi{font-size:9px;line-height:15.5px;color:#7AAAC5;display:flex;align-items:center;gap:5px}.bi i{width:8px;height:8px;border-radius:50%;display:inline-block}
.bi.done{color:${DONE};font-weight:700}
.legend{position:absolute;left:34px;bottom:18px;font-size:11px;color:#7A9AB5;display:flex;gap:40px}.legend i{width:12px;height:12px;border-radius:50%;display:inline-block;margin-right:6px;vertical-align:-2px}
.foot{position:absolute;bottom:4px;width:100%;text-align:center;font-size:9px;color:#1E3A52}
table{position:absolute;left:34px;top:120px;width:1212px;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:12px 14px;font-size:12px}td{padding:10px 14px;height:66px;border-bottom:1px solid #0D1B2A;background:#0F1F30;line-height:1.5}tr:nth-child(even) td{background:#0B1826}
.nav{text-align:center;padding:14px}.nav a{color:#7AAAC5;margin:0 12px}`;
const wrap=(t,body)=>`<!doctype html><html><head><meta charset="utf-8"><title>${t}</title><style>${css}</style></head><body><div class="nav"><a href="index.html">Index</a><a href="slide1.html">Slide 1</a><a href="slide2.html">Slide 2</a><a href="slide3.html">Slide 3</a></div>${body}</body></html>`;
function radar(ids,title,sub,legend){
  const rings=RINGS.filter(r=>ids.includes(r.id)), outer=rings[rings.length-1];
  let s=`<svg width="1280" height="720" style="position:absolute;left:0;top:0">`;
  domains.forEach(d=>{const e=pol((outer.r+.2)*PX,d.start);s+=`<line x1="${cx}" y1="${cy}" x2="${e.x}" y2="${e.y}" stroke="#1E3A52" stroke-dasharray="4 3"/>`;});
  [...rings].reverse().forEach(r=>{s+=`<circle cx="${cx}" cy="${cy}" r="${r.r*PX}" fill="${r.bg}" fill-opacity=".2" stroke="${r.bg}" stroke-opacity=".5" stroke-width="1.5"/>`;});
  rings.forEach(r=>{const p=pol((r.r-.1)*PX,152);s+=`<text x="${p.x}" y="${p.y}" text-anchor="end" fill="${r.tc}" font-size="10" font-weight="700">${r.label}</text>`;});
  domains.forEach(d=>{
    ids.forEach(id=>{
      const bs=d.b.filter(b=>b.ring===id); if(!bs.length)return;
      const ri=RINGS.findIndex(r=>r.id===id), prev=ri>0?RINGS[ri-1].r:0, mid=((prev+RINGS[ri].r)/2+.05)*PX;
      bs.forEach((b,i)=>{
        const t=bs.length===1?.5:.15+(i/(bs.length-1))*.7, p=pol(mid,d.start+t*d.wedge);
        if(b.done)s+=`<circle cx="${p.x}" cy="${p.y}" r="13" fill="${DONE}" fill-opacity=".38" stroke="${DONE}"/>`;
        s+=`<circle cx="${p.x}" cy="${p.y}" r="${b.done?7.2:5.6}" fill="${b.done?DONE:'#'+d.color}" stroke="${BG}"/><text x="${p.x}" y="${p.y+2.5}" text-anchor="middle" fill="#fff" font-size="6.5" font-weight="700">${b.idx}</text>`;
      });
    });
    const p=pol((outer.r+.26)*PX,d.mid);
    s+=`<text x="${Math.min(p.x,860)}" y="${p.y}" text-anchor="middle" fill="#${d.color}" font-size="11" font-weight="700">${d.label}</text>`;
  });
  s+='</svg>';
  const vis=domains.filter(d=>d.b.some(b=>ids.includes(b.ring)));
  const half=Math.ceil(vis.length/2);
  const col=l=>l.map(d=>`<div class="dh" style="color:#${d.color};border-color:#${d.color};background:#${d.color}22">${d.label}</div>`+d.b.filter(b=>ids.includes(b.ring)).map(b=>`<div class="bi${b.done?' done':''}"><i style="background:${b.done?DONE:'#'+d.color}"></i>${b.idx} ${b.name}${b.done?' ✓':''}</div>`).join('')).join('');
  const panel=`<div class="panel"><h3>BENCHMARKS</h3><div>${col(vis.slice(0,half))}</div><div>${col(vis.slice(half))}</div></div>`;
  const lg=legend.map(l=>`<span><i style="background:${l[1]}"></i>${l[0]}</span>`).join('');
  return wrap(title,`<div class="slide"><h1>${title}</h1><div class="sub">${sub}</div><div class="badge">FOX<small>BRAIN</small></div>${s}${panel}<div class="legend">${lg}</div><div class="foot">Full SOTA scores &amp; headroom at FoxBrain EvalHub</div></div>`);
}
function table(){
  const c={1:'#FF9088',2:'#FFD060',3:'#70B8E8',4:'#A8A8E8'};
  let h=`<tr><th style="background:#1F3A52">CAPABILITY</th>${RINGS.map(r=>`<th style="color:${r.tc};background:#${r.id==1?'3A0E0A':r.id==2?'2A2000':'0F1F30'}">${r.label}</th>`).join('')}</tr>`;
  domains.forEach(d=>{h+=`<tr><td style="color:#${d.color};font-weight:700">● ${d.label}</td>`+RINGS.map(r=>{const bs=d.b.filter(b=>b.ring===r.id);return `<td style="font-weight:700;color:${bs.length?(bs.some(b=>b.done)&&r.id===1?DONE:c[r.id]):'#2A4A64'}">${bs.length?bs.map(b=>b.name+(b.done?' ✓':'')).join(' · '):'—'}</td>`;}).join('')+'</tr>';});
  return wrap('FoxBrain Benchmark Roadmap',`<div class="slide"><h1>FoxBrain Benchmark Roadmap</h1><div class="sub">Priority reflects FoxBrain relevance — not benchmark popularity. ✓ = already evaluated at HHRI-AI. Full SOTA scores → FoxBrain EvalHub</div><div class="badge">FOX<small>BRAIN</small></div><table>${h}</table></div>`);
}
const out=path.join(__dirname,'..','html');
fs.writeFileSync(out+'/slide1.html',radar([1,2],'FoxBrain Priority Radar — Act Now','CRITICAL &amp; HIGH benchmarks only · Closer to center = evaluate first',[['CRITICAL — evaluate now','#FF9088'],['HIGH — near-term','#FFD060'],['✓ Done — already evaluated',DONE]]));
fs.writeFileSync(out+'/slide2.html',radar([3,4],'FoxBrain Priority Radar — Roadmap','MEDIUM &amp; MONITOR benchmarks · On-deck and emerging evaluations',[['MEDIUM — on roadmap','#70B8E8'],['MONITOR — emerging / watch','#A8A8E8']]));
fs.writeFileSync(out+'/slide3.html',table());
fs.writeFileSync(out+'/index.html',wrap('FoxBrain Priority Radar — index',`<div style="max-width:700px;margin:40px auto;font-size:16px;line-height:2"><h1 style="position:static">FoxBrain Priority Radar</h1><ol><li><a style="color:#7AAAC5" href="slide1.html">Slide 1 — Act Now (CRITICAL + HIGH radar)</a></li><li><a style="color:#7AAAC5" href="slide2.html">Slide 2 — Roadmap (MEDIUM + MONITOR radar)</a></li><li><a style="color:#7AAAC5" href="slide3.html">Slide 3 — Full roadmap table</a></li></ol></div>`));
console.log('ok');
