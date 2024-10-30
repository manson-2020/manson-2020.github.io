import { requestInterceptorOptions } from "./request"
import { type NavigateType } from "@/types/custom.d"
import { beforeRouterInvoke } from "./route"
import { $config } from "@/libs/config"
import { includeSrc } from "@/libs/utils"

export default {
  install() {
    // 解决低版本手机不识别 array.at() 导致运行报错的问题
    if (typeof Array.prototype.at !== 'function') {
      // eslint-disable-next-line no-extend-native
      Array.prototype.at = function (index: number) {
        if (index < 0) return this[this.length + index]
        if (index >= this.length) return undefined
        return this[index]
      }
    }

    // 拦截 request 请求
    uni.addInterceptor('request', requestInterceptorOptions('data'));
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', requestInterceptorOptions('formData'));

    (<NavigateType[]>["navigateTo", "switchTab", "redirectTo", "reLaunch"]).forEach(item => {
      uni.addInterceptor(item, {
        invoke: args => beforeRouterInvoke(args, item)
      });
    });

    uni.addInterceptor("setStorage", {
      invoke(args) {
        switch (args.data?.$type) {
          case "update": {
            if (typeof (args.data.value) !== "object") {
              return Promise.reject(Error(`Invalid prop: type check failed for prop "value". Expected Object with value, got "${String(args.data.value)}".`));
            }
            const originalData = uni.getStorageSync(args.key) || {};
            const { value = {}, createTime, expireTime } = originalData;
            args.data = {
              value: { ...value, ...args.data.value },
              key: args.key,
              createTime,
              expireTime
            };
            break;
          }
          case "delete": {
            if (typeof (args.data.value) !== "string") {
              return Promise.reject(Error(`Invalid prop: type check failed for prop "value". Expected String with value, got "${String(args.data.value)}".`));
            }
            const originalData = uni.getStorageSync(args.key);
            if (!originalData) return Promise.reject(Error(`No data found to delete.`));
            const { value, key, createTime, expireTime } = originalData;
            delete value[args.data.value];
            args.data = {
              value,
              key,
              createTime,
              expireTime
            };
            break;
          }
          case "create":
            if (!args.data?.value) {
              return Promise.reject(Error(`Invalid prop: type check failed for prop "value". Expected Object with value, got "${String(args.data?.value)}".`));
            };
          case undefined: {
            const createTime = Date.now(),
              validityDay = args.data?.validityDay || 0;
            args.data = {
              value: args.data?.value ?? args.data,
              key: args.key,
              createTime,
            };
            if (validityDay) {
              if (typeof (validityDay) !== "number") {
                return Promise.reject(Error(`Invalid prop: type check failed for prop "validityDay". Expected Number with value, got "${String(validityDay)}".`));
              }
              args.data.expireTime = createTime + validityDay * 86_400_000;
            }
            break;
          }
          default:
            return Promise.reject(Error(`Invalid prop: type check failed for prop "$type". Expected "update, delete, create or void", got "${String(args.data.$type)}".`));
        };
        return args;
      }
    });

    uni.addInterceptor("getStorage", {
      success(res) {
        const { key, value, expireTime } = res.data;
        return Promise.resolve((expireTime && Date.now() >= expireTime) ? uni.removeStorageSync(key) : value);
      }
    });

    uni.addInterceptor("previewImage", {
      invoke(args) {
        args.urls = args.urls.map(includeSrc);
        return args;
      },
    });

    uni.addInterceptor("showModal", {
      invoke(args) {
        args.confirmColor = args.confirmColor || $config.COLOR_PRIMARY;
        args.cancelColor = args.cancelColor || $config.COLOR_PLACEHOLDER;
        return args;
      },
    });
  },
}
