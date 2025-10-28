import { SearchType } from '@renderer/types'

// Normalize manga name for grouping (lowercase, remove spaces and special characters)
export const normalizeMangaName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w]/g, '') // Remove all non-alphanumeric characters
}

export interface GroupedManga {
  normalizedName: string
  displayName: string
  providers: Array<{
    provider: string
    manga: SearchType
    isLoading: boolean
  }>
  coverUrl?: string
}

export const groupMangasByName = (
  searchResults: Array<Record<string, SearchType[]>>,
  loadingProviders: Set<string>
): GroupedManga[] => {
  const grouped = new Map<string, GroupedManga>()

  // Group mangas from loaded providers
  searchResults.forEach((providerEntry) => {
    const providerName = Object.keys(providerEntry)[0]
    const mangas = providerEntry[providerName]

    mangas.forEach((manga) => {
      const normalized = normalizeMangaName(manga.title)

      if (!grouped.has(normalized)) {
        grouped.set(normalized, {
          normalizedName: normalized,
          displayName: manga.title, // Use first occurrence as display name
          providers: [],
          coverUrl: manga.coverUrl
        })
      }

      const group = grouped.get(normalized)!
      group.providers.push({
        provider: providerName,
        manga,
        isLoading: false
      })

      // Use cover URL from first provider if not set
      if (!group.coverUrl && manga.coverUrl) {
        group.coverUrl = manga.coverUrl
      }
    })
  })

  return Array.from(grouped.values()).sort((a, b) => 
    a.displayName.localeCompare(b.displayName)
  )
}

