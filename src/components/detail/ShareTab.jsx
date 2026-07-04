import { useNavigate } from 'react-router-dom'

function ShareTab({ form, url, onCopyLink }) {
  const navigate = useNavigate()

  return (
    <div className="share-card">
      {!form.published && (
        <div className="share-notice">
          <i className="bi bi-exclamation-triangle"></i>
          <div>
            <b>This form isn&apos;t published.</b> Publish it before sharing — until
            then the link won&apos;t accept responses.
          </div>
        </div>
      )}

      <h4>Public link</h4>
      <p className="hint">Anyone with this link can view and fill out your form.</p>

      <div className="share-url">
        <input value={url} readOnly onFocus={(e) => e.target.select()} />
        <button className="btn-primary" onClick={onCopyLink}>
          <i className="bi bi-link-45deg"></i>Copy
        </button>
      </div>

      <div className="share-row">
        {form.published ? (
          <a className="btn-ghost-2" href={url} target="_blank" rel="noreferrer">
            <i className="bi bi-box-arrow-up-right"></i>Open live form
          </a>
        ) : (
          <button className="btn-primary" onClick={() => navigate(`/builder/${form.id}`)}>
            <i className="bi bi-send"></i>Publish this form
          </button>
        )}
      </div>
    </div>
  )
}

export default ShareTab
