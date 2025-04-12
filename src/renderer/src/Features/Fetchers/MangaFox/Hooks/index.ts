import { useQuery } from '@tanstack/react-query'
import {
  getSearchMangasMangaFox,
  getDetailMangasMangaFox,
  getMangasPagesMangaFox
} from '../Requests/MangaFoxAPI'

export function useGetSearchMangaFox(search: string) {
  return useQuery({
    queryKey: ['mangafoxsearch', search],
    queryFn: async () => {
      return getSearchMangasMangaFox(search)
    },
    enabled: false
  })
}

export function useGetDetailMangasMangaFox(search: string) {
  return useQuery({
    queryKey: ['mangafoxdetail', search],
    queryFn: async () => {
      return getDetailMangasMangaFox(search)
    },
    enabled: true,
    staleTime: 1000 * 60 * 60,
    refetchInterval: false,
    refetchOnWindowFocus: false
  })
}

export function useGetMangasPagesMangaFox(search?: string) {
  return useQuery({
    queryKey: ['mangafoxpages', search],
    queryFn: async () => {
      return getMangasPagesMangaFox(search!)
    },
    enabled: !!search
  })
}

export function useGetLatestChapterMangaFox(search?: string) {
  return useQuery({
    queryKey: ['mangafoxlatest', search],
    queryFn: async () => {
      return getMangasPagesMangaFox(search!)
    },
    enabled: !!search
  })
}
