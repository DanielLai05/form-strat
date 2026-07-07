function ConfirmModal({
  open,
  title,
  children,
  confirmLabel = 'Delete',
  busy = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" onClick={busy ? undefined : onCancel}>
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                {title}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
                disabled={busy}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {children}
              {error && <div className="alert alert-danger small mt-3 mb-0">{error}</div>}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={busy}
              >
                {busy ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Deleting…
                  </>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  )
}

export default ConfirmModal
