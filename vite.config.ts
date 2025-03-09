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
      resolvers: [ElementPlusResolver()], // 自动注册 Element Plus 组件
    }),
  ],
  resolve: {
    alias: {
      '@': normalizePath(path.resolve(__dirname, './src')) // 强制统一路径格式[1,7](@ref)
    }
  },
})
