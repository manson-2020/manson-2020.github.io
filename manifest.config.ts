import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'
import { loadEnv } from 'vite'
import path from 'node:path'

const cwd = process.cwd();
const env = loadEnv(process.env.NODE_ENV!, path.resolve(cwd, 'env'));

const cwdConvert = process.cwd().replace(/\\/g, "/");

export default defineManifestConfig({
  'name': env.VITE_APP_NAME,
  'appid': env.VITE_UNI_APPID,
  'description': '',
  'versionName': env.VITE_APP_VERSION_NAME,
  'versionCode': env.VITE_APP_VERSION_CODE,
  'transformPx': false,
  'locale': env.VITE_FALLBACK_LOCALE, // 'zh-Hans'
  'launch_path': "__uniappview.html",
  'h5': {
    darkmode: false,
    themeLocation: 'theme.json',
    router: {
      mode: 'hash',
      base: env.VITE_APP_PUBLIC_BASE,
    },
    title: '加载中...',
    optimization: {
      treeShaking: {
        enable: true
      }
    },
    devServer: {
      proxy: {
        [env.VITE_APP_PROXY_PREFIX]: {
          pathRewrite: {
            [`^${env.VITE_APP_PROXY_PREFIX}`]: ''
          },
          target: env.VITE_SERVER_BASEURL,
          changeOrigin: true,
          ws: false,
          secure: false
        }
      },
      https: false,
      port: +env.VITE_APP_PORT,
      disableHostCheck: true
    },
    uniStatistics: {
      enable: false
    },
    sdkConfigs: {
      maps: {
        "amap": {
          "key": "aaadf5325f52c18e63a006029c14cb78",
          "securityJsCode": "8e7068413bc84f5ca36dfb1e466f556c",
          "serviceHost": ""
        }
      }
    },
  },
  /* 5+App特有相关 */
  'app-plus': {
    privacy: {
      prompt: 'template'
    },
    darkmode: 'light',
    safearea: {
      bottom: {
        offset: 'none'
      }
    },
    compatible: {
      ignoreVersion: true
    },
    usingComponents: true,
    nvueStyleCompiler: 'uni-app',
    compilerVersion: 3,
    splashscreen: {
      alwaysShowBeforeRender: true,
      waiting: true,
      autoclose: true,
      delay: 0
    },
    /* 模块配置 */
    modules: {
      VideoPlayer: {},
      Camera: {},
      Payment: {},
      Share: {},
      Record: {},
      Barcode: {}
    },
    /* 应用发布信息 */
    distribute: {
      /* android打包配置 */
      android: {
        permissions: [
          '<uses-feature android:name=\"android.hardware.camera\"/>',
          '<uses-feature android:name=\"android.hardware.camera.autofocus\"/>',
          '<uses-permission android:name=\"android.permission.ACCESS_COARSE_LOCATION\"/>',
          '<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\"/>',
          '<uses-permission android:name=\"android.permission.ACCESS_WIFI_STATE\"/>',
          '<uses-permission android:name=\"android.permission.CALL_PHONE\"/>',
          '<uses-permission android:name=\"android.permission.CAMERA\"/>',
          '<uses-permission android:name=\"android.permission.CHANGE_NETWORK_STATE\"/>',
          '<uses-permission android:name=\"android.permission.CHANGE_WIFI_STATE\"/>',
          '<uses-permission android:name=\"android.permission.FLASHLIGHT\"/>',
          '<uses-permission android:name=\"android.permission.GET_ACCOUNTS\"/>',
          '<uses-permission android:name=\"android.permission.INTERNET\"/>',
          '<uses-permission android:name=\"android.permission.MOUNT_UNMOUNT_FILESYSTEMS\"/>',
          '<uses-permission android:name=\"android.permission.READ_PHONE_STATE\"/>',
          '<uses-permission android:name=\"android.permission.VIBRATE\"/>',
          '<uses-permission android:name=\"android.permission.WAKE_LOCK\"/>',
          '<uses-permission android:name=\"android.permission.WRITE_EXTERNAL_STORAGE\"/>',
          '<uses-permission android:name=\"android.permission.WRITE_SETTINGS\"/>'
        ],
        abiFilters: ['armeabi-v7a', 'arm64-v8a', 'x86'],
        schemes: 'lkyp',
        minSdkVersion: 21
      },
      /* ios打包配置 */
      ios: {
        dSYMs: false,
        idfa: false,
        urltypes: '',
        capabilities: {},
        deploymentTarget: '12.0',
        urlschemewhitelist: 'alipay,baidumap,iosamap,qqmap'
      },
      /* SDK配置 */
      sdkConfigs: {
        ad: {},
        payment: {
          alipay: {
            '__platform__': ['ios', 'android']
          }
        },
        share: {},
        statics: {}
      },
      icons: {
        android: {
          'hdpi': `${cwdConvert}/unpackage/res/icons/72x72.png`,
          'xhdpi': `${cwdConvert}/unpackage/res/icons/96x96.png`,
          'xxhdpi': `${cwdConvert}/unpackage/res/icons/144x144.png`,
          'xxxhdpi': `${cwdConvert}/unpackage/res/icons/192x192.png`
        },
        ios: {
          appstore: `${cwdConvert}/unpackage/res/icons/1024x1024.png`,
          ipad: {
            'app': `${cwdConvert}/unpackage/res/icons/76x76.png`,
            'app@2x': `${cwdConvert}/unpackage/res/icons/152x152.png`,
            'notification': `${cwdConvert}/unpackage/res/icons/20x20.png`,
            'notification@2x': `${cwdConvert}/unpackage/res/icons/40x40.png`,
            'proapp@2x': `${cwdConvert}/unpackage/res/icons/167x167.png`,
            'settings': `${cwdConvert}/unpackage/res/icons/29x29.png`,
            'settings@2x': `${cwdConvert}/unpackage/res/icons/58x58.png`,
            'spotlight': `${cwdConvert}/unpackage/res/icons/40x40.png`,
            'spotlight@2x': `${cwdConvert}/unpackage/res/icons/80x80.png`
          },
          'iphone': {
            'app@2x': `${cwdConvert}/unpackage/res/icons/120x120.png`,
            'app@3x': `${cwdConvert}/unpackage/res/icons/180x180.png`,
            'notification@2x': `${cwdConvert}/unpackage/res/icons/40x40.png`,
            'notification@3x': `${cwdConvert}/unpackage/res/icons/60x60.png`,
            'settings@2x': `${cwdConvert}/unpackage/res/icons/58x58.png`,
            'settings@3x': `${cwdConvert}/unpackage/res/icons/87x87.png`,
            'spotlight@2x': `${cwdConvert}/unpackage/res/icons/80x80.png`,
            'spotlight@3x': `${cwdConvert}/unpackage/res/icons/120x120.png`
          }
        }
      },
      splashscreen: {
        useOriginalMsgbox: true,
        androidStyle: 'default',
        iosStyle: 'common',
        android: {
          'hdpi': `${cwdConvert}/src/static/server/img/launcher.png`,
          'xhdpi': `${cwdConvert}/src/static/server/img/launcher.png`,
          'xxhdpi': `${cwdConvert}/src/static/server/img/launcher.png`
        }
      }
    },
    uniStatistics: {
      enable: false
    },
    nvueCompiler: 'uni-app',
    nvueLaunchMode: 'normal'
  },
  /* 快应用特有相关 */
  quickapp: {},
  /* 小程序特有相关 */
  'mp-weixin': {
    appid: env.VITE_WX_APPID,
    setting: {
      urlCheck: false,
    },
    usingComponents: true,
    darkmode: true,
    themeLocation: 'theme.json',
  },
  'mp-alipay': {
    usingComponents: true,
  },
  'mp-baidu': {
    usingComponents: true,
  },
  'mp-toutiao': {
    usingComponents: true,
  },
  uniStatistics: {
    enable: false,
  },
  vueVersion: '3',
})
