// Utility functions and global helpers
window.Utils = {
  // Toast notification system
  showToast: function(message, type = 'info', duration = 3000) {
    const existingToast = document.getElementById('toast-container');
    if (existingToast) {
      // Reuse existing container
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = message;
      existingToast.appendChild(toast);
      
      setTimeout(() => toast.remove(), duration);
      return;
    }

    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    
    container.appendChild(toast);
    document.body.appendChild(container);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => container.remove(), 300);
    }, duration);
  },

  showSuccess: function(message, duration = 2500) {
    this.showToast(message, 'success', duration);
  },

  showError: function(message, duration = 4000) {
    this.showToast(message, 'error', duration);
  },

  showWarning: function(message, duration = 3500) {
    this.showToast(message, 'warning', duration);
  },

  showInfo: function(message, duration = 3000) {
    this.showToast(message, 'info', duration);
  },

  // Loading spinner overlay
  showLoading: function(message = 'Loading...') {
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.className = 'loading-overlay';
      overlay.innerHTML = `
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <div class="loading-text" id="loading-text">${message}</div>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
    if (document.getElementById('loading-text')) {
      document.getElementById('loading-text').textContent = message;
    }
    return overlay;
  },

  hideLoading: function() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  },

  // Promise-based loading wrapper
  async withLoading(promise, message = 'Loading...') {
    this.showLoading(message);
    try {
      const result = await promise;
      this.hideLoading();
      return result;
    } catch (error) {
      this.hideLoading();
      throw error;
    }
  },

  // localStorage wrapper with quota handling
  setStorage: function(key, value) {
    try {
      const json = JSON.stringify(value);
      if (json.length > 5 * 1024 * 1024) {
        this.showWarning('Data too large. Some changes may not be saved.');
        return false;
      }
      localStorage.setItem(key, json);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        this.showError('Storage quota exceeded. Please clear some data.');
        console.warn('localStorage full:', error);
      } else {
        console.error('Storage error:', error);
      }
      return false;
    }
  },

  getStorage: function(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading storage:', error);
      return defaultValue;
    }
  },

  removeStorage: function(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing storage:', error);
      return false;
    }
  },

  // Debounce utility
  debounce: function(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle utility
  throttle: function(func, limit = 250) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Safe JSON parse
  parseJSON: function(str, defaultValue = null) {
    try {
      return JSON.parse(str);
    } catch (error) {
      console.warn('JSON parse error:', error);
      return defaultValue;
    }
  },

  // Validate email
  isValidEmail: function(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validate phone
  isValidPhone: function(phone) {
    const regex = /^[\+]?[\d\s\(\)\-\.]{7,}$/;
    return regex.test(phone);
  },

  // Escape HTML safely
  escapeHtml: function(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  },

  // Clipboard copy
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showSuccess('Copied to clipboard!');
      return true;
    } catch (error) {
      console.error('Copy failed:', error);
      this.showError('Failed to copy to clipboard');
      return false;
    }
  },

  // Check if online
  isOnline: function() {
    return navigator.onLine;
  },

  // Format date
  formatDate: function(date = new Date()) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // Generate UUID
  generateId: function() {
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
  }
};
