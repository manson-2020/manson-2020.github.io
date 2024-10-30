import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { presetUni } from '@uni-helper/unocss-preset-uni'
import { transformerAttributify } from 'unocss-applet'

export default defineConfig({
  presets: [
    presetUni({
      remRpx: {
        baseFontSize: 4,
        screenWidth: 750,
        mode: "rem2rpx"
      }
    }),
    presetIcons({
      scale: 1.2,
      warn: false,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    transformerAttributify({
      // 解决与第三方框架样式冲突问题
      prefixedOnly: true,
      prefix: 'fg',
    }),
  ],
  shortcuts: [['wh-full', 'w-full h-full']],
  rules: [
    [/^inset-(\d+)$/, ([, d]) => ({ top: `${+d}rpx`, right: `${+d}rpx`, bottom: `${+d}rpx`, left: `${+d}rpx` })],
    [/^wh-(\d+)$/, ([, d]) => ({ width: `${+d}rpx`, height: `${+d}rpx` })],
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
  postprocess: []
})
