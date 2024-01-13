import { ConfigEnv, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginSvg } from "@webxrd/vite-plugin-svg"
import { resolve } from 'path'

const pathResolve = (dir: string): any => {
  return resolve(__dirname, ".", dir)
}

const alias: Record<string, string> = {
  '@': pathResolve("src")
}

/** 
 * @description-en vite document address
 * @description-cn vite官网
 * https://vitejs.cn/config/ */
export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    base: './',
    build: {
      chunkSizeWarningLimit: 20_000
    },
    // optimized dependencies changed
    optimizeDeps: {
      include: ['@tinymce/tinymce-vue', 'mathjs']
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        // 接口地址代理
        '/adminApi': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true, // 跨域
          // rewrite: path => path.replace(/^\/demo/, '/demo')
        },
         // 图片资源代理
         '/img': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true, // 跨域
        },
      }
    },
    resolve: {
      alias
    },
    plugins: [
      vue(),
      vitePluginSvg({
        // 必要的。必须是绝对路径组成的数组。
        iconDirs: [
          resolve(__dirname, 'src/assets/svg'),
        ],
        // 必要的。入口script
        main: resolve(__dirname, 'src/main.js'),
        symbolIdFormat: 'icon-[name]'
      }),
    ],
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ],
      },
    }
  };
}
