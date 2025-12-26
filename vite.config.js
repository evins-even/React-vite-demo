import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import { vitePluginForArco } from '@arco-plugins/vite-react'
import px2rem from 'postcss-pxtorem'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [
    react(),
    // 自动导入 React hooks 等
    AutoImport({
      imports: ['react', 'react-router-dom'],
      dts: true,
    }),
    vitePluginForArco({
      style: true,
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
    }),
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        px2rem({ rootValue: 10, exclude: /node_modules/i, propList: ['*'] })
      ],
    },
  },
  server: {
    port: 3001,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          // 基础框架
          'react-vendor': ['react', 'react-dom'],
          // 路由相关
          'router': ['react-router-dom'],
          // 状态管理
          'redux': ['react-redux'],
          // UI 组件库
          'arco-design': ['@arco-design/web-react'],
        },
        // 优化 chunk 文件名
        chunkFileNames: 'assets/chunk-[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    minify: 'esbuild',
    reportCompressedSize: true,
  }
})