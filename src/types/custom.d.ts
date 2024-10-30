import { type LoadMoreState } from "@/uni_modules/wot-design-uni/components/wd-loadmore/types"

export interface IResData<T = any> {
  code: number
  msg: string
  data: T
  [key: string]: any
}

export interface Pager<T> {
  page: number
  limit?: number
  list: T[]
  cache: {
    page: number
    list: T[]
    state: LoadMoreState
  }
  next: boolean
}

export interface Config extends AnyObject {
  IGNORE_ROUTES: string[]
  URL_STATIC: string
}

export type NavigateType = 'reLaunch' | 'navigateTo' | 'switchTab' | 'redirectTo'

export interface FormDataValidatorType {
  [key: string]: {
    rule: RegExp
    value: any
    field?: string
    errorMessage?: string
  } & AnyObject
}
