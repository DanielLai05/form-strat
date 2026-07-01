import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import { timeAgo } from '../lib/format'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import DashboardTopbar from '../components/dashboard/DashboardTopbar'
import AiPromptModal from '../components/AiPromptModal'
import Toast from '../components/Toast'
import './DashboardPage.css'
import './FormsPage.css'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'drafts', label: 'Drafts' },
]

function RowActions({ form, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className="row-menu" ref={ref}>
      <button
        className="ra"
        title="Actions"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
      >
        <i className="bi bi-three-dots-vertical"></i>
      </button>
      {open && (
        <div className="menu">
          {form.published && (
            <a
              className="menu-item"
              href={`/form/${form.id}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >
              <i className="bi bi-box-arrow-up-right"></i>Open live form
            </a>
          )}
          <button className="menu-item" onClick={() => { setOpen(false); onEdit() }}>
            <i className="bi bi-pencil"></i>Edit
          </button>
          <button className="menu-item danger" onClick={() => { setOpen(false); onDelete() }}>
            <i className="bi bi-trash"></i>Delete
          </button>
        </div>
      )}
    </div>
  )
}

function FormsPage() {
  const navigate = useNavigate()

  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [aiOpen, setAiOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let cancelled = false
    apiFetch('/forms')
      .then((res) => {
        if (!cancelled) setForms(res.data || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }

  const counts = useMemo(
    () => ({
      all: forms.length,
      live: forms.filter((f) => f.published).length,
      drafts: forms.filter((f) => !f.published).length,
    }),
    [forms]
  )

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return forms.filter((f) => {
      if (tab === 'live' && !f.published) return false
      if (tab === 'drafts' && f.published) return false
      if (!q) return true
      return (
        f.title?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q)
      )
    })
  }, [forms, tab, search])

  const handleGenerated = (data) => {
    setAiOpen(false)
    navigate('/builder', { state: { generated: data } })
  }
  const startBlank = () => {
    setAiOpen(false)
    navigate('/builder')
  }

  const deleteOne = async (id) => {
    if (!window.confirm('Delete this form? This cannot be undone.')) return
    try {
      await apiFetch(`/forms/${id}`, { method: 'DELETE' })
      setForms((f) => f.filter((x) => x.id !== id))
      showToast('Form deleted')
    } catch (err) {
      alert(`Couldn't delete: ${err.message}`)
    }
  }

  return (
    <div className="dash">
      <DashboardSidebar active="forms" formCount={forms.length} />

      <div className="main">
        <DashboardTopbar
          crumb="Forms"
          search={search}
          onSearch={setSearch}
          onNewForm={() => setAiOpen(true)}
        />

        <main className="content">
          <div className="page-head">
            <div>
              <h1>Forms</h1>
              <p>Manage every form in your workspace.</p>
            </div>
          </div>

          {error && (
            <div className="empty" style={{ marginBottom: 24 }}>
              <h3>Couldn&apos;t load forms</h3>
              <p>{error}</p>
            </div>
          )}

          <div className="toolbar">
            <div className="tabs">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`tab${tab === t.key ? ' active' : ''}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}<span className="ct">{counts[t.key]}</span>
                </button>
              ))}
            </div>
            <div className="spacer"></div>
          </div>

          {loading ? (
            <div className="dash-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading…</span>
              </div>
            </div>
          ) : forms.length === 0 ? (
            <div className="empty">
              <div className="art"><i className="bi bi-inbox"></i></div>
              <h3>No forms yet</h3>
              <p>Create your first form to start collecting responses.</p>
              <button className="btn-primary" style={{ margin: '0 auto' }} onClick={() => setAiOpen(true)}>
                <i className="bi bi-plus-lg"></i>Create a form
              </button>
            </div>
          ) : (
            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Form</th>
                    <th>Status</th>
                    <th>Responses</th>
                    <th className="col-hide">Fields</th>
                    <th className="col-hide">Last edited</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((form) => {
                    const responses = form.submissionCount ?? 0
                    const fieldCount = Array.isArray(form.fields) ? form.fields.length : 0
                    return (
                      <tr key={form.id} onClick={() => navigate(`/builder/${form.id}`)}>
                        <td>
                          <div className="ft">
                            <b>{form.title}</b>
                            {form.description && <span>{form.description}</span>}
                          </div>
                        </td>
                        <td>
                          {form.published ? (
                            <span className="status live"><span className="d"></span>Live</span>
                          ) : (
                            <span className="status draft"><span className="d"></span>Draft</span>
                          )}
                        </td>
                        <td>
                          <span className="resp" style={responses ? undefined : { color: 'var(--faint)' }}>
                            {responses}
                          </span>
                        </td>
                        <td className="col-hide">{fieldCount}</td>
                        <td className="col-hide muted-cell">
                          {timeAgo(form.updatedAt || form.createdAt)}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="row-actions">
                            <RowActions
                              form={form}
                              onEdit={() => navigate(`/builder/${form.id}`)}
                              onDelete={() => deleteOne(form.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {visible.length === 0 && (
                    <tr>
                      <td colSpan={6} className="table-empty">No forms match this filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="table-foot">
                <span className="info">
                  Showing <b>{visible.length}</b> of <b>{forms.length}</b> forms
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      <AiPromptModal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        onGenerated={handleGenerated}
        onStartBlank={startBlank}
      />
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  )
}

export default FormsPage
