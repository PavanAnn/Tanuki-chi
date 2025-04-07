import { ElectronAPI } from '@electron-toolkit/preload'

export interface IElectronAPI {
  getBookmarks: () => Promise<{ title: string; link: string; coverHref: string; latestRead?: string }[]>
  toggleBookmark: (
    title: string,
    link: string,
    coverHref: string
  ) => Promise<{ title: string; link: string; coverHref: string }[]>
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
