import { Module } from "vuex"

export const fileSelect: Module<any, any> = {
  actions: {

  },
  state: {
    fileSelectedVisible: false,
    selectedFileCallBack: (files: any) => {}
  },
  mutations: {
    selectFile(state, callback) {
      state.fileSelectedVisible = true
      state.selectedFileCallBack = callback
    },
    selectFileDone(state, { payload }) {
      state.fileSelectedVisible = false
      state.selectedFileCallBack(payload)
      state.selectedFileCallBack = (files: any) => {}
    }
  },
};
export default fileSelect