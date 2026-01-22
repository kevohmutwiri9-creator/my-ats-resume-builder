// Service Worker for PWA functionality
const CACHE_NAME = 'ats-resume-builder-v1';
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
  '/cookie-consent.js',
  '/analytics.js',
  '/adsense-config.js',
  '/resume-import.js',
  '/i18n.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/favicon.svg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache resources:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return new Response('Chrome extension requests are not supported', { status: 400 });
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Network request with proper redirect handling
        return fetch(event.request, { redirect: 'follow' }).then((response) => {
          // Check if valid response
          if (!response || response.status === 0 || response.type === 'opaque') {
            return new Response('Network error', { status: 500 });
          }

          // Clone response for caching
          const responseToCache = response.clone();
          
          // Only cache successful responses
          if (response.ok && response.type === 'basic') {
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.error('Failed to cache response:', error);
              });
          }
          
          return response;
        })
        .catch(() => {
          // Network failed, try to serve from cache
          return caches.match(event.request);
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
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
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
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
