import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/form-strat-logo-transparent-minimal.png'
import { useAuth } from '../../hooks/useAuth'
import { initials } from '../../lib/format'

const WORKSPACE = [
  { icon: 'bi-grid-1x2', label: 'Dashboard', active: true },
  { icon: 'bi-file-earmark-text', label: 'Forms', badge: true },
  { icon: 'bi-graph-up', label: 'Responses' },
  { icon: 'bi-stars', label: 'AI Insights' },
]

const ACCOUNT = [
  { icon: 'bi-gear', label: 'Settings' },
  { icon: 'bi-question-circle', label: 'Help & support' },
]

function NavItem({ item, formCount }) {
  return (
    <li className="nav-item">
      <span
        className={`nav-link d-flex align-items-center gap-2 ${
          item.active ? 'active' : 'text-white-50'
        }`}
        role="button"
      >
        <i className={`bi ${item.icon}`}></i>
        {item.label}
        {item.badge && formCount > 0 && (
          <span className="badge text-bg-light ms-auto">{formCount}</span>
        )}
      </span>
    </li>
  )
}

function DashboardSidebar({ formCount }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
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
          <NavItem key={item.label} item={item} formCount={formCount} />
        ))}
      </ul>

      <div className="text-uppercase text-secondary fw-bold px-2 mb-1 mt-3" style={{ fontSize: 11, letterSpacing: '.1em' }}>
        Account
      </div>
      <ul className="nav nav-pills flex-column gap-1">
        {ACCOUNT.map((item) => (
          <NavItem key={item.label} item={item} formCount={formCount} />
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
  )
}

export default DashboardSidebar
