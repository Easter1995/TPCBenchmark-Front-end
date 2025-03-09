import { defineConfig, normalizePath } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': normalizePath(path.resolve(__dirname, './src')) // 强制统一路径格式[1,7](@ref)
    }
  },
})
