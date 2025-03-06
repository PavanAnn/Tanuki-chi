import { useQuery } from "@tanstack/react-query";
import { getSearchMangasWeebCentral, getDetailMangasWeebCentral } from "../Requests/WeebCentralAPI";

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
        queryKey: ['weebcentral', search],
        queryFn: async () => {
            return getSearchMangasWeebCentral(search)
        },
        enabled: false,
    })
}

export function useGetDetailMangasWeebCentral(search: string) {
    return useQuery({
        queryKey: ['weebcentral', search],
        queryFn: async () => {
            return getDetailMangasWeebCentral(search)
        },
        enabled: true,
        staleTime: 1000 * 60 * 60,
        refetchInterval: false,
        refetchOnWindowFocus: false
    })
}