import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api/gita/* → https://gita-api.vercel.app/* (bypasses CORS in dev)
      '/api/gita': {
        target: 'https://gita-api.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gita/, ''),
      },
    },
  },
})
