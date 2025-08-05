// src/hooks/useProxiedImage.ts
import { useEffect, useState } from 'react'

export const useSingleProxiedImage = (extensionName: string, url: string): string | null => {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchProxiedImage = async () => {
      try {
        const result = await window.api.getExtensionResult(extensionName, 'proxy', url)
        if (isMounted) {
          setSrc(`data:${result.contentType};base64,${result.data}`)
        }
      } catch (err) {
        console.error(`Failed to proxy image for ${extensionName}:`, err)
        if (isMounted) setSrc(null)
      }
    }

    if (extensionName && url) {
      fetchProxiedImage()
    }

    return () => {
      isMounted = false
    }
  }, [extensionName, url])

  return src
}
