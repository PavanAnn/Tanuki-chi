import { useGetDetailMangasMangaFox, useGetMangasPagesMangaFox } from "@renderer/Features/Fetchers/MangaFox/Hooks";
import { useGetDetailMangasWeebCentral, useGetMangasPagesWeebCentral } from "@renderer/Features/Fetchers/WeebCentral/Hooks";

  
  export const detailProviderMap = {
    weebcentral: {
      useDetail: useGetDetailMangasWeebCentral,
      usePages: useGetMangasPagesWeebCentral,
      imageProxyPrefix: 'weebcentral'
    },
    mangafox: {
      useDetail: useGetDetailMangasMangaFox,
      usePages: useGetMangasPagesMangaFox,
      imageProxyPrefix: 'mangafox'
    }
  };
  