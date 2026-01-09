import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 允许局域网访问
    port: 5173,      // 指定端口
    strictPort: false, // 允许端口被占用时自动选择其他端口
    https: false // 暂时禁用HTTPS，使用HTTP
  }
})
