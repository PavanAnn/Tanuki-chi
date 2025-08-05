const proxyRequiredFor = new Set(['mangabat'])

export const requiresProxy = (provider: string) => proxyRequiredFor.has(provider)

export const fetchProxiedImages = async (
  data: any[],
  currentProxied: Record<string, string>
): Promise<Record<string, string>> => {
  const entries: [string, string][] = []

  for (const providerEntry of data) {
    const providerName = Object.keys(providerEntry)[0]
    const mangas = providerEntry[providerName]

    if (!requiresProxy(providerName)) continue

    for (const manga of mangas) {
      const url = manga.coverUrl
      if (currentProxied[url]) continue

      try {
        const result = await window.api.getExtensionResult(providerName, 'proxy', url)
        entries.push([url, `data:${result.contentType};base64,${result.data}`])
      } catch (err) {
        console.error(`Failed to proxy image for ${providerName}: ${url}`, err)
      }
    }
  }

  return Object.fromEntries(entries)
}
