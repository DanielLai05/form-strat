export const CHOICE_TYPES = new Set(['select', 'radio', 'checkbox'])
export const NUMERIC_TYPES = new Set(['number', 'rating'])
export const pct = (n) => `${Math.round(n * 100)}%`

export function orderedEntries(distribution, options, type) {
  const entries = Object.entries(distribution || {})
  if (type !== 'checkbox' && Array.isArray(options) && options.length > 0) {
    const rank = new Map(options.map((o, i) => [o, i]))
    return [...entries].sort((a, b) => {
      const ra = rank.has(a[0]) ? rank.get(a[0]) : options.length
      const rb = rank.has(b[0]) ? rank.get(b[0]) : options.length
      return ra - rb || b[1] - a[1]
    })
  }
  return [...entries].sort((a, b) => b[1] - a[1])
}

export const isSplitField = (field) =>
  (field.type === 'radio' || field.type === 'select') &&
  Array.isArray(field.options) &&
  field.options.length === 2

export function ratingScale(field, fieldsJson) {
  const observed = Object.keys(field.ratingDistribution || {}).map(Number)
  const observedMax = observed.length ? Math.max(...observed) : 0
  const authored = (Array.isArray(fieldsJson) ? fieldsJson : []).find(
    (f) => (f.id ?? f.name ?? f.label) === field.name || f.label === field.label
  )
  return Math.max(authored?.max || 5, observedMax)
}

export function cumulative(series) {
  const out = []
  for (const d of series || []) {
    const prev = out.length ? out[out.length - 1].count : 0
    out.push({ date: d.date, count: prev + d.count })
  }
  return out
}

export function lastNDaysCount(series, days) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - (days - 1))
  cutoff.setHours(0, 0, 0, 0)
  return (series || [])
    .filter((d) => new Date(`${d.date}T00:00:00`) >= cutoff)
    .reduce((s, d) => s + d.count, 0)
}
