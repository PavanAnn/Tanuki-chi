export function formatReleaseTime(isoString: string): string {
  const releaseDate = new Date(isoString)
  const now = new Date()

  // Check if it's the same day
  const isSameDay =
    releaseDate.getFullYear() === now.getFullYear() &&
    releaseDate.getMonth() === now.getMonth() &&
    releaseDate.getDate() === now.getDate()

  if (isSameDay) {
    const diffMs = now.getTime() - releaseDate.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 0) {
      return `${diffHours}h${diffMinutes > 0 ? ` ${diffMinutes}min` : ''}`
    }
    return `${diffMinutes}min`
  }

  // Format as "Jul 29, 2025"
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return releaseDate.toLocaleDateString(undefined, options)
}
