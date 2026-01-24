const STORAGE_KEY = 'ats_resume_builder_v1';

const $ = (id) => document.getElementById(id);

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function normalizeText(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function resumeToPlainText(state) {
  const parts = [];
  const contact = [state.email, state.phone, state.location, state.links].filter(Boolean).join(' | ');
  parts.push(normalizeText(state.fullName));
  parts.push(normalizeText(state.headline));
  parts.push(contact);
  parts.push('');
  if (state.summary) {
    parts.push('SUMMARY');
    parts.push(normalizeText(state.summary));
    parts.push('');
  }
  if (state.experience?.length) {
    parts.push('EXPERIENCE');
    for (const e of state.experience) {
      parts.push([e.role, e.company].filter(Boolean).join(' - '));
      parts.push([e.location, e.start, e.end].filter(Boolean).join(' | '));
      for (const b of (e.bullets || [])) parts.push('- ' + normalizeText(b));
      parts.push('');
    }
  }
  if (state.education?.length) {
    parts.push('EDUCATION');
    for (const ed of state.education) {
      parts.push([ed.degree, ed.school].filter(Boolean).join(' - '));
      parts.push([ed.location, ed.start, ed.end].filter(Boolean).join(' | '));
      if (ed.details) parts.push(normalizeText(ed.details));
      parts.push('');
    }
  }
  if (state.skills?.length) {
    parts.push('SKILLS');
    parts.push(state.skills.map(normalizeText).filter(Boolean).join(', '));
  }
  return parts.join('\n');
}

function defaultState() {
  return {
    template: 'clean',
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    links: '',
    summary: '',
    experience: [
      {
        id: uid(),
        role: 'Software Engineer',
        company: 'Company Name',
        location: 'City',
        start: '2023',
        end: 'Present',
        bullets: [
          'Built features that improved conversion by 18% using A/B testing and analytics.',
          'Optimized API response times by 35% by caching and query tuning (PostgreSQL).',
          'Collaborated with product and design to ship weekly releases with high quality.'
        ]
      }
    ],
    education: [
      {
        id: uid(),
        degree: 'BSc Computer Science',
        school: 'University Name',
        location: 'City',
        start: '2019',
        end: '2023',
        details: ''
      }
    ],
    skills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'PostgreSQL']
  };
}

// Template configurations
const TEMPLATES = {
  clean: {
    name: 'Clean (Default)',
    description: 'Single column, plain headings, consistent spacing. Best for ATS parsing.',
    cssFile: null,
    class: ''
  },
  modern: {
    name: 'Modern',
    description: 'Contemporary design with gradient headers and card-based layout.',
    cssFile: './templates-modern.css',
    class: 'modern-template'
  },
  executive: {
    name: 'Executive',
    description: 'Professional design with classic typography and formal styling.',
    cssFile: './templates-executive.css',
    class: 'executive-template'
  },
  creative: {
    name: 'Creative',
    description: 'Vibrant design with colorful elements and modern typography.',
    cssFile: './templates-creative.css',
    class: 'creative-template'
  }
};

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
  if (el) {
    el.textContent = text;
    el.className = text === 'Saved' ? 'muted tiny' : 'muted tiny saving';
  }
}

function validateField(field, value, type) {
  const trimmed = (value || '').trim();
  if (!trimmed) return true; // Allow empty fields

  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(trimmed);
    case 'phone':
      const phoneRegex = /^[\+]?[\d\s\(\)\-\.]{7,}$/;
      return phoneRegex.test(trimmed);
    default:
      return true;
  }
}

function showFieldError(fieldId, message) {
  const field = $(fieldId);
  if (!field) return;

  field.style.borderColor = 'var(--danger)';
  field.style.boxShadow = '0 0 0 3px rgba(255,77,109,0.18)';

  // Remove existing error message
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) existingError.remove();

  const errorEl = document.createElement('div');
  errorEl.className = 'field-error';
  errorEl.textContent = message;
  errorEl.style.color = 'var(--danger)';
  errorEl.style.fontSize = '12px';
  errorEl.style.marginTop = '4px';
  field.parentNode.appendChild(errorEl);

  setTimeout(() => {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    if (errorEl.parentNode) errorEl.remove();
  }, 3000);
}

