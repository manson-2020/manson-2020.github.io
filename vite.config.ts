import { defineConfig, loadEnv } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniHelperPages from '@uni-helper/vite-plugin-uni-pages'
import UniHelperLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniHelperComponents from '@uni-helper/vite-plugin-uni-components'
import AutoImport from 'unplugin-auto-import/vite'
import ViteRestart from 'vite-plugin-restart'
import path from 'node:path'
import os from 'node:os';
import legacy from '@vitejs/plugin-legacy'

function getIPAdress() {
  const private_IPV4_regexp = /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})$/;
  const interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    const iface = interfaces[devName] || [];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && !alias.internal && private_IPV4_regexp.test(alias.address)) {
        return alias.address;
      }
    }
  }
  return "127.0.0.1";
}

// https://vitejs.dev/config/
export default async ({ command, mode }) => {
  const UnoCSS = (await import('unocss/vite')).default
  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'))

  console.log({ ...env, UNI_PLATFORM: process.env.UNI_PLATFORM });

  return defineConfig({
    envDir: './env', // 自定义env目录
    plugins: [
      // https://github.com/uni-helper/vite-plugin-uni-manifest
      UniHelperManifest(),
      // https://github.com/uni-helper/vite-plugin-uni-pages
      UniHelperPages({
        exclude: [
          '**/components/**/**.*',
          '**/excludes/**.*',
        ],
        routeBlockLang: 'json', // 虽然设了默认值，但是vue文件还是要加上 lang="json", 这样才能很好地格式化
        // homePage 通过 vue 文件的 route-block 的type="home"来设定
        // pages 目录为 src/pages，分包目录不能配置在pages目录下
        subPackages: [], // 是个数组，可以配置多个，但是不能为pages里面的目录
        dts: 'src/types/uni-pages.d.ts',
      }),
      // https://github.com/uni-helper/vite-plugin-uni-layouts
      UniHelperLayouts(),
      // https://github.com/uni-helper/vite-plugin-uni-components
      UniHelperComponents({
        dts: 'src/types/components.d.ts',
        directoryAsNamespace: true,
      }),
      Uni(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: ['vue', '@vueuse/core', 'uni-app'],
        dts: 'src/types/auto-imports.d.ts',
        dirs: ['src/composables', 'src/stores', 'src/utils'],
        // eslintrc: { enabled: true },
        vueTemplate: true,
      }),
      process.env.UNI_PLATFORM === "h5" ? legacy({
        targets: ['Chrome 64', '> 1%, last 1 version'],
        modernPolyfills: true
      }) : false,
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      UnoCSS(),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ['vite.config.js'],
      }),
    ],
    resolve: {
      alias: {
        '@': path.join(process.cwd(), './src'),
      },
    },
    define: {
      __UNI_PLATFORM__: JSON.stringify(process.env.UNI_PLATFORM),
      __RELEASE_URL__: JSON.stringify(env.VITE_SERVER_BASEURL),
      __DEV_URL__: JSON.stringify(`http://${getIPAdress()}:${env.VITE_APP_PORT || 5173}`),
    }
  })
}
