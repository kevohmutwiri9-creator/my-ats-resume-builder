const ATS_STOPWORDS = new Set(['the','and','or','a','an','to','for','of','in','on','at','by','with','from','as','is','are','was','were','be','been','being','it','this','that','these','those','you','your','we','our','they','their','i','me','my','us','but','if','then','than','also','will','can','may','should','must','not']);

const MUST_HAVE_HINTS = ['required','must have','must-have','requirements','minimum qualifications','qualifications','what you\'ll need'];
const NICE_TO_HAVE_HINTS = ['nice to have','nice-to-have','preferred','bonus','plus','preferred qualifications'];

const KNOWN_PHRASES = [
  'machine learning','data analysis','data analytics','project management','stakeholder management',
  'software development','rest api','unit testing','integration testing','continuous integration','continuous delivery',
  'problem solving','communication skills','stakeholder communication','leadership',
  'sql','postgresql','mysql','mongodb','redis','docker','kubernetes',
  'aws','amazon web services','azure','gcp','google cloud',
  'react','node.js','typescript','javascript','python','java','c#','go','golang',
  'system design','microservices','distributed systems','etl','data pipelines'
];

const $ = (id) => document.getElementById(id);

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeWords(s) {
  const n = normalize(s);
  if (!n) return [];
  return n.split(' ').filter((w) => w && w.length >= 3 && !ATS_STOPWORDS.has(w));
}

function guessSections(jobDesc) {
  const lines = String(jobDesc || '').split(/\r?\n/);
  const joined = normalize(jobDesc);
  let mode = 'unknown';
  if (MUST_HAVE_HINTS.some((h) => joined.includes(normalize(h)))) mode = 'must';
  if (NICE_TO_HAVE_HINTS.some((h) => joined.includes(normalize(h)))) mode = 'mixed';

  const mustLines = [];
  const niceLines = [];
  for (const raw of lines) {
    const l = normalize(raw);
    if (!l) continue;
    if (MUST_HAVE_HINTS.some((h) => l.includes(normalize(h)))) { mode = 'must'; continue; }
    if (NICE_TO_HAVE_HINTS.some((h) => l.includes(normalize(h)))) { mode = 'nice'; continue; }
    if (mode === 'must') mustLines.push(raw);
    else if (mode === 'nice') niceLines.push(raw);
    else {
      mustLines.push(raw);
      niceLines.push(raw);
    }
  }
  return { mustText: mustLines.join('\n'), niceText: niceLines.join('\n') };
}

function extractWeightedKeywords(text, phraseWeight, wordWeight, maxItems) {
  const n = normalize(text);
  const keywords = new Map();

  for (const phrase of KNOWN_PHRASES) {
    const p = normalize(phrase);
    if (p && n.includes(p)) keywords.set(p, (keywords.get(p) || 0) + phraseWeight);
  }

  const words = tokenizeWords(n);
  for (const w of words) {
    keywords.set(w, (keywords.get(w) || 0) + wordWeight);
  }

  const sorted = [...keywords.entries()].sort((a,b) => b[1]-a[1]);
  return sorted.slice(0, maxItems).map(([k, w]) => ({ k, w }));
}

function extractKeywordGroups(jobDesc) {
  const { mustText, niceText } = guessSections(jobDesc);
  const must = extractWeightedKeywords(mustText, 5, 2, 25);
  const nice = extractWeightedKeywords(niceText, 3, 1, 25);
  return { must, nice };
}

function matchGroup(items, resumeText) {
  const r = normalize(resumeText);
  const matched = [];
  const missing = [];

  for (const it of items) {
    const present = r.includes(it.k);
    if (present) matched.push(it);
    else missing.push(it);
  }

  const totalWeight = items.reduce((s, it) => s + it.w, 0);
  const matchedWeight = matched.reduce((s, it) => s + it.w, 0);
  const score = totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0;
  return { score, matched, missing, totalWeight, matchedWeight };
}

function formatChecks(jobDesc, resumeText) {
  const checks = [];
  const r = resumeText || '';

  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(r);
  checks.push({ ok: hasEmail, label: 'Email found' });

  const hasPhone = /\+?\d[\d\s().-]{7,}\d/.test(r);
  checks.push({ ok: hasPhone, label: 'Phone number found' });

  const bullets = (r.match(/\n\s*[-•]\s+/g) || []).length;
  checks.push({ ok: bullets >= 3, label: 'Bullet points detected (recommended)' });

  const hasDates = /(19\d\d|20\d\d)/.test(r);
  checks.push({ ok: hasDates, label: 'Dates detected (experience/education)' });

  const longLines = r.split(/\r?\n/).filter((l) => l.length > 140).length;
  checks.push({ ok: longLines === 0, label: 'No overly long lines (readability)' });

  const jd = normalize(jobDesc);
  if (jd.includes('table') || jd.includes('tables')) {
    checks.push({ ok: true, label: 'Avoid tables in your resume (ATS-safe)' });
  } else {
    checks.push({ ok: true, label: 'Keep formatting simple (avoid icons/tables/graphics)' });
  }

  return checks;
}

function renderTags(el, items) {
  if (!items.length) {
    el.innerHTML = '<div class="muted">None</div>';
    return;
  }
  el.innerHTML = `<div class="list">${items.map((x) => `<span class="tag">${escapeHtml(x)}</span>`).join('')}</div>`;
}

function renderWeightedTags(el, items) {
  if (!items.length) {
    el.innerHTML = '<div class="muted">None</div>';
    return;
  }
  el.innerHTML = `<div class="list">${items.map((it) => `<span class="tag">${escapeHtml(it.k)}</span>`).join('')}</div>`;
}

function escapeHtml(str) {
  return String(str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function run() {
  const jobDesc = $('jobDesc').value;
  const resumeText = $('resumeText').value;

  const groups = extractKeywordGroups(jobDesc);
  const mustRes = matchGroup(groups.must, resumeText);
  const niceRes = matchGroup(groups.nice, resumeText);

  const score = Math.round((mustRes.score * 0.7) + (niceRes.score * 0.3));

  $('results').hidden = false;
  $('scoreValue').textContent = score + '%';
  $('scoreNote').textContent = score >= 75
    ? 'Strong match. Make sure every keyword you use is supported by real experience and achievements.'
    : 'Improve match by addressing must-have requirements first, then add nice-to-haves where they honestly apply.';

  renderWeightedTags($('mustMatched'), mustRes.matched.slice(0, 18));
  renderWeightedTags($('mustMissing'), mustRes.missing.slice(0, 18));
  renderWeightedTags($('niceMatched'), niceRes.matched.slice(0, 18));
  renderWeightedTags($('niceMissing'), niceRes.missing.slice(0, 18));

  const checks = formatChecks(jobDesc, resumeText);
  $('formatChecks').innerHTML = checks.map((c) => `<div class="${c.ok ? 'ok' : 'bad'}">${c.ok ? '✓' : '✕'} ${escapeHtml(c.label)}</div>`).join('');
}

(function init(){
  $('runCheckBtn').addEventListener('click', run);
  $('loadFromBuilderBtn').addEventListener('click', () => {
    const t = localStorage.getItem('ats_resume_plaintext_v1') || '';
    $('resumeText').value = t;
  });
})();
