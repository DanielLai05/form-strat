import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import { timeAgo } from '../lib/format'
import { CHOICE_TYPES, NUMERIC_TYPES, pct, ratingScale } from '../lib/stats'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import {
  FigureBars,
  FigureColumns,
  FigureRating,
  FigureNumberBins,
  FigureSamples,
} from '../components/report/ReportFigures'
import Toast from '../components/Toast'
import './DashboardPage.css'
import './FormDetailPage.css'
import './ReportPage.css'

const TYPE_LABELS = {
  text: 'short text',
  textarea: 'paragraph text',
  email: 'email',
  tel: 'phone',
  number: 'number',
  date: 'date',
  select: 'dropdown',
  radio: 'single choice',
  checkbox: 'multiple choice',
  rating: 'rating',
  file: 'file upload',
}

const SECTIONS = [
  { id: 'exec', no: '', title: 'Executive Summary' },
  { id: 'intro', no: '1', title: 'Introduction & Background' },
  { id: 'method', no: '2', title: 'Methodology' },
  { id: 'trends', no: '3', title: 'Response Trends' },
  { id: 'questions', no: '4', title: 'Question-by-Question Analysis' },
  { id: 'themes', no: '5', title: 'Cross-Cutting Themes' },
  { id: 'findings', no: '6', title: 'Key Findings' },
  { id: 'recs', no: '7', title: 'Recommendations' },
  { id: 'conclusion', no: '8', title: 'Conclusion' },
  { id: 'appendix', no: 'A', title: 'Appendix A — Data Tables' },
]

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

function ReportPage() {
  const { id } = useParams()
  return <ReportView key={id} id={id} />
}

