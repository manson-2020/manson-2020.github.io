<route lang="json">{
  "layout": false,
  "style": {
    "navigationBarTextStyle": "@navTxtStyle",
    "navigationBarBackgroundColor": "@navBgColor",
    "app-plus": {
      "titleNView": {
        "type": "default"
      }
    }
  }
}</route>

<template>
  <web-view @message="onMessage" style="top: var(--shell-status-bar-height, 0px);" :webview-styles="webviewStyles"
    :update-title="Boolean(pageTitle)" :src="src" />
</template>

<script lang="ts" setup>
import { onLoad, onShareAppMessage } from "@dcloudio/uni-app";
import { ref } from "vue";
import { isURL } from "validator";
import { $config } from "@/libs/config";

const { COLOR_PRIMARY } = getApp().globalData!.$config;

const webviewStyles = {
  progress: {
    color: COLOR_PRIMARY,
  },
};

const pageTitle = ref<string>(""),
  src = ref<string>("");

onLoad(({ url = "", title = "" }: any) => {
  url = decodeURIComponent(url);

  src.value = isURL(url, { protocols: ["http", "https"], require_tld: false, require_protocol: true }) ? url : $config.URL_STATIC + decodeURIComponent(url);

  if (title) {
    pageTitle.value = decodeURIComponent(title);
    uni.setNavigationBarTitle({ title });
    return;
  }
  // #ifdef APP-PLUS
  let pages = getCurrentPages();//获取当前页面栈的实例
  let currentPage: any = pages[pages.length - 1]; // 上一页
  const currentWebview = currentPage.$getAppWebview();

  // 监听当前页面webview对象的title
  setTimeout(() => {
    const wv = currentWebview.children()[0];
    wv.addEventListener('titleUpdate', ({ title }: any) => {
      uni.setNavigationBarTitle({ title });
    }, false)
  }, 200);
  // #endif
});
onShareAppMessage(({ webViewUrl }) => ({
  title: pageTitle.value,
  path: `/pages/common/webview?url=${webViewUrl}`
}));

const onMessage = (e: any) => {
  // console.log(e);
}

</script>
