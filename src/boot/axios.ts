import {boot} from 'quasar/wrappers'
import {LocalStorage} from 'quasar'
import axios, {AxiosInstance} from 'axios'
import {notifyAxiosError} from 'src/modules/notif'
import useUserStore from '../stores/user'
import useWebsocketStore from '../stores/websocket'
import urls from 'src/urls'
import {StorageKeys} from 'src/utils'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const baseURL = process.env.API_BASE
console.log('baseURL', baseURL)

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 0,
  headers: {
    Authorization: LocalStorage.getItem(StorageKeys.ACCESS_TOKEN)
      ? `Bearer ${LocalStorage.getItem(StorageKeys.ACCESS_TOKEN)}`
      : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
})


axiosInstance.interceptors.response.use(
  function (response) {
    // console.log('intercept' , response)
    return response
  },
  async function (error) {
    const userStore = useUserStore()

    const originalRequest = error.config
    console.log('in axiosInstance | BEGINNING | error: ', error)
    console.log('config baseURL:', error.config.baseURL)

    if (!error.response || typeof error.response === 'undefined') {
      console.log('axios error.response is undefined', error)
      notifyAxiosError(error)
      return Promise.reject(error)
    } else {
      console.log('in axiosInstance | BEGINNING | error.response.data: ', error.response.data)
      console.log('in axiosInstance | BEGINNING | error.response.status: ', error.response.status)
      if (error.response.status !== 403) {
        notifyAxiosError(error)
      }
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === urls.refreshToken
    ) {
      userStore.logout()
      return Promise.reject(error)
    }

    if (
      error.response.status === 403
      && originalRequest.url === urls.refreshToken
    ) {
      userStore.logout()
      return Promise.reject(error)
    }

    if (
      error.response.status === 403
      //&& error.response.data.code === 'token_not_valid'
      //&& error.response.statusText === 'Unauthorized'
    ) {
      const refreshToken = LocalStorage.getItem(StorageKeys.REFRESH_TOKEN) as string

      if (refreshToken) {
        console.log(`response.status was ${error.response.status} so we will use refreshToken: `, refreshToken)
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))

        const now = Date.now()
        // exp date in token is expressed in seconds, while now() returns milliseconds:
        if (tokenParts.exp * 1000 > now) {
          return axiosInstance
            .post(urls.refreshToken, {refresh: refreshToken})
            .then((response) => {
              LocalStorage.set(StorageKeys.ACCESS_TOKEN, response.data.access)
              LocalStorage.set(StorageKeys.REFRESH_TOKEN, response.data.refresh)

              axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + response.data.access
              originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access

              const wsStore = useWebsocketStore()
              wsStore.handleTokenUpdate()

              return axiosInstance(originalRequest)
            })
            .catch(async (err) => {
              console.log('error in refresh token part: ', err)
              userStore.logout()
            })
        } else {
          console.log('Refresh token is expired', tokenParts, now)
          userStore.logout()
        }
      } else {
        console.log('in axiosInstance: Refresh token not available. refreshToken is: ', refreshToken)
        userStore.logout()
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error)
  },
)

export default boot(({app}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axiosInstance
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = axiosInstance
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export {axiosInstance}
