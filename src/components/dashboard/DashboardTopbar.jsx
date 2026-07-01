function DashboardTopbar({ search, onSearch, onNewForm, crumb = 'Dashboard' }) {
  return (
    <header className="topbar">
      <div className="crumbs">
        <span>Workspace</span>
        <i className="bi bi-chevron-right"></i>
        <b>{crumb}</b>
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

      <button className="btn-primary" onClick={onNewForm}>
        <i className="bi bi-plus-lg"></i>
        New Form
      </button>
    </header>
  )
}

export default DashboardTopbar
