import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import Store from './store'
import 'element-plus/es/components/message/style/css'
import * as ElIcons from '@element-plus/icons-vue'
import '@/css/index.scss'

const app = createApp(App)
Object.keys(ElIcons).forEach(key =>{
  //console.log(ElIcons,key);
  app.component(key, ElIcons[key]);
})

app.use(Router).use(Store).mount('#app')
