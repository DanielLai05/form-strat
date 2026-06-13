/** "Continue with Google" button (Bootstrap Icons google glyph). */
function GoogleButton({ onClick, disabled, label = 'Continue with Google' }) {
  return (
    <button
      type="button"
      className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
      onClick={onClick}
      disabled={disabled}
    >
      <i className="bi bi-google"></i>
      {label}
    </button>
  )
}

export default GoogleButton
