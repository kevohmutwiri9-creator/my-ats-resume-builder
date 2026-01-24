// ATS Score Calculator and Analyzer
window.ATS_SCORE = {
  // ATS optimization rules
  rules: {
    formatting: {
      weight: 25,
      checks: [
        { name: 'no_tables', check: (content) => !/<table|<td|<tr/i.test(content), points: 5 },
        { name: 'no_columns', check: (content) => !/(column|float|display:\s*inline)/i.test(content), points: 5 },
        { name: 'standard_font', check: (content) => /(arial|calibri|georgia|helvetica|times|verdana)/i.test(content), points: 5 },
        { name: 'font_size', check: (content) => /(10|11|12)pt/i.test(content), points: 5 },
        { name: 'margins', check: (content) => /(margin|padding):\s*1in/i.test(content), points: 5 }
      ]
    },
    content: {
      weight: 40,
      checks: [
        { name: 'contact_info', check: (content) => /(email|phone|linkedin)/i.test(content), points: 10 },
        { name: 'summary', check: (content) => /(summary|objective|profile)/i.test(content), points: 10 },
        { name: 'experience', check: (content) => /(experience|employment|work)/i.test(content), points: 10 },
        { name: 'education', check: (content) => /(education|degree|university)/i.test(content), points: 5 },
        { name: 'skills', check: (content) => /(skills|competencies|abilities)/i.test(content), points: 5 }
      ]
    },
    keywords: {
      weight: 35,
      checks: [
        { name: 'action_verbs', check: (content) => this.countActionVerbs(content), points: 15 },
        { name: 'industry_keywords', check: (content) => this.countIndustryKeywords(content), points: 10 },
        { name: 'quantifiable_results', check: (content) => this.countQuantifiableResults(content), points: 10 }
      ]
    }
  },

  // Common action verbs
  actionVerbs: [
    'achieved', 'improved', 'managed', 'developed', 'led', 'created', 'implemented', 
    'increased', 'reduced', 'optimized', 'launched', 'coordinated', 'trained', 
    'mentored', 'negotiated', 'streamlined', 'revolutionized', 'transformed'
  ],

  // Industry keywords
  industryKeywords: [
    'project management', 'data analysis', 'customer service', 'sales', 'marketing',
    'software development', 'team leadership', 'strategic planning', 'budget management',
    'quality assurance', 'business development', 'operations', 'research', 'compliance'
  ],

  // Calculate ATS score
  calculateScore: function(content, jobDescription = '') {
    let totalScore = 0;
    let maxScore = 0;
    const results = {};

    // Check each category
    Object.keys(this.rules).forEach(category => {
      const categoryRules = this.rules[category];
      let categoryScore = 0;
      let categoryMax = 0;
      const categoryResults = [];

      categoryRules.checks.forEach(rule => {
        categoryMax += rule.points;
        let passed = false;
        let points = 0;

        if (typeof rule.check === 'function') {
          const result = rule.check(content);
          if (typeof result === 'boolean') {
            passed = result;
            points = passed ? rule.points : 0;
          } else {
            passed = result > 0;
            points = Math.min(result, rule.points);
          }
        }

        categoryScore += points;
        categoryResults.push({
          name: rule.name,
          passed: passed,
          points: points,
          maxPoints: rule.points
        });
      });

      // Apply category weight
      const weightedScore = (categoryScore / categoryMax) * categoryRules.weight;
      totalScore += weightedScore;
      maxScore += categoryRules.weight;

      results[category] = {
        score: Math.round(weightedScore),
        maxScore: categoryRules.weight,
        percentage: Math.round((weightedScore / categoryRules.weight) * 100),
        checks: categoryResults
      };
    });

    // Job description matching bonus
    if (jobDescription) {
      const keywordMatch = this.calculateKeywordMatch(content, jobDescription);
      const bonusPoints = Math.min(keywordMatch * 10, 15);
      totalScore += bonusPoints;
      maxScore += 15;
      results.keyword_match = {
        score: Math.round(bonusPoints),
        maxScore: 15,
        percentage: Math.round((bonusPoints / 15) * 100)
      };
    }

    return {
      totalScore: Math.round(totalScore),
      maxScore: maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      grade: this.getGrade(Math.round((totalScore / maxScore) * 100)),
      results: results
    };
  },

  // Count action verbs
  countActionVerbs: function(content) {
    const matches = content.toLowerCase().match(/\b\w+\b/g) || [];
    const verbCount = matches.filter(word => this.actionVerbs.includes(word)).length;
    return Math.min(verbCount, 15);
  },

  // Count industry keywords
  countIndustryKeywords: function(content) {
    const contentLower = content.toLowerCase();
    let count = 0;
    this.industryKeywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        count += 2;
      }
    });
    return Math.min(count, 10);
  },

  // Count quantifiable results
  countQuantifiableResults: function(content) {
    const patterns = [
      /\d+%|\$\d+|\d+\s*(?:million|billion|thousand)|\d+\s*(?:years?|months?)/gi,
      /\b(increased|decreased|reduced|grew|saved)\s+by\s+\d+/gi,
      /\b\d+\s+(?:customers|clients|projects|products|sales|revenue)/gi
    ];
    
    let count = 0;
    patterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      count += matches.length;
    });
    
    return Math.min(count, 10);
  },

  // Calculate keyword match with job description
  calculateKeywordMatch: function(resume, jobDescription) {
    const resumeWords = new Set(resume.toLowerCase().match(/\b\w{3,}\b/g) || []);
    const jobWords = new Set(jobDescription.toLowerCase().match(/\b\w{3,}\b/g) || []);
    
    const intersection = new Set([...resumeWords].filter(x => jobWords.has(x)));
    return jobWords.size > 0 ? intersection.size / jobWords.size : 0;
  },

  // Get grade based on percentage
  getGrade: function(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  },

  // Generate suggestions
  generateSuggestions: function(results) {
    const suggestions = [];

    Object.keys(results).forEach(category => {
      if (category === 'keyword_match') return;
      
      const categoryResult = results[category];
      categoryResult.checks.forEach(check => {
        if (!check.passed) {
          suggestions.push(this.getSuggestionForCheck(check.name));
        }
      });
    });

    return suggestions;
  },

  // Get suggestion for specific check
  getSuggestionForCheck: function(checkName) {
    const suggestions = {
      no_tables: 'Remove tables from your resume. ATS systems have trouble parsing table-based layouts.',
      no_columns: 'Avoid column layouts. Use a single-column format for better ATS compatibility.',
      standard_font: 'Use standard fonts like Arial, Calibri, Georgia, Helvetica, Times, or Verdana.',
      font_size: 'Use font sizes between 10-12pt for optimal readability.',
      margins: 'Set margins to 1 inch on all sides for proper formatting.',
      contact_info: 'Add your contact information including email, phone, and LinkedIn profile.',
      summary: 'Include a professional summary or objective statement at the beginning.',
      experience: 'Add your work experience with clear job titles and dates.',
      education: 'Include your education details with degrees and institutions.',
      skills: 'List your skills and competencies in a dedicated section.',
      action_verbs: 'Use more action verbs to describe your accomplishments.',
      industry_keywords: 'Include more industry-specific keywords relevant to your target role.',
      quantifiable_results: 'Add quantifiable achievements with numbers and percentages.'
    };

    return suggestions[checkName] || 'Review this section for ATS optimization.';
  },

  // Display score results
  displayResults: function(scoreData, container) {
    const html = `
      <div class="ats-score-results">
        <div class="score-overview">
          <div class="score-circle">
            <div class="score-value">${scoreData.percentage}%</div>
            <div class="score-grade">${scoreData.grade}</div>
          </div>
          <div class="score-text">
            <h3>ATS Compatibility Score</h3>
            <p>Your resume scored ${scoreData.percentage}% for ATS optimization.</p>
          </div>
        </div>
        
        <div class="score-breakdown">
          ${Object.keys(scoreData.results).map(category => `
            <div class="category-score">
              <h4>${category.replace('_', ' ').toUpperCase()}</h4>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${scoreData.results[category].percentage}%"></div>
              </div>
              <span class="score-text">${scoreData.results[category].score}/${scoreData.results[category].maxScore}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="suggestions">
          <h4>Improvement Suggestions</h4>
          <ul>
            ${this.generateSuggestions(scoreData.results).map(suggestion => `
              <li>${suggestion}</li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }
};
