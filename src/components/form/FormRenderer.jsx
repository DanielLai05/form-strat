import FieldInput from './FieldInput'
import { fieldKey } from '../../lib/fieldTypes'

/** Renders a form's title, description, and fillable fields from the JSON layout. */
function FormRenderer({ title, description, fields = [], answers = {}, onAnswer, disabled }) {
  return (
    <>
      <h1 className="h3 fw-bold mb-2">{title || 'Untitled form'}</h1>
      {description && <p className="text-secondary mb-4">{description}</p>}

      {fields.map((field) => {
        const key = fieldKey(field)
        return (
          <FieldInput
            key={key}
            field={field}
            value={answers[key]}
            onChange={(v) => onAnswer?.(key, v)}
            disabled={disabled}
          />
        )
      })}
    </>
  )
}

export default FormRenderer
