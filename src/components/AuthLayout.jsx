import AuthBrandPanel from './AuthBrandPanel'

/**
 * Full-screen two-panel shell for the auth pages: the marketing brand panel on
 * the left (desktop) and the page's form content on the right.
 */
function AuthLayout({ children }) {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="row g-0">
          <AuthBrandPanel />
          <div className="auth-form-panel col-lg-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
