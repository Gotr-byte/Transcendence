import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { apiUrl } from './api.config'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.API_URL': JSON.stringify(apiUrl),
  },
  plugins: [react()],
  server: {
    host: true,
    port: process.env.FRONTEND_PORT || 3000,
  },
})
