/**
 * AI Content Generator
 * Generate resume content, improve text, and suggest improvements
 */

const AIContentGenerator = (() => {
  /**
   * Generate job description suggestions
   */
  function generateJobDescriptions(jobTitle, company) {
    const templates = {
      'software engineer': [
        'Developed and maintained scalable web applications using modern frameworks',
        'Implemented RESTful APIs and microservices architecture',
        'Led code reviews and mentored junior developers',
        'Optimized database performance and reduced query times by 40%',
        'Collaborated with product team to define technical requirements'
      ],
      'product manager': [
        'Defined product roadmap and prioritized features based on market research',
        'Managed cross-functional teams including engineering and design',
        'Analyzed user data to inform product decisions',
        'Increased user engagement by 35% through feature optimization',
        'Presented quarterly business reviews to stakeholders'
      ],
      'designer': [
        'Designed user interfaces and user experiences for web and mobile applications',
        'Created design systems and component libraries',
        'Conducted user research and usability testing',
        'Improved accessibility compliance to WCAG 2.1 standards',
        'Collaborated with engineering teams on design implementation'
      ],
      'data scientist': [
        'Built machine learning models to predict customer behavior',
        'Performed statistical analysis and created data visualizations',
        'Optimized model performance achieving 92% accuracy',
        'Communicated insights to non-technical stakeholders',
        'Automated data pipeline reducing manual work by 50%'
      ]
    };

    const title = jobTitle.toLowerCase();
    return templates[title] || templates['software engineer'];
  }

  /**
   * Suggest action verbs for bullet points
   */
  function suggestActionVerbs(text) {
    const weakVerbs = {
      'worked': 'Collaborated, Coordinated, Partnered',
      'helped': 'Facilitated, Supported, Enabled',
      'did': 'Accomplished, Executed, Delivered',
      'was': 'Served as, Acted as, Functioned as',
      'made': 'Created, Developed, Produced',
      'got': 'Achieved, Obtained, Secured',
      'went': 'Progressed, Advanced, Transitioned',
      'said': 'Communicated, Articulated, Presented'
    };

    let suggestions = [];
    Object.entries(weakVerbs).forEach(([weak, strong]) => {
      if (text.toLowerCase().includes(weak)) {
        suggestions.push({
          weak,
          strong
        });
      }
    });

    return suggestions;
  }

  /**
   * Improve text quality
   */
  function improveText(text) {
    return {
      original: text,
      suggestions: [
        { type: 'length', message: text.length < 50 ? 'Consider adding more detail' : 'Good level of detail' },
        { type: 'weakness', message: text.toLowerCase().includes('responsible') ? 'Replace "responsible for" with stronger action verbs' : 'Good action verbs used' },
        { type: 'quantify', message: !text.match(/\d+%|\d+x|^[\d,]+/) ? 'Consider adding metrics or numbers' : 'Good quantification' }
      ]
    };
  }

  /**
   * Create AI generator button
   */
  function createGeneratorButton() {
    const toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;

    const aiBtn = document.createElement('button');
    aiBtn.className = 'btn btn-ghost';
    aiBtn.id = 'ai-generator-btn';
    aiBtn.innerHTML = '✨ AI Help';
    aiBtn.setAttribute('aria-label', 'Get AI content suggestions');
    aiBtn.title = 'Generate and improve resume content';

    aiBtn.addEventListener('click', showAIGenerator);

    toolbar.appendChild(aiBtn);
  }

  /**
   * Show AI generator modal
   */
  function showAIGenerator() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>✨ AI Content Generator</h2>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <div class="ai-tabs">
            <button class="ai-tab-btn active" data-tab="generate">Generate</button>
            <button class="ai-tab-btn" data-tab="improve">Improve</button>
            <button class="ai-tab-btn" data-tab="verbs">Action Verbs</button>
          </div>

          <div id="generate-tab" class="ai-tab-content active">
            <h3>Generate Job Descriptions</h3>
            <div class="field">
              <label for="job-title">Job Title</label>
              <input type="text" id="job-title" placeholder="e.g., Software Engineer">
            </div>
            <div class="field">
              <label for="company">Company (optional)</label>
              <input type="text" id="company" placeholder="e.g., Google">
            </div>
            <button class="btn btn-primary" id="generate-btn">Generate Suggestions</button>
            <div id="generated-suggestions" style="margin-top: 20px;"></div>
          </div>

          <div id="improve-tab" class="ai-tab-content">
            <h3>Improve Your Text</h3>
            <div class="field">
              <label for="text-to-improve">Paste your bullet point</label>
              <textarea id="text-to-improve" placeholder="Enter text to improve..."></textarea>
            </div>
            <button class="btn btn-primary" id="improve-btn">Get Suggestions</button>
            <div id="improve-suggestions" style="margin-top: 20px;"></div>
          </div>

          <div id="verbs-tab" class="ai-tab-content">
            <h3>Strong Action Verbs</h3>
            <div class="field">
              <label for="weak-text">Check for weak verbs</label>
              <textarea id="weak-text" placeholder="Paste text to check..."></textarea>
            </div>
            <button class="btn btn-primary" id="verbs-btn">Find Weak Verbs</button>
            <div id="verbs-suggestions" style="margin-top: 20px;"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" id="close-ai">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Tab switching
    modal.querySelectorAll('.ai-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        modal.querySelectorAll('.ai-tab-content').forEach(c => c.classList.remove('active'));
        modal.querySelectorAll('.ai-tab-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(`${tab}-tab`).classList.add('active');
        btn.classList.add('active');
      });
    });

    // Generate button
    modal.querySelector('#generate-btn').addEventListener('click', () => {
      const jobTitle = modal.querySelector('#job-title').value;
      if (!jobTitle.trim()) {
        Utils.showError('Please enter a job title');
        return;
      }

      const suggestions = generateJobDescriptions(jobTitle);
      const output = modal.querySelector('#generated-suggestions');
      output.innerHTML = `
        <div class="suggestions-list">
          <h4>Suggested descriptions for "${jobTitle}":</h4>
          ${suggestions.map((suggestion, idx) => `
            <div class="suggestion-item">
              <p>• ${suggestion}</p>
              <button class="btn btn-sm btn-ghost" onclick="Utils.copyToClipboard('${suggestion}')">Copy</button>
            </div>
          `).join('')}
        </div>
      `;
    });

    // Improve button
    modal.querySelector('#improve-btn').addEventListener('click', () => {
      const text = modal.querySelector('#text-to-improve').value;
      if (!text.trim()) {
        Utils.showError('Please enter text');
        return;
      }

      const suggestions = improveText(text);
      const output = modal.querySelector('#improve-suggestions');
      output.innerHTML = `
        <div class="improvement-suggestions">
          ${suggestions.suggestions.map(s => `
            <div class="suggestion-item ${s.type}">
              <strong>${s.type.charAt(0).toUpperCase() + s.type.slice(1)}:</strong> ${s.message}
            </div>
          `).join('')}
        </div>
      `;
    });

    // Weak verbs button
    modal.querySelector('#verbs-btn').addEventListener('click', () => {
      const text = modal.querySelector('#weak-text').value;
      if (!text.trim()) {
        Utils.showError('Please enter text');
        return;
      }

      const suggestions = suggestActionVerbs(text);
      const output = modal.querySelector('#verbs-suggestions');

      if (suggestions.length === 0) {
        output.innerHTML = '<p class="success">✓ Great! No weak verbs detected.</p>';
        return;
      }

      output.innerHTML = `
        <div class="verb-suggestions">
          ${suggestions.map(s => `
            <div class="verb-item">
              <strong>Replace "${s.weak}"</strong> with:<br>
              <span class="strong-verbs">${s.strong}</span>
            </div>
          `).join('')}
        </div>
      `;
    });

    // Close
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#close-ai').addEventListener('click', () => modal.remove());
  }

  /**
   * Initialize AI generator
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createGeneratorButton);
    } else {
      createGeneratorButton();
    }

    console.log('✓ AI Content Generator initialized');
  }

  return {
    init,
    generateJobDescriptions,
    suggestActionVerbs,
    improveText
  };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', AIContentGenerator.init);
} else {
  AIContentGenerator.init();
}
