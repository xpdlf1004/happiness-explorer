import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  allowedHosts: ['proj1.borihopang.com'],
})
