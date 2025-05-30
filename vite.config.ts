import { defineConfig, normalizePath } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/users': {
        target: 'http://localhost:8085'
      },
      '/table': {
        target: 'http://localhost:8085'
      },
      '/import': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false
      },
      '/query': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false
      },
      '/export': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false
      },
      '/tpcc': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': normalizePath(path.resolve(__dirname, './src'))
    }
  },
})
