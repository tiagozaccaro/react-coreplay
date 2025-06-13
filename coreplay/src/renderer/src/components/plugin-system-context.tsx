import { createContext } from 'react'

export type CommandCallback = () => void | Promise<void>

export interface PluginSystem {
  commands: Map<string, CommandCallback>
  views: Map<string, React.ReactNode>
  registerCommand(id: string, callback: CommandCallback): void
  registerView(viewId: string, component: React.ReactNode): void
}

export const PluginSystemContext = createContext<PluginSystem | null>(null)
