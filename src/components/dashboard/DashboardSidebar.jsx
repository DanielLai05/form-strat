import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/form-strat-logo-transparent-minimal.png'
import { useAuth } from '../../hooks/useAuth'
import { initials } from '../../lib/format'

const WORKSPACE = [
  { key: 'dashboard', icon: 'bi-grid-1x2', label: 'Dashboard', to: '/dashboard' },
  { key: 'forms', icon: 'bi-file-earmark-text', label: 'Forms', to: '/forms', badge: true },
]

function NavItem({ item, formCount, active }) {
  const isActive = active === item.key
  const className = `nav-link d-flex align-items-center gap-2 ${
    isActive ? 'active' : 'text-white-50'
  }`
  const inner = (
    <>
      <i className={`bi ${item.icon}`}></i>
      {item.label}
      {item.badge && formCount > 0 && (
        <span className="badge text-bg-light ms-auto">{formCount}</span>
      )}
    </>
  )
  return (
    <li className="nav-item">
      {item.to ? (
        <Link to={item.to} className={className}>{inner}</Link>
      ) : (
        <span className={className} role="button">{inner}</span>
      )}
    </li>
  )
}

function DashboardSidebar({ formCount, active = 'dashboard' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
    <div className="d-lg-none dash-mobilebar" data-bs-theme="dark">
      <div className="dash-mobilebar-row">
        <Link to="/dashboard" className="d-flex align-items-center gap-2 text-white text-decoration-none">
          <img src={logo} alt="Form Strat logo" width="26" height="26" className="rounded" />
          <span className="fw-bold">Form Strat</span>
        </Link>
        <button
          className="btn btn-link text-white p-1 ms-auto"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'} fs-4`}></i>
        </button>
      </div>
      {menuOpen && (
        <nav className="dash-mobilemenu">
          {WORKSPACE.filter((item) => item.to).map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className={`dash-mobilelink${
                active === item.key || location.pathname === item.to ? ' on' : ''
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
              {item.badge && formCount > 0 && (
                <span className="badge text-bg-light ms-auto">{formCount}</span>
              )}
            </Link>
          ))}
          <div className="dash-mobileuser">
            <span
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
              style={{ width: 30, height: 30, fontSize: 12 }}
            >
              {initials(user?.name || user?.email)}
            </span>
            <span className="text-truncate">{user?.name || 'User'}</span>
            <button
              className="btn btn-sm btn-link text-white-50 ms-auto p-1"
              title="Log out"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </nav>
      )}
    </div>
    <aside
      className="d-none d-lg-flex flex-column bg-dark text-white p-3 vh-100 position-sticky top-0"
      data-bs-theme="dark"
    >
      <Link
        to="/"
        className="d-flex align-items-center gap-2 text-white text-decoration-none px-2 mb-3"
      >
        <img
          src={logo}
          alt="Form Strat logo"
          width="30"
          height="30"
          className="rounded"
        />
        <span className="fw-bold fs-5">Form Strat</span>
      </Link>

      <div className="text-uppercase text-secondary fw-bold px-2 mb-1" style={{ fontSize: 11, letterSpacing: '.1em' }}>
        Workspace
      </div>
      <ul className="nav nav-pills flex-column gap-1">
        {WORKSPACE.map((item) => (
          <NavItem key={item.label} item={item} formCount={formCount} active={active} />
        ))}
      </ul>

      <div className="mt-auto d-flex align-items-center gap-2 p-2 rounded border border-secondary border-opacity-25 bg-white bg-opacity-10">
        <span
          className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
          style={{ width: 34, height: 34, fontSize: 13 }}
        >
          {initials(user?.name || user?.email)}
        </span>
        <div className="lh-sm text-truncate">
          <div className="fw-semibold text-truncate">{user?.name || 'User'}</div>
          <div className="small text-secondary">Free plan</div>
        </div>
        <button
          className="btn btn-sm btn-link text-white-50 ms-auto p-1"
          title="Log out"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </aside>
    </>
  )
}

export default DashboardSidebar
