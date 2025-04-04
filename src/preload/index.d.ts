import { ElectronAPI } from '@electron-toolkit/preload'

export interface IElectronAPI {
  getBookmarks: () => Promise<{ title: string; link: string; coverHref: string }[]>;
  toggleBookmark: (title: string, link: string, coverHref: string) => Promise<{ title: string; link: string; coverHref: string }[]>;
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
    electronAPI: IElectronAPI
  }
}