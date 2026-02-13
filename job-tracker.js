/**
 * Job Application Tracker
 * Track job applications, interviews, and offer status
 */

const JobTracker = (() => {
  const STORAGE_KEY = 'job-applications';

  const STATUS_OPTIONS = [
    { id: 'applied', label: '📤 Applied', color: '#3498db' },
    { id: 'screening', label: '👀 Screening', color: '#f39c12' },
    { id: 'interview', label: '🎤 Interview', color: '#e74c3c' },
    { id: 'offer', label: '🎉 Offer', color: '#27ae60' },
    { id: 'rejected', label: '❌ Rejected', color: '#95a5a6' }
  ];

  /**
   * Create tracker button in toolbar
   */
  function createTrackerButton() {
    const toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;

    const trackerBtn = document.createElement('button');
    trackerBtn.className = 'btn btn-ghost';
    trackerBtn.id = 'job-tracker-btn';
    trackerBtn.innerHTML = '💼 Tracker';
    trackerBtn.setAttribute('aria-label', 'Job application tracker');
    trackerBtn.title = 'Track job applications and interviews';

    trackerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showTracker();
    });

    toolbar.appendChild(trackerBtn);
  }

  /**
   * Show job tracker
   */
  function showTracker() {
    const applications = loadApplications();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content modal-xlarge">
        <div class="modal-header">
          <h2>💼 Job Application Tracker</h2>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <div class="tracker-stats">
            <div class="stat">
              <div class="stat-value">${applications.length}</div>
              <div class="stat-label">Total Apps</div>
            </div>
            <div class="stat">
              <div class="stat-value">${applications.filter(a => a.status === 'interview').length}</div>
              <div class="stat-label">Interviews</div>
            </div>
            <div class="stat">
              <div class="stat-value">${applications.filter(a => a.status === 'offer').length}</div>
              <div class="stat-label">Offers</div>
            </div>
          </div>

          <button class="btn btn-primary" id="add-job-btn" style="margin-bottom: 20px;">➕ Add New Application</button>

          <div id="applications-list" class="applications-list">
            ${applications.length === 0 ? '<p class="muted">No applications tracked yet. Start adding!</p>' : 
              applications.map(app => `
                <div class="application-card" data-app-id="${app.id}">
                  <div class="app-header">
                    <div class="app-title">
                      <h3>${app.company}</h3>
                      <p class="app-position">${app.position}</p>
                    </div>
                    <div class="app-status">
                      <select class="status-select" value="${app.status}">
                        ${STATUS_OPTIONS.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
                      </select>
                    </div>
                  </div>
                  <div class="app-details">
                    <p><strong>Applied:</strong> ${new Date(app.dateApplied).toLocaleDateString()}</p>
                    ${app.notes ? `<p><strong>Notes:</strong> ${app.notes}</p>` : ''}
                    <div class="app-actions">
                      <button class="btn btn-sm btn-ghost edit-app-btn" data-app-id="${app.id}">Edit</button>
                      <button class="btn btn-sm btn-danger delete-app-btn" data-app-id="${app.id}">Delete</button>
                    </div>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="export-tracker">📥 Export CSV</button>
          <button class="btn btn-primary" id="close-tracker">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add new application
    modal.querySelector('#add-job-btn').addEventListener('click', () => {
      showAddApplicationForm(modal);
    });

    // Status change
    modal.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const appId = e.target.closest('.application-card').dataset.appId;
        updateApplicationStatus(appId, e.target.value);
      });
    });

    // Delete
    modal.querySelectorAll('.delete-app-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const appId = btn.dataset.appId;
        deleteApplication(appId);
        btn.closest('.application-card').remove();
        Utils.showSuccess('Application removed');
      });
    });

    // Close
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#close-tracker').addEventListener('click', () => modal.remove());

    // Export
    modal.querySelector('#export-tracker').addEventListener('click', () => {
      exportToCSV(applications);
    });
  }

  /**
   * Show add application form
   */
  function showAddApplicationForm(parentModal) {
    const formModal = document.createElement('div');
    formModal.className = 'modal-overlay active';
    formModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add New Application</h3>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <form id="add-app-form">
            <div class="field">
              <label for="company">Company Name *</label>
              <input type="text" id="company" required placeholder="e.g., Google">
            </div>
            <div class="field">
              <label for="position">Position *</label>
              <input type="text" id="position" required placeholder="e.g., Software Engineer">
            </div>
            <div class="field">
              <label for="date">Date Applied *</label>
              <input type="date" id="date" required>
            </div>
            <div class="field">
              <label for="notes">Notes</label>
              <textarea id="notes" placeholder="Interview scheduled for..., Salary negotiation..., etc."></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" id="save-app-btn">Save Application</button>
        </div>
      </div>
    `;

    document.body.appendChild(formModal);

    formModal.querySelector('.modal-close').addEventListener('click', () => formModal.remove());

    formModal.querySelector('#save-app-btn').addEventListener('click', () => {
      const form = formModal.querySelector('#add-app-form');
      if (!form.checkValidity()) {
        Utils.showError('Please fill in required fields');
        return;
      }

      const app = {
        id: `app-${Date.now()}`,
        company: form.querySelector('#company').value,
        position: form.querySelector('#position').value,
        dateApplied: form.querySelector('#date').value,
        notes: form.querySelector('#notes').value,
        status: 'applied'
      };

      saveApplication(app);
      Utils.showSuccess('Application added!');
      formModal.remove();

      // Refresh parent modal
      parentModal.remove();
      setTimeout(() => showTracker(), 300);
    });

    // Set today's date as default
    formModal.querySelector('#date').valueAsDate = new Date();
  }

  /**
   * Save application to storage
   */
  function saveApplication(app) {
    const apps = loadApplications();
    apps.push(app);
    Utils.setStorage(STORAGE_KEY, JSON.stringify(apps));
  }

  /**
   * Update application status
   */
  function updateApplicationStatus(appId, newStatus) {
    const apps = loadApplications();
    const app = apps.find(a => a.id === appId);
    if (app) {
      app.status = newStatus;
      Utils.setStorage(STORAGE_KEY, JSON.stringify(apps));
    }
  }

  /**
   * Delete application
   */
  function deleteApplication(appId) {
    const apps = loadApplications().filter(a => a.id !== appId);
    Utils.setStorage(STORAGE_KEY, JSON.stringify(apps));
  }

  /**
   * Load applications from storage
   */
  function loadApplications() {
    try {
      return JSON.parse(Utils.getStorage(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  /**
   * Export to CSV
   */
  function exportToCSV(applications) {
    const headers = ['Company', 'Position', 'Date Applied', 'Status', 'Notes'];
    const rows = applications.map(app => [
      app.company,
      app.position,
      new Date(app.dateApplied).toLocaleDateString(),
      STATUS_OPTIONS.find(s => s.id === app.status)?.label || app.status,
      app.notes || ''
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-applications-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    Utils.showSuccess('Applications exported to CSV');
  }

  /**
   * Initialize job tracker
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createTrackerButton);
    } else {
      createTrackerButton();
    }

    console.log('✓ Job Tracker initialized');
  }

  return {
    init
  };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', JobTracker.init);
} else {
  JobTracker.init();
}
