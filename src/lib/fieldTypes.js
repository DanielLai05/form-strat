/**
 * Field-type catalog for the form builder. Each form's layout is an array of
 * field objects (this shape) stored as JSON in forms.fields. The builder edits
 * it and the fill page renders from it — same JSON, both directions.
 *
 * Field shape:
 *   { id, type, label, help, required, placeholder?, options?, max? }
 */
export const FIELD_TYPES = [
  { type: 'text', label: 'Short text', icon: 'bi-input-cursor-text', group: 'Text' },
  { type: 'textarea', label: 'Paragraph', icon: 'bi-text-paragraph', group: 'Text' },
  { type: 'email', label: 'Email', icon: 'bi-envelope', group: 'Text' },
  { type: 'tel', label: 'Phone', icon: 'bi-telephone', group: 'Text' },
  { type: 'radio', label: 'Multiple choice', icon: 'bi-ui-radios', group: 'Choice', choices: true },
  { type: 'checkbox', label: 'Checkboxes', icon: 'bi-ui-checks', group: 'Choice', choices: true },
  { type: 'select', label: 'Dropdown', icon: 'bi-menu-button-wide', group: 'Choice', choices: true },
  { type: 'rating', label: 'Rating', icon: 'bi-star', group: 'Choice' },
  { type: 'date', label: 'Date', icon: 'bi-calendar-event', group: 'Advanced' },
  { type: 'file', label: 'File upload', icon: 'bi-paperclip', group: 'Advanced' },
  { type: 'number', label: 'Number', icon: 'bi-123', group: 'Advanced' },
]

const BY_TYPE = Object.fromEntries(FIELD_TYPES.map((f) => [f.type, f]))

export const getFieldType = (type) => BY_TYPE[type] || FIELD_TYPES[0]

export const isChoiceType = (type) => Boolean(BY_TYPE[type]?.choices)

/** Groups in palette order: { Text: [...], Choice: [...], Advanced: [...] }. */
export const FIELD_GROUPS = FIELD_TYPES.reduce((acc, f) => {
  ;(acc[f.group] ||= []).push(f)
  return acc
}, {})

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `f_${Math.random().toString(36).slice(2, 10)}`

/** Create a new field with sensible defaults for the given type. */
export function createField(type) {
  const def = getFieldType(type)
  const field = {
    id: uid(),
    type: def.type,
    label: def.label,
    help: '',
    required: false,
  }
  if (def.choices) field.options = ['Option 1', 'Option 2', 'Option 3']
  if (def.type === 'rating') field.max = 5
  return field
}

/** A stable key for storing/reading a field's answer in submission data. */
export const fieldKey = (field) => field.id || field.name || field.label
