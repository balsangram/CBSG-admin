/**
 * Validation rules for CBSG Staff Authentication
 */

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // Standard RFC 5322 compatible email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email.trim());
}

export function validateSignIn({ email, password }) {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Staff email address is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid staff email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateOtpCode(code) {
  const errors = {};
  const cleaned = (code || '').replace(/\D/g, '');

  if (!cleaned) {
    errors.code = 'Please enter your 6-digit verification code';
  } else if (cleaned.length !== 6) {
    errors.code = 'Code must be exactly 6 digits';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    cleanedCode: cleaned,
  };
}
