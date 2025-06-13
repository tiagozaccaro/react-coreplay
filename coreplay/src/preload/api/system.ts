import { ipcRenderer } from 'electron'

export async function openFileDialog(): Promise<string | null> {
  return ipcRenderer.invoke('open-file-dialog')
}

export interface SystemAPI {
  openFileDialog(): Promise<string | null>
}
