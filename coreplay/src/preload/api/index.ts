import { NotificationAPI } from './notifications'
import { PluginAPI } from './plugins'
import { SettingsAPI } from './settings'
import { SystemAPI } from './system'

export * from './plugins'
export * from './notifications'
export * from './settings'
export * from './system'

export interface Api {
  notification: NotificationAPI
  plugins: PluginAPI
  settings: SettingsAPI
  system: SystemAPI
}
