import { ipcRenderer } from 'electron'

export function showNotification(message: string): void {
  ipcRenderer.send('notification-show', message)
}

export interface NotificationAPI {
  showNotification(message: string): void
}
