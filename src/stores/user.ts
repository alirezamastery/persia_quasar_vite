import {defineStore} from 'pinia'
import {LocalStorage} from 'quasar'
import useWebsocketStore from './websocket'
import useRobotStore from './robot'
import {routerInstance} from 'src/router'
import {axiosInstance} from 'src/boot/axios'
import {broadcastInstance} from 'src/boot/broadcast'
import {StorageKeys} from 'src/utils'
import {UserProfileResponse} from 'src/types/network/response/profile/user-profile'
import {UserProfileDomain} from 'src/types/domain/profile/user-profile'
import {userProfileResponseToDomain} from 'src/types/converter/profile/user-profile'


const storeID = 'user'

export interface UserStoreState {
  user: Nullable<string>,
  profile: UserProfileDomain
}

export const useUserStore = defineStore({
  id: storeID,
  state: () => ({
    user: null,
    profile: {
      firstName: '',
      lastName: '',
      avatar: null,
    },
  } as UserStoreState),
  getters: {
    isAuthenticated(): boolean {
      if (this.user !== null) return true
      else {
        const user = LocalStorage.getItem(StorageKeys.USER) as Nullable<string>
        if (user) {
          this.user = user
          return true
        }
        return false
      }
    },
  },
  actions: {
    Login(user: string): void {
      this.user = user
      LocalStorage.set(StorageKeys.USER, user)
      const wsStore = useWebsocketStore()
      wsStore.HandleTokenUpdate()
    },
    Logout(): void {
      console.log('logout')
      this.user = null
      this.ClearLocalStorage()
      delete axiosInstance.defaults.headers['Authorization']
      broadcastInstance.sendBroadcastMessage('LOGOUT', {})
      broadcastInstance.teardown()
      const wsStore = useWebsocketStore()
      wsStore.HandleLogout()
      const robotStore = useRobotStore()
      robotStore.$reset()
      this.$reset()
      routerInstance.push({name: 'Login'})
    },
    ClearLocalStorage(): void {
      try {
        LocalStorage.remove(StorageKeys.USER)
        LocalStorage.remove(StorageKeys.ACCESS_TOKEN)
        LocalStorage.remove(StorageKeys.REFRESH_TOKEN)
      } catch {
        LocalStorage.clear()
      }
    },
    SetProfile(payload: UserProfileResponse): void {
      this.profile = userProfileResponseToDomain(payload)
    },
  },
})

export default useUserStore

