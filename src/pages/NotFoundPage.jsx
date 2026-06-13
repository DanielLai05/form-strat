import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="py-5">
      <div className="container text-center py-5">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h2 className="fw-semibold mb-2">Page not found</h2>
        <p className="text-secondary mb-4">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <i className="bi bi-house me-1"></i>
          Back to home
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
