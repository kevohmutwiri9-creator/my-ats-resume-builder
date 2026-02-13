/**
 * Resume Sections Manager
 * Add, remove, reorder, and customize resume sections
 */

const SectionsManager = (() => {
  const CUSTOM_SECTIONS_KEY = 'resume-custom-sections';

  const AVAILABLE_SECTIONS = [
    { id: 'summary', label: 'Professional Summary', icon: '📋', enabled: true },
    { id: 'experience', label: 'Work Experience', icon: '💼', enabled: true },
    { id: 'education', label: 'Education', icon: '🎓', enabled: true },
    { id: 'skills', label: 'Skills', icon: '⭐', enabled: true },
    { id: 'certifications', label: 'Certifications', icon: '🏆', enabled: false },
    { id: 'languages', label: 'Languages', icon: '🌐', enabled: false },
    { id: 'projects', label: 'Projects', icon: '🚀', enabled: false },
    { id: 'publications', label: 'Publications', icon: '📚', enabled: false },
    { id: 'references', label: 'References', icon: '👥', enabled: false }
  ];

  /**
   * Create sections manager panel
   */
  function createManagerPanel() {
    const panelHeader = document.querySelector('.panel-header');
    if (!panelHeader) return;

    const managerBtn = document.createElement('button');
    managerBtn.className = 'btn btn-ghost btn-sm';
    managerBtn.id = 'sections-manager-btn';
    managerBtn.innerHTML = '⚙️ Manage Sections';
    managerBtn.title = 'Add, remove, or reorder resume sections';

    panelHeader.appendChild(managerBtn);

    managerBtn.addEventListener('click', showSectionsManager);
  }

  /**
   * Show sections manager modal
   */
  function showSectionsManager() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Manage Resume Sections</h2>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <p>Select which sections to include in your resume and organize them:</p>
          
          <div id="sections-list" class="sections-list">
            ${AVAILABLE_SECTIONS.map((section, index) => `
              <div class="section-item" data-section-id="${section.id}" draggable="true">
                <input 
                  type="checkbox" 
                  class="section-checkbox" 
                  id="section-${section.id}" 
                  ${section.enabled ? 'checked' : ''}
                  data-section-id="${section.id}"
                >
                <label for="section-${section.id}" class="section-label">
                  <span class="section-icon">${section.icon}</span>
                  <span class="section-name">${section.label}</span>
                </label>
                <span class="section-drag-handle">⋮⋮</span>
              </div>
            `).join('')}
          </div>

          <div class="sections-preview">
            <h3>Preview</h3>
            <p>Your resume will include these sections in order:</p>
            <div id="sections-preview-list" class="sections-preview-list"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="reset-sections">Reset</button>
          <button class="btn btn-primary" id="save-sections">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup event listeners
    const checkboxes = modal.querySelectorAll('.section-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updatePreview);
    });

    // Setup drag and drop
    setupSectionsDragDrop(modal);

    // Buttons
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#reset-sections').addEventListener('click', () => {
      checkboxes.forEach(cb => {
        cb.checked = AVAILABLE_SECTIONS.find(s => s.id === cb.dataset.sectionId).enabled;
      });
      updatePreview();
    });

    modal.querySelector('#save-sections').addEventListener('click', () => {
      saveSectionsPreference();
      modal.remove();
      Utils.showSuccess('Sections updated');
      location.reload(); // Reload to show changes
    });

    updatePreview();
  }

  /**
   * Setup drag and drop for sections
   */
  function setupSectionsDragDrop(modal) {
    const items = modal.querySelectorAll('.section-item');
    let draggedItem = null;

    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        item.classList.add('dragging');
      });

      item.addEventListener('dragend', (e) => {
        item.classList.remove('dragging');
        draggedItem = null;
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedItem && draggedItem !== item) {
          const rect = item.getBoundingClientRect();
          const midpoint = rect.top + rect.height / 2;
          if (e.clientY < midpoint) {
            item.parentNode.insertBefore(draggedItem, item);
          } else {
            item.parentNode.insertBefore(draggedItem, item.nextSibling);
          }
        }
      });
    });
  }

  /**
   * Update preview of selected sections
   */
  function updatePreview() {
    const modal = document.querySelector('.modal-content');
    if (!modal) return;

    const selectedSections = Array.from(modal.querySelectorAll('.section-checkbox:checked'))
      .map(cb => AVAILABLE_SECTIONS.find(s => s.id === cb.dataset.sectionId));

    const previewList = modal.querySelector('#sections-preview-list');
    previewList.innerHTML = selectedSections.map(section => `
      <div class="preview-item">
        <span class="section-icon">${section.icon}</span>
        <span>${section.label}</span>
      </div>
    `).join('');
  }

  /**
   * Save sections preference
   */
  function saveSectionsPreference() {
    const modal = document.querySelector('.modal-content');
    if (!modal) return;

    const enabledSections = Array.from(modal.querySelectorAll('.section-checkbox:checked'))
      .map(cb => cb.dataset.sectionId);

    const sectionOrder = Array.from(modal.querySelectorAll('.section-item'))
      .map(item => item.dataset.sectionId);

    Utils.setStorage(CUSTOM_SECTIONS_KEY, JSON.stringify({
      enabled: enabledSections,
      order: sectionOrder
    }));
  }

  /**
   * Create custom section
   */
  function createCustomSection(title, fields = []) {
    const customSectionId = `custom-${Date.now()}`;
    const sections = JSON.parse(Utils.getStorage(CUSTOM_SECTIONS_KEY) || '{"custom":[]}') || { custom: [] };

    sections.custom.push({
      id: customSectionId,
      title,
      fields,
      createdAt: new Date().toISOString()
    });

    Utils.setStorage(CUSTOM_SECTIONS_KEY, JSON.stringify(sections));
    return customSectionId;
  }

  /**
   * Initialize sections manager
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createManagerPanel);
    } else {
      createManagerPanel();
    }

    console.log('✓ Sections Manager initialized');
  }

  return {
    init,
    createCustomSection
  };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', SectionsManager.init);
} else {
  SectionsManager.init();
}
