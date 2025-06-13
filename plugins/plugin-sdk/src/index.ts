import { ReactNode } from 'react';

export interface PluginContext {
  registerCommand(id: string, callback: () => void): void;
  showNotification(message: string): void;
  log(message: string): void;
  registerView(viewId: string, component: ReactNode): void;
  settings: Record<string, any>;
  saveSettings: (newSettings: Record<string, any>) => void;
  pluginId: string;
}
