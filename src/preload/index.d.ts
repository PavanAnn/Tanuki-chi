import { ElectronAPI } from '@electron-toolkit/preload'

export interface IElectronAPI {
  getBookmarks: () => Promise<{ title: string; link: string }[]>;
  toggleBookmark: (title: string, link: string) => Promise<{ title: string; link: string }[]>;
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
    electronAPI: IElectronAPI
  }
}