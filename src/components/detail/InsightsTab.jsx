import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { timeAgo } from '../../lib/format'

const CHOICE = new Set(['select', 'radio', 'checkbox'])
const NUMERIC = new Set(['number', 'rating'])
const pct = (n) => `${Math.round(n * 100)}%`

/** A choice field's option distribution, drawn as horizontal bars. */
function Distribution({ distribution }) {
  const entries = Object.entries(distribution || {})
  if (entries.length === 0) return <p className="text-muted-sm">No answers yet.</p>
  const max = Math.max(...entries.map(([, c]) => c))
  return (
    <div>
      {entries.map(([value, count]) => (
        <div className="bar-row" key={value}>
          <span className="k" title={value}>{value}</span>
          <span className="bar-track">
            <span className="bar-fill" style={{ width: pct(count / max) }}></span>
          </span>
          <span className="v">{count}</span>
        </div>
      ))}
    </div>
  )
}

function Numeric({ numeric }) {
  if (!numeric) return <p className="text-muted-sm">No numeric answers yet.</p>
  return (
    <div className="num-summary">
      <div className="n"><b>{numeric.min}</b><span>Min</span></div>
      <div className="n"><b>{numeric.mean}</b><span>Average</span></div>
      <div className="n"><b>{numeric.max}</b><span>Max</span></div>
    </div>
  )
}

function Samples({ samples }) {
  if (!samples || samples.length === 0) return <p className="text-muted-sm">No answers yet.</p>
  return (
    <ul className="samples">
      {samples.map((s, i) => <li key={i}>{s}</li>)}
    </ul>
  )
}

/** Responses-over-time as a compact bar chart with a per-bar hover tooltip. */
function OverTime({ series }) {
  const [hover, setHover] = useState(null)
  if (!series || series.length === 0) return null
  const max = Math.max(...series.map((d) => d.count))
  const clear = (i) => setHover((h) => (h === i ? null : h))
  return (
    <div className="ins-card" style={{ gridColumn: '1 / -1' }}>
      <div className="q"><b>Responses over time</b></div>
      <div className="spark">
        {series.map((d, i) => (
          <div
            className={`col${hover === i ? ' hovered' : ''}`}
            key={d.date}
            tabIndex={0}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => clear(i)}
            onFocus={() => setHover(i)}
            onBlur={() => clear(i)}
          >
            {hover === i && (
              <div className="spark-tip" role="tooltip">
                <b>{d.count}</b>
                <span>{d.count === 1 ? 'response' : 'responses'}</span>
                <span className="spark-tip-date">{d.date}</span>
              </div>
            )}
            <div className="bar" style={{ height: `${Math.max(3, (d.count / max) * 68)}px` }}></div>
            <span className="lab">{d.date.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function InsightsTab({ formId, hasResponses }) {
  const [stats, setStats] = useState(null)
  const [aiConfigured, setAiConfigured] = useState(false)
  const [loading, setLoading] = useState(hasResponses)
  const [error, setError] = useState('')

  const [insights, setInsights] = useState(null)
  const [insightsAt, setInsightsAt] = useState(null)
  const [stale, setStale] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    if (!hasResponses) return undefined
    let cancelled = false
    // ai=false returns the cached narrative (if any) without calling the model.
    apiFetch(`/forms/${formId}/analytics?ai=false`)
      .then((res) => {
        if (cancelled) return
        setStats(res.data.stats)
        setAiConfigured(res.data.aiConfigured)
        setInsights(res.data.insights ?? null)
        setInsightsAt(res.data.insightsAt ?? null)
        setStale(Boolean(res.data.insightsStale))
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
      const res = await apiFetch(`/forms/${formId}/analytics`)
      if (res.data.insights) {
        setInsights(res.data.insights)
        setInsightsAt(res.data.insightsAt ?? null)
        setStale(false)
      } else {
        setAiError('The AI could not generate insights for this data.')
      }
    } catch (err) {
      setAiError(err.message)
    } finally {
      setGenerating(false)
    }
  }

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
      {/* AI narrative */}
      {insights ? (
        <div className="ins-narrative">
          <h4><i className="bi bi-stars"></i>What the data says</h4>
          <p>{insights.summary}</p>
          {insights.keyFindings?.length > 0 && (
            <>
              <div className="ins-sub">Key findings</div>
              <ul>{insights.keyFindings.map((f, i) => <li key={i}>{f}</li>)}</ul>
            </>
          )}
          {insights.recommendations?.length > 0 && (
            <>
              <div className="ins-sub">Recommendations</div>
              <ul>{insights.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </>
          )}
          <div className="ins-foot">
            <span className="ins-stamp">
              {stale ? (
                <span className="ins-stale">
                  <i className="bi bi-exclamation-circle"></i>New responses since this was generated
                </span>
              ) : insightsAt ? (
                <>Generated {timeAgo(insightsAt)}</>
              ) : null}
            </span>
            {aiConfigured && (
              <button className="ins-regen" onClick={generate} disabled={generating}>
                <i className="bi bi-arrow-clockwise"></i>{generating ? 'Regenerating…' : 'Regenerate'}
              </button>
            )}
          </div>
          {aiError && <p className="text-muted-sm" style={{ marginTop: 8, color: '#e11d48' }}>{aiError}</p>}
        </div>
      ) : aiConfigured ? (
        <div className="ins-generate">
          <p>Let AI interpret these numbers and surface what matters.</p>
          <button className="btn-primary" style={{ margin: '0 auto' }} onClick={generate} disabled={generating}>
            <i className="bi bi-stars"></i>{generating ? 'Generating…' : 'Generate AI insights'}
          </button>
          {aiError && <p className="text-muted-sm" style={{ marginTop: 12, color: '#e11d48' }}>{aiError}</p>}
        </div>
      ) : null}

      {/* per-field stats */}
      <div className="ins-grid">
        <OverTime series={stats.responsesOverTime} />
        {stats.perField.map((f) => (
          <div className="ins-card" key={f.name || f.label}>
            <div className="q">
              <b>{f.label}</b>
              <span className="type">{f.type}</span>
            </div>
            {CHOICE.has(f.type) ? (
              <Distribution distribution={f.distribution} />
            ) : NUMERIC.has(f.type) ? (
              <Numeric numeric={f.numeric} />
            ) : (
              <Samples samples={f.samples} />
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
