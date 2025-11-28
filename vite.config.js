import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Fully compatible with Vite 7.1+ and ngrok
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: [
      '*', // Keep this for general use
      'baf41f2a2818.ngrok-free.app' // ⬅️ ADD THIS LINE
    ],
  },
})
