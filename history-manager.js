/**
 * Undo/Redo History Manager
 * Tracks state changes and allows navigation through history
 */

const HistoryManager = (() => {
  const MAX_HISTORY = 30;
  const STORAGE_KEY = 'resume-history';
  
  let history = [];
  let currentIndex = -1;

  /**
   * Add state to history
   */
  function pushState(state, label = 'Change') {
    // Remove any redo history if we're not at the end
    if (currentIndex < history.length - 1) {
      history = history.slice(0, currentIndex + 1);
    }

    // Add new state with timestamp
    history.push({
      state: JSON.stringify(state),
      label,
      timestamp: Date.now()
    });

    // Keep history size limited
    if (history.length > MAX_HISTORY) {
      history.shift();
    } else {
      currentIndex++;
    }

    saveToStorage();
    updateUI();
  }

  /**
   * Undo to previous state
   */
  function undo() {
    if (currentIndex > 0) {
      currentIndex--;
      applyState();
      return true;
    }
    return false;
  }

  /**
   * Redo to next state
   */
  function redo() {
    if (currentIndex < history.length - 1) {
      currentIndex++;
      applyState();
      return true;
    }
    return false;
  }

  /**
   * Apply state at current index
   */
  function applyState() {
    if (history[currentIndex]) {
      const state = JSON.parse(history[currentIndex].state);
      window.dispatchEvent(new CustomEvent('history-apply', { detail: state }));
      updateUI();
      Utils.showInfo(`↶ ${history[currentIndex].label}`);
    }
  }

  /**
   * Update undo/redo button states
   */
  function updateUI() {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');

    if (undoBtn) {
      undoBtn.disabled = currentIndex <= 0;
      undoBtn.title = currentIndex > 0 ? `Undo: ${history[currentIndex]?.label}` : 'Nothing to undo';
    }

    if (redoBtn) {
      redoBtn.disabled = currentIndex >= history.length - 1;
      redoBtn.title = currentIndex < history.length - 1 ? `Redo: ${history[currentIndex + 1]?.label}` : 'Nothing to redo';
    }
  }

  /**
   * Save history to localStorage
   */
  function saveToStorage() {
    try {
      const toSave = history.slice(Math.max(0, history.length - 10)); // Keep last 10
      Utils.setStorage(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save history:', e.message);
    }
  }

  /**
   * Load history from localStorage
   */
  function loadFromStorage() {
    try {
      const stored = Utils.getStorage(STORAGE_KEY);
      if (stored) {
        history = JSON.parse(stored);
        currentIndex = history.length - 1;
        updateUI();
      }
    } catch (e) {
      console.warn('Failed to load history:', e.message);
    }
  }

  /**
   * Clear all history
   */
  function clear() {
    history = [];
    currentIndex = -1;
    Utils.removeStorage(STORAGE_KEY);
    updateUI();
  }

  /**
   * Get history info
   */
  function getInfo() {
    return {
      total: history.length,
      current: currentIndex + 1,
      canUndo: currentIndex > 0,
      canRedo: currentIndex < history.length - 1,
      entries: history.map((h, i) => ({
        index: i,
        label: h.label,
        timestamp: new Date(h.timestamp).toLocaleTimeString()
      }))
    };
  }

  /**
   * Create undo/redo buttons
   */
  function createHistoryButtons() {
    const toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;

    const undoBtn = document.createElement('button');
    undoBtn.id = 'undo-btn';
    undoBtn.className = 'btn btn-ghost';
    undoBtn.innerHTML = '↶ Undo';
    undoBtn.setAttribute('aria-label', 'Undo last change');
    undoBtn.addEventListener('click', () => {
      if (undo()) {
        Utils.showSuccess('Undo completed');
      }
    });

    const redoBtn = document.createElement('button');
    redoBtn.id = 'redo-btn';
    redoBtn.className = 'btn btn-ghost';
    redoBtn.innerHTML = '↷ Redo';
    redoBtn.setAttribute('aria-label', 'Redo last undone change');
    redoBtn.addEventListener('click', () => {
      if (redo()) {
        Utils.showSuccess('Redo completed');
      }
    });

    // Find insert position (after export button, before reset)
    const exportBtn = toolbar.querySelector('#exportPdfBtn');
    if (exportBtn && exportBtn.nextSibling) {
      exportBtn.parentNode.insertBefore(undoBtn, exportBtn.nextSibling);
      undoBtn.parentNode.insertBefore(redoBtn, undoBtn.nextSibling);
    } else {
      toolbar.appendChild(undoBtn);
      toolbar.appendChild(redoBtn);
    }

    updateUI();
  }

  /**
   * Setup keyboard shortcuts
   */
  function setupShortcuts() {
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    });
  }

  /**
   * Initialize history manager
   */
  function init() {
    loadFromStorage();
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        createHistoryButtons();
        setupShortcuts();
      });
    } else {
      createHistoryButtons();
      setupShortcuts();
    }

    console.log('✓ History Manager initialized');
  }

  return {
    init,
    pushState,
    undo,
    redo,
    clear,
    getInfo
  };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', HistoryManager.init);
} else {
  HistoryManager.init();
}
