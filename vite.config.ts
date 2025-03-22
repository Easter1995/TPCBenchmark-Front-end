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
    proxy: {
      '/users': {
        target: 'http://localhost:8085'
      }
    }
  },
  resolve: {
    alias: {
      '@': normalizePath(path.resolve(__dirname, './src'))
    }
  },
})
