/**
 * Interview Preparation System
 * Interview questions, tips, and preparation tracking
 */

const InterviewPrepHub = (() => {
  const STORAGE_KEY = 'interview-prep-data';

  const COMMON_QUESTIONS = [
    {
      category: 'General',
      questions: [
        {
          q: 'Tell me about yourself',
          tips: ['Start with your current role and key accomplishments', 'Keep it to 1-2 minutes', 'End with why you\'re interested in this role']
        },
        {
          q: 'Why are you interested in this position?',
          tips: ['Research the company thoroughly', 'Connect your skills to their needs', 'Show genuine interest in their mission']
        },
        {
          q: 'What are your strengths?',
          tips: ['Use 2-3 specific examples', 'Back them up with achievements', 'Relate them to the job description']
        },
        {
          q: 'What are your weaknesses?',
          tips: ['Choose a real weakness', 'Show how you\'re working to improve it', 'Focus on growth mindset']
        }
      ]
    },
    {
      category: 'Behavioral',
      questions: [
        {
          q: 'Tell me about a time you overcame a challenge',
          tips: ['Use the STAR method (Situation, Task, Action, Result)', 'Choose a relevant example', 'Emphasize the outcome']
        },
        {
          q: 'Describe a time you worked in a team',
          tips: ['Highlight collaboration and communication', 'Show your role and contribution', 'Mention the team result']
        },
        {
          q: 'Tell me about a failure and what you learned',
          tips: ['Be honest and humble', 'Show what you learned', 'Demonstrate growth and resilience']
        },
        {
          q: 'How do you handle pressure or tight deadlines?',
          tips: ['Give a specific example', 'Show problem-solving skills', 'Remain calm and professional']
        }
      ]
    },
    {
      category: 'Technical',
      questions: [
        {
          q: 'Explain a technical concept you\'re expert in',
          tips: ['Tailor to the job role', 'Explain clearly without jargon', 'Show practical application']
        },
        {
          q: 'Walk me through a project you built',
          tips: ['Use clear, structured explanation', 'Mention challenges and solutions', 'Highlight your key contributions']
        }
      ]
    },
    {
      category: 'Salary & Benefits',
      questions: [
        {
          q: 'What are your salary expectations?',
          tips: ['Research industry standards', 'Give a range, not a specific number', 'Focus on value you bring']
        },
        {
          q: 'What\'s your ideal work environment?',
          tips: ['Align with company culture', 'Be honest but professional', 'Show flexibility']
        }
      ]
    }
  ];

  /**
   * Create interview prep button in toolbar
   */
  function createPrepButton() {
    const toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;

    const prepBtn = document.createElement('button');
    prepBtn.className = 'btn btn-ghost';
    prepBtn.id = 'interview-prep-btn';
    prepBtn.innerHTML = '🎤 Interview';
    prepBtn.setAttribute('aria-label', 'Interview preparation');
    prepBtn.title = 'Open interview preparation hub';

    prepBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showInterviewHub();
    });

    toolbar.appendChild(prepBtn);
  }

  /**
   * Show interview preparation hub
   */
  function showInterviewHub() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content modal-xlarge">
        <div class="modal-header">
          <h2>🎤 Interview Preparation</h2>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <div class="interview-tabs">
            <button class="interview-tab-btn active" data-tab="questions">Questions</button>
            <button class="interview-tab-btn" data-tab="tips">Tips</button>
            <button class="interview-tab-btn" data-tab="practice">Practice</button>
          </div>

          <div id="interview-content" class="interview-content">
            <div id="questions-tab" class="interview-tab-content active">
              <div class="questions-container">
                ${COMMON_QUESTIONS.map((category, idx) => `
                  <div class="category-section">
                    <h3>${category.category}</h3>
                    ${category.questions.map((item, qIdx) => `
                      <div class="question-card">
                        <details>
                          <summary class="question-text">Q: ${item.q}</summary>
                          <div class="question-details">
                            <h4>Tips:</h4>
                            <ul>
                              ${item.tips.map(tip => `<li>• ${tip}</li>`).join('')}
                            </ul>
                            <button class="btn btn-sm btn-ghost practice-btn" data-question="${item.q}">
                              📝 Log Practice
                            </button>
                          </div>
                        </details>
                      </div>
                    `).join('')}
                  </div>
                `).join('')}
              </div>
            </div>

            <div id="tips-tab" class="interview-tab-content">
              <div class="tips-grid">
                <div class="tip-card">
                  <h3>📋 Before</h3>
                  <ul>
                    <li>Research company</li>
                    <li>Understand role</li>
                    <li>Prepare STAR examples</li>
                    <li>Practice delivery</li>
                    <li>Prepare questions</li>
                  </ul>
                </div>
                <div class="tip-card">
                  <h3>🎤 During</h3>
                  <ul>
                    <li>Eye contact & smile</li>
                    <li>Listen carefully</li>
                    <li>Take pauses</li>
                    <li>Use examples</li>
                    <li>Speak clearly</li>
                  </ul>
                </div>
                <div class="tip-card">
                  <h3>✅ After</h3>
                  <ul>
                    <li>Thank you email</li>
                    <li>Mention specifics</li>
                    <li>Confirm interest</li>
                    <li>Include availability</li>
                    <li>Follow up later</li>
                  </ul>
                </div>
                <div class="tip-card">
                  <h3>🎯 STAR Method</h3>
                  <ul>
                    <li><strong>S</strong>ituation</li>
                    <li><strong>T</strong>ask</li>
                    <li><strong>A</strong>ction</li>
                    <li><strong>R</strong>esult</li>
                    <li>2-3 min per story</li>
                  </ul>
                </div>
              </div>
            </div>

            <div id="practice-tab" class="interview-tab-content">
              <div class="practice-section">
                <h3>Practice Log</h3>
                <div id="practice-list" class="practice-list"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" id="close-interview">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Tab switching
    modal.querySelectorAll('.interview-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        modal.querySelectorAll('.interview-tab-content').forEach(c => c.classList.remove('active'));
        modal.querySelectorAll('.interview-tab-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(`${tab}-tab`).classList.add('active');
        btn.classList.add('active');
      });
    });

    // Practice buttons
    modal.querySelectorAll('.practice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        savePracticeSession(btn.dataset.question);
        Utils.showSuccess('Practice logged!');
        loadPracticeList(modal);
      });
    });

    // Close handlers
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#close-interview').addEventListener('click', () => modal.remove());

    // Load practice list
    loadPracticeList(modal);
  }

  /**
   * Save practice session
   */
  function savePracticeSession(question) {
    const data = JSON.parse(Utils.getStorage(STORAGE_KEY) || '{"sessions":[]}');
    data.sessions = (data.sessions || []);
    data.sessions.push({
      question,
      date: new Date().toISOString()
    });
    Utils.setStorage(STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Load practice list
   */
  function loadPracticeList(modal) {
    const data = JSON.parse(Utils.getStorage(STORAGE_KEY) || '{"sessions":[]}');
    const list = modal.querySelector('#practice-list');

    if (!data.sessions || data.sessions.length === 0) {
      list.innerHTML = '<p class="muted">No practice sessions yet. Start practicing!</p>';
      return;
    }

    list.innerHTML = data.sessions.map((session, idx) => `
      <div class="practice-item">
        <div class="practice-info">
          <div class="practice-question">${session.question}</div>
          <div class="practice-date">${new Date(session.date).toLocaleDateString()}</div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Initialize interview prep
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createPrepButton);
    } else {
      createPrepButton();
    }

    console.log('✓ Interview Prep initialized');
  }

  return {
    init
  };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', InterviewPrepHub.init);
} else {
  InterviewPrepHub.init();
}
