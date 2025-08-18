// src/utils/validators.ts

/**
 * Checks if a string is a valid email format using a common regex.
 * @param email The string to validate.
 * @returns True if the email is valid, false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  // A commonly used regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if a password meets specified strength criteria.
 * @param password The password string to validate.
 * @param options Configuration for password strength (min length, required chars).
 * @returns An object with a boolean `isValid` and a string `message` if invalid.
 */
export const isStrongPassword = (
  password: string,
  options?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireDigit?: boolean;
    requireSpecialChar?: boolean;
  }
): { isValid: boolean; message: string } => {
  const opts = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireDigit: true,
    requireSpecialChar: true,
    ...options,
  };

  if (!password) {
    return { isValid: false, message: 'Password cannot be empty.' };
  }

  if (password.length < opts.minLength) {
    return { isValid: false, message: `Password must be at least ${opts.minLength} characters long.` };
  }
  if (opts.requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (opts.requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (opts.requireDigit && !/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one digit.' };
  }
  if (opts.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character.' };
  }

  return { isValid: true, message: 'Password is strong.' };
};

/**
 * Checks if a value is not empty (null, undefined, empty string, or empty array).
 * @param value The value to check.
 * @returns True if the value is not empty, false otherwise.
 */
export const isRequired = (value: string | number | boolean | unknown[] | null | undefined): boolean => {
  if (value === null || typeof value === 'undefined') {
    return false;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  return true;
};

/**
 * Checks if two values are identical. Useful for password confirmation.
 * @param value1 The first value.
 * @param value2 The second value.
 * @returns True if values match, false otherwise.
 */
export const isMatching = (value1: string, value2: string): boolean => {
  return value1 === value2;
};

/**
 * Checks if a string or array has a minimum required length.
 * @param value The string or array to check.
 * @param minLength The minimum required length.
 * @returns True if the length meets or exceeds the minimum, false otherwise.
 */
export const isMinLength = (value: string | unknown[], minLength: number): boolean => {
  if (!isRequired(value)) return false; // An empty value doesn't meet min length
  return value.length >= minLength;
};

/**
 * Checks if a string or array exceeds a maximum allowed length.
 * @param value The string or array to check.
 * @param maxLength The maximum allowed length.
 * @returns True if the length is within or at the maximum, false otherwise.
 */
export const isMaxLength = (value: string | unknown[], maxLength: number): boolean => {
  if (!isRequired(value)) return true; // An empty value is always within max length
  return value.length <= maxLength;
};

/**
 * Checks if a number falls within a specified range (inclusive).
 * @param value The number to check.
 * @param min The minimum allowed value.
 * @param max The maximum allowed value.
 * @returns True if the number is within the range, false otherwise.
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  if (typeof value !== 'number' || isNaN(value)) {
    return false;
  }
  return value >= min && value <= max;
};

// Example of a combined validator for a field
export const validateUsername = (username: string): { isValid: boolean; message: string } => {
    if (!isRequired(username)) {
        return { isValid: false, message: 'Username is required.' };
    }
    if (!isMinLength(username, 3)) {
        return { isValid: false, message: 'Username must be at least 3 characters.' };
    }
    if (!isMaxLength(username, 20)) {
        return { isValid: false, message: 'Username cannot exceed 20 characters.' };
    }
    // You could add more specific rules, e.g., no spaces, alphanumeric only
    if (/\s/.test(username)) {
        return { isValid: false, message: 'Username cannot contain spaces.' };
    }
    return { isValid: true, message: 'Username is valid.' };
};