import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    react(),

    ViteImageOptimizer({
      png: {
        quality: 80
      },

      jpeg: {
        quality: 80
      },

      jpg: {
        quality: 80
      },

      webp: {
        quality: 80
      },

      avif: {
        quality: 70
      },

      svg: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false
          }
        ]
      }
    })
  ]
})