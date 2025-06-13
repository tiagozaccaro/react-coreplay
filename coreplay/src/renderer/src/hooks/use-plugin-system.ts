import { useContext } from 'react'
import { PluginSystem, PluginSystemContext } from '@/components/plugin-system-context'

export function usePluginSystem(): PluginSystem {
  const context = useContext(PluginSystemContext)
  if (!context) throw new Error('usePluginSystem must be used inside PluginSystemProvider')
  return context
}
