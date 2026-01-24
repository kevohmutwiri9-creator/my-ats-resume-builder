// Cookie Consent Management
window.CookieConsent = {
  // Configuration
  config: {
    categories: {
      necessary: {
        enabled: true,
        required: true,
        name: 'Essential Cookies',
        description: 'Required for the website to function properly, including security and basic features.'
      },
      analytics: {
        enabled: false,
        required: false,
        name: 'Analytics Cookies',
        description: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.'
      },
      marketing: {
        enabled: false,
        required: false,
        name: 'Marketing Cookies',
        description: 'Used to personalize advertising and measure its effectiveness across platforms.'
      },
      personalization: {
        enabled: false,
        required: false,
        name: 'Personalization Cookies',
        description: 'Allow us to remember choices you make and provide enhanced, more personal features.'
      }
    }
  },

  // Initialize cookie consent
  init: function() {
    this.loadConsent();
    this.showConsentIfNeeded();
    this.bindEvents();
  },

  // Load consent from localStorage
  loadConsent: function() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      try {
        const consentData = JSON.parse(consent);
        this.applyConsent(consentData);
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    }
  },

  // Save consent to localStorage
  saveConsent: function(consentData) {
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
  },

  // Apply consent settings
  applyConsent: function(consentData) {
    // Update config
    Object.keys(consentData.categories).forEach(category => {
      if (this.config.categories[category]) {
        this.config.categories[category].enabled = consentData.categories[category];
      }
    });

    // Apply to scripts
    this.updateScripts();
    
    // Trigger event
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: consentData 
    }));
  },

  // Update scripts based on consent
  updateScripts: function() {
    // Google Analytics
    if (this.config.categories.analytics.enabled) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }

    // Google AdSense
    if (this.config.categories.marketing.enabled) {
      this.enableMarketing();
    } else {
      this.disableMarketing();
    }

    // Personalization features
    if (this.config.categories.personalization.enabled) {
      this.enablePersonalization();
    } else {
      this.disablePersonalization();
    }
  },

  // Enable Google Analytics
  enableAnalytics: function() {
    // Initialize GA4
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  },

  // Disable Google Analytics
  disableAnalytics: function() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  },

  // Enable marketing cookies
  enableMarketing: function() {
    // Enable AdSense
    if (typeof initializeAllAds === 'function') {
      initializeAllAds();
    }
    
    // Trigger marketing consent event
    window.dispatchEvent(new CustomEvent('cookieConsentGiven'));
  },

  // Disable marketing cookies
  disableMarketing: function() {
    // Remove AdSense ads
    document.querySelectorAll('.adsbygoogle').forEach(ad => {
      ad.remove();
    });
  },

  // Enable personalization
  enablePersonalization: function() {
    // Enable features like remembering user preferences
    document.body.classList.add('personalization-enabled');
  },

  // Disable personalization
  disablePersonalization: function() {
    document.body.classList.remove('personalization-enabled');
  },

  // Show consent banner if needed
  showConsentIfNeeded: function() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      this.showConsentBanner();
    }
  },

  // Show consent banner
  showConsentBanner: function() {
    const banner = this.createConsentBanner();
    document.body.appendChild(banner);
    
    // Show with animation
    setTimeout(() => {
      banner.classList.add('show');
    }, 100);
  },

  // Create consent banner HTML
  createConsentBanner: function() {
    const banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.innerHTML = `
      <div class="cookie-consent-container">
        <div class="cookie-consent-content">
          <div class="cookie-consent-title">🍪 Cookie Preferences</div>
          <div class="cookie-consent-text">
            We use cookies to enhance your experience, analyze site traffic, and personalize content. 
            By clicking "Accept All", you agree to our use of cookies. 
            <a href="./privacy.html" class="cookie-consent-link">Learn more</a>
          </div>
        </div>
        <div class="cookie-consent-buttons">
          <button class="cookie-consent-btn cookie-consent-btn-customize" onclick="CookieConsent.showSettings()">
            Customize
          </button>
          <button class="cookie-consent-btn cookie-consent-btn-decline" onclick="CookieConsent.declineAll()">
            Decline
          </button>
          <button class="cookie-consent-btn cookie-consent-btn-accept" onclick="CookieConsent.acceptAll()">
            Accept All
          </button>
        </div>
      </div>
    `;
    return banner;
  },

  // Show settings modal
  showSettings: function() {
    const modal = this.createSettingsModal();
    document.body.appendChild(modal);
    
    // Show with animation
    setTimeout(() => {
      modal.classList.add('show');
    }, 100);
  },

  // Create settings modal
  createSettingsModal: function() {
    const modal = document.createElement('div');
    modal.className = 'cookie-settings-modal';
    modal.innerHTML = `
      <div class="cookie-settings-content">
        <div class="cookie-settings-header">
          <h2 class="cookie-settings-title">Cookie Preferences</h2>
        </div>
        <div class="cookie-settings-body">
          ${Object.keys(this.config.categories).map(category => {
            const cat = this.config.categories[category];
            const isDisabled = cat.required;
            return `
              <div class="cookie-category">
                <div class="cookie-category-title">
                  ${cat.name}
                  ${cat.required ? '<span style="color: #28a745;">✓ Always enabled</span>' : ''}
                </div>
                <div class="cookie-category-description">${cat.description}</div>
                <label class="cookie-toggle ${isDisabled ? 'disabled' : ''}">
                  <input type="checkbox" 
                         id="cookie-${category}" 
                         ${cat.enabled ? 'checked' : ''} 
                         ${isDisabled ? 'disabled' : ''}>
                  <span class="cookie-slider"></span>
                </label>
              </div>
            `;
          }).join('')}
        </div>
        <div class="cookie-settings-footer">
          <button class="cookie-consent-btn cookie-consent-btn-decline" onclick="CookieConsent.closeSettings()">
            Cancel
          </button>
          <button class="cookie-consent-btn cookie-consent-btn-accept" onclick="CookieConsent.saveSettings()">
            Save Preferences
          </button>
        </div>
      </div>
    `;
    return modal;
  },

  // Close settings modal
  closeSettings: function() {
    const modal = document.querySelector('.cookie-settings-modal');
    if (modal) {
      modal.remove();
    }
  },

  // Save settings from modal
  saveSettings: function() {
    const consentData = {
      categories: {},
      timestamp: new Date().toISOString()
    };

    Object.keys(this.config.categories).forEach(category => {
      const checkbox = document.getElementById(`cookie-${category}`);
      if (checkbox) {
        consentData.categories[category] = checkbox.checked;
      } else {
        consentData.categories[category] = this.config.categories[category].enabled;
      }
    });

    this.saveConsent(consentData);
    this.applyConsent(consentData);
    this.closeSettings();
    this.hideConsentBanner();
  },

  // Hide consent banner
  hideConsentBanner: function() {
    const banner = document.querySelector('.cookie-consent');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  },

  // Accept all cookies
  acceptAll: function() {
    const consentData = {
      categories: {},
      timestamp: new Date().toISOString()
    };

    Object.keys(this.config.categories).forEach(category => {
      consentData.categories[category] = true;
    });

    this.saveConsent(consentData);
    this.applyConsent(consentData);
    this.hideConsentBanner();
  },

  // Decline all cookies (except necessary)
  declineAll: function() {
    const consentData = {
      categories: {},
      timestamp: new Date().toISOString()
    };

    Object.keys(this.config.categories).forEach(category => {
      consentData.categories[category] = this.config.categories[category].required;
    });

    this.saveConsent(consentData);
    this.applyConsent(consentData);
    this.hideConsentBanner();
  },

  // Bind events
  bindEvents: function() {
    // Close modal on outside click
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('cookie-settings-modal')) {
        CookieConsent.closeSettings();
      }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        CookieConsent.closeSettings();
      }
    });
  },

  // Check if category is enabled
  isCategoryEnabled: function(category) {
    return this.config.categories[category] && this.config.categories[category].enabled;
  },

  // Reset consent
  resetConsent: function() {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    location.reload();
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  CookieConsent.init();
});
