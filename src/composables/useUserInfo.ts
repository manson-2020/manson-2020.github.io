import { $config } from "@/libs/config";
import type { IResData } from "@/types/custom.d";

export const useUserInfo = () => {
  const userInfo = reactive<AnyObject>({});

  const getUserInfo = async () => {
    const { data } = await <unknown>uni.request({ url: $config.API_USER_INFO_GET }) as IResData;
    Object.assign(userInfo, data || {});
    return data;
  }

  return [userInfo, getUserInfo] as const;
}
