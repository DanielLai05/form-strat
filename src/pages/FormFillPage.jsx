import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import FormRenderer from '../components/form/FormRenderer'
import { fieldKey } from '../lib/fieldTypes'

const isBlank = (v) =>
  v === undefined ||
  v === null ||
  v === '' ||
  (Array.isArray(v) && v.length === 0)

function Shell({ children, bannerUrl }) {
  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card border-0 shadow-sm overflow-hidden">
          {bannerUrl ? (
            <div
              style={{
                height: 150,
                backgroundImage: `url(${bannerUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ) : (
            <div style={{ height: 12, background: 'linear-gradient(120deg,#2563eb,#1d4ed8)' }} />
          )}
          <div className="card-body p-4 p-md-5">{children}</div>
        </div>
        <p className="text-center text-secondary small mt-3 mb-0">
          Powered by <span className="fw-semibold">Form Strat</span>
        </p>
      </div>
    </div>
  )
}

function FormFillPage() {
  const { id } = useParams()

  const [form, setForm] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    apiFetch(`/forms/${id}`, { auth: false })
      .then((res) => setForm(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const missing = (form.fields || []).find(
      (f) => f.required && isBlank(answers[fieldKey(f)])
    )
    if (missing) {
      setError(`Please answer: ${missing.label}`)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await apiFetch(`/forms/${id}/submissions`, {
        method: 'POST',
        auth: false,
        body: { data: answers },
      })
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Shell>
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      </Shell>
    )
  }

  if (!form) {
    return (
      <Shell>
        <h1 className="h4 fw-bold">Form not found</h1>
        <p className="text-secondary mb-0">{error || 'This form doesn’t exist.'}</p>
      </Shell>
    )
  }

  if (!form.published) {
    return (
      <Shell>
        <div className="text-center py-4">
          <i className="bi bi-lock text-secondary" style={{ fontSize: '2.5rem' }}></i>
          <h1 className="h4 fw-bold mt-3">This form isn’t accepting responses</h1>
          <p className="text-secondary mb-0">
            It hasn’t been published yet. Check back later.
          </p>
        </div>
      </Shell>
    )
  }

  if (done) {
    return (
      <Shell bannerUrl={form.bannerUrl}>
        <div className="text-center py-4">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2.5rem' }}></i>
          <h1 className="h4 fw-bold mt-3">Thanks for your response!</h1>
          <p className="text-secondary mb-0">Your answers have been recorded.</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell bannerUrl={form.bannerUrl}>
      <form onSubmit={handleSubmit} noValidate>
        <FormRenderer
          title={form.title}
          description={form.description}
          fields={form.fields}
          answers={answers}
          onAnswer={(k, v) => setAnswers((a) => ({ ...a, [k]: v }))}
        />

        {error && <div className="alert alert-danger small" role="alert">{error}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </Shell>
  )
}

export default FormFillPage
