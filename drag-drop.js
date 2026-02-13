/**
 * Drag & Drop Reordering System
 * Allows users to drag resume sections and entries to reorder them
 */

const DragDrop = (() => {
  let draggedElement = null;
  let placeholder = null;

  /**
   * Make elements draggable and reorderable
   */
  function makeReorderable(container, selector) {
    const items = container.querySelectorAll(selector);

    items.forEach(item => {
      item.setAttribute('draggable', 'true');
      item.classList.add('draggable-item');

      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('drop', handleDrop);
      item.addEventListener('dragenter', handleDragEnter);
      item.addEventListener('dragleave', handleDragLeave);
    });
  }

  /**
   * Handle drag start
   */
  function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }

  /**
   * Handle drag end
   */
  function handleDragEnd(e) {
    this.classList.remove('dragging');
    if (placeholder) {
      placeholder.remove();
      placeholder = null;
    }

    // Trigger save event
    const parent = this.parentElement;
    if (parent && parent.dataset.saveOnReorder) {
      window.dispatchEvent(new CustomEvent('resume-reordered'));
    }
  }

  /**
   * Handle drag over
   */
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  /**
   * Handle drag enter
   */
  function handleDragEnter(e) {
    if (this !== draggedElement) {
      this.classList.add('drag-over');
      
      if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        placeholder.style.height = draggedElement.offsetHeight + 'px';
      }
    }
  }

  /**
   * Handle drag leave
   */
  function handleDragLeave(e) {
    if (e.target === this) {
      this.classList.remove('drag-over');
    }
  }

  /**
   * Handle drop
   */
  function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    if (this !== draggedElement) {
      // Swap elements
      const parent = this.parentElement;
      const allItems = parent.querySelectorAll('.draggable-item');
      let draggedIndex = Array.from(allItems).indexOf(draggedElement);
      let targetIndex = Array.from(allItems).indexOf(this);

      if (draggedIndex < targetIndex) {
        this.parentNode.insertBefore(draggedElement, this.nextSibling);
      } else {
        this.parentNode.insertBefore(draggedElement, this);
      }

      this.classList.remove('drag-over');
      Utils.showSuccess('Item reordered');
    }

    return false;
  }

  /**
   * Enable drag & drop for resume entries
   */
  function initResumeEntries() {
    // Experience items
    const expContainer = document.getElementById('experience');
    if (expContainer) {
      makeReorderable(expContainer, '.item');
    }

    // Education items
    const eduContainer = document.getElementById('education');
    if (eduContainer) {
      makeReorderable(eduContainer, '.item');
    }

    // Skills container
    const skillsContainer = document.getElementById('skills');
    if (skillsContainer) {
      makeReorderable(skillsContainer, '.pill');
    }
  }

  /**
   * Enable drag & drop for sections
   */
  function initSectionReordering() {
    const builderLayout = document.querySelector('.builder-layout');
    if (!builderLayout) return;

    // Make sections draggable for admin panel
    const sections = document.querySelectorAll('.resume-section');
    sections.forEach(section => {
      const header = section.querySelector('.section-header');
      if (header) {
        header.style.cursor = 'grab';
        section.setAttribute('draggable', 'true');
      }
    });
  }

  /**
   * Initialize drag & drop system
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initResumeEntries();
        initSectionReordering();
      });
    } else {
      initResumeEntries();
      initSectionReordering();
    }

    console.log('✓ Drag & Drop system initialized');
  }

  return {
    init,
    makeReorderable
  };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', DragDrop.init);
} else {
  DragDrop.init();
}
