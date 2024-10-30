import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { loadEnv } from 'vite'
import path from 'node:path'

const env = loadEnv(process.env.NODE_ENV!, path.resolve(process.cwd(), 'env'))

export default defineUniPages({
  easycom: {
    autoscan: true
  },
  globalStyle: {
    backgroundColor: '@bgColor',
    backgroundColorBottom: '@bgColorBottom',
    backgroundColorTop: '@bgColorTop',
    backgroundTextStyle: '@bgTxtStyle',
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: env.VITE_APP_NAME,

    'app-plus': {
      titleNView: {
        type: 'float',
      },
      softinputNavBar: 'none',
      homeButton: true,
      pullToRefresh: {
        // REPLACE
        color: '#f7676e',
      },
    },
    h5: {
      // 'navigationStyle': 'custom'
    },
    rpxCalcMaxDeviceWidth: 450,
    maxWidth: 450,
    dynamicRpx: true,
  },
  tabBar: {
    custom: false,
    color: '@tabFontColor',
    fontSize: '12px',
    selectedColor: '@tabSelectedColor',
    backgroundColor: '@tabBgColor',
    position: 'bottom',
    borderStyle: '@tabBorderStyle',
    iconWidth: '30px',
    height: '66px',
    ...(process.env.UNI_PLATFORM === 'h5' ? { blurEffect: 'light' } : {}),
    midButton: {
      width: '80px',
      height: '80px',
      iconPath: '/static/img/tabs/check-in.png',
      iconWidth: '80px',
    },
    spacing: '3px',
    list: [
      {
        pagePath: 'pages/tabs/home',
        iconPath: '/static/img/tabs/home.png',
        selectedIconPath: '/static/img/tabs/home-1.png',
        text: '首页',
      },
      {
        pagePath: 'pages/tabs/logs',
        iconPath: '/static/img/tabs/logs.png',
        selectedIconPath: '/static/img/tabs/logs-1.png',
        text: '随访历史',
      },
      {
        pagePath: 'pages/tabs/mine',
        iconPath: '/static/img/tabs/mine.png',
        selectedIconPath: '/static/img/tabs/mine-1.png',
        text: '我的',
      },
    ],
  },
})
