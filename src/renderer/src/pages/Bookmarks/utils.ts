export const extractChapterNumber = (chapter: string): number => {
  const match = chapter?.match(/\d+(\.\d+)?/)
  return match ? parseFloat(match[0]) : 0
}

export const getUnreadChapters = (latestRead: string, latestChapter: string): number => {
  const read = extractChapterNumber(latestRead)
  const latest = extractChapterNumber(latestChapter)
  const diff = latest - read
  return diff > 0 ? Math.ceil(diff) : 0
}
