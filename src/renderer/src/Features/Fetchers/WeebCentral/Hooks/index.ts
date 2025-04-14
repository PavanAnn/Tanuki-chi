import { useQuery } from '@tanstack/react-query'
import {
  getSearchMangasWeebCentral,
  getDetailMangasWeebCentral,
  getMangasPagesWeebCentral,
  getLatestChapterWeebCentral
} from '../Requests/WeebCentralAPI'

/* export function useGetWeebCentral(page: number) {
    return useQuery({
        queryKey: ['weebcentral', page],
        queryFn: async () => {
            return getMangasWeebCentral(page)
        }
    })
} */

export function useGetSearchWeebCentral(search: string) {
  return useQuery({
    queryKey: ['weebcentralsearch', search],
    queryFn: async () => {
      return getSearchMangasWeebCentral(search)
    },
    enabled: false
  })
}

export function useGetDetailMangasWeebCentral(search: string) {
  return useQuery({
    queryKey: ['weebcentraldetail', search],
    queryFn: async () => {
      return getDetailMangasWeebCentral(search)
    },
    enabled: true,
    staleTime: 1000 * 60 * 60,
    refetchInterval: false,
    refetchOnWindowFocus: false
  })
}

export function useGetMangasPagesWeebCentral(search?: string) {
  return useQuery({
    queryKey: ['weebcentralpages', search],
    queryFn: async () => {
      return getMangasPagesWeebCentral(search!)
    },
    enabled: !!search
  })
}

export function useGetLatestChapterWeebCentral(search?: string) {
  return useQuery({
    queryKey: ['weebcentrallatest', search],
    queryFn: async () => {
      return getLatestChapterWeebCentral(search!)
    }
  })
}
