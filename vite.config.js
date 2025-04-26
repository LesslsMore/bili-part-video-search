import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: 'bilibili 视频合集标题搜索',
        namespace: 'https://github.com/LesslsMore/bili-part-video-search',
        version: '0.1.1',
        author: 'lesslsmore',
        license: 'MIT',
        description: 'bilibili 视频合集标题搜索, 分 P 搜索',
        icon: 'https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico',
        match: [
          'https://space.bilibili.com/*',
        ],
        connect: [
          'https://lesslsmore-api.vercel.app/*'
        ]
      },
      build: {
        externalGlobals: {
          vue: cdn
            .jsdelivr('Vue', 'dist/vue.global.prod.js')
            .concat(util.dataUrl(';window.Vue=Vue;')),
          'element-plus': cdn.jsdelivr('ElementPlus', 'dist/index.full.min.js'),
          axios: cdn.jsdelivr('axios', 'dist/axios.min.js'),
          dexie: cdn.jsdelivr('Dexie', 'dist/dexie.min.js'),
          exceljs: cdn.jsdelivr('ExcelJS', 'dist/exceljs.min.js'),
          '@element-plus/icons-vue': cdn.jsdelivr('ElementPlusIconsVue', 'dist/index.iife.min.js'),
          'dexie-export-import': cdn.jsdelivr('DexieExportImport', 'dist/dexie-export-import.min.js'),
          'file-saver': cdn.jsdelivr('saveAs', 'dist/FileSaver.min.js'),
        },
        externalResource: {
          'element-plus/dist/index.css': cdn.jsdelivr(),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
});
