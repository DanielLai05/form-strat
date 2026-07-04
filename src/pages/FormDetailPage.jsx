import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import { timeAgo } from '../lib/format'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import Toast from '../components/Toast'
import ResponsesTab from '../components/detail/ResponsesTab'
import InsightsTab from '../components/detail/InsightsTab'
import ShareTab from '../components/detail/ShareTab'
import './DashboardPage.css'
import './FormsPage.css'
import './FormDetailPage.css'

const TABS = [
  { key: 'responses', label: 'Responses', icon: 'bi-table' },
  { key: 'insights', label: 'Insights', icon: 'bi-stars' },
  { key: 'share', label: 'Share', icon: 'bi-share' },
]

const publicUrl = (id) => `${window.location.origin}/form/${id}`

// Outer component keys the view on the form id so navigating between two form
// hubs remounts with fresh state (no manual reset needed on id change).
function FormDetailPage() {
  const { id } = useParams()
  return <FormDetailView key={id} id={id} />
}

function FormDetailView({ id }) {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const [form, setForm] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const tab = TABS.some((t) => t.key === params.get('tab'))
    ? params.get('tab')
    : 'responses'
  const setTab = (key) => setParams({ tab: key }, { replace: true })

  useEffect(() => {
    let cancelled = false
    Promise.all([
      apiFetch(`/forms/${id}`),
      apiFetch(`/forms/${id}/submissions`),
    ])
      .then(([formRes, subRes]) => {
        if (cancelled) return
        setForm(formRes.data)
        setSubmissions(subRes.data || [])
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl(id))
      showToast('Link copied to clipboard')
    } catch {
      showToast('Could not copy link')
    }
  }

  const fieldCount = useMemo(
    () => (Array.isArray(form?.fields) ? form.fields.length : 0),
    [form]
  )

  return (
    <div className="dash">
      <DashboardSidebar active="forms" />

      <div className="main">
        <main className="content">
          {loading ? (
            <div className="dash-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading…</span>
              </div>
            </div>
          ) : error || !form ? (
            <div className="empty">
              <div className="art"><i className="bi bi-exclamation-triangle"></i></div>
              <h3>Couldn&apos;t load this form</h3>
              <p>{error || 'The form may have been deleted.'}</p>
              <Link to="/forms" className="btn-primary" style={{ margin: '0 auto' }}>
                <i className="bi bi-arrow-left"></i>Back to forms
              </Link>
            </div>
          ) : (
            <>
              {/* header */}
              <div className="hub-head">
                <Link to="/forms" className="hub-back" title="Back to forms">
                  <i className="bi bi-arrow-left"></i>
                </Link>
                <div className="hub-title">
                  <div className="hub-title-row">
                    <h1>{form.title}</h1>
                    {form.published ? (
                      <span className="status live"><span className="d"></span>Live</span>
                    ) : (
                      <span className="status draft"><span className="d"></span>Draft</span>
                    )}
                  </div>
                  <p className="hub-meta">
                    <b>{submissions.length}</b> {submissions.length === 1 ? 'response' : 'responses'}
                    <span className="dot-sep">·</span>
                    <b>{fieldCount}</b> {fieldCount === 1 ? 'field' : 'fields'}
                    <span className="dot-sep">·</span>
                    updated {timeAgo(form.updatedAt || form.createdAt)}
                  </p>
                </div>
                <div className="hub-actions">
                  {form.published && (
                    <button className="btn-ghost-2" onClick={copyLink}>
                      <i className="bi bi-link-45deg"></i>Copy link
                    </button>
                  )}
                  <button className="btn-primary" onClick={() => navigate(`/builder/${id}`)}>
                    <i className="bi bi-pencil"></i>Edit form
                  </button>
                </div>
              </div>

              {/* tabs */}
              <div className="hub-tabs">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    className={`hub-tab${tab === t.key ? ' active' : ''}`}
                    onClick={() => setTab(t.key)}
                  >
                    <i className={`bi ${t.icon}`}></i>{t.label}
                  </button>
                ))}
              </div>

              {/* panel */}
              {tab === 'responses' && (
                <ResponsesTab form={form} submissions={submissions} onCopyLink={copyLink} />
              )}
              {tab === 'insights' && <InsightsTab formId={id} hasResponses={submissions.length > 0} />}
              {tab === 'share' && (
                <ShareTab form={form} url={publicUrl(id)} onCopyLink={copyLink} />
              )}
            </>
          )}
        </main>
      </div>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  )
}

export default FormDetailPage
