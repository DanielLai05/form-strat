import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/form-strat-logo-transparent-minimal.png'
import { useAuth } from '../hooks/useAuth'

function NavBar() {
  const [navOpen, setNavOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const close = () => setNavOpen(false)

  const handleLogout = () => {
    close()
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container">
        <Link
          to="/"
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          onClick={close}
        >
          <img src={logo} alt="Form Strat logo" className="brand-logo" />
          Form Strat
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${navOpen ? ' show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <a className="nav-link" href="/#features" onClick={close}>Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#how-it-works" onClick={close}>How it works</a>
            </li>

            <li className="nav-item d-none d-lg-flex align-items-center mx-2" aria-hidden="true">
              <span className="vr"></span>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard" onClick={close}>Dashboard</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-primary px-3" to="/builder" onClick={close}>
                    <i className="bi bi-plus-lg me-1"></i>New Form
                  </Link>
                </li>
                <li className="nav-item ms-lg-2 d-flex align-items-center">
                  <span className="navbar-text me-2 d-none d-lg-inline">
                    Hi, {user.name}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={close}>Login</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-primary px-3" to="/signup" onClick={close}>
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
