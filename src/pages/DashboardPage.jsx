import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { apiFetch } from '../lib/api'
import { formHref, timeAgo } from '../lib/format'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import DashboardTopbar from '../components/dashboard/DashboardTopbar'
import FormCard from '../components/dashboard/FormCard'
import AiPromptModal from '../components/AiPromptModal'
import './DashboardPage.css'

const STAT_ICONS = {
  forms: <i className="bi bi-file-earmark-text"></i>,
  responses: <i className="bi bi-graph-up"></i>,
  live: <i className="bi bi-broadcast"></i>,
  drafts: <i className="bi bi-pencil-square"></i>,
}

const RECENT_LIMIT = 6

function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [forms, setForms] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [aiOpen, setAiOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([apiFetch('/forms'), apiFetch('/activity')])
      .then(([formsRes, activityRes]) => {
        if (cancelled) return
        setForms(formsRes.data || [])
        setActivity(activityRes.data || [])
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
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

  const recentForms = useMemo(() => {
    const q = search.trim().toLowerCase()
    return [...forms]
      .filter((f) =>
        !q ||
        f.title?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q)
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      )
      .slice(0, RECENT_LIMIT)
  }, [forms, search])

  const firstName = (user?.name || 'there').split(' ')[0]
  const openForm = (form) => navigate(formHref(form))
  const handleGenerated = (data) => {
    setAiOpen(false)
    navigate('/builder', { state: { generated: data } })
  }
  const startBlank = () => {
    setAiOpen(false)
    navigate('/builder')
  }

  return (
    <div className="dash">
      <DashboardSidebar formCount={stats.total} />

      <div className="main">
        <DashboardTopbar search={search} onSearch={setSearch} onNewForm={() => setAiOpen(true)} />

        <main className="content">
          <div className="page-head">
            <div>
              <h1>Welcome back, {firstName}</h1>
              <p>Here&apos;s what&apos;s happening across your forms.</p>
            </div>
          </div>

          {error && (
            <div className="empty" style={{ marginBottom: 24 }}>
              <h3>Couldn&apos;t load your dashboard</h3>
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

              {forms.length === 0 ? (
                <div className="empty">
                  <div className="art"><i className="bi bi-inbox"></i></div>
                  <h3>No forms yet</h3>
                  <p>Create your first form to start collecting responses.</p>
                  <button className="btn-primary" style={{ margin: '0 auto' }} onClick={() => setAiOpen(true)}>
                    <i className="bi bi-plus-lg"></i>
                    Create a form
                  </button>
                </div>
              ) : (
                <div className="dash-cols">
                  {/* recent activity */}
                  <section className="panel">
                    <div className="panel-head">
                      <h2>Recent activity</h2>
                    </div>
                    {activity.length === 0 ? (
                      <div className="activity-empty">
                        <i className="bi bi-bell-slash"></i>
                        <span>No responses yet. Share a form to start collecting.</span>
                      </div>
                    ) : (
                      <ul className="activity">
                        {activity.map((a) => (
                          <li key={a.id}>
                            <Link to={`/forms/${a.formId}`}>
                              <span className="act-ic"><i className="bi bi-inbox-fill"></i></span>
                              <span className="act-text">
                                <b>{a.formTitle}</b> received a response
                              </span>
                              <span className="act-when">{timeAgo(a.createdAt)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  {/* recent forms */}
                  <section className="panel">
                    <div className="panel-head">
                      <h2>Your forms</h2>
                      <Link to="/forms" className="view-all">
                        View all<i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                    <div className="grid grid-2">
                      {recentForms.map((form, i) => (
                        <FormCard key={form.id} form={form} index={i} onOpen={openForm} />
                      ))}
                      <button className="fcard newcard" onClick={() => setAiOpen(true)}>
                        <span className="plus"><i className="bi bi-plus-lg"></i></span>
                        <b>Create a new form</b>
                        <span>Describe it and let AI build it</span>
                      </button>
                    </div>
                  </section>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <AiPromptModal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        onGenerated={handleGenerated}
        onStartBlank={startBlank}
      />
    </div>
  )
}

export default DashboardPage
