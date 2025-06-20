import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      assetsDir: 'resources'
    }
    
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {

    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      tailwindcss()
    ]
  }
})
