class FormSecurity {
  constructor() {
    this.initializeValidation();
  }

  sanitizeInput(input) {
    if (!input) return '';
    return String(input).replace(/[<>"'&]/g, (char) => {
      const entities = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '&': '&amp;'
      };
      return entities[char];
    });
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateForm(formData) {
    const errors = [];

    // Check required fields presence and content
    const name = formData.get('name');
    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    const email = formData.get('email');
    if (!email || !this.validateEmail(email)) {
      errors.push('Please enter a valid email');
    }

    // Handle both 'message' (contact form) and 'requirements' (quote form)
    const message = formData.get('message');
    const requirements = formData.get('requirements');
    
    if (message && message.trim().length < 10) {
      errors.push('Message must be at least 10 characters');
    }

    if (requirements && requirements.trim().length < 10) {
      errors.push('Requirements description must be at least 10 characters');
    }

    // Check budget if present
    const budget = formData.get('proposed_budget');
    if (formData.has('proposed_budget') && (!budget || budget.trim().length === 0)) {
        errors.push('Please specify a budget range');
    }

    // Check timeline if present
    const timeline = formData.get('timeline');
    if (formData.has('timeline') && (!timeline || timeline === '')) {
        errors.push('Please select a project timeline');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  initializeValidation() {
    // Validation setup complete
  }
}

export default FormSecurity;
