import { ipcRenderer } from 'electron'

export async function getSettings(): Promise<Record<string, unknown>> {
  return ipcRenderer.invoke('settings-get')
}

export async function saveSettings(settings: Record<string, unknown>): Promise<void> {
  return ipcRenderer.invoke('settings-save', settings)
}

export interface SettingsAPI {
  getSettings(): Promise<Record<string, unknown>>
  saveSettings(settings: Record<string, unknown>): Promise<void>
}
