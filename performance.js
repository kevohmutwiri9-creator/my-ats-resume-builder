// Performance monitoring and optimization
window.PERF = {
  // Track performance metrics
  track: function(name) {
    console.time(name);
    this.metrics[name] = { start: performance.now() };
  },

  end: function(name) {
    if (this.metrics[name]) {
      const duration = performance.now() - this.metrics[name].start;
      console.timeEnd(name);
      this.metrics[name].duration = duration;
      this.reportMetric(name, duration);
    }
  },

  metrics: {},

  // Report metrics to analytics
  reportMetric: function(name, duration) {
    if (window.Analytics && window.Analytics.config.trackingEnabled) {
      gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: Math.round(duration),
        metric_unit: 'ms'
      });
    }
  },

  // Monitor Core Web Vitals
  initCoreWebVitals: function() {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.reportMetric('LCP', lastEntry.renderTime || lastEntry.loadTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        this.reportMetric('FID', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.reportMetric('CLS', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  },

  // Lazy load images
  lazyLoadImages: function() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  },

  // Initialize performance monitoring
  init: function() {
    this.initCoreWebVitals();
    this.lazyLoadImages();
    
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      this.reportMetric('page_load_time', loadTime);
    });
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  PERF.init();
});
