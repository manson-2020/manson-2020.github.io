import { type NavigateType } from '../types/custom.d'
import { $config } from '../libs/config'
import $bridge from '@/static/js/dsbridge.js'
import CryptoJS from 'crypto-js'
import * as _ from 'radash'
import validator from 'validator'
import dayjs from 'dayjs'

export const prefix0 = (n: number | string): string => String(+n > 9 ? n : `0${n}`)

const oss =
  $config.OS_NAME === 'ios' && $config.OS_VERSION < 14
    ? {}
    : (<AnyObject>{
      aliyun: { 'x-oss-process': 'image/format,webp' },
      qiniuyun: { 'imageView2/0/format/webp/q/60': '' },
      none: {}
    })[$config.OSS_NAME] || {}
export const includeSrc = (src: string) => {
  switch (true) {
    case _.isEmpty(src) ||
      /(^data:image)|(^blob:)|(^([a-z][a-z\d\+\-\.]*:)?\/\/)|(^\/.*\.(svg)$)|(^_doc\/)/.test(src):
      return src
    case /(^\/static)/.test(src):
      return transformURL(src, { v: $config.APP_VERSION })
    case /^#server\//.test(src):
      return transformURL(`${$config.URL_STATIC || ''}${src.replace(/^#server\//, '/')}`, {
        v: $config.APP_VERSION,
      })
    case new RegExp(`^${$config.URL_REMOTE_ASSETS}`).test(src):
      return transformURL(src, { v: $config.APP_VERSION, ...oss })
    default:
      return transformURL(`${$config.URL_REMOTE_ASSETS || ''}/${src.replace(/^\//, '')}`, {
        v: $config.APP_VERSION,
        ...oss,
      })
  }
}

export const formatPhoneNumber = (phoneNumber: string): string =>
  validator.isMobilePhone(phoneNumber, 'zh-CN')
    ? phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1******$2')
    : ''

export const transformQueryString = (params: string | AnyObject) => {
  if (typeof params === 'string') {
    const queryStrings: RegExpMatchArray | null = params.match(/[^?&]+=[^?&]+/g)
    return queryStrings
      ? Object.fromEntries(
        queryStrings.map((item) => item.split(/^([^=]*)=*/).filter((item) => item)),
      )
      : {}
  }
  if (typeof params === 'object') {
    return Object.keys(params)
      .filter((key) => ![undefined, null].includes(params[key]))
      .map((key) => (params[key] ? `${key}=${params[key]}` : key))
      .join('&')
  }
  throw Error('Parameter error')
}

export const transformURL = (url: string, params?: { [key: string]: any }, hash?: string) =>
  url +
  (params ? `${url.includes('?') ? '&' : '?'}${transformQueryString(params)}` : '') +
  (hash ? `#${hash}` : '')

/**
 * @param {Date} start
 * @param {Date} end
 * @returns {Array<string>}
 */
export const formatEveryDay = (
  start: Date,
  end: Date,
  format: undefined | string = undefined,
): Array<any> => {
  const dateList = []
  while (end.getTime() - start.getTime() >= 0) {
    dateList.push(dayjs(start.getTime()).format(format))
    start.setDate(start.getDate() + 1)
  }
  return dateList
}

export const formatDuration = ({ format = 'D天h时m分s秒', seconds = 0 }) => {
  if (seconds <= 0) {
    return 0
  }
  let [day, hour, minute, second] = [0, 0, 0, 0]
  day = ~~(seconds / (60 * 60 * 24))
  hour = ~~(seconds / (60 * 60)) - day * 24
  const showHour = format.includes('D') ? hour : ~~(seconds / (60 * 60))
  minute = ~~(seconds / 60) - hour * 60 - day * 24 * 60
  second = ~~seconds - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60

  return format
    .replace('D', prefix0(day))
    .replace('h', prefix0(showHour))
    .replace('m', prefix0(minute))
    .replace('s', prefix0(second))
}

export const parseJSON = (str: string): AnyObject | null => {
  try {
    return JSON.parse(str)
  } catch (error) {
    return null
  }
}

export const sortLetter = (letters: string) =>
  [...letters.replace(/,/g, '')]
    .sort((a, b) => Number(a.charCodeAt(0).toString(16)) - Number(b.charCodeAt(0).toString(16)))
    .join(',')

