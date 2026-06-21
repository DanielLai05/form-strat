/** "2h ago", "3d ago", "just now" — compact relative time from a date string. */
export function timeAgo(dateInput) {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w ago`
  return date.toLocaleDateString()
}

/** Up to two uppercase initials from a name or email. */
export function initials(nameOrEmail) {
  if (!nameOrEmail) return 'U'
  const base = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail
  const parts = base.trim().split(/[\s._-]+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((p) => p[0]).join('')
  return (letters || base[0] || 'U').toUpperCase()
}
