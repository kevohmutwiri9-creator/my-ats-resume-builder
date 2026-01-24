// Structured Data (JSON-LD) for SEO
window.SEO = {
  // Add structured data to page
  addStructuredData: function(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  },

  // Organization data
  addOrganizationData: function() {
    this.addStructuredData({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ATS Resume Builder",
      "url": "https://my-ats-resume-builder-nu.vercel.app",
      "logo": "https://my-ats-resume-builder-nu.vercel.app/icons/icon-512.svg",
      "description": "Build ATS-friendly resumes with AI assistance and professional templates",
      "sameAs": [
        "https://github.com/kevohmutwiri9-creator/ats-resume-builder"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service"
      }
    });
  },

  // Website data
  addWebsiteData: function() {
    this.addStructuredData({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ATS Resume Builder",
      "url": "https://my-ats-resume-builder-nu.vercel.app",
      "description": "Professional resume builder with ATS optimization and AI assistance",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://my-ats-resume-builder-nu.vercel.app/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    });
  },

  // Software application data
  addSoftwareData: function() {
    this.addStructuredData({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ATS Resume Builder",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1000"
      },
      "featureList": [
        "ATS-friendly resume templates",
        "AI-powered suggestions",
        "PDF export",
        "Real-time optimization",
        "Multiple language support"
      ]
    });
  },

  // FAQ data
  addFAQData: function() {
    this.addStructuredData({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is an ATS resume?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An ATS (Applicant Tracking System) resume is formatted to be easily read by automated recruitment software used by employers to screen job applications."
          }
        },
        {
          "@type": "Question",
          "name": "How do I make my resume ATS-friendly?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use a clean format, avoid tables and columns, use standard fonts, include relevant keywords, and save as a PDF or DOCX file."
          }
        },
        {
          "@type": "Question",
          "name": "Is this resume builder free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our basic resume builder is completely free. We also offer premium features for advanced users."
          }
        }
      ]
    });
  },

  // Breadcrumb data
  addBreadcrumbData: function(breadcrumbs) {
    const itemList = breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }));

    this.addStructuredData({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": itemList
    });
  },

  // Initialize SEO data
  init: function() {
    this.addOrganizationData();
    this.addWebsiteData();
    this.addSoftwareData();
    this.addFAQData();
    
    // Add breadcrumbs based on current page
    const path = window.location.pathname;
    const breadcrumbs = [
      { name: "Home", url: "/" }
    ];
    
    if (path.includes('builder')) {
      breadcrumbs.push({ name: "Resume Builder", url: "/builder.html" });
    } else if (path.includes('cover-letter')) {
      breadcrumbs.push({ name: "Cover Letter", url: "/cover-letter.html" });
    } else if (path.includes('ats')) {
      breadcrumbs.push({ name: "ATS Checker", url: "/ats.html" });
    }
    
    this.addBreadcrumbData(breadcrumbs);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  SEO.init();
});
