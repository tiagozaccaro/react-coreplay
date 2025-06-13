import React, { useEffect } from 'react'
import {
  FocusContext,
  init,
  setFocus,
  useFocusable
} from '@noriginmedia/norigin-spatial-navigation'
import ImageGrid from '@/components/image-grid'
import { PluginInstaller } from './components/plugin-installer'

// Initialize spatial navigation system once
init({})

const App: React.FC = () => {
  const { ref, focusKey } = useFocusable()

  useEffect(() => {
    setFocus(focusKey) // Kickstart focus on mount
  }, [focusKey])

  return (
    <FocusContext.Provider value={focusKey}>
      <PluginInstaller />
      <div ref={ref} className="p-6">
        <ImageGrid
          images={Array.from({ length: 12 }, (_, i) => ({
            src: `https://picsum.photos/300/200?random=${i + 1}`,
            alt: `Image ${i + 1}`
          }))}
        />
      </div>
    </FocusContext.Provider>
  )
}

export default App
