import { useState } from 'react'
import { apiFetch } from '../lib/api'

function AiPromptModal({ open, onClose, onGenerated, onStartBlank }) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const generate = async () => {
    if (!prompt.trim()) {
      setError('Describe the form you want to create.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await apiFetch('/ai/generate-form', {
        method: 'POST',
        body: { prompt },
      })
      onGenerated(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-magic me-2 text-primary"></i>Create a form with AI
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label htmlFor="ai-prompt" className="form-label">
                Describe the form you need
              </label>
              <textarea
                id="ai-prompt"
                className="form-control"
                rows="4"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A customer feedback survey with a star rating, what they liked, and an email field"
                disabled={loading}
                autoFocus
              />
              {error && (
                <div className="alert alert-danger small mt-3 mb-0">{error}</div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-link text-secondary text-decoration-none me-auto"
                onClick={onStartBlank}
                disabled={loading}
              >
                Start blank instead
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={generate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Generating…
                  </>
                ) : (
                  <>
                    <i className="bi bi-magic me-1"></i>Generate
                  </>
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

export default AiPromptModal
