import { pct } from '../../lib/stats'

export function FigureBars({ distribution, answered }) {
  const entries = Object.entries(distribution || {}).sort((a, b) => b[1] - a[1])
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
            <em>{answered ? ` (${pct(count / answered)})` : ''}</em>
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

export function FigureNumeric({ numeric }) {
  if (!numeric) return <p className="rp-nodata">No numeric answers recorded.</p>
  return (
    <div className="rpf-numeric">
      <div><b>{numeric.count}</b><span>n</span></div>
      <div><b>{numeric.min}</b><span>Minimum</span></div>
      <div><b>{numeric.mean}</b><span>Mean</span></div>
      <div><b>{numeric.max}</b><span>Maximum</span></div>
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
