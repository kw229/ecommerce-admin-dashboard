import { createStore } from 'vuex'

import fileSelect from './fileSelect'
import setting from './setting'

interface fileModel {
  id: string,
  url: string,
  name: string
}

export default createStore({
  state: {
  },
  mutations: {
    
  },
  actions: {
  },
  modules: {
    fileSelect,
    setting
  }
})
