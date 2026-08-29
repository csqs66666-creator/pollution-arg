import { defineConfig } from 'vite';

// base: './' 让构建产物可放到任意子路径 / 直接双击 dist/index.html 也能跑
export default defineConfig({
  base: './',
  server: { port: 5173, open: false },
  build: { outDir: 'dist', emptyOutDir: true }
});
