class AIGreeter {
  constructor() {
    this.greetingShown = false;
    this.greetingTimeout = 3000; // Show after 3 seconds
    this.dismissedVisits = parseInt(localStorage.getItem('aiGreetingDismissed') || '0');
    this.maxShowPerSession = 2;
    
    this.init();
  }

  init() {
    // Show greeting after delay
    setTimeout(() => {
      if (this.shouldShowGreeting()) {
        this.showGreeting();
      }
    }, this.greetingTimeout);

    // Show greeting when user first interacts with AI button
    const aiBtn = document.getElementById('aiAssistBtn');
    if (aiBtn && !this.greetingShown) {
      aiBtn.addEventListener('click', () => {
        if (!this.greetingShown && this.shouldShowGreeting()) {
          this.showGreeting();
        }
      }, { once: true });
    }
  }

  shouldShowGreeting() {
    // Don't show if already shown this session
    if (this.greetingShown) return false;
    
    // Don't show if user has dismissed many times
    if (this.dismissedVisits >= 5) return false;
    
    // Don't show on very short visits (likely bots)
    if (performance.now() < 1000) return false;
    
    return true;
  }

  showGreeting() {
    this.greetingShown = true;
    
    const greeting = this.createGreetingElement();
    document.body.appendChild(greeting);
    
    // Animate in
    setTimeout(() => {
      greeting.classList.add('show');
    }, 100);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
      this.hideGreeting(greeting);
    }, 8000);
  }

  createGreetingElement() {
    const greeting = document.createElement('div');
    greeting.className = 'ai-greeting';
    greeting.innerHTML = `
      <div class="ai-greeting-content">
        <div class="ai-greeting-header">
          <img src="./ai-icon.svg" alt="AI" class="ai-greeting-icon">
          <div class="ai-greeting-title">AI Assistant</div>
          <button class="ai-greeting-close" onclick="this.closest('.ai-greeting').remove()">&times;</button>
        </div>
        <div class="ai-greeting-message">
          ${this.getPersonalizedGreeting()}
        </div>
        <div class="ai-greeting-actions">
          <button class="btn btn-primary btn-sm" onclick="aiGreeter.openAIAssistant()">
            Try AI Assistant
          </button>
          <button class="btn btn-ghost btn-sm" onclick="aiGreeter.dismissGreeting(this)">
            Not now
          </button>
        </div>
      </div>
    `;
    
    return greeting;
  }

  getPersonalizedGreeting() {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    
    const greetings = [
      `${timeGreeting}! I'm your AI career assistant. I can help you improve your resume, analyze job descriptions, and provide market insights.`,
      `Welcome! Need help with your resume? I can strengthen your bullet points, suggest skills, and analyze job market trends.`,
      `Hi there! I can help you create a standout resume with AI-powered suggestions and real-time market intelligence.`,
      `${timeGreeting}! Let me help you optimize your resume for ATS and tailor it to your dream job.`
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  hideGreeting(greeting) {
    greeting.classList.remove('show');
    setTimeout(() => {
      if (greeting.parentNode) {
        greeting.parentNode.removeChild(greeting);
      }
    }, 300);
  }

  openAIAssistant() {
    const aiBtn = document.getElementById('aiAssistBtn');
    if (aiBtn) {
      aiBtn.click();
    }
    
    // Close greeting
    const greeting = document.querySelector('.ai-greeting');
    if (greeting) {
      this.hideGreeting(greeting);
    }
  }

  dismissGreeting(button) {
    const greeting = button.closest('.ai-greeting');
    
    // Track dismissals
    this.dismissedVisits++;
    localStorage.setItem('aiGreetingDismissed', this.dismissedVisits.toString());
    
    this.hideGreeting(greeting);
  }

  // Method to manually trigger greeting (for testing)
  forceShowGreeting() {
    this.greetingShown = false;
    this.showGreeting();
  }
}

// Add CSS for greeting
const greetingStyles = `
<style>
.ai-greeting {
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 380px;
  z-index: 1001;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.ai-greeting.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.ai-greeting-content {
  background: var(--bg);
  border: 1px solid rgba(31,47,87,.85);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 0;
  overflow: hidden;
}

.ai-greeting-header {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid rgba(31,47,87,.3);
  background: rgba(16,31,59,.3);
}

.ai-greeting-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  color: var(--primary);
}

.ai-greeting-title {
  font-weight: 600;
  flex: 1;
}

.ai-greeting-close {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.ai-greeting-close:hover {
  background: rgba(239,68,68,.1);
  color: var(--danger);
}

.ai-greeting-message {
  padding: 15px;
  line-height: 1.5;
  color: var(--text);
}

.ai-greeting-actions {
  padding: 15px;
  border-top: 1px solid rgba(31,47,87,.3);
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

@media (max-width: 480px) {
  .ai-greeting {
    bottom: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .ai-greeting-actions {
    flex-direction: column;
  }
  
  .btn-sm {
    width: 100%;
  }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', greetingStyles);

// Initialize greeter
window.aiGreeter = new AIGreeter();
