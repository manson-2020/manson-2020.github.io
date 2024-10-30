<route lang="json">{
  "style": {
    "navigationBarTitleText": "个人中心",
    "app-plus": {
      "titleNView": {
        "type": "float"
      }
    }
  }
}</route>

<template>
  <view class="relative">
    <wd-img width="100%" :src="include(`/static/img/main/03.png`)" mode="widthFix" />
    <view @click="logout" class="absolute h-80 bottom-60 left-30 right-30"></view>
    <view @click="changeAddNewBBPopup(true)" class="absolute h-88 bottom-400 left-60 right-60"></view>
    <view @click="uniNavigator({ url: '/pages/main/all-bb' })" class="absolute h-60 w-200 bottom-666 right-50"></view>
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
import { uniNavigator } from '@/libs/utils';
import { useMessage } from '@/uni_modules/wot-design-uni';

const [addNewBBPopup, changeAddNewBBPopup] = usePopup();
const message = useMessage();

const logout = async () => {
  try {
    await message.confirm({
      title: "温馨提示",
      msg: "确认要退出登录吗",
    });
    uni.removeStorage({ key: $config.STORAGE_KEY_USER_INFO });
    uni.reLaunch({ url: $config.PAGE_LOGIN_ACCOUNT });
  } catch (error) { }
};
</script>

<style lang="scss" scoped></style>