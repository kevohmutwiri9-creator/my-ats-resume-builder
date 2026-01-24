// Resume Examples Database by Industry
window.ResumeExamples = {
  industries: {
    technology: {
      name: 'Technology',
      icon: '💻',
      description: 'Software development, IT, and tech roles',
      examples: [
        {
          title: 'Senior Software Engineer',
          experience: '8+ years',
          summary: 'Results-driven Senior Software Engineer with 8+ years of experience developing scalable web applications and leading cross-functional teams. Expertise in full-stack development, cloud architecture, and DevOps practices. Consistently delivered projects 20% ahead of schedule while improving system performance by 40%.',
          experience: [
            {
              role: 'Senior Software Engineer',
              company: 'TechCorp Solutions',
              location: 'San Francisco, CA',
              duration: '2020 - Present',
              bullets: [
                'Led development of microservices architecture serving 1M+ daily users, reducing infrastructure costs by 30%',
                'Mentored team of 5 junior developers, conducting code reviews and implementing best practices',
                'Improved API response times by 45% through caching strategies and query optimization',
                'Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes'
              ]
            },
            {
              role: 'Full Stack Developer',
              company: 'Digital Innovations Inc',
              location: 'Austin, TX',
              duration: '2018 - 2020',
              bullets: [
                'Developed and launched 3 production web applications using React, Node.js, and PostgreSQL',
                'Integrated third-party APIs (Stripe, SendGrid) enabling payment processing and email services',
                'Reduced page load times by 60% through code optimization and lazy loading',
                'Collaborated with UX team to implement responsive design improving mobile conversion by 25%'
              ]
            }
          ],
          education: [
            {
              degree: 'Bachelor of Science in Computer Science',
              school: 'University of Texas at Austin',
              duration: '2014 - 2018',
              details: 'GPA: 3.8/4.0, Dean\'s List, Relevant Coursework: Data Structures, Algorithms, Web Development'
            }
          ],
          skills: [
            'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes',
            'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs', 'Git', 'CI/CD'
          ]
        },
        {
          title: 'DevOps Engineer',
          experience: '5+ years',
          summary: 'DevOps Engineer with 5+ years of experience implementing and managing cloud infrastructure. Specialized in AWS, containerization, and automation. Reduced deployment failures by 80% and improved system uptime to 99.9%.',
          experience: [
            {
              role: 'DevOps Engineer',
              company: 'CloudTech Systems',
              location: 'Seattle, WA',
              duration: '2019 - Present',
              bullets: [
                'Designed and implemented Kubernetes-based infrastructure reducing deployment time by 75%',
                'Automated CI/CD pipelines using Jenkins and GitHub Actions, achieving 100 deployments/week',
                'Managed AWS infrastructure with $2M monthly spend, optimizing costs by 35% through resource rightsizing',
                'Implemented comprehensive monitoring and alerting system reducing incident response time by 60%'
              ]
            }
          ],
          education: [
            {
              degree: 'Bachelor of Science in Information Technology',
              school: 'Washington State University',
              duration: '2015 - 2019',
              details: 'AWS Certified Solutions Architect, Docker Certified Associate'
            }
          ],
          skills: [
            'AWS', 'Azure', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'Terraform', 'Ansible',
            'Linux', 'Bash', 'Python', 'Monitoring Tools', 'Security Best Practices'
          ]
        }
      ]
    },
    
    healthcare: {
      name: 'Healthcare',
      icon: '🏥',
      description: 'Medical, nursing, and healthcare administration',
      examples: [
        {
          title: 'Registered Nurse',
          experience: '6+ years',
          summary: 'Compassionate Registered Nurse with 6+ years of experience in fast-paced emergency department settings. Expertise in patient assessment, medication administration, and interdisciplinary collaboration. Maintained 98% patient satisfaction scores and consistently received excellent performance reviews.',
          experience: [
            {
              role: 'Registered Nurse',
              company: 'City General Hospital',
              location: 'Los Angeles, CA',
              duration: '2018 - Present',
              bullets: [
                'Provided care for 20+ patients daily in Level II trauma center with 95% accuracy in medication administration',
                'Trained and mentored 5 new graduate nurses, improving team efficiency and patient care quality',
                'Implemented new electronic health record system reducing documentation time by 30%',
                'Recognized as Nurse of the Quarter for exceptional patient care and teamwork'
              ]
            }
          ],
          education: [
            {
              degree: 'Bachelor of Science in Nursing',
              school: 'UCLA School of Nursing',
              duration: '2014 - 2018',
              details: 'RN License #RN123456, BLS, ACLS Certified, GPA: 3.7/4.0'
            }
          ],
          skills: [
            'Patient Assessment', 'Medication Administration', 'IV Therapy', 'Wound Care', 'Electronic Health Records',
            'BLS', 'ACLS', 'Patient Education', 'Critical Care', 'Team Collaboration'
          ]
        }
      ]
    },
    
    finance: {
      name: 'Finance',
      icon: '💰',
      description: 'Banking, accounting, and financial services',
      examples: [
        {
          title: 'Financial Analyst',
          experience: '4+ years',
          summary: 'Detail-oriented Financial Analyst with 4+ years of experience in financial modeling, risk assessment, and investment analysis. Proven track record of identifying cost-saving opportunities and improving financial processes by 25%.',
          experience: [
            {
              role: 'Senior Financial Analyst',
              company: 'Global Investment Partners',
              location: 'New York, NY',
              duration: '2020 - Present',
              bullets: [
                'Analyzed financial statements and created models reducing forecasting errors by 30%',
                'Identified $2M in cost savings through process optimization and vendor negotiations',
                'Managed investment portfolio valued at $50M, achieving 15% annual returns',
                'Led cross-functional team implementing new financial reporting system improving efficiency by 40%'
              ]
            }
          ],
          education: [
            {
              degree: 'Master of Business Administration',
              school: 'New York University Stern',
              duration: '2016 - 2018',
              details: 'GPA: 3.8/4.0, Concentration: Finance, CFA Level II Candidate'
            }
          ],
          skills: [
            'Financial Modeling', 'Risk Assessment', 'Investment Analysis', 'Excel', 'Python', 'SQL',
            'Data Analysis', 'Financial Reporting', 'Budget Management', 'Compliance'
          ]
        }
      ]
    },
    
    marketing: {
      name: 'Marketing',
      icon: '📢',
      description: 'Digital marketing, advertising, and brand management',
      examples: [
        {
          title: 'Digital Marketing Manager',
          experience: '5+ years',
          summary: 'Results-driven Digital Marketing Manager with 5+ years of experience developing and executing comprehensive marketing strategies. Expertise in SEO, content marketing, and data analytics. Increased lead generation by 300% and improved conversion rates by 45%.',
          experience: [
            {
              role: 'Digital Marketing Manager',
              company: 'Growth Marketing Agency',
              location: 'Chicago, IL',
              duration: '2019 - Present',
              bullets: [
                'Developed and executed multi-channel marketing campaigns reaching 2M+ target audience',
                'Improved SEO rankings resulting in 150% increase in organic traffic',
                'Managed $500K monthly ad budget with 4.2x ROAS, optimizing spend across platforms',
                'Led team of 5 marketing specialists, implementing A/B testing that improved conversion by 45%'
              ]
            }
          ],
          education: [
            {
              degree: 'Bachelor of Arts in Marketing',
              school: 'Northwestern University',
              duration: '2015 - 2019',
              details: 'Google Analytics Certified, HubSpot Inbound Marketing Certified'
            }
          ],
          skills: [
            'Digital Marketing', 'SEO', 'Content Marketing', 'Social Media Marketing', 'Email Marketing',
            'Google Analytics', 'HubSpot', 'Salesforce', 'Marketing Automation', 'Data Analysis'
          ]
        }
      ]
    },
    
    education: {
      name: 'Education',
      icon: '🎓',
      description: 'Teaching, academic administration, and educational services',
      examples: [
        {
          title: 'High School Mathematics Teacher',
          experience: '7+ years',
          summary: 'Dedicated Mathematics Teacher with 7+ years of experience creating engaging lesson plans and fostering student success. Increased standardized test scores by 25% and implemented innovative teaching methods that improved student engagement by 40%.',
          experience: [
            {
              role: 'Mathematics Teacher',
              company: 'Lincoln High School',
              location: 'Portland, OR',
              duration: '2017 - Present',
              bullets: [
                'Developed and implemented new curriculum increasing student test scores by 25%',
                'Integrated technology into lessons using educational software and interactive tools',
                'Mentored 3 student teachers on best practices for mathematics instruction',
                'Organized math competitions and tutoring programs serving 50+ students annually'
              ]
            }
          ],
          education: [
            {
              degree: 'Master of Education',
              school: 'Portland State University',
              duration: '2015 - 2017',
              details: 'Teaching License #TCH123456, GPA: 3.9/4.0, Mathematics Endorsement'
            }
          ],
          skills: [
            'Curriculum Development', 'Classroom Management', 'Educational Technology', 'Student Assessment',
            'Mathematics Instruction', 'Differentiated Instruction', 'Parent Communication', 'Team Collaboration'
          ]
        }
      ]
    },
    
    sales: {
      name: 'Sales',
      icon: '💼',
      description: 'Sales, business development, and account management',
      examples: [
        {
          title: 'Sales Executive',
          experience: '6+ years',
          summary: 'Top-performing Sales Executive with 6+ years of experience exceeding sales targets and building lasting client relationships. Consistently ranked in top 5% of sales team with 95% client retention rate.',
          experience: [
            {
              role: 'Senior Sales Executive',
              company: 'Enterprise Solutions Inc',
              location: 'Boston, MA',
              duration: '2018 - Present',
              bullets: [
                'Exceeded sales targets by 35% for 4 consecutive quarters',
                'Acquired 50+ new enterprise clients generating $5M in recurring revenue',
                'Maintained 95% client retention rate through exceptional service and relationship building',
                'Led sales team of 8 professionals, increasing team revenue by 40%'
              ]
            }
          ],
          education: [
            {
              degree: 'Bachelor of Business Administration',
              school: 'Boston College',
              duration: '2014 - 2018',
              details: 'Sales Management Certificate, GPA: 3.7/4.0'
            }
          ],
          skills: [
            'Sales Strategy', 'Account Management', 'Business Development', 'Negotiation',
            'CRM Software', 'Sales Analytics', 'Presentation Skills', 'Client Relations'
          ]
        }
      ]
    },
    
    creative: {
      name: 'Creative',
      icon: '🎨',
      description: 'Design, content creation, and creative services',
      examples: [
        {
          title: 'UX/UI Designer',
          experience: '4+ years',
          summary: 'Creative UX/UI Designer with 4+ years of experience designing user-centered digital products. Expertise in user research, wireframing, and creating intuitive interfaces. Improved user engagement by 60% and reduced support tickets by 40%.',
          experience: [
            {
              role: 'Senior UX/UI Designer',
              company: 'Creative Digital Agency',
              location: 'Portland, OR',
              duration: '2020 - Present',
              bullets: [
                'Designed and launched 15+ mobile and web applications with 4.8/5 user rating',
                'Conducted user research and usability testing, improving task completion rates by 60%',
                'Created design system used across 5 products, improving design consistency by 80%',
                'Collaborated with development teams ensuring 100% design implementation accuracy'
              ]
            }
          ],
          education: [
            {
              degree: 'Bachelor of Fine Arts',
              school: 'Pacific Northwest College of Art',
              duration: '2016 - 2020',
              details: 'Adobe Certified Expert, UX Design Certificate'
            }
          ],
          skills: [
            'UX Design', 'UI Design', 'User Research', 'Wireframing', 'Prototyping',
            'Figma', 'Adobe Creative Suite', 'Sketch', 'Design Systems', 'Usability Testing'
          ]
        }
      ]
    }
  },

  // Get examples by industry
  getExamples: function(industry) {
    return this.industries[industry]?.examples || [];
  },

  // Get all industries
  getAllIndustries: function() {
    return Object.keys(this.industries).map(key => ({
      key: key,
      ...this.industries[key]
    }));
  },

  // Search examples
  searchExamples: function(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    Object.keys(this.industries).forEach(industry => {
      const examples = this.industries[industry].examples;
      examples.forEach(example => {
        const searchText = `${example.title} ${example.summary} ${example.experience.join(' ')} ${example.skills.join(' ')}`.toLowerCase();
        if (searchText.includes(lowerQuery)) {
          results.push({
            ...example,
            industry: industry,
            industryName: this.industries[industry].name,
            industryIcon: this.industries[industry].icon
          });
        }
      });
    });
    
    return results;
  },

  // Get example by ID
  getExampleById: function(industry, index) {
    const examples = this.getExamples(industry);
    return examples[index] || null;
  },

  // Apply example to form
  applyExample: function(industry, index) {
    const example = this.getExampleById(industry, index);
    if (!example) return;

    // Clear existing data first
    if (typeof window.resetBtn !== 'undefined') {
      const resetBtn = document.getElementById('resetBtn');
      if (resetBtn) {
        resetBtn.click();
      }
    }

    // Apply example data after a short delay
    setTimeout(() => {
      this.applyExampleData(example);
    }, 500);
  },

  // Apply example data to form fields
  applyExampleData: function(example) {
    // Basic info
    if (example.summary) {
      const summaryField = document.getElementById('summary');
      if (summaryField) {
        summaryField.value = example.summary;
        summaryField.dispatchEvent(new Event('input'));
      }
    }

    // Experience
    if (example.experience && example.experience.length > 0) {
      const addBtn = document.getElementById('expAddBtn');
      if (addBtn) {
        example.experience.forEach((exp, index) => {
          setTimeout(() => {
            addBtn.click();
            // Fill the experience fields
            setTimeout(() => {
              const items = document.querySelectorAll('#experienceList .item');
              const lastItem = items[items.length - 1];
              if (lastItem) {
                this.setFieldValueInContainer(lastItem, '.exp-title', exp.role);
                this.setFieldValueInContainer(lastItem, '.exp-company', exp.company);
                this.setFieldValueInContainer(lastItem, '.exp-location', exp.location);
                this.setFieldValueInContainer(lastItem, '.exp-start', exp.duration.split(' - ')[0]);
                this.setFieldValueInContainer(lastItem, '.exp-end', exp.duration.split(' - ')[1]);
                
                // Add bullets
                exp.bullets.forEach(bullet => {
                  const bulletAddBtn = lastItem.querySelector('[data-act="add-bullet"]');
                  if (bulletAddBtn) {
                    bulletAddBtn.click();
                    const bulletInputs = lastItem.querySelectorAll('.exp-bullet');
                    const lastBullet = bulletInputs[bulletInputs.length - 1];
                    if (lastBullet) {
                      lastBullet.value = bullet;
                      lastBullet.dispatchEvent(new Event('input'));
                    }
                  }
                });
              }
            }, index * 1000);
          });
        }, 500);
      }
    }

    // Education
    if (example.education && example.education.length > 0) {
      const eduAddBtn = document.getElementById('eduAddBtn');
      if (eduAddBtn) {
        example.education.forEach((edu, index) => {
          setTimeout(() => {
            eduAddBtn.click();
            setTimeout(() => {
              const items = document.querySelectorAll('#educationList .item');
              const lastItem = items[items.length - 1];
              if (lastItem) {
                this.setFieldValueInContainer(lastItem, '.edu-degree', edu.degree);
                this.setFieldValueInContainer(lastItem, '.edu-school', edu.school);
                this.setFieldValueInContainer(lastItem, '.edu-location', edu.location);
                this.setFieldValueInContainer(lastItem, '.edu-start', edu.duration.split(' - ')[0]);
                this.setFieldValueInContainer(lastItem, '.edu-end', edu.duration.split(' - ')[1]);
                this.setFieldValueInContainer(lastItem, '.edu-details', edu.details);
              }
            }, index * 1000);
          });
        }, 500);
      }
    }

    // Skills
    if (example.skills && example.skills.length > 0) {
      const skillAddBtn = document.getElementById('skillAddBtn');
      if (skillAddBtn) {
        example.skills.forEach((skill, index) => {
          setTimeout(() => {
            const skillInput = document.querySelector('#skillAddBtn').previousElementSibling;
            if (skillInput) {
              skillInput.value = skill;
              skillInput.dispatchEvent(new Event('input'));
              skillAddBtn.click();
            }
          }, index * 200);
        }, 500);
      }
    }

    // Track example usage
    if (typeof Analytics !== 'undefined') {
      Analytics.trackEvent('resume_example_applied', {
        event_category: 'Resume Examples',
        industry: industry,
        example_title: example.title
      });
    }
  },

  // Helper method to set field value in container
  setFieldValueInContainer: function(container, selector, value) {
    const field = container.querySelector(selector);
    if (field && value) {
      field.value = value;
      field.dispatchEvent(new Event('input'));
    }
  },

  // Initialize examples page
  initExamplesPage: function() {
    this.renderIndustries();
    this.setupSearch();
    this.setupEventListeners();
  },

  // Render industry cards
  renderIndustries: function() {
    const grid = document.getElementById('industryGrid');
    if (!grid) return;

    const industries = this.getAllIndustries();
    
    grid.innerHTML = industries.map(industry => `
      <div class="industry-card" onclick="ResumeExamples.selectIndustry('${industry.key}')">
        <div class="industry-icon">${industry.icon}</div>
        <div class="industry-name">${industry.name}</div>
        <div class="industry-description">${industry.description}</div>
        <div class="industry-stats">
          <div class="stat">
            <div class="stat-number">${industry.examples.length}</div>
            <div class="stat-label">Examples</div>
          </div>
        </div>
      </div>
    `).join('');
  },

  // Setup search functionality
  setupSearch: function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
          this.performSearch(query);
        } else {
          this.showIndustries();
        }
      });

      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch(e.target.value.trim());
        }
      });
    }
  },

  // Perform search
  performSearch: function(query) {
    const results = this.searchExamples(query);
    this.displaySearchResults(results, query);
  },

  // Display search results
  displaySearchResults: function(results, query) {
    const industriesDiv = document.getElementById('industryGrid');
    const searchResultsDiv = document.getElementById('searchResults');
    const searchResultsList = document.getElementById('searchResultsList');
    const examplesDisplay = document.getElementById('examplesDisplay');

    if (results.length === 0) {
      this.showNoResults(query);
      return;
    }

    // Hide industries and show results
    industriesDiv.style.display = 'none';
    searchResultsDiv.style.display = 'block';
    examplesDisplay.style.display = 'none';

    // Group results by industry
    const resultsByIndustry = {};
    results.forEach(result => {
      if (!resultsByIndustry[result.industry]) {
        resultsByIndustry[result.industry] = [];
      }
      resultsByIndustry[result.industry].push(result);
    });

    // Display results
    searchResultsList.innerHTML = Object.keys(resultsByIndustry).map(industry => {
      const industry = this.industries[industry];
      const industryResults = resultsByIndustry[industry];
      
      return `
        <div class="result-item">
          <div class="result-header">
            <div class="result-title">${industryResults[0].title}</div>
            <div class="result-industry">${industry.icon} ${industry.name}</div>
          </div>
          <div class="result-content">${industryResults[0].summary.substring(0, 150)}...</div>
        </div>
      `;
    }).join('');
  },

  // Show no results message
  showNoResults: function(query) {
    const industriesDiv = document.getElementById('industryGrid');
    const searchResultsDiv = document.getElementById('searchResults');
    const searchResultsList = document.getElementById('searchResultsList');

    industriesDiv.style.display = 'none';
    searchResultsDiv.style.display = 'block';
    searchResultsList.innerHTML = `
      <div class="loading">
        <div class="loading-spinner"></div>
        <p>No results found for "${query}"</p>
      </div>
    `;
  },

  // Show industries
  showIndustries: function() {
    document.getElementById('industryGrid').style.display = 'grid';
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('examplesDisplay').style.display = 'block';
  },

  // Select industry
  selectIndustry: function(industry) {
    this.showIndustryExamples(industry);
    
    // Track industry selection
    if (typeof Analytics !== 'undefined') {
      Analytics.trackEvent('industry_selected', {
        event_category: 'Resume Examples',
        industry: industry,
        industry_name: this.industries[industry].name
      });
    }
  },

  // Show examples for selected industry
  showIndustryExamples: function(industry) {
    const examplesDisplay = document.getElementById('examplesDisplay');
    const searchResults = document.getElementById('searchResults');
    
    searchResults.style.display = 'none';
    examplesDisplay.style.display = 'block';

    const examples = this.getExamples(industry);
    
    examplesDisplay.innerHTML = `
      <div class="example-section">
        <h2>
          ${this.industries[industry].icon} ${this.industries[industry].name}
        </h2>
        <div class="example-list">
          ${examples.map((example, index) => `
            <div class="example-card">
              <div class="example-header">
                <div class="example-title">${example.title}</div>
                <div class="example-experience">${example.experience}</div>
              </div>
              <div class="example-actions">
                <button class="btn btn-outline" onclick="ResumeExamples.viewExample('${industry}', ${index}')">
                  View Details
                </button>
                <button class="btn btn-primary" onclick="ResumeExamples.applyExample('${industry}', ${index}')">
                  Use This Template
                </button>
              </div>
              <div class="example-content">
                ${example.summary}
              </div>
              <div class="example-skills">
                ${example.skills.slice(0, 8).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                ${example.skills.length > 8 ? `<span class="skill-tag">+${example.skills.length - 8} more</span>` : ''}
              </div>
            </div>
          </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // View example details
  viewExample: function(industry, index) {
    const example = this.getExampleById(industry, index);
    if (!example) return;

    // Create modal to show full example
    const modal = document.createElement('div');
    modal.className = 'example-modal-overlay';
    modal.innerHTML = `
      <div class="example-modal">
        <div class="example-modal-header">
          <h3>${example.title}</h3>
          <button class="modal-close" onclick="this.parentElement.remove()">&times;</button>
        </div>
        <div class="example-modal-body">
          <div class="example-modal-content">
            <div class="example-section">
              <h4>Summary</h4>
              <p>${example.summary}</p>
            </div>
            
            <div class="example-section">
              <h4>Experience</h4>
              ${example.experience.map(exp => `
                <div class="experience-item">
                  <h5>${exp.role} at ${exp.company}</h5>
                  <div class="experience-meta">${exp.duration} | ${exp.location}</div>
                  <ul>
                    ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
            
            <div class="example-section">
              <h4>Education</h4>
              ${example.education.map(edu => `
                <div class="education-item">
                  <h5>${edu.degree}</h5>
                  <div class="education-meta">${edu.school} | ${edu.duration}</div>
                  ${edu.details ? `<p>${edu.details}</p>` : ''}
                </div>
              `).join('')}
            </div>
            
            <div class="example-section">
              <h4>Skills</h4>
              <div class="skills-list">
                ${example.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="example-modal-footer">
          <button class="btn btn-primary" onclick="this.parentElement.remove()">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Track example view
    if (typeof Analytics !== 'undefined') {
      Analytics.trackEvent('example_viewed', {
        event_category: 'Resume Examples',
        industry: industry,
        example_title: example.title
      });
    }
  },

  // Setup event listeners
  setupEventListeners: function() {
    // Close modal on outside click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('example-modal-overlay')) {
        e.target.remove();
      }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.querySelector('.example-modal-overlay');
        if (modal) {
          modal.remove();
        }
      }
    });
  }
};
