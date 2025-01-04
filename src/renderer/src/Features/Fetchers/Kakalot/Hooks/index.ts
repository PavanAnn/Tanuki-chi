import { useQuery } from "@tanstack/react-query";
import { getMangasKakalot } from "../Requests/KakalotAPI";

export function useGetKakalot(page: string) {
    return useQuery({
        queryKey: ['kakalot', page],
        queryFn: async () => {
            return getMangasKakalot(page)
        }
    })
}