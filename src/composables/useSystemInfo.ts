import { onMounted, ref } from 'vue'

export const useSystemInfo = () => {
  const systemInfo = ref<UniNamespace.GetSystemInfoResult | AnyObject>({})

  onMounted(() => {
    systemInfo.value = uni.getSystemInfoSync() || {}
  })

  return systemInfo
}
