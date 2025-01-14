import axios from 'axios'

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://tudlo.cctcccs.com/', // Your API base URL
})

// Add a request interceptor
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('cms_auth_token') // Retrieve token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}` // Set Authorization header
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

export default axiosInstance
