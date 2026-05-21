import httpUtils from "@/api/httpUtils";
import { Module } from "vuex"

export const staticMap: Module<any, any> = {
  actions: {
    async fetchSysSetting({ commit }) {
      const { data } = await httpUtils.requestData('/setting/adminSetting')
      if (data.title) {
        document.title = data.title
      }
      commit('setSysSetting', { payload: data })
    }
  },
  state: {
  },
  mutations: {
    setSysSetting(state, { payload }) {
      // if (payload && payload.open_qiniu) {
      //   state.openQiniu = payload.open_qiniu
      // }
    }
  },
  getters: {

  }
};
export default staticMap