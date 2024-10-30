<route lang="json">{
  "style": {
    "navigationBarTitleText": "问卷填报",
    "app-plus": {
      "titleNView": {
        "type": "float"
      }
    }
  }
}</route>

<template>
  <view class="relative">
    <wd-img width="100%" :src="include(`/static/img/main/05.png`)" mode="widthFix" />
    <view class="absolute top-30 left-30 right-30 bottom-30">
      <view @click="uniNavigator({ url: '/pages/main/dengji-2' })" class="h-130" />
      <view @click="uniNavigator({ url: '/pages/main/dengji-3' })" class="mt-40 h-130" />
      <view @click="uniNavigator({ url: '/pages/main/dengji-4' })" class="mt-40 h-130" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { uniNavigator } from '@/libs/utils';
</script>

<style lang="scss" scoped></style>