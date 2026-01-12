class EmailValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateEmailArray(emails) {
    if (!Array.isArray(emails)) {
      return { valid: false, error: 'Input must be an array' };
    }

    if (emails.length === 0) {
      return { valid: false, error: 'Email array cannot be empty' };
    }

    const invalidEmails = emails.filter(email => !this.validateEmail(email));

    if (invalidEmails.length > 0) {
      return {
        valid: false,
        error: `Invalid email addresses: ${invalidEmails.join(', ')}`,
        invalidEmails
      };
    }

    // Remove duplicates
    const uniqueEmails = [...new Set(emails)];

    return {
      valid: true,
      emails: uniqueEmails,
      total: uniqueEmails.length
    };
  }
}

module.exports = EmailValidator;