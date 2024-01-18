import { boot } from 'quasar/wrappers'
import { LocalStorage } from 'quasar'
import axios, { AxiosInstance } from 'axios'
import useUserStore from '../stores/user'
import { notifyAxiosError, notifyMessage } from 'src/modules/notif'
import urls from 'src/urls'
import StorageKeys from 'src/utils/storage'
import { i18n } from 'boot/i18n'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
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
    return response
  },
  async function (error) {
    const { t } = i18n.global
    const userStore = useUserStore()

    const originalRequest = error.config

    if (!error.response || typeof error.response === 'undefined') {
      console.log('axios error.response is undefined', error)
      notifyAxiosError(error)
      return Promise.reject(error)
    } else {
      console.log(
        'in axiosInstance | BEGINNING | error.response.status: ',
        error.response.status
      )
      console.log(
        'in axiosInstance | BEGINNING | error.response.data: ',
        error.response.data
      )
      console.log('in axiosInstance | BEGINNING | error.config.url: ', error.config.url)
      if (error.response.status === 500) {
        notifyMessage('negative', t('err.api.serverConnect'))
        return Promise.reject(error)
      }
    }

    if (error.response.status === 401 && originalRequest.url === urls.refreshToken) {
      await userStore.logout()
    }

    if (error.response.status === 403 && originalRequest.url === urls.refreshToken) {
      await userStore.logout()
    }

    if (error.response.data.code === 'user_not_found') {
      await userStore.logout()
    }

    if (
      error.response.status === 403 &&
      error.response.data.code === 'token_not_valid'
      //&& error.response.statusText === 'Unauthorized'
    ) {
      const refreshToken = LocalStorage.getItem(StorageKeys.REFRESH_TOKEN) as string

      if (refreshToken) {
        console.log(
          `response.status was ${error.response.status} - we will use refreshToken: `,
          refreshToken
        )
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))

        const now = Date.now()
        // exp date in token is expressed in seconds, while now() returns milliseconds:
        if (tokenParts.exp * 1000 > now) {
          try {
            const res = await axiosInstance.post(urls.refreshToken, {
              refresh: refreshToken,
            })
            LocalStorage.set(StorageKeys.ACCESS_TOKEN, res.data.access)
            LocalStorage.set(StorageKeys.REFRESH_TOKEN, res.data.refresh)

            axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + res.data.access
            originalRequest.headers['Authorization'] = 'Bearer ' + res.data.access

            return axiosInstance(originalRequest)
          } catch (e) {
            console.log('error using refresh token:', e)
            notifyMessage('negative', t('err.api.serverConnect'))
            await userStore.logout()
          }
        } else {
          notifyMessage('negative', t('err.api.refreshTokenExpired'))
          await userStore.logout()
        }
      } else {
        notifyMessage('negative', t('err.api.refreshTokenInvalid'))
        await userStore.logout()
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axiosInstance
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = axiosInstance
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axiosInstance }
