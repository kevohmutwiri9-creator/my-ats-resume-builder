// Mobile Optimization and Touch Gestures
window.MOBILE = {
  config: {
    touchThreshold: 50,
    swipeThreshold: 100,
    longPressThreshold: 500,
    doubleTapThreshold: 300
  },

  touchState: {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    startTime: 0,
    lastTap: 0
  },

  // Initialize mobile optimizations
  init: function() {
    this.setupTouchGestures();
    this.setupMobileUI();
    this.setupResponsiveDesign();
    this.setupMobileNavigation();
    this.setupMobileKeyboard();
  },

  // Setup touch gestures
  setupTouchGestures: function() {
    let touchElement = null;

    document.addEventListener('touchstart', (e) => {
      touchElement = e.target;
      this.touchState.startX = e.touches[0].clientX;
      this.touchState.startY = e.touches[0].clientY;
      this.touchState.startTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      this.touchState.endX = e.touches[0].clientX;
      this.touchState.endY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const deltaX = this.touchState.endX - this.touchState.startX;
      const deltaY = this.touchState.endY - this.touchState.startY;
      const deltaTime = Date.now() - this.touchState.startTime;

      // Detect swipe
      if (Math.abs(deltaX) > this.config.swipeThreshold && Math.abs(deltaY) < this.config.touchThreshold) {
        const direction = deltaX > 0 ? 'right' : 'left';
        this.handleSwipe(touchElement, direction);
      }

      // Detect tap
      if (Math.abs(deltaX) < this.config.touchThreshold && Math.abs(deltaY) < this.config.touchThreshold) {
        const now = Date.now();
        if (now - this.touchState.lastTap < this.config.doubleTapThreshold) {
          this.handleDoubleTap(touchElement);
        } else {
          this.handleTap(touchElement);
        }
        this.touchState.lastTap = now;
      }

      // Detect long press
      if (deltaTime > this.config.longPressThreshold && Math.abs(deltaX) < this.config.touchThreshold) {
        this.handleLongPress(touchElement);
      }
    }, { passive: true });
  },

  // Handle swipe gestures
  handleSwipe: function(element, direction) {
    // Navigation swipe
    if (element.closest('.mobile-nav') || element.closest('.nav')) {
      if (direction === 'left') {
        this.navigateNext();
      } else if (direction === 'right') {
        this.navigatePrevious();
      }
    }

    // Gallery swipe
    if (element.closest('.template-gallery')) {
      this.swipeGallery(direction);
    }

    // Modal swipe
    if (element.closest('.modal')) {
      if (direction === 'left' || direction === 'right') {
        this.closeModal();
      }
    }

    // Trigger custom swipe event
    element.dispatchEvent(new CustomEvent('swipe', {
      detail: { direction, element }
    }));
  },

  // Handle tap
  handleTap: function(element) {
    // Add ripple effect
    this.addRippleEffect(element);

    // Handle mobile-specific tap actions
    if (element.closest('.mobile-menu-item')) {
      this.handleMobileMenuTap(element);
    }

    // Trigger custom tap event
    element.dispatchEvent(new CustomEvent('mobiletap', {
      detail: { element }
    }));
  },

  // Handle double tap
  handleDoubleTap: function(element) {
    // Zoom on double tap for images
    if (element.tagName === 'IMG') {
      this.toggleImageZoom(element);
    }

    // Trigger custom double tap event
    element.dispatchEvent(new CustomEvent('doubletap', {
      detail: { element }
    }));
  },

  // Handle long press
  handleLongPress: function(element) {
    // Show context menu
    this.showContextMenu(element);

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Trigger custom long press event
    element.dispatchEvent(new CustomEvent('longpress', {
      detail: { element }
    }));
  },

  // Add ripple effect
  addRippleEffect: function(element) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  },

  // Setup mobile UI
  setupMobileUI: function() {
    // Add mobile-specific classes
    if (this.isMobile()) {
      document.body.classList.add('mobile-device');
    }

    // Setup mobile viewport
    this.setupViewport();

    // Setup touch targets
    this.enlargeTouchTargets();

    // Setup mobile forms
    this.optimizeMobileForms();
  },

  // Setup responsive design
  setupResponsiveDesign: function() {
    // Monitor orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });

    // Monitor resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  },

  // Setup mobile navigation
  setupMobileNavigation: function() {
    // Create mobile menu button
    if (!document.querySelector('.mobile-menu-toggle')) {
      const menuBtn = document.createElement('button');
      menuBtn.className = 'mobile-menu-toggle';
      menuBtn.innerHTML = '☰';
      menuBtn.setAttribute('aria-label', 'Toggle mobile menu');
      menuBtn.addEventListener('click', () => this.toggleMobileMenu());
      
      const header = document.querySelector('.header-inner');
      if (header) {
        header.appendChild(menuBtn);
      }
    }

    // Create mobile navigation overlay
    this.createMobileNavOverlay();

    // Setup back navigation
    this.setupBackNavigation();
  },

  // Create mobile navigation overlay
  createMobileNavOverlay: function() {
    // Check if already exists
    if (document.querySelector('.mobile-nav-overlay')) {
      return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.innerHTML = `
      <div class="mobile-nav-content">
        <div class="mobile-nav-header">
          <h3>Menu</h3>
          <button class="mobile-nav-close">&times;</button>
        </div>
        <nav class="mobile-nav-menu">
          <a href="./index.html" class="mobile-menu-item">Home</a>
          <a href="./builder.html" class="mobile-menu-item">Resume Builder</a>
          <a href="./cover-letter.html" class="mobile-menu-item">Cover Letter</a>
          <a href="./ats.html" class="mobile-menu-item">ATS Checker</a>
          <a href="./guides/index.html" class="mobile-menu-item">Guides</a>
          <a href="./examples.html" class="mobile-menu-item">Examples</a>
          <a href="./templates.html" class="mobile-menu-item">Templates</a>
        </nav>
      </div>
    `;

    // Add to body, not to any specific container
    document.body.appendChild(overlay);

    // Close handlers
    overlay.querySelector('.mobile-nav-close').addEventListener('click', () => {
      this.closeMobileMenu();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeMobileMenu();
      }
    });
  },

  // Toggle mobile menu
  toggleMobileMenu: function() {
    const overlay = document.querySelector('.mobile-nav-overlay');
    if (overlay) {
      overlay.classList.toggle('active');
      document.body.classList.toggle('mobile-nav-open');
      
      // Ensure proper display
      if (overlay.classList.contains('active')) {
        overlay.style.display = 'block';
      } else {
        setTimeout(() => {
          if (!overlay.classList.contains('active')) {
            overlay.style.display = 'none';
          }
        }, 300);
      }
    }
  },

  // Close mobile menu
  closeMobileMenu: function() {
    const overlay = document.querySelector('.mobile-nav-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.classList.remove('mobile-nav-open');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    }
  },

  // Setup mobile keyboard
  setupMobileKeyboard: function() {
    // Adjust viewport on keyboard show/hide
    let originalViewportHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
      const currentHeight = window.innerHeight;
      const heightDiff = originalViewportHeight - currentHeight;
      
      if (heightDiff > 150) {
        // Keyboard is visible
        document.body.classList.add('keyboard-visible');
      } else {
        // Keyboard is hidden
        document.body.classList.remove('keyboard-visible');
      }
    });

    // Improve input focus behavior
    document.addEventListener('focusin', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        this.scrollIntoView(e.target);
      }
    });
  },

  // Enlarge touch targets
  enlargeTouchTargets: function() {
    const touchTargets = document.querySelectorAll('button, a, input, select, textarea');
    touchTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        target.style.minWidth = '44px';
        target.style.minHeight = '44px';
        target.style.display = 'inline-flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
      }
    });
  },

  // Optimize mobile forms
  optimizeMobileForms: function() {
    // Add input types for mobile keyboards
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      if (input.type === 'text') {
        if (input.name.includes('email') || input.id.includes('email')) {
          input.type = 'email';
        } else if (input.name.includes('phone') || input.id.includes('phone')) {
          input.type = 'tel';
        } else if (input.name.includes('date') || input.id.includes('date')) {
          input.type = 'date';
        }
      }
    });

    // Add autocomplete attributes
    const formFields = {
      'name': 'name',
      'email': 'email',
      'phone': 'tel',
      'address': 'street-address',
      'city': 'address-level2',
      'state': 'address-level1',
      'zip': 'postal-code'
    };

    Object.keys(formFields).forEach(fieldName => {
      const field = document.querySelector(`[name*="${fieldName}"], [id*="${fieldName}"]`);
      if (field) {
        field.setAttribute('autocomplete', formFields[fieldName]);
      }
    });
  },

  // Setup viewport
  setupViewport: function() {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  },

  // Check if mobile device
  isMobile: function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  },

  // Handle orientation change
  handleOrientationChange: function() {
    // Adjust layout for new orientation
    document.body.classList.remove('portrait', 'landscape');
    
    if (window.innerHeight > window.innerWidth) {
      document.body.classList.add('portrait');
    } else {
      document.body.classList.add('landscape');
    }

    // Trigger custom event
    window.dispatchEvent(new CustomEvent('orientationchange', {
      detail: {
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      }
    }));
  },

  // Handle resize
  handleResize: function() {
    // Update mobile/desktop state
    if (this.isMobile()) {
      document.body.classList.add('mobile-device');
    } else {
      document.body.classList.remove('mobile-device');
    }

    // Trigger custom event
    window.dispatchEvent(new CustomEvent('mobileresize', {
      detail: {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: this.isMobile()
      }
    }));
  },

  // Scroll element into view
  scrollIntoView: function(element) {
    setTimeout(() => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 300);
  },

  // Navigate to next page
  navigateNext: function() {
    const currentPage = window.location.pathname;
    const pages = ['index.html', 'builder.html', 'cover-letter.html', 'ats.html'];
    const currentIndex = pages.findIndex(page => currentPage.includes(page));
    
    if (currentIndex < pages.length - 1) {
      window.location.href = pages[currentIndex + 1];
    }
  },

  // Navigate to previous page
  navigatePrevious: function() {
    const currentPage = window.location.pathname;
    const pages = ['index.html', 'builder.html', 'cover-letter.html', 'ats.html'];
    const currentIndex = pages.findIndex(page => currentPage.includes(page));
    
    if (currentIndex > 0) {
      window.location.href = pages[currentIndex - 1];
    }
  },

  // Add mobile styles
  addMobileStyles: function() {
    if (document.getElementById('mobile-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'mobile-styles';
    style.textContent = `
      .mobile-device {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      .mobile-device input,
      .mobile-device textarea {
        -webkit-user-select: text;
        user-select: text;
      }
      
      .mobile-menu-toggle {
        display: none;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--text-primary);
        padding: 8px;
      }
      
      .mobile-nav-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        display: none;
      }
      
      .mobile-nav-overlay.active {
        transform: translateX(0);
        display: block;
      }
      
      .mobile-nav-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 80%;
        max-width: 300px;
        height: 100%;
        background: var(--card-bg);
        box-shadow: 2px 0 10px var(--shadow);
      }
      
      .mobile-nav-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid var(--border);
      }
      
      .mobile-nav-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--text-secondary);
      }
      
      .mobile-nav-menu {
        padding: 20px 0;
      }
      
      .mobile-menu-item {
        display: block;
        padding: 15px 20px;
        color: var(--text-primary);
        text-decoration: none;
        border-bottom: 1px solid var(--border);
        transition: background-color 0.2s ease;
      }
      
      .mobile-menu-item:hover {
        background-color: var(--bg-secondary);
      }
      
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      .keyboard-visible {
        position: fixed;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      
      @media (max-width: 768px) {
        .mobile-menu-toggle {
          display: block;
        }
        
        .nav {
          display: none;
        }
        
        .container {
          padding: 0 15px;
        }
        
        .header-inner {
          padding: 10px 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  MOBILE.init();
  MOBILE.addMobileStyles();
});
