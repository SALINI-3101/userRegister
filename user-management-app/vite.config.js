import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/salini-3101-userlist-app.github.io/',
  server: {
    proxy: {
      '/api': {
        target: 'https://reqres.in',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
})