function bindBasicFields(state) {
  const map = [
    ['fullName', 'fullName'],
    ['headline', 'headline'],
    ['email', 'email', 'email'],
    ['phone', 'phone', 'phone'],
    ['location', 'location'],
    ['links', 'links'],
    ['summary', 'summary']
  ];

  for (const [id, key, type] of map) {
    const el = $(id);
    el.value = state[key] || '';
    el.addEventListener('input', () => {
      const value = el.value;
      if (type && !validateField(id, value, type)) {
        showFieldError(id, `Invalid ${type} format`);
        return;
      }
      state[key] = value;
      persist(state);
      render(state);
    });
  }

  const tmpl = $('template');
  if (tmpl) {
    tmpl.value = state.template || 'clean';
    tmpl.addEventListener('change', () => {
      state.template = tmpl.value;
      persist(state);
      render(state);
    });
  }
}

let persistTimer = null;
function persist(state) {
  setSaveStatus('Saving…');
  if (persistTimer) window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    saveState(state);
    try {
      localStorage.setItem('ats_resume_plaintext_v1', resumeToPlainText(state));
    } catch {}
    setSaveStatus('Saved');
  }, 250);
}

function renderContact(state) {
  const parts = [];
  if (state.email) parts.push(state.email);
  if (state.phone) parts.push(state.phone);
  if (state.location) parts.push(state.location);
  if (state.links) parts.push(state.links);
  return parts.join(' | ');
}

