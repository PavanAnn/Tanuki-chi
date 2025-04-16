// src/hooks/useMangaPages.ts
import { PageType } from '@renderer/types';
import { useQuery } from '@tanstack/react-query';

export const useMangaPages = (provider: string, chapterId: string) => {
  return useQuery<PageType[]>({
    queryKey: ['pages', provider, chapterId],
    queryFn: () => window.api.getExtensionResult(provider, 'pages', chapterId),
    enabled: !!chapterId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
