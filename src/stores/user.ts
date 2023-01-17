import {defineStore} from 'pinia'
import {LocalStorage} from 'quasar'
import useWebsocketStore from './websocket'
import useRobotStore from './robot'
import useWebRTCStore from 'stores/webrtc'
import {routerInstance} from 'src/router'
import {axiosInstance} from 'src/boot/axios'
import {broadcastInstance} from 'src/boot/broadcast'
import {UserProfileResponse} from 'src/types/network/response/profile/user-profile'
import {UserProfileDomain} from 'src/types/domain/profile/user-profile'
import {userProfileResponseToDomain} from 'src/types/converter/profile/user-profile'
import RouteNames from 'src/router/route-names'
import {StorageKeys} from 'src/utils/storage'
import {BroadcastTypes} from 'src/utils/broadcast'


const storeID = 'user'

export interface UserStoreState {
  user: Nullable<string>,
  mobile: Nullable<string>
  profile: UserProfileDomain
}

export const useUserStore = defineStore({
  id: storeID,
  state: () => ({
    user: null,
    mobile: null,
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
          this.mobile = user
          return true
        }
        return false
      }
    },
  },
  actions: {
    login(user: string): void {
      this.user = user
      LocalStorage.set(StorageKeys.USER, user)
      const wsStore = useWebsocketStore()
      wsStore.handleTokenUpdate()
    },
    logout(): void {
      console.log('logout')
      this.clearLocalStorage()
      delete axiosInstance.defaults.headers['Authorization']
      broadcastInstance.sendBroadcastMessage(BroadcastTypes.LOGOUT, {})
      broadcastInstance.teardown()
      const wsStore = useWebsocketStore()
      wsStore.handleLogout()
      const robotStore = useRobotStore()
      robotStore.$reset()
      const webrtcStore = useWebRTCStore()
      webrtcStore.$reset()
      webrtcStore.terminateCall()
      this.$reset()
      routerInstance.push({name: RouteNames.LOGIN})
    },
    clearLocalStorage(): void {
      try {
        LocalStorage.remove(StorageKeys.USER)
        LocalStorage.remove(StorageKeys.ACCESS_TOKEN)
        LocalStorage.remove(StorageKeys.REFRESH_TOKEN)
      } catch {
        LocalStorage.clear()
      }
    },
    setProfile(payload: UserProfileResponse): void {
      this.profile = userProfileResponseToDomain(payload)
    },
  },
})

export default useUserStore

