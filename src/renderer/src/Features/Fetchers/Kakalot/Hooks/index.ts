import { useQuery } from '@tanstack/react-query'
import { getMangasKakalot, getSearchMangasKakalot } from '../Requests/KakalotAPI'

export function useGetKakalot(page: number) {
  return useQuery({
    queryKey: ['kakalot', page],
    queryFn: async () => {
      return getMangasKakalot(page)
    }
  })
}

export function useGetSearchKakalot(search: string) {
  return useQuery({
    queryKey: ['kakalot', search],
    queryFn: async () => {
      return getSearchMangasKakalot(search)
    },
    enabled: false
  })
}
