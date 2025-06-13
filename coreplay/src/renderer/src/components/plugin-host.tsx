import { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { usePluginSystem } from '@/hooks/use-plugin-system'

export function PluginHost(): React.ReactElement | null {
  const { registerView, views } = usePluginSystem()

  useEffect(() => {
    const handler = async (
      _: unknown,
      { viewId, modulePath }: { viewId: string; modulePath: string }
    ): Promise<void> => {
      try {
        const mod = await import(/* @vite-ignore */ modulePath) // tell Vite not to bundle eagerly
        if (mod && mod.default) {
          registerView(viewId, <mod.default />)
        } else {
          // fallback if default export doesn't exist, try named export same as last part of module path
          const componentName =
            modulePath
              .split('/')
              .pop()
              ?.replace(/\.[jt]sx?$/, '') || ''
          if (mod[componentName]) {
            const DynamicComponent = mod[componentName]
            registerView(viewId, <DynamicComponent />)
          } else {
            console.warn(`No React component found in plugin module: ${modulePath}`)
          }
        }
      } catch (e) {
        console.error('Error loading plugin view:', viewId, e)
      }
    }

    ipcRenderer.on('plugin-register-view', handler)
    return () => {
      ipcRenderer.off('plugin-register-view', handler)
    }
  }, [registerView])

  return (
    <>
      {[...views.values()].map((Comp, i) => (
        <div key={i} className="plugin-view-container">
          {Comp}
        </div>
      ))}
    </>
  )
}
