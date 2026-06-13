/** Turn a Firebase Auth error into a friendly, user-facing message. */
const MESSAGES = {
  'auth/invalid-email': 'That email address is invalid.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/email-already-in-use': 'An account with that email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
  'auth/cancelled-popup-request': 'Google sign-in was cancelled.',
  'auth/popup-blocked':
    'Your browser blocked the sign-in popup. Allow popups and try again.',
  'auth/network-request-failed':
    'Network error. Check your connection and try again.',
}

export function firebaseErrorMessage(err) {
  if (err?.code && MESSAGES[err.code]) return MESSAGES[err.code]
  if (err?.message) return err.message.replace(/^Firebase:\s*/, '')
  return 'Something went wrong. Please try again.'
}
