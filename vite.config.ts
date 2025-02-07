import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron/simple'
import path from 'path';
// 判断是否是开发模式
const isElectron = process.env.VITE_ELECTRON_MODE === 'true';
// https://vite.dev/config/
export default defineConfig({

  plugins: [
    vue(),
    isElectron ? electron({
      main: {
        entry: 'electron/main.js',
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.js'),
      },
    }) : null,
  ].filter(Boolean), // 过滤掉 null 插件
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
