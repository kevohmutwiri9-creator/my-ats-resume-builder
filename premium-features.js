// Premium Features Management
window.PREMIUM = {
  config: {
    plans: {
      free: {
        name: 'Free',
        price: 0,
        features: [
          'Basic resume templates',
          'PDF export',
          'ATS checker',
          'Basic AI suggestions'
        ]
      },
      pro: {
        name: 'Pro',
        price: 9.99,
        features: [
          'All free features',
          'Premium templates',
          'Advanced AI suggestions',
          'Multiple export formats',
          'Priority support',
          'Resume analytics',
          'No ads'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        price: 29.99,
        features: [
          'All pro features',
          'Team collaboration',
          'Custom branding',
          'API access',
          'Dedicated support',
          'Advanced analytics'
        ]
      }
    },
    currentPlan: 'free',
    trialDays: 7
  },

  // Initialize premium features
  init: function() {
    this.loadUserPlan();
    this.setupPremiumUI();
    this.checkTrialStatus();
  },

  // Load user's current plan
  loadUserPlan: function() {
    const savedPlan = localStorage.getItem('premium_plan');
    if (savedPlan) {
      this.config.currentPlan = savedPlan;
    }
  },

  // Save user's plan
  saveUserPlan: function(plan) {
    this.config.currentPlan = plan;
    localStorage.setItem('premium_plan', plan);
    localStorage.setItem('premium_plan_date', new Date().toISOString());
  },

  // Check if user has access to feature
  hasFeature: function(feature) {
    const plan = this.config.plans[this.config.currentPlan];
    if (!plan) return false;

    // Free features
    const freeFeatures = ['basic_templates', 'pdf_export', 'ats_checker', 'basic_ai'];
    if (freeFeatures.includes(feature) && this.config.currentPlan === 'free') {
      return true;
    }

    // Pro features
    const proFeatures = [...freeFeatures, 'premium_templates', 'advanced_ai', 'multiple_exports', 'priority_support', 'resume_analytics', 'no_ads'];
    if (proFeatures.includes(feature) && (this.config.currentPlan === 'pro' || this.config.currentPlan === 'enterprise')) {
      return true;
    }

    // Enterprise features
    const enterpriseFeatures = [...proFeatures, 'team_collaboration', 'custom_branding', 'api_access', 'dedicated_support', 'advanced_analytics'];
    if (enterpriseFeatures.includes(feature) && this.config.currentPlan === 'enterprise') {
      return true;
    }

    return false;
  },

  // Setup premium UI elements
  setupPremiumUI: function() {
    // Add premium badge to user profile
    this.addPremiumBadge();
    
    // Setup upgrade prompts
    this.setupUpgradePrompts();
    
    // Setup premium feature gates
    this.setupFeatureGates();
  },

  // Add premium badge
  addPremiumBadge: function() {
    if (this.config.currentPlan !== 'free') {
      const badge = document.createElement('div');
      badge.className = 'premium-badge';
      badge.innerHTML = `
        <span class="premium-icon">⭐</span>
        <span class="premium-text">${this.config.plans[this.config.currentPlan].name}</span>
      `;
      
      const header = document.querySelector('.header-inner');
      if (header) {
        header.appendChild(badge);
      }
    }
  },

  // Setup upgrade prompts
  setupUpgradePrompts: function() {
    // Add upgrade button to navigation
    const nav = document.querySelector('.nav');
    if (nav && this.config.currentPlan === 'free') {
      const upgradeBtn = document.createElement('button');
      upgradeBtn.className = 'upgrade-btn';
      upgradeBtn.textContent = 'Upgrade to Pro';
      upgradeBtn.addEventListener('click', () => this.showUpgradeModal());
      nav.appendChild(upgradeBtn);
    }
  },

  // Setup feature gates
  setupFeatureGates: function() {
    // Monitor clicks on premium features
    document.addEventListener('click', (e) => {
      const premiumFeature = e.target.closest('[data-premium-feature]');
      if (premiumFeature) {
        const feature = premiumFeature.dataset.premiumFeature;
        if (!this.hasFeature(feature)) {
          e.preventDefault();
          this.showPremiumGate(feature);
        }
      }
    });
  },

  // Show premium gate
  showPremiumGate: function(feature) {
    const modal = document.createElement('div');
    modal.className = 'premium-gate-modal';
    modal.innerHTML = `
      <div class="premium-gate-content">
        <div class="premium-gate-header">
          <h3>🔒 Premium Feature</h3>
          <button class="close-btn" onclick="this.closest('.premium-gate-modal').remove()">&times;</button>
        </div>
        <div class="premium-gate-body">
          <p>This feature is available with a ${this.config.plans.pro.name} plan.</p>
          <div class="premium-features">
            <h4>What you'll get:</h4>
            <ul>
              ${this.config.plans.pro.features.map(feature => `<li>✓ ${feature}</li>`).join('')}
            </ul>
          </div>
          <div class="premium-pricing">
            <div class="price">$${this.config.plans.pro.price}/month</div>
            <div class="trial">Start with ${this.config.trialDays}-day free trial</div>
          </div>
        </div>
        <div class="premium-gate-footer">
          <button class="btn-secondary" onclick="this.closest('.premium-gate-modal').remove()">Maybe Later</button>
          <button class="btn-primary" onclick="PREMIUM.startTrial()">Start Free Trial</button>
        </div>
      </div>
    `;

    this.addPremiumStyles();
    document.body.appendChild(modal);
  },

  // Show upgrade modal
  showUpgradeModal: function() {
    const modal = document.createElement('div');
    modal.className = 'upgrade-modal';
    modal.innerHTML = `
      <div class="upgrade-modal-content">
        <div class="upgrade-modal-header">
          <h3>Choose Your Plan</h3>
          <button class="close-btn" onclick="this.closest('.upgrade-modal').remove()">&times;</button>
        </div>
        <div class="upgrade-modal-body">
          <div class="plans-grid">
            ${Object.keys(this.config.plans).map(planKey => {
              const plan = this.config.plans[planKey];
              const isCurrent = this.config.currentPlan === planKey;
              return `
                <div class="plan-card ${isCurrent ? 'current' : ''}">
                  <div class="plan-header">
                    <h4>${plan.name}</h4>
                    <div class="plan-price">
                      ${plan.price === 0 ? 'Free' : `$${plan.price}/month`}
                    </div>
                  </div>
                  <div class="plan-features">
                    <ul>
                      ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="plan-action">
                    ${isCurrent ? 
                      '<button class="btn-secondary" disabled>Current Plan</button>' :
                      `<button class="btn-primary" onclick="PREMIUM.upgrade('${planKey}')">Choose ${plan.name}</button>`
                    }
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this.addPremiumStyles();
    document.body.appendChild(modal);
  },

  // Start free trial
  startTrial: function() {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + this.config.trialDays);
    
    localStorage.setItem('premium_trial_end', trialEnd.toISOString());
    this.saveUserPlan('pro');
    
    // Close modal
    document.querySelector('.premium-gate-modal')?.remove();
    
    // Show success message
    if (window.PWA) {
      PWA.showToast(`🎉 Started ${this.config.trialDays}-day free trial!`, 'success');
    }
    
    // Reload page to update UI
    setTimeout(() => window.location.reload(), 1000);
  },

  // Upgrade to plan
  upgrade: function(planKey) {
    // In a real app, this would process payment
    this.saveUserPlan(planKey);
    
    // Close modal
    document.querySelector('.upgrade-modal')?.remove();
    
    // Show success message
    if (window.PWA) {
      PWA.showToast(`🎉 Upgraded to ${this.config.plans[planKey].name}!`, 'success');
    }
    
    // Reload page to update UI
    setTimeout(() => window.location.reload(), 1000);
  },

  // Check trial status
  checkTrialStatus: function() {
    const trialEnd = localStorage.getItem('premium_trial_end');
    if (trialEnd) {
      const endDate = new Date(trialEnd);
      const now = new Date();
      
      if (now > endDate) {
        // Trial expired
        this.saveUserPlan('free');
        localStorage.removeItem('premium_trial_end');
        
        if (window.PWA) {
          PWA.showToast('Your free trial has ended. Upgrade to continue using premium features!', 'warning');
        }
      } else if (this.config.currentPlan === 'pro') {
        // Show trial remaining days
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 2) {
          setTimeout(() => {
            if (window.PWA) {
              PWA.showToast(`⏰ Your trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}!`, 'warning');
            }
          }, 2000);
        }
      }
    }
  },

  // Add premium styles
  addPremiumStyles: function() {
    if (document.getElementById('premium-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'premium-styles';
    style.textContent = `
      .premium-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        margin-left: 12px;
      }
      
      .upgrade-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      
      .upgrade-btn:hover {
        transform: translateY(-2px);
      }
      
      .premium-gate-modal,
      .upgrade-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }
      
      .premium-gate-content,
      .upgrade-modal-content {
        background: var(--card-bg);
        border-radius: 12px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 30px var(--shadow);
      }
      
      .upgrade-modal-content {
        max-width: 800px;
      }
      
      .premium-gate-header,
      .upgrade-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .premium-features ul {
        list-style: none;
        padding: 0;
      }
      
      .premium-features li {
        padding: 4px 0;
        color: var(--text-secondary);
      }
      
      .premium-pricing {
        text-align: center;
        margin: 20px 0;
      }
      
      .price {
        font-size: 24px;
        font-weight: bold;
        color: var(--accent);
      }
      
      .trial {
        font-size: 14px;
        color: var(--text-secondary);
        margin-top: 4px;
      }
      
      .premium-gate-footer,
      .upgrade-modal-footer {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
      }
      
      .plans-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }
      
      .plan-card {
        border: 2px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        text-align: center;
      }
      
      .plan-card.current {
        border-color: var(--accent);
        background: var(--bg-secondary);
      }
      
      .plan-header h4 {
        margin: 0 0 8px 0;
        color: var(--text-primary);
      }
      
      .plan-price {
        font-size: 20px;
        font-weight: bold;
        color: var(--accent);
        margin-bottom: 16px;
      }
      
      .plan-features ul {
        list-style: none;
        padding: 0;
        text-align: left;
        margin-bottom: 20px;
      }
      
      .plan-features li {
        padding: 4px 0;
        color: var(--text-secondary);
      }
      
      .btn-primary {
        background: var(--accent);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      }
      
      .btn-secondary {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border);
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      }
      
      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--text-secondary);
      }
    `;
    document.head.appendChild(style);
  },

  // Get current plan info
  getCurrentPlan: function() {
    return this.config.plans[this.config.currentPlan];
  },

  // Check if user is on trial
  isOnTrial: function() {
    const trialEnd = localStorage.getItem('premium_trial_end');
    return trialEnd && new Date(trialEnd) > new Date();
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  PREMIUM.init();
});
