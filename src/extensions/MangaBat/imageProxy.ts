import axios from 'axios'

export async function imageProxyMangaBat(url: string): Promise<{
  contentType: string
  data: string
}> {
  if (!url) {
    throw new Error('Missing image URL')
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        Referer: 'https://www.mangabats.com/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.7',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-CH-UA': '"Brave";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': '"Windows"',
        'Sec-GPC': '1'
      }
    })

    const contentType = response.headers['content-type'] ?? 'image/jpeg'
    const base64Data = Buffer.from(response.data).toString('base64')

    return {
      contentType,
      data: base64Data
    }
  } catch (error: any) {
    console.error('Image proxy error:', error.message, url)
    throw new Error(`Failed to fetch image from ${url}`)
  }
}
