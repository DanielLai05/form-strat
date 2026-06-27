import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/form-strat-logo-transparent-minimal.png'


function NavBar() {
  const [navOpen, setNavOpen] = useState(false)
  const close = () => setNavOpen(false)

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

            <li className="nav-item">
              <Link className="nav-link" to="/login" onClick={close}>Login</Link>
            </li>
            <li className="nav-item ms-lg-2">
              <Link className="btn btn-primary px-3" to="/signup" onClick={close}>
                Sign up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
