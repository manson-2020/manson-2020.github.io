<route lang="json">{
  "style": {
    "navigationBarTitleText": "首页",
    "app-plus": {
      "titleNView": {
        "type": "float"
      }
    }
  }
}</route>

<template>
  <view class="relative">
    <wd-img width="100%" :src="include(`/static/img/main/01.png`)" mode="widthFix" />
    <view @click="uniNavigator({ url: '/pages/main/wenjuantianbao' })" class="absolute top-270 left-44 w-330 h-150" />
    <view @click="uniNavigator({ url: '/pages/main/zipingbiao' })" class="absolute top-270 right-44 w-330 h-150" />
  </view>
</template>

<script lang="ts" setup>
import { uniNavigator } from '@/libs/utils';
</script>

<style lang="scss" scoped></style>