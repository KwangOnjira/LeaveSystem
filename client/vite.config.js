import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    host: "0.0.0.0",
    port: 5173
   }, 
   test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test-setup.js",
  },
  plugins: [react()],
})
