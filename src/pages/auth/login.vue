<route lang="json">{
  "style": {
    "navigationBarTitleText": "登录",
    "transparentTitle": "auto",
    "navigationBarTextStyle": "black",
    "navigationBarBackgroundColor": "#f5f6f9"
  }
}</route>

<template>
  <view class="mt-72">
    <view class="fixed top-0 h-300 left-[var(--window-left)] right-[var(--window-right)]">
      <view class="wh-full" style="background: linear-gradient(to bottom, #fde1e3, #f6f5f8);" />
    </view>

    <view class="relative">
      <view class="text-44 fw-bold" style="margin: 120rpx 50rpx;">
        <text>您好，</text>
        <text>欢迎登录{{ $config.APP_NAME }}</text>
      </view>

      <view style="padding: 0 50rpx 60rpx;">
        <view class="relative">
          <view class="absolute inset-0 bg-section b-rd-60" style="box-shadow: inset 0 0 6rpx 0 rgba(0,0,0,0.2);" />
          <view class="relative text-28 h-110 flex-row items-center pl-30 pr-30">
            <wd-icon size="50" :color="$config.COLOR_PRIMARY" name="user" />
            <input v-model="formData.account.value" class="flex-1 pl-30 h-full text-28" type="number"
              placeholder="请输入手机号码" :maxlength="11" placeholder-class="color-placeholder" />
            <button v-if="formData.account.value" @click="formData.account.value = '';" plain
              class="items-end justify-center text-28 fw-600 b-rd-8 w-100 h-100 !b-none">
              <wd-icon size="36" :color="$config.COLOR_PLACEHOLDER" name="close-circle-filled" />
            </button>
          </view>
        </view>

        <view v-if="tabs.current === 0" class="mt-30 relative">
          <view class="absolute inset-0 bg-section b-rd-60" style="box-shadow: inset 0 0 6rpx 0 rgba(0,0,0,0.2);" />
          <view class="relative text-28 h-110 flex-row items-center pl-30 pr-30">
            <wd-icon size="50" :color="$config.COLOR_PRIMARY" name="lock-on" />
            <input @confirm="login" v-model="formData.password.value" class="flex-1 pl-30 h-full text-28"
              :type="formData.password.isVisible ? `text` : `password`" placeholder="请输入登录密码" :maxlength="16"
              confirm-type="next" placeholder-class="color-placeholder" />
            <button @click="formData.password.isVisible = !formData.password.isVisible" plain
              class="items-end justify-center text-28 fw-600 b-rd-0 w-100 h-100 !b-none">
              <wd-icon size="36" :color="$config.COLOR_PLACEHOLDER" bold
                :name="`${formData.password.isVisible ? `browse-off` : `browse`}`" />
            </button>
          </view>
        </view>

        <view v-if="tabs.current === 1" class="mt-30 relative">
          <view class="absolute inset-0 bg-section b-rd-60" style="box-shadow: inset 0 0 6rpx 0 rgba(0,0,0,0.2);" />
          <view class="relative text-28 h-110 flex-row items-center pl-36 pr-30">
            <wd-icon size="38" :color="$config.COLOR_PRIMARY" name="detection" />
            <input @confirm="login" v-model="captcha.value" class="flex-1 pl-36 h-full text-28" type="number"
              placeholder="请输入验证码" :maxlength="6" confirm-type="next" placeholder-class="color-placeholder" />
            <button @click="getCaptcha" :disabled="captcha.disabled" hover-class="op-60"
              class="lh-80 bg-transparent text-26 fw-600 b-rd-60 p-0 w-210 color-primary !b-none" plain>
              {{ captcha.text }}
            </button>
          </view>
        </view>

        <view class="mt-60">
          <button @click="login" class="w-full bg-primary b-rd-60 color-inverse lh-110" hover-class="op-60">
            登录
          </button>
        </view>

        <label class="mt-150 justify-center">
          <switch :checked="formData.isAgree.value" @change="(e: any) => formData.isAgree.value = e.detail.value"
            :color="$config.COLOR_TEXT_INVERSE" type="checkbox" />
          <view class="flex-row">
            <text>我已阅读并同意</text>
            <navigator @click.stop.prevent :url="buildDocumentURL('服务协议', '/userAgreementInfo')" hover-class="op-60"
              class="color-primary">
              《服务协议》
            </navigator>
            <text>和</text>
            <navigator @click.stop.prevent :url="buildDocumentURL('隐私政策', '/privateInfo')" hover-class="op-60"
              class="color-primary">
              《隐私政策》
            </navigator>
          </view>
        </label>
      </view>
    </view>

    <wd-message-box selector="prompt">
      <view class="overflow-hidden block w-full text-26 text-center lh-44">
        <text>为了更好的向你提供服务，请您阅读并同意以下协议</text>
        <label @click="uniNavigator({ url: buildDocumentURL('服务协议', '/userAgreementInfo') })"
          class="color-primary inline-flex">
          《服务条款》
        </label>
        <text>和</text>
        <label @click="uniNavigator({ url: buildDocumentURL('隐私政策', '/privateInfo') })"
          class="color-primary inline-flex">
          《隐私政策》
        </label>
      </view>
    </wd-message-box>
  </view>
