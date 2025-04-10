import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getBookmarks: () => ipcRenderer.invoke('get-bookmarks'),
  toggleBookmark: (title: string, link: string, coverHref: string, provider: string) =>
    ipcRenderer.invoke('toggle-bookmark', title, link, coverHref, provider),
  updateLatestRead: (title: string, link: string, latestRead: string | null) =>
    ipcRenderer.invoke('update-latest-read', title, link, latestRead),
  clearBookmarks: () => ipcRenderer.invoke('clear-bookmarks')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
