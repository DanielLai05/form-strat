import { useState } from 'react'
import { FIELD_GROUPS, FIELD_TYPES } from '../../lib/fieldTypes'

/** Left panel: searchable list of field types. Click a block to add it. */
function FieldPalette({ onAdd }) {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const groups = q
    ? { Results: FIELD_TYPES.filter((f) => f.label.toLowerCase().includes(q)) }
    : FIELD_GROUPS

  return (
    <aside className="panel left">
      <div className="panel-head"><h2>Add a field</h2></div>
      <div className="pal-search">
        <i className="bi bi-search"></i>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search fields…"
        />
      </div>
      <div className="panel-scroll">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <div className="pal-group">{group}</div>
            <div className="blocks">
              {items.map((f) => (
                <button
                  key={f.type}
                  className="block"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/x-new-field', f.type)
                    e.dataTransfer.effectAllowed = 'copy'
                  }}
                  onClick={() => onAdd(f.type)}
                >
                  <span className="b-ic"><i className={`bi ${f.icon}`}></i></span>
                  <b>{f.label}</b>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default FieldPalette
