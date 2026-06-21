import { timeAgo } from '../../lib/format'

const COLORS = ['fic-blue', 'fic-violet', 'fic-emerald', 'fic-amber', 'fic-rose']

function FormCard({ form, index, onOpen }) {
  const colorClass = COLORS[index % COLORS.length]
  const responses = form.submissionCount ?? 0
  const fieldCount = Array.isArray(form.fields) ? form.fields.length : 0

  return (
    <button className="fcard" onClick={() => onOpen(form)}>
      <div className="row1">
        <span className={`ficon ${colorClass}`}>
          <i className="bi bi-file-earmark-text"></i>
        </span>
        {form.published ? (
          <span className="status live"><span className="d"></span>Live</span>
        ) : (
          <span className="status draft"><span className="d"></span>Draft</span>
        )}
      </div>

      <h3>{form.title}</h3>
      <p className="sub">{form.description || 'No description'}</p>

      <div className="foot">
        <div className="metric"><b>{responses}</b><span>responses</span></div>
        <div className="metric"><b>{fieldCount}</b><span>fields</span></div>
        <span className="when">{timeAgo(form.updatedAt || form.createdAt)}</span>
      </div>
    </button>
  )
}

export default FormCard
