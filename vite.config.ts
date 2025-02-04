import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',  // 关键，确保 Electron 能找到正确的 JS 文件
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src', // 确保这里是指向 `src` 文件夹
    },
  },
});
