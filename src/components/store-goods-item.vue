<template>
  <view @click="uniNavigator({ url: `/pages-sub/mall/goods-info?sn=${item.goods_sn || 0}` })"
    class="w-[calc((100%-20rpx)/2)] relative" :style="{ margin: `0 0 20rpx ${index % 2 ? `20rpx` : 0}`, }">

    <view class="absolute inset-0 b-rd-16 bg-section" style="box-shadow: 0 0 20rpx 0 rgba(0,0,0,0.1);" />

    <view class="relative p-12">
      <view class="relative">
        <wd-img radius="12" width="100%" height="320" :src="include(item.goods_img || '/static/img/mall/02.png')"
          lazyLoad mode="aspectFill" />
      </view>

      <view style="margin: 20rpx 16rpx 18rpx;">
        <text class="flex-1 text-28 ellipsis">{{ item.goods_name || "-" }}</text>
        <block v-if="showPromo">
          <text v-if="+item.rebate_score" class="mt-20">
            赠送购物值：{{ item.rebate_score }}
          </text>
          <text v-if="+item.rebate_coupon" class="mt-20">
            赠送消费券：{{ item.rebate_coupon }}
          </text>
        </block>

        <view class="mt-18 flex-row items-center">
          <text class="flex-1 lh-40 fw-bold color-primary">
            <text class="text-32">{{ Number(item.price || 0).toFixed(2) }}</text>
            <text class="ml-6 text-26">
              {{
                { 1: "元", 2: "消费券" }[item.goods_type as 1 | 2]
              }}
            </text>
          </text>
          <view class="bg-primary b-rd-50% wh-40 justify-center items-center">
            <wd-icon size="24" bold color="#fff" name="add" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { uniNavigator } from '@/libs/utils';

defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  },
  showPromo: {
    type: Boolean,
    default: true,
  }
});

</script>

<style lang="scss" scoped></style>
