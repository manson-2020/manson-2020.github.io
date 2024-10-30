<script lang="ts">
import { defineComponent } from 'vue'
import $bridge from "@/static/js/dsbridge.js";
import { getClient, parseJSON, uniNavigator } from '@/libs/utils'
import { $config } from '@/libs/config';

export default defineComponent<{ globalData: typeof $config }>({
  globalData: { $bridge, $config },
  onLaunch() {

    // #ifndef APP-PLUS
    console.log(
      `%c ${$config.APP_NAME} %c Version ${$config.APP_VERSION} %c`,
      'background: #35495e; padding: 1px; border-radius: 3px 0 0 3px; color: #fff',
      'background: #007aff; padding: 1px; margin: 1px; border-radius: 0 3px 3px 0; color: #fff; font-weight: bold;',
      'background: transparent',
    )
    // #endif

    uni.onTabBarMidButtonTap(() => {
      // REPLACE
      uni.navigateTo({
        url: '/pages/base/check-in',
        animationType: 'slide-in-bottom',
        animationDuration: 150,
      })
    });

    // #ifdef H5
    if ([9, 10].includes(getClient())) {
      $bridge.call?.("fnTool.setStatusBarColor", { color: 'transparent', isBlack: true });
      return;
      const { documentElement } = document,
        safeAreaInsetTop = getComputedStyle(documentElement).getPropertyValue('--safe-area-inset-top');
      if (safeAreaInsetTop.trim() === "0px") {
        $bridge.call("weTool.getStatusBarHeight", {}, (result: string) => {
          const { data } = parseJSON(result) || {};
          if (data) {
            const { pixelRatio } = uni.getSystemInfoSync();
            documentElement.style.setProperty('--shell-status-bar-height', `${data / pixelRatio}px`);
          }
        });
      }
    }
    // #endif
  },
  async onShow() {
    const matchText = (data: string) => {
      const result = data.match(
        new RegExp(
          `^【${$config.APP_NAME}】「(.*.)」(.*.)-(.*.) 复制内容打开APP查看$`,
        ),
      )
      if (result) {
        const [, content, type, sn] = result
        const mapType = {
          '1': {
            title: '朋友分享了一件商品',
            url: `/pages-sub/mall/goods-info?sn=${sn}`,
          },
          '2': {
            title: '朋友分享了一个素材',
            url: `/pages-sub/main/poster?sn=${sn}`,
          },
        }
        const { title, url } = mapType[type as keyof typeof mapType]
        uni.showModal({
          title,
          content,
          confirmText: '去查看',
          success({ cancel }) {
            uni.setClipboardData({ data: ' ', showToast: false })
            if (cancel) return
            uniNavigator({ url })
          },
        })
      }
    }

    switch (getClient()) {
      case 9:
      case 10:
        try {
          await uni.getStorage({ key: 'agreedAgreement' })
        } catch (error) {
          return error
        }
        $bridge.call?.('weTool.getClipContent', {}, (result: string) => {
          const res = parseJSON(result) || {}
          if (+res.code !== 200) return
          matchText(res.content)
        })
        break
      default:
        // #ifdef H5
        if (!navigator.clipboard) return
        // #endif
        uni.getClipboardData({
          success({ data }: any) {
            matchText(data)
          },
        })
        break
    }
  },
  onPageNotFound({ path }: any) {
    path !== '/' && uni.redirectTo({ url: $config.PAGE_NOT_FOUND })
  },
  onThemeChange({ theme }: { theme: 'light' | 'dark' }) {
    plus.nativeUI.setUIStyle(theme)
  },
})
</script>

<style lang="scss">
@import '@/style/theme.scss';
@import '@/style/index.scss';
</style>
