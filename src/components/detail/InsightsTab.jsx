import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { timeAgo } from '../../lib/format'
import { FieldStat, OverTime } from './StatViews'
import { pct } from '../../lib/stats'

const SEVERITY = { high: 'sev-high', medium: 'sev-medium', info: 'sev-info' }

function InsightsTab({ formId, hasResponses }) {
  const [stats, setStats] = useState(null)
  const [aiConfigured, setAiConfigured] = useState(false)
  const [loading, setLoading] = useState(hasResponses)
  const [error, setError] = useState('')

  const [report, setReport] = useState(null)
  const [reportAt, setReportAt] = useState(null)
  const [reportCount, setReportCount] = useState(null)
  const [stale, setStale] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    if (!hasResponses) return undefined
    let cancelled = false
    apiFetch(`/forms/${formId}/analytics`)
      .then((res) => {
        if (cancelled) return
        setStats(res.data.stats)
        setAiConfigured(res.data.aiConfigured)
        setReport(res.data.report ?? null)
        setReportAt(res.data.reportGeneratedAt ?? null)
        setReportCount(res.data.reportResponseCount ?? null)
        setStale(Boolean(res.data.reportStale))
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [formId, hasResponses])

  const generate = async () => {
    setGenerating(true)
    setAiError('')
    try {
      const res = await apiFetch(`/forms/${formId}/report`, { method: 'POST' })
      setReport(res.data.report)
      setReportAt(res.data.generatedAt)
      setReportCount(res.data.responseCount)
      setStale(false)
    } catch (err) {
      setAiError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const highlightByLabel = useMemo(() => {
    const map = {}
    for (const h of report?.questionHighlights || []) map[h.label] = h.insight
    return map
  }, [report])

  const newSince =
    stale && reportCount != null && stats ? stats.totalSubmissions - reportCount : 0

  if (!hasResponses) {
    return (
      <div className="empty">
        <div className="art"><i className="bi bi-stars"></i></div>
        <h3>No insights yet</h3>
        <p>Insights appear after your first response.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="empty">
        <div className="art"><i className="bi bi-exclamation-triangle"></i></div>
        <h3>Couldn&apos;t load insights</h3>
        <p>{error || 'Try again in a moment.'}</p>
      </div>
    )
  }

  return (
    <>
      {generating ? (
        <div className="ins-generate">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Generating…</span>
          </div>
          <p style={{ marginTop: 12 }}>
            Analyzing {stats.totalSubmissions} responses… this can take a minute or two.
          </p>
        </div>
      ) : report ? (
        <div className="ins-narrative">
          <h4><i className="bi bi-stars"></i>AI Summary</h4>
          <span className="ins-attrib">AI-generated analysis — verify against the numbers below</span>

          {stale && (
            <div className="ins-stale-bar">
              <i className="bi bi-exclamation-triangle"></i>
              {newSince} new response{newSince !== 1 ? 's' : ''} since this summary was generated — regenerate for the latest picture.
            </div>
          )}

          <p>{report.summary}</p>

          {report.keyFindings?.length > 0 && (
            <>
              <div className="ins-sub">Key findings</div>
              <ul className="ins-findings">
                {report.keyFindings.map((f, i) => (
                  <li key={i}>
                    <span className={`sev ${SEVERITY[f.severity] || 'sev-info'}`}>{f.severity}</span>
                    <span>{f.finding}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {report.recommendations?.length > 0 && (
            <>
              <div className="ins-sub">Recommendations</div>
              <ul className="ins-recs">
                {report.recommendations.map((r, i) => (
                  <li key={i}>
                    <i className="bi bi-check2-circle"></i>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {report.caveats && <p className="ins-caveats">{report.caveats}</p>}

          <div className="ins-foot">
            <span className="ins-stamp">
              {reportAt && <>Generated {timeAgo(reportAt)}{reportCount != null && <> · from {reportCount} response{reportCount !== 1 ? 's' : ''}</>}</>}
            </span>
            <span className="ins-foot-actions">
              <Link className="ins-regen" to={`/forms/${formId}/report`}>
                <i className="bi bi-file-earmark-text"></i>Full report
              </Link>
              {aiConfigured && (
                <button className="ins-regen" onClick={generate} disabled={generating}>
                  <i className="bi bi-arrow-clockwise"></i>Regenerate
                </button>
              )}
            </span>
          </div>
          {aiError && <p className="text-muted-sm" style={{ marginTop: 8, color: '#e11d48' }}>{aiError}</p>}
        </div>
      ) : (
        <div className="ins-generate">
          <p>
            Get a quick AI summary of your {stats.totalSubmissions} response{stats.totalSubmissions !== 1 ? 's' : ''} —
            or a full report with per-question analysis.
          </p>
          <div className="ins-generate-row">
            <button className="btn-primary" onClick={generate} disabled={!aiConfigured}>
              <i className="bi bi-stars"></i>Generate AI summary
            </button>
            <Link className="btn-ghost-2" to={`/forms/${formId}/report`}>
              <i className="bi bi-file-earmark-text"></i>Full report
            </Link>
          </div>
          {!aiConfigured && (
            <p className="text-muted-sm" style={{ marginTop: 12 }}>AI isn&apos;t configured on the server.</p>
          )}
          {aiError && <p className="text-muted-sm" style={{ marginTop: 12, color: '#e11d48' }}>{aiError}</p>}
        </div>
      )}

      <div className="ins-grid">
        <div className="ins-card" style={{ gridColumn: '1 / -1' }}>
          <div className="q"><b>Responses over time</b></div>
          <OverTime series={stats.responsesOverTime} />
        </div>
        {stats.perField.map((f) => (
          <div className="ins-card" key={f.name || f.label}>
            <div className="q">
              <b>{f.label}</b>
              <span className="type">{f.type}</span>
            </div>
            <FieldStat field={f} />
            {highlightByLabel[f.label] && (
              <div className="ins-highlight">
                <i className="bi bi-stars"></i>
                <span>{highlightByLabel[f.label]}</span>
              </div>
            )}
            <div className="rate" style={{ marginTop: 12 }}>
              {f.answered} answered · {pct(f.answerRate)} response rate
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default InsightsTab
