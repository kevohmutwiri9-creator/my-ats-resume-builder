// Comprehensive validation module
window.Validator = {
  // Validation rules
  rules: {
    email: {
      test: (val) => Utils.isValidEmail(val),
      message: 'Please enter a valid email address (e.g., user@example.com)'
    },
    phone: {
      test: (val) => Utils.isValidPhone(val) || val === '',
      message: 'Please enter a valid phone number (at least 7 digits)'
    },
    url: {
      test: (val) => {
        try {
          new URL(val);
          return true;
        } catch {
          return val === '';
        }
      },
      message: 'Please enter a valid URL (e.g., https://example.com)'
    },
    required: {
      test: (val) => val && val.trim() !== '',
      message: 'This field is required'
    },
    minLength: {
      test: (val, min) => val === '' || val.length >= min,
      message: (min) => `Minimum ${min} characters required`
    },
    maxLength: {
      test: (val, max) => val === '' || val.length <= max,
      message: (max) => `Maximum ${max} characters allowed`
    },
    number: {
      test: (val) => val === '' || !isNaN(val) && val !== '',
      message: 'Please enter a valid number'
    },
    year: {
      test: (val) => {
        if (val === '') return true;
        const year = parseInt(val, 10);
        const currentYear = new Date().getFullYear();
        return year >= 1900 && year <= currentYear + 10;
      },
      message: 'Please enter a valid year'
    }
  },

  // Validate single field
  validateField: function(fieldId, type, customMessage = null) {
    const field = document.getElementById(fieldId);
    if (!field) return true;

    const value = field.value || '';
    const rule = this.rules[type];

    if (!rule) {
      console.warn(`Unknown validation rule: ${type}`);
      return true;
    }

    const isValid = rule.test(value);
    const message = customMessage || (typeof rule.message === 'function' ? rule.message() : rule.message);

    if (!isValid) {
      this.showFieldError(fieldId, message);
      return false;
    } else {
      this.clearFieldError(fieldId);
      return true;
    }
  },

  // Validate multiple fields
  validateForm: function(validationMap) {
    let isValid = true;
    for (const [fieldId, type] of Object.entries(validationMap)) {
      if (!this.validateField(fieldId, type)) {
        isValid = false;
      }
    }
    return isValid;
  },

  // Show field error
  showFieldError: function(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const wrapper = field.parentNode;
    wrapper.classList.add('field-error');
    
    // Remove old error
    const oldError = wrapper.querySelector('.field-error-msg');
    if (oldError) oldError.remove();

    const errorEl = document.createElement('div');
    errorEl.className = 'field-error-msg';
    errorEl.setAttribute('role', 'alert');
    errorEl.textContent = message;
    wrapper.appendChild(errorEl);

    // Announce to screen readers
    if (window.A11y && window.A11y.announce) {
      A11y.announce(`${field.getAttribute('aria-label') || field.name || 'Field'}: ${message}`, 'assertive');
    }
  },

  // Clear field error
  clearFieldError: function(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const wrapper = field.parentNode;
    wrapper.classList.remove('field-error');
    const error = wrapper.querySelector('.field-error-msg');
    if (error) error.remove();
  },

  // Validate resume content
  validateResume: function(state) {
    const issues = [];

    // Check required fields
    if (!state.fullName || state.fullName.trim() === '') {
      issues.push('Full name is required');
    }

    if (!state.email || !Utils.isValidEmail(state.email)) {
      issues.push('Valid email address is required');
    }

    // Check experience
    if (!state.experience || state.experience.length === 0) {
      issues.push('Add at least one experience entry');
    } else {
      state.experience.forEach((exp, i) => {
        if (!exp.role || exp.role.trim() === '') {
          issues.push(`Experience ${i + 1}: Role is required`);
        }
        if (!exp.company || exp.company.trim() === '') {
          issues.push(`Experience ${i + 1}: Company is required`);
        }
      });
    }

    // Check education
    if (!state.education || state.education.length === 0) {
      issues.push('Add at least one education entry');
    }

    // Check skills
    if (!state.skills || state.skills.length === 0) {
      issues.push('Add at least one skill');
    }

    if (issues.length > 0) {
      return {
        isValid: false,
        issues: issues
      };
    }

    return { isValid: true, issues: [] };
  },

  // Show validation summary
  showValidationSummary: function(issues) {
    if (issues.length === 0) {
      Utils.showSuccess('Resume validation passed!');
      return;
    }

    const summary = 'Resume validation issues:\n\n' + 
      issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n');
    
    Utils.showError('Resume has ' + issues.length + ' issue(s)');
    
    // Log issues for debugging
    console.warn('Validation issues:', issues);
  }
};