export const uniNavigator = ({
  type = 'navigateTo',
  url,
}: {
  type?: NavigateType | 'navigateBack' | 'openWeb'
  url?: string
}) => {

  if (url === 'navigateBack') type = url

  if (
    validator.isURL(String(url), {
      protocols: ['alipays', 'http', 'https'],
      require_tld: false,
      require_protocol: true,
    })
  ) {
    switch (getClient()) {
      case 1:
      case 2:
      case 3:
      case 4:
        location.href = String(url)
        break
      case 5:
      case 6:
        type === 'openWeb'
          ? plus.runtime.openWeb(url!)
          : plus.runtime.openURL(url!, (e) => {
            console.log(e)
          })
        break
      case 7:
      case 8:
        uni.setClipboardData({ data: url!, showToast: true })
        break
      case 9:
      case 10:
        $bridge.call?.('weTool.openUrl', { url })
        break
      default:
        uni.navigateTo({
          url: transformURL('/pages/common/webview', { url: encodeURIComponent(url!) }),
        })
        break
    }
    return
  }
  type = /^\/pages\/client\/tabs\/.*/.test(url!) ? 'switchTab' : type
  return {
    navigateBack: () => {
      const pages = getCurrentPages()

      if (pages.length > 1) {
        uni.navigateBack()
        return
      }
      uni.reLaunch({ url: $config.PAGE_HOME_CLIENT })
    },
    reLaunch: () => url && uni.reLaunch({ url }),
    navigateTo: () => url && uni.navigateTo({ url }),
    switchTab: () => url && uni.switchTab({ url }),
    redirectTo: () => url && uni.redirectTo({ url }),
  }[type as Exclude<typeof type, 'openWeb'>]()
}

export const uniPreviewImage = (options: UniApp.PreviewImageOptions) => {
  uni.previewImage(options)
}

export const uniMakePhoneCall = (options: UniApp.MakePhoneCallOptions) => {
  options.phoneNumber && uni.makePhoneCall(options)
}

export const uniCopyText = (options: UniApp.SetClipboardDataOptions) => {
  uni.setClipboardData(options)
}

export const uniShowToast = (options: UniApp.ShowToastOptions) => {
  return uni.showToast(options)
}

export const uniShowModal = (options: UniApp.ShowModalOptions) => {
  return uni.showModal(options)
}

export const uniUpx2px = (value: number) => uni.upx2px(value)

export const getClient = () => {
  const { OS_NAME, PLATFORM } = $config;

  if (PLATFORM === 'web') {
    const agent = navigator.userAgent.toLowerCase()

    if (import.meta.env.VITE_APP_PACKAGE_NAME && agent.includes(import.meta.env.VITE_APP_PACKAGE_NAME)) {
      return OS_NAME === 'ios' ? 9 : 10
    }

    // 微信内部
    if (agent.includes('micromessenger')) {
      return OS_NAME === 'ios' ? 1 : 2
    }

    // 其他浏览器
    return OS_NAME === 'ios' ? 3 : 4
  }

  // APP
  if (PLATFORM === 'app') {
    return OS_NAME === 'ios' ? 5 : 6
  }

  // 其他(小程序)
  return OS_NAME === 'ios' ? 7 : 8
}

export const wxJsPay = (payParams: any, callBack: AnyObject = {}): void => {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest',
    payParams,
    ({ err_msg }: any) => (
      callBack.complete(),
      err_msg == 'get_brand_wcpay_request:ok'
        ? uni.showToast({ title: '支付成功', complete: callBack.success })
        : uni.showToast({ title: '支付失败', icon: 'none', complete: callBack.fail })
    ),
  )
}

export const toFixed_adjust = (number: number, count: number) => {
  const [integer, decimal] = String(number).split('.')

  if (count) {
    const placeholder = Array(count).fill(0).join('')
    return decimal
      ? `${integer}.${(decimal + placeholder).slice(0, count)}`
      : `${integer}.${placeholder}`
  }

  return number.toString()
}

