# ATS Resume Builder - Quick Reference Guide

## New Modules at a Glance

### Utils (`utils.js`)
```javascript
// Notifications
Utils.showSuccess('Message');      // Green toast, 2.5s
Utils.showError('Message');        // Red toast, 4s
Utils.showWarning('Message');      // Orange toast, 3.5s
Utils.showInfo('Message');         // Blue toast, 3s

// Storage (safe, with quota handling)
Utils.setStorage('key', data);     // Returns: true/false
Utils.getStorage('key', default);  // Returns: data or default
Utils.removeStorage('key');        // Returns: true/false

// Utilities
Utils.debounce(func, 250);         // Delay execution
Utils.throttle(func, 250);         // Limit execution rate
Utils.isValidEmail(email);         // Boolean
Utils.isValidPhone(phone);         // Boolean
Utils.escapeHtml(text);            // Safe HTML
Utils.generateId();                // UUID
Utils.formatDate(date);            // YYYY-MM-DD format
```

### Accessibility (`a11y.js`)
```javascript
// Keyboard shortcuts (built-in)
// Ctrl/Cmd + S: Show save status
// Escape: Close modals
// Alt + B: Focus builder
// Alt + P: Focus preview

// Announcements
A11y.announce('Message', 'polite');     // For changes
A11y.announce('Error!', 'assertive');   // For urgent
```

### Validation (`validation.js`)
```javascript
// Single field
Validator.validateField('emailId', 'email');

// Multiple fields
Validator.validateForm({
  'email': 'email',
  'phone': 'phone',
  'name': 'required'
});

// Resume completeness
const result = Validator.validateResume(state);
if (!result.isValid) {
  Validator.showValidationSummary(result.issues);
}

// Manual error display
Validator.showFieldError('fieldId', 'Custom message');
Validator.clearFieldError('fieldId');
```

### Backup (`data-backup.js`)
```javascript
// Create backup
Backup.createBackup(resumeData, 'Good checkpoint');

// Restore backup
const data = Backup.restoreBackup(backupId);

// Get list
const list = Backup.getBackupList();  // With metadata

// Export/Import
Backup.exportBackups();
Backup.importBackups(jsonFile);
```

### Error Handler (`error-handler.js`)
```javascript
// Automatic - catches all errors

// Manual logging
ErrorHandler.logError(error, { context: 'value' });
ErrorHandler.logWarn('Warning message', { context });

// Export for debugging
ErrorHandler.exportLogs();

// Get summary
const summary = ErrorHandler.getSummary();
// { totalErrors, totalWarnings, recentErrors, recentWarnings }
```

## CSS Classes

### Notifications
```html
<!-- Automatic, use Utils.showSuccess() -->
```

### Validation States
```html
<div class="field field-error">    <!-- Error state -->
<div class="field field-success">  <!-- Success state -->
<div class="field-error-msg">Message</div>
```

### Loading
```html
<div class="loading-overlay">
  <div class="loading-spinner"></div>
  <div class="loading-text">Message</div>
</div>
```

### Accessibility
```html
<a href="#main" class="skip-link">Skip to main</a>
<div id="aria-announcer" role="status" aria-live="polite"></div>
```

## Usage Patterns

### Form Validation
```javascript
// In input event listener
const value = field.value;
if (!Validator.validateField('fieldId', 'email')) {
  return; // Error shown automatically
}
```

### Save with Backup
```javascript
function saveResume(state) {
  const success = Utils.setStorage('resume_key', state);
  if (success) {
    Backup.createBackup(state, 'Auto-save');
    Utils.showSuccess('Saved');
  } else {
    Utils.showError('Failed to save');
  }
}
```

### Handle Errors
```javascript
try {
  // Do something
} catch (error) {
  ErrorHandler.logError(error, { context: 'operation' });
  Utils.showError('Operation failed');
}
```

### Upload with Loading
```javascript
async function exportPDF() {
  Utils.showLoading('Preparing PDF...');
  try {
    await window.print();
    Utils.hideLoading();
    Utils.showSuccess('Export initiated');
  } catch (error) {
    Utils.hideLoading();
    Utils.showError('Export failed');
  }
}
```

