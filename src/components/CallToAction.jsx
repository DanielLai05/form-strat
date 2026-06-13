import { Link } from 'react-router-dom'

function CallToAction() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="cta-band text-center text-white p-5 rounded-4">
          <h2 className="fw-bold mb-2">Ready to build your first form?</h2>
          <p className="mb-4 opacity-75">Start for free — no credit card required.</p>
          <Link to="/builder" className="btn btn-light btn-lg px-4 fw-semibold">
            Get Started
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