export const encryptData = (data: AnyObject, randomStr: string) => {
  const { AES: { encrypt }, mode: { CBC }, pad: { Pkcs7 }, enc: { Utf8 } } = CryptoJS
  for (const key in data) data[key] ?? delete data[key]
  return {
    encrypt_str: encrypt(JSON.stringify(data), Utf8.parse(randomStr), {
      iv: Utf8.parse(import.meta.env.VITE_APP_IV),
      mode: CBC,
      padding: Pkcs7,
    }).toString(),
  }
}

/**
 * @description 深度克隆
 * @param {object} obj 需要深度克隆的对象
 * @returns {object} 克隆后的对象或者原值（不是对象）
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  let clone: any

  if (Array.isArray(obj)) {
    clone = []
    for (let i = 0; i < obj.length; i++) {
      clone[i] = deepClone(obj[i])
    }
  } else {
    clone = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = deepClone(obj[key])
      }
    }
  }

  return clone as T
}

/**
 * @description JS对象深度合并
 * @param {object} target 需要拷贝的对象
 * @param {object} source 拷贝的来源对象
 * @returns {object|boolean} 深度合并后的对象或者false（入参有不是对象）
 */
export const deepMerge = <T>(target: T, ...sources: T[]): T => {
  if (!sources.length) return target
  const source = sources.shift()

  if (_.isObject(target) && _.isObject(source)) {
    for (const key in source) {
      if (_.isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * @description 字母分组
 * import cities1 from "@/static/server/cities1.json";
 * import { pinyin } from 'pinyin-pro';
 * console.log(cities1.sort(customSort));
 */
export const customSort = (a: AnyObject, b: AnyObject) => {
  const pinyin: any = () => { }

  // 对于相同 role 的元素，按照 nameCard 或 nick 转成汉语拼音
  const aPinyin = pinyin(a.name, { toneType: 'none' }).replace(/\s/g, '')
  const bPinyin = pinyin(b.name, { toneType: 'none' }).replace(/\s/g, '')

  // 判断 a 和 b 是否为特殊符号或数字
  const isSpecialA = /[\W\d]/.test(aPinyin[0])
  const isSpecialB = /[\W\d]/.test(bPinyin[0])

  // 如果 a 和 b 都是特殊符号或数字，按原始顺序排序
  if (isSpecialA && isSpecialB) {
    return 0
  }

  // 如果 a 是特殊符号或数字，将其排在 b 后面
  if (isSpecialA) {
    return 1
  }

  // 如果 b 是特殊符号或数字，将其排在 a 后面
  if (isSpecialB) {
    return -1
  }

  return aPinyin.localeCompare(bPinyin)
}

/**
 * @description 字符排序
 *  console.log(JSON.stringify(pySegSort(cities1, "city_name")));
 */
export const pySegSort = (arr: AnyObject[], name = 'name') => {
  if (!String.prototype.localeCompare) return null
  // const letters = 'abcdefghjklmnopqrstwxyz'.split('')
  const letters = 'ABCDEFGHJKLMNOPQRSTWXYZ'.split('')
  const zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('')
  const segs: AnyObject[] = []
  letters.forEach((item, i) => {
    const cur = { letter: item, data: [] as AnyObject[] }
    arr.forEach((item: any) => {
      if (item[name].localeCompare(zh[i]) >= 0 && item[name].localeCompare(zh[i + 1]) < 0) {
        cur.data.push(item)
      }
    })

    if (cur.data.length) {
      cur.data.sort(function (a, b) {
        return a[name].localeCompare(b[name], 'zh')
      })
      segs.push(cur)
    }
  })

  return segs
}

export const isNil = (value: any) => [null, undefined, NaN].includes(value)

/**
 * @description 16进制转rgba
 * @param hex 6位16进制hex色值
 * @param alpha 透明度0到1
 * @returns rgba颜色值
 */
export const hexToRGBA = (hex: string, alpha: number): string => {
  if (alpha < 0 || alpha > 1) {
    throw new Error('透明度值必须在0到1之间')
  }

  const hexColor = hex.replace('#', '')
  if (hexColor.length !== 6) {
    throw new Error('颜色值必须是6位十六进制格式')
  }

  const r = parseInt(hexColor.slice(0, 2), 16)
  const g = parseInt(hexColor.slice(2, 4), 16)
  const b = parseInt(hexColor.slice(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const checkProperties = (obj: Record<string, any>, properties: string[]): boolean => {
  for (const property of properties) {
    if (property in obj) continue
    return false
  }
  return true
}