</template>

<script lang="ts" setup>

import { transformURL, uniNavigator } from "@/libs/utils";
import { reactive } from "vue";
import { $config } from "@/libs/config";
import { useMessage } from "@/uni_modules/wot-design-uni";

const message = useMessage('prompt');

const [captcha, countdown] = useCaptchaCountdown();
const [formData, formValidator] = useFormDataValidator({
  account: {
    value: "",
    errorMessage: "手机号码输入有误",
    field: "mobile",
    rule: /^1[0-9]{10}$/,
  },
  password: {
    value: "",
    errorMessage: "请输入密码",
    field: "password",
    isVisible: false,
    rule: /^.+$/
  },
  isAgree: {
    value: true,
    rule: /true/
  }
});

const buildDocumentURL = (title: string, api: string) => transformURL("/pages/common/webview",
  {
    title: encodeURIComponent(title),
    url: encodeURIComponent(transformURL("/html/document.html",
      { title },
      $config.URL_REMOTE + $config.API_PREFIX + api
    ))
  }
);

const tabs = reactive({ current: 1, list: ["密码登录", "验证码登录"] });

onLoad(({ mobile, tab_index, captcha_result }: any) => {
  +tab_index && (tabs.current = +tab_index);
  captcha_result && countdown();
  mobile && (formData.account.value = mobile);
});

const getCaptcha = () => {
  const { account } = formData;
  if (captcha.disabled) return;

  if (!account.rule.test(account.value)) {
    uni.showToast({
      title: account.errorMessage,
      icon: "none"
    });
    return;
  }

  countdown();
}

const switchTab = (index: number) => {
  if (index === tabs.current) return;
  tabs.current = index;
}

const login = async () => {
  const data = formValidator(tabs.current ? { account: formData.account, captcha } : undefined)

  if (!data) return;

  if (!formData.isAgree.value) return message.confirm({
    title: "服务协议和隐私政策",
    confirmButtonText: "同意",
    cancelButtonText: "拒绝"
  }).then(() => {
    formData.isAgree.value = true;
    login();
  }).catch(() => { });

  await uni.setStorage({
    key: $config.STORAGE_KEY_USER_INFO,
    data: { value: { ['token']: "asdasdasd" }, expireTime: $config.STORAGE_USER_INFO_EXPIRE_TIME },
  });
  uni.reLaunch({ url: $config.PAGE_HOME_CLIENT });
}

</script>

<style lang="scss" scoped>
// scss

::v-deep {
  button[disabled] {
    opacity: 0.6;
  }

  switch {
    transform: scale(0.7);

    .wx-checkbox-input,
    .uni-checkbox-input {

      &:empty,
      &.wx-checkbox-input-checked,
      &.uni-checkbox-input-checked {
        border-color: $uni-color-primary;
        background-color: transparent;
      }

      &:not(:empty) {
        border-color: transparent;
        background: $uni-bg-color-primary;
      }

      & {
        border-width: 2px;
        border-radius: 50%;
      }
    }

    &:not([disabled]) {

      .wx-checkbox-input:hover,
      .uni-checkbox-input:hover {
        border-color: $uni-bg-color-primary;
      }
    }
  }
}
</style>
