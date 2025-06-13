import React, { useState, useCallback, JSX } from 'react'

export function PluginInstaller(): JSX.Element {
  const [message, setMessage] = useState('Drop a .cpx file here or click to select.')

  const handleFile = useCallback(async (filePath: string) => {
    if (!filePath.endsWith('.cpx')) {
      setMessage('❌ Please drop a valid .cpx file')
      return
    }
    setMessage('Installing plugin...')
    const res = await window.api.plugins.installPlugin(filePath)
    if (res) {
      setMessage(`✅ Plugin ${res} installed successfully!`)
      window.api.notification.showNotification(`Plugin ${res} installed successfully!`)
    } else {
      setMessage('❌ Failed to install plugin')
      window.api.notification.showNotification('Failed to install plugin')
    }
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0]
        handleFile(file.name)
      }
    },
    [handleFile]
  )

  const onDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
  }

  const openFile = async (): Promise<void> => {
    const filePath = await window.api.system.openFileDialog()
    if (filePath) {
      handleFile(filePath)
    }
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{
        border: '3px dashed #888',
        borderRadius: 8,
        padding: 40,
        textAlign: 'center',
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onClick={openFile}
      title="Click or drag a .cpx plugin file here"
    >
      <p>{message}</p>
    </div>
  )
}
