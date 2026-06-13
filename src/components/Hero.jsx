import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'

function Hero() {
  return (
    <header className="hero-section">
      <div className="container">
        <div className="row align-items-center g-5 py-5">
          <div className="col-lg-6 text-center text-lg-start">
            <span className="badge rounded-pill text-bg-light border mb-3">
              <i className="bi bi-stars text-primary me-1"></i>
              Powered by AI
            </span>
            <h1 className="display-4 fw-bold mb-3">
              Build smart forms <span className="text-primary">in seconds</span>
            </h1>
            <p className="lead text-secondary mb-4">
              Form Strat turns a plain-English description into a ready-to-use form,
              then helps you understand every response with AI-powered analytics.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
              <Link to="/builder" className="btn btn-primary btn-lg px-4">
                Get Started Free
              </Link>
              <a href="#features" className="btn btn-outline-secondary btn-lg px-4">
                Explore Features
              </a>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <img src={heroImg} alt="Form Strat preview" className="img-fluid hero-image" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
