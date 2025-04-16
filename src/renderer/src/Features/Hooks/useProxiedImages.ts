// src/hooks/useProxiedImages.ts
import { PageType } from '@renderer/types';
import { useEffect, useState } from 'react';

export const useProxiedImages = (pages: PageType[]) => {
  const [proxiedImages, setProxiedImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAllImages = async () => {
      const entries = await Promise.all(
        pages.map(async (page) => {
          try {
            const result = await window.api.proxyImage(page.href);
            return [page.href, `data:${result.contentType};base64,${result.data}`];
          } catch (err) {
            console.error(`Failed to fetch image: ${page.href}`, err);
            return [page.href, '']; // fallback to empty
          }
        })
      );
      setProxiedImages(Object.fromEntries(entries));
    };

    if (pages.length > 0) {
      fetchAllImages();
    }
  }, [pages]);

  return proxiedImages;
};
