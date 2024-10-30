<route lang="json">{
  "style": {
    "navigationBarTitleText": "神经行为发育自评",
    "app-plus": {
      "titleNView": {
        "type": "float"
      }
    }
  }
}</route>

<template>
  <view class="m-30">
    <view class="bg-section p-30 b-rd-16 mb-30 flex-row">
      <view class="mt-10 w-6 h-26 bg-#3787f8" />
      <view class="flex-1 flex-row items-center">
        <text class="ml-24 flex-1 text-30 fw-400">8周龄婴儿GESELL发育诊断量表问卷——填报生长发育曲线登记</text>
        <text class="ml-44 color-#3787f8 text-26">已填报</text>
      </view>
    </view>
    <view @click="uniNavigator({ url: '/pages/main/dengji-1' })" class="bg-section p-30 b-rd-16 mb-30 flex-row">
      <view class="mt-10 w-6 h-26 bg-#969696" />
      <view class="flex-1 flex-row items-center">
        <text class="ml-24 flex-1 text-30 fw-400">12周龄婴儿GESELL发育诊断量表问卷——填报生长发育曲线登记</text>
        <text class="ml-44 color-placeholder text-26">未填报</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { uniNavigator } from '@/libs/utils';
</script>

<style lang="scss" scoped></style>