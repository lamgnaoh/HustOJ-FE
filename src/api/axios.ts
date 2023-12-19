import axios from 'axios'
import router from '@/router'

axios.defaults.baseURL = 'http://localhost:8081'
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
