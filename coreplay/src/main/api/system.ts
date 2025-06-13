import { dialog, ipcMain } from 'electron'

export function registerSystemHandlers(): void {
  ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'CPX Files', extensions: ['cpx'] }]
    })
    if (result.canceled) return null
    return result.filePaths[0]
  })
}
