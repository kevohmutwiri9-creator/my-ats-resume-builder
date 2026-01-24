// Interview Preparation Tools
window.InterviewPrep = {
  questions: {
    behavioral: [
      {
        id: 'strengths',
        question: 'Tell me about a time when you demonstrated leadership.',
        followUp: 'What was the outcome?',
        tips: 'Focus on the STAR method: Situation, Task, Action, Result. Be specific about your role and the impact you made.'
      },
      {
        id: 'weakness',
        question: 'Describe a challenge you faced and how you overcame it.',
        followUp: 'What did you learn from this experience?',
        tips: 'Show self-awareness and growth mindset. Focus on the solution and positive outcomes.'
      },
      {
        id: 'teamwork',
        question: 'Describe a situation where you had to work with a difficult team member.',
        followUp: 'How did you handle the conflict?',
        tips: 'Demonstrate professionalism and focus on shared goals. Use "I" statements and seek common ground.'
      },
      {
        id: 'problem_solving',
        question: 'Describe a complex problem you solved at work.',
        followUp: 'What was your thought process?',
        tips: 'Break down the problem systematically. Show your analytical thinking and the steps you took.'
      }
    ],
    technical: [
      {
        id: 'technical_challenge',
        question: 'What technical challenge are you most proud of overcoming?',
        followUp: 'What technologies did you use?',
        tips: 'Focus on the technical details and the learning process. Mention specific technologies and your approach.'
      },
      {
        id: 'learning',
        question: 'How do you stay updated with industry trends and technologies?',
        followUp: 'What resources do you use?',
        tips: 'Mention specific platforms, courses, or communities. Show continuous learning mindset.'
      },
      {
        id: 'system_design',
        question: 'Describe a system you architected or improved.',
        followUp: 'What were the key design decisions?',
        tips: 'Focus on scalability, performance, and user experience. Use architectural patterns and best practices.'
      }
    ],
    situational: [
      {
        id: 'handling_pressure',
        question: 'How do you handle tight deadlines or high-pressure situations?',
        followUp: 'Can you give an example?',
        tips: 'Stay calm and prioritize tasks. Communicate proactively about timelines and roadblocks.'
      },
      {
        id: 'failure',
        question: 'Tell me about a time when you failed at something.',
        followUp: 'What did you learn?',
        tips: 'Focus on the lessons learned and how you applied them. Show resilience and growth mindset.'
      },
      {
        id: 'ethical_dilemma',
        question: 'Describe an ethical dilemma you faced at work.',
        followUp: 'How did you resolve it?',
        tips: 'Consider multiple perspectives and stakeholders. Choose the option that aligns with your values and professional standards.'
      }
    ]
  },

  // Industry-specific questions
  industryQuestions: {
    technology: [
      {
        id: 'coding_challenge',
        question: 'Describe a difficult coding problem you solved recently.',
        followUp: 'What was your approach?',
        tips: 'Explain your algorithmic thinking and the trade-offs you considered.'
      },
      {
        id: 'code_review',
        question: 'How do you approach code reviews?',
        followUp: 'What do you look for?',
        tips: 'Focus on readability, maintainability, and best practices. Provide constructive feedback.'
      },
      {
        id: 'debugging',
        question: 'Walk me through how you debug a complex issue.',
        followUp: 'What tools do you use?',
        tips: 'Show systematic troubleshooting and logical deduction.'
      }
    ],
    healthcare: [
      {
        id: 'patient_care',
        question: 'How do you handle difficult patient situations?',
        followUp: 'What\'s your approach?',
        tips: 'Show empathy and patient-centered care. Follow protocols and communicate clearly with the team.'
      },
      {
        id: 'medical_knowledge',
        question: 'How do you stay current with medical procedures and terminology?',
        followUp: 'What resources do you use?',
        tips: 'Mention specific continuing education and professional development.'
      }
    ],
    finance: [
      {
        id: 'financial_analysis',
        question: 'Describe a complex financial analysis you performed.',
        followUp: 'What tools did you use?',
        tips: 'Focus on accuracy, methodology, and clear communication of findings.'
      },
      {
        id: 'risk_assessment',
        question: 'How do you evaluate financial risks?',
        followUp: 'What frameworks do you use?',
        tips: 'Consider both quantitative and qualitative factors. Document your reasoning process.'
      }
    ],
    sales: [
      {
        id: 'objection_handling',
        question: 'How do you handle customer objections?',
        followUp: 'What\'s your strategy?',
        tips: 'Listen actively, acknowledge concerns, and provide solutions. Focus on value proposition.'
      },
      {
        id: 'negotiation',
        question: 'Describe a successful negotiation.',
        followUp: 'What was your strategy?',
        tips: 'Research thoroughly and know your BATNA (Best Alternative to Negotiated Agreement).'
      },
      {
        id: 'relationship_building',
        question: 'How do you build long-term client relationships?',
        followUp: 'What\'s your approach?',
        tips: 'Focus on trust, reliability, and consistent value delivery.'
      }
    ],
    marketing: [
      {
        id: 'campaign_analysis',
        question: 'How do you measure campaign success?',
        followUp: 'What metrics do you track?',
        tips: 'Focus on ROI, conversion rates, and customer acquisition cost.'
      },
      {
        id: 'creative_strategy',
        question: 'How do you develop creative concepts?',
        followUp: 'How do you test and iterate?',
        tips: 'Use A/B testing and gather user feedback. Balance creativity with data-driven decisions.'
      }
    ]
  },

    // Common interview questions
    common: [
      {
        id: 'motivation',
        question: 'Why do you want this job?',
        followUp: 'What excites you about this role/company?',
        tips: 'Research the company and role. Align your answer with their values and mission.'
      },
      {
        id: 'career_goals',
        question: 'Where do you see yourself in 5 years?',
        followUp: 'How does this role align with your goals?',
        tips: 'Be honest about your ambitions while showing how they align with the company\'s needs.'
      },
      {
        id: 'company_research',
        question: 'What do you know about our company?',
        followUp: 'What questions do you have for us?',
        tips: 'Show you\'ve done your homework on the company culture, products, and recent news.'
      },
      {
        id: 'questions_for_interviewer',
        question: 'What questions do you have for us?',
        followUp: 'What would you like to know about the team?',
        tips: 'Ask about team culture, growth opportunities, and day-to-day responsibilities.'
      }
    ]
  ],

  // Mock interview simulator
  startMockInterview: function(type = 'behavioral') {
    const questions = this.questions[type] || this.questions.behavioral;
    let currentQuestion = 0;
    
    const modal = this.createInterviewModal(type);
    document.body.appendChild(modal);
    
    return {
      nextQuestion: () => {
        if (currentQuestion < questions.length) {
          this.showQuestion(questions[currentQuestion]);
          currentQuestion++;
        } else {
          this.endInterview();
        }
      },
      endInterview: () => {
        this.showInterviewResults();
        document.body.removeChild(modal);
      }
    };
  },

  // Create interview modal
  createInterviewModal: function(type) {
    const modal = document.createElement('div');
    modal.id = 'interview-modal';
    modal.className = 'interview-modal';
    modal.innerHTML = `
      <div class="interview-content">
        <div class="interview-header">
          <h2>🎤 Interview Practice</h2>
          <div class="interview-progress">
            <span id="question-number">Question 1</span>
            <span id="progress-text">0%</span>
          </div>
          <button class="interview-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        
        <div class="interview-body">
          <div class="question-container">
            <div id="question-text" class="question-text"></div>
            <div class="answer-container">
              <textarea id="answer-input" placeholder="Type your answer here..." rows="4"></textarea>
            </div>
          </div>
          
          <div class="interview-actions">
            <button class="btn btn-ghost" onclick="InterviewPrep.skipQuestion()">Skip</button>
            <button class="btn btn-primary" onclick="InterviewPrep.submitAnswer()">Submit Answer</button>
          </div>
        </div>
        
        <div class="interview-results" id="interview-results" style="display: none;">
          <h3>Interview Complete!</h3>
          <div class="results-content" id="results-content"></div>
          <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
      </div>
    </div>
    `;
    
    return modal;
  },

  // Show question
  showQuestion: function(question) {
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    
    questionText.innerHTML = `
      <div class="question-prompt">
        <div class="question-number">Question ${document.getElementById('question-number').textContent}</div>
        <div class="question-text">${question.question}</div>
        <div class="follow-up">${question.followUp}</div>
      </div>
    `;
    
    answerInput.value = '';
    answerInput.focus();
    
    this.updateProgress();
  },

  // Submit answer
  submitAnswer: function() {
    const answerInput = document.getElementById('answer-input');
    const answer = answerInput.value.trim();
    
    if (!answer) return;
    
    // Store answer for review
    this.saveAnswer(answer);
    
    // Show next question or end interview
    const nextBtn = document.querySelector('.interview-actions .btn-primary');
    if (nextBtn) {
      nextBtn.textContent = 'Next →';
      nextBtn.onclick = () => this.nextQuestion();
    }
    
    this.updateProgress();
  },

  // Skip question
  skipQuestion: function() {
    const answerInput = document.getElementById('answer-input');
    this.saveAnswer('(Skipped)');
    this.nextQuestion();
  },

  // Save answer
  saveAnswer: function(answer) {
    const answers = JSON.parse(localStorage.getItem('interview_answers') || '[]');
    answers.push({
      question: document.getElementById('question-text').textContent,
      answer: answer,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('interview_answers', JSON.stringify(answers));
  },

  // Update progress
  updateProgress: function() {
    const currentNum = parseInt(document.getElementById('question-number').textContent);
    const total = this.questions.behavioral.length;
    const progress = Math.round((currentNum / total) * 100);
    
    document.getElementById('progress-text').textContent = `${progress}%`;
  },

  // Show interview results
  showInterviewResults: function() {
    const resultsDiv = document.getElementById('results-content');
    const answers = JSON.parse(localStorage.getItem('interview_answers') || '[]');
    
    resultsDiv.innerHTML = `
      <h4>Interview Practice Complete!</h4>
      <p>Great job! Here are your answers for review:</p>
      <div class="answers-review">
        ${answers.map((answer, index) => `
          <div class="answer-item">
            <div class="answer-number">Question ${index + 1}</div>
            <div class="answer-question">${answer.question}</div>
            <div class="answer-text">${answer.answer}</div>
          </div>
        `).join('')}
      </div>
      <div class="interview-actions">
        <button class="btn btn-outline" onclick="InterviewPrep.downloadResults()">Download Results</button>
        <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Close</button>
      </div>
    `;
    
    document.getElementById('interview-results').style.display = 'block';
  },

  // Download results
  downloadResults: function() {
    const answers = JSON.parse(localStorage.getItem('interview_answers') || '[]');
    const content = answers.map((answer, index) => 
      `Question ${index + 1}: ${answer.question}\nAnswer: ${answer.answer}\n`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-practice-results.txt';
    a.click();
    
    // Track download
    if (typeof Analytics !== 'undefined') {
      Analytics.trackEvent('interview_download', {
        event_category: 'Interview Preparation'
      });
    }
  },

  // Initialize interview prep tools
  init: function() {
    this.createInterviewUI();
    this.setupEventListeners();
  },

  // Create interview UI
  createInterviewUI: function() {
    const main = document.querySelector('main');
    if (!main) return;

    const interviewHTML = `
      <div class="interview-prep">
        <h1>🎤 Interview Preparation Tools</h1>
        <p class="muted">Practice your interview skills with our comprehensive question bank and mock interview simulator.</p>

        <!-- Interview Type Selection -->
        <div class="interview-types">
          <h3>Choose Interview Type</h3>
          <div class="type-grid">
            <div class="type-card" onclick="InterviewPrep.startMockInterview('behavioral')">
              <div class="type-icon">🤝</div>
              <h4>Behavioral Questions</h4>
              <p>Practice common behavioral interview questions about leadership, teamwork, and problem-solving.</p>
            </div>
            <div class="type-card" onclick="InterviewPrep.startMockInterview('technical')">
              <div class="type-icon">💻</div>
              <h4>Technical Questions</h4>
              <p>Practice coding challenges, system design, and technical problem-solving questions.</p>
            </div>
            <div class="type-card" onclick="InterviewPrep.startMockInterview('situational')">
              <div class="type-icon">🎯</div>
              <h4>Situational Questions</h4>
              <p>Practice handling difficult workplace scenarios and ethical dilemmas.</p>
            </div>
          </div>
        </div>

        <!-- Question Bank -->
        <div class="question-bank">
          <h3>Interview Question Bank</h3>
          <div class="bank-sections">
            <div class="bank-section">
              <h4>📝 Behavioral Questions</h4>
              <div class="question-list" id="behavioral-questions">
                <!-- Questions will be populated by JavaScript -->
              </div>
            </div>
            
            <div class="bank-section">
              <h4>💻 Technical Questions</h4>
              <div class="question-list" id="technical-questions">
                <!-- Questions will be populated by JavaScript -->
              </div>
            </div>
            
            <div class="bank-section">
              <h4>🎯 Situational Questions</h4>
              <div class="question-list" id="situational-questions">
                <!-- Questions will be populated by JavaScript -->
              </div>
            </div>
          </div>
        </div>

        <!-- Tips Section -->
        <div class="interview-tips">
          <h3>💡 Interview Tips</h3>
          <div class="tips-grid">
            <div class="tip-card">
              <h4>Research the Company</h4>
              <p>Study their products, culture, and recent news. Tailor your answers accordingly.</p>
            </div>
            <div class="tip-card">
              <h4>Use the STAR Method</h4>
              <p>Structure your answers: Situation, Task, Action, Result. Be specific and quantifiable.</p>
            </div>
            <div class="tip-card">
              <h4>Ask Great Questions</h4>
              <p>Prepare thoughtful questions about the role, team, and company culture.</p>
            </div>
            <div class="tip-card">
              <h4>Practice Aloud</h4>
              <p>Record yourself answering questions and review your performance.</p>
            </div>
            <div class="tip-card">
              <h4>Body Language Matters</h4>
              <p>Maintain good posture, eye contact, and confident speaking pace.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    main.innerHTML = interviewHTML;
    this.populateQuestionBanks();
  },

  // Populate question banks
  populateQuestionBanks: function() {
    const behavioralQuestions = document.getElementById('behavioral-questions');
    const technicalQuestions = document.getElementById('technical-questions');
    const situationalQuestions = document.getElementById('situational-questions');

    if (behavioralQuestions) {
      behavioralQuestions.innerHTML = this.questions.behavioral.map((q, index) => `
        <div class="question-item">
          <div class="question-number">Q${index + 1}</div>
          <div class="question-text">${q.question}</div>
          <div class="question-followup">${q.followUp}</div>
          <button class="btn btn-sm btn-outline" onclick="InterviewPrep.practiceQuestion('behavioral', ${index})">
            Practice
          </button>
        </div>
      `).join('');
    }

    if (technicalQuestions) {
      technicalQuestions.innerHTML = this.questions.technical.map((q, index) => `
        <div class="question-item">
          <div class="question-number">Q${index + 1}</div>
          <div class="question-text">${q.question}</div>
          <div class="question-followup">${q.followUp}</div>
          <button class="btn btn-sm btn-outline" onclick="InterviewPrep.practiceQuestion('technical', ${index})">
            Practice
          </button>
        </div>
      `).join('');
    }

    if (situationalQuestions) {
      situationalQuestions.innerHTML = this.questions.situational.map((q, index) => `
        <div class="question-item">
          <div class="question-number">Q${index + 1}</div>
          <div class="question-text">${q.question}</div>
          <div class="question-followup">${q.followUp}</div>
          <button class="btn btn-sm btn-outline" onclick="InterviewPrep.practiceQuestion('situational', ${index})">
            Practice
          </button>
        </div>
      `).join('');
    }
  },

  // Practice specific question
  practiceQuestion: function(type, index) {
    const question = this.questions[type][index];
    this.startMockInterview(type, index);
  },

  // Setup event listeners
  setupEventListeners: function() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('interview-modal');
        if (modal) {
          modal.remove();
        }
      }
    });
  }
};

// Initialize interview prep when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  InterviewPrep.init();
});
