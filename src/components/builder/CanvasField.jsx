/** Non-interactive preview of a field inside the builder canvas. */
function FieldPreview({ field }) {
  const { type, options = [] } = field

  if (type === 'textarea') return <div className="f-input f-textarea"></div>
  if (type === 'select') return <div className="f-input">Choose…</div>

  if (type === 'radio' || type === 'checkbox') {
    return (
      <div className="f-choices">
        {options.map((opt, i) => (
          <div className="f-choice" key={i}>
            <span className={type === 'radio' ? 'ring' : 'box'}></span>
            {opt}
          </div>
        ))}
      </div>
    )
  }

  if (type === 'rating') {
    return (
      <div className="f-rating">
        {Array.from({ length: field.max || 5 }).map((_, i) => (
          <i className="bi bi-star-fill" key={i}></i>
        ))}
      </div>
    )
  }

  const placeholder = {
    text: 'Short answer text',
    email: 'name@example.com',
    tel: '+1 555 000 0000',
    number: '0',
    date: 'mm / dd / yyyy',
    file: 'Choose a file…',
  }[type] || 'Answer'

  return <div className="f-input">{placeholder}</div>
}

function CanvasField({ field, selected, onSelect, onDuplicate, onDelete, dragProps }) {
  return (
    <div
      className={`field-block${selected ? ' sel' : ''}`}
      onClick={() => onSelect(field.id)}
      {...dragProps}
    >
      <span className="grip" title="Drag to reorder"><i className="bi bi-grip-vertical"></i></span>
      <div className="actions">
        <span
          className="fa-btn"
          title="Duplicate"
          onClick={(e) => { e.stopPropagation(); onDuplicate(field.id) }}
        >
          <i className="bi bi-files"></i>Duplicate
        </span>
        <span
          className="fa-btn del"
          title="Delete"
          onClick={(e) => { e.stopPropagation(); onDelete(field.id) }}
        >
          <i className="bi bi-trash"></i>Delete
        </span>
      </div>

      <p className="flabel">
        {field.label}
        {field.required && <span className="req">*</span>}
      </p>
      {field.help && <div className="form-text" style={{ marginTop: -4, marginBottom: 8 }}>{field.help}</div>}
      <FieldPreview field={field} />
    </div>
  )
}

export default CanvasField
