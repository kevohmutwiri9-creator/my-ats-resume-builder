// Progressive Web App (PWA) functionality
window.PWA = {
  // PWA detection and installation
  deferredPrompt: null,
  isInstallable: false,
  isStandalone: false,

  init: function() {
    this.detectStandalone();
    this.setupInstallPrompt();
    this.setupServiceWorker();
    this.setupOnlineStatus();
    this.addOfflineIndicator();
  },

  // Detect if running as standalone PWA
  detectStandalone: function() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                      window.navigator.standalone === true ||
                      document.referrer.includes('android-app://');
    
    this.isStandalone = isStandalone;
    document.body.classList.toggle('pwa-standalone', isStandalone);
  },

  // Setup PWA installation prompt
  setupInstallPrompt: function() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.isInstallable = true;
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      this.isInstallable = false;
      this.hideInstallButton();
      this.showInstallSuccess();
    });
  },

  // Setup service worker
  setupServiceWorker: function() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateAvailable();
              }
            });
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
          this.showToast('Service Worker registration failed', 'error');
        });
    } else {
      console.warn('Service Workers are not supported in this browser');
    }
  },

  // Setup online/offline status monitoring
  setupOnlineStatus: function() {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      document.body.classList.toggle('offline', !isOnline);
      
      if (isOnline) {
        this.hideOfflineMessage();
        this.syncOfflineActions();
      } else {
        this.showOfflineMessage();
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
  },

  // Show install button
  showInstallButton: function() {
    let installBtn = document.getElementById('pwa-install-btn');
    
    if (!installBtn) {
      installBtn = document.createElement('button');
      installBtn.id = 'pwa-install-btn';
      installBtn.className = 'pwa-install-btn';
      installBtn.innerHTML = '📱 Install App';
      installBtn.addEventListener('click', () => this.installApp());
      
      document.body.appendChild(installBtn);
    }
  },

  // Hide install button
  hideInstallButton: function() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.remove();
    }
  },

  // Install the PWA
  installApp: function() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      this.deferredPrompt = null;
      this.hideInstallButton();
    });
  },

  // Show install success message
  showInstallSuccess: function() {
    this.showToast('🎉 App installed successfully!', 'success');
  },

  // Show update available message
  showUpdateAvailable: function() {
    const updateBanner = document.createElement('div');
    updateBanner.id = 'pwa-update-banner';
    updateBanner.className = 'pwa-update-banner';
    updateBanner.innerHTML = `
      <div class="pwa-update-content">
        <span>🔄 A new version is available!</span>
        <button class="pwa-update-btn" onclick="PWA.updateApp()">Update Now</button>
        <button class="pwa-update-close" onclick="PWA.hideUpdateBanner()">×</button>
      </div>
    `;
    
    document.body.appendChild(updateBanner);
  },

  // Hide update banner
  hideUpdateBanner: function() {
    const updateBanner = document.getElementById('pwa-update-banner');
    if (updateBanner) {
      updateBanner.remove();
    }
  },

  // Update the app
  updateApp: function() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  },

  // Add offline indicator
  addOfflineIndicator: function() {
    const indicator = document.createElement('div');
    indicator.id = 'pwa-offline-indicator';
    indicator.className = 'pwa-offline-indicator';
    indicator.innerHTML = `
      <div class="offline-icon">📵</div>
      <div class="offline-text">You're offline</div>
    `;
    
    document.body.appendChild(indicator);
  },

  // Show offline message
  showOfflineMessage: function() {
    this.showToast('📵 You\'re currently offline. Some features may be limited.', 'warning');
  },

  // Hide offline message
  hideOfflineMessage: function() {
    // Hide any existing offline toast
    const existingToast = document.querySelector('.pwa-toast.offline');
    if (existingToast) {
      existingToast.remove();
    }
  },

  // Sync offline actions when back online
  syncOfflineActions: function() {
    // Trigger background sync if supported
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register('background-sync');
      }).then(() => {
        console.log('Background sync registered');
      }).catch((error) => {
        console.error('Background sync registration failed:', error);
      });
    }
  },

  // Show toast notification
  showToast: function(message, type = 'info') {
    const existingToast = document.querySelector('.pwa-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `pwa-toast ${type}`;
    toast.innerHTML = `
      <div class="pwa-toast-content">
        <span class="pwa-toast-message">${message}</span>
        <button class="pwa-toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    document.body.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  },

  // Cache resources for offline use
  cacheResources: async function(resources) {
    if ('caches' in window) {
      try {
        const cache = await caches.open('ats-resume-builder-v1');
        await cache.addAll(resources);
        console.log('Resources cached for offline use');
      } catch (error) {
        console.error('Failed to cache resources:', error);
      }
    }
  },

  // Get cached resource
  getCachedResource: async function(url) {
    if ('caches' in window) {
      try {
        const cache = await caches.open('ats-resume-builder-v1');
        return await cache.match(url);
      } catch (error) {
        console.error('Failed to get cached resource:', error);
        return null;
      }
    }
    return null;
  },

  // Request notification permission
  requestNotificationPermission: async function() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          this.showToast('🔔 Notifications enabled!', 'success');
        }
      } catch (error) {
        console.error('Notification permission request failed:', error);
      }
    }
  },

  // Show local notification
  showNotification: function(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        ...options
      });

      if (options.autoClose !== false) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;
    }
  },

  // Share content using Web Share API
  shareContent: async function(data) {
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      this.fallbackShare(data);
    }
  },

  // Fallback share method
  fallbackShare: function(data) {
    if (data.url) {
      // Copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(data.url).then(() => {
          this.showToast('📋 Link copied to clipboard!', 'success');
        });
      } else {
        // Fallback: create temporary input
        const input = document.createElement('input');
        input.value = data.url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        this.showToast('📋 Link copied to clipboard!', 'success');
      }
    }
  },

  // Check if PWA is installed
  isInstalled: function() {
    return this.isStandalone || this.isInstallable;
  },

  // Get app version
  getVersion: function() {
    return navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop';
  }
};

// Initialize PWA when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  PWA.init();
});

// Make PWA available globally
window.PWA = PWA;