function render(state) {
  applyTemplate(state);
  $('pName').textContent = state.fullName || 'Your Name';
  $('pHeadline').textContent = state.headline || '';
  $('pContact').textContent = renderContact(state);

  $('pSummary').textContent = state.summary || '';
  $('pSummaryWrap').hidden = !normalizeText(state.summary);

  const expWrap = $('pExpWrap');
  const eduWrap = $('pEduWrap');
  const skillsWrap = $('pSkillsWrap');

  const exp = state.experience || [];
  $('pExperience').innerHTML = exp.map((e) => {
    const bullets = (e.bullets || []).filter((b) => normalizeText(b));
    return `
      <div class="entry">
        <div class="entry-head">
          <div class="entry-role">${escapeHtml([e.role, e.company].filter(Boolean).join(' - '))}</div>
          <div class="entry-meta">${escapeHtml([e.location, e.start, e.end].filter(Boolean).join(' | '))}</div>
        </div>
        ${bullets.length ? `<ul class="entry-bullets">${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}
      </div>
    `;
  }).join('');
  expWrap.hidden = exp.length === 0;

  const edu = state.education || [];
  $('pEducation').innerHTML = edu.map((ed) => {
    const details = normalizeText(ed.details);
    return `
      <div class="entry">
        <div class="entry-head">
          <div class="entry-role">${escapeHtml([ed.degree, ed.school].filter(Boolean).join(' - '))}</div>
          <div class="entry-meta">${escapeHtml([ed.location, ed.start, ed.end].filter(Boolean).join(' | '))}</div>
        </div>
        ${details ? `<div class="text">${escapeHtml(details)}</div>` : ''}
      </div>
    `;
  }).join('');
  eduWrap.hidden = edu.length === 0;

  const skills = (state.skills || []).map(normalizeText).filter(Boolean);
  $('pSkills').innerHTML = skills.map((s) => `<span class="skill-chip">${escapeHtml(s)}</span>`).join('');
  skillsWrap.hidden = skills.length === 0;

  renderEditorLists(state);
}

function applyTemplate(state) {
  const paper = $('paper');
  if (!paper) return;
  paper.classList.remove('template-clean', 'template-modern', 'template-compact', 'template-executive');
  const t = state.template || 'clean';
  if (t === 'modern') paper.classList.add('template-modern');
  else if (t === 'compact') paper.classList.add('template-compact');
  else if (t === 'executive') paper.classList.add('template-executive');
  else paper.classList.add('template-clean');
}

function escapeHtml(str) {
  return String(str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderEditorLists(state) {
  const expList = $('experienceList');
  expList.innerHTML = (state.experience || []).map((e, idx) => {
    return `
      <div class="item" data-id="${e.id}">
        <div class="item-top">
          <div class="item-title">${escapeHtml(e.role || 'Experience')}</div>
          <div class="item-actions">
            <button class="btn btn-ghost" type="button" data-act="up" ${idx===0?'disabled':''}>Up</button>
            <button class="btn btn-ghost" type="button" data-act="down" ${idx===(state.experience.length-1)?'disabled':''}>Down</button>
            <button class="btn btn-ghost" type="button" data-act="del">Delete</button>
          </div>
        </div>
        <div class="form-grid">
          <div class="field"><label>Role</label><input data-k="role" value="${escapeAttr(e.role)}" /></div>
          <div class="field"><label>Company</label><input data-k="company" value="${escapeAttr(e.company)}" /></div>
          <div class="field"><label>Location</label><input data-k="location" value="${escapeAttr(e.location)}" /></div>
          <div class="field"><label>Start</label><input data-k="start" value="${escapeAttr(e.start)}" /></div>
          <div class="field"><label>End</label><input data-k="end" value="${escapeAttr(e.end)}" /></div>
          <div class="field"><label>Bullets (one per line)</label><textarea rows="4" data-k="bullets">${escapeHtml((e.bullets||[]).join('\n'))}</textarea></div>
        </div>
      </div>
    `;
  }).join('');

  expList.querySelectorAll('.item').forEach((itemEl) => {
    const id = itemEl.getAttribute('data-id');
    const getIdx = () => (state.experience || []).findIndex((x) => x.id === id);

    itemEl.querySelectorAll('input,textarea').forEach((inp) => {
      inp.addEventListener('input', () => {
        const idx = getIdx();
        if (idx < 0) return;
        const key = inp.getAttribute('data-k');
        if (key === 'bullets') {
          state.experience[idx].bullets = String(inp.value || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
        } else {
          state.experience[idx][key] = inp.value;
        }
        persist(state);
        render(state);
      });
    });

    itemEl.querySelectorAll('button[data-act]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const act = btn.getAttribute('data-act');
        const idx = getIdx();
        if (idx < 0) return;
        if (act === 'del') {
          state.experience.splice(idx, 1);
        }
        if (act === 'up' && idx > 0) {
          const t = state.experience[idx - 1];
          state.experience[idx - 1] = state.experience[idx];
          state.experience[idx] = t;
        }
        if (act === 'down' && idx < state.experience.length - 1) {
          const t = state.experience[idx + 1];
          state.experience[idx + 1] = state.experience[idx];
          state.experience[idx] = t;
        }
        persist(state);
        render(state);
      });
    });
  });

  const eduList = $('educationList');
  eduList.innerHTML = (state.education || []).map((ed, idx) => {
    return `
      <div class="item" data-id="${ed.id}">
        <div class="item-top">
          <div class="item-title">${escapeHtml(ed.school || 'Education')}</div>
          <div class="item-actions">
            <button class="btn btn-ghost" type="button" data-act="up" ${idx===0?'disabled':''}>Up</button>
            <button class="btn btn-ghost" type="button" data-act="down" ${idx===(state.education.length-1)?'disabled':''}>Down</button>
            <button class="btn btn-ghost" type="button" data-act="del">Delete</button>
          </div>
        </div>
        <div class="form-grid">
          <div class="field"><label>Degree</label><input data-k="degree" value="${escapeAttr(ed.degree)}" /></div>
          <div class="field"><label>School</label><input data-k="school" value="${escapeAttr(ed.school)}" /></div>
          <div class="field"><label>Location</label><input data-k="location" value="${escapeAttr(ed.location)}" /></div>
          <div class="field"><label>Start</label><input data-k="start" value="${escapeAttr(ed.start)}" /></div>
          <div class="field"><label>End</label><input data-k="end" value="${escapeAttr(ed.end)}" /></div>
          <div class="field"><label>Details</label><textarea rows="4" data-k="details">${escapeHtml(ed.details||'')}</textarea></div>
        </div>
      </div>
    `;
  }).join('');

  eduList.querySelectorAll('.item').forEach((itemEl) => {
    const id = itemEl.getAttribute('data-id');
    const getIdx = () => (state.education || []).findIndex((x) => x.id === id);

    itemEl.querySelectorAll('input,textarea').forEach((inp) => {
      inp.addEventListener('input', () => {
        const idx = getIdx();
        if (idx < 0) return;
        const key = inp.getAttribute('data-k');
        state.education[idx][key] = inp.value;
        persist(state);
        render(state);
      });
    });

    itemEl.querySelectorAll('button[data-act]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const act = btn.getAttribute('data-act');
        const idx = getIdx();
        if (idx < 0) return;
        if (act === 'del') {
          state.education.splice(idx, 1);
        }
        if (act === 'up' && idx > 0) {
          const t = state.education[idx - 1];
          state.education[idx - 1] = state.education[idx];
          state.education[idx] = t;
        }
        if (act === 'down' && idx < state.education.length - 1) {
          const t = state.education[idx + 1];
          state.education[idx + 1] = state.education[idx];
          state.education[idx] = t;
        }
        persist(state);
        render(state);
      });
    });
  });

  const skillsList = $('skillsList');
  skillsList.innerHTML = (state.skills || []).map((s, idx) => {
    return `
      <span class="pill" data-idx="${idx}">
        <span>${escapeHtml(s)}</span>
        <button type="button" data-act="del" aria-label="Remove skill">×</button>
      </span>
    `;
  }).join('');

  skillsList.querySelectorAll('button[data-act="del"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pill = btn.closest('.pill');
      const idx = Number(pill.getAttribute('data-idx'));
      state.skills.splice(idx, 1);
      persist(state);
      render(state);
    });
  });
}

function escapeAttr(str) {
  return String(str || '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function attachButtons(state) {
  $('expAddBtn').addEventListener('click', () => {
    state.experience.push({
      id: uid(),
      role: '',
      company: '',
      location: '',
      start: '',
      end: '',
      bullets: []
    });
    persist(state);
    render(state);
  });

  $('eduAddBtn').addEventListener('click', () => {
    state.education.push({
      id: uid(),
      degree: '',
      school: '',
      location: '',
      start: '',
      end: '',
      details: ''
    });
    persist(state);
    render(state);
  });

  $('skillAddBtn').addEventListener('click', () => {
    const raw = prompt('Add a skill (e.g., Python, Docker, AWS):');
    const v = normalizeText(raw);
    if (!v) return;
    state.skills.push(v);
    persist(state);
    render(state);
  });

  $('exportPdfBtn').addEventListener('click', async () => {
    const removeSpinner = showLoadingSpinner($('exportPdfBtn'));

    try {
      saveState(state);
      localStorage.setItem('ats_resume_plaintext_v1', resumeToPlainText(state));

      // Add a small delay to show the spinner
      await new Promise(resolve => setTimeout(resolve, 500));

      window.print();
      showToast('PDF export initiated. Use your browser\'s print dialog to save as PDF.', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Failed to export PDF. Please try again.', 'error');
    } finally {
      removeSpinner();
    }
  });

  $('resetBtn').addEventListener('click', () => {
    const ok = confirm('Reset all fields? This clears your local autosave.');
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('ats_resume_plaintext_v1');
    const fresh = defaultState();
    Object.assign(state, fresh);
    bindBasicFields(state);
    persist(state);
    render(state);
  });
}

// Template switching functionality
function switchTemplate(templateKey) {
  const template = TEMPLATES[templateKey];
  if (!template) return;

  // Remove existing template CSS
  document.querySelectorAll('link[data-template-css]').forEach(link => {
    link.remove();
  });

  // Remove existing template classes from body
  document.body.classList.remove('modern-template', 'executive-template', 'creative-template');

  // Add new template CSS if needed
  if (template.cssFile) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = template.cssFile;
    link.setAttribute('data-template-css', 'true');
    document.head.appendChild(link);
  }

  // Add template class to body
  if (template.class) {
    document.body.classList.add(template.class);
  }

  // Update state
  state.template = templateKey;
  persist(state);

  // Track template change
  if (typeof Analytics !== 'undefined') {
    Analytics.trackTemplate(template.name, 'switch');
  }

  showToast(`Switched to ${template.name} template`, 'success');
}

function renderTemplateSelector() {
  const selector = $('templateSelector');
  if (!selector) return;

  selector.innerHTML = Object.keys(TEMPLATES).map(key => {
    const template = TEMPLATES[key];
    const isActive = state.template === key;
    return `
      <div class="template-option ${isActive ? 'active' : ''}" data-template="${key}">
        <div class="template-info">
          <h4>${template.name}</h4>
          <p>${template.description}</p>
        </div>
        <div class="template-preview">
          <div class="mini-preview ${template.class}">
            <div class="mini-header"></div>
            <div class="mini-content">
              <div class="mini-line"></div>
              <div class="mini-line short"></div>
              <div class="mini-line"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Add click handlers
  selector.querySelectorAll('.template-option').forEach(option => {
    option.addEventListener('click', () => {
      const templateKey = option.getAttribute('data-template');
      switchTemplate(templateKey);
      
      // Update active state
      selector.querySelectorAll('.template-option').forEach(opt => {
        opt.classList.remove('active');
      });
      option.classList.add('active');
    });
  });
}

(function init() {
  const state = loadState();
  bindBasicFields(state);
  attachButtons(state);
  render(state);
  renderTemplateSelector();
  setSaveStatus('Saved');
})();
