import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/aitranscribe/",
  optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'window', // This will help with browser-specific globals
        },
      },
    },
    resolve: {
      alias: {
        crypto: 'crypto-browserify',
      },
    },
})
