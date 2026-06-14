import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import PasswordStrength from '../components/PasswordStrength'
import SocialAuthButtons from '../components/SocialAuthButtons'
import { firebaseErrorMessage } from '../lib/firebaseErrors'
import { validatePassword } from '../lib/validation'

function SignupPage() {
  const { signup, loginWithGoogle, isAuthenticated, isConfigured } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const run = async (action) => {
    setError('')
    setSubmitting(true)
    try {
      await action()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(firebaseErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const pwError = validatePassword(password)
    if (pwError) {
      setError(pwError)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    run(() => signup({ name, email, password }))
  }

  return (
    <AuthLayout>
      <h1 className="h3 fw-bold mb-1">Create your account</h1>
      <p className="text-secondary mb-3">Start building smart forms for free.</p>

      {!isConfigured && (
        <div className="alert alert-warning small" role="alert">
          Firebase isn&apos;t configured yet. Add your <code>VITE_FIREBASE_*</code>{' '}
          keys to <code>.env</code> to enable sign-up.
        </div>
      )}
      {error && <div className="alert alert-danger small" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-sm-6">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              id="name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-sm-6">
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
        </div>

        <div className="row g-3 mb-4">
          <div className="col-sm-6">
            <PasswordInput
              className="mb-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            >
              <PasswordStrength value={password} />
            </PasswordInput>
          </div>
          <div className="col-sm-6">
            <PasswordInput
              className="mb-0"
              id="confirmPassword"
              label="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <div className="d-flex align-items-center my-2 text-secondary small">
        <hr className="flex-grow-1" />
        <span className="px-2">OR</span>
        <hr className="flex-grow-1" />
      </div>

      <SocialAuthButtons
        disabled={submitting}
        label="Sign up with Google"
        onGoogle={() => run(loginWithGoogle)}
      />

      <p className="text-secondary small text-center mt-3 mb-0">
        Already have an account?{' '}
        <Link to="/login" className="fw-semibold">Log in</Link>
      </p>
    </AuthLayout>
  )
}

export default SignupPage
