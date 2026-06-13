function BuilderPage() {
  return (
    <section className="py-5">
      <div className="container">
        <h1 className="fw-bold mb-2">Form Builder</h1>
        <p className="text-secondary mb-4">
          Describe the form you want and let AI build it for you.
        </p>

        {/* Placeholder UI — not wired to the backend yet. */}
        <div className="card border-0 shadow-sm" style={{ maxWidth: 720 }}>
          <div className="card-body p-4">
            <label htmlFor="prompt" className="form-label fw-semibold">
              What should this form collect?
            </label>
            <textarea
              id="prompt"
              className="form-control mb-3"
              rows="3"
              placeholder="e.g. A job application form for a software engineer role"
              disabled
            ></textarea>
            <button className="btn btn-primary" disabled>
              <i className="bi bi-magic me-1"></i>
              Generate Form
            </button>
            <p className="text-secondary small mt-3 mb-0">
              <i className="bi bi-info-circle me-1"></i>
              Coming soon — this will call the AI generation endpoint.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BuilderPage
