/**
 * Premium Features System
 * Manage premium tier, features, and user subscriptions
 */

const PremiumSystem = (() => {
  const STORAGE_KEY = 'premium-features';

  const FEATURES = {
    FREE: {
      name: 'Free',
      price: 0,
      features: [
        'Basic resume builder',
        'PDF export',
        'ATS checker (basic)',
        '2 auto-backups',
        '3 templates'
      ],
      limits: {
        exports: 5,
        backups: 2,
        templates: 3
      }
    },
    PRO: {
      name: 'Pro',
      price: 9.99,
      features: [
        'Everything in Free',
        'Advanced AI content generator',
        'All 15+ templates',
        'Advanced ATS checker',
        'Resume analytics',
        'All export formats (HTML, DOCX, RTF, JSON)',
        'Unlimited backups',
        'Interview prep module',
        'Priority support'
      ],
      limits: {
        exports: 1000,
        backups: -1,
        templates: 15
      }
    },
    'PRO+': {
      name: 'Pro+',
      price: 19.99,
      features: [
        'Everything in Pro',
        'AI video interview coach',
        'Job application tracker',
        'Multiple resume hosting',
        'LinkedIn integration',
        'GitHub integration',
        '24/7 Priority support',
        'Custom domain support',
        'Batch operations (A/B testing)'
      ],
      limits: {
        exports: -1,
        backups: -1,
        templates: -1
      }
    }
  };

  /**
   * Get current subscription tier
   */
  function getTier() {
    const stored = Utils.getStorage(STORAGE_KEY);
    return (stored && JSON.parse(stored).tier) || 'FREE';
  }

  /**
   * Check if feature is available
   */
  function isFeatureAvailable(featureName) {
    const tier = getTier();
    const features = FEATURES[tier]?.features || [];
    return features.some(f => f.toLowerCase().includes(featureName.toLowerCase()));
  }

  /**
   * Create pricing modal
   */
  function showPricingModal() {
    const currentTier = getTier();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content modal-xlarge">
        <div class="modal-header">
          <h2>💎 Premium Plans</h2>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <div class="pricing-grid">
            ${Object.entries(FEATURES).map(([tier, plan]) => `
              <div class="pricing-card ${currentTier === tier ? 'active' : ''}">
                <div class="pricing-header">
                  <h3>${plan.name}</h3>
                  <div class="pricing-price">
                    ${plan.price === 0 ? 'Free' : `$${plan.price}<span>/mo</span>`}
                  </div>
                </div>
                <ul class="pricing-features">
                  ${plan.features.map(f => `<li>✓ ${f}</li>`).join('')}
                </ul>
                <button class="btn ${currentTier === tier ? 'btn-ghost' : 'btn-primary'}" 
                  onclick="${currentTier === tier ? 'alert(\"You are on this plan\")' : `PremiumSystem.upgradeTo('${tier}')`}">
                  ${currentTier === tier ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            `).join('')}
          </div>

          <div class="premium-features-list">
            <h3>Premium Features Included</h3>
            <div class="features-comparison">
              ${['AI Content Generator', 'Advanced Analytics', 'Video Interview Coach', 'Job Tracker', 'Custom Domains', 'Priority Support'].map((feature, idx) => `
                <div class="feature-row">
                  <span>${feature}</span>
                  <div class="feature-availability">
                    <span class="tier-free">${currentTier === 'FREE' && idx < 2 ? '✓' : '—'}</span>
                    <span class="tier-pro">${(currentTier === 'PRO' || currentTier === 'PRO+') ? '✓' : '—'}</span>
                    <span class="tier-proplus">${currentTier === 'PRO+' ? '✓' : '—'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" id="close-pricing">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#close-pricing').addEventListener('click', () => modal.remove());
  }

  /**
   * Upgrade to tier
   */
  function upgradeTo(tier) {
    if (!FEATURES[tier]) {
      Utils.showError('Invalid tier');
      return;
    }

    // In a real app, this would process payment through Stripe
    const upgradeCopy = tier === 'FREE' ? 'Downgrade' : 'Upgrade';
    Utils.showInfo(`${upgradeCopy} to ${tier} - In a real app, Stripe payment would process here`);

    // Simulate upgrade
    const data = { tier, upgradedAt: new Date().toISOString() };
    Utils.setStorage(STORAGE_KEY, JSON.stringify(data));
    Utils.showSuccess(`Upgraded to ${tier}!`);
  }

  /**
   * Create premium button in toolbar
   */
  function createPremiumButton() {
    const toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;

    const premiumBtn = document.createElement('button');
    premiumBtn.className = 'btn btn-ghost';
    premiumBtn.id = 'premium-btn';
    premiumBtn.innerHTML = '💎 Premium';
    premiumBtn.setAttribute('aria-label', 'View premium plans');
    premiumBtn.title = 'Upgrade to Premium';

    premiumBtn.addEventListener('click', showPricingModal);

    toolbar.appendChild(premiumBtn);

    // Update button based on tier
    const tier = getTier();
    if (tier !== 'FREE') {
      premiumBtn.innerHTML = `✓ ${tier}`;
      premiumBtn.classList.add('premium-badge');
    }
  }

  /**
   * Initialize premium system
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createPremiumButton);
    } else {
      createPremiumButton();
    }

    console.log('✓ Premium System initialized');
  }

  return {
    init,
    getTier,
    isFeatureAvailable,
    upgradeTo,
    showPricingModal,
    FEATURES
  };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', PremiumSystem.init);
} else {
  PremiumSystem.init();
}
