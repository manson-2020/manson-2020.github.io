<template>
  <wd-config-provider heme="light" :themeVars="themeVars" customClass="provider">
    <view class="blur-top" />
    <view class="gradient-top" />
    <view class="main">
      <slot name="default" />
    </view>
    <wd-toast />
    <wd-notify />
    <wd-message-box />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import { $config } from '@/libs/config';
import { getClient } from '@/libs/utils';
import type { ConfigProviderThemeVars } from '@/uni_modules/wot-design-uni';

const themeVars: ConfigProviderThemeVars = {
  colorTheme: $config.COLOR_PRIMARY,
  buttonPrimaryBgColor: $config.COLOR_PRIMARY,
  buttonPrimaryColor: '#fff',
  inputPlaceholderColor: '#999',
  colPickerLineColor: $config.COLOR_PRIMARY,
  colPickerLineWidth: `30px`,
}

// #ifdef H5
if ([9, 10].includes(getClient())) {
  onShow(() => {
    const windowTop = getComputedStyle(document.documentElement).getPropertyValue('--window-top');
    document.body.style.setProperty('--window-top', `calc(${windowTop} + var(--shell-status-bar-height, 0px))`);
  });
}
// #endif


</script>

<style lang="scss" scoped>
.provider {
  flex: 1;
}

.blur-top {
  position: fixed;
  top: 0;
  left: var(--window-left);
  right: var(--window-right);
  height: var(--window-top);
  backdrop-filter: blur(3px);
  z-index: 9;
}

.gradient-top {
  position: fixed;
  top: 0;
  left: var(--window-left);
  right: var(--window-right);
  height: calc(var(--window-top) + 100rpx);
  background: $uni-bg-color;
}

.main {
  z-index: 1;
  flex: 1;
  margin: var(--window-top) 0 var(--window-bottom);
}
</style>
