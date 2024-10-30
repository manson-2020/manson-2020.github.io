
import { type NavigateType, type IResData } from "@/types/custom.d"
import { getClient, parseJSON, uniNavigator } from "@/libs/utils";
import $bridge from "@/static/js/dsbridge.js";
import { $config } from "@/libs/config";

export async function checkVersion({ showToast = false, download = false } = {}) {
  if (!$config.APP_UPDATE) return;

  const { data } = <IResData>(await uni.request({
    url: `@default${$config.APP_UPDATE}`,
    method: "POST",
    data: { type: $config.OS_NAME === "ios" ? 1 : 2, app_type: 1 },
  }) as unknown);

  uni.setStorage({ key: "versionInfo", data });

  switch (getClient()) {
    case 1:
    case 2:
    case 3:
    case 4:
      if (!data.file_url) {
        showToast && uni.showToast({ title: "无效下载地址", icon: "none" });
        return;
      }
      download && (location.href = data.file_url);
      break;
    case 5:
    case 6:
      if (+$config.APP_VERSION_CODE < +data.num && +data.num < +data.hot_num) {
        if (!data.file_url) {
          showToast && uni.showToast({ title: "缺少更新地址", icon: "none" });
          return;
        }
        await uni.setStorage({
          key: "upgradeInfo",
          data: {
            title: "更新提醒",
            forceUpdate: true,
            description: "当前版本过低，需下载新版本安装后使用",
            upgradeURL: data.file_url,
          },
        });
        uniNavigator({ url: $config.PAGE_UPGRADE });
        return;
      }

      if (+$config.APP_VERSION_CODE < +data.hot_num) {
        if (!data.file_url2) {
          showToast && uni.showToast({ title: "缺少更新地址", icon: "none" });
          return;
        }
        await uni.setStorage({
          key: "upgradeInfo",
          data: {
            title: data.title || "",
            forceUpdate: !!data.m_edit,
            description: data.content || "",
            upgradeURL: data.file_url2,
          },
        });
        uniNavigator({ url: $config.PAGE_UPGRADE });
        return;
      }

      showToast && uni.showToast({ title: "已是最新版本~", icon: "none" });
      break;
    case 7:
    case 8:
      const { onCheckForUpdate, onUpdateReady, onUpdateFailed, applyUpdate } = uni.getUpdateManager();

      onCheckForUpdate(({ hasUpdate }) => {
        showToast && uni.showToast({ title: hasUpdate ? "发现新版本，正在更新..." : "已是最新版本！", icon: "none" });

        hasUpdate && console.log("New version found !");
      });

      onUpdateReady((res) => {
        uni.showModal({
          title: "Update Tips",
          confirmText: "Restart",
          cancelText: "Cancel",
          content: "新版本已经准备就绪，是否要重新启动应用程序？",
          success: ({ confirm }) => {
            uni.clearStorage();
            confirm && applyUpdate();
          },
        });
      });

      onUpdateFailed((res) => {
        uni.showToast({
          title: "未能下载新版本。请稍后再试。",
          icon: "none",
        });
      });
      break;
    case 9:
    case 10:
      $bridge.call?.("weTool.getVersion", async (result: string) => {
        const { versionCode } = parseJSON(result) || {};
        if (+versionCode < +data.num) {
          await uni.setStorage({
            key: "upgradeInfo",
            data: {
              title: data.title || "",
              forceUpdate: !!data.m_edit,
              description: data.content,
              upgradeURL: data.file_url,
            },
          });
          uniNavigator({ url: $config.PAGE_UPGRADE });
          return;
        }
        showToast && uni.showToast({ title: "已是最新版本~", icon: "none" });
      });
      break;
    default:
      uni.showToast({ title: "出错了", icon: "error" });
      break;
  }
}

export const beforeRouterInvoke = (args: string | { url: string; success: Function }, action: NavigateType = "navigateTo") => {

  const argsIsString = typeof args === "string",
    url = argsIsString ? (args[0] === "/" ? args : `/${args}`)
      : (args.url[0] === "/" ? args.url : `/${args.url}`);

  const currentPage = getCurrentPages().pop() || { route: "" },
    route = currentPage.route?.[0] === "/" ? currentPage.route : `/${currentPage.route}`;

  if ([$config.PAGE_LOGIN_ACCOUNT, url].every(item => item === route)) return false;

  // #ifndef H5
  if ([$config.PAGE_LOGIN_ACCOUNT, $config.PAGE_HOME_CLIENT].some(item => item === url)) {
    !+uni.getStorageSync("isUpgrade") && (argsIsString ? checkVersion() :
      (args.success = () => { args?.success?.(); checkVersion(); }))
  }
  // #endif

  const ignoreRoutes = $config.IGNORE_ROUTES.some((item: string) => new RegExp(item).test(url));

  // if (!$config.DEBUG_MODE && !ignoreRoutes && [2, 4].includes(getClient())) {
  //   uni.showModal({
  //     title: "温馨提示",
  //     content: "请在APP内登录使用",
  //     showCancel: false,
  //     success({ confirm }) {
  //       confirm && uniNavigator({ url: "/pages/common/download", type: "reLaunch" });
  //     },
  //   });
  //   return false;
  // }

  if (!uni.getStorageSync($config.STORAGE_KEY_USER_INFO)) {
    if (ignoreRoutes) return args;
    uniNavigator({
      type: action === "reLaunch" ? action : "navigateTo",
      url: $config.PAGE_LOGIN_ACCOUNT
    });
    return false;
  }

  return args;
}
