import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import { timeAgo } from '../lib/format'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import { FieldStat, OverTime } from '../components/detail/StatViews'
import { pct } from '../lib/stats'
import Toast from '../components/Toast'
import './DashboardPage.css'
import './FormDetailPage.css'
import './ReportPage.css'

const SEVERITY = { high: 'sev-high', medium: 'sev-medium', info: 'sev-info' }

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

function ReportPage() {
  const { id } = useParams()
  return <ReportView key={id} id={id} />
}

function ReportView({ id }) {
  const [analytics, setAnalytics] = useState(null)
  const [history, setHistory] = useState([])
  const [current, setCurrent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([
      apiFetch(`/forms/${id}/analytics`),
      apiFetch(`/forms/${id}/reports`),
    ])
      .then(async ([aRes, listRes]) => {
        if (cancelled) return
        setAnalytics(aRes.data)
        const list = listRes.data || []
        setHistory(list)
        if (list.length > 0) {
          const full = await apiFetch(`/forms/${id}/reports/${list[0].id}`)
          if (!cancelled) setCurrent(full.data)
        }
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id])

  const generate = async () => {
    setGenerating(true)
    setGenError('')
    try {
      const res = await apiFetch(`/forms/${id}/reports`, { method: 'POST' })
      setCurrent(res.data)
      setHistory((h) => [
        { id: res.data.id, responseCount: res.data.responseCount, createdAt: res.data.createdAt },
        ...h,
      ])
      setToast('Report generated')
      setTimeout(() => setToast(''), 2500)
    } catch (err) {
      setGenError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const openVersion = async (reportId) => {
    if (Number(reportId) === current?.id) return
    try {
      const res = await apiFetch(`/forms/${id}/reports/${reportId}`)
      setCurrent(res.data)
    } catch (err) {
      setGenError(err.message)
    }
  }

  const statByLabel = useMemo(() => {
    const map = {}
    for (const f of analytics?.stats?.perField || []) map[f.label] = f
    return map
  }, [analytics])

  const stats = analytics?.stats
  const report = current?.content
  const outdated =
    current && stats ? stats.totalSubmissions !== current.responseCount : false

  return (
    <div className="dash rp-shell">
      <DashboardSidebar active="forms" />

      <div className="main">
        <main className="content">
          {loading ? (
            <div className="dash-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading…</span>
              </div>
            </div>
          ) : error || !analytics ? (
            <div className="empty">
              <div className="art"><i className="bi bi-exclamation-triangle"></i></div>
              <h3>Couldn&apos;t load the report</h3>
              <p>{error || 'The form may have been deleted.'}</p>
              <Link to="/forms" className="btn-primary" style={{ margin: '0 auto' }}>
                <i className="bi bi-arrow-left"></i>Back to forms
              </Link>
            </div>
          ) : (
            <>
              <div className="rp-toolbar no-print">
                <Link to={`/forms/${id}?tab=insights`} className="hub-back" title="Back to form">
                  <i className="bi bi-arrow-left"></i>
                </Link>
                <div className="rp-toolbar-title">
                  <b>Report</b>
                  <span>{analytics.title}</span>
                </div>
                <div className="rp-toolbar-actions">
                  {history.length > 1 && (
                    <select
                      className="rp-version"
                      value={current?.id || ''}
                      onChange={(e) => openVersion(e.target.value)}
                    >
                      {history.map((h) => (
                        <option key={h.id} value={h.id}>
                          {fmtDate(h.createdAt)} · {h.responseCount} responses
                        </option>
                      ))}
                    </select>
                  )}
                  {report && (
                    <button className="btn-ghost-2" onClick={() => window.print()}>
                      <i className="bi bi-printer"></i>Print / PDF
                    </button>
                  )}
                  {analytics.aiConfigured && stats.totalSubmissions > 0 && (
                    <button className="btn-primary" onClick={generate} disabled={generating}>
                      <i className="bi bi-stars"></i>
                      {report ? 'Generate new report' : 'Generate report'}
                    </button>
                  )}
                </div>
              </div>

              {genError && <div className="alert alert-danger small no-print">{genError}</div>}

              {generating ? (
                <div className="rp-sheet rp-loading">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Generating…</span>
                  </div>
                  <h3>Writing your report…</h3>
                  <p>Analyzing {stats.totalSubmissions} responses across {stats.perField.length} questions. This can take a few minutes.</p>
                </div>
              ) : !report ? (
                <div className="rp-sheet rp-loading">
                  <i className="bi bi-file-earmark-text rp-empty-icon"></i>
                  <h3>No report yet</h3>
                  {stats.totalSubmissions === 0 ? (
                    <p>Reports are available once your form has responses.</p>
                  ) : (
                    <p>
                      Generate a comprehensive analysis of your {stats.totalSubmissions} responses —
                      overview, trends, per-question analysis, themes, findings and recommendations.
                    </p>
                  )}
                </div>
              ) : (
                <article className="rp-sheet">
                  <header className="rp-header">
                    <div className="rp-brand no-print-hide">
                      <i className="bi bi-stars"></i> Form Strat · Response Analysis Report
                    </div>
                    <h1>{analytics.title}</h1>
                    {analytics.description && <p className="rp-desc">{analytics.description}</p>}
                    <div className="rp-facts">
                      <div><b>{current.responseCount}</b><span>responses</span></div>
                      <div><b>{stats.perField.length}</b><span>questions</span></div>
                      {report.period && (
                        <div><b>{report.period.from} → {report.period.to}</b><span>collection period</span></div>
                      )}
                      <div><b>{fmtDate(current.createdAt)}</b><span>generated</span></div>
                    </div>
                    {outdated && (
                      <div className="ins-stale-bar no-print">
                        <i className="bi bi-exclamation-triangle"></i>
                        This report was generated from {current.responseCount} responses — the form now has {stats.totalSubmissions}. Generate a new report for the latest picture.
                      </div>
                    )}
                    <p className="rp-attrib">
                      AI-generated analysis grounded in computed statistics. Verify claims against the figures shown in each section.
                    </p>
                  </header>

                  <section className="rp-section">
                    <h2><span>1</span>Overview</h2>
                    <p>{report.overview}</p>
                  </section>

                  <section className="rp-section">
                    <h2><span>2</span>Response Trends</h2>
                    <p>{report.trendAnalysis}</p>
                    <div className="rp-chart">
                      <OverTime series={stats.responsesOverTime} />
                    </div>
                  </section>

                  <section className="rp-section">
                    <h2><span>3</span>Question-by-Question Analysis</h2>
                    {report.questionAnalysis.map((q, i) => {
                      const field = statByLabel[q.label]
                      return (
                        <div className="rp-question" key={i}>
                          <h3>
                            3.{i + 1} {q.label}
                            {field && <span className="rp-qmeta">{field.answered} answered · {pct(field.answerRate)}</span>}
                          </h3>
                          {field && (
                            <div className="rp-qstat">
                              <FieldStat field={field} />
                            </div>
                          )}
                          <p>{q.analysis}</p>
                        </div>
                      )
                    })}
                  </section>

                  {report.crossCuttingThemes.length > 0 && (
                    <section className="rp-section">
                      <h2><span>4</span>Cross-Cutting Themes</h2>
                      <ul className="rp-themes">
                        {report.crossCuttingThemes.map((t, i) => (
                          <li key={i}><i className="bi bi-diagram-3"></i><span>{t}</span></li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <section className="rp-section">
                    <h2><span>5</span>Key Findings</h2>
                    <ul className="ins-findings">
                      {report.keyFindings.map((f, i) => (
                        <li key={i}>
                          <span className={`sev ${SEVERITY[f.severity] || 'sev-info'}`}>{f.severity}</span>
                          <span>{f.finding}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rp-section">
                    <h2><span>6</span>Recommendations</h2>
                    <ol className="rp-recs">
                      {report.recommendations.map((r, i) => (
                        <li key={i}>
                          <b>{r.recommendation}</b>
                          {r.rationale && <span>{r.rationale}</span>}
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section className="rp-section">
                    <h2><span>7</span>Conclusion</h2>
                    <p>{report.conclusion}</p>
                    {report.caveats && (
                      <p className="rp-caveats"><b>Caveats:</b> {report.caveats}</p>
                    )}
                  </section>

                  <footer className="rp-footer">
                    Generated {timeAgo(current.createdAt)} by Form Strat AI · based on {current.responseCount} responses
                  </footer>
                </article>
              )}
            </>
          )}
        </main>
      </div>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  )
}

export default ReportPage
