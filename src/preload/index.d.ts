import { ElectronAPI } from '@electron-toolkit/preload'

export interface IElectronAPI {
  getBookmarks: () => Promise<
    { title: string; link: string; coverHref: string; provider: string; latestRead?: string }[]
  >
  toggleBookmark: (
    title: string,
    link: string,
    coverHref: string,
    provider: string
  ) => Promise<{ title: string; link: string; coverHref: string; provider: string }[]>
  updateLatestRead: (
    title: string,
    link: string,
    latestRead: string | null
  ) => Promise<{ title: string; link: string; latestRead: string }[]>

  clearBookmarks: () => Promise<[]>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
    electronAPI: IElectronAPI
  }
}
