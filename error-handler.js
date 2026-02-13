// Global Error Handling and Logging
window.ErrorHandler = {
  // Configuration
  config: {
    maxLogs: 100,
    logToConsole: true,
    logToStorage: true,
    storageKey: 'app_error_logs',
    enableSourceMaps: true
  },

  logs: [],
  errorCount: 0,
  warnCount: 0,

  // Initialize error handling
  init: function() {
    this.setupGlobalErrorHandler();
    this.setupPromiseRejectionHandler();
    this.setupConsoleOverrides();
    this.loadLogs();
  },

  // Global error handler
  setupGlobalErrorHandler: function() {
    window.addEventListener('error', (event) => {
      this.logError(event.error || event.message, {
        type: 'uncaught_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });
  },

  // Promise rejection handler
  setupPromiseRejectionHandler: function() {
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(event.reason || 'Promise rejected', {
        type: 'unhandled_rejection',
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  },

  // Override console methods to log
  setupConsoleOverrides: function() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      this.log('log', args);
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      this.logError(args[0], { args });
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      this.logWarn(args[0], { args });
      originalWarn.apply(console, args);
    };
  },

  // Log message
  log: function(level, message, context = {}) {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level: level,
        message: String(message),
        context: context,
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      this.logs.unshift(logEntry);
      this.logs = this.logs.slice(0, this.config.maxLogs);

      if (this.config.logToStorage) {
        Utils.setStorage(this.config.storageKey, this.logs);
      }

      if (this.config.logToConsole) {
        console.debug(`[${logEntry.level}]`, message, context);
      }
    } catch (error) {
      console.error('Log error:', error);
    }
  },

  // Log error
  logError: function(error, context = {}) {
    this.errorCount++;
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    this.log('error', message, {
      ...context,
      stack: stack,
      errorCount: this.errorCount
    });

    // Show user notification if error is critical
    if (this.isCriticalError(message)) {
      Utils.showError('An unexpected error occurred. Please try again.');
    }
  },

  // Log warning
  logWarn: function(message, context = {}) {
    this.warnCount++;
    this.log('warn', message, {
      ...context,
      warnCount: this.warnCount
    });
  },

  // Check if error is critical
  isCriticalError: function(message) {
    const criticalKeywords = ['storage', 'memory', 'fatal', 'crash', 'undefined is not'];
    return criticalKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  },

  // Load logs from storage
  loadLogs: function() {
    this.logs = Utils.getStorage(this.config.storageKey, []);
    if (!Array.isArray(this.logs)) {
      this.logs = [];
    }
  },

  // Get recent logs
  getRecentLogs: function(count = 20) {
    return this.logs.slice(0, count);
  },

  // Export logs as JSON
  exportLogs: function() {
    try {
      const json = JSON.stringify(this.logs, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `error-logs-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      Utils.showSuccess('Logs exported');
    } catch (error) {
      console.error('Export logs error:', error);
    }
  },

  // Clear logs
  clearLogs: function() {
    if (confirm('Clear all error logs?')) {
      this.logs = [];
      Utils.removeStorage(this.config.storageKey);
      this.errorCount = 0;
      this.warnCount = 0;
      Utils.showSuccess('Logs cleared');
    }
  },

  // Get error summary
  getSummary: function() {
    return {
      totalErrors: this.errorCount,
      totalWarnings: this.warnCount,
      recentErrors: this.logs.filter(l => l.level === 'error').slice(0, 5),
      recentWarnings: this.logs.filter(l => l.level === 'warn').slice(0, 5)
    };
  }
};

// Auto-initialize
window.addEventListener('load', () => {
  if (window.ErrorHandler) {
    ErrorHandler.init();
  }
});
