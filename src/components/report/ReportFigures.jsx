import { pct, orderedEntries } from '../../lib/stats'

export function FigureBars({ field }) {
  const entries = orderedEntries(field.distribution, field.options, field.type)
  if (entries.length === 0) return <p className="rp-nodata">No answers recorded.</p>
  const max = Math.max(...entries.map(([, c]) => c))
  return (
    <div className="rpf-bars">
      {entries.map(([value, count]) => (
        <div className="rpf-bar-row" key={value}>
          <span className="rpf-bar-label" title={value}>{value}</span>
          <span className="rpf-bar-track">
            <span className="rpf-bar-fill" style={{ width: `${(count / max) * 100}%` }}></span>
          </span>
          <span className="rpf-bar-value">
            {count}
            <em>{field.answered ? ` (${pct(count / field.answered)})` : ''}</em>
          </span>
        </div>
      ))}
    </div>
  )
}

export function FigureColumns({ series }) {
  if (!series || series.length === 0) return <p className="rp-nodata">No responses recorded.</p>
  const max = Math.max(...series.map((d) => d.count))
  const peak = series.findIndex((d) => d.count === max)
  const step = Math.max(1, Math.ceil(series.length / 8))
  return (
    <div className="rpf-columns-wrap">
      <div className="rpf-y">
        <span>{max}</span>
        <span>0</span>
      </div>
      <div className="rpf-plot">
        <div className="rpf-columns">
          {series.map((d, i) => (
            <div className="rpf-col" key={d.date}>
              {i === peak && <span className="rpf-col-value">{d.count}</span>}
              <div
                className="rpf-col-fill"
                style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}
              ></div>
            </div>
          ))}
        </div>
        <div className="rpf-x">
          {series.map((d, i) => (
            <span className="rpf-x-slot" key={d.date}>
              {(i % step === 0 || i === series.length - 1) ? d.date.slice(5) : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FigureRating({ field, scale }) {
  if (!field.numeric) return <p className="rp-nodata">No answers recorded.</p>
  const dist = field.ratingDistribution || {}
  const steps = Array.from({ length: scale }, (_, i) => i + 1)
  const max = Math.max(1, ...steps.map((s) => dist[s] || 0))
  return (
    <div className="rpf-rating">
      <div className="rpf-rating-hero">
        <b>{field.numeric.mean}</b>
        <span>mean of {field.numeric.count}</span>
      </div>
      <div className="rpf-histo">
        {steps.map((s) => {
          const count = dist[s] || 0
          return (
            <div className="rpf-histo-col" key={s}>
              <span className="rpf-histo-count">{count > 0 ? count : ''}</span>
              <div
                className="rpf-histo-bar"
                style={{ height: `${Math.max(2, (count / max) * 100)}%` }}
              ></div>
              <span className="rpf-histo-lab">{s}★</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function FigureNumberBins({ field }) {
  if (!field.numeric) return <p className="rp-nodata">No numeric answers recorded.</p>
  const bins = field.bins || []
  const max = Math.max(1, ...bins.map((b) => b.count))
  return (
    <div>
      {bins.length > 1 && (
        <div className="rpf-histo rpf-histo-wide">
          {bins.map((b, i) => (
            <div className="rpf-histo-col" key={i}>
              <span className="rpf-histo-count">{b.count > 0 ? b.count : ''}</span>
              <div
                className="rpf-histo-bar"
                style={{ height: `${Math.max(2, (b.count / max) * 100)}%` }}
              ></div>
              <span className="rpf-histo-lab">{b.from}</span>
            </div>
          ))}
        </div>
      )}
      <div className="rpf-numeric">
        <div><b>{field.numeric.count}</b><span>n</span></div>
        <div><b>{field.numeric.min}</b><span>Minimum</span></div>
        <div><b>{field.numeric.mean}</b><span>Mean</span></div>
        <div><b>{field.numeric.max}</b><span>Maximum</span></div>
      </div>
    </div>
  )
}

export function FigureSamples({ samples }) {
  if (!samples || samples.length === 0) return <p className="rp-nodata">No answers recorded.</p>
  return (
    <ul className="rpf-samples">
      {samples.map((s, i) => (
        <li key={i}>“{s}”</li>
      ))}
    </ul>
  )
}
