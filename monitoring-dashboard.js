// Real-time Monitoring Dashboard
window.MONITORING = {
  config: {
    refreshInterval: 5000, // 5 seconds
    maxLogEntries: 100,
    showInProduction: false
  },

  logs: [],
  metrics: {
    pageLoads: 0,
    errors: 0,
    warnings: 0,
    performance: {},
    userActions: 0
  },

  // Initialize monitoring
  init: function() {
    this.setupConsoleOverride();
    this.setupErrorTracking();
    this.setupPerformanceTracking();
    this.setupUserActionTracking();
    this.createMonitoringUI();
    this.startRealTimeUpdates();
  },

  // Override console to capture logs
  setupConsoleOverride: function() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      this.addLog('info', args);
      originalLog.apply(console, args);
    };

    console.warn = (...args) => {
      this.addLog('warning', args);
      this.metrics.warnings++;
      originalWarn.apply(console, args);
    };

    console.error = (...args) => {
      this.addLog('error', args);
      this.metrics.errors++;
      originalError.apply(console, args);
    };
  },

  // Setup error tracking
  setupErrorTracking: function() {
    window.addEventListener('error', (e) => {
      this.addLog('error', [
        `Error: ${e.message}`,
        `File: ${e.filename}`,
        `Line: ${e.lineno}:${e.colno}`
      ]);
      this.metrics.errors++;
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.addLog('error', [
        `Unhandled Promise Rejection: ${e.reason}`
      ]);
      this.metrics.errors++;
    });
  },

  // Setup performance tracking
  setupPerformanceTracking: function() {
    // Track page load
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      this.metrics.performance.pageLoadTime = loadTime;
      this.metrics.pageLoads++;
      
      this.addLog('info', [`Page loaded in ${loadTime}ms`]);
    });

    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.performance.LCP = lastEntry.renderTime || lastEntry.loadTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.metrics.performance.FID = entry.processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ['first-input'] });

      // CLS
      let clsValue = 0;
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.performance.CLS = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
    }
  },

  // Setup user action tracking
  setupUserActionTracking: function() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      const action = {
        type: 'click',
        element: target.tagName.toLowerCase(),
        id: target.id,
        className: target.className,
        text: target.textContent?.substring(0, 50),
        timestamp: Date.now()
      };
      
      this.addLog('info', [`User clicked: ${action.element}${action.id ? '#' + action.id : ''}${action.text ? ' - ' + action.text : ''}`]);
      this.metrics.userActions++;
    });

    document.addEventListener('submit', (e) => {
      this.addLog('info', [`Form submitted: ${e.target.id || e.target.className}`]);
      this.metrics.userActions++;
    });
  },

  // Add log entry
  addLog: function(level, args) {
    const logEntry = {
      timestamp: Date.now(),
      level: level,
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')
    };

    this.logs.unshift(logEntry);
    
    // Keep only recent logs
    if (this.logs.length > this.config.maxLogEntries) {
      this.logs = this.logs.slice(0, this.config.maxLogEntries);
    }

    this.updateMonitoringDisplay();
  },

  // Create monitoring UI
  createMonitoringUI: function() {
    // Skip in production unless explicitly enabled
    if (window.location.hostname !== 'localhost' && !this.config.showInProduction) {
      return;
    }

    const dashboard = document.createElement('div');
    dashboard.id = 'monitoring-dashboard';
    dashboard.innerHTML = `
      <div class="monitoring-header">
        <h3>🔍 Real-time Monitoring</h3>
        <div class="monitoring-controls">
          <button onclick="MONITORING.clearLogs()">Clear</button>
          <button onclick="MONITORING.exportLogs()">Export</button>
          <button onclick="MONITORING.toggleDashboard()">Minimize</button>
        </div>
      </div>
      <div class="monitoring-content">
        <div class="monitoring-metrics">
          <div class="metric">
            <span class="metric-label">Page Loads:</span>
            <span class="metric-value" id="metric-pageLoads">0</span>
          </div>
          <div class="metric">
            <span class="metric-label">Errors:</span>
            <span class="metric-value error" id="metric-errors">0</span>
          </div>
          <div class="metric">
            <span class="metric-label">Warnings:</span>
            <span class="metric-value warning" id="metric-warnings">0</span>
          </div>
          <div class="metric">
            <span class="metric-label">User Actions:</span>
            <span class="metric-value" id="metric-userActions">0</span>
          </div>
        </div>
        <div class="monitoring-performance">
          <h4>Performance Metrics</h4>
          <div class="perf-metric">
            <span>Page Load:</span>
            <span id="perf-pageLoadTime">-</span>
          </div>
          <div class="perf-metric">
            <span>LCP:</span>
            <span id="perf-LCP">-</span>
          </div>
          <div class="perf-metric">
            <span>FID:</span>
            <span id="perf-FID">-</span>
          </div>
          <div class="perf-metric">
            <span>CLS:</span>
            <span id="perf-CLS">-</span>
          </div>
        </div>
        <div class="monitoring-logs">
          <h4>Recent Logs</h4>
          <div id="logs-container"></div>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #monitoring-dashboard {
        position: fixed;
        top: 10px;
        right: 10px;
        width: 400px;
        max-height: 80vh;
        background: var(--card-bg, #fff);
        border: 1px solid var(--border, #ddd);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: monospace;
        font-size: 12px;
        overflow: hidden;
      }
      
      .monitoring-header {
        background: var(--accent, #7c5cff);
        color: white;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .monitoring-header h3 {
        margin: 0;
        font-size: 14px;
      }
      
      .monitoring-controls button {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        margin-left: 4px;
      }
      
      .monitoring-content {
        padding: 10px;
        max-height: 60vh;
        overflow-y: auto;
      }
      
      .monitoring-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 15px;
      }
      
      .metric {
        display: flex;
        justify-content: space-between;
        padding: 4px 8px;
        background: var(--bg-secondary, #f5f5f5);
        border-radius: 4px;
      }
      
      .metric-value.error {
        color: #dc3545;
        font-weight: bold;
      }
      
      .metric-value.warning {
        color: #ffc107;
        font-weight: bold;
      }
      
      .monitoring-performance {
        margin-bottom: 15px;
      }
      
      .monitoring-performance h4 {
        margin: 0 0 8px 0;
        font-size: 12px;
      }
      
      .perf-metric {
        display: flex;
        justify-content: space-between;
        padding: 2px 0;
        font-size: 11px;
      }
      
      .monitoring-logs h4 {
        margin: 0 0 8px 0;
        font-size: 12px;
      }
      
      #logs-container {
        max-height: 200px;
        overflow-y: auto;
        background: var(--bg-primary, #fff);
        border: 1px solid var(--border, #ddd);
        border-radius: 4px;
      }
      
      .log-entry {
        padding: 2px 6px;
        border-bottom: 1px solid #eee;
        font-size: 11px;
        line-height: 1.3;
      }
      
      .log-entry:last-child {
        border-bottom: none;
      }
      
      .log-entry.error {
        background: #ffebee;
        color: #c62828;
      }
      
      .log-entry.warning {
        background: #fff8e1;
        color: #f57c00;
      }
      
      .log-entry.info {
        background: #f3f4f6;
      }
      
      .log-timestamp {
        color: #666;
        font-size: 10px;
      }
      
      .minimized {
        height: 40px !important;
      }
      
      .minimized .monitoring-content {
        display: none;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(dashboard);
  },

  // Update monitoring display
  updateMonitoringDisplay: function() {
    const dashboard = document.getElementById('monitoring-dashboard');
    if (!dashboard) return;

    // Update metrics
    document.getElementById('metric-pageLoads').textContent = this.metrics.pageLoads;
    document.getElementById('metric-errors').textContent = this.metrics.errors;
    document.getElementById('metric-warnings').textContent = this.metrics.warnings;
    document.getElementById('metric-userActions').textContent = this.metrics.userActions;

    // Update performance metrics
    const perf = this.metrics.performance;
    document.getElementById('perf-pageLoadTime').textContent = perf.pageLoadTime ? `${perf.pageLoadTime}ms` : '-';
    document.getElementById('perf-LCP').textContent = perf.LCP ? `${Math.round(perf.LCP)}ms` : '-';
    document.getElementById('perf-FID').textContent = perf.FID ? `${Math.round(perf.FID)}ms` : '-';
    document.getElementById('perf-CLS').textContent = perf.CLS ? perf.CLS.toFixed(3) : '-';

    // Update logs
    const logsContainer = document.getElementById('logs-container');
    if (logsContainer) {
      logsContainer.innerHTML = this.logs.slice(0, 50).map(log => `
        <div class="log-entry ${log.level}">
          <span class="log-timestamp">${new Date(log.timestamp).toLocaleTimeString()}</span>
          <span class="log-message">${log.message}</span>
        </div>
      `).join('');
    }
  },

  // Start real-time updates
  startRealTimeUpdates: function() {
    setInterval(() => {
      this.updateMonitoringDisplay();
    }, this.config.refreshInterval);
  },

  // Toggle dashboard
  toggleDashboard: function() {
    const dashboard = document.getElementById('monitoring-dashboard');
    if (dashboard) {
      dashboard.classList.toggle('minimized');
    }
  },

  // Clear logs
  clearLogs: function() {
    this.logs = [];
    this.metrics = {
      pageLoads: this.metrics.pageLoads,
      errors: 0,
      warnings: 0,
      performance: this.metrics.performance,
      userActions: this.metrics.userActions
    };
    this.updateMonitoringDisplay();
  },

  // Export logs
  exportLogs: function() {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      logs: this.logs,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monitoring-logs-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Get system health
  getSystemHealth: function() {
    return {
      status: this.metrics.errors === 0 ? 'healthy' : 'issues',
      metrics: this.metrics,
      recommendations: this.getRecommendations()
    };
  },

  // Get recommendations
  getRecommendations: function() {
    const recommendations = [];
    
    if (this.metrics.performance.pageLoadTime > 3000) {
      recommendations.push('Consider optimizing images and reducing bundle size');
    }
    
    if (this.metrics.performance.LCP > 2500) {
      recommendations.push('Optimize largest contentful paint');
    }
    
    if (this.metrics.performance.FID > 100) {
      recommendations.push('Reduce JavaScript execution time');
    }
    
    if (this.metrics.performance.CLS > 0.1) {
      recommendations.push('Fix cumulative layout shift issues');
    }
    
    if (this.metrics.errors > 0) {
      recommendations.push('Fix JavaScript errors to improve user experience');
    }
    
    return recommendations;
  }
};

// Initialize monitoring when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  MONITORING.init();
});

// Global shortcut to toggle monitoring (Ctrl+Shift+M)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'M') {
    MONITORING.config.showInProduction = true;
    MONITORING.createMonitoringUI();
    MONITORING.updateMonitoringDisplay();
  }
});
