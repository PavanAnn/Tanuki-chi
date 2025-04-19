// updatesStore.ts
import Store from 'electron-store'

interface UpdateNotification {
  title: string
  link: string
  provider: string
  newChapter: string
  date: string
}

const updatesStore: any = new Store<{ updates: UpdateNotification[] }>({
  name: 'updates',
  defaults: {
    updates: []
  }
})

export const getUpdateNotifications = (): UpdateNotification[] => {
  return updatesStore.get('updates', [])
}

export const addUpdateNotification = (notification: UpdateNotification): void => {
  const current = getUpdateNotifications()

  // Avoid duplicates (by title + chapter)
  const exists = current.some(
    (n) =>
      n.title === notification.title &&
      n.link === notification.link &&
      n.provider === notification.provider &&
      n.newChapter === notification.newChapter
  )
  if (!exists) {
    updatesStore.set('updates', [...current, notification])
  }
}

export const clearUpdateNotifications = (): void => {
  updatesStore.set('updates', [])
}
