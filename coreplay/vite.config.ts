import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/renderer/src'),
        '@renderer': resolve('src/renderer/src'),
        plugins: resolve('../plugins')
      }
    },
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      // Optional: exclude plugins if they’re external to your build
      exclude: ['plugins']
    }
  }
})
