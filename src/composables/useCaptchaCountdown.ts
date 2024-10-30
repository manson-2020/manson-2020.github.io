
import { reactive } from 'vue'
export const useCaptchaCountdown = () => {
  const captcha = reactive({
    title: "验证码",
    text: "获取验证码",
    errorMessage: "验证码输入有误",
    disabled: false,
    count: 60,
    timer: null as any,
    value: "",
    field: "code",
    rule: /^[0-9]{4,6}$/
  });

  const countdown = () => {
    captcha.disabled = true;

    const intervalTask = () => {
      captcha.count--;
      captcha.text = `${captcha.count}S`;

      if (captcha.count <= 0) {
        captcha.timer && clearInterval(captcha.timer);
        Object.assign(captcha, {
          disabled: false, text: "重新获取", count: 60, timer: null,
        });
      }
      return intervalTask;
    }
    captcha.timer = setInterval(intervalTask(), 1000);
  }

  return [captcha, countdown] as const;
}
