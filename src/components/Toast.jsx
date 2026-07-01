function Toast({ message, onClose }) {
  if (!message) return null
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1090 }}>
      <div className="toast show align-items-center text-bg-dark border-0">
        <div className="d-flex">
          <div className="toast-body">
            <i className="bi bi-check-circle-fill text-success me-2"></i>
            {message}
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  )
}

export default Toast
