
import { ref } from "vue";

export const usePopup = () => {
  const popup = ref(false);

  const changePopup = (e: boolean) => popup.value = e;

  return [popup, changePopup] as const;
}
