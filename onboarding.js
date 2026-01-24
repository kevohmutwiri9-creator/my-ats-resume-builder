// Onboarding Tutorial System
window.Onboarding = {
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to ATS Resume Builder! 👋',
      content: 'Let\'s walk through the key features to help you create an ATS-friendly resume that gets past automated screening systems.',
      target: '.hero',
      position: 'bottom'
    },
    {
      id: 'templates',
      title: 'Choose Your Template 🎨',
      content: 'Select from our ATS-optimized templates. Each template is designed to parse correctly through applicant tracking systems.',
      target: '#templateSelector',
      position: 'top'
    },
    {
      id: 'basics',
      title: 'Fill in Your Information 📝',
      content: 'Start with your basic information: name, headline, contact details, and a professional summary.',
      target: '.form-grid',
      position: 'top'
    },
    {
      id: 'experience',
      title: 'Add Your Experience 💼',
      content: 'List your work experience with quantifiable achievements. Use action verbs and include metrics whenever possible.',
      target: '#experienceList',
      position: 'top'
    },
    {
      id: 'ai_assist',
      title: 'AI Assistant 🤖',
      content: 'Use our AI assistant to improve your summary, strengthen bullet points, and get skill suggestions tailored to your target role.',
      target: '#aiAssistBtn',
      position: 'left'
    },
    {
      id: 'export',
      title: 'Export Your Resume 📄',
      content: 'When you\'re ready, export your resume as a PDF. The layout is optimized for both digital and print viewing.',
      target: '#exportPdfBtn',
      position: 'top'
    }
  ],

  currentStep: 0,
  isActive: false,
  hasSeenOnboarding: false,

  init: function() {
    this.checkOnboardingStatus();
    if (!this.hasSeenOnboarding) {
      this.startOnboarding();
    }
  },

  // Check if user has seen onboarding
  checkOnboardingStatus: function() {
    this.hasSeenOnboarding = localStorage.getItem('onboarding_completed') === 'true';
    
    // Check if user has any saved data
    const hasData = localStorage.getItem('ats_resume_builder_v1');
    if (hasData) {
      try {
        const parsed = JSON.parse(hasData);
        const hasContent = parsed.fullName || parsed.experience?.length > 0 || parsed.education?.length > 0;
        if (hasContent) {
          this.hasSeenOnboarding = true;
        }
      } catch (e) {
        // If parsing fails, assume new user
      }
    }
  },

  // Start onboarding process
  startOnboarding: function() {
    this.isActive = true;
    this.currentStep = 0;
    this.createOnboardingUI();
    this.showStep(0);
    
    // Track onboarding start
    if (typeof Analytics !== 'undefined') {
      Analytics.trackEvent('onboarding_start', {
        event_category: 'Onboarding'
      });
    }
  },

  // Create onboarding UI
  createOnboardingUI: function() {
    const overlay = document.createElement('div');
    overlay.id = 'onboarding-overlay';
    overlay.className = 'onboarding-overlay';
    overlay.innerHTML = `
      <div class="onboarding-container">
        <div class="onboarding-header">
          <h2>🚀 Quick Tour</h2>
          <div class="onboarding-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${((this.currentStep + 1) / this.steps.length) * 100}%"></div>
            </div>
            <span class="progress-text">${this.currentStep + 1} / ${this.steps.length}</span>
          </div>
          <button class="onboarding-skip" onclick="Onboarding.skipOnboarding()">Skip Tour</button>
        </div>
        
        <div class="onboarding-content">
          <div class="step-content" id="step-content"></div>
        </div>
        
        <div class="onboarding-footer">
          <button class="btn btn-ghost" onclick="Onboarding.previousStep()" ${this.currentStep === 0 ? 'disabled' : ''}>
            ← Previous
          </button>
          <button class="btn btn-primary" onclick="Onboarding.nextStep()">
            ${this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next'} →
          </button>
        </div>
      </div>
      
      <div class="onboarding-highlight" id="onboarding-highlight"></div>
    `;

    document.body.appendChild(overlay);
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      
      if (e.key === 'ArrowRight') {
        this.nextStep();
      } else if (e.key === 'ArrowLeft') {
        this.previousStep();
      } else if (e.key === 'Escape') {
        this.skipOnboarding();
      }
    });
  },

  // Show specific step
  showStep: function(stepIndex) {
    const step = this.steps[stepIndex];
    if (!step) return;

    this.currentStep = stepIndex;
    this.updateProgress();
    this.updateStepContent(step);
    this.highlightTarget(step);
  },

  // Update progress bar
  updateProgress: function() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
      progressFill.style.width = `${((this.currentStep + 1) / this.steps.length) * 100}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${this.currentStep + 1} / ${this.steps.length}`;
    }

    // Update button states
    const prevBtn = document.querySelector('.onboarding-footer .btn-ghost');
    const nextBtn = document.querySelector('.onboarding-footer .btn-primary');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentStep === 0;
    }
    
    if (nextBtn) {
      if (this.currentStep === this.steps.length - 1) {
        nextBtn.textContent = 'Finish';
        nextBtn.className = 'btn btn-success';
      } else {
        nextBtn.textContent = 'Next →';
        nextBtn.className = 'btn btn-primary';
      }
    }
  },

  // Update step content
  updateStepContent: function(step) {
    const contentDiv = document.getElementById('step-content');
    if (!contentDiv) return;

    contentDiv.innerHTML = `
      <div class="step-illustration">${this.getStepIllustration(step.id)}</div>
      <h3>${step.title}</h3>
      <p>${step.content}</p>
      ${this.getStepAction(step)}
    `;
  },

  // Get step illustration
  getStepIllustration: function(stepId) {
    const illustrations = {
      welcome: '👋',
      templates: '🎨',
      basics: '📝',
      experience: '💼',
      ai_assist: '🤖',
      export: '📄'
    };
    return illustrations[stepId] || '✨';
  },

  // Get step-specific action
  getStepAction: function(step) {
    const actions = {
      templates: `
        <div class="step-action">
          <button class="btn btn-outline" onclick="Onboarding.interactWithTemplates()">
            Try Templates
          </button>
        </div>
      `,
      basics: `
        <div class="step-action">
          <button class="btn btn-outline" onclick="Onboarding.interactWithBasics()">
            Fill Basic Info
          </button>
        </div>
      `,
      experience: `
        <div class="step-action">
          <button class="btn btn-outline" onclick="Onboarding.interactWithExperience()">
            Add Experience
          </button>
        </div>
      `,
      ai_assist: `
        <div class="step-action">
          <button class="btn btn-outline" onclick="Onboarding.interactWithAI()">
            Try AI Assistant
          </button>
        </div>
      `,
      export: `
        <div class="step-action">
          <button class="btn btn-outline" onclick="Onboarding.interactWithExport()">
            Try Export
          </button>
        </div>
      `
    };
    
    return actions[step.id] || '';
  },

  // Highlight target element
  highlightTarget: function(step) {
    this.removeHighlight();
    
    const target = document.querySelector(step.target);
    if (!target) return;

    const highlight = document.getElementById('onboarding-highlight');
    if (!highlight) return;

    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Position and style the highlight
    highlight.style.cssText = `
      position: absolute;
      top: ${rect.top + scrollTop - 5}px;
      left: ${rect.left - 5}px;
      width: ${rect.width + 10}px;
      height: ${rect.height + 10}px;
      border: 3px solid #7c5cff;
      border-radius: 8px;
      background: rgba(124, 92, 255, 0.1);
      pointer-events: none;
      z-index: 10000;
      animation: pulse 2s ease-in-out infinite;
      box-shadow: 0 0 20px rgba(124, 92, 255, 0.3);
    `;

    // Scroll target into view
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  // Remove highlight
  removeHighlight: function() {
    const highlight = document.getElementById('onboarding-highlight');
    if (highlight) {
      highlight.style.cssText = 'display: none';
    }
  },

  // Navigate to next step
  nextStep: function() {
    if (this.currentStep < this.steps.length - 1) {
      this.showStep(this.currentStep + 1);
    } else {
      this.completeOnboarding();
    }
  },

  // Navigate to previous step
  previousStep: function() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  },

  // Skip onboarding
  skipOnboarding: function() {
    this.completeOnboarding(true);
  },

  // Complete onboarding
  completeOnboarding: function(skipped = false) {
    this.isActive = false;
    this.removeHighlight();
    
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }

    // Mark as completed
    localStorage.setItem('onboarding_completed', 'true');
    this.hasSeenOnboarding = true;

    // Show completion message
    if (!skipped) {
      this.showCompletionMessage();
    }

    // Track onboarding completion
    if (typeof Analytics !== 'undefined') {
      Analytics.trackEvent('onboarding_complete', {
        event_category: 'Onboarding',
        skipped: skipped
      });
    }
  },

  // Show completion message
  showCompletionMessage: function() {
    const message = document.createElement('div');
    message.className = 'onboarding-completion';
    message.innerHTML = `
      <div class="completion-content">
        <div class="completion-icon">🎉</div>
        <div class="completion-text">
          <h4>Tour Complete!</h4>
          <p>You\'re all set to create an amazing resume. Good luck with your job search!</p>
        </div>
        <button class="btn btn-primary" onclick="this.parentElement.remove()">
          Get Started
        </button>
      </div>
    `;

    document.body.appendChild(message);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (message.parentElement) {
        message.remove();
      }
    }, 5000);
  },

  // Interaction methods
  interactWithTemplates: function() {
    const templateSelector = document.querySelector('#templateSelector');
    if (templateSelector) {
      templateSelector.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a pulse effect to templates
      templateSelector.style.animation = 'pulse 1s ease-in-out 3';
    }
  },

  interactWithBasics: function() {
    const fullNameField = document.getElementById('fullName');
    if (fullNameField) {
      fullNameField.focus();
      fullNameField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  interactWithExperience: function() {
    const addBtn = document.getElementById('expAddBtn');
    if (addBtn) {
      addBtn.click();
      const experienceList = document.getElementById('experienceList');
      if (experienceList) {
        experienceList.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  },

  interactWithAI: function() {
    const aiBtn = document.getElementById('aiAssistBtn');
    if (aiBtn) {
      aiBtn.click();
    }
  },

  interactWithExport: function() {
    const exportBtn = document.getElementById('exportPdfBtn');
    if (exportBtn) {
      exportBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      exportBtn.style.animation = 'pulse 1s ease-in-out 3';
    }
  },

  // Reset onboarding (for testing)
  resetOnboarding: function() {
    localStorage.removeItem('onboarding_completed');
    this.hasSeenOnboarding = false;
    
    // Remove any existing onboarding overlay
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) {
      overlay.remove();
    }
  },

  // Check if should show onboarding
  shouldShowOnboarding: function() {
    return !this.hasSeenOnboarding && !this.isActive;
  }
};

// Add onboarding styles
const onboardingStyles = `
  <style>
    .onboarding-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }

    .onboarding-container {
      background: var(--card);
      border-radius: var(--radius);
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: var(--shadow);
      border: 1px solid var(--line);
      position: relative;
    }

    .onboarding-header {
      padding: 20px 25px 15px 25px;
      border-bottom: 1px solid var(--line);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .onboarding-header h2 {
      margin: 0;
      color: var(--text);
      font-size: 20px;
      font-weight: 600;
    }

    .onboarding-progress {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .progress-bar {
      width: 200px;
      height: 8px;
      background: rgba(124, 92, 255, 0.2);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--brand), var(--brand2));
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-text {
      color: var(--muted);
      font-size: 14px;
      font-weight: 500;
    }

    .onboarding-skip {
      background: none;
      border: 1px solid var(--line);
      color: var(--muted);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .onboarding-skip:hover {
      border-color: var(--brand);
      color: var(--text);
    }

    .onboarding-content {
      padding: 25px;
    }

    .step-illustration {
      font-size: 48px;
      text-align: center;
      margin-bottom: 20px;
      animation: bounce 2s ease-in-out infinite;
    }

    .step-content h3 {
      margin: 0 0 15px 0;
      color: var(--text);
      font-size: 18px;
      font-weight: 600;
    }

    .step-content p {
      margin: 0 0 20px 0;
      color: var(--muted);
      line-height: 1.5;
    }

    .step-action {
      text-align: center;
    }

    .onboarding-footer {
      padding: 15px 25px 25px 25px;
      border-top: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      gap: 15px;
    }

    .onboarding-footer .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-success {
      background: var(--ok);
      color: white;
      border-color: var(--ok);
    }

    .btn-success:hover {
      background: #26b865;
    }

    .onboarding-completion {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--card);
      border-radius: var(--radius);
      padding: 30px;
      box-shadow: var(--shadow);
      z-index: 10001;
      text-align: center;
      animation: slideIn 0.3s ease;
    }

    .completion-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .completion-icon {
      font-size: 48px;
      animation: bounce 1s ease-in-out 3;
    }

    .completion-text h4 {
      margin: 0 0 10px 0;
      color: var(--text);
      font-size: 20px;
      font-weight: 600;
    }

    .completion-text p {
      margin: 0;
      color: var(--muted);
      line-height: 1.5;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { 
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
      }
      to { 
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(124, 92, 255, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(124, 92, 255, 0); }
      100% { box-shadow: 0 0 0 0 rgba(124, 92, 255, 0); }
    }

    @media (max-width: 768px) {
      .onboarding-container {
        width: 95%;
        max-height: 90vh;
      }
      
      .onboarding-header {
        padding: 15px 20px;
      }
      
      .onboarding-header h2 {
        font-size: 18px;
      }
      
      .onboarding-content {
        padding: 20px;
      }
      
      .step-illustration {
        font-size: 36px;
      }
      
      .onboarding-footer {
        padding: 15px 20px;
        flex-direction: column;
        gap: 10px;
      }
      
      .onboarding-footer .btn {
        width: 100%;
      }
    }
  </style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', onboardingStyles);

// Initialize onboarding when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Onboarding.init();
});
