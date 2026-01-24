// Dark/Light Theme Manager
window.THEME = {
  config: {
    defaultTheme: 'light',
    storageKey: 'ats-resume-theme',
    systemPreference: true
  },

  themes: {
    light: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f8f9fa',
      '--bg-tertiary': '#e9ecef',
      '--text-primary': '#212529',
      '--text-secondary': '#6c757d',
      '--text-tertiary': '#adb5bd',
      '--accent': '#7c5cff',
      '--accent-hover': '#6a4ce8',
      '--border': '#dee2e6',
      '--shadow': 'rgba(0, 0, 0, 0.1)',
      '--card-bg': '#ffffff',
      '--input-bg': '#ffffff',
      '--code-bg': '#f8f9fa'
    },
    dark: {
      '--bg-primary': '#1a1a1a',
      '--bg-secondary': '#2d2d2d',
      '--bg-tertiary': '#404040',
      '--text-primary': '#ffffff',
      '--text-secondary': '#b3b3b3',
      '--text-tertiary': '#808080',
      '--accent': '#9d88ff',
      '--accent-hover': '#b4a4ff',
      '--border': '#404040',
      '--shadow': 'rgba(0, 0, 0, 0.3)',
      '--card-bg': '#2d2d2d',
      '--input-bg': '#2d2d2d',
      '--code-bg': '#1a1a1a'
    }
  },

  init: function() {
    this.loadTheme();
    this.setupThemeToggle();
    this.setupSystemPreference();
    this.applyTheme(this.getCurrentTheme());
  },

  // Get current theme
  getCurrentTheme: function() {
    return localStorage.getItem(this.config.storageKey) || this.config.defaultTheme;
  },

  // Load saved theme
  loadTheme: function() {
    const saved = localStorage.getItem(this.config.storageKey);
    if (saved && this.themes[saved]) {
      return saved;
    }
    
    // Check system preference
    if (this.config.systemPreference && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return this.config.defaultTheme;
  },

  // Apply theme
  applyTheme: function(themeName) {
    const theme = this.themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.keys(theme).forEach(property => {
      root.style.setProperty(property, theme[property]);
    });

    // Update body class
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${themeName}`);
    
    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = theme['--accent'];
    }

    // Save preference
    localStorage.setItem(this.config.storageKey, themeName);
    
    // Update toggle button
    this.updateToggle(themeName);
  },

  // Toggle theme
  toggle: function() {
    const current = this.getCurrentTheme();
    const newTheme = current === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    
    // Track theme change
    if (window.Analytics && window.Analytics.config.trackingEnabled) {
      gtag('event', 'theme_change', {
        theme: newTheme
      });
    }
  },

  // Setup theme toggle button
  setupThemeToggle: function() {
    const toggle = document.createElement('button');
    toggle.id = 'theme-toggle';
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark/light theme');
    toggle.innerHTML = `
      <span class="theme-icon">🌙</span>
      <span class="theme-icon">☀️</span>
    `;
    
    toggle.addEventListener('click', () => this.toggle());
    
    // Add to header
    const header = document.querySelector('.header-inner');
    if (header) {
      header.appendChild(toggle);
    }
  },

  // Update toggle button state
  updateToggle: function(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.classList.toggle('theme-dark', theme === 'dark');
      toggle.classList.toggle('theme-light', theme === 'light');
    }
  },

  // Setup system preference detection
  setupSystemPreference: function() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener((e) => {
        if (this.config.systemPreference && !localStorage.getItem(this.config.storageKey)) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  },

  // Add theme transition styles
  addThemeStyles: function() {
    const style = document.createElement('style');
    style.textContent = `
      .theme-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: var(--accent);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px var(--shadow);
      }
      
      .theme-toggle:hover {
        background: var(--accent-hover);
        transform: scale(1.1);
      }
      
      .theme-icon {
        font-size: 20px;
        transition: opacity 0.3s ease;
      }
      
      .theme-light .theme-icon:first-child,
      .theme-dark .theme-icon:last-child {
        opacity: 0;
        position: absolute;
      }
      
      body {
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      * {
        transition: border-color 0.3s ease, background-color 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  THEME.init();
  THEME.addThemeStyles();
});
