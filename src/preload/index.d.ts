import { ElectronAPI } from '@electron-toolkit/preload'

interface UpdateNotification {
  title: string
  link: string
  provider: string
  newChapter: string
  date: string
}

export interface ExtensionMetadata {
  id: string;
  version: string;
  name: string;
  url: string;
  proxy: boolean;
}


export interface IElectronAPI {
  getBookmarks: () => Promise<
    {
      title: string
      link: string
      coverHref: string
      provider: string
      latestRead?: string
      latestChapter: string
      createdAt: string
      updatedAt: string
    }[]
  >

  toggleBookmark: (
    title: string,
    link: string,
    coverHref: string,
    provider: string,
    latestRead?: string,
    latestChapter?: string
  ) => Promise<
    {
      title: string
      link: string
      coverHref: string
      provider: string
      latestRead?: string
      latestChapter: string
      createdAt: string
      updatedAt: string
    }[]
  >

  updateLatestRead: (
    title: string,
    link: string,
    latestRead: string | null
  ) => Promise<
    {
      title: string
      link: string
      latestRead?: string
    }[]
  >

  updateLatestChapter: (
    title: string,
    link: string,
    provider: string,
    latestChapter: string
  ) => Promise<
    {
      title: string
      link: string
      provider: string
      latestChapter: string
    }[]
  >

  clearBookmarks: () => Promise<[]>
  // IPC 
  getExtensionResult: (
    provider: string,
    action: 'search' | 'detail' | 'chapters' | 'pages' | 'latest' | 'proxy',
    payload: any
  ) => Promise<any>;

  proxyImage: (url: string) => Promise<{ contentType: string; data: string }>;

  // Notifications
  getUpdateNotifications: () => Promise<UpdateNotification[]>
  addUpdateNotification: (n: UpdateNotification) => Promise<void>
  clearUpdateNotifications:  () => Promise<[]>

  getExtensions: () => Promise<Record<string, ExtensionMetadata>>;

}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
    electronAPI: IElectronAPI
  }
}
