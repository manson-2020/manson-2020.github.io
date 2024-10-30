import { checkProperties, getClient, transformURL, uniNavigator } from "@/libs/utils";
import { isURL } from "validator";
import { $config } from "@/libs/config";
import { uid } from "radash";
import JSEncrypt from 'jsencrypt';
import { type IResData } from "@/types/custom.d";
import CryptoJS from "crypto-js";

export const encryptData = (data: AnyObject, randomStr: string, timestamp: string, token: string) => {
  return data;
}

const requestInvoke = (
  args: UniApp.RequestOptions & UniApp.UploadFileOption,
  paramsKey: "data" | "formData"
): UniApp.RequestOptions | UniApp.UploadFileOption => {

  if (!isURL(args.url)) {
    let prefix = "@default";
    if (/^@/.test(args.url)) {
      const url = args.url.split("/");
      prefix = url[0];
      args.url = "/" + url.slice(1).join("/");
    }

    args[paramsKey] ?? (args[paramsKey] = {});
    args.header ?? (args.header = {});
    paramsKey === "data" && (args.header["Content-type"] = "application/json");
    args.header["Cache-Control"] = "no-cache";
    args.header["From"] = "1";
    args.header["Client"] = getClient();

    const { token = "", id: user_id } = uni.getStorageSync($config.STORAGE_KEY_USER_INFO)?.value || {};

    token && (args.header[$config.FIELD_TOKEN] = token);

    for (let key in args[paramsKey]) { args[paramsKey][key] ?? delete args[paramsKey][key]; }

    const logStyle = [
      `%c ↑Request `,
      // #ifdef H5
      "background-color: #39affd; color: #fff; font-weight: bold; border-radius: 12px; padding: 3px 6px;",
      // #endif
    ];
    $config.DEBUG_MODE && console.log(...logStyle, prefix + args.url, args[paramsKey]);

    switch (prefix) {
      case "@encrypt":
        args.method = args.method || "POST";
        args.url = ($config.URL_REMOTE || "") + ($config.API_PREFIX || "") + args.url;
        const timestamp = Date.now().toString().slice(0, 10),
          randomStr = uid(16),
          encryptor = new JSEncrypt();

        args[paramsKey] = {
          uid: user_id,
          app_version: $config.APP_VERSION,
          app_view: $config.OS_NAME,
          device_id: $config.DEVICE_ID,
          device_name: $config.DEVICE_MODEL,
          timestamp,
          ...args[paramsKey],
        }
        encryptor.setPublicKey(import.meta.env.VITE_KEY);
        args.header["encryptsecret"] = encryptor.encrypt(randomStr) || "";

        args[paramsKey] = encryptData({ uid, ...args[paramsKey] }, randomStr, timestamp, token);
        break;
      case "@static":
        args.url = ($config.URL_REMOTE || "") + (import.meta.env.VITE_APP_PUBLIC_BASE || "") + "static" + args.url;
        break;
      default:
        args.url = ($config.URL_REMOTE || "") + ($config.API_PREFIX || "") + args.url;
        break;
    }
  }
  return args;
}

