// Google AdSense Configuration
window.adsenseConfig = {
  publisherId: 'ca-pub-2396098605485959',
  enabled: true,
  testMode: false,
  adSlots: {
    // Responsive ad units
    'top-banner': {
      style: 'display:block',
      format: 'auto',
      responsive: 'true',
      layout: 'in-article',
      layoutKey: '-fb+5w+4e-db+86'
    },
    'sidebar': {
      style: 'display:block',
      format: 'auto',
      responsive: 'true'
    },
    'content': {
      style: 'display:block',
      format: 'fluid',
      layout: 'in-article',
      layoutKey: '-gw-3+1f-3d+2z'
    },
    'bottom': {
      style: 'display:block',
      format: 'auto',
      responsive: 'true'
    }
  }
};

// Initialize AdSense ads
function initializeAds() {
  // Check if user has consented to cookies
  const cookieConsent = localStorage.getItem('cookieConsent');
  let consentData = null;
  
  if (cookieConsent) {
    try {
      consentData = JSON.parse(cookieConsent);
    } catch (e) {
      console.error('Failed to parse cookie consent:', e);
    }
  }
  
  // Check if marketing category is enabled (ads)
  if (!consentData || !consentData.categories || !consentData.categories.marketing) {
    console.log('AdSense blocked: No cookie consent for marketing');
    return;
  }

  // Push ads to Google
  (window.adsbygoogle = window.adsbygoogle || []).push({});
}

// Create ad element
function createAdElement(slotId, slotName) {
  const adContainer = document.getElementById(slotId);
  if (!adContainer) return;

  const slotConfig = window.adsenseConfig.adSlots[slotName];
  if (!slotConfig) return;

  // Clear existing content
  adContainer.innerHTML = '';

  // Create ad element
  const adElement = document.createElement('ins');
  adElement.className = 'adsbygoogle';
  adElement.style.cssText = slotConfig.style;
  adElement.setAttribute('data-ad-client', window.adsenseConfig.publisherId);
  adElement.setAttribute('data-ad-slot', slotId);
  adElement.setAttribute('data-ad-format', slotConfig.format);
  adElement.setAttribute('data-full-width-responsive', slotConfig.responsive);

  if (slotConfig.layout) {
    adElement.setAttribute('data-ad-layout', slotConfig.layout);
  }
  if (slotConfig.layoutKey) {
    adElement.setAttribute('data-ad-layout-key', slotConfig.layoutKey);
  }

  adContainer.appendChild(adElement);
}

// Initialize all ads on page
function initializeAllAds() {
  const adSlots = [
    { id: 'ad-top-banner', name: 'top-banner' },
    { id: 'ad-sidebar', name: 'sidebar' },
    { id: 'ad-content-1', name: 'content' },
    { id: 'ad-content-2', name: 'content' },
    { id: 'ad-bottom', name: 'bottom' }
  ];

  adSlots.forEach(slot => {
    createAdElement(slot.id, slot.name);
  });

  // Push all ads to Google
  initializeAds();
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeAllAds();
});

// Re-initialize ads when cookie consent is given
window.addEventListener('cookieConsentGiven', initializeAllAds);

// Re-initialize / disable ads when preferences change
window.addEventListener('cookieConsentUpdated', (e) => {
  const marketingOn = Boolean(e?.detail?.categories?.marketing);
  if (marketingOn) {
    initializeAllAds();
  }
});
