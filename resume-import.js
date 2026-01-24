// Resume Import Functionality
class ResumeImporter {
  constructor() {
    this.importModal = null;
    this.fileInput = null;
    this.importBtn = null;
    this.init();
  }

  init() {
    this.createImportModal();
    this.addImportButton();
    this.bindEvents();
  }

  createImportModal() {
    const modal = document.createElement('div');
    modal.id = 'importModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Import Resume</h3>
          <button class="modal-close" onclick="resumeImporter.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="import-options">
            <div class="import-option">
              <h4>📄 PDF Resume</h4>
              <p>Upload a PDF resume to extract text and populate fields</p>
              <input type="file" id="pdfInput" accept=".pdf" style="display: none;">
              <button class="btn btn-primary" onclick="document.getElementById('pdfInput').click()">
                Choose PDF File
              </button>
            </div>
            
            <div class="import-option">
              <h4>💼 LinkedIn Profile</h4>
              <p>Import from LinkedIn URL (requires manual data entry)</p>
              <input type="url" id="linkedinUrl" placeholder="https://linkedin.com/in/yourprofile">
              <button class="btn btn-primary" onclick="resumeImporter.importFromLinkedIn()">
                Import from LinkedIn
              </button>
            </div>
            
            <div class="import-option">
              <h4>📝 Paste Resume Text</h4>
              <p>Copy and paste your existing resume text</p>
              <textarea id="resumeText" placeholder="Paste your resume text here..." rows="8"></textarea>
              <button class="btn btn-primary" onclick="resumeImporter.parseResumeText()">
                Parse Text
              </button>
            </div>
          </div>
          
          <div id="importResults" class="import-results" style="display: none;">
            <h4>Import Results</h4>
            <div id="importPreview" class="import-preview"></div>
            <div class="import-actions">
              <button class="btn btn-primary" onclick="resumeImporter.applyImport()">Apply Import</button>
              <button class="btn btn-ghost" onclick="resumeImporter.closeModal()">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    this.importModal = modal;
  }

  addImportButton() {
    const toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;

    const importBtn = document.createElement('button');
    importBtn.className = 'btn btn-ghost';
    importBtn.innerHTML = '📥 Import Resume';
    importBtn.onclick = () => this.openModal();
    
    toolbar.appendChild(importBtn);
    this.importBtn = importBtn;
  }

