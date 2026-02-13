// Keyboard navigation and accessibility enhancements
window.A11y = {
  // Setup keyboard shortcuts
  setupShortcuts: function() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + S = Save (prevent default save dialog)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        Utils.showInfo('Changes auto-save automatically');
        return;
      }

      // Escape = Close modals
      if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay.active');
        if (modal) {
          modal.classList.remove('active');
          modal.style.display = 'none';
        }
      }

      // Alt + B = Focus resume builder
      if (e.altKey && e.key === 'b') {
        const builderPanel = document.querySelector('.panel');
        if (builderPanel) {
          const firstInput = builderPanel.querySelector('input, textarea, select');
          if (firstInput) firstInput.focus();
        }
      }

      // Alt + P = Focus preview
      if (e.altKey && e.key === 'p') {
        const preview = document.querySelector('.preview');
        if (preview) {
          const firstHeading = preview.querySelector('h1, h2');
          if (firstHeading) firstHeading.focus();
        }
      }
    });
  },

  // Improve focus management
  setupFocusManagement: function() {
    // Add focus visible styles
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  },

  // Add ARIA labels to dynamic elements
  addAriaLabel: function(element, label) {
    if (element) {
      element.setAttribute('aria-label', label);
    }
  },

  // Announce screen reader messages
  announce: function(message, priority = 'polite') {
    let announcer = document.getElementById('aria-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'aria-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      document.body.appendChild(announcer);
    }
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;
  },

  // Setup skip links
  setupSkipLinks: function() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--brand);
      color: white;
      padding: 8px;
      z-index: 100;
      text-decoration: none;
    `;
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    if (document.body) {
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  },

  // Enhance form labels
  improveFormLabels: function() {
    document.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
      const label = field.parentNode?.querySelector('label');
      if (label) {
        if (!label.textContent.includes('*')) {
          label.innerHTML += ' <span aria-label="required">*</span>';
        }
      }
    });
  },

  // Setup error announcements
  announceError: function(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', `error-${fieldId}`);
      
      let errorId = `error-${fieldId}`;
      let errorEl = document.getElementById(errorId);
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = errorId;
        errorEl.setAttribute('role', 'alert');
        field.parentNode?.appendChild(errorEl);
      }
      errorEl.textContent = message;
      this.announce(message, 'assertive');
    }
  },

  // Initialize all a11y enhancements
  init: function() {
    this.setupShortcuts();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.improveFormLabels();
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (window.A11y) {
    A11y.init();
  }
});
