/**
 * Analytics Dashboard
 * Track ATS score, content metrics, and provide optimization suggestions
 */

const AnalyticsDashboard = (() => {
  const STORAGE_KEY = 'resume-analytics';

  /**
   * Calculate ATS score
   */
  function calculateATSScore(resumeData = {}) {
    let score = 0;
    const feedback = [];

    // Contact info (20 points)
    if (resumeData.fullName) { score += 5; } else { feedback.push('Missing full name'); }
    if (resumeData.email) { score += 5; } else { feedback.push('Missing email'); }
    if (resumeData.phone) { score += 5; } else { feedback.push('Missing phone'); }
    if (resumeData.location) { score += 5; } else { feedback.push('Missing location'); }

    // Professional summary (10 points)
    if (resumeData.summary && resumeData.summary.length > 50) {
      score += 10;
    } else if (resumeData.summary) {
      feedback.push('Professional summary is too short');
    } else {
      feedback.push('Consider adding a professional summary');
    }

    // Experience (25 points)
    if (resumeData.experience && resumeData.experience.length > 0) {
      score += 15;
      resumeData.experience.forEach(exp => {
        if (exp.description && exp.description.length > 50) {
          score += Math.min(10, exp.description.length / 50);
        }
      });
    } else {
      feedback.push('No work experience added');
    }

    // Education (15 points)
    if (resumeData.education && resumeData.education.length > 0) {
      score += 15;
    } else {
      feedback.push('No education details added');
    }

    // Skills (20 points)
    if (resumeData.skills && resumeData.skills.length > 0) {
      score += 20;
    } else {
      feedback.push('No skills listed');
    }

    // Content quality (10 points)
    const totalWords = (resumeData.summary || '').split(/\s+/).length +
      (resumeData.experience || []).reduce((sum, e) => sum + (e.description || '').split(/\s+/).length, 0) +
      (resumeData.education || []).reduce((sum, e) => sum + (e.details || '').split(/\s+/).length, 0);

    if (totalWords > 300 && totalWords < 1000) {
      score += 10;
      feedback.push('✓ Optimal content length for ATS');
    } else if (totalWords > 1000) {
      feedback.push('⚠ Content too long - ATS systems may skip text');
    } else {
      feedback.push('Add more content to improve ATS compatibility');
    }

    return {
      score: Math.min(100, Math.round(score)),
      feedback,
      maxScore: 100
    };
  }

  /**
   * Get keyword statistics
   */
  function getKeywordStats(resumeData = {}) {
    const text = [
      resumeData.summary || '',
      (resumeData.experience || []).map(e => e.description).join(' '),
      (resumeData.skills || []).map(s => s.name).join(' ')
    ].join(' ').toLowerCase();

    const commonKeywords = {
      'leadership': 0,
      'managed': 0,
      'developed': 0,
      'implemented': 0,
      'improved': 0,
      'increased': 0,
      'decreased': 0,
      'collaborated': 0,
      'created': 0,
      'designed': 0,
      'communication': 0,
      'team': 0,
      'project': 0,
      'responsible': 0,
      'achieved': 0
    };

    Object.keys(commonKeywords).forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = text.match(regex);
      commonKeywords[keyword] = matches ? matches.length : 0;
    });

    return commonKeywords;
  }

  /**
   * Create analytics dashboard
   */
  function createDashboard() {
    const dashBtn = document.createElement('button');
    dashBtn.className = 'btn btn-ghost';
    dashBtn.id = 'analytics-btn';
    dashBtn.innerHTML = '📊 Analytics';
    dashBtn.setAttribute('aria-label', 'View analytics dashboard');
    dashBtn.title = 'Open analytics and optimization suggestions';

    const toolbar = document.querySelector('.toolbar');
    if (toolbar) {
      toolbar.appendChild(dashBtn);
    }

    dashBtn.addEventListener('click', showDashboard);
  }

  /**
   * Show full analytics dashboard
   */
  function showDashboard() {
    const resumeData = window.getResumeData ? window.getResumeData() : {};
    const atsScore = calculateATSScore(resumeData);
    const keywords = getKeywordStats(resumeData);

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h2>Resume Analytics Dashboard</h2>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <div class="analytics-grid">
            <div class="analytics-card score-card">
              <div class="score-circle" style="--score: ${atsScore.score}%">
                <div class="score-value">${atsScore.score}</div>
                <div class="score-label">ATS Score</div>
              </div>
              <div class="score-details">
                <p>${atsScore.score >= 75 ? '✓ Excellent' : atsScore.score >= 50 ? '⚠ Good' : '✗ Needs Improvement'}</p>
              </div>
            </div>

            <div class="analytics-card">
              <h3>Quick Stats</h3>
              <ul class="stat-list">
                <li>Experience entries: <strong>${(resumeData.experience || []).length}</strong></li>
                <li>Education entries: <strong>${(resumeData.education || []).length}</strong></li>
                <li>Skills listed: <strong>${(resumeData.skills || []).length}</strong></li>
                <li>Sections completed: <strong>4/${resumeData.summary ? 1 : 0}+${resumeData.experience ? 1 : 0}+${resumeData.education ? 1 : 0}+${resumeData.skills ? 1 : 0}</strong></li>
              </ul>
            </div>
          </div>

          <div class="analytics-section">
            <h3>Top Keywords Used</h3>
            <div class="keyword-cloud">
              ${Object.entries(keywords)
                .filter(([_, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 15)
                .map(([keyword, count]) => `
                  <span class="keyword-tag" style="font-size: ${Math.min(1.5, 0.8 + count * 0.2)}em">
                    ${keyword} (${count})
                  </span>
                `).join('')}
            </div>
          </div>

          <div class="analytics-section">
            <h3>Optimization Suggestions</h3>
            <div class="feedback-list">
              ${atsScore.feedback.map(fb => `
                <div class="feedback-item ${fb.startsWith('✓') ? 'success' : fb.startsWith('⚠') ? 'warning' : 'info'}">
                  ${fb}
                </div>
              `).join('')}
            </div>
          </div>

          <div class="analytics-section">
            <h3>Recommendations</h3>
            <ul class="recommendations">
              ${keywords['leadership'] === 0 ? '<li>Use "leadership" or "led" to highlight leadership experience</li>' : ''}
              ${keywords['developed'] + keywords['created'] + keywords['designed'] < 3 ? '<li>Add action verbs like "developed", "created", "designed"</li>' : ''}
              ${keywords['improved'] + keywords['increased'] < 2 ? '<li>Quantify achievements with "improved", "increased"</li>' : ''}
              ${(resumeData.experience || []).length < 3 ? '<li>Add more work experience or projects</li>' : ''}
              ${(resumeData.skills || []).length < 10 ? '<li>Add more relevant skills (minimum 10 recommended)</li>' : ''}
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="export-analytics">Export Report</button>
          <button class="btn btn-primary" id="close-analytics">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#close-analytics').addEventListener('click', () => modal.remove());
    
    modal.querySelector('#export-analytics').addEventListener('click', () => {
      exportAnalytics(atsScore, keywords, resumeData);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  /**
   * Export analytics as JSON report
   */
  function exportAnalytics(score, keywords, resumeData) {
    const report = {
      generatedAt: new Date().toISOString(),
      resumeOwner: resumeData.fullName || 'Unknown',
      atsScore: score.score,
      feedback: score.feedback,
      topKeywords: Object.entries(keywords)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([keyword, count]) => ({ keyword, count }))
    };

    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.fullName || 'resume'}-analytics-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    Utils.showSuccess('Analytics report exported');
  }

  /**
   * Initialize analytics dashboard
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createDashboard);
    } else {
      createDashboard();
    }

    console.log('✓ Analytics Dashboard initialized');
  }

  return {
    init,
    calculateATSScore,
    getKeywordStats
  };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', AnalyticsDashboard.init);
} else {
  AnalyticsDashboard.init();
}