## Mobile Breakpoints

```css
/* Desktop (1200px+) */
/* Laptop (1024px - 1199px) */
/* Tablet (768px - 1023px) */
/* Mobile Landscape (600px - 767px) */
/* Mobile Portrait (480px - 599px) */
```

## Accessibility Features

### Keyboard Support
- Tab through fields
- Enter in buttons
- Escape closes modals
- Alt+B / Alt+P shortcuts

### Screen Readers
- ARIA labels on inputs
- Live region announcements
- Error alerts
- Skip links for navigation

### Visual
- Focus indicators (outline)
- Color + icon for errors
- Success + icon for valid
- High contrast mode support

## Error Messages

### Common Patterns
```javascript
// Validation error
'Please enter a valid email address'

// Storage error
'Storage quota exceeded. Please clear some data.'

// Network error
'Failed to export PDF. Please try again.'

// Permission error
'Unable to access system clipboard'
```

## Testing Checklist

- [ ] Toast notifications appear and disappear
- [ ] Form validation provides feedback
- [ ] Backups save without errors
- [ ] Error logs are created on failures
- [ ] Keyboard navigation works
- [ ] Mobile layout adapts at breakpoints
- [ ] Loading states show during operations
- [ ] Analytics track events

## Common Issues

### Toast not appearing?
✅ Make sure `Utils.showSuccess()` is called
✅ Check browser console for errors

### Validation not working?
✅ Ensure field has correct ID
✅ Use correct validation type
✅ Check if field is required

### Backup not loading?
✅ Check if data is in localStorage
✅ Use `Backup.getBackupList()` to debug
✅ Try export/import to test

### Keyboard shortcuts not working?
✅ Check browser console logs
✅ Ensure page has focus
✅ Some browsers may override shortcuts

## Performance Tips

1. **Debounce autosave**: Already done in `persist()`
2. **Limit logs**: ErrorHandler auto-limits to 100
3. **Manage backups**: Only 5 kept at a time
4. **Storage cleanup**: Remove old backups if full

## Best Practices

### When Adding New Features
1. Use Utils for storage operations
2. Add validation with Validator
3. Show feedback with Utils.show*()
4. Log errors with ErrorHandler
5. Backup critical data

### Data Flow
```
User Input 
  ↓
Validation (Validator)
  ↓
Processing
  ↓
Save (Utils.setStorage)
  ↓
Backup (Backup.createBackup)
  ↓
Feedback (Utils.showSuccess)
  ↓
Analytics (if enabled)
```

### Error Handling
```
Try Operation
  ↓
Catch Error
  ↓
Log (ErrorHandler.logError)
  ↓
Show User (Utils.showError)
  ↓
Suggest Action
```

## API Reference

### Module Initialization
All modules auto-initialize on page load. No setup required.

### Global Availability
All modules available as:
- `window.Utils`
- `window.A11y`
- `window.Validator`
- `window.Backup`
- `window.ErrorHandler`

### Integration Points
- **Analytics**: Auto-tracks actions if `window.Analytics` exists
- **Storage**: All modules use Utils.setStorage
- **Logging**: All errors logged via ErrorHandler

## Troubleshooting

### Need to Debug?
```javascript
// Check error logs
ErrorHandler.getSummary();
ErrorHandler.exportLogs();

// Check backups
Backup.getBackupList();

// Check storage
Utils.getStorage('resume_key');

// Check accessibility
A11y.announce('Test message');
```

### Reset Everything
```javascript
// Clear all data
Utils.removeStorage('resume_key');
Backup.backups = [];
ErrorHandler.clearLogs();
```

---

**Quick Links**
- 📖 Full Docs: `IMPROVEMENTS.md`
- 📊 Summary: `ENHANCEMENTS_SUMMARY.md`
- 💬 Questions: Check inline code comments
- 🐛 Bugs: Logged in ErrorHandler automatically
