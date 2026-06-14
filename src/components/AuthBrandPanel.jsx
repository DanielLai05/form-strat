import { Link } from 'react-router-dom'
import logo from '../assets/form-strat-logo-transparent-minimal.png'

/** Left-hand brand panel shown on the login/signup screens (desktop only). */
function AuthBrandPanel() {
  return (
    <div className="auth-brand col-lg-6 d-none d-lg-flex flex-column justify-content-between">
      <Link
        to="/"
        className="d-inline-flex align-items-center gap-2 text-white text-decoration-none"
      >
        <span className="auth-brand-logo">
          <img src={logo} alt="Form Strat logo" />
        </span>
        <span className="fw-bold fs-5">Form Strat</span>
      </Link>

      <h2 className="auth-brand-tagline mb-5">
        Start turning forms into strategy today.
      </h2>
    </div>
  )
}

export default AuthBrandPanel