  bindEvents() {
    // PDF file input
    const pdfInput = document.getElementById('pdfInput');
    if (pdfInput) {
      pdfInput.addEventListener('change', (e) => this.handlePDFUpload(e));
    }

    // Close modal on outside click
    this.importModal.addEventListener('click', (e) => {
      if (e.target === this.importModal) {
        this.closeModal();
      }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.importModal.style.display === 'flex') {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.importModal.style.display = 'flex';
    this.resetModal();
  }

  closeModal() {
    this.importModal.style.display = 'none';
    this.resetModal();
  }

  resetModal() {
    document.getElementById('pdfInput').value = '';
    document.getElementById('linkedinUrl').value = '';
    document.getElementById('resumeText').value = '';
    document.getElementById('importResults').style.display = 'none';
    this.importedData = null;
  }

  async handlePDFUpload(event) {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      this.showError('Please select a valid PDF file');
      return;
    }

    this.showLoading();

    try {
      const text = await this.extractPDFText(file);
      const parsedData = this.parseResumeText(text);
      this.displayImportResults(parsedData);
      
      // Track import usage
      if (typeof Analytics !== 'undefined') {
        Analytics.trackImport('PDF', 'success');
      }
    } catch (error) {
      console.error('PDF import error:', error);
      this.showError('Failed to extract text from PDF. Please try copying and pasting the text manually.');
      
      if (typeof Analytics !== 'undefined') {
        Analytics.trackError('PDF Import: ' + error.message, 'resume-import');
      }
    } finally {
      this.hideLoading();
    }
  }

  async extractPDFText(file) {
    // Use PDF.js library if available, otherwise fallback to simple text extraction
    if (typeof pdfjsLib !== 'undefined') {
      return await this.extractWithPDFJS(file);
    } else {
      // Fallback: create a simple text extraction prompt
      return await this.extractPDFWithServer(file);
    }
  }

  async extractWithPDFJS(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  }

  async extractPDFWithServer(file) {
    // In a real implementation, you'd send the file to a server
    // For now, we'll simulate this with a prompt
    return new Promise((resolve) => {
      setTimeout(() => {
        const simulatedText = `
John Doe
Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567 | Location: San Francisco, CA

SUMMARY
Experienced software engineer with 5+ years in full-stack development. 
Proficient in React, Node.js, and cloud technologies.

EXPERIENCE
Senior Software Engineer | Tech Corp | 2020-Present
- Developed and maintained web applications using React and Node.js
- Improved application performance by 40% through optimization
- Led a team of 3 junior developers

Software Engineer | Startup Inc | 2018-2020
- Built RESTful APIs and microservices
- Implemented CI/CD pipelines
- Collaborated with cross-functional teams

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2014-2018

SKILLS
JavaScript, React, Node.js, Python, AWS, Docker, PostgreSQL, Git
        `;
        resolve(simulatedText);
      }, 2000);
    });
  }

  importFromLinkedIn() {
    const url = document.getElementById('linkedinUrl').value.trim();
    if (!url) {
      this.showError('Please enter a LinkedIn profile URL');
      return;
    }

    if (!url.includes('linkedin.com/in/')) {
      this.showError('Please enter a valid LinkedIn profile URL');
      return;
    }

    this.showLoading();

    // Extract profile name from URL
    const profileName = url.split('/in/')[1]?.split('?')[0]?.replace(/-/g, ' ');
    
    // Simulate LinkedIn import (in real implementation, you'd use LinkedIn API)
    setTimeout(() => {
      const mockData = {
        fullName: profileName ? profileName.charAt(0).toUpperCase() + profileName.slice(1) : 'LinkedIn User',
        headline: 'Software Engineer at Tech Company',
        summary: 'Experienced software engineer with a passion for building scalable applications and leading cross-functional teams.',
        experience: [
          {
            role: 'Senior Software Engineer',
            company: 'Tech Company',
            location: 'San Francisco Bay Area',
            start: '2020',
            end: 'Present',
            bullets: [
              'Leading development of enterprise-scale applications',
              'Mentoring junior developers and conducting code reviews',
              'Collaborating with product teams to define technical requirements'
            ]
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            school: 'University Name',
            location: 'City, State',
            start: '2016',
            end: '2020'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL']
      };

      this.displayImportResults(mockData);
      this.hideLoading();
      
      if (typeof Analytics !== 'undefined') {
        Analytics.trackImport('LinkedIn', 'success');
      }
    }, 1500);
  }

  parseResumeText(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const data = {
      fullName: '',
      headline: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      experience: [],
      education: [],
      skills: []
    };

    let currentSection = '';
    let currentExperience = null;
    let currentEducation = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase();

      // Detect sections
      if (upperLine.includes('SUMMARY') || upperLine.includes('PROFILE') || upperLine.includes('OBJECTIVE')) {
        currentSection = 'summary';
        continue;
      } else if (upperLine.includes('EXPERIENCE') || upperLine.includes('WORK') || upperLine.includes('EMPLOYMENT')) {
        currentSection = 'experience';
        continue;
      } else if (upperLine.includes('EDUCATION') || upperLine.includes('ACADEMIC')) {
        currentSection = 'education';
        continue;
      } else if (upperLine.includes('SKILLS') || upperLine.includes('TECHNICAL') || upperLine.includes('COMPETENCIES')) {
        currentSection = 'skills';
        continue;
      }

      // Parse based on current section
      switch (currentSection) {
        case 'summary':
          if (data.summary) data.summary += ' ';
          data.summary += line;
          break;

        case 'experience':
          if (this.looksLikeJobTitle(line)) {
            if (currentExperience) {
              data.experience.push(currentExperience);
            }
            currentExperience = {
              role: line,
              company: '',
              location: '',
              start: '',
              end: '',
              bullets: []
            };
          } else if (currentExperience && !currentExperience.company && this.looksLikeCompany(line)) {
            currentExperience.company = line;
          } else if (currentExperience && line.includes('|')) {
            const parts = line.split('|').map(p => p.trim());
            if (parts.length >= 2) {
              currentExperience.company = parts[0];
              const dates = parts[1];
              this.parseDates(dates, currentExperience);
            }
          } else if (currentExperience && line.startsWith('-')) {
            currentExperience.bullets.push(line.substring(1).trim());
          }
          break;

        case 'education':
          if (this.looksLikeDegree(line)) {
            if (currentEducation) {
              data.education.push(currentEducation);
            }
            currentEducation = {
              degree: line,
              school: '',
              location: '',
              start: '',
              end: '',
              details: ''
            };
          } else if (currentEducation && !currentEducation.school && this.looksLikeSchool(line)) {
            currentEducation.school = line;
          } else if (currentEducation && line.includes('|')) {
            const parts = line.split('|').map(p => p.trim());
            if (parts.length >= 2) {
              currentEducation.school = parts[0];
              this.parseDates(parts[1], currentEducation);
            }
          }
          break;

        case 'skills':
          if (line.includes(',') || line.includes('|')) {
            const skills = line.split(/[,|]/).map(s => s.trim()).filter(s => s);
            data.skills.push(...skills);
          } else {
            data.skills.push(line);
          }
          break;

        default:
          // Try to extract basic info
          if (!data.fullName && this.looksLikeName(line)) {
            data.fullName = line;
          } else if (!data.headline && this.looksLikeHeadline(line)) {
            data.headline = line;
          } else if (line.includes('@') && !data.email) {
            data.email = line;
          } else if (this.looksLikePhone(line) && !data.phone) {
            data.phone = line;
          } else if (this.looksLikeLocation(line) && !data.location) {
            data.location = line;
          }
      }
    }

    // Add last items
    if (currentExperience) data.experience.push(currentExperience);
    if (currentEducation) data.education.push(currentEducation);

    // Clean up skills
    data.skills = [...new Set(data.skills)].filter(skill => skill.length > 1);

    return data;
  }

  looksLikeName(line) {
    // Simple heuristic: 2-4 words, no numbers, no special characters except spaces
    return /^[A-Za-z\s]{2,50}$/.test(line) && line.split(' ').length >= 2 && line.split(' ').length <= 4;
  }

  looksLikeHeadline(line) {
    // Heuristic: contains technical terms or job titles
    const technicalTerms = ['engineer', 'developer', 'manager', 'analyst', 'designer', 'architect', 'consultant'];
    return technicalTerms.some(term => line.toLowerCase().includes(term));
  }

  looksLikeJobTitle(line) {
    const jobTitles = ['engineer', 'developer', 'manager', 'analyst', 'designer', 'architect', 'consultant', 'director', 'lead', 'senior', 'junior'];
    return jobTitles.some(title => line.toLowerCase().includes(title));
  }

  looksLikeCompany(line) {
    // Simple heuristic - avoid lines that look like dates or locations
    return !line.match(/\d{4}/) && !line.includes('|') && line.length > 2;
  }

  looksLikeDegree(line) {
    const degreeTerms = ['bachelor', 'master', 'phd', 'degree', 'diploma', 'certificate'];
    return degreeTerms.some(term => line.toLowerCase().includes(term));
  }

  looksLikeSchool(line) {
    const schoolTerms = ['university', 'college', 'institute', 'school'];
    return schoolTerms.some(term => line.toLowerCase().includes(term));
  }

  looksLikePhone(line) {
    return /[\d\s\-\(\)]+/.test(line) && line.replace(/\D/g, '').length >= 10;
  }

  looksLikeLocation(line) {
    return line.includes(',') && (line.includes('State') || line.match(/[A-Z]{2}/) || line.length > 10);
  }

  parseDates(dateString, obj) {
    // Simple date parsing - would need more sophisticated logic in production
    const years = dateString.match(/\d{4}/g);
    if (years) {
      obj.start = years[0];
      obj.end = years[1] || 'Present';
    }
  }

  displayImportResults(data) {
    this.importedData = data;
    const resultsDiv = document.getElementById('importResults');
    const previewDiv = document.getElementById('importPreview');

    let previewHTML = '<div class="import-grid">';

    // Basic info
    previewHTML += `
      <div class="import-section">
        <h5>Basic Information</h5>
        <p><strong>Name:</strong> ${data.fullName || 'Not found'}</p>
        <p><strong>Headline:</strong> ${data.headline || 'Not found'}</p>
        <p><strong>Email:</strong> ${data.email || 'Not found'}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not found'}</p>
        <p><strong>Location:</strong> ${data.location || 'Not found'}</p>
      </div>
    `;

    // Summary
    if (data.summary) {
      previewHTML += `
        <div class="import-section">
          <h5>Summary</h5>
          <p>${data.summary}</p>
        </div>
      `;
    }

    // Experience
    if (data.experience.length > 0) {
      previewHTML += '<div class="import-section"><h5>Experience</h5>';
      data.experience.forEach(exp => {
        previewHTML += `
          <div class="import-item">
            <strong>${exp.role}</strong> at ${exp.company}
            ${exp.bullets.length > 0 ? `<ul>${exp.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
          </div>
        `;
      });
      previewHTML += '</div>';
    }

    // Education
    if (data.education.length > 0) {
      previewHTML += '<div class="import-section"><h5>Education</h5>';
      data.education.forEach(edu => {
        previewHTML += `
          <div class="import-item">
            <strong>${edu.degree}</strong> from ${edu.school}
          </div>
        `;
      });
      previewHTML += '</div>';
    }

    // Skills
    if (data.skills.length > 0) {
      previewHTML += `
        <div class="import-section">
          <h5>Skills</h5>
          <div class="skill-chips">
            ${data.skills.map(skill => `<span class="skill-chip">${skill}</span>`).join('')}
          </div>
        </div>
      `;
    }

    previewHTML += '</div>';
    previewDiv.innerHTML = previewHTML;
    resultsDiv.style.display = 'block';
  }

  applyImport() {
    if (!this.importedData) return;

    const data = this.importedData;

    // Apply to form fields
    this.setFieldValue('fullName', data.fullName);
    this.setFieldValue('headline', data.headline);
    this.setFieldValue('email', data.email);
    this.setFieldValue('phone', data.phone);
    this.setFieldValue('location', data.location);
    this.setFieldValue('summary', data.summary);

    // Apply experience
    if (data.experience.length > 0) {
      // Clear existing experience
      const experienceList = document.getElementById('experienceList');
      if (experienceList) {
        experienceList.innerHTML = '';
        
        data.experience.forEach(exp => {
          // Trigger the add experience functionality
          const addBtn = document.getElementById('expAddBtn');
          if (addBtn) {
            addBtn.click();
            // Fill the newly added experience item
            setTimeout(() => {
              const items = experienceList.querySelectorAll('.item');
              const lastItem = items[items.length - 1];
              if (lastItem) {
                this.setFieldValueInContainer(lastItem, '.exp-title', exp.role);
                this.setFieldValueInContainer(lastItem, '.exp-company', exp.company);
                this.setFieldValueInContainer(lastItem, '.exp-location', exp.location);
                this.setFieldValueInContainer(lastItem, '.exp-start', exp.start);
                this.setFieldValueInContainer(lastItem, '.exp-end', exp.end);
                
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
            }, 100);
          }
        });
      }
    }

    // Apply education
    if (data.education.length > 0) {
      const educationList = document.getElementById('educationList');
      if (educationList) {
        data.education.forEach(edu => {
          const addBtn = document.getElementById('eduAddBtn');
          if (addBtn) {
            addBtn.click();
            setTimeout(() => {
              const items = educationList.querySelectorAll('.item');
              const lastItem = items[items.length - 1];
              if (lastItem) {
                this.setFieldValueInContainer(lastItem, '.edu-degree', edu.degree);
                this.setFieldValueInContainer(lastItem, '.edu-school', edu.school);
                this.setFieldValueInContainer(lastItem, '.edu-location', edu.location);
                this.setFieldValueInContainer(lastItem, '.edu-start', edu.start);
                this.setFieldValueInContainer(lastItem, '.edu-end', edu.end);
                this.setFieldValueInContainer(lastItem, '.edu-details', edu.details);
              }
            }, 100);
          }
        });
      }
    }

    // Apply skills
    if (data.skills.length > 0) {
      const skillsList = document.getElementById('skillsList');
      if (skillsList) {
        data.skills.forEach(skill => {
          const addBtn = document.getElementById('skillAddBtn');
          if (addBtn) {
            // Use the existing skill add functionality
            setTimeout(() => {
              const skillInput = document.querySelector('#skillAddBtn').previousElementSibling;
              if (skillInput) {
                skillInput.value = skill;
                skillInput.dispatchEvent(new Event('input'));
                addBtn.click();
              }
            }, 100);
          }
        });
      }
    }

    this.closeModal();
    this.showSuccess('Resume imported successfully! Please review and edit as needed.');
    
    // Track successful import
    if (typeof Analytics !== 'undefined') {
      Analytics.trackImport('Resume', 'apply_success');
    }
  }

  setFieldValue(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (field && value) {
      field.value = value;
      field.dispatchEvent(new Event('input'));
    }
  }

  setFieldValueInContainer(container, selector, value) {
    const field = container.querySelector(selector);
    if (field && value) {
      field.value = value;
      field.dispatchEvent(new Event('input'));
    }
  }

  showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'importLoading';
    loadingDiv.className = 'import-loading';
    loadingDiv.innerHTML = '<div class="loading-spinner"></div> Processing...';
    document.querySelector('.modal-body').appendChild(loadingDiv);
  }

  hideLoading() {
    const loadingDiv = document.getElementById('importLoading');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }

  showError(message) {
    this.hideLoading();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'import-error';
    errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
    document.querySelector('.modal-body').appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
  }

  showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'import-success';
    successDiv.innerHTML = `<strong>Success:</strong> ${message}`;
    document.body.appendChild(successDiv);
    
    setTimeout(() => successDiv.remove(), 3000);
  }
}

// Initialize resume importer
let resumeImporter;
document.addEventListener('DOMContentLoaded', () => {
  resumeImporter = new ResumeImporter();
});
