import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_baseURL,
  timeout: 15000 // 请求超时时间
})

export default service
