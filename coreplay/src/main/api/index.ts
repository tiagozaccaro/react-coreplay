import { registerPluginHandlers } from './plugins'
import { registerSettingsHandlers } from './settings'
import { registerNotificationHandlers } from './notifications'

export function registerIpcHandlers(): void {
  registerPluginHandlers()
  registerNotificationHandlers()
  registerSettingsHandlers()
}
