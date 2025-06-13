import { ipcMain } from 'electron'
import { getSettings, saveSettings } from '../utils/settings'

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings-get', () => {
    return getSettings()
  })

  ipcMain.handle('settings-save', (_event, settings: Record<string, unknown>) => {
    saveSettings(settings)
  })
}