let debounce = false;
export function requestSuccess(res: UniApp.RequestSuccessCallbackResult) {
  if (typeof res.data === "string") {
    if (!res.data) {
      uni.showToast({ title: "网络连接失败，请稍后再试~", icon: "none" })
      return Promise.reject({ code: res.statusCode, msg: "服务端无响应", data: res.data });
    }
    try {
      res.data = JSON.parse(res.data);
    } catch (error) {
      if (res.statusCode === 200) return Promise.resolve({ code: 200, data: res.data, msg: error });
      $config.DEBUG_MODE ? uni.showModal({
        title: res.statusCode.toString(),
        content: "服务端发生错误",
        confirmText: "去看看",
        cancelText: "先不管",
        success: ({ cancel }) => {
          if (cancel) return;
          uni.setStorageSync("richText", res.data);
          uniNavigator({
            url: transformURL("/pages/common/webview",
              { url: encodeURIComponent(transformURL("/html/document.html")) }
            )
          });
        }
      }) : uni.showToast({ title: "网络连接异常，请稍后再试~", icon: "none" })

      return Promise.reject({ code: res.statusCode, data: res.data, msg: "服务端发生错误" });
    }
  }

  if (typeof res.data === "object") {
    if (!checkProperties(res.data, ["code", "data", "msg"])) return Promise.resolve(res);

    const { code, data, msg } = res.data as IResData, codeRes = (code || code === 0) ? Number(code) : null;
    switch (codeRes) {
      case 1:
        return Promise.resolve(res.data);
      case null:
        return Promise.resolve({ msg: "非标准响应格式需手动处理", data: res.data, code: -9 });
      case 0:
      case 404:
      case 500:
        uni.showToast({ title: msg, icon: "none" });
        return Promise.reject(res.data);
      case 301:
      case 405:
      case 406:
        const mapURL = {
          301: data,
          405: { action: { url: "/pages/auth/register" } },
          406: { action: { url: "/pages/base/real-name" } }
        }, { show = { title: "温馨提示", content: msg, showCancel: false }, action = {} } = mapURL[codeRes] || {};
        uni.showModal({
          ...(show as UniApp.ShowModalOptions),
          success({ confirm }) { confirm && uniNavigator(action); }
        });
        return Promise.reject(res.data);
      case 503:
        uni.showModal({ title: "温馨提示", content: msg, showCancel: false });
        return Promise.reject(res.data);
      case 706:
        // @ts-ignore
        const currentPage = getCurrentPages().pop() || { route: "" },
          route = currentPage.route?.[0] === "/" ? currentPage.route : `/${currentPage.route}`;
        !(<string[]>[
          $config.PAGE_LOGIN_ACCOUNT,
          $config.PAGE_HOME_CLIENT,
          $config.PAGE_UPGRADE,
        ]).includes(route) && uni.showModal({
          title: "温馨提示",
          content: msg,
          showCancel: false,
          success() {
            // #ifdef APP-PLUS
            plus.runtime.restart();
            // #endif
            // #ifndef APP-PLUS
            uniNavigator({ url: $config.PAGE_HOME_CLIENT, type: "reLaunch" });
            // #endif
          }
        });
        return Promise.reject(res);
      case 401:
      case 402:
        if (debounce) return Promise.reject(msg);
        debounce = true;
        uni.hideToast();
        uni.showModal({
          title: "温馨提示",
          content: msg,
          showCancel: false,
          success({ confirm }) {
            uni.removeStorage({ key: $config.STORAGE_KEY_USER_INFO });
            uniNavigator({
              url: confirm ? [
                // #ifdef MP
                $config.PAGE_LOGIN_APPLETS,
                // #endif
                // #ifndef MP
                $config.PAGE_LOGIN_ACCOUNT
                // #endif
              ][0] || "" : $config.PAGE_HOME_CLIENT,
              type: "reLaunch"
            });
          },
          complete: () => {
            debounce = false;
          }
        });
        return Promise.reject(msg);
      case 501:
        uni.showModal({
          title: "温馨提示",
          content: msg,
          showCancel: false,
          success() {
            // #ifdef APP-PLUS
            plus.runtime.quit();
            // #endif

            // #ifdef H5
            location.reload();
            // #endif

            // #ifdef MP-WEIXIN
            uni.exitMiniProgram();
            // #endif
          }
        });
        break;
      default:
        return Promise.resolve(res.data);
    };
  }
}

export const requestInterceptorOptions = (paramsKey: "data" | "formData"): UniApp.InterceptorOptions => ({
  invoke: (args: UniApp.RequestOptions & UniApp.UploadFileOption):
    UniApp.RequestOptions | UniApp.UploadFileOption => requestInvoke(args, paramsKey),
  success: (res: UniApp.RequestSuccessCallbackResult) => requestSuccess(res),
  fail({ errMsg }: UniApp.GeneralCallbackResult): void {
    // if (/(^request:fail abort$)|(^request:fail$)/.test(errMsg)) return;
    $config.DEBUG_MODE && uni.showToast({ title: String(errMsg), icon: "none" });
  },
  complete(res: UniApp.GeneralCallbackResult): void {
    const logStyle = [
      `%c ↓Response `,
      // #ifdef H5
      "background-color: #1aad19; color: #fff; font-weight: bold; border-radius: 12px; padding: 3px 6px;",
      // #endif
    ];
    $config.DEBUG_MODE && console.log(...logStyle, res);
  }
});
