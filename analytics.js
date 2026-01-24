// Google Analytics 4 Configuration
window.Analytics = {
  config: {
    measurementId: 'G-XXXXXXXXXX', // Replace with your GA4 Measurement ID
    trackingEnabled: false,
    debugMode: false
  },

  // Initialize GA4
  init: function() {
    // Check consent
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      try {
        const consentData = JSON.parse(consent);
        if (consentData.categories && consentData.categories.analytics) {
          this.enableTracking();
        }
      } catch (e) {
        console.error('Error parsing consent for analytics:', e);
      }
    }

    // Listen for consent updates
    window.addEventListener('cookieConsentUpdated', (e) => {
      if (e.detail.categories && e.detail.categories.analytics) {
        this.enableTracking();
      } else {
        this.disableTracking();
      }
    });
  },

  // Enable tracking
  enableTracking: function() {
    if (this.config.trackingEnabled) return;

    // Create GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      dataLayer.push(arguments);
    };

    gtag('js', new Date());
    gtag('config', this.config.measurementId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
      send_page_view: false
    });

    // Set consent
    gtag('consent', 'default', {
      'analytics_storage': 'granted',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });

    this.config.trackingEnabled = true;
    
    // Track initial page view
    this.trackPageView();

    console.log('Google Analytics 4 tracking enabled');
  },

  // Disable tracking
  disableTracking: function() {
    if (!this.config.trackingEnabled) return;

    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }

    this.config.trackingEnabled = false;
    console.log('Google Analytics 4 tracking disabled');
  },

  // Track page view
  trackPageView: function(path = null) {
    if (!this.config.trackingEnabled) return;

    const pagePath = path || window.location.pathname;
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: pagePath
      });
    }
  },

  // Track custom event
  trackEvent: function(eventName, parameters = {}) {
    if (!this.config.trackingEnabled) return;

    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        ...parameters,
        custom_parameter_1: 'ats_resume_builder'
      });
    }
  },

  // Track resume builder interactions
  trackResumeBuilder: function(action, details = {}) {
    this.trackEvent('resume_builder_' + action, {
      event_category: 'Resume Builder',
      ...details
    });
  },

  // Track cover letter interactions
  trackCoverLetter: function(action, details = {}) {
    this.trackEvent('cover_letter_' + action, {
      event_category: 'Cover Letter',
      ...details
    });
  },

  // Track ATS checker usage
  trackATSChecker: function(action, details = {}) {
    this.trackEvent('ats_checker_' + action, {
      event_category: 'ATS Checker',
      ...details
    });
  },

  // Track template usage
  trackTemplate: function(templateName, action = 'view') {
    this.trackEvent('template_' + action, {
      event_category: 'Templates',
      template_name: templateName
    });
  },

  // Track guide interactions
  trackGuide: function(guideName, action = 'view') {
    this.trackEvent('guide_' + action, {
      event_category: 'Guides',
      guide_name: guideName
    });
  },

  // Track file exports
  trackExport: function(fileType, method = 'pdf') {
    this.trackEvent('file_export', {
      event_category: 'Exports',
      file_type: fileType,
      export_method: method
    });
  },

  // Track AI feature usage
  trackAI: function(feature, action = 'use') {
    this.trackEvent('ai_' + feature + '_' + action, {
      event_category: 'AI Features',
      ai_feature: feature
    });
  },

  // Track user engagement
  trackEngagement: function(duration, scrollDepth) {
    this.trackEvent('page_engagement', {
      event_category: 'Engagement',
      engagement_time: duration,
      scroll_depth: scrollDepth
    });
  },

  // Track errors
  trackError: function(error, context = '') {
    this.trackEvent('error', {
      event_category: 'Errors',
      error_message: error,
      error_context: context
    });
  },

  // Track search functionality
  trackSearch: function(query, resultsCount = 0) {
    this.trackEvent('search', {
      event_category: 'Search',
      search_term: query,
      results_count: resultsCount
    });
  },

  // Track form submissions
  trackForm: function(formName, success = true) {
    this.trackEvent('form_' + (success ? 'submit' : 'error'), {
      event_category: 'Forms',
      form_name: formName
    });
  },

  // Track social shares
  trackShare: function(platform, content = '') {
    this.trackEvent('social_share', {
      event_category: 'Social',
      share_platform: platform,
      share_content: content
    });
  },

  // Track download events
  trackDownload: function(filename, category = 'General') {
    this.trackEvent('file_download', {
      event_category: 'Downloads',
      file_name: filename,
      download_category: category
    });
  },

  // Track video interactions (if any)
  trackVideo: function(videoName, action, progress = 0) {
    this.trackEvent('video_' + action, {
      event_category: 'Video',
      video_name: videoName,
      video_progress: progress
    });
  },

  // Set user properties
  setUserProperty: function(property, value) {
    if (!this.config.trackingEnabled) return;

    if (typeof gtag !== 'undefined') {
      gtag('config', this.config.measurementId, {
        [property]: value
      });
    }
  },

  // Track conversion events
  trackConversion: function(conversionId, value = 0, currency = 'USD') {
    this.trackEvent('conversion', {
      event_category: 'Conversions',
      conversion_id: conversionId,
      value: value,
      currency: currency
    });
  }
};

// Initialize analytics on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  Analytics.init();
});

// Track page changes (for SPA-like behavior)
let lastPath = window.location.pathname;
const observer = new MutationObserver(() => {
  if (window.location.pathname !== lastPath) {
    lastPath = window.location.pathname;
    Analytics.trackPageView();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Track engagement time
let engagementStart = Date.now();
let maxScroll = 0;

window.addEventListener('scroll', () => {
  const scrollPercent = Math.round(
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
  );
  maxScroll = Math.max(maxScroll, scrollPercent);
});

window.addEventListener('beforeunload', () => {
  const engagementTime = Math.round((Date.now() - engagementStart) / 1000);
  Analytics.trackEngagement(engagementTime, maxScroll);
});
