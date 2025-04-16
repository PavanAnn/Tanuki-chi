import { ipcMain } from 'electron';
import axios from 'axios';

ipcMain.handle('image:proxy', async (_event, url: string) => {
  if (!url) {
    throw new Error('Missing image URL');
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        Referer: 'https://weebcentral.com/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
        Accept:
          'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Sec-CH-UA': `"Not/A)Brand";v="8", "Chromium";v="126"`,
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': `"Windows"`,
      },
    });

    // Convert binary data into base64 encoded string.
    const base64Data = Buffer.from(response.data).toString('base64');
    const contentType = response.headers['content-type'];
    
    // Return an object similar to your Express response,
    // with the Content-Type and base64 image data.
    return {
      contentType,
      data: base64Data,
    };
  } catch (error: any) {
    console.error('Image proxy error:', error.message, url);
    throw new Error(`Failed to fetch image ${url}`);
  }
});
