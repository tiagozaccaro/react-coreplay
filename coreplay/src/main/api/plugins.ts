import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { installPlugin, removePlugin, loadPlugins } from '../utils/plugin-loader'

export function registerPluginHandlers(): void {
  ipcMain.handle('plugin-install', async (_event: IpcMainInvokeEvent, cpxPath: string) => {
    try {
      const pluginId = installPlugin(cpxPath)
      return pluginId
    } catch (err) {
      console.error('Error installing plugin:', err)
      return null
    }
  })

  ipcMain.handle('plugin-remove', async (_event: IpcMainInvokeEvent, pluginId: string) => {
    try {
      removePlugin(pluginId)
      return true
    } catch (err) {
      console.error('Error removing plugin:', err)
      return false
    }
  })

  ipcMain.handle('plugin-load', async () => {
    try {
      await loadPlugins()
      return true
    } catch (err) {
      console.error('Error loading plugins:', err)
      return false
    }
  })
}
