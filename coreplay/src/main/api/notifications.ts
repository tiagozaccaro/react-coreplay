import { ipcMain, Notification } from 'electron'

export function registerNotificationHandlers(): void {
  ipcMain.on('notification-show', (_event, message: string) => {
    new Notification({ title: 'Notification', body: message }).show()
  })
}
