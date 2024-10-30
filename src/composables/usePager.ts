import { deepClone } from "@/libs/utils";
import { type Pager } from "@/types/custom.d";
/**
 * @description 列表数据分页，渲染当页数据，缓存下页数据
 * @param {UniNamespace.RequestOptions} options 请求体参数
 * @param {Pager} reactiveData 渲染列表响应数据
 * @param {string} listKey 响应列表键
 * @param {string} method 列表追加方式
 * @return {Promise<void>} Promise<void>
 */
export const pager = <T = AnyObject>(
  options: UniNamespace.RequestOptions,
  reactiveData: Pager<T>,
  { listKey = '', method = 'push' as 'push' | 'unshift', pageKey = 'page', limitKey = 'limit' },
) =>
  new Promise<any>((resolve, reject) => {
    if (!isReactive(reactiveData)) return reject(`The incoming data is not a "reactive" data.`)
    if (reactiveData.cache.list.length) {
      !reactiveData.page
        ? (reactiveData.list = reactiveData.cache.list)
        : reactiveData.list[method](...reactiveData.cache.list)
      reactiveData.page = reactiveData.cache.page
      resolve(toRaw(reactiveData.cache.list))
      reactiveData.cache.list = []
    }
    reactiveData.next = reactiveData.cache.page > reactiveData.page
    if (!reactiveData.cache.page || reactiveData.cache.state === 'loading') {
      reactiveData.next = true
      return 'No more or loading.'
    }
    reactiveData.cache.state = 'loading'
    reactiveData.limit = reactiveData.limit || 30

    uni.request({
      url: options.url,
      method: options.method,
      data: {
        [pageKey]: reactiveData.cache.page,
        [limitKey]: reactiveData.limit,
        ...((options.data as AnyObject) || {}),
      },
      success({ data }: AnyObject) {
        const list = (listKey ? data[listKey] : data) || []
        if (!Array.isArray(list)) return reject(`${options.url} Response data exception.`)
        const isLastPage = list.length < reactiveData.limit!
        reactiveData.cache.state = 'finished'
        reactiveData.cache.page = isLastPage ? 0 : reactiveData.cache.page + 1
        if (!reactiveData.page && isLastPage) {
          reactiveData.list = list
          return resolve(list)
        }
        reactiveData.cache.list = list
        reactiveData.next && pager(options, reactiveData, { listKey, method, pageKey, limitKey })
        resolve(list)
      },
    })
  })

export const usePager = <T extends {}>(initOptions: ComputedRef<UniNamespace.RequestOptions> | UniNamespace.RequestOptions, params = {} as T, ext = {}) => {
  const basePagerData = {
    page: 0, list: [] as AnyObject[], next: false,
    cache: { page: 1, list: [] as AnyObject[], state: "finished" }
  } as const;

  const pageData = reactive<Pager<AnyObject> & T>({ ...deepClone(basePagerData), ...params });

  const clearPageData = () => Object.assign(pageData, deepClone(basePagerData));

  const getPageData = (options?: UniNamespace.RequestOptions) => {
    if (!options) {
      if ("value" in initOptions) {
        options = initOptions.value;
      } else if ("url" in initOptions) {
        options = initOptions;
      } else {
        throw new Error("参数错误");
      }
    }

    return pager(options, pageData, ext);
  };

  return [pageData, getPageData, clearPageData] as const;
}
