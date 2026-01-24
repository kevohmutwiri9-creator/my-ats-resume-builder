// Analytics Dashboard and User Behavior Tracking
window.ANALYTICS_DASHBOARD = {
  config: {
    trackingEnabled: false,
    debugMode: false,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxEvents: 1000
  },

  events: [],
  sessionStart: Date.now(),
  userJourney: [],
  
  // Initialize analytics
  init: function() {
    this.checkConsent();
    this.setupEventListeners();
    this.startSessionTracking();
    this.loadStoredEvents();
  },

  // Check user consent
  checkConsent: function() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      try {
        const consentData = JSON.parse(consent);
        this.config.trackingEnabled = consentData.categories && consentData.categories.analytics;
      } catch (e) {
        console.error('Error parsing consent:', e);
      }
    }
  },

  // Setup event listeners
  setupEventListeners: function() {
    // Track page views
    this.trackPageView();
    
    // Track button clicks
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
        this.trackButtonClick(button);
      }
    });

    // Track form interactions
    document.addEventListener('submit', (e) => {
      if (e.target.tagName === 'FORM') {
        this.trackFormSubmit(e.target);
      }
    });

    // Track scroll depth
    this.setupScrollTracking();

    // Track time on page
    this.setupTimeTracking();

    // Track errors
    window.addEventListener('error', (e) => {
      this.trackError(e);
    });
  },

  // Track page view
  trackPageView: function() {
    const pageData = {
      type: 'page_view',
      url: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.trackEvent(pageData);
    this.userJourney.push({ action: 'page_view', page: window.location.pathname, timestamp: Date.now() });
  },

  // Track button click
  trackButtonClick: function(button) {
    const buttonData = {
      type: 'button_click',
      text: button.textContent.trim(),
      id: button.id,
      className: button.className,
      page: window.location.pathname,
      timestamp: Date.now()
    };

    this.trackEvent(buttonData);
  },

  // Track form submit
  trackFormSubmit: function(form) {
    const formData = {
      type: 'form_submit',
      formId: form.id,
      formClass: form.className,
      page: window.location.pathname,
      timestamp: Date.now()
    };

    this.trackEvent(formData);
  },

  // Setup scroll tracking
  setupScrollTracking: function() {
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90];
    const triggeredThresholds = new Set();

    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      maxScroll = Math.max(maxScroll, scrollPercent);

      scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !triggeredThresholds.has(threshold)) {
          triggeredThresholds.add(threshold);
          this.trackEvent({
            type: 'scroll_depth',
            depth: threshold,
            page: window.location.pathname,
            timestamp: Date.now()
          });
        }
      });
    });
  },

  // Setup time tracking
  setupTimeTracking: function() {
    let startTime = Date.now();
    let isActive = true;

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isActive = false;
        this.trackEvent({
          type: 'page_hidden',
          timeOnPage: Date.now() - startTime,
          page: window.location.pathname,
          timestamp: Date.now()
        });
      } else {
        isActive = true;
        startTime = Date.now();
      }
    });

    // Track time on page when leaving
    window.addEventListener('beforeunload', () => {
      if (isActive) {
        this.trackEvent({
          type: 'page_leave',
          timeOnPage: Date.now() - startTime,
          page: window.location.pathname,
          timestamp: Date.now()
        });
      }
    });
  },

  // Track errors
  trackError: function(error) {
    const errorData = {
      type: 'error',
      message: error.message,
      filename: error.filename,
      lineno: error.lineno,
      colno: error.colno,
      page: window.location.pathname,
      timestamp: Date.now()
    };

    this.trackEvent(errorData);
  },

  // Track custom event
  trackEvent: function(eventData) {
    if (!this.config.trackingEnabled) return;

    // Add session info
    eventData.sessionId = this.getSessionId();
    eventData.sessionStart = this.sessionStart;

    this.events.push(eventData);
    
    // Keep only recent events
    if (this.events.length > this.config.maxEvents) {
      this.events = this.events.slice(-this.config.maxEvents);
    }

    // Store events
    this.storeEvents();

    // Send to analytics service
    this.sendToAnalytics(eventData);

    // Debug logging
    if (this.config.debugMode) {
      console.log('Analytics Event:', eventData);
    }
  },

  // Get session ID
  getSessionId: function() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  },

  // Start session tracking
  startSessionTracking: function() {
    // Track session start
    this.trackEvent({
      type: 'session_start',
      timestamp: Date.now()
    });

    // Track session end
    window.addEventListener('beforeunload', () => {
      this.trackEvent({
        type: 'session_end',
        duration: Date.now() - this.sessionStart,
        timestamp: Date.now()
      });
    });
  },

  // Store events locally
  storeEvents: function() {
    try {
      localStorage.setItem('analytics_events', JSON.stringify(this.events));
    } catch (e) {
      console.error('Failed to store analytics events:', e);
    }
  },

  // Load stored events
  loadStoredEvents: function() {
    try {
      const stored = localStorage.getItem('analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load analytics events:', e);
    }
  },

  // Send to analytics service
  sendToAnalytics: function(eventData) {
    // Send to Google Analytics if available
    if (window.gtag && this.config.trackingEnabled) {
      const eventMapping = {
        'page_view': 'page_view',
        'button_click': 'click',
        'form_submit': 'form_submit',
        'scroll_depth': 'scroll',
        'error': 'exception'
      };

      const gaEvent = eventMapping[eventData.type];
      if (gaEvent) {
        gtag('event', gaEvent, {
          event_category: eventData.type,
          event_label: eventData.text || eventData.page,
          value: eventData.depth || eventData.timeOnPage
        });
      }
    }
  },

  // Get analytics summary
  getAnalyticsSummary: function() {
    const summary = {
      totalEvents: this.events.length,
      sessionDuration: Date.now() - this.sessionStart,
      pageViews: this.events.filter(e => e.type === 'page_view').length,
      buttonClicks: this.events.filter(e => e.type === 'button_click').length,
      formSubmissions: this.events.filter(e => e.type === 'form_submit').length,
      errors: this.events.filter(e => e.type === 'error').length,
      userJourney: this.userJourney
    };

    // Calculate most visited pages
    const pageViews = this.events.filter(e => e.type === 'page_view');
    const pageCounts = {};
    pageViews.forEach(view => {
      pageCounts[view.url] = (pageCounts[view.url] || 0) + 1;
    });
    summary.mostVisitedPages = Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return summary;
  },

  // Display analytics dashboard
  displayDashboard: function() {
    const summary = this.getAnalyticsSummary();
    const dashboard = document.createElement('div');
    dashboard.className = 'analytics-dashboard';
    dashboard.innerHTML = `
      <div class="dashboard-content">
        <div class="dashboard-header">
          <h3>Analytics Dashboard</h3>
          <button class="close-btn" onclick="this.closest('.analytics-dashboard').remove()">&times;</button>
        </div>
        <div class="dashboard-metrics">
          <div class="metric">
            <div class="metric-value">${summary.totalEvents}</div>
            <div class="metric-label">Total Events</div>
          </div>
          <div class="metric">
            <div class="metric-value">${summary.pageViews}</div>
            <div class="metric-label">Page Views</div>
          </div>
          <div class="metric">
            <div class="metric-value">${summary.buttonClicks}</div>
            <div class="metric-label">Button Clicks</div>
          </div>
          <div class="metric">
            <div class="metric-value">${Math.round(summary.sessionDuration / 1000)}s</div>
            <div class="metric-label">Session Duration</div>
          </div>
        </div>
        <div class="dashboard-sections">
          <div class="dashboard-section">
            <h4>Most Visited Pages</h4>
            <ul>
              ${summary.mostVisitedPages.map(([page, count]) => `
                <li>${page}: ${count} views</li>
              `).join('')}
            </ul>
          </div>
          <div class="dashboard-section">
            <h4>User Journey</h4>
            <ol>
              ${summary.userJourney.slice(0, 10).map(step => `
                <li>${step.action} - ${step.page}</li>
              `).join('')}
            </ol>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .analytics-dashboard {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }
      .dashboard-content {
        background: var(--card-bg);
        border-radius: 12px;
        padding: 24px;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px var(--shadow);
      }
      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .dashboard-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }
      .metric {
        text-align: center;
        padding: 16px;
        background: var(--bg-secondary);
        border-radius: 8px;
      }
      .metric-value {
        font-size: 24px;
        font-weight: bold;
        color: var(--accent);
        margin-bottom: 4px;
      }
      .metric-label {
        font-size: 12px;
        color: var(--text-secondary);
      }
      .dashboard-sections {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }
      .dashboard-section h4 {
        margin-bottom: 12px;
        color: var(--text-primary);
      }
      .dashboard-section ul, .dashboard-section ol {
        margin: 0;
        padding-left: 20px;
      }
      .dashboard-section li {
        margin-bottom: 8px;
        color: var(--text-secondary);
      }
      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--text-secondary);
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(dashboard);
  },

  // Export analytics data
  exportData: function() {
    const data = {
      summary: this.getAnalyticsSummary(),
      events: this.events,
      userJourney: this.userJourney,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ANALYTICS_DASHBOARD.init();
});
