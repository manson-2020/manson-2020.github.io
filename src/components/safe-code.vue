<template>
  <wd-popup v-model="modelValue" closable :closeOnClickModal="false" custom-class="bg-transparent" position="center"
    modal-style="backdrop-filter: blur(10rpx)" :z-index="9">
    <view class="overflow-hidden w-690 bg-section b-rd-24">
      <view class="mt-30 items-center">
        <text class="mt-16 mb-30 text-32 fw-bold">请输入安全密码</text>
        <wd-password-input custom-class="w-630" v-model="safePassCode" :focused="keyboardPopup"
          @focus="keyboardPopup = true" />
      </view>
      <view @click="uniNavigator({ url: `/pages/auth/safe-code` })" hover-class="op-60"
        class="mt-20 mb-30 p-20 flex-self-center ml-12 color-stress">
        忘记安全密码？
      </view>
    </view>
  </wd-popup>

  <wd-number-keyboard custom-class="flex-row" v-model="safePassCode" v-model:visible="keyboardPopup"
    :hideOnClickOutside="false" :maxlength="maxlength" />
</template>

<script lang="ts" setup>
import { uniNavigator } from "@/libs/utils";
import { onHide } from "@dcloudio/uni-app";

const emit = defineEmits(["finish"]);

const modelValue = defineModel({ default: false });
const safePassCode = defineModel('safePassCode', { default: "" });
const keyboardPopup = ref(false);

watch(modelValue, (v) => {
  keyboardPopup.value = v;
});

const maxlength = 6

watch(safePassCode, (v) => {
  if (v.length === maxlength) {
    modelValue.value = false;
    emit('finish');
  }
})

onHide(() => { modelValue.value = false; })

</script>

<style lang="scss" scoped></style>
