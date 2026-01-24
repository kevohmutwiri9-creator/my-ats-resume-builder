// Security Headers and CSP Configuration
window.SECURITY = {
  config: {
    csp: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://pagead2.googlesyndication.com", "https://www.google-analytics.com"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      'font-src': ["'self'", "https://fonts.gstatic.com"],
      'img-src': ["'self'", "data:", "https:", "https://www.google-analytics.com"],
      'connect-src': ["'self'", "https://www.google-analytics.com"],
      'frame-src': ["'self'", "https://googleads.g.doubleclick.net"],
      'child-src': ["'self'", "https://googleads.g.doubleclick.net"]
    },
    otherHeaders: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  },

  // Generate CSP header value
  generateCSP: function() {
    const directives = [];
    
    Object.keys(this.config.csp).forEach(directive => {
      const sources = this.config.csp[directive];
      directives.push(`${directive} ${sources.join(' ')}`);
    });
    
    return directives.join('; ');
  },

  // Apply security headers (for client-side validation)
  applySecurityHeaders: function() {
    // This is for client-side validation only
    // Real headers must be set on the server
    this.validateCSP();
    this.setupSecurityMonitoring();
  },

  // Validate CSP compliance
  validateCSP: function() {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMeta) {
      console.warn('CSP meta tag not found. Consider adding CSP headers.');
      return;
    }

    const cspContent = cspMeta.getAttribute('content');
    const expectedCSP = this.generateCSP();
    
    if (cspContent !== expectedCSP) {
      console.warn('CSP configuration may not match expected security policy');
    }
  },

  // Setup security monitoring
  setupSecurityMonitoring: function() {
    // Monitor for XSS attempts
    this.monitorXSS();
    
    // Monitor for clickjacking
    this.monitorClickjacking();
    
    // Validate external resources
    this.validateExternalResources();
  },

  // Monitor for XSS attempts
  monitorXSS: function() {
    const originalCreateElement = document.createElement;
    
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(this, tagName);
      
      if (tagName.toLowerCase() === 'script') {
        element.addEventListener('beforescriptexecute', (e) => {
          const src = e.target.src;
          if (src && !SECURITY.isAllowedSource(src, 'script-src')) {
            console.warn('Blocked potentially malicious script:', src);
            e.preventDefault();
          }
        });
      }
      
      return element;
    };
  },

  // Monitor for clickjacking
  monitorClickjacking: function() {
    if (window.top !== window.self) {
      console.warn('Page detected in iframe - potential clickjacking attempt');
      
      // Optionally break out of iframe
      if (this.config.preventFraming) {
        window.top.location = window.location;
      }
    }
  },

  // Validate external resources
  validateExternalResources: function() {
    const resources = document.querySelectorAll('[src], [href]');
    
    resources.forEach(resource => {
      const url = resource.src || resource.href;
      if (url && url.startsWith('http')) {
        const type = resource.tagName.toLowerCase();
        const directive = this.getResourceDirective(type);
        
        if (directive && !this.isAllowedSource(url, directive)) {
          console.warn('Resource may violate CSP:', url, 'Type:', type);
        }
      }
    });
  },

  // Get CSP directive for resource type
  getResourceDirective: function(tagName) {
    const mapping = {
      'script': 'script-src',
      'link': 'style-src',
      'img': 'img-src',
      'iframe': 'frame-src',
      'video': 'media-src',
      'audio': 'media-src'
    };
    
    return mapping[tagName] || 'default-src';
  },

  // Check if source is allowed
  isAllowedSource: function(url, directive) {
    const allowedSources = this.config.csp[directive] || [];
    const urlObj = new URL(url);
    
    return allowedSources.some(source => {
      if (source === "'self'") {
        return urlObj.origin === window.location.origin;
      } else if (source.startsWith('https://')) {
        return url.startsWith(source);
      }
      return false;
    });
  },

  // Rate limiting for API calls
  rateLimiter: {
    limits: {},
    
    check: function(key, limit = 10, windowMs = 60000) {
      const now = Date.now();
      const windowStart = now - windowMs;
      
      if (!this.limits[key]) {
        this.limits[key] = [];
      }
      
      // Clean old entries
      this.limits[key] = this.limits[key].filter(time => time > windowStart);
      
      // Check limit
      if (this.limits[key].length >= limit) {
        return false;
      }
      
      // Add current request
      this.limits[key].push(now);
      return true;
    },
    
    reset: function(key) {
      delete this.limits[key];
    }
  },

  // Secure fetch wrapper
  secureFetch: function(url, options = {}) {
    // Rate limiting
    const rateLimitKey = `fetch_${url}`;
    if (!this.rateLimiter.check(rateLimitKey, 10, 60000)) {
      return Promise.reject(new Error('Rate limit exceeded'));
    }
    
    // Add security headers to request
    const secureOptions = {
      ...options,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      }
    };
    
    return fetch(url, secureOptions);
  },

  // GDPR compliance helpers
  gdpr: {
    // Check if user is in EU
    isEUUser: function() {
      // This is a simplified check
      // In production, you'd use a proper geolocation service
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const euTimezones = ['Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid'];
      return euTimezones.includes(timezone);
    },
    
    // Get consent for data processing
    getConsent: function() {
      const consent = localStorage.getItem('cookieConsent');
      if (consent) {
        try {
          const consentData = JSON.parse(consent);
          return consentData.categories && consentData.categories.analytics;
        } catch (e) {
          return false;
        }
      }
      return false;
    },
    
    // Anonymize data for GDPR
    anonymizeData: function(data) {
      if (!this.getConsent()) {
        // Remove or hash personal data
        return {
          ...data,
          email: data.email ? this.hashEmail(data.email) : undefined,
          name: data.name ? this.hashString(data.name) : undefined,
          phone: data.phone ? this.hashString(data.phone) : undefined
        };
      }
      return data;
    },
    
    // Simple hash function for demo
    hashString: function(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash.toString(36);
    },
    
    hashEmail: function(email) {
      const [username, domain] = email.split('@');
      return `${this.hashString(username)}@${domain}`;
    }
  },

  // Initialize security
  init: function() {
    this.applySecurityHeaders();
    
    // Add CSP meta tag if not present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = this.generateCSP();
      document.head.appendChild(cspMeta);
    }
    
    // Add other security meta tags
    Object.keys(this.config.otherHeaders).forEach(header => {
      if (!document.querySelector(`meta[http-equiv="${header}"]`)) {
        const meta = document.createElement('meta');
        meta.httpEquiv = header;
        meta.content = this.config.otherHeaders[header];
        document.head.appendChild(meta);
      }
    });
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  SECURITY.init();
});
