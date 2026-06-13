import { Link } from 'react-router-dom'

function DashboardPage() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold mb-0">Your Forms</h1>
          <Link to="/builder" className="btn btn-primary">
            <i className="bi bi-plus-lg me-1"></i>
            New Form
          </Link>
        </div>

        {/* Empty state — not wired to the backend yet. */}
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-inbox text-secondary" style={{ fontSize: '2.5rem' }}></i>
            <h5 className="fw-semibold mt-3">No forms yet</h5>
            <p className="text-secondary mb-3">
              Create your first form to start collecting responses.
            </p>
            <Link to="/builder" className="btn btn-outline-primary">
              Create a form
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
