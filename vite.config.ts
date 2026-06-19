import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiAddress = env.VITE_API_ADDRESS

  return {
    plugins: [
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: true,
      }),
      vue(),
      vueJsx(),
      vueDevTools(),
    ],
    resolve: {
      // 可以在这里定义别名，方便在代码中使用
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // 指向主题目录 需要同时更改 tsconfig.app.json
        '@bujidao': fileURLToPath(new URL('./src/themes/bujidao', import.meta.url)),
        '@test': fileURLToPath(new URL('./src/themes/test', import.meta.url)),
        '@kohara-fuwari': fileURLToPath(new URL('./src/themes/kohara-fuwari', import.meta.url)),
        '@blush-cherry-blossoms': fileURLToPath(new URL('./src/themes/blush-cherry-blossoms', import.meta.url)),
        '@violet-rose': fileURLToPath(new URL('./src/themes/violet-rose', import.meta.url)),
      },
    },
    // 代理 /json_rpc/
    server: {
      proxy: apiAddress
        ? {
            '/json_rpc/': {
              target: apiAddress,
              changeOrigin: true,
            },
          }
        : undefined,
    },
  }
})
