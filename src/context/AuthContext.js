import { createContext } from 'react'

/**
 * Auth context object. The value is provided by AuthProvider and consumed via
 * the useAuth hook. Kept in its own file so the provider component and the hook
 * can each live in single-purpose modules (keeps React Fast Refresh happy).
 */
export const AuthContext = createContext(null)
