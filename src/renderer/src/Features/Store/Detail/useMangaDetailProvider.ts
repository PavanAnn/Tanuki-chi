import { getLatestChapterWeebCentral } from '@renderer/Features/Fetchers/WeebCentral/Requests/WeebCentralAPI'

import {
  useGetDetailMangasMangaFox,
  useGetMangasPagesMangaFox,
  useGetLatestChapterMangaFox
} from '@renderer/Features/Fetchers/MangaFox/Hooks'
import {
  useGetDetailMangasWeebCentral,
  useGetMangasPagesWeebCentral,
  useGetLatestChapterWeebCentral
} from '@renderer/Features/Fetchers/WeebCentral/Hooks'

export const detailProviderMap = {
  weebcentral: {
    useDetail: useGetDetailMangasWeebCentral,
    usePages: useGetMangasPagesWeebCentral,
    useLatest: useGetLatestChapterWeebCentral, // still used in React context
    getLatest: getLatestChapterWeebCentral, // for imperative code like updates
    imageProxyPrefix: 'weebcentral'
  },
  mangafox: {
    useDetail: useGetDetailMangasMangaFox,
    usePages: useGetMangasPagesMangaFox,
    useLatest: useGetLatestChapterMangaFox,
    getLatest: useGetLatestChapterMangaFox,
    imageProxyPrefix: 'mangafox'
  }
}
