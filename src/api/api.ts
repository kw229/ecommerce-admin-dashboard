import axios from 'axios'
import baseConfig from '@/config/base'
import router from '../router'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: baseConfig().baseUrl,
  timeout: 38000
})

service.interceptors.request.use(
  (config: any) => {
    config.headers.token = localStorage.getItem('token') ?? ''
    return config
  },
  (error: any) => Promise.reject(error)
)

service.interceptors.response.use(
  (response: any) => {
    if (response.status !== 200) {
      return Promise.reject(response)
    }

    if (response.data.code === 200) {
      return response.data
    }

    if (response.data.code === -10001 || response.data.code === -100022) {
      ElMessage.error(response.data.message || 'Session expired. Please sign in again.')
      setTimeout(() => {
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.value.fullPath
          }
        })
      }, 2000)
      return Promise.reject(response.data)
    }

    return response.data
  },
  (error: any) => Promise.reject(error)
)

export default service
