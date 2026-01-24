// Enhanced Main Application Entry Point
// This file orchestrates all the enhanced features

window.APP = {
  // Application state
  state: {
    initialized: false,
    currentPage: '',
    userPreferences: {},
    performanceMetrics: {},
    featureFlags: {}
  },

  // Initialize application
  init: function() {
    console.log('🚀 Initializing ATS Resume Builder Enhanced...');
    
    // Track initialization
    PERF.track('app_initialization');
    
    // Initialize core modules in order
    this.initializeCore();
    this.initializeFeatures();
    this.initializeAnalytics();
    this.initializeSecurity();
    this.initializeUI();
    
    // Setup global event listeners
    this.setupGlobalListeners();
    
    // Mark as initialized
    this.state.initialized = true;
    
    // Track completion
    PERF.end('app_initialization');
    
    console.log('✅ ATS Resume Builder Enhanced initialized successfully!');
    
    // Show welcome message for first-time users
    this.showWelcomeMessage();
  },

  // Initialize core modules
  initializeCore: function() {
    // Performance monitoring
    if (window.PERF) {
      PERF.init();
    }

    // PWA functionality
    if (window.PWA) {
      PWA.init();
    }

    // Theme manager
    if (window.THEME) {
      THEME.init();
    }

    // Mobile optimization
    if (window.MOBILE) {
      MOBILE.init();
    }

    // Cookie consent
    if (window.COOKIE_CONSENT) {
      COOKIE_CONSENT.init();
    }
  },

  // Initialize feature modules
  initializeFeatures: function() {
    // ATS Score Calculator
    if (window.ATS_SCORE) {
      this.setupATSScore();
    }

    // Export Manager
    if (window.EXPORT_MANAGER) {
      this.setupExportManager();
    }

    // Premium Features
    if (window.PREMIUM) {
      PREMIUM.init();
    }

    // AI Assist
    if (window.AI_ASSIST) {
      AI_ASSIST.init();
    }

    // Cloud Storage
    if (window.CLOUD_STORAGE) {
      CLOUD_STORAGE.init();
    }
  },

  // Initialize analytics
  initializeAnalytics: function() {
    // Structured data for SEO
    if (window.SEO) {
      SEO.init();
    }

    // Analytics dashboard
    if (window.ANALYTICS_DASHBOARD) {
      ANALYTICS_DASHBOARD.init();
    }

    // Google Analytics
    if (window.Analytics) {
      Analytics.init();
    }
  },

  // Initialize security
  initializeSecurity: function() {
    if (window.SECURITY) {
      SECURITY.init();
    }
  },

  // Initialize UI
  initializeUI: function() {
    // Setup page-specific features
    this.setupPageFeatures();
    
    // Setup global UI components
    this.setupGlobalUI();
    
    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
  },

  // Setup ATS Score functionality
  setupATSScore: function() {
    // Add ATS score button to builder
    const builderContainer = document.querySelector('.builder-container');
    if (builderContainer) {
      const scoreButton = document.createElement('button');
      scoreButton.className = 'ats-score-btn';
      scoreButton.innerHTML = '📊 Check ATS Score';
      scoreButton.addEventListener('click', () => {
        this.checkATSScore();
      });
      builderContainer.appendChild(scoreButton);
    }
  },

  // Setup Export Manager
  setupExportManager: function() {
    // Add export buttons to relevant pages
    const exportButtons = document.querySelectorAll('.export-btn');
    exportButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const content = this.getResumeContent();
        const filename = this.getResumeFilename();
        EXPORT_MANAGER.showExportModal(content, filename);
      });
    });
  },

  // Check ATS Score
  checkATSScore: function() {
    const content = this.getResumeContent();
    const jobDescription = this.getJobDescription();
    
    if (!content) {
      if (window.PWA) {
        PWA.showToast('Please add some content to your resume first', 'warning');
      }
      return;
    }

    PERF.track('ats_score_calculation');
    
    const scoreData = ATS_SCORE.calculateScore(content, jobDescription);
    
    // Display results
    const resultsContainer = document.getElementById('ats-score-results') || this.createResultsContainer();
    ATS_SCORE.displayResults(scoreData, resultsContainer);
    
    PERF.end('ats_score_calculation');
    
    // Track event
    if (window.Analytics && window.Analytics.config.trackingEnabled) {
      gtag('event', 'ats_score_check', {
        score: scoreData.percentage,
        grade: scoreData.grade
      });
    }
  },

  // Create results container
  createResultsContainer: function() {
    const container = document.createElement('div');
    container.id = 'ats-score-results';
    container.className = 'ats-score-results';
    
    const builder = document.querySelector('.builder-container');
    if (builder) {
      builder.appendChild(container);
    }
    
    return container;
  },

  // Get resume content
  getResumeContent: function() {
    // Try different selectors for resume content
    const selectors = [
      '.resume-content',
      '#resume-content',
      '.builder-content',
      '[contenteditable="true"]',
      'textarea[name="resume"]'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.innerHTML || element.value || element.textContent;
      }
    }
    
    return null;
  },

  // Get job description
  getJobDescription: function() {
    const element = document.querySelector('#job-description, [name="job-description"]');
    return element ? element.value || element.textContent : '';
  },

  // Get resume filename
  getResumeFilename: function() {
    const nameElement = document.querySelector('#resume-name, [name="name"]');
    const name = nameElement ? nameElement.value : 'resume';
    return name.replace(/\s+/g, '_').toLowerCase();
  },

  // Setup page-specific features
  setupPageFeatures: function() {
    const currentPage = this.getCurrentPage();
    this.state.currentPage = currentPage;
    
    switch (currentPage) {
      case 'builder':
        this.setupBuilderPage();
        break;
      case 'cover-letter':
        this.setupCoverLetterPage();
        break;
      case 'ats':
        this.setupATSPage();
        break;
      case 'templates':
        this.setupTemplatesPage();
        break;
      case 'examples':
        this.setupExamplesPage();
        break;
    }
  },

  // Get current page
  getCurrentPage: function() {
    const path = window.location.pathname;
    if (path.includes('builder')) return 'builder';
    if (path.includes('cover-letter')) return 'cover-letter';
    if (path.includes('ats')) return 'ats';
    if (path.includes('templates')) return 'templates';
    if (path.includes('examples')) return 'examples';
    return 'home';
  },

  // Setup builder page
  setupBuilderPage: function() {
    // Add real-time preview
    this.setupRealTimePreview();
    
    // Add auto-save
    this.setupAutoSave();
    
    // Add AI suggestions
    this.setupAISuggestions();
  },

  // Setup cover letter page
  setupCoverLetterPage: function() {
    // Add template selection
    this.setupTemplateSelection();
  },

  // Setup ATS page
  setupATSPage: function() {
    // Add file upload
    this.setupFileUpload();
  },

  // Setup templates page
  setupTemplatesPage: function() {
    // Add template gallery
    this.setupTemplateGallery();
  },

  // Setup examples page
  setupExamplesPage: function() {
    // Add example search
    this.setupExampleSearch();
  },

  // Setup real-time preview
  setupRealTimePreview: function() {
    const contentElements = document.querySelectorAll('[contenteditable="true"], textarea');
    const previewElement = document.querySelector('.resume-preview');
    
    if (contentElements.length > 0 && previewElement) {
      contentElements.forEach(element => {
        element.addEventListener('input', () => {
          this.updatePreview();
        });
      });
    }
  },

  // Update preview
  updatePreview: function() {
    const content = this.getResumeContent();
    const preview = document.querySelector('.resume-preview');
    
    if (preview && content) {
      preview.innerHTML = content;
    }
  },

  // Setup auto-save
  setupAutoSave: function() {
    let saveTimeout;
    
    const contentElements = document.querySelectorAll('[contenteditable="true"], textarea');
    contentElements.forEach(element => {
      element.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          this.autoSave();
        }, 2000);
      });
    });
  },

  // Auto-save
  autoSave: function() {
    const content = this.getResumeContent();
    if (content) {
      localStorage.setItem('resume_draft', content);
      
      if (window.PWA) {
        PWA.showToast('💾 Auto-saved', 'info');
      }
    }
  },

  // Setup AI suggestions
  setupAISuggestions: function() {
    // Add AI suggestion buttons
    const suggestionButton = document.createElement('button');
    suggestionButton.className = 'ai-suggest-btn';
    suggestionButton.innerHTML = '🤖 AI Suggest';
    suggestionButton.addEventListener('click', () => {
      this.getAISuggestions();
    });
    
    const builder = document.querySelector('.builder-container');
    if (builder) {
      builder.appendChild(suggestionButton);
    }
  },

  // Get AI suggestions
  getAISuggestions: function() {
    if (window.AI_ASSIST) {
      const content = this.getResumeContent();
      if (content) {
        AI_ASSIST.getSuggestions(content);
      }
    }
  },

  // Setup global UI
  setupGlobalUI: function() {
    // Add floating action button
    this.addFloatingActionButton();
    
    // Add progress indicator
    this.addProgressIndicator();
    
    // Add help button
    this.addHelpButton();
  },

  // Add floating action button
  addFloatingActionButton: function() {
    const fab = document.createElement('div');
    fab.className = 'floating-action-button';
    fab.innerHTML = '⚡';
    fab.addEventListener('click', () => {
      this.showQuickActions();
    });
    
    document.body.appendChild(fab);
  },

  // Show quick actions
  showQuickActions: function() {
    const actions = [
      { icon: '📊', label: 'ATS Score', action: () => this.checkATSScore() },
      { icon: '💾', label: 'Export', action: () => this.exportResume() },
      { icon: '🎨', label: 'Themes', action: () => THEME.toggle() },
      { icon: '📱', label: 'Install', action: () => PWA.installApp() }
    ];
    
    // Create quick actions menu
    const menu = document.createElement('div');
    menu.className = 'quick-actions-menu';
    menu.innerHTML = actions.map(action => `
      <button class="quick-action-btn" onclick="${action.action.toString()}">
        <span class="action-icon">${action.icon}</span>
        <span class="action-label">${action.label}</span>
      </button>
    `).join('');
    
    document.body.appendChild(menu);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      menu.remove();
    }, 5000);
  },

  // Export resume
  exportResume: function() {
    const content = this.getResumeContent();
    const filename = this.getResumeFilename();
    
    if (content && window.EXPORT_MANAGER) {
      EXPORT_MANAGER.showExportModal(content, filename);
    }
  },

  // Add progress indicator
  addProgressIndicator: function() {
    const indicator = document.createElement('div');
    indicator.className = 'progress-indicator';
    indicator.innerHTML = '<div class="progress-bar"></div>';
    document.body.appendChild(indicator);
  },

  // Add help button
  addHelpButton: function() {
    const helpBtn = document.createElement('button');
    helpBtn.className = 'help-button';
    helpBtn.innerHTML = '❓';
    helpBtn.addEventListener('click', () => {
      this.showHelp();
    });
    
    document.body.appendChild(helpBtn);
  },

  // Show help
  showHelp: function() {
    if (window.PWA) {
      PWA.showToast('📖 Help documentation coming soon!', 'info');
    }
  },

  // Setup global event listeners
  setupGlobalListeners: function() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveAppState();
      } else {
        this.restoreAppState();
      }
    });

    // Track before unload
    window.addEventListener('beforeunload', () => {
      this.saveAppState();
    });

    // Track online/offline
    window.addEventListener('online', () => {
      if (window.PWA) {
        PWA.showToast('🌐 Back online!', 'success');
      }
    });

    window.addEventListener('offline', () => {
      if (window.PWA) {
        PWA.showToast('📵 You\'re offline', 'warning');
      }
    });
  },

  // Setup keyboard shortcuts
  setupKeyboardShortcuts: function() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.autoSave();
      }
      
      // Ctrl/Cmd + E: Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        this.exportResume();
      }
      
      // Ctrl/Cmd + K: ATS Score
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.checkATSScore();
      }
      
      // Ctrl/Cmd + D: Dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        THEME.toggle();
      }
    });
  },

  // Save app state
  saveAppState: function() {
    const state = {
      currentPage: this.state.currentPage,
      timestamp: Date.now(),
      scrollPosition: window.scrollY
    };
    
    localStorage.setItem('app_state', JSON.stringify(state));
  },

  // Restore app state
  restoreAppState: function() {
    try {
      const savedState = localStorage.getItem('app_state');
      if (savedState) {
        const state = JSON.parse(savedState);
        
        // Restore scroll position
        if (state.scrollPosition) {
          window.scrollTo(0, state.scrollPosition);
        }
      }
    } catch (e) {
      console.error('Failed to restore app state:', e);
    }
  },

  // Show welcome message
  showWelcomeMessage: function() {
    const hasVisited = localStorage.getItem('has_visited');
    
    if (!hasVisited) {
      setTimeout(() => {
        if (window.PWA) {
          PWA.showToast('👋 Welcome to ATS Resume Builder Enhanced!', 'success');
        }
        
        localStorage.setItem('has_visited', 'true');
      }, 2000);
    }
  },

  // Add enhanced styles
  addEnhancedStyles: function() {
    if (document.getElementById('enhanced-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'enhanced-styles';
    style.textContent = `
      .floating-action-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px var(--shadow);
        z-index: 1000;
        transition: transform 0.2s ease;
      }
      
      .floating-action-button:hover {
        transform: scale(1.1);
      }
      
      .quick-actions-menu {
        position: fixed;
        bottom: 90px;
        right: 20px;
        background: var(--card-bg);
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 4px 20px var(--shadow);
        z-index: 1000;
        min-width: 200px;
      }
      
      .quick-action-btn {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 12px;
        background: none;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      
      .quick-action-btn:hover {
        background: var(--bg-secondary);
      }
      
      .action-icon {
        font-size: 18px;
      }
      
      .action-label {
        font-weight: 500;
        color: var(--text-primary);
      }
      
      .progress-indicator {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--bg-secondary);
        z-index: 10000;
      }
      
      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--accent) 0%, var(--accent-hover) 100%);
        width: 0%;
        transition: width 0.3s ease;
      }
      
      .help-button {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: none;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 2px 8px var(--shadow);
        z-index: 1000;
      }
      
      .ats-score-btn {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        margin: 16px 0;
        transition: transform 0.2s ease;
      }
      
      .ats-score-btn:hover {
        transform: translateY(-2px);
      }
      
      .ai-suggest-btn {
        background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        margin: 16px 0;
        transition: transform 0.2s ease;
      }
      
      .ai-suggest-btn:hover {
        transform: translateY(-2px);
      }
      
      @media (max-width: 768px) {
        .floating-action-button {
          bottom: 80px;
        }
        
        .quick-actions-menu {
          bottom: 150px;
          right: 10px;
          left: 10px;
          min-width: auto;
        }
        
        .help-button {
          bottom: 80px;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  APP.addEnhancedStyles();
  APP.init();
});

// Make app available globally
window.APP = APP;
