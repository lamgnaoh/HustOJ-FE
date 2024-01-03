import axios from 'axios'
import router from '@/router'
import { VUE_APP_BASE_URL } from '@/api/constant.ts'

axios.defaults.baseURL = VUE_APP_BASE_URL
axios.interceptors.request.use(
    function(config) {
      // @ts-ignore
      if (window.localStorage.getItem('token')) {
        // @ts-ignore
        config.headers['Authorization'] =
            'Bearer ' + window.localStorage.getItem('token')
      }
      return config
    },
    function(error) {
      return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    response => {
      return response
    },
    error => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // @ts-ignore
            if (!window.localStorage.getItem('times')) {
              // @ts-ignore
              window.localStorage.setItem('times', 'done')
              // @ts-ignore
              window.localStorage.setItem('token', '')
              // @ts-ignore
              window.localStorage.setItem('username', '')
              // @ts-ignore
              window.localStorage.setItem('role', '')
              const lastRoute = router.currentRoute.fullPath
              router.replace({
                path: 'login',
                query: { redirect: lastRoute },
              })
            }
        }
      }
      return Promise.reject(error.response)
    }
)

export default axios
