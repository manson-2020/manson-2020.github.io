import { reactive } from 'vue'
import { type FormDataValidatorType } from '../types/custom.d'

export const useFormDataValidator = <T extends AnyObject>(params = {} as T) => {
  const formData = reactive({ ...params });

  const validator = <T extends FormDataValidatorType>(invalidationData = formData as T) => {
    const data: AnyObject = {}
    const result = (<Array<keyof typeof invalidationData>>Object.keys(invalidationData)).every(
      (key) => {
        const { value, field, errorMessage: title, rule } = invalidationData[key]

        if (title && !rule.test(String(value))) {
          uni.showToast({ title, icon: 'none' })
          return false
        }

        field && (data[field] = value)
        return true
      },
    )

    return result && data
  }

  return [formData, validator] as const
}
