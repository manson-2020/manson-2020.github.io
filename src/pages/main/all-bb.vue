<route lang="json">{
  "style": {
    "navigationBarTitleText": "全部新生儿",
    "app-plus": {
      "titleNView": {
        "type": "float"
      }
    }
  }
}</route>

<template>
  <view class="m-30">
    <view v-for="n in 3" :key="n" class="mb-30 bg-section b-rd-16 flex-row items-center p-30">
      <wd-img round width="60" height="60" :src="include(`/static/logo.png`)" />
      <view class="flex-1 ml-24">
        <label>
          <text class="mr-12 text-26">陈大宝</text>
          <wd-icon color="#f15a61" name="gender-female" size="30" />
        </label>
        <text class="mt-6 color-placeholder text-20">2022-12-12</text>
      </view>
      <button @click="removeItem" plain hover-class="op-60" class="text-24 lh-50 bg-#fff6f5 !b-#f15a61 color-primary">
        删除
      </button>
    </view>
  </view>

  <view class="h-120" />
  <view style="backdrop-filter: blur(24rpx);"
    class="fixed content-box bottom-0 flex-row h-120 items-center bg-section box-content pb-[var(--window-bottom)] left-[var(--window-left)] right-[var(--window-right)] z-9">
    <button @click="changeAddNewBBPopup(true)" hover-class="op-60" style="margin: 0 30rpx;"
      class="flex-row items-center justify-center lh-88 flex-1 bg-primary b-rd-30">
      <wd-icon size="44" bold :color="$config.COLOR_TEXT_INVERSE" name="plus-circle" />
      <text class="ml-8 color-inverse text-32 fw-bold">新增新生儿</text>
    </button>
  </view>

  <wd-popup v-model="addNewBBPopup" custom-class="bg-transparent" position="center"
    modal-style="backdrop-filter: blur(10rpx)">
    <view class="relative">
      <wd-img radius="24" width="690" :src="include(`/static/img/main/04.png`)" mode="widthFix" />
      <view @click="changeAddNewBBPopup(false)" class="absolute h-88 w-230 bottom-60 left-80"></view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { $config } from '@/libs/config';
import { useMessage } from '@/uni_modules/wot-design-uni';

const message = useMessage();

const [addNewBBPopup, changeAddNewBBPopup] = usePopup();

const removeItem = () => {
  message.confirm({ title: "温馨提示", msg: "确认要删除吗", })
    .catch(() => { })
    .then(() => { });
}

</script>

<style lang="scss" scoped></style>