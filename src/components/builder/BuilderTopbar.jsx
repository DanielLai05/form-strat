import { Link } from 'react-router-dom'
import logo from '../../assets/form-strat-logo-transparent-minimal.png'

function BuilderTopbar({
  name,
  onName,
  published,
  mode,
  onMode,
  saving,
  saved,
  onSave,
  onPublish,
}) {
  return (
    <header className="topbar">
      <Link className="back" to="/dashboard">
        <i className="bi bi-arrow-left"></i>Back
      </Link>
      <span className="tb-sep"></span>
      <span className="tb-logo"><img src={logo} alt="" /></span>

      <div className="form-name">
        <input
          value={name}
          onChange={(e) => onName(e.target.value)}
          aria-label="Form name"
        />
        <span className="edit"><i className="bi bi-pencil"></i></span>
        <span className={`status-pill ${published ? 'live' : 'draft'}`}>
          <span className="d"></span>{published ? 'Live' : 'Draft'}
        </span>
      </div>

      <span className="tb-spacer"></span>

      {saving ? (
        <span className="saved"><i className="bi bi-arrow-repeat"></i>Saving…</span>
      ) : saved ? (
        <span className="saved"><i className="bi bi-check-lg"></i>Saved</span>
      ) : null}

      <div className="seg">
        <button className={mode === 'build' ? 'on' : ''} onClick={() => onMode('build')}>
          <i className="bi bi-list"></i>Build
        </button>
        <button className={mode === 'preview' ? 'on' : ''} onClick={() => onMode('preview')}>
          <i className="bi bi-eye"></i>Preview
        </button>
      </div>

      <button className="btn-ghost" onClick={onSave} disabled={saving}>Save</button>
      <button className="btn-primary" onClick={onPublish} disabled={saving}>
        <i className="bi bi-send"></i>{published ? 'Update' : 'Publish'}
      </button>
    </header>
  )
}

export default BuilderTopbar
