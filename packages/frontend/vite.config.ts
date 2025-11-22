import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 1. Add this 'babel' section
      babel: {
        // 2. Tell it to use the React Compiler
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  server: {
    proxy: {
      // String shorthand: http://localhost:5173/api -> http://localhost:3000/api
      '/api': 'http://localhost:3000',
    }
  },
  optimizeDeps: {
    exclude: ['caniuse-lite'],
  },
})
