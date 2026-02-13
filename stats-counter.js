/**
 * Resume Statistics Counter
 * Displays word count, character count, reading time, and section analysis
 */

const StatsCounter = (() => {
  const UPDATE_DEBOUNCE = 500;
  let updateTimeout;

  /**
   * Calculate statistics from resume data
   */
  function calculateStats(resumeData = {}) {
    const sections = ['summary', 'experience', 'education', 'skills'];
    let totalWords = 0;
    let totalChars = 0;
    let wordsPerSection = {};

    sections.forEach(section => {
      const content = extractSectionText(resumeData, section);
      const words = countWords(content);
      const chars = content.length;

      wordsPerSection[section] = words;
      totalWords += words;
      totalChars += chars;
    });

    const readingTime = Math.max(1, Math.ceil(totalWords / 200)); // 200 words per minute

    return {
      words: totalWords,
      characters: totalChars,
      readingTime,
      wordsPerSection,
      estimatedPages: Math.max(1, Math.ceil(totalWords / 250)) // ~250 words per page
    };
  }

  /**
   * Extract text from section
   */
  function extractSectionText(resumeData, section) {
    let text = '';

    switch (section) {
      case 'summary':
        text = resumeData.summary || '';
        break;
      case 'experience':
        (resumeData.experience || []).forEach(exp => {
          text += (exp.company || '') + ' ' + (exp.position || '') + ' ' + (exp.description || '');
        });
        break;
      case 'education':
        (resumeData.education || []).forEach(edu => {
          text += (edu.school || '') + ' ' + (edu.field || '') + ' ' + (edu.details || '');
        });
        break;
      case 'skills':
        (resumeData.skills || []).forEach(skill => {
          text += (skill.name || '') + ' ';
        });
        break;
    }

    return text;
  }

  /**
   * Count words in text
   */
  function countWords(text) {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  }

  /**
   * Create stats display widget
   */
  function createStatsWidget() {
    const toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;

    const statsContainer = document.createElement('div');
    statsContainer.id = 'stats-display';
    statsContainer.className = 'stats-display';
    statsContainer.innerHTML = `
      <div class="stat-item">
        <span class="stat-label">Words:</span>
        <span class="stat-value" id="word-count">0</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Chars:</span>
        <span class="stat-value" id="char-count">0</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Read time:</span>
        <span class="stat-value" id="read-time">0m</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Pages:</span>
        <span class="stat-value" id="page-count">0</span>
      </div>
      <button class="btn btn-ghost btn-sm" id="stats-detail-btn" title="View detailed statistics">
        📊
      </button>
    `;

    toolbar.appendChild(statsContainer);

    // Add detail button listener
    const detailBtn = statsContainer.querySelector('#stats-detail-btn');
    if (detailBtn) {
      detailBtn.addEventListener('click', showDetailedStats);
    }
  }

  /**
   * Update stats display
   */
  function updateStats() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      // Get resume data from page
      const resumeData = window.getResumeData ? window.getResumeData() : {};
      const stats = calculateStats(resumeData);

      // Update display
      const wordCount = document.getElementById('word-count');
      const charCount = document.getElementById('char-count');
      const readTime = document.getElementById('read-time');
      const pageCount = document.getElementById('page-count');

      if (wordCount) wordCount.textContent = stats.words.toLocaleString();
      if (charCount) charCount.textContent = stats.characters.toLocaleString();
      if (readTime) readTime.textContent = `${stats.readingTime}m`;
      if (pageCount) pageCount.textContent = stats.estimatedPages;

      // Warn if too long for ATS
      if (stats.words > 1000) {
        const wordCountEl = document.getElementById('word-count');
        if (wordCountEl) {
          wordCountEl.style.color = 'var(--warning, #ff9800)';
          wordCountEl.title = 'Consider trimming - over 1000 words may be too long for ATS';
        }
      }

      // Store stats
      Utils.setStorage('resume-stats', JSON.stringify(stats));
    }, UPDATE_DEBOUNCE);
  }

  /**
   * Show detailed statistics modal
   */
  function showDetailedStats() {
    const resumeData = window.getResumeData ? window.getResumeData() : {};
    const stats = calculateStats(resumeData);

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Resume Statistics</h2>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-title">Total Words</div>
              <div class="stat-number">${stats.words.toLocaleString()}</div>
              <div class="stat-hint">Target: 300-1000 for ATS</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Total Characters</div>
              <div class="stat-number">${stats.characters.toLocaleString()}</div>
              <div class="stat-hint">Includes spaces</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Reading Time</div>
              <div class="stat-number">${stats.readingTime}m</div>
              <div class="stat-hint">At 200 wpm</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Estimated Pages</div>
              <div class="stat-number">${stats.estimatedPages}</div>
              <div class="stat-hint">Target: 1 page</div>
            </div>
          </div>

          <div class="section-stats">
            <h3>Words by Section</h3>
            <div class="stats-breakdown">
              ${Object.entries(stats.wordsPerSection).map(([section, words]) => `
                <div class="stat-bar">
                  <label>${section.charAt(0).toUpperCase() + section.slice(1)}</label>
                  <div class="bar-container">
                    <div class="bar-fill" style="width: ${Math.min(100, (words / stats.words * 100) || 0)}%"></div>
                  </div>
                  <span>${words} words</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="stat-recommendations">
            <h3>Recommendations</h3>
            <ul>
              ${stats.words < 300 ? '<li>✓ Add more details to strengthen your resume</li>' : ''}
              ${stats.words > 1000 ? '<li>⚠ Consider trimming to optimize for ATS systems</li>' : ''}
              ${stats.estimatedPages > 1 ? '<li>⚠ Try to fit on one page for better impact</li>' : ''}
              ${stats.wordsPerSection.experience > stats.wordsPerSection.summary * 2 ? '<li>✓ Good experience emphasis</li>' : ''}
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" id="close-stats-modal">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#close-stats-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  /**
   * Setup listeners for real-time updates
   */
  function setupListeners() {
    // Update on any input change
    document.addEventListener('input', updateStats);
    document.addEventListener('change', updateStats);

    // Update when data is loaded
    window.addEventListener('resume-loaded', updateStats);
    window.addEventListener('resume-reordered', updateStats);
    window.addEventListener('history-apply', updateStats);
  }

  /**
   * Initialize stats counter
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        createStatsWidget();
        setupListeners();
        updateStats();
      });
    } else {
      createStatsWidget();
      setupListeners();
      updateStats();
    }

    console.log('✓ Stats Counter initialized');
  }

  return {
    init,
    calculateStats,
    updateStats
  };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', StatsCounter.init);
} else {
  StatsCounter.init();
}
