<route lang="json">{
  "layout": false,
  "style": {
    "navigationStyle": "custom",
    "app-plus": {
      "animationDuration": 200,
      "animationType": "fade-in",
      "background": "transparent",
      "backgroundColorTop": "transparent",
      "popGesture": "none",
      "scrollIndicator": "none",
      "titleNView": false
    },
    "disableScroll": true,
    "leftWindow": false,
    "topWindow": false
  }
}</route>
<template>
  <view class="mask">
    <view class="content">
      <view class="content-body">
        <text class="content-title">{{ upgradeInfo.title || "发现新版本" }}</text>
        <scroll-view class="content-body-des" scroll-y>
          <text class="content-body-des-text" user-select selectable decode space="nbsp">
            {{ upgradeInfo.description || "优化了一些已知问题" }}
          </text>
        </scroll-view>

        <view class="progress" v-if="downloadInfo.downloading">
          <progress v-if="downloadInfo.downLoadPercent" class="progress-line" :border-radius="30"
            :percent="downloadInfo.downLoadPercent" :activeColor="$config.COLOR_PRIMARY"
            :backgroundColor="$config.COLOR_BACKGROUND" show-info :stroke-width="10" />
          <label class="progress-text">
            <text>安装包下载中...</text>
            <text v-if="downloadInfo.downloadedSize">
              ({{ downloadInfo.downloadedSize }}/{{ downloadInfo.packageFileSize }}M)
            </text>
          </label>
        </view>

        <button v-else @click="download" hover-class="op-60" class="content-button bg-primary">
          立即下载
        </button>
      </view>
    </view>

    <wd-icon v-if="!upgradeInfo.forceUpdate" @click="cancelUpgrade" class="close" name="close-circle" size="60"
      color="#fff" />
  </view>
</template>

<script lang="ts" setup>
import { $config } from '@/libs/config';
import { getClient, uniCopyText, uniNavigator } from '@/libs/utils';
import { onBackPress, onLoad, onUnload } from '@dcloudio/uni-app';
import { reactive } from 'vue';

const { $bridge = {} } = getApp().globalData || {};

const upgradeInfo = reactive({
  title: "",
  forceUpdate: false,
  description: "",
  upgradeURL: ""
});

onLoad(() => uni.getStorage({
  key: "upgradeInfo",
  success(data: any) {
    data.forceUpdate = !!+data.forceUpdate;
    Object.assign(upgradeInfo, data);
  },
}));

onBackPress(() => Boolean(upgradeInfo.forceUpdate));

onUnload(() => uni.removeStorage({ key: "upgradeInfo" }));

const downloadInfo = reactive({
  downLoadPercent: 0,
  downloadedSize: 0,
  packageFileSize: 0,
  downloading: false
});

const download = () => {
  downloadInfo.downloading = true;

  switch (getClient()) {
    case 1:
    case 2:
    case 3:
    case 4:
      location.href = upgradeInfo.upgradeURL;
      break;
    case 5:
    case 6:
      if (!["wgt", "wgtu"].includes(upgradeInfo.upgradeURL.split(".").pop() || "")) {
        // Android Market://details?id=packageName
        // Apple Store https://apps.apple.com/cn/app/appID
        plus.runtime.openURL(upgradeInfo.upgradeURL, () => {
          uni.showModal({
            title: "打开浏览器失败", content: "请点击【复制链接】进入手机浏览器进行下载手动安装", confirmText: "复制链接",
            success() {
              uniCopyText({ data: upgradeInfo.upgradeURL, showToast: true });
            }
          })
        });
        return;
      }
      const downloadTask = uni.downloadFile({
        url: upgradeInfo.upgradeURL,
        success: ({ tempFilePath, statusCode }) => {
          if (statusCode !== 200) {
            uni.showModal({
              title: "温馨提示",
              content: "下载失败, 请手动下载APP进行重新安装",
              showCancel: false,
              success: () => plus.runtime.openURL($config.URL_ASSETS + $config.ROUTE_PREFIX + "/#/pages/common/download"),
            });
            return;
          }
          Object.assign(downloadInfo, {
            downLoadPercent: 0,
            downloadedSize: 0,
            packageFileSize: 0
          });
          plus.runtime.install(tempFilePath, { force: true }, plus.runtime.restart,
            () => uni.showModal({
              title: "温馨提示",
              content: "安装失败, 请手动下载APP进行重新安装",
              showCancel: false,
              success: () => plus.runtime.openURL($config.URL_ASSETS + $config.ROUTE_PREFIX + "/#/pages/common/download"),
            })
          );
        }
      });

      downloadTask.onProgressUpdate(({ progress, totalBytesWritten, totalBytesExpectedToWrite }) => {
        Object.assign(downloadInfo, {
          downLoadPercent: progress,
          downloadedSize: (totalBytesWritten / Math.pow(1024, 2)).toFixed(2),
          packageFileSize: (totalBytesExpectedToWrite / Math.pow(1024, 2)).toFixed(2)
        })
      });
      break;
    case 9:
    case 10:
      $bridge.call?.("weTool.openUrl", { url: upgradeInfo.upgradeURL });
    default:
      uni.showToast({ title: "出错了", icon: "error" });
      break;
  }
}

const cancelUpgrade = () => {
  uni.setStorageSync("isUpgrade", 1);
  uniNavigator({ type: 'navigateBack' })
}

</script>

<style lang="scss">
page {
  &::before {
    content: unset !important;
  }

  & {
    background: transparent !important;
  }
}

.mask {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  justify-content: center;
  align-items: center;

  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
}

.content {
  width: 600rpx;
  background-color: $uni-bg-color-section;
  box-sizing: border-box;
  border-radius: 30rpx;

  &-header {
    position: relative;
    width: 100%;
    height: 270rpx;


    &-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  &-title {
    font-size: 45rpx;
    font-weight: bold;
    color: $uni-color-primary;
    z-index: 1;
  }

  &-body {
    margin: 30rpx;

    &-des {
      box-sizing: border-box;
      margin: 24rpx 0;
      min-height: 240rpx;
      max-height: 600rpx;
      text-align: left;

      &-text {
        font-size: 26rpx;
        color: $uni-text-color;
        line-height: 2;
        word-break: break-all;
      }
    }
  }

  &-button {
    text-align: center;
    flex: 1;
    font-size: 28rpx;
    font-weight: 400;
    color: $uni-text-color-inverse !important;
    border: none !important;
    border-radius: 40rpx;
    margin: 12rpx 18rpx 0;
    height: 80rpx;
    line-height: 80rpx;
  }
}


.close {
  margin-top: 50rpx;
  padding: 12rpx;
}

.progress {
  display: flex;
  flex-direction: column;
  width: 100%;

  &-line {
    height: 40rpx;
  }

  &-text {
    justify-content: space-around;
    margin-top: 12rpx;
    font-size: 28rpx;
  }

}
</style>
