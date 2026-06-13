import logo from '../assets/form-strat-logo-transparent-minimal.png'

function Footer() {
  return (
    <footer id="contact" className="border-top py-4">
      <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
        <span className="d-flex align-items-center gap-2 fw-semibold">
          <img src={logo} alt="Form Strat logo" className="brand-logo brand-logo-sm" />
          Form Strat
        </span>
        <span className="text-secondary small">
          © {new Date().getFullYear()} Form Strat. All rights reserved.
        </span>
      </div>
    </footer>
  )
}

export default Footer
