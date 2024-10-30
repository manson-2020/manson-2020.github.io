
import { createStore, mapState, useStore } from 'vuex';
import { computed } from "vue";
import { create, all } from "mathjs";
import persistedState from "vuex-persistedstate";

export interface State {
  theme: "light" | "dark";
  address: any;
  confirmOrder: any;
  shoppingCart: any;
  card: any;
};

const state: State = {
  theme: "light",
  address: null,
  confirmOrder: {},
  shoppingCart: [],
  card: {},
};

export const math = create(all, {
  epsilon: 1e-12,
  matrix: "Matrix",
  number: "BigNumber", // 可选值：number BigNumber
  precision: 64,
  predictable: false,
  randomSeed: null
});

const mutations = {
  setState(state: State, payload: { key: keyof State; value: any }) {
    state[payload.key] = payload.value;
  },
};

const actions = {};

export const useMapState = (getKeys: string[]) => {
  const $store = useStore();
  const storeState: any = {};
  const storeFns = mapState(getKeys)

  Object.keys(storeFns).forEach((fnKeys: string) => {
    const fn = storeFns[fnKeys].bind({ $store })
    storeState[fnKeys] = computed(fn)
  })

  return storeState;
}

export default createStore({
  plugins: [
    persistedState({
      storage: {
        getItem: key => uni.getStorageSync(key)?.value,
        setItem: (key, value) => uni.setStorageSync(key, { key, createTime: Date.now(), value }),
        removeItem: key => uni.removeStorageSync(key)
      },
      reducer(val) {
        return {}
      }
    })
  ],
  state,
  mutations,
  actions
});
