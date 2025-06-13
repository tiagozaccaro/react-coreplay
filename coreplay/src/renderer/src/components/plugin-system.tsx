import React, { useState } from 'react'
import { CommandCallback, PluginSystem, PluginSystemContext } from './plugin-system-context'

export function PluginSystemProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [commands] = useState(() => new Map<string, CommandCallback>())
  const [views, setViews] = useState(new Map<string, React.ReactNode>())

  const registerCommand = (id: string, cb: CommandCallback): void => {
    commands.set(id, cb)
  }

  const registerView = (viewId: string, component: React.ReactNode): void => {
    setViews((prev) => new Map(prev).set(viewId, component))
  }

  const value: PluginSystem = {
    commands,
    views,
    registerCommand,
    registerView
  }

  return <PluginSystemContext.Provider value={value}>{children}</PluginSystemContext.Provider>
}
