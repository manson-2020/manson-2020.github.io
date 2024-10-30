export const COLORS = {
  COLOR_TEXT: '#333',
  COLOR_TEXT_INVERSE: '#ffffff',
  COLOR_DISABLED: '#c7c7c7',
  COLOR_SUBTITLE: '#666',
  COLOR_SECTION: '#ffffff',
  COLOR_PRIMARY: '#f7676e',
  COLOR_GREY: '#7f7f7f',
  COLOR_PLACEHOLDER: '#999999',
  COLOR_BACKGROUND: '#f5f6f9',
  COLOR_LABEL: '#4cb3ff',
  COLOR_STRESS: '#fc3b7b',
  COLOR_MAIN: '#beee6d',
} as const;

export const IGNORE_ROUTES = [
  '/pages/*',
] as const;

const systemInfo = uni.getSystemInfoSync(), SYSTEM_CONFIG = {
  APP_VERSION_CODE: Number(systemInfo.appWgtVersion?.replace(/[^0-9]/ig, '')) || systemInfo.appVersionCode,
  APP_VERSION: systemInfo.appWgtVersion || systemInfo.appVersion,
  APP_NAME: systemInfo.appName,
  OS_VERSION: +systemInfo.osVersion.split(".")[0],
  OS_NAME: systemInfo.osName,
  PLATFORM: systemInfo.uniPlatform,
  DEVICE_BRAND: systemInfo.deviceBrand,
  DEVICE_MODEL: systemInfo.deviceModel,
  DEVICE_ID: systemInfo.deviceId,
};

const PAGES = {
  PAGE_NOT_FOUND: '/pages/common/error',
  PAGE_LOGIN_APPLETS: null,
  PAGE_HOME_CLIENT: "/pages/tabs/home",
  PAGE_LOGIN_ACCOUNT: "/pages/auth/login",
  PAGE_UPGRADE: "/pages/common/upgrade",
} as const;


let PATH_STATIC = "/static/server", URL_STATIC = PATH_STATIC;
// #ifdef MP
URL_STATIC = import.meta.env.VITE_SERVER_BASEURL + URL_STATIC;
// #endif

const SERVER_URL = {
  development: {
    // #ifdef H5
    ...{
      URL_REMOTE: location.origin,
      URL_ASSETS: location.origin
    },
    // #endif
    // #ifndef H5
    ...{
      URL_REMOTE: __DEV_URL__,
      URL_ASSETS: __DEV_URL__,
    },
    // #endif

    DEBUG_MODE: true,
  },

  production: {
    // #ifdef H5
    ...{
      URL_REMOTE: location.origin,
      URL_ASSETS: location.origin
    },
    // #endif
    // #ifndef H5
    ...{
      URL_REMOTE: __RELEASE_URL__,
      URL_ASSETS: __RELEASE_URL__,
    },
    // #endif
    DEBUG_MODE: false,
  }
};

export const $config = {
  ...(SERVER_URL[process.env.NODE_ENV as keyof typeof SERVER_URL]),
  ...SYSTEM_CONFIG,
  ...COLORS,
  ...PAGES,
  IGNORE_ROUTES,

  ROUTE_PREFIX: import.meta.env.VITE_APP_PUBLIC_BASE,

  API_PREFIX: "/api",
  APP_UPDATE: "",
  API_USER_INFO_GET: "",
  API_USER_INFO_SET: "",
  API_FILE_UPLOAD: "",
  API_CONFIG_GET: null,

  URL_REMOTE_ASSETS: "",
  OSS_NAME: "aliyun",

  PATH_STATIC, URL_STATIC,

  STORAGE_KEY_USER_INFO: "userInfo",
  STORAGE_USER_INFO_EXPIRE_TIME: 7,
  FIELD_TOKEN: "Authorization",

  ...(uni.getStorageSync("$config") || {}) as AnyObject,
  ...(uni.getStorageSync("$debug") || {}) as AnyObject,
};
