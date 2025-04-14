export const extractChapterNumber = (chapter: string): number => {
  const match = chapter?.match(/\d+/)
  return match ? parseInt(match[0], 10) : 0
}

export const getUnreadChapters = (latestRead: string, latestChapter: string): number => {
  const read = extractChapterNumber(latestRead)
  const latest = extractChapterNumber(latestChapter)
  const diff = latest - read
  return diff > 0 ? diff : 0
}
