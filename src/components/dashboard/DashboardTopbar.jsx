import { Link } from 'react-router-dom'

function DashboardTopbar({ search, onSearch }) {
  return (
    <header className="topbar">
      <div className="crumbs">
        <span>Workspace</span>
        <i className="bi bi-chevron-right"></i>
        <b>Dashboard</b>
      </div>

      <div className="search">
        <i className="bi bi-search"></i>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search forms…"
        />
      </div>

      <div className="spacer"></div>

      <button className="icon-btn" title="Notifications">
        <span className="dot"></span>
        <i className="bi bi-bell"></i>
      </button>

      <Link className="btn-primary" to="/builder">
        <i className="bi bi-plus-lg"></i>
        New Form
      </Link>
    </header>
  )
}

export default DashboardTopbar
