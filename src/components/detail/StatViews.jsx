import { useState } from 'react'
import {
  CHOICE_TYPES,
  NUMERIC_TYPES,
  pct,
  orderedEntries,
  isSplitField,
} from '../../lib/stats'

export function Distribution({ field }) {
  const entries = orderedEntries(field.distribution, field.options, field.type)
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
          <span className="v">
            {count}
            {field.answered > 0 && <em> · {pct(count / field.answered)}</em>}
          </span>
        </div>
      ))}
      {field.type === 'checkbox' && (
        <p className="sv-note">Percentages are of respondents; multi-select may exceed 100%.</p>
      )}
    </div>
  )
}

export function SplitBar({ field }) {
  const [a, b] = field.options
  const ca = field.distribution?.[a] || 0
  const cb = field.distribution?.[b] || 0
  const total = ca + cb
  if (total === 0) return <p className="text-muted-sm">No answers yet.</p>
  const pa = ca / total
  return (
    <div className="split">
      <div className="split-bar">
        <div className="split-a" style={{ width: `${pa * 100}%` }}></div>
        <div className="split-b" style={{ width: `${(1 - pa) * 100}%` }}></div>
      </div>
      <div className="split-legend">
        <span><i className="split-dot split-dot-a"></i>{a} <b>{pct(pa)}</b> ({ca})</span>
        <span><i className="split-dot split-dot-b"></i>{b} <b>{pct(1 - pa)}</b> ({cb})</span>
      </div>
    </div>
  )
}

export function RatingHisto({ field, scale }) {
  if (!field.numeric) return <p className="text-muted-sm">No answers yet.</p>
  const dist = field.ratingDistribution || {}
  const steps = Array.from({ length: scale }, (_, i) => i + 1)
  const max = Math.max(1, ...steps.map((s) => dist[s] || 0))
  return (
    <div className="rating-histo">
      <div className="rating-hero">
        <b>{field.numeric.mean}</b>
        <span className="rating-hero-star"><i className="bi bi-star-fill"></i></span>
        <span className="rating-hero-sub">average of {field.numeric.count}</span>
      </div>
      <div className="histo">
        {steps.map((s) => {
          const count = dist[s] || 0
          return (
            <div className="histo-col" key={s} title={`${s} stars: ${count}`}>
              <span className="histo-count">{count > 0 ? count : ''}</span>
              <div className="histo-bar" style={{ height: `${Math.max(3, (count / max) * 64)}px` }}></div>
              <span className="histo-lab">{s}★</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function NumberHisto({ field }) {
  if (!field.numeric) return <p className="text-muted-sm">No numeric answers yet.</p>
  const bins = field.bins || []
  const max = Math.max(1, ...bins.map((b) => b.count))
  return (
    <div>
      {bins.length > 1 && (
        <div className="histo histo-bins">
          {bins.map((b, i) => (
            <div className="histo-col" key={i} title={`${b.from}–${b.to}: ${b.count}`}>
              <span className="histo-count">{b.count > 0 ? b.count : ''}</span>
              <div className="histo-bar" style={{ height: `${Math.max(3, (b.count / max) * 64)}px` }}></div>
              <span className="histo-lab">{b.from}</span>
            </div>
          ))}
          <div className="histo-col histo-end">
            <span className="histo-count"></span>
            <span className="histo-lab">{bins[bins.length - 1].to}</span>
          </div>
        </div>
      )}
      <div className="num-summary">
        <div className="n"><b>{field.numeric.min}</b><span>Min</span></div>
        <div className="n"><b>{field.numeric.mean}</b><span>Average</span></div>
        <div className="n"><b>{field.numeric.max}</b><span>Max</span></div>
      </div>
    </div>
  )
}

export function Samples({ field }) {
  const samples = field.samples
  if (!samples || samples.length === 0) return <p className="text-muted-sm">No answers yet.</p>
  return (
    <>
      <ul className="samples">
        {samples.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
      <p className="sv-note">Showing {samples.length} of {field.answered} answers.</p>
    </>
  )
}

export function FieldStat({ field, ratingMax }) {
  if (isSplitField(field)) return <SplitBar field={field} />
  if (CHOICE_TYPES.has(field.type)) return <Distribution field={field} />
  if (field.type === 'rating') return <RatingHisto field={field} scale={ratingMax || 5} />
  if (NUMERIC_TYPES.has(field.type)) return <NumberHisto field={field} />
  return <Samples field={field} />
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
