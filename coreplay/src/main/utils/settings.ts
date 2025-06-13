import { app } from 'electron'
import path from 'path'
import fs from 'fs'

const settingsPath = path.resolve(app.getPath('userData'), 'plugin-settings.json')

export function getSettings(): Record<string, unknown> {
  if (!fs.existsSync(settingsPath)) return {}
  try {
    return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
  } catch {
    console.warn('⚠️ Corrupted settings file. Returning empty settings.')
    return {}
  }
}

export function saveSettings(all: Record<string, unknown>): void {
  fs.writeFileSync(settingsPath, JSON.stringify(all, null, 2), 'utf-8')
}
