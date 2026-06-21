import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { apiFetch } from '../lib/api'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import DashboardTopbar from '../components/dashboard/DashboardTopbar'
import FormCard from '../components/dashboard/FormCard'
import './DashboardPage.css'

const STAT_ICONS = {
  forms: <i className="bi bi-file-earmark-text"></i>,
  responses: <i className="bi bi-graph-up"></i>,
  live: <i className="bi bi-broadcast"></i>,
  drafts: <i className="bi bi-pencil-square"></i>,
}

const TABS = [
  { key: 'all', label: 'All forms' },
  { key: 'live', label: 'Live' },
  { key: 'drafts', label: 'Drafts' },
]

function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')

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

  const stats = useMemo(() => {
    const total = forms.length
    const responses = forms.reduce((sum, f) => sum + (f.submissionCount || 0), 0)
    const live = forms.filter((f) => f.published).length
    return { total, responses, live, drafts: total - live }
  }, [forms])

  const visibleForms = useMemo(() => {
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

  const firstName = (user?.name || 'there').split(' ')[0]
  const openForm = (form) => navigate(`/builder/${form.id}`)

  return (
    <div className="dash">
      <DashboardSidebar formCount={stats.total} />

      <div className="main">
        <DashboardTopbar search={search} onSearch={setSearch} />

        <main className="content">
          <div className="page-head">
            <div>
              <h1>Welcome back, {firstName}</h1>
              <p>Here&apos;s what&apos;s happening across your forms.</p>
            </div>
          </div>

          {error && (
            <div className="empty" style={{ marginBottom: 24 }}>
              <h3>Couldn&apos;t load your forms</h3>
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="dash-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading…</span>
              </div>
            </div>
          ) : (
            <>
              {/* stats */}
              <div className="stats">
                <div className="stat">
                  <div className="top"><span className="ic">{STAT_ICONS.forms}</span></div>
                  <div className="val">{stats.total}</div>
                  <div className="lbl">Total forms</div>
                </div>
                <div className="stat">
                  <div className="top"><span className="ic">{STAT_ICONS.responses}</span></div>
                  <div className="val">{stats.responses.toLocaleString()}</div>
                  <div className="lbl">Total responses</div>
                </div>
                <div className="stat">
                  <div className="top"><span className="ic">{STAT_ICONS.live}</span></div>
                  <div className="val">{stats.live}</div>
                  <div className="lbl">Live</div>
                </div>
                <div className="stat">
                  <div className="top"><span className="ic">{STAT_ICONS.drafts}</span></div>
                  <div className="val">{stats.drafts}</div>
                  <div className="lbl">Drafts</div>
                </div>
              </div>

              {/* toolbar */}
              <div className="toolbar">
                <div className="tabs">
                  {TABS.map((t) => (
                    <button
                      key={t.key}
                      className={`tab${tab === t.key ? ' active' : ''}`}
                      onClick={() => setTab(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="spacer"></div>
              </div>

              {/* grid or empty */}
              {forms.length === 0 ? (
                <div className="empty">
                  <div className="art">
                    <i className="bi bi-inbox"></i>
                  </div>
                  <h3>No forms yet</h3>
                  <p>Create your first form to start collecting responses.</p>
                  <button className="btn-primary" style={{ margin: '0 auto' }} onClick={() => navigate('/builder')}>
                    <i className="bi bi-plus-lg"></i>
                    Create a form
                  </button>
                </div>
              ) : (
                <div className="grid">
                  {visibleForms.map((form, i) => (
                    <FormCard key={form.id} form={form} index={i} onOpen={openForm} />
                  ))}

                  <button className="fcard newcard" onClick={() => navigate('/builder')}>
                    <span className="plus">
                      <i className="bi bi-plus-lg"></i>
                    </span>
                    <b>Create a new form</b>
                    <span>Start from scratch or a template</span>
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
