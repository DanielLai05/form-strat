import { useState } from 'react'

/**
 * Password field with a show/hide toggle button (Bootstrap Icons eye).
 * Drop-in for a labelled password input — manages its own visibility state.
 */
function PasswordInput({
  id = 'password',
  label = 'Password',
  value,
  onChange,
  placeholder = '••••••••',
  required = true,
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="input-group">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className="form-control"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setShow((prev) => !prev)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
        >
          <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`}></i>
        </button>
      </div>
    </div>
  )
}

export default PasswordInput
