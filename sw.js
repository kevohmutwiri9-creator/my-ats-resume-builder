// Service Worker for PWA functionality
const CACHE_NAME = 'ats-resume-builder-v3';
const VERSION = '3.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/builder.html',
  '/cover-letter.html',
  '/ats.html',
  '/templates.html',
  '/guides/index.html',
  '/about.html',
  '/privacy.html',
  '/terms.html',
  '/examples.html',
  '/interview.html',
  '/styles.css',
  '/ai-chat.css',
  '/cookie-consent.css',
  '/resume-import.css',
  '/templates-modern.css',
  '/templates-executive.css',
  '/templates-creative.css',
  '/site.js',
  '/builder.js',
  '/ai-assist.js',
  '/ai-greeter.js',
  '/ai-chat.js',
  'web-search.js',
  'cookie-consent.js',
  'analytics.js',
  'adsense-config.js',
  'resume-import.js',
  '/i18n.js',
  '/icons/icon-96.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/favicon.svg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing - version', VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the new service worker to become active immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache resources:', error);
      })
  );
});

// Handle update flow triggered from the page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event - cache-first for same-origin GET requests, network passthrough otherwise.
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Skip non-GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Skip chrome-extension and cross-origin (ads, analytics, APIs)
  if (url.protocol === 'chrome-extension:' || url.origin !== self.location.origin) return;

  const isNavigation = req.mode === 'navigate' || (req.destination === '' && req.headers.get('accept')?.includes('text/html'));

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((resp) => {
          // Only cache successful same-origin basic responses
          if (resp && resp.ok && resp.type === 'basic') {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return resp;
        })
        .catch(() => {
          // Offline fallback for navigations
          if (isNavigation) return caches.match('/index.html');
          return cached;
        });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating - version', VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all open pages
      return self.clients.claim();
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Handle background sync
async function doBackgroundSync() {
  try {
    // Get any pending actions from IndexedDB
    const pendingActions = await getPendingActions();
    
    // Process each pending action
    for (const action of pendingActions) {
      try {
        await processAction(action);
        await removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to process action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// IndexedDB helpers for offline storage
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ats-resume-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingActions')) {
        db.createObjectStore('pendingActions', { keyPath: 'id' });
      }
    };
  });
}

async function getPendingActions() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingActions'], 'readonly');
    const store = transaction.objectStore('pendingActions');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removePendingAction(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingActions'], 'readwrite');
    const store = transaction.objectStore('pendingActions');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function processAction(action) {
  // Process different types of actions
  switch (action.type) {
    case 'save_resume':
      // Save resume data when back online
      await saveResumeData(action.data);
      break;
    case 'analytics_event':
      // Send analytics events when back online
      await sendAnalyticsEvent(action.data);
      break;
    default:
      console.warn('Unknown action type:', action.type);
  }
}

// Mock functions for demonstration
async function saveResumeData(data) {
  // In a real implementation, this would sync with a server
  console.log('Saving resume data:', data);
}

async function sendAnalyticsEvent(data) {
  // In a real implementation, this would send to analytics service
  console.log('Sending analytics event:', data);
}

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-96.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/icon-96.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ATS Resume Builder', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic background sync for content updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-update') {
    event.waitUntil(updateContent());
  }
});

// Update cached content
async function updateContent() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    // Update critical files
    const criticalFiles = [
      '/index.html',
      '/builder.html',
      '/styles.css',
      '/site.js',
      '/builder.js'
    ];
    
    for (const file of criticalFiles) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          await cache.put(file, response);
        }
      } catch (error) {
        console.error(`Failed to update ${file}:`, error);
      }
    }
  } catch (error) {
    console.error('Content update failed:', error);
  }
}
