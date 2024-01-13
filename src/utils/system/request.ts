import axios, { AxiosError, AxiosResponse, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
const baseURL: any = import.meta.env.VITE_BASE_URL

const service: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000
})

// 请求前的统一处理
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // JWT鉴权处理
    const userStore = useUserStore()
    if (userStore.name) {
      config.headers['name'] = userStore.name
    }
    return config
  },
  (error: AxiosError) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

/**
 * response.code mean
 *  SUCCESS = 1
 *  FORBIDDEN = 2
 *  NO_PERMISSIONS = 3
 *  BAD_REQUEST = 4
 *  ERROR = 5
 */

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    if (res.code === 1) {
      return res
    } else {
      showError(res)
      return Promise.reject(res)
    }
  },
  (error: AxiosError) => {
    console.log(error) // for debug
    const badMessage: any = error.message || error
    const code = parseInt(badMessage.toString().replace('Error: Request failed with status code ', ''))
    showError({ code, message: badMessage })
    return Promise.reject(error)
  }
)

// 错误处理
function showError(error: any) {
  // token过期，清除本地数据，并跳转至登录页面
  if (error.code === 2) {
    // to login
    useUserStore().logout()
    
  } else {
    ElMessage({
      message: error.msg || error.message || '服务异常',
      type: 'error',
      duration: 3000
    })
  }

}

export default service