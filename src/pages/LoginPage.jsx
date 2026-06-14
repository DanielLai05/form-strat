import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import SocialAuthButtons from '../components/SocialAuthButtons'
import { firebaseErrorMessage } from '../lib/firebaseErrors'

function LoginPage() {
  const { login, loginWithGoogle, resetPassword, isAuthenticated, isConfigured } =
    useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const run = async (action) => {
    setError('')
    setInfo('')
    setSubmitting(true)
    try {
      await action()
      navigate(from, { replace: true })
    } catch (err) {
      setError(firebaseErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    run(() => login({ email, password, remember }))
  }

  const handleForgot = async () => {
    if (!email) {
      setError('Enter your email above first, then click “Forgot password?”.')
      return
    }
    setError('')
    setInfo('')
    try {
      await resetPassword(email)
      setInfo('Password reset email sent — check your inbox.')
    } catch (err) {
      setError(firebaseErrorMessage(err))
    }
  }

  return (
    <AuthLayout>
      <h1 className="h3 fw-bold mb-1">Welcome back</h1>
      <p className="text-secondary mb-4">Log in to your Form Strat account.</p>

      {!isConfigured && (
        <div className="alert alert-warning small" role="alert">
          Firebase isn&apos;t configured yet. Add your <code>VITE_FIREBASE_*</code>{' '}
          keys to <code>.env</code> to enable sign-in.
        </div>
      )}
      {error && <div className="alert alert-danger small" role="alert">{error}</div>}
      {info && <div className="alert alert-success small" role="alert">{info}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="formstrat@gmail.com"
            required
          />
        </div>

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="form-check mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="remember">
              Remember me
            </label>
          </div>
          <button
            type="button"
            className="btn btn-link p-0 small fw-semibold text-decoration-none"
            onClick={handleForgot}
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <div className="d-flex align-items-center my-3 text-secondary small">
        <hr className="flex-grow-1" />
        <span className="px-2">OR</span>
        <hr className="flex-grow-1" />
      </div>

      <SocialAuthButtons disabled={submitting} onGoogle={() => run(loginWithGoogle)} />

      <p className="text-secondary small text-center mt-4 mb-0">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="fw-semibold">Sign up free</Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
