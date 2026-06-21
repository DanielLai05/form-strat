/**
 * Renders a real, fillable input for a form field (used on the public fill page).
 * Controlled via `value` / `onChange`. For checkboxes, value is an array.
 */
function FieldInput({ field, value, onChange, disabled }) {
  const { type, label, help, required, options = [], placeholder } = field
  const id = `field-${field.id || field.name || label}`

  const labelEl = (
    <label htmlFor={id} className="form-label fw-semibold">
      {label} {required && <span className="text-danger">*</span>}
    </label>
  )

  const helpEl = help ? <div className="form-text mb-2">{help}</div> : null

  let control

  if (type === 'textarea') {
    control = (
      <textarea
        id={id}
        className="form-control"
        rows="3"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    )
  } else if (type === 'select') {
    control = (
      <select
        id={id}
        className="form-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
      >
        <option value="">Choose…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    )
  } else if (type === 'radio') {
    control = (
      <div>
        {options.map((opt) => (
          <div className="form-check" key={opt}>
            <input
              className="form-check-input"
              type="radio"
              name={id}
              id={`${id}-${opt}`}
              checked={value === opt}
              onChange={() => onChange(opt)}
              disabled={disabled}
            />
            <label className="form-check-label" htmlFor={`${id}-${opt}`}>{opt}</label>
          </div>
        ))}
      </div>
    )
  } else if (type === 'checkbox') {
    const arr = Array.isArray(value) ? value : []
    const toggle = (opt) =>
      onChange(arr.includes(opt) ? arr.filter((o) => o !== opt) : [...arr, opt])
    control = (
      <div>
        {options.map((opt) => (
          <div className="form-check" key={opt}>
            <input
              className="form-check-input"
              type="checkbox"
              id={`${id}-${opt}`}
              checked={arr.includes(opt)}
              onChange={() => toggle(opt)}
              disabled={disabled}
            />
            <label className="form-check-label" htmlFor={`${id}-${opt}`}>{opt}</label>
          </div>
        ))}
      </div>
    )
  } else if (type === 'rating') {
    const max = field.max || 5
    control = (
      <div className="d-flex gap-1 fs-4">
        {Array.from({ length: max }).map((_, i) => {
          const n = i + 1
          return (
            <button
              key={n}
              type="button"
              className="btn p-0 border-0 bg-transparent lh-1"
              style={{ color: n <= (value || 0) ? '#f5b301' : '#d6dae1' }}
              onClick={() => !disabled && onChange(n)}
              disabled={disabled}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
            >
              <i className="bi bi-star-fill"></i>
            </button>
          )
        })}
      </div>
    )
  } else {
    // text, email, tel, number, date, file
    const inputType = type === 'file' ? 'file' : type
    control = (
      <input
        id={id}
        type={inputType}
        className="form-control"
        value={inputType === 'file' ? undefined : value || ''}
        onChange={(e) =>
          onChange(inputType === 'file' ? e.target.files?.[0]?.name || '' : e.target.value)
        }
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    )
  }

  return (
    <div className="mb-4">
      {labelEl}
      {helpEl}
      {control}
    </div>
  )
}

export default FieldInput
