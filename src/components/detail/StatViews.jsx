import { useState } from 'react'
import { CHOICE_TYPES, NUMERIC_TYPES, pct } from '../../lib/stats'

export function Distribution({ distribution }) {
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

export function Numeric({ numeric }) {
  if (!numeric) return <p className="text-muted-sm">No numeric answers yet.</p>
  return (
    <div className="num-summary">
      <div className="n"><b>{numeric.min}</b><span>Min</span></div>
      <div className="n"><b>{numeric.mean}</b><span>Average</span></div>
      <div className="n"><b>{numeric.max}</b><span>Max</span></div>
    </div>
  )
}

export function Samples({ samples }) {
  if (!samples || samples.length === 0) return <p className="text-muted-sm">No answers yet.</p>
  return (
    <ul className="samples">
      {samples.map((s, i) => <li key={i}>{s}</li>)}
    </ul>
  )
}

export function FieldStat({ field }) {
  if (CHOICE_TYPES.has(field.type)) return <Distribution distribution={field.distribution} />
  if (NUMERIC_TYPES.has(field.type)) return <Numeric numeric={field.numeric} />
  return <Samples samples={field.samples} />
}

export function OverTime({ series }) {
  const [hover, setHover] = useState(null)
  if (!series || series.length === 0) return null
  const max = Math.max(...series.map((d) => d.count))
  const clear = (i) => setHover((h) => (h === i ? null : h))
  return (
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
  )
}
