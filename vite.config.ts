import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/aitranscribe/",
    build: {
      outDir: 'dist',  // This should match the output folder
    },
})
