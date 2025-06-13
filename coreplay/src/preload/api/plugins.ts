import { ipcRenderer } from 'electron'

export async function installPlugin(cpxPath: string): Promise<string | null> {
  return ipcRenderer.invoke('plugin-install', cpxPath)
}

export async function removePlugin(pluginId: string): Promise<boolean> {
  return ipcRenderer.invoke('plugin-remove', pluginId)
}

export async function loadPlugins(): Promise<void> {
  return ipcRenderer.invoke('plugin-load')
}

export interface PluginAPI {
  installPlugin(cpxPath: string): Promise<string | null>
  removePlugin(pluginId: string): Promise<boolean>
  loadPlugins(): Promise<void>
}
