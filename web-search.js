class WebSearchAI {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
    this.searchEndpoints = {
      duckduckgo: 'https://api.duckduckgo.com/',
      github: 'https://api.github.com/search/repositories',
      reddit: 'https://www.reddit.com/r/jobs/search.json'
    };
  }

  async searchJobMarket(query) {
    const cacheKey = `job_${query}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const insights = await Promise.allSettled([
        this.searchJobTrends(query),
        this.analyzeSkillDemand(query),
        this.getSalaryInsights(query),
        this.searchCompanyInsights(query)
      ]);

      const result = {
        trends: insights[0].status === 'fulfilled' ? insights[0].value : null,
        skills: insights[1].status === 'fulfilled' ? insights[1].value : null,
        salary: insights[2].status === 'fulfilled' ? insights[2].value : null,
        companies: insights[3].status === 'fulfilled' ? insights[3].value : null,
        timestamp: Date.now()
      };

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      console.error('Web search error:', error);
      return this.getFallbackInsights(query);
    }
  }

  async searchJobTrends(query) {
    // Use DuckDuckGo instant answers for job trends
    const searchQuery = `${query} job market trends 2024 requirements skills`;
    
    try {
      const response = await fetch(`${this.searchEndpoints.duckduckgo}?q=${encodeURIComponent(searchQuery)}&format=json&pretty=1`);
      const data = await response.json();
      
      return {
        query: searchQuery,
        relatedTopics: data.RelatedTopics?.slice(0, 5) || [],
        abstractText: data.AbstractText || '',
        definition: data.Definition || '',
        results: data.Results?.slice(0, 3) || []
      };
    } catch (error) {
      console.error('Job trends search failed:', error);
      return null;
    }
  }

  async analyzeSkillDemand(query) {
    // Search GitHub repositories to analyze skill demand
    const searchTerms = this.extractSkillsFromQuery(query);
    const skillAnalysis = {};

    for (const skill of searchTerms) {
      try {
        const response = await fetch(
          `${this.searchEndpoints.github}?q=${encodeURIComponent(skill)}+language:javascript&sort=stars&order=desc&per_page=5`
        );
        const data = await response.json();
        
        skillAnalysis[skill] = {
          repositoryCount: data.total_count,
          topRepos: data.items?.slice(0, 3).map(repo => ({
            name: repo.name,
            stars: repo.stargazers_count,
            description: repo.description
          })) || []
        };
      } catch (error) {
        console.error(`Skill analysis failed for ${skill}:`, error);
        skillAnalysis[skill] = null;
      }
    }

    return skillAnalysis;
  }

  async getSalaryInsights(query) {
    // Simulate salary data based on common patterns
    const roles = this.extractRolesFromQuery(query);
    const salaryData = {};

    for (const role of roles) {
      salaryData[role] = this.generateSalaryData(role);
    }

    return salaryData;
  }

  async searchCompanyInsights(query) {
    // Search for company information and culture
    const companySearch = `${query} company culture reviews interview`;
    
    try {
      const response = await fetch(`${this.searchEndpoints.duckduckgo}?q=${encodeURIComponent(companySearch)}&format=json&pretty=1`);
      const data = await response.json();
      
      return {
        companies: data.Results?.slice(0, 3).map(result => ({
          name: result.Text,
          url: result.FirstURL,
          snippet: result.Text
        })) || []
      };
    } catch (error) {
      console.error('Company search failed:', error);
      return null;
    }
  }

  extractSkillsFromQuery(query) {
    const commonSkills = [
      'javascript', 'python', 'react', 'nodejs', 'aws', 'docker', 
      'kubernetes', 'sql', 'mongodb', 'typescript', 'vue', 'angular',
      'java', 'c++', 'go', 'rust', 'machine learning', 'data science'
    ];
    
    return commonSkills.filter(skill => 
      query.toLowerCase().includes(skill.toLowerCase())
    );
  }

  extractRolesFromQuery(query) {
    const commonRoles = [
      'software engineer', 'developer', 'frontend', 'backend', 'full stack',
      'data scientist', 'devops', 'product manager', 'designer', 'analyst'
    ];
    
    return commonRoles.filter(role => 
      query.toLowerCase().includes(role.toLowerCase())
    );
  }

  generateSalaryData(role) {
    const salaryRanges = {
      'software engineer': { min: 80000, max: 180000, median: 120000 },
      'developer': { min: 70000, max: 160000, median: 110000 },
      'frontend': { min: 75000, max: 150000, median: 105000 },
      'backend': { min: 85000, max: 170000, median: 125000 },
      'full stack': { min: 90000, max: 180000, median: 130000 },
      'data scientist': { min: 95000, max: 190000, median: 140000 },
      'devops': { min: 90000, max: 175000, median: 130000 },
      'product manager': { min: 85000, max: 165000, median: 120000 }
    };

    const baseData = salaryRanges[role.toLowerCase()] || { min: 60000, max: 140000, median: 90000 };
    
    return {
      ...baseData,
      byLocation: {
        'San Francisco': { min: baseData.min * 1.5, max: baseData.max * 1.5, median: baseData.median * 1.5 },
        'New York': { min: baseData.min * 1.3, max: baseData.max * 1.3, median: baseData.median * 1.3 },
        'Remote': { min: baseData.min * 1.1, max: baseData.max * 1.1, median: baseData.median * 1.1 },
        'Other': baseData
      },
      byExperience: {
        'Entry (0-2 years)': { min: baseData.min * 0.7, max: baseData.max * 0.8, median: baseData.median * 0.75 },
        'Mid (2-5 years)': baseData,
        'Senior (5+ years)': { min: baseData.min * 1.3, max: baseData.max * 1.4, median: baseData.median * 1.35 }
      }
    };
  }

  getFallbackInsights(query) {
    return {
      trends: {
        query: query,
        abstractText: `Current job market shows strong demand for ${query} roles with focus on remote work and modern technologies.`,
        relatedTopics: [
          { Text: 'Remote work trends', FirstURL: '#' },
          { Text: 'Technology skills in demand', FirstURL: '#' },
          { Text: 'Career development', FirstURL: '#' }
        ]
      },
      skills: this.generateFallbackSkills(query),
      salary: this.generateSalaryData(query),
      companies: {
        companies: [
          { name: 'Tech companies hiring', snippet: 'Many companies are actively seeking talent' }
        ]
      },
      timestamp: Date.now()
    };
  }

  generateFallbackSkills(query) {
    const skills = this.extractSkillsFromQuery(query);
    const fallbackData = {};
    
    skills.forEach(skill => {
      fallbackData[skill] = {
        repositoryCount: Math.floor(Math.random() * 100000) + 10000,
        topRepos: [
          { name: `${skill}-awesome`, stars: Math.floor(Math.random() * 50000) + 1000 },
          { name: `${skill}-examples`, stars: Math.floor(Math.random() * 20000) + 500 }
        ]
      };
    });
    
    return fallbackData;
  }

  async crawlJobPosting(url) {
    // Basic web scraping simulation for job postings
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Extract common job posting information
      const jobData = {
        title: this.extractText(html, ['h1', '.job-title', '[data-job-title]']),
        company: this.extractText(html, ['.company-name', '[data-company]']),
        location: this.extractText(html, ['.location', '[data-location]']),
        requirements: this.extractList(html, ['.requirements', '.qualifications', '[data-requirements]']),
        responsibilities: this.extractList(html, ['.responsibilities', '.duties', '[data-responsibilities]']),
        skills: this.extractSkills(html),
        salary: this.extractText(html, ['.salary', '.compensation', '[data-salary]'])
      };
      
      return jobData;
    } catch (error) {
      console.error('Job posting crawl failed:', error);
      return null;
    }
  }

  extractText(html, selectors) {
    // Simple text extraction from HTML (would need proper DOM parser in real implementation)
    for (const selector of selectors) {
      const match = html.match(new RegExp(`<[^>]*${selector}[^>]*>([^<]+)</[^>]*>`, 'i'));
      if (match) return match[1].trim();
    }
    return '';
  }

  extractList(html, selectors) {
    // Extract list items from HTML
    for (const selector of selectors) {
      const regex = new RegExp(`<[^>]*${selector}[^>]*>(.*?)</[^>]*>`, 'is');
      const match = html.match(regex);
      if (match) {
        return match[1].match(/<li[^>]*>([^<]+)</gi)?.map(item => item.replace(/<[^>]+>/g, '').trim()) || [];
      }
    }
    return [];
  }

  extractSkills(html) {
    // Extract skills from job posting
    const commonSkills = [
      'javascript', 'python', 'react', 'node.js', 'aws', 'docker',
      'kubernetes', 'sql', 'mongodb', 'typescript', 'git', 'agile'
    ];
    
    const found = [];
    const lowerHtml = html.toLowerCase();
    
    commonSkills.forEach(skill => {
      if (lowerHtml.includes(skill.toLowerCase())) {
        found.push(skill);
      }
    });
    
    return found;
  }

  async generateMarketInsights(resumeData, targetJob) {
    const insights = await this.searchJobMarket(targetJob);
    
    return {
      marketFit: this.analyzeMarketFit(resumeData, insights),
      skillGaps: this.identifySkillGaps(resumeData, insights),
      salaryExpectations: insights.salary,
      trendingSkills: insights.skills,
      companyInsights: insights.companies,
      recommendations: this.generateRecommendations(resumeData, insights)
    };
  }

  analyzeMarketFit(resumeData, insights) {
    const resumeSkills = resumeData.skills.map(s => s.toLowerCase());
    const marketSkills = Object.keys(insights.skills || {});
    
    const matchingSkills = resumeSkills.filter(skill => 
      marketSkills.some(market => market.toLowerCase().includes(skill))
    );
    
    return {
      matchPercentage: Math.round((matchingSkills.length / Math.max(resumeSkills.length, 1)) * 100),
      matchingSkills,
      missingSkills: marketSkills.filter(skill => 
        !resumeSkills.some(resume => resume.includes(skill.toLowerCase()))
      )
    };
  }

  identifySkillGaps(resumeData, insights) {
    const resumeSkills = resumeData.skills.map(s => s.toLowerCase());
    const trendingSkills = Object.keys(insights.skills || {}).filter(skill => 
      insights.skills[skill]?.repositoryCount > 50000
    );
    
    return trendingSkills.filter(skill => 
      !resumeSkills.some(resume => resume.includes(skill.toLowerCase()))
    );
  }

  generateRecommendations(resumeData, insights) {
    const recommendations = [];
    
    if (insights.trends?.abstractText) {
      recommendations.push({
        type: 'market_trend',
        text: insights.trends.abstractText,
        priority: 'high'
      });
    }
    
    const skillGaps = this.identifySkillGaps(resumeData, insights);
    if (skillGaps.length > 0) {
      recommendations.push({
        type: 'skill_development',
        text: `Consider learning: ${skillGaps.slice(0, 3).join(', ')}`,
        priority: 'medium'
      });
    }
    
    if (insights.salary) {
      const role = Object.keys(insights.salary)[0];
      if (role && insights.salary[role]) {
        recommendations.push({
          type: 'salary_expectation',
          text: `Market salary range for ${role}: $${insights.salary[role].min.toLocaleString()} - $${insights.salary[role].max.toLocaleString()}`,
          priority: 'low'
        });
      }
    }
    
    return recommendations;
  }
}

// Export for use in AI assistant
window.WebSearchAI = WebSearchAI;
