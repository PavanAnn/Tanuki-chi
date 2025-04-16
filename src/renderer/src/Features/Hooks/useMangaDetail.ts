// src/hooks/useMangaDetail.ts
import { useQuery } from '@tanstack/react-query';
import { DetailType } from '@renderer/types';

export const useMangaDetail = (provider: string, id: string) => {
  const detailQuery = useQuery<DetailType>({
    queryKey: ['detail', provider, id],
    queryFn: () => window.api.getExtensionResult(provider, 'detail', id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const chaptersQuery = useQuery<any[]>({
    queryKey: ['chapters', provider, id],
    queryFn: () => window.api.getExtensionResult(provider, 'chapters', id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return { detail: detailQuery.data, chapters: chaptersQuery.data, isLoading: detailQuery.isLoading || chaptersQuery.isLoading };
};