function ReportView({ id }) {
  const [analytics, setAnalytics] = useState(null)
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
      .then(([aRes, reportRes]) => {
        if (cancelled) return
        setAnalytics(aRes.data)
        setCurrent(reportRes.data ?? null)
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
      setToast('Report generated')
      setTimeout(() => setToast(''), 2500)
    } catch (err) {
      setGenError(err.message)
    } finally {
      setGenerating(false)
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

  const typeBreakdown = useMemo(() => {
    if (!stats) return ''
    const counts = {}
    for (const f of stats.perField) {
      const label = TYPE_LABELS[f.type] || f.type
      counts[label] = (counts[label] || 0) + 1
    }
    return Object.entries(counts)
      .map(([label, n]) => `${n} ${label}`)
      .join(', ')
  }, [stats])

  const avgAnswerRate = useMemo(() => {
    if (!stats || stats.perField.length === 0) return 0
    return stats.perField.reduce((s, f) => s + (f.answerRate || 0), 0) / stats.perField.length
  }, [stats])

  const choiceFields = useMemo(
    () => (stats?.perField || []).filter((f) => CHOICE_TYPES.has(f.type)),
    [stats]
  )
  const numericFields = useMemo(
    () => (stats?.perField || []).filter((f) => NUMERIC_TYPES.has(f.type)),
    [stats]
  )

  const execSummary = report?.executiveSummary || report?.overview
  const showIntro = Boolean(report?.executiveSummary && report?.overview)

  const questionFigureNos = useMemo(() => {
    const isChartAt = (report?.questionAnalysis || []).map((q) => {
      const field = statByLabel[q.label]
      return Boolean(field && CHOICE_TYPES.has(field.type))
    })
    return isChartAt.map((isChart, i) =>
      isChart ? 1 + isChartAt.slice(0, i + 1).filter(Boolean).length : null
    )
  }, [report, statByLabel])

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
                  {report && (
                    <button className="btn-ghost-2" onClick={() => window.print()}>
                      <i className="bi bi-printer"></i>Print / PDF
                    </button>
                  )}
                  {analytics.aiConfigured && stats.totalSubmissions > 0 && (
                    <button className="btn-primary" onClick={generate} disabled={generating}>
                      <i className="bi bi-stars"></i>
                      {report ? 'Regenerate report' : 'Generate report'}
                    </button>
                  )}
                </div>
              </div>

              {genError && <div className="alert alert-danger small no-print">{genError}</div>}

              {outdated && report && !generating && (
                <div className="ins-stale-bar no-print" style={{ maxWidth: 880, margin: '0 auto 16px' }}>
                  <i className="bi bi-exclamation-triangle"></i>
                  This report was generated from {current.responseCount} responses — the form now has {stats.totalSubmissions}. Generate a new report for the latest picture.
                </div>
              )}

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
                <article className="rp-sheet rp-doc">
                  <header className="rp-cover">
                    <div className="rp-eyebrow">Response Analysis Report</div>
                    <h1>{analytics.title}</h1>
                    {analytics.description && <p className="rp-desc">{analytics.description}</p>}
                    <div className="rp-cover-rule"></div>
                    <table className="rp-cover-facts">
                      <tbody>
                        <tr><td>Sample</td><td>{current.responseCount} responses</td></tr>
                        <tr><td>Instrument</td><td>{stats.perField.length} questions, online form</td></tr>
                        {report.period && (
                          <tr><td>Collection period</td><td>{report.period.from} to {report.period.to}</td></tr>
                        )}
                        <tr><td>Report date</td><td>{fmtDate(current.createdAt)}</td></tr>
                        <tr><td>Reference</td><td>FS-{analytics.formId}-{String(current.id).padStart(3, '0')}</td></tr>
                        <tr><td>Prepared by</td><td>Form Strat AI Analytics</td></tr>
                      </tbody>
                    </table>
                    <p className="rp-attrib">
                      Narrative sections of this report are AI-generated interpretations grounded in
                      statistics computed directly from response data. All figures and tables are
                      computed, not generated. Verify narrative claims against the accompanying data.
                    </p>
                  </header>

                  <nav className="rp-toc">
                    <h2>Contents</h2>
                    <ol>
                      {SECTIONS.filter((s) => s.id !== 'intro' || showIntro).map((s) => (
                        <li key={s.id}>
                          <a href={`#${s.id}`}>
                            <span className="rp-toc-no">{s.no}</span>
                            {s.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>

                  <section className="rp-section" id="exec">
                    <h2 className="rp-exec-title">Executive Summary</h2>
                    <p className="rp-exec">{execSummary}</p>
                  </section>

                  {showIntro && (
                    <section className="rp-section" id="intro">
                      <h2><span>1</span>Introduction &amp; Background</h2>
                      <p>{report.overview}</p>
                    </section>
                  )}

                  <section className="rp-section" id="method">
                    <h2><span>2</span>Methodology</h2>
                    <p>
                      Data was collected through a self-administered online form comprising{' '}
                      {stats.perField.length} questions ({typeBreakdown}). A total of{' '}
                      {current.responseCount} responses were received
                      {report.period && <> between {report.period.from} and {report.period.to}</>}.
                      The mean per-question answer rate was {pct(avgAnswerRate)}. Participation was
                      voluntary and unincentivized; respondents were not required to answer
                      non-mandatory questions, so the effective sample size varies by question and
                      is reported as <i>n</i> throughout.
                    </p>
                    <p>
                      All counts, percentages, and summary statistics in this report were computed
                      directly from stored responses using SQL aggregation. The narrative analysis
                      was produced by a large language model constrained to interpret only these
                      pre-computed statistics. Per-question response rates are listed in
                      Appendix A, Table A.1.
                    </p>
                  </section>

                  <section className="rp-section" id="trends">
                    <h2><span>3</span>Response Trends</h2>
                    <p>{report.trendAnalysis}</p>
                    <figure className="rp-figure">
                      <FigureColumns series={stats.responsesOverTime} />
                      <figcaption>
                        <b>Figure 1.</b> Responses per day over the collection period
                        (days with at least one response).
                        <span className="rp-source">Source: {current.responseCount} responses collected via Form Strat.</span>
                      </figcaption>
                    </figure>
                  </section>

                  <section className="rp-section" id="questions">
                    <h2><span>4</span>Question-by-Question Analysis</h2>
                    {report.questionAnalysis.map((q, i) => {
                      const field = statByLabel[q.label]
                      const isChart = field && CHOICE_TYPES.has(field.type)
                      const figNo = questionFigureNos[i]
                      return (
                        <div className="rp-question" key={i}>
                          <h3>
                            4.{i + 1} {q.label}
                            {field && (
                              <span className="rp-qmeta">
                                n = {field.answered} · {pct(field.answerRate)} answered
                              </span>
                            )}
                          </h3>
                          {field && (
                            <figure className="rp-figure rp-figure-q">
                              {CHOICE_TYPES.has(field.type) ? (
                                <FigureBars field={field} />
                              ) : field.type === 'rating' ? (
                                <FigureRating field={field} scale={ratingScale(field, analytics.fields)} />
                              ) : NUMERIC_TYPES.has(field.type) ? (
                                <FigureNumberBins field={field} />
                              ) : (
                                <FigureSamples samples={field.samples} />
                              )}
                              <figcaption>
                                {isChart ? (
                                  <><b>Figure {figNo}.</b> Distribution of responses (n = {field.answered}).
                                  {field.type === 'checkbox' && ' Multi-select; shares may exceed 100%.'}</>
                                ) : field.type === 'rating' ? (
                                  <>Rating distribution and mean (n = {field.numeric?.count ?? field.answered}).</>
                                ) : NUMERIC_TYPES.has(field.type) ? (
                                  <>Distribution and summary statistics (n = {field.numeric?.count ?? field.answered}).</>
                                ) : (
                                  <>Illustrative verbatim responses (sample of {field.samples?.length ?? 0}).</>
                                )}
                              </figcaption>
                            </figure>
                          )}
                          <p>{q.analysis}</p>
                        </div>
                      )
                    })}
                  </section>

                  {report.crossCuttingThemes.length > 0 && (
                    <section className="rp-section" id="themes">
                      <h2><span>5</span>Cross-Cutting Themes</h2>
                      <ol className="rp-themes">
                        {report.crossCuttingThemes.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ol>
                    </section>
                  )}

                  <section className="rp-section" id="findings">
                    <h2><span>6</span>Key Findings</h2>
                    <dl className="rp-findings">
                      {report.keyFindings.map((f, i) => (
                        <div className="rp-finding" key={i}>
                          <dt>
                            F{i + 1}
                            <em className={`rp-sev rp-sev-${f.severity}`}>{f.severity}</em>
                          </dt>
                          <dd>{f.finding}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>

                  <section className="rp-section" id="recs">
                    <h2><span>7</span>Recommendations</h2>
                    <dl className="rp-findings">
                      {report.recommendations.map((r, i) => (
                        <div className="rp-finding" key={i}>
                          <dt>R{i + 1}</dt>
                          <dd>
                            <b>{r.recommendation}</b>
                            {r.rationale && <span className="rp-rationale">{r.rationale}</span>}
                            {r.addresses?.length > 0 && (
                              <span className="rp-addresses">Addresses {r.addresses.join(', ')}</span>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>

                  <section className="rp-section" id="conclusion">
                    <h2><span>8</span>Conclusion</h2>
                    <p>{report.conclusion}</p>
                    {report.caveats && (
                      <p className="rp-caveats"><b>Limitations.</b> {report.caveats}</p>
                    )}
                  </section>

                  <section className="rp-section rp-appendix" id="appendix">
                    <h2><span>A</span>Appendix A — Data Tables</h2>

                    <div className="rp-table-block">
                      <p className="rp-table-title"><b>Table A.1.</b> Per-question response rates.</p>
                      <table className="rp-table">
                        <thead>
                          <tr>
                            <th>Question</th>
                            <th>Type</th>
                            <th className="num">n</th>
                            <th className="num">Answer rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.perField.map((f) => (
                            <tr key={f.name || f.label}>
                              <td>{f.label}</td>
                              <td>{TYPE_LABELS[f.type] || f.type}</td>
                              <td className="num">{f.answered}</td>
                              <td className="num">{pct(f.answerRate)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {choiceFields.map((f, i) => {
                      const entries = Object.entries(f.distribution || {}).sort((a, b) => b[1] - a[1])
                      return (
                        <div className="rp-table-block" key={f.name || f.label}>
                          <p className="rp-table-title">
                            <b>Table A.{i + 2}.</b> {f.label} — frequency distribution (n = {f.answered}).
                          </p>
                          <table className="rp-table">
                            <thead>
                              <tr>
                                <th>Option</th>
                                <th className="num">Count</th>
                                <th className="num">Share</th>
                              </tr>
                            </thead>
                            <tbody>
                              {entries.map(([value, count]) => (
                                <tr key={value}>
                                  <td>{value}</td>
                                  <td className="num">{count}</td>
                                  <td className="num">{f.answered ? pct(count / f.answered) : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    })}

                    {numericFields.length > 0 && (
                      <div className="rp-table-block">
                        <p className="rp-table-title">
                          <b>Table A.{choiceFields.length + 2}.</b> Numeric questions — summary statistics.
                        </p>
                        <table className="rp-table">
                          <thead>
                            <tr>
                              <th>Question</th>
                              <th className="num">n</th>
                              <th className="num">Min</th>
                              <th className="num">Mean</th>
                              <th className="num">Max</th>
                            </tr>
                          </thead>
                          <tbody>
                            {numericFields.map((f) => (
                              <tr key={f.name || f.label}>
                                <td>{f.label}</td>
                                <td className="num">{f.numeric?.count ?? '—'}</td>
                                <td className="num">{f.numeric?.min ?? '—'}</td>
                                <td className="num">{f.numeric?.mean ?? '—'}</td>
                                <td className="num">{f.numeric?.max ?? '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>

                  <footer className="rp-footer">
                    Form Strat · Response Analysis Report · FS-{analytics.formId}-{String(current.id).padStart(3, '0')} ·
                    generated {timeAgo(current.createdAt)} from {current.responseCount} responses
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
