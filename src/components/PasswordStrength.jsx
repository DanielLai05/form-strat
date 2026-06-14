import { getPasswordStrength, STRENGTH_SEGMENTS } from '../lib/validation'

/**
 * Segmented password-strength meter with a label (Weak → Strong).
 * Always rendered (hidden until there's input) so it reserves its space and
 * doesn't cause a layout shift when it appears.
 */
function PasswordStrength({ value }) {
  const { score, label, color } = getPasswordStrength(value)

  return (
    <div
      className="d-flex align-items-center gap-2 mt-2"
      style={{ visibility: value ? 'visible' : 'hidden' }}
      aria-hidden={!value}
    >
      <div className="d-flex gap-1 flex-grow-1">
        {Array.from({ length: STRENGTH_SEGMENTS }).map((_, i) => (
          <span
            key={i}
            className="strength-seg"
            style={{ backgroundColor: i < score ? color : '#e9ecef' }}
          />
        ))}
      </div>
      <small className="fw-semibold" style={{ color }}>
        {label || ' '}
      </small>
    </div>
  )
}

export default PasswordStrength
