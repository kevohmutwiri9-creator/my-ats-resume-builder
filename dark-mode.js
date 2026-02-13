/**
 * Dark Mode Toggle System
 * Provides theme switching (light/dark), persistence, and auto-detection
 */

const DarkMode = (() => {
  const STORAGE_KEY = 'resume-builder-theme';
  const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
  };

  /**
   * Get current theme from storage or system preference
   */
  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY) || getSystemTheme();
  }

  /**
   * Detect system theme preference
   */
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === THEMES.DARK) {
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      root.setAttribute('data-theme', 'light');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === THEMES.DARK ? '#1a1a1a' : '#7c5cff');
    }
  }

  /**
   * Toggle between light and dark theme
   */
  function toggle() {
    const currentTheme = getStoredTheme();
    const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
    return newTheme;
  }

  /**
   * Set specific theme
   */
  function setTheme(theme) {
    if (!Object.values(THEMES).includes(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return;
    }

    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    
    // Dispatch custom event for other modules
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
  }

  /**
   * Create and inject theme toggle button
   */
  function createToggleButton() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const toggler = document.createElement('button');
    toggler.id = 'theme-toggler';
    toggler.className = 'btn btn-ghost theme-toggler';
    toggler.setAttribute('aria-label', 'Toggle dark mode');
    toggler.setAttribute('title', 'Toggle dark mode (D)');
    
    const currentTheme = getStoredTheme();
    toggler.innerHTML = currentTheme === THEMES.DARK 
      ? '☀️ Light' 
      : '🌙 Dark';

    toggler.addEventListener('click', () => {
      const newTheme = toggle();
      toggler.innerHTML = newTheme === THEMES.DARK 
        ? '☀️ Light' 
        : '🌙 Dark';
      Utils.showSuccess(`Switched to ${newTheme} mode`);
    });

    nav.appendChild(toggler);

    // Keyboard shortcut (D key)
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggler.click();
      }
    });
  }

  /**
   * Listen for system theme changes
   */
  function watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    });
  }

  /**
   * Initialize dark mode system
   */
  function init() {
    // Apply stored theme or system preference
    const theme = getStoredTheme();
    applyTheme(theme);

    // Create toggle button when DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
      createToggleButton();
    }

    // Watch for system theme changes
    watchSystemTheme();

    console.log('✓ Dark Mode initialized');
  }

  return {
    init,
    getTheme: () => getStoredTheme(),
    setTheme,
    toggle,
    THEMES
  };
})();

// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', DarkMode.init);
} else {
  DarkMode.init();
}
