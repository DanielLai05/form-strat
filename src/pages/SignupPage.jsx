import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import PasswordInput from '../components/PasswordInput'
import GoogleButton from '../components/GoogleButton'
import { firebaseErrorMessage } from '../lib/firebaseErrors'

function SignupPage() {
  const { signup, loginWithGoogle, isAuthenticated, isConfigured } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    run(() => signup({ name, email, password }))
  }

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4 p-md-5">
            <h1 className="h3 fw-bold mb-1">Create your account</h1>
            <p className="text-secondary mb-4">Start building smart forms for free.</p>

            {!isConfigured && (
              <div className="alert alert-warning small" role="alert">
                Firebase isn&apos;t configured yet. Add your <code>VITE_FIREBASE_*</code>{' '}
                keys to <code>.env</code> to enable sign-up.
              </div>
            )}

            {error && (
              <div className="alert alert-danger small" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                {submitting ? 'Creating account…' : 'Sign up'}
              </button>
            </form>

            <div className="d-flex align-items-center my-3 text-secondary small">
              <hr className="flex-grow-1" />
              <span className="px-2">or</span>
              <hr className="flex-grow-1" />
            </div>

            <GoogleButton
              disabled={submitting}
              label="Sign up with Google"
              onClick={() => run(loginWithGoogle)}
            />

            <p className="text-secondary small text-center mt-4 mb-0">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignupPage
