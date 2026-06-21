import { getFieldType, isChoiceType } from '../../lib/fieldTypes'

const TEXTY = ['text', 'email', 'tel', 'number', 'textarea']

function PropertiesPanel({ field, onChange }) {
  const setOption = (i, val) => {
    const options = [...(field.options || [])]
    options[i] = val
    onChange({ options })
  }
  const addOption = () =>
    onChange({ options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] })
  const removeOption = (i) =>
    onChange({ options: (field.options || []).filter((_, idx) => idx !== i) })

  const def = field ? getFieldType(field.type) : null

  return (
    <aside className="panel right">
      <div className="panel-head"><h2>Field settings</h2></div>

      {!field && (
        <div className="pgroup">
          <p className="text-secondary small mb-0">
            Select a field on the canvas to edit its settings.
          </p>
        </div>
      )}

      {field && (
        <>
          <div className="prop-sel">
            <span className="pi"><i className={`bi ${def.icon}`}></i></span>
            <div><b>{def.label}</b><span>Selected field</span></div>
          </div>

          <div className="panel-scroll">
            <div className="pgroup">
              <div className="pg-title">Content</div>
              <div className="pfield">
                <label>Title</label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => onChange({ label: e.target.value })}
                />
              </div>
              <div className="pfield">
                <label>Description</label>
                <textarea
                  value={field.help || ''}
                  onChange={(e) => onChange({ help: e.target.value })}
                  placeholder="Add a description shown under the title…"
                />
              </div>
              {TEXTY.includes(field.type) && (
                <div className="pfield">
                  <label>Placeholder</label>
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => onChange({ placeholder: e.target.value })}
                  />
                </div>
              )}
            </div>

            {isChoiceType(field.type) && (
              <div className="pgroup">
                <div className="pg-title">Options</div>
                <div className="opt-list">
                  {(field.options || []).map((opt, i) => (
                    <div className="opt-row" key={i}>
                      <span className="drag"><i className="bi bi-grip-vertical"></i></span>
                      <input value={opt} onChange={(e) => setOption(i, e.target.value)} />
                      <span className="x" onClick={() => removeOption(i)}>
                        <i className="bi bi-x-lg"></i>
                      </span>
                    </div>
                  ))}
                </div>
                <button className="add-opt" onClick={addOption}>
                  <i className="bi bi-plus-lg"></i>Add option
                </button>
              </div>
            )}

            {field.type === 'rating' && (
              <div className="pgroup">
                <div className="pg-title">Scale</div>
                <div className="pfield">
                  <label>Number of stars</label>
                  <select
                    value={field.max || 5}
                    onChange={(e) => onChange({ max: Number(e.target.value) })}
                  >
                    {[3, 4, 5, 7, 10].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="pgroup">
              <div className="pg-title">Validation</div>
              <div className="toggle-row">
                <span className="tl">Required<small>Respondent must answer</small></span>
                <button
                  className={`switch${field.required ? ' on' : ''}`}
                  onClick={() => onChange({ required: !field.required })}
                  aria-pressed={field.required}
                  aria-label="Toggle required"
                ></button>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  )
}

export default PropertiesPanel
