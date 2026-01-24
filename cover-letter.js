const STORAGE_KEY = 'ats_cover_letter_builder_v1';

const $ = (id) => document.getElementById(id);

function normalizeText(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function coverLetterToPlainText(state) {
  const lines = [];
  const contact = [state.email, state.phone, state.location].filter(Boolean).join(' | ');
  lines.push(normalizeText(state.fullName));
  if (contact) lines.push(contact);
  lines.push('');
  lines.push(state.dateText || new Date().toLocaleDateString());
  lines.push('');
  const to = [state.hiringManager, state.company, state.jobLocation].filter(Boolean).join('\n');
  if (to) {
    lines.push(to);
    lines.push('');
  }
  lines.push(state.greeting || greetingFor(state));
  lines.push('');
  if (state.opening) {
    lines.push(state.opening);
    lines.push('');
  }
  if (state.body) {
    lines.push(state.body);
    lines.push('');
  }
  if (state.closing) {
    lines.push(state.closing);
    lines.push('');
  }
  lines.push('Sincerely,');
  lines.push(state.fullName);
  return lines.join('\n');
}

function greetingFor(state) {
  const hm = normalizeText(state.hiringManager);
  if (hm) return `Dear ${hm},`;
  return 'Dear Hiring Manager,';
}

function defaultState() {
  return {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    role: 'Software Engineer',
    company: 'Company Name',
    hiringManager: '',
    jobLocation: 'Remote',
    opening: 'I am applying for the [ROLE] position at [COMPANY]. I bring strong experience building reliable systems and delivering measurable improvements.',
    body: 'In my recent role, I delivered projects that improved performance and reliability. For example:\n- Improved API response times by 35% through caching and query tuning.\n- Shipped weekly releases with strong test coverage and monitoring.\n\nI am confident I can bring the same execution and ownership to [COMPANY].',
    closing: 'I would welcome the opportunity to discuss how I can contribute to the team. Thank you for your time and consideration.'
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setSaveStatus(text) {
  const el = $('saveStatus');
  if (el) el.textContent = text;
}

let persistTimer = null;
function persist(state) {
  setSaveStatus('Saving…');
  if (persistTimer) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    saveState(state);
    try {
      localStorage.setItem('ats_cover_letter_plaintext_v1', coverLetterToPlainText(state));
    } catch {}
    setSaveStatus('Saved');
  }, 250);
}

function bind(state) {
  const map = [
    ['fullName','fullName'],
    ['email','email'],
    ['phone','phone'],
    ['location','location'],
    ['role','role'],
    ['company','company'],
    ['hiringManager','hiringManager'],
    ['jobLocation','jobLocation'],
    ['opening','opening'],
    ['body','body'],
    ['closing','closing']
  ];

  for (const [id, key] of map) {
    const el = $(id);
    el.value = state[key] || '';
    el.addEventListener('input', () => {
      state[key] = el.value;
      persist(state);
      render(state);
    });
  }
}

function renderContact(state) {
  const parts = [];
  if (state.email) parts.push(state.email);
  if (state.phone) parts.push(state.phone);
  if (state.location) parts.push(state.location);
  return parts.join(' | ');
}

function substituteTokens(text, state) {
  return String(text || '')
    .replaceAll('[ROLE]', state.role || '')
    .replaceAll('[COMPANY]', state.company || '');
}

function render(state) {
  $('pName').textContent = state.fullName || 'Your Name';
  $('pContact').textContent = renderContact(state);

  const dateText = new Date().toLocaleDateString();
  $('pDate').textContent = dateText;

  const toLines = [];
  if (normalizeText(state.hiringManager)) toLines.push(state.hiringManager);
  if (normalizeText(state.company)) toLines.push(state.company);
  if (normalizeText(state.jobLocation)) toLines.push(state.jobLocation);
  $('pTo').textContent = toLines.join('\n');

  $('pGreeting').textContent = greetingFor(state);
  $('pOpening').textContent = substituteTokens(state.opening, state);
  $('pBody').textContent = substituteTokens(state.body, state);
  $('pClosing').textContent = substituteTokens(state.closing, state);

  $('pSignature').textContent = `Sincerely,\n${state.fullName || ''}`.trim();
}

function attachButtons(state) {
  $('exportPdfBtn').addEventListener('click', () => {
    saveState(state);
    try {
      localStorage.setItem('ats_cover_letter_plaintext_v1', coverLetterToPlainText(state));
    } catch {}
    window.print();
  });

  $('resetBtn').addEventListener('click', () => {
    const ok = confirm('Reset cover letter fields? This clears your local autosave.');
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('ats_cover_letter_plaintext_v1');
    const fresh = defaultState();
    Object.assign(state, fresh);
    bind(state);
    persist(state);
    render(state);
  });
}

(function init() {
  const state = loadState();
  bind(state);
  attachButtons(state);
  render(state);
  setSaveStatus('Saved');
})();
