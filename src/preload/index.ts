import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getBookmarks: () => ipcRenderer.invoke('get-bookmarks'),

  toggleBookmark: (
    title: string,
    link: string,
    coverHref: string,
    provider: string,
    latestRead?: string,
    latestChapter?: string
  ) =>
    ipcRenderer.invoke(
      'toggle-bookmark',
      title,
      link,
      coverHref,
      provider,
      latestRead,
      latestChapter
    ),

  updateLatestRead: (title: string, link: string, latestRead: string | null) =>
    ipcRenderer.invoke('update-latest-read', title, link, latestRead),

  updateLatestChapter: (title: string, link: string, provider: string, latestChapter: string) =>
    ipcRenderer.invoke('update-latest-chapter', title, link, provider, latestChapter),

  clearBookmarks: () => ipcRenderer.invoke('clear-bookmarks'),
  // IPC
  getExtensionResult: (provider: string, action: 'search' | 'detail' | 'chapters' | 'pages' | 'latest', payload: any) =>
    ipcRenderer.invoke('extension:invoke', provider, action, payload),
  proxyImage: (url: string) => ipcRenderer.invoke('image:proxy', url),
  getUpdateNotifications: () => ipcRenderer.invoke('get-update-notifications'),
  addUpdateNotification: (n) => ipcRenderer.invoke('add-update-notification', n),
  clearUpdateNotifications: () => ipcRenderer.invoke('clear-update-notifications')
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
