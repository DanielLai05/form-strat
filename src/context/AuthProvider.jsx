import { useCallback, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase'
import { AuthContext } from './AuthContext'

/** Map a Firebase user to the lean shape the app uses. */
function mapUser(fbUser) {
  if (!fbUser) return null
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'User'),
    photoURL: fbUser.photoURL || null,
  }
}

const notConfigured = () => {
  throw new Error('Firebase is not configured. Add VITE_FIREBASE_* to your .env.')
}

/**
 * Provides auth state backed by Firebase Authentication. Exposes the same
 * interface the rest of the app already uses, plus `loading` (auth state still
 * resolving) and `loginWithGoogle`.
 */
function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Start "loading" only when Firebase is actually configured; otherwise resolve
  // immediately so public pages render without waiting.
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    // When unconfigured, `loading` already starts false — nothing to subscribe to.
    if (!auth) return undefined
    // Subscribe to Firebase; the callback fires asynchronously with the session.
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(mapUser(fbUser))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = useCallback(async ({ email, password }) => {
    if (!auth) notConfigured()
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const signup = useCallback(async ({ name, email, password }) => {
    if (!auth) notConfigured()
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (name) {
      await updateProfile(cred.user, { displayName: name })
      setUser(mapUser({ ...cred.user, displayName: name }))
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    if (!auth) notConfigured()
    await signInWithPopup(auth, googleProvider)
  }, [])

  const logout = useCallback(async () => {
    if (!auth) return
    await signOut(auth)
  }, [])

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    isConfigured: isFirebaseConfigured,
    login,
    signup,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
