class AIAssistant {
  constructor() {
    this.modal = document.getElementById('aiModal');
    this.closeBtn = document.getElementById('aiModalClose');
    this.aiBtn = document.getElementById('aiAssistBtn');
    this.output = document.getElementById('aiOutput');
    this.loading = document.querySelector('.ai-loading');
    this.suggestions = document.querySelector('.ai-suggestions');
    this.targetSection = document.getElementById('aiTarget');
    this.inputSection = document.querySelector('.ai-input-section');
    this.webSearch = new WebSearchAI();
    this._isProcessing = false;
    
    this.init();
  }

  init() {
    this.aiBtn?.addEventListener('click', () => this.openModal());
    this.closeBtn?.addEventListener('click', () => this.closeModal());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // AI action buttons
    document.querySelectorAll('[data-ai-action]').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleAction(e.target.dataset.aiAction));
    });
  }

  openModal() {
    this.modal.style.display = 'flex';
    this.resetModal();
  }

  closeModal() {
    this.modal.style.display = 'none';
    this.resetModal();
  }

  resetModal() {
    this.output.style.display = 'none';
    this.loading.style.display = 'none';
    this.suggestions.innerHTML = '';
    this.targetSection.value = '';
    this.inputSection.style.display = 'none';
    this.setActionsEnabled(true);
    this._isProcessing = false;
  }

  setActionsEnabled(enabled) {
    const buttons = this.modal?.querySelectorAll('[data-ai-action]') || [];
    buttons.forEach((btn) => {
      btn.disabled = !enabled;
    });
  }

  handleAction(action) {
    const needsTarget = action === 'tailor-to-job' || action === 'market-insights';
    this.inputSection.style.display = needsTarget ? 'block' : 'none';

    if (needsTarget && !this.targetSection.value.trim()) {
      this.targetSection.focus();
      return;
    }

    this.processAction(action);
  }

  async processAction(action) {
    if (this._isProcessing) return;
    this._isProcessing = true;
    this.setActionsEnabled(false);
    this.showLoading();
    
    try {
      const resumeData = this.getResumeData();
      const targetJob = this.targetSection.value.trim();
      
      if (action === 'market-insights' && targetJob) {
        const insights = await this.webSearch.generateMarketInsights(resumeData, targetJob);
        this.displayMarketInsights(insights);
        return;
      }
      
      let prompt = this.buildPrompt(action, resumeData, targetJob);
      let suggestions = await this.generateSuggestions(prompt);
      
      this._lastSuggestions = suggestions;
      this.displaySuggestions(suggestions, action);
      
      // Track AI usage
      if (typeof Analytics !== 'undefined') {
        Analytics.trackAI(action, 'generate');
      }
    } catch (error) {
      console.error('AI Assistant error:', error);
      this.showError('Unable to generate suggestions. Please try again.');
      
      // Track AI errors
      if (typeof Analytics !== 'undefined') {
        Analytics.trackError('AI Assistant: ' + error.message, 'ai-assist');
      }
    } finally {
      this._isProcessing = false;
      this.setActionsEnabled(true);
    }
  }

  getResumeData() {
    const data = {
      fullName: document.getElementById('fullName')?.value || '',
      headline: document.getElementById('headline')?.value || '',
      email: document.getElementById('email')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      summary: document.getElementById('summary')?.value || '',
      experiences: [],
      education: [],
      skills: []
    };

    // Get experiences
    document.querySelectorAll('#experienceList .item').forEach(item => {
      const exp = {
        title: item.querySelector('.exp-title')?.value || '',
        company: item.querySelector('.exp-company')?.value || '',
        bullets: []
      };
      item.querySelectorAll('.exp-bullet').forEach(bullet => {
        if (bullet.value.trim()) exp.bullets.push(bullet.value);
      });
      if (exp.title) data.experiences.push(exp);
    });

    // Get education
    document.querySelectorAll('#educationList .item').forEach(item => {
      const edu = {
        degree: item.querySelector('.edu-degree')?.value || '',
        school: item.querySelector('.edu-school')?.value || ''
      };
      if (edu.degree) data.education.push(edu);
    });

    // Get skills
    document.querySelectorAll('#skillsList .skill-pill').forEach(pill => {
      const skill = pill.querySelector('.skill-text')?.textContent;
      if (skill) data.skills.push(skill);
    });

    return data;
  }

  buildPrompt(action, data, targetJob) {
    const baseInfo = `
Name: ${data.fullName}
Headline: ${data.headline}
Summary: ${data.summary}
Experience: ${data.experiences.map(e => `${e.title} at ${e.company}: ${e.bullets.join('; ')}`).join('\n')}
Skills: ${data.skills.join(', ')}
Education: ${data.education.map(e => `${e.degree} from ${e.school}`).join('\n')}
    `.trim();

    const jobContext = targetJob ? `\n\nTarget Job Description:\n${targetJob}` : '';

    const prompts = {
      'improve-summary': `Improve this professional summary to be more impactful and ATS-friendly. Focus on achievements and quantifiable results.\n\nCurrent Summary: ${data.summary}\n\n${jobContext}\n\nProvide 3 improved options with explanations.`,
      
      'strengthen-bullets': `Strengthen these resume bullet points using the STAR method. Add metrics and action verbs.\n\n${baseInfo}\n${jobContext}\n\nProvide improved versions of the bullet points with explanations.`,
      
      'suggest-skills': `Suggest relevant hard and soft skills for this resume profile.\n\n${baseInfo}${jobContext}\n\nList 8-12 key skills that would strengthen this resume, categorized by type.`,
      
      'tailor-to-job': `Tailor this resume for the specific job description. Focus on matching keywords and highlighting relevant experience.\n\n${baseInfo}${jobContext}\n\nProvide specific recommendations for each resume section.`
    };

    return prompts[action] || '';
  }

  async generateSuggestions(prompt) {
    try {
      // Try to use Gemini API if available
      const apiKey = this.getGeminiApiKey();
      if (apiKey) {
        return await this.callGeminiAPI(prompt);
      }
    } catch (error) {
      console.warn('Gemini API failed, falling back to mock responses:', error);
    }

    // Fallback to mock responses
    await new Promise(resolve => setTimeout(resolve, 1500));
    return this.generateMockSuggestions(prompt);
  }

  getGeminiApiKey() {
    // Try to get from environment variable (server-side) or from a global config
    return process?.env?.GEMINI_API_KEY ||
           window?.GEMINI_API_KEY ||
           document.querySelector('meta[name="gemini-api-key"]')?.content;
  }

  async callGeminiAPI(prompt) {
    const apiKey = this.getGeminiApiKey();
    if (!apiKey) throw new Error('No Gemini API key available');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    // Parse the AI response into our expected format
    return this.parseGeminiResponse(aiResponse, prompt);
  }

  parseGeminiResponse(response, originalPrompt) {
    // Determine the type of response based on the original prompt
    let title = 'AI Suggestions';
    let items = [];

    if (originalPrompt.includes('improve-summary')) {
      title = 'Improved Summary Options';
      // Split response into multiple options if possible
      const options = response.split(/\d+\.|Option|•/).filter(opt => opt.trim().length > 20);
      items = options.slice(0, 3).map((text, index) => ({
        text: text.trim(),
        explanation: `AI-generated option ${index + 1} based on your resume data.`
      }));
    } else if (originalPrompt.includes('strengthen-bullets')) {
      title = 'Strengthened Bullet Points';
      const bullets = response.split(/\n|•/).filter(bullet => bullet.trim().length > 10);
      items = bullets.slice(0, 3).map(bullet => ({
        text: bullet.trim(),
        explanation: 'Enhanced with action verbs and metrics for better impact.'
      }));
    } else if (originalPrompt.includes('suggest-skills')) {
      title = 'Recommended Skills';
      const skillCategories = response.split(/\n\n|Technical|Soft|Advanced/).filter(cat => cat.trim());
      items = skillCategories.slice(0, 3).map(category => ({
        text: category.trim(),
        explanation: 'Skills recommended based on your industry and experience level.'
      }));
    } else if (originalPrompt.includes('tailor-to-job')) {
      title = 'Tailoring Recommendations';
      const recommendations = response.split(/\n|•/).filter(rec => rec.trim().length > 10);
      items = recommendations.slice(0, 4).map(rec => ({
        text: rec.trim(),
        explanation: 'Specific recommendations to better match the job requirements.'
      }));
    }

    // If parsing failed, return the raw response
    if (items.length === 0) {
      items = [{
        text: response,
        explanation: 'AI-generated suggestion based on your request.'
      }];
    }

    return { title, items };
  }

  generateMockSuggestions(prompt) {
    if (prompt.includes('improve-summary')) {
      return {
        title: 'Improved Summary Options',
        items: [
          {
            text: 'Results-driven Software Engineer with 5+ years of experience developing scalable web applications. Increased system performance by 40% through optimization initiatives and led cross-functional teams to deliver projects 20% ahead of schedule.',
            explanation: 'Strong opening with quantifiable achievements and leadership experience.'
          },
          {
            text: 'Full-stack Developer specializing in React and Node.js with a proven track record of delivering high-impact solutions. Architected microservices that served 1M+ daily users and reduced infrastructure costs by 30%.',
            explanation: 'Technical focus with specific technologies and business impact metrics.'
          },
          {
            text: 'Senior Software Engineer passionate about building user-centric products. Led development of award-winning mobile app with 500K+ downloads and maintained 99.9% uptime through robust testing practices.',
            explanation: 'User-focused approach with product success metrics and reliability focus.'
          }
        ]
      };
    }
    
    if (prompt.includes('strengthen-bullets')) {
      return {
        title: 'Strengthened Bullet Points',
        items: [
          {
            text: '• Developed and deployed 15+ RESTful APIs using Node.js and Express, serving 100K+ requests daily with 99.8% uptime',
            explanation: 'Added specific numbers and technical details'
          },
          {
            text: '• Optimized database queries and implemented caching strategies, reducing API response times by 45% and improving user experience',
            explanation: 'Quantified impact and focused on user benefit'
          },
          {
            text: '• Led a team of 4 engineers to redesign authentication system, decreasing security vulnerabilities by 90% and improving login conversion by 25%',
            explanation: 'Added leadership context and security metrics'
          }
        ]
      };
    }
    
    if (prompt.includes('suggest-skills')) {
      return {
        title: 'Recommended Skills',
        items: [
          {
            text: 'Technical Skills: Docker, Kubernetes, AWS, GraphQL, TypeScript, CI/CD, Microservices, Redis',
            explanation: 'In-demand technical skills for modern development roles'
          },
          {
            text: 'Soft Skills: Agile/Scrum, Code Review, Mentoring, Cross-functional Communication, Project Management',
            explanation: 'Essential soft skills for career advancement'
          },
          {
            text: 'Advanced Skills: System Design, Performance Optimization, Security Best Practices, Cloud Architecture',
            explanation: 'Senior-level skills that differentiate top candidates'
          }
        ]
      };
    }
    
    if (prompt.includes('tailor-to-job')) {
      return {
        title: 'Tailoring Recommendations',
        items: [
          {
            text: 'Add keywords from job description: "scalable architecture", "cloud-native", "DevOps practices"',
            explanation: 'Include specific terms mentioned in the job posting'
          },
          {
            text: 'Highlight experience with required technologies: AWS, Docker, and microservices architecture',
            explanation: 'Emphasize your most relevant technical experience'
          },
          {
            text: 'Quantify achievements that match job requirements: "improved system performance by 40%" aligns with performance optimization focus',
            explanation: 'Connect your accomplishments to their needs'
          },
          {
            text: 'Adjust summary to reflect company values: innovation, scalability, and team collaboration',
            explanation: 'Show alignment with company culture and mission'
          }
        ]
      };
    }
    
    // Default fallback
    return {
      title: 'AI Suggestions',
      items: [
        {
          text: 'Consider adding more quantifiable achievements to demonstrate impact',
          explanation: 'Numbers and metrics make your experience more concrete'
        },
        {
          text: 'Include industry-specific keywords to improve ATS matching',
          explanation: 'Helps your resume get past automated screening'
        }
      ]
    };
  }

  showLoading() {
    this.output.style.display = 'block';
    this.loading.style.display = 'block';
    this.suggestions.style.display = 'none';
  }

  displaySuggestions(suggestions, action) {
    this.loading.style.display = 'none';
    this.suggestions.style.display = 'block';
    
    let html = `<h4>${suggestions.title}</h4>`;
    
    suggestions.items.forEach((item, index) => {
      html += `
        <div class="ai-suggestion" style="margin-bottom: 20px; padding: 15px; background: rgba(16,31,59,.3); border-radius: 8px;">
          <div style="margin-bottom: 8px;">
            <button class="btn btn-sm btn-outline" onclick="aiAssistant.applySuggestion(${index}, '${action}')">
              Apply This
            </button>
          </div>
          <div style="white-space: pre-wrap; margin-bottom: 8px;">${item.text}</div>
          <div class="muted tiny">${item.explanation}</div>
        </div>
      `;
    });
    
    this.suggestions.innerHTML = html;
  }

  applySuggestion(index, action) {
    const suggestions = this.getLastSuggestions();
    if (!suggestions || !suggestions.items[index]) return;
    
    const suggestion = suggestions.items[index];
    
    switch (action) {
      case 'improve-summary':
        const summaryField = document.getElementById('summary');
        if (summaryField) {
          summaryField.value = suggestion.text;
          summaryField.dispatchEvent(new Event('input'));
        }
        break;
        
      case 'strengthen-bullets':
        // This would need more complex logic to map bullets to experience items
        console.log('Bullet point suggestions:', suggestion.text);
        break;
        
      case 'suggest-skills':
        const skillsList = document.getElementById('skillsList');
        if (skillsList) {
          const skills = suggestion.text.split(':')[1]?.split(',').map(s => s.trim());
          if (skills) {
            skills.forEach(skill => {
              if (skill && !this.hasSkill(skill)) {
                this.addSkill(skill);
              }
            });
          }
        }
        break;
    }
    
    this.closeModal();
  }

  getLastSuggestions() {
    // Store last suggestions for apply functionality
    return this._lastSuggestions;
  }

  hasSkill(skill) {
    const s = String(skill || '').trim();
    if (!s) return false;

    // Prefer builder state if available
    try {
      const raw = localStorage.getItem('ats_resume_builder_v1');
      if (raw) {
        const state = JSON.parse(raw);
        const skills = Array.isArray(state?.skills) ? state.skills : [];
        return skills.some((x) => String(x || '').trim().toLowerCase() === s.toLowerCase());
      }
    } catch {}

    // Fallback to DOM check
    const pills = document.querySelectorAll('#skillsList .pill span');
    return Array.from(pills).some(el => String(el.textContent || '').trim().toLowerCase() === s.toLowerCase());
  }

  addSkill(skill) {
    const s = String(skill || '').trim();
    if (!s) return;
    if (this.hasSkill(s)) return;

    // If builder state exists, update it directly so autosave/preview stay consistent.
    try {
      const raw = localStorage.getItem('ats_resume_builder_v1');
      if (raw) {
        const state = JSON.parse(raw);
        const next = Array.isArray(state?.skills) ? [...state.skills] : [];
        next.push(s);
        state.skills = next;
        localStorage.setItem('ats_resume_builder_v1', JSON.stringify(state));

        // If we're on the builder page, a full reload is the safest way to let builder.js
        // re-bind state without adding cross-file coupling.
        if (document.body?.classList?.contains('builder-body')) {
          location.reload();
        }
        return;
      }
    } catch (e) {
      console.warn('Failed to update builder state skills:', e);
    }

    // Fallback: append to DOM (non-persistent)
    const skillsList = document.getElementById('skillsList');
    if (!skillsList) return;
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.innerHTML = `<span>${s}</span><button type="button" aria-label="Remove skill">×</button>`;
    pill.querySelector('button')?.addEventListener('click', () => pill.remove());
    skillsList.appendChild(pill);
  }

  showError(message) {
    this.loading.style.display = 'none';
    this.suggestions.style.display = 'block';
    this.suggestions.innerHTML = `
      <div class="error" style="color: var(--danger); padding: 15px; background: rgba(239,68,68,.1); border-radius: 8px;">
        ${message}
      </div>
    `;
  }

  displayMarketInsights(insights) {
    this.loading.style.display = 'none';
    this.suggestions.style.display = 'block';
    
    let html = '<h4>Market Intelligence Report</h4>';
    
    // Market fit analysis
    if (insights.marketFit) {
      html += `
        <div class="insight-section" style="margin-bottom: 20px; padding: 15px; background: rgba(16,31,59,.3); border-radius: 8px;">
          <h5>Market Fit Analysis</h5>
          <div class="fit-score" style="font-size: 24px; font-weight: bold; margin: 10px 0;">
            ${insights.marketFit.matchPercentage}% Match
          </div>
          <div><strong>Matching Skills:</strong> ${insights.marketFit.matchingSkills.join(', ') || 'None found'}</div>
          <div><strong>Missing Skills:</strong> ${insights.marketFit.missingSkills.slice(0, 3).join(', ') || 'None'}</div>
        </div>
      `;
    }
    
    // Skill gaps
    if (insights.skillGaps && insights.skillGaps.length > 0) {
      html += `
        <div class="insight-section" style="margin-bottom: 20px; padding: 15px; background: rgba(16,31,59,.3); border-radius: 8px;">
          <h5>Recommended Skills to Learn</h5>
          <div class="skill-gaps">
            ${insights.skillGaps.map(skill => `
              <div style="margin: 5px 0;">
                <button class="btn btn-sm btn-outline" onclick="aiAssistant.addSkill('${skill}')">
                  Add ${skill}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Salary insights
    if (insights.salaryExpectations) {
      const role = Object.keys(insights.salaryExpectations)[0];
      const salaryData = insights.salaryExpectations[role];
      if (salaryData) {
        html += `
          <div class="insight-section" style="margin-bottom: 20px; padding: 15px; background: rgba(16,31,59,.3); border-radius: 8px;">
            <h5>Salary Expectations for ${role}</h5>
            <div><strong>Range:</strong> $${salaryData.min.toLocaleString()} - $${salaryData.max.toLocaleString()}</div>
            <div><strong>Median:</strong> $${salaryData.median.toLocaleString()}</div>
            <div><strong>Remote:</strong> $${salaryData.byLocation?.Remote?.median.toLocaleString() || 'N/A'}</div>
          </div>
        `;
      }
    }
    
    // Trending skills
    if (insights.trendingSkills) {
      const topSkills = Object.entries(insights.trendingSkills)
        .filter(([_, data]) => data && data.repositoryCount)
        .sort((a, b) => b[1].repositoryCount - a[1].repositoryCount)
        .slice(0, 5);
      
      if (topSkills.length > 0) {
        html += `
          <div class="insight-section" style="margin-bottom: 20px; padding: 15px; background: rgba(16,31,59,.3); border-radius: 8px;">
            <h5>Trending Skills</h5>
            ${topSkills.map(([skill, data]) => `
              <div style="margin: 8px 0; display: flex; justify-content: space-between;">
                <span>${skill}</span>
                <span class="muted">${data.repositoryCount?.toLocaleString() || 'N/A'} repos</span>
              </div>
            `).join('')}
          </div>
        `;
      }
    }
    
    // Recommendations
    if (insights.recommendations && insights.recommendations.length > 0) {
      html += `
        <div class="insight-section" style="margin-bottom: 20px; padding: 15px; background: rgba(16,31,59,.3); border-radius: 8px;">
          <h5>AI Recommendations</h5>
          ${insights.recommendations.map(rec => `
            <div style="margin: 10px 0; padding: 10px; background: rgba(31,47,87,.2); border-radius: 4px;">
              <div style="font-weight: 600; margin-bottom: 5px;">${rec.type.replace('_', ' ').toUpperCase()}</div>
              <div>${rec.text}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    this.suggestions.innerHTML = html;
  }
}

// Initialize AI Assistant
let aiAssistant;
document.addEventListener('DOMContentLoaded', () => {
  aiAssistant = new AIAssistant();
});
