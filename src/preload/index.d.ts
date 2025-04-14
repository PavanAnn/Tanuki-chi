import { ElectronAPI } from '@electron-toolkit/preload'

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
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
    electronAPI: IElectronAPI
  }
}
