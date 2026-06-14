/**
 * Password policy: at least 8 characters, with an uppercase letter, a lowercase
 * letter, and a number. (Firebase enforces a 6-char minimum; this is stricter.)
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

export const PASSWORD_HINT =
  'At least 8 characters, including upper- and lower-case letters and a number.'

/** Returns an error message if the password is invalid, otherwise null. */
export function validatePassword(password) {
  return PASSWORD_REGEX.test(password) ? null : PASSWORD_HINT
}

// Strength levels for the meter (index = score - 1).
const STRENGTH_LEVELS = [
  { label: 'Weak', color: '#dc3545' },
  { label: 'Fair', color: '#fd7e14' },
  { label: 'Good', color: '#0d6efd' },
  { label: 'Strong', color: '#198754' },
]

export const STRENGTH_SEGMENTS = STRENGTH_LEVELS.length

/**
 * Score a password from 1–4 (0 when empty) for the strength meter.
 * Criteria: length ≥ 8, has upper- AND lower-case, has a number, has a symbol.
 */
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' }

  let raw = 0
  if (password.length >= 8) raw++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) raw++
  if (/\d/.test(password)) raw++
  if (/[^A-Za-z0-9]/.test(password)) raw++

  const score = Math.min(Math.max(raw, 1), STRENGTH_SEGMENTS)
  return { score, ...STRENGTH_LEVELS[score - 1] }
}
