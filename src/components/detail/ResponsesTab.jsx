import { Fragment, useState } from 'react'
import { fieldKey } from '../../lib/fieldTypes'
import { timeAgo } from '../../lib/format'

const MAX_COLS = 4

/** Human-readable rendering of a single answer value. */
const display = (v) => {
  if (v === undefined || v === null || v === '') return '—'
  if (Array.isArray(v)) return v.length ? v.join(', ') : '—'
  return String(v)
}

function ResponsesTab({ form, submissions, onCopyLink }) {
  const [expanded, setExpanded] = useState(null)

  const fields = Array.isArray(form.fields) ? form.fields : []
  const columns = fields.slice(0, MAX_COLS)
  const hasMoreCols = fields.length > MAX_COLS

  if (submissions.length === 0) {
    return (
      <div className="empty">
        <div className="art"><i className="bi bi-inbox"></i></div>
        <h3>No responses yet</h3>
        <p>Share your form to start collecting responses.</p>
        {form.published ? (
          <button className="btn-primary" style={{ margin: '0 auto' }} onClick={onCopyLink}>
            <i className="bi bi-link-45deg"></i>Copy share link
          </button>
        ) : (
          <p className="text-muted-sm">Publish the form first — it isn&apos;t accepting responses yet.</p>
        )}
      </div>
    )
  }

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th style={{ width: 34 }}></th>
            {columns.map((f) => (
              <th key={fieldKey(f)}>{f.label}</th>
            ))}
            {hasMoreCols && <th className="col-hide">…</th>}
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => {
            const isOpen = expanded === sub.id
            return (
              <Fragment key={sub.id}>
                <tr
                  className="resp-row"
                  onClick={() => setExpanded(isOpen ? null : sub.id)}
                >
                  <td>
                    <i className={`bi bi-chevron-${isOpen ? 'down' : 'right'} chev`}></i>
                  </td>
                  {columns.map((f) => (
                    <td key={fieldKey(f)} className="resp-cell">
                      {display(sub.data?.[fieldKey(f)])}
                    </td>
                  ))}
                  {hasMoreCols && <td className="col-hide muted-cell">…</td>}
                  <td className="muted-cell">{timeAgo(sub.createdAt)}</td>
                </tr>
                {isOpen && (
                  <tr className="resp-detail-row">
                    <td colSpan={columns.length + (hasMoreCols ? 3 : 2)}>
                      <div className="resp-detail">
                        {fields.map((f) => (
                          <div className="resp-detail-item" key={fieldKey(f)}>
                            <span className="resp-detail-label">{f.label}</span>
                            <span className="resp-detail-value">
                              {display(sub.data?.[fieldKey(f)])}
                            </span>
                          </div>
                        ))}
                        <div className="resp-detail-item">
                          <span className="resp-detail-label">Submitted</span>
                          <span className="resp-detail-value">
                            {new Date(sub.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>

      <div className="table-foot">
        <span className="info">
          <b>{submissions.length}</b> {submissions.length === 1 ? 'response' : 'responses'}
        </span>
      </div>
    </div>
  )
}

export default ResponsesTab
