/**
 * Malaysia mobile phone formatting & validation.
 * Format: 01X-XXX XXXX (7 digits after the prefix), except the 011 prefix
 * which carries 8 digits: 011-XXXX XXXX. (015 is not an assigned prefix.)
 */
const MY_MOBILE_PREFIXES = ['010', '011', '012', '013', '014', '016', '017', '018', '019']

export const MY_PHONE_PLACEHOLDER = '012-345 6789'
export const MY_PHONE_HINT = 'Malaysian mobile number, e.g. 012-345 6789'

/** Digits only, with a leading 60 (country code) normalized back to a local 0. */
function digitsOnly(value) {
  let d = (value || '').replace(/\D/g, '')
  if (d.startsWith('60')) d = `0${d.slice(2)}`
  return d
}

/** Reformat raw/partial input into Malaysia mobile style as the user types. */
export function formatMyPhone(value) {
  const d = digitsOnly(value).slice(0, 11) // 011-XXXX XXXX is the longest valid form
  if (!d) return ''
  const prefix = d.slice(0, 3)
  if (d.length <= 3) return prefix

  const midLen = prefix === '011' ? 4 : 3
  const mid = d.slice(3, 3 + midLen)
  const tail = d.slice(3 + midLen)

  return tail ? `${prefix}-${mid} ${tail}` : `${prefix}-${mid}`
}

/** True for a complete, correctly-shaped Malaysian mobile number. */
export function isValidMyPhone(value) {
  const d = digitsOnly(value)
  const prefix = d.slice(0, 3)
  if (!MY_MOBILE_PREFIXES.includes(prefix)) return false
  return d.length === (prefix === '011' ? 11 : 10)
}
