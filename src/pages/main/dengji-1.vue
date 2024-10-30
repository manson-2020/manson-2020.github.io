<route lang="json">{
  "style": {
    "navigationBarTitleText": "12周龄婴儿GESELL发育诊断量表问卷",
    "navigationBarTextStyle": "white",
    "app-plus": {
      "titleNView": {
        "type": "float"
      }
    }
  }
}</route>

<template>
  <view
    class="z-2 fixed top-0 left-[var(--window-left)] right-[var(--window-right)] h-[calc(var(--window-top)+var(--status-bar-height))]"
    style="background:linear-gradient(120deg, #f0947b, #ec6d74);">
  </view>
  <view
    class="z-0 fixed top-0 left-[var(--window-left)] right-[var(--window-right)] h-[calc(var(--window-top)+var(--status-bar-height)+120rpx)]"
    style="background:linear-gradient(120deg, #f0947b, #ec6d74);">
  </view>
  <view class="z-1 m-30">
    <view class="bg-section b-rd-16" style="padding:0 30rpx;">
      <text class="text-30 lh-88">基本信息</text>
      <view class="w-full h-2 bg-base" />
      <view class="flex-row h-88">
        <label class="w-120 justify-between color-placeholder">
          <text>姓</text>
          <text>名</text>
        </label>
        <input type="text" value="陈晨" class="ml-60 h-full flex-1 text-26">
      </view>
      <view class="w-full h-2 bg-base" />
      <view class="flex-row h-88">
        <label class="w-120 justify-between color-placeholder">
          <text>性</text>
          <text>别</text>
        </label>
        <input type="text" value="男" class="ml-60 h-full flex-1 text-26">
      </view>
      <view class="w-full h-2 bg-base" />
      <view class="flex-row h-88">
        <label class="w-120 justify-between color-placeholder">
          <text>出</text>
          <text>生</text>
          <text>日</text>
          <text>期</text>
        </label>
        <input type="text" value="2024-11-14" class="ml-60 h-full flex-1 text-26">
      </view>
    </view>

    <view class="mt-30 bg-section b-rd-16" style="padding:0 30rpx;">
      <view v-for="(section, sectionIndex) in sections" :key="sectionIndex">
        <text class="text-30 lh-88">{{ section.title }}</text>
        <view class="w-full h-2 bg-base mb-30" />
        <view v-for="(item, itemIndex) in section.items" :key="itemIndex" class="mb-30">
          <text>{{ item.title }}</text>
          <radio-group name="radio" class="mt-30">
            <label>
              <radio checked value="1" :color="$config.COLOR_PRIMARY" />
              <text>是</text>
            </label>
            <label class="mt-30">
              <radio value="0" :color="$config.COLOR_PRIMARY" />
              <text>否</text>
            </label>
          </radio-group>
        </view>
      </view>
    </view>

    <button hover-class="op-60" class="mt-30 bg-primary color-inverse text-34 fw-bold !b-none lh-88 b-rd-16"
      style="margin:30rpx 0;" plain>
      提 交
    </button>

    <text class="text-center color-primary fw-400 text-22">
      这份问卷是一个基础框架，实际使用时需要由专业的儿童发展专家或医生根据婴儿的具体情况进行个性化的评估和解读。此外，评估过程中可能还需要使用一些辅助工具和测试来更准确的评估婴儿的发展水平。
    </text>
  </view>
</template>

<script lang="ts" setup>
import { $config } from '@/libs/config';
const sections = [
  {
    title: "一、生理发展",
    items: [
      { title: "1、体重增长: 婴儿的体重增长是否符合预期?" },
      { title: "2、头围和身长: 婴儿的头围和身长增长是否正常?" },
      { title: "3、睡眠模式: 婴儿是否有规律的睡眠模式?" },
      { title: "4、喂养模式: 婴儿是否有规律的喂养模式，是否能够自我安抚?" },
      { title: "5、排泄模式: 婴儿的排泄模式是否正常?" },
    ]
  },
  {
    title: "二、运动发展",
    items: [
      { title: "1、头部控制: 婴儿是否能够在俯卧时抬头?" },
      { title: "2、肢体运动: 婴儿的四肢是否有协调的运动?" },
      { title: "3、抓握反射: 婴儿是否有抓握反射?" },
      { title: "4、肌肉张力: 婴儿的肌肉张力是否正常?" },
    ]
  },
  {
    title: "三、感官发展",
    items: [
      { title: "1、视觉追踪: 婴儿是否能够追踪移动的物体?" },
      { title: "2、对光线的反应: 婴儿对光线变化是否有反应?" },
      { title: "3、听觉定位: 婴儿是否能定位声源?" },
      { title: "4、触觉反应: 婴儿对轻柔的触觉刺激是否有反应?" },
      { title: "5、嗅觉和味觉: 婴儿对不同的气味和味道是否有反应?" },
    ]
  },
  {
    title: "四、社交和情感发展",
    items: [
      { title: "1、社交微笑: 婴儿是否在社交互动中展现微笑?" },
      { title: "2、眼神接触: 婴儿是否能进行短暂的眼神接触?" },
      { title: "3、情绪表达: 婴儿是否有不同的情绪表达，如快乐、烦躁?" },
      { title: "4、安抚反应: 婴儿对安抚是否有适当的反应?" },
    ]
  },
  {
    title: "五、语言和交流发展",
    items: [
      { title: "1、哭声: 婴儿的哭声是否有不同的模式?" },
      { title: "2、咕哝和叹气: 婴儿是否有发出咕哝声或叹气?" },
      { title: "3、交流行为: 婴儿是否有通过声音或肢体动作与人交流的迹象?" },
    ]
  },
  {
    title: "六、适应和学习能力",
    items: [
      { title: "1、新环境适应: 婴儿对新环境是否有适应性反应?" },
      { title: "2、触觉适应: 婴儿对不同触觉刺激是否有适应性反应?" },
      { title: "3、学习新技能: 婴儿是否有学习新技能的迹象，如抬头或抓握?" },
    ]
  },
  {
    title: "七、健康和行为观察",
    items: [
      { title: "1、健康状况: 婴儿是否有任何健康问题或需要特别关注的地方?" },
      { title: "2、行为模式: 婴儿是否有任何异常的行为模式?" },
      { title: "3、情绪稳定性: 婴儿的情绪是否稳定?" },
    ]
  },
  {
    title: "八、家长反馈",
    items: [
      { title: "1、家长观察: 家长是否有注意到婴儿的任何特殊行为或发展里程碑?" },
      { title: "2、家长关切: 家长是否有任何关于婴儿发展的关切?" },
    ]
  },
  {
    title: "九、专业评估",
    items: [
      { title: "1、发展里程碑: 婴儿是否达到了8周龄的发展里程碑?" },
      { title: "2、专业建议: 根据观察和评估，是否有任何专业建议或干预措施?" },
    ]
  },
];
</script>

<style lang="scss" scoped>
::v-deep {

  radio {
    transform: scale(0.81);

    .uni-radio-input,
    .uni-radio-input {

      &:empty {
        border-color: $uni-text-color-placeholder;
        background-color: transparent;
      }

      &:not(:empty) {
        border-color: transparent !important;
        background: $uni-bg-color-primary;
      }

      & {
        border-width: 1px;
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