// Data backup and recovery system
window.Backup = {
  // Configuration
  config: {
    maxBackups: 5,
    autoBackupInterval: 60000, // 1 minute
    backupKey: 'ats_resume_backups'
  },

  backups: [],
  autoBackupTimer: null,

  // Initialize backup system
  init: function() {
    this.loadBackups();
    this.startAutoBackup();
  },

  // Load backups from storage
  loadBackups: function() {
    const stored = Utils.getStorage(this.config.backupKey, []);
    this.backups = Array.isArray(stored) ? stored : [];
  },

  // Create backup
  createBackup: function(data, label = null) {
    try {
      const backup = {
        id: Utils.generateId(),
        timestamp: new Date().toISOString(),
        label: label || `Backup ${new Date().toLocaleTimeString()}`,
        data: JSON.stringify(data),
        size: JSON.stringify(data).length
      };

      // Add to beginning of backups array
      this.backups.unshift(backup);

      // Keep only max backups
      this.backups = this.backups.slice(0, this.config.maxBackups);

      // Save to storage
      Utils.setStorage(this.config.backupKey, this.backups);
      
      return backup.id;
    } catch (error) {
      console.error('Backup creation error:', error);
      return null;
    }
  },

  // Restore backup
  restoreBackup: function(backupId) {
    try {
      const backup = this.backups.find(b => b.id === backupId);
      if (!backup) {
        Utils.showError('Backup not found');
        return null;
      }

      const data = JSON.parse(backup.data);
      Utils.showSuccess(`Restored: ${backup.label}`);
      return data;
    } catch (error) {
      console.error('Restore error:', error);
      Utils.showError('Failed to restore backup');
      return null;
    }
  },

  // Delete backup
  deleteBackup: function(backupId) {
    try {
      this.backups = this.backups.filter(b => b.id !== backupId);
      Utils.setStorage(this.config.backupKey, this.backups);
      Utils.showSuccess('Backup deleted');
    } catch (error) {
      console.error('Delete error:', error);
    }
  },

  // Start auto backup
  startAutoBackup: function() {
    // Auto backup on beforeunload to save state before leaving
    window.addEventListener('beforeunload', () => {
      if (window.state) {
        this.createBackup(window.state, 'Auto-save before exit');
      }
    });
  },

  // Export all backups as JSON
  exportBackups: function() {
    try {
      const json = JSON.stringify(this.backups, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-backups-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      Utils.showSuccess('Backups exported');
    } catch (error) {
      console.error('Export error:', error);
      Utils.showError('Failed to export backups');
    }
  },

  // Import backups from JSON file
  importBackups: function(file) {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) {
          Utils.showError('Invalid backup file format');
          return;
        }

        this.backups = imported.slice(0, this.config.maxBackups);
        Utils.setStorage(this.config.backupKey, this.backups);
        Utils.showSuccess(`Imported ${this.backups.length} backups`);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Import error:', error);
      Utils.showError('Failed to import backups');
    }
  },

  // Get backup list for UI
  getBackupList: function() {
    return this.backups.map(b => ({
      ...b,
      sizeKb: (b.size / 1024).toFixed(1),
      date: new Date(b.timestamp).toLocaleString()
    }));
  }
};

// Auto-initialize on load
window.addEventListener('load', () => {
  if (window.Backup) {
    Backup.init();
  }
});
