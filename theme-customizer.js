/**
 * Theme Customizer
 * Customize colors, fonts, and spacing of resume
 */

const ThemeCustomizer = (() => {
  const STORAGE_KEY = 'resume-theme-custom';

  const DEFAULT_THEME = {
    accentColor: '#7c5cff',
    textColor: '#333333',
    lightBg: '#f9f9f9',
    fontFamily: 'system-ui',
    fontSize: '16px',
    lineHeight: '1.6'
  };

  /**
   * Create customizer button
   */
  function createCustomizerButton() {
    const toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;

    const customizerBtn = document.createElement('button');
    customizerBtn.className = 'btn btn-ghost';
    customizerBtn.id = 'theme-customizer-btn';
    customizerBtn.innerHTML = '🎨 Design';
    customizerBtn.setAttribute('aria-label', 'Customize theme');
    customizerBtn.title = 'Customize colors, fonts, and layout';

    customizerBtn.addEventListener('click', showCustomizer);

    toolbar.appendChild(customizerBtn);
  }

  /**
   * Show customizer modal
   */
  function showCustomizer() {
    const currentTheme = getTheme();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>🎨 Customize Your Resume</h2>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <div class="customizer-tabs">
            <button class="customizer-tab-btn active" data-tab="colors">Colors</button>
            <button class="customizer-tab-btn" data-tab="fonts">Fonts</button>
            <button class="customizer-tab-btn" data-tab="layout">Layout</button>
          </div>

          <div id="colors-tab" class="customizer-tab active">
            <div class="color-picker">
              <label>Accent Color</label>
              <input type="color" id="accent-color" value="${currentTheme.accentColor}">
              <div class="color-presets">
                <button class="color-preset" style="background: #7c5cff" data-color="#7c5cff">Purple</button>
                <button class="color-preset" style="background: #3498db" data-color="#3498db">Blue</button>
                <button class="color-preset" style="background: #e74c3c" data-color="#e74c3c">Red</button>
                <button class="color-preset" style="background: #27ae60" data-color="#27ae60">Green</button>
                <button class="color-preset" style="background: #f39c12" data-color="#f39c12">Orange</button>
                <button class="color-preset" style="background: #2c3e50" data-color="#2c3e50">Dark</button>
              </div>
            </div>

            <div class="color-picker">
              <label>Text Color</label>
              <input type="color" id="text-color" value="${currentTheme.textColor}">
            </div>

            <div class="color-picker">
              <label>Background Color</label>
              <input type="color" id="bg-color" value="${currentTheme.lightBg}">
            </div>
          </div>

          <div id="fonts-tab" class="customizer-tab">
            <div class="field">
              <label>Font Family</label>
              <select id="font-family">
                <option value="system-ui" ${currentTheme.fontFamily === 'system-ui' ? 'selected' : ''}>System Font</option>
                <option value="Georgia" ${currentTheme.fontFamily === 'Georgia' ? 'selected' : ''}>Georgia (Serif)</option>
                <option value="'Times New Roman'" ${currentTheme.fontFamily === "'Times New Roman'" ? 'selected' : ''}>Times New Roman</option>
                <option value="Courier" ${currentTheme.fontFamily === 'Courier' ? 'selected' : ''}>Courier (Monospace)</option>
              </select>
            </div>

            <div class="field">
              <label>Base Font Size</label>
              <div class="slider-with-value">
                <input type="range" id="font-size" min="14" max="18" value="${parseInt(currentTheme.fontSize)}">
                <span class="value-display">${currentTheme.fontSize}</span>px
              </div>
            </div>

            <div class="field">
              <label>Line Height</label>
              <div class="slider-with-value">
                <input type="range" id="line-height" min="1.2" max="2" step="0.1" value="${currentTheme.lineHeight}">
                <span class="value-display">${currentTheme.lineHeight}</span>
              </div>
            </div>
          </div>

          <div id="layout-tab" class="customizer-tab">
            <div class="field">
              <label>
                <input type="checkbox" id="show-photo" checked>
                Show Profile Photo
              </label>
            </div>

            <div class="field">
              <label>
                <input type="checkbox" id="show-summary" checked>
                Show Professional Summary
              </label>
            </div>

            <div class="field">
              <label>Resume Spacing</label>
              <div class="spacing-options">
                <button class="spacing-btn" data-spacing="compact">Compact</button>
                <button class="spacing-btn active" data-spacing="normal">Normal</button>
                <button class="spacing-btn" data-spacing="spacious">Spacious</button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-preview">
          <div class="preview-header">
            <h3 style="color: var(--brand)">Resume Preview</h3>
            <p style="color: var(--muted)">Your Name</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="reset-theme">Reset</button>
          <button class="btn btn-primary" id="save-theme">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Tab switching
    modal.querySelectorAll('.customizer-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        modal.querySelectorAll('.customizer-tab').forEach(c => c.classList.remove('active'));
        modal.querySelectorAll('.customizer-tab-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(`${tab}-tab`).classList.add('active');
        btn.classList.add('active');
      });
    });

    // Color presets
    modal.querySelectorAll('.color-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.dataset.color;
        modal.querySelector('#accent-color').value = color;
        updatePreview(modal);
      });
    });

    // Range sliders
    modal.querySelectorAll('input[type="range"]').forEach(input => {
      input.addEventListener('input', () => {
        input.parentElement.querySelector('.value-display').textContent = input.value;
        updatePreview(modal);
      });
    });

    // Color inputs
    modal.querySelectorAll('input[type="color"]').forEach(input => {
      input.addEventListener('change', () => updatePreview(modal));
    });

    // Close
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());

    // Save
    modal.querySelector('#save-theme').addEventListener('click', () => {
      const theme = {
        accentColor: modal.querySelector('#accent-color').value,
        textColor: modal.querySelector('#text-color').value,
        lightBg: modal.querySelector('#bg-color').value,
        fontFamily: modal.querySelector('#font-family').value,
        fontSize: modal.querySelector('#font-size').value + 'px',
        lineHeight: modal.querySelector('#line-height').value
      };

      saveTheme(theme);
      applyTheme(theme);
      modal.remove();
      Utils.showSuccess('Theme updated!');
    });

    // Reset
    modal.querySelector('#reset-theme').addEventListener('click', () => {
      const inputs = modal.querySelectorAll('input');
      inputs.forEach(input => {
        const key = input.id.replace(/-\w/g, x => x[1].toUpperCase()).replace(/Id$/, '');
        input.value = DEFAULT_THEME[key] || DEFAULT_THEME.accentColor;
      });
      updatePreview(modal);
    });

    updatePreview(modal);
  }

  /**
   * Update preview
   */
  function updatePreview(modal) {
    const accentColor = modal.querySelector('#accent-color').value;
    const fontSize = modal.querySelector('#font-size').value;
    const fontFamily = modal.querySelector('#font-family').value;

    const preview = modal.querySelector('.modal-preview');
    if (preview) {
      preview.style.fontSize = fontSize + 'px';
      preview.style.fontFamily = fontFamily;
      preview.style.setProperty('--brand', accentColor);
    }
  }

  /**
   * Get current theme
   */
  function getTheme() {
    const stored = Utils.getStorage(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_THEME;
  }

  /**
   * Save theme
   */
  function saveTheme(theme) {
    Utils.setStorage(STORAGE_KEY, JSON.stringify(theme));
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty('--brand', theme.accentColor);
    root.style.setProperty('--text', theme.textColor);
    root.style.setProperty('--light-bg', theme.lightBg);
    root.style.fontFamily = theme.fontFamily;
    root.style.fontSize = theme.fontSize;
    root.style.lineHeight = theme.lineHeight;
  }

  /**
   * Initialize theme customizer
   */
  function init() {
    // Apply saved theme
    const theme = getTheme();
    applyTheme(theme);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createCustomizerButton);
    } else {
      createCustomizerButton();
    }

    console.log('✓ Theme Customizer initialized');
  }

  return {
    init,
    getTheme,
    saveTheme,
    applyTheme
  };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ThemeCustomizer.init);
} else {
  ThemeCustomizer.init();
}
