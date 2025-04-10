import { getSearchMangasMangaFox } from '../Fetchers/MangaFox/Requests/MangaFoxAPI'
import { getSearchMangasWeebCentral } from '../Fetchers/WeebCentral/Requests/WeebCentralAPI'

export async function getAllProviderSearchResults(searchTerm: string) {
  const [weebcentral, mangafox] = await Promise.allSettled([
    getSearchMangasWeebCentral(searchTerm),
    getSearchMangasMangaFox(searchTerm)
  ])

  const wrapResult = (provider: string, result: any) => ({
    [provider]: result?.value?.response?.data || []
  })

  const results: Array<Record<string, any>> = []
  if (weebcentral.status === 'fulfilled') results.push(wrapResult('weebcentral', weebcentral))
  if (mangafox.status === 'fulfilled') results.push(wrapResult('mangafox', mangafox))

  return results
}
