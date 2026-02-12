// Cloud Storage Integration
window.CloudStorage = {
  providers: {
    google: {
      name: 'Google Drive',
      icon: '📁',
      scopes: 'https://www.googleapis.com/auth/drive.file',
      discoveryUrl: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
      uploadUrl: 'https://www.googleapis.com/upload/drive/v3/files',
      filesUrl: 'https://www.googleapis.com/drive/v3/files'
    },
    dropbox: {
      name: 'Dropbox',
      icon: '📦',
      apiUrl: 'https://content.dropboxapi.com/2/files',
      uploadUrl: 'https://content.dropboxapi.com/2/files/upload'
    }
  },

  currentProvider: null,
  isAuthenticated: false,
  _busy: false,

  init: function() {
    this.checkAuthStatus();
    this.addCloudStorageUI();
  },

  // Check authentication status for each provider
  checkAuthStatus: function() {
    Object.keys(this.providers).forEach(provider => {
      this.checkProviderAuth(provider);
    });
  },

  // Check specific provider authentication
  checkProviderAuth: function(provider) {
    const token = localStorage.getItem(`${provider}_token`);
    const expiresAt = localStorage.getItem(`${provider}_token_expires`);
    
    if (token && expiresAt && Date.now() < parseInt(expiresAt)) {
      this.isAuthenticated = true;
      this.currentProvider = provider;
      this.updateUI();
    } else if (expiresAt && Date.now() >= parseInt(expiresAt)) {
      this.logout(provider);
    }
  },

  // Add cloud storage UI to the builder
  addCloudStorageUI: function() {
    const toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;

    const cloudBtn = document.createElement('button');
    cloudBtn.className = 'btn btn-ghost cloud-storage-btn';
    cloudBtn.innerHTML = '☁️ Cloud Storage';
    cloudBtn.onclick = () => this.showCloudModal();
    
    toolbar.appendChild(cloudBtn);
  },

  // Show cloud storage modal
  showCloudModal: function() {
    const existingModal = document.getElementById('cloudModal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'cloudModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>☁️ Cloud Storage</h3>
          <button class="modal-close" onclick="CloudStorage.closeCloudModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="cloud-providers">
            ${Object.keys(this.providers).map(provider => {
              const p = this.providers[provider];
              const isAuthenticated = this.currentProvider === provider;
              return `
                <div class="cloud-provider ${isAuthenticated ? 'authenticated' : ''}" data-provider="${provider}">
                  <div class="provider-header">
                    <span class="provider-icon">${p.icon}</span>
                    <div class="provider-info">
                      <h4>${p.name}</h4>
                      <span class="provider-status">${isAuthenticated ? '✅ Connected' : 'Not connected'}</span>
                    </div>
                  </div>
                  <div class="provider-actions">
                    ${isAuthenticated ? 
                      `<button class="btn btn-sm btn-primary" onclick="CloudStorage.saveToCloud()">Save Resume</button>
                      <button class="btn btn-sm btn-ghost" onclick="CloudStorage.loadFromCloud()">Load Resume</button>
                      <button class="btn btn-sm btn-danger" onclick="CloudStorage.logout('${provider}')">Disconnect</button>` :
                      `<button class="btn btn-sm btn-primary" onclick="CloudStorage.authenticate('${provider}')">Connect</button>`
                    }
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <div id="cloudResults" class="cloud-results" style="display: none;">
            <h4>Cloud Storage Results</h4>
            <div id="cloudResultsContent" class="cloud-results-content"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';
  },

  // Close cloud modal
  closeCloudModal: function() {
    const modal = document.getElementById('cloudModal');
    if (modal) {
      modal.remove();
    }
  },

  // Authenticate with cloud provider
  authenticate: function(provider) {
    const p = this.providers[provider];
    
    if (provider === 'google') {
      this.authenticateGoogle();
    } else if (provider === 'dropbox') {
      this.authenticateDropbox();
    }
  },

  // Authenticate with Google Drive
  authenticateGoogle: function() {
    const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with actual client ID
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
    const scope = encodeURIComponent(this.providers.google.scopes);
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;

    // Open popup for authentication
    const popup = window.open(authUrl, 'google-auth', 'width=500,height=600,scrollbars=yes,resizable=yes');
    
    // Listen for popup close
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        this.checkAuthStatus();
      }
    }, 1000);
  },

  // Authenticate with Dropbox
  authenticateDropbox: function() {
    const appId = 'YOUR_DROPBOX_APP_ID'; // Replace with actual app ID
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/dropbox/callback');
    
    const authUrl = `https://www.dropbox.com/oauth2/authorize?` +
      `client_id=${appId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code`;

    const popup = window.open(authUrl, 'dropbox-auth', 'width=500,height=600,scrollbars=yes,resizable=yes');
    
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        this.checkAuthStatus();
      }
    }, 1000);
  },

  // Handle OAuth callback
  handleAuthCallback: function(provider, code) {
    if (provider === 'google') {
      this.exchangeGoogleCode(code);
    } else if (provider === 'dropbox') {
      this.exchangeDropboxCode(code);
    }
  },

  // Exchange Google authorization code for token
  exchangeGoogleCode: function(code) {
    const clientId = 'YOUR_GOOGLE_CLIENT_ID';
    const clientSecret = 'YOUR_GOOGLE_CLIENT_SECRET';
    const redirectUri = window.location.origin + '/auth/google/callback';

    fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.access_token) {
        const expiresAt = Date.now() + (data.expires_in * 1000);
        localStorage.setItem('google_token', data.access_token);
        localStorage.setItem('google_refresh_token', data.refresh_token);
        localStorage.setItem('google_token_expires', expiresAt.toString());
        this.checkAuthStatus();
        this.showSuccess('Successfully connected to Google Drive!');
      }
    })
    .catch(error => {
      console.error('Google auth error:', error);
      this.showError('Failed to connect to Google Drive');
    });
  },

  // Exchange Dropbox authorization code for token
  exchangeDropboxCode: function(code) {
    const appId = 'YOUR_DROPBOX_APP_ID';
    const appSecret = 'YOUR_DROPBOX_APP_SECRET';

    fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        client_id: appId,
        client_secret: appSecret
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.access_token) {
        localStorage.setItem('dropbox_token', data.access_token);
        this.checkAuthStatus();
        this.showSuccess('Successfully connected to Dropbox!');
      }
    })
    .catch(error => {
      console.error('Dropbox auth error:', error);
      this.showError('Failed to connect to Dropbox');
    });
  },

  // Save resume to cloud storage
  saveToCloud: function() {
    if (!this.currentProvider || !this.isAuthenticated) {
      this.showError('Please connect to a cloud storage provider first');
      return;
    }

    if (this._busy) return;
    this._busy = true;
    this.setModalButtonsDisabled(true);

    const resumeData = this.getResumeData();
    const fileName = `resume_${new Date().toISOString().split('T')[0]}.json`;

    if (this.currentProvider === 'google') {
      this.saveToGoogleDrive(resumeData, fileName);
    } else if (this.currentProvider === 'dropbox') {
      this.saveToDropbox(resumeData, fileName);
    }
  },

  setModalButtonsDisabled: function(disabled) {
    const modal = document.getElementById('cloudModal');
    if (!modal) return;
    modal.querySelectorAll('button').forEach((btn) => {
      btn.disabled = Boolean(disabled);
    });
  },

  // Save to Google Drive
  saveToGoogleDrive: function(data, fileName) {
    const token = localStorage.getItem('google_token');
    const metadata = {
      name: fileName,
      parents: ['appDataFolder']
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    fetch(`${this.providers.google.uploadUrl}?uploadType=multipart&fields=id,name`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: form
    })
    .then(response => response.json())
    .then(result => {
      this.showCloudResult('success', `Resume saved to Google Drive as ${fileName}`);
      
      // Track cloud save
      if (typeof Analytics !== 'undefined') {
        Analytics.trackEvent('cloud_save', {
          event_category: 'Cloud Storage',
          provider: 'google_drive'
        });
      }
    })
    .catch(error => {
      console.error('Google Drive save error:', error);
      this.showCloudResult('error', 'Failed to save to Google Drive');
    })
    .finally(() => {
      this._busy = false;
      this.setModalButtonsDisabled(false);
    });
  },

  // Save to Dropbox
  saveToDropbox: function(data, fileName) {
    const token = localStorage.getItem('dropbox_token');

    fetch(`${this.providers.dropbox.uploadUrl}/${fileName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/octet-stream'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      this.showCloudResult('success', `Resume saved to Dropbox as ${fileName}`);
      
      // Track cloud save
      if (typeof Analytics !== 'undefined') {
        Analytics.trackEvent('cloud_save', {
          event_category: 'Cloud Storage',
          provider: 'dropbox'
        });
      }
    })
    .catch(error => {
      console.error('Dropbox save error:', error);
      this.showCloudResult('error', 'Failed to save to Dropbox');
    })
    .finally(() => {
      this._busy = false;
      this.setModalButtonsDisabled(false);
    });
  },

  // Load resume from cloud storage
  loadFromCloud: function() {
    if (!this.currentProvider || !this.isAuthenticated) {
      this.showError('Please connect to a cloud storage provider first');
      return;
    }

    if (this._busy) return;
    this._busy = true;
    this.setModalButtonsDisabled(true);

    if (this.currentProvider === 'google') {
      this.loadFromGoogleDrive();
    } else if (this.currentProvider === 'dropbox') {
      this.loadFromDropbox();
    }
  },

  // Load from Google Drive
  loadFromGoogleDrive: function() {
    const token = localStorage.getItem('google_token');

    fetch(`${this.providers.google.filesUrl}?q=name contains 'resume_' and trashed=false`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.files && data.files.length > 0) {
        this.showFileList(data.files, 'google');
      } else {
        this.showCloudResult('info', 'No resume files found in Google Drive');
      }
    })
    .catch(error => {
      console.error('Google Drive load error:', error);
      this.showCloudResult('error', 'Failed to load from Google Drive');
    })
    .finally(() => {
      this._busy = false;
      this.setModalButtonsDisabled(false);
    });
  },

  // Load from Dropbox
  loadFromDropbox: function() {
    const token = localStorage.getItem('dropbox_token');

    fetch(`${this.providers.dropbox.apiUrl}?search=resume_`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.matches && data.matches.length > 0) {
        this.showFileList(data.matches, 'dropbox');
      } else {
        this.showCloudResult('info', 'No resume files found in Dropbox');
      }
    })
    .catch(error => {
      console.error('Dropbox load error:', error);
      this.showCloudResult('error', 'Failed to load from Dropbox');
    })
    .finally(() => {
      this._busy = false;
      this.setModalButtonsDisabled(false);
    });
  },

  // Show file list for selection
  showFileList: function(files, provider) {
    const resultsDiv = document.getElementById('cloudResults');
    const contentDiv = document.getElementById('cloudResultsContent');

    const fileListHTML = files.map(file => `
      <div class="cloud-file" data-file-id="${file.id}" data-provider="${provider}">
        <div class="file-info">
          <span class="file-name">${file.name}</span>
          <span class="file-date">${new Date(file.modifiedTime).toLocaleDateString()}</span>
        </div>
        <button class="btn btn-sm btn-primary" onclick="CloudStorage.loadFile('${file.id}', '${provider}')">
          Load
        </button>
      </div>
    `).join('');

    contentDiv.innerHTML = `
      <h5>Select a resume file to load:</h5>
      <div class="file-list">${fileListHTML}</div>
    `;

    resultsDiv.style.display = 'block';
  },

  // Load specific file
  loadFile: function(fileId, provider) {
    if (provider === 'google') {
      this.loadGoogleFile(fileId);
    } else if (provider === 'dropbox') {
      this.loadDropboxFile(fileId);
    }
  },

  // Load Google Drive file
  loadGoogleFile: function(fileId) {
    const token = localStorage.getItem('google_token');

    fetch(`${this.providers.google.filesUrl}/${fileId}?alt=media`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      this.applyResumeData(data);
      this.showCloudResult('success', 'Resume loaded successfully from Google Drive');
      
      // Track cloud load
      if (typeof Analytics !== 'undefined') {
        Analytics.trackEvent('cloud_load', {
          event_category: 'Cloud Storage',
          provider: 'google_drive'
        });
      }
    })
    .catch(error => {
      console.error('Google Drive file load error:', error);
      this.showCloudResult('error', 'Failed to load file from Google Drive');
    });
  },

  // Load Dropbox file
  loadDropboxFile: function(fileId) {
    const token = localStorage.getItem('dropbox_token');

    fetch(`${this.providers.dropbox.apiUrl}/${fileId}/content`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      this.applyResumeData(data);
      this.showCloudResult('success', 'Resume loaded successfully from Dropbox');
      
      // Track cloud load
      if (typeof Analytics !== 'undefined') {
        Analytics.trackEvent('cloud_load', {
          event_category: 'Cloud Storage',
          provider: 'dropbox'
        });
      }
    })
    .catch(error => {
      console.error('Dropbox file load error:', error);
      this.showCloudResult('error', 'Failed to load file from Dropbox');
    });
  },

  // Apply loaded resume data to the form
  applyResumeData: function(data) {
    try {
      const resumeData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Apply to form fields (similar to import functionality)
      if (resumeData.fullName) {
        document.getElementById('fullName').value = resumeData.fullName;
      }
      if (resumeData.headline) {
        document.getElementById('headline').value = resumeData.headline;
      }
      if (resumeData.email) {
        document.getElementById('email').value = resumeData.email;
      }
      if (resumeData.phone) {
        document.getElementById('phone').value = resumeData.phone;
      }
      if (resumeData.summary) {
        document.getElementById('summary').value = resumeData.summary;
      }

      // Trigger input events to update state
      ['fullName', 'headline', 'email', 'phone', 'summary'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          field.dispatchEvent(new Event('input'));
        }
      });

      this.closeCloudModal();
      this.showSuccess('Resume loaded successfully!');
    } catch (error) {
      console.error('Error applying resume data:', error);
      this.showError('Failed to load resume data');
    }
  },

  // Get current resume data
  getResumeData: function() {
    // Use the same data extraction as the import functionality
    if (typeof resumeImporter !== 'undefined') {
      return resumeImporter.getResumeData();
    }
    
    // Fallback data extraction
    return {
      fullName: document.getElementById('fullName')?.value || '',
      headline: document.getElementById('headline')?.value || '',
      email: document.getElementById('email')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      summary: document.getElementById('summary')?.value || '',
      timestamp: new Date().toISOString()
    };
  },

  // Logout from provider
  logout: function(provider) {
    localStorage.removeItem(`${provider}_token`);
    localStorage.removeItem(`${provider}_refresh_token`);
    localStorage.removeItem(`${provider}_token_expires`);
    
    this.currentProvider = null;
    this.isAuthenticated = false;
    this.updateUI();
    this.showSuccess(`Disconnected from ${this.providers[provider].name}`);
  },

  // Update UI based on auth status
  updateUI: function() {
    const modal = document.getElementById('cloudModal');
    if (!modal) return;

    const providers = modal.querySelectorAll('.cloud-provider');
    providers.forEach(p => {
      const providerName = p.getAttribute('data-provider');
      const isAuthenticated = providerName === this.currentProvider;
      
      p.classList.toggle('authenticated', isAuthenticated);
      
      const status = p.querySelector('.provider-status');
      if (status) {
        status.textContent = isAuthenticated ? '✅ Connected' : 'Not connected';
      }
      
      const actions = p.querySelector('.provider-actions');
      if (actions) {
        if (isAuthenticated) {
          actions.innerHTML = `
            <button class="btn btn-sm btn-primary" onclick="CloudStorage.saveToCloud()">Save Resume</button>
            <button class="btn btn-sm btn-ghost" onclick="CloudStorage.loadFromCloud()">Load Resume</button>
            <button class="btn btn-sm btn-danger" onclick="CloudStorage.logout('${providerName}')">Disconnect</button>
          `;
        } else {
          actions.innerHTML = `<button class="btn btn-sm btn-primary" onclick="CloudStorage.authenticate('${providerName}')">Connect</button>`;
        }
      }
    });
  },

  // Show cloud operation result
  showCloudResult: function(type, message) {
    const resultsDiv = document.getElementById('cloudResultsContent');
    if (!resultsDiv) return;

    const className = type === 'error' ? 'cloud-error' : type === 'success' ? 'cloud-success' : 'cloud-info';
    
    resultsDiv.innerHTML = `
      <div class="cloud-result ${className}">
        <div class="result-message">${message}</div>
      </div>
    `;

    document.getElementById('cloudResults').style.display = 'block';
  },

  // Show success message
  showSuccess: function(message) {
    this.showToast(message, 'success');
  },

  // Show error message
  showError: function(message) {
    this.showToast(message, 'error');
  },

  // Show toast notification
  showToast: function(message, type = 'info') {
    // Use PWA toast if available
    if (typeof PWA !== 'undefined') {
      PWA.showToast(message, type);
      return;
    }

    // Fallback toast implementation
    const toast = document.createElement('div');
    toast.className = `cloud-toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? 'var(--ok)' : type === 'error' ? 'var(--danger)' : 'var(--brand)'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: var(--shadow);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
};

// Initialize cloud storage when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  CloudStorage.init();
});
