import { useGetDetailMangasMangaFox, useGetMangasPagesMangaFox, useGetLatestChapterMangaFox } from "@renderer/Features/Fetchers/MangaFox/Hooks";
import { useGetDetailMangasWeebCentral, useGetMangasPagesWeebCentral, useGetLatestChapterWeebCentral } from "@renderer/Features/Fetchers/WeebCentral/Hooks";
import { getLatestChapterWeebCentral } from "@renderer/Features/Fetchers/WeebCentral/Requests/WeebCentralAPI";

export const detailProviderMap = {
  weebcentral: {
    useDetail: (link: string) => useGetDetailMangasWeebCentral({ queryKey: ['detail-weebcentral', link] }),
    usePages: (link: string) => useGetMangasPagesWeebCentral({ queryKey: ['pages-weebcentral', link] }),
    useLatest: useGetLatestChapterWeebCentral,
    getLatest: getLatestChapterWeebCentral,
    imageProxyPrefix: 'weebcentral'
  },
  mangafox: {
    useDetail: (link: string) => useGetDetailMangasMangaFox({ queryKey: ['detail-mangafox', link] }),
    usePages: (link: string) => useGetMangasPagesMangaFox({ queryKey: ['pages-mangafox', link] }),
    useLatest: useGetLatestChapterMangaFox,
    getLatest: useGetLatestChapterMangaFox,
    imageProxyPrefix: 'mangafox'
  }
}
