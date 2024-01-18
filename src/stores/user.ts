import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import useWebsocketStore from './websocket'
import useRobotStore from './robot'
import useWebRTCStore from 'stores/webrtc'
import { routerInstance } from 'src/router'
import { axiosInstance } from 'src/boot/axios'
import { broadcastInstance } from 'src/boot/broadcast'
import { userProfileResponseToDomain } from 'src/types/converter/profile/user-profile'
import { userResponseToDomain } from 'src/types/converter/auth/user'
import RouteNames from 'src/router/route-names'
import StorageKeys from 'src/utils/storage'
import BroadcastTypes from 'src/utils/broadcast'
import Permissions from 'src/permissions'
import { UserProfileResponse } from 'src/types/network/response/profile/user-profile'
import { UserProfileDomain } from 'src/types/domain/profile/user-profile'
import { UserDomain } from 'src/types/domain/auth/user'
import { UserResponse } from 'src/types/network/response/auth/user'

const storeID = 'user'

export interface UserStoreState {
  user: UserDomain | null
  mobile: string | null
  profile: UserProfileDomain
}

export const useUserStore = defineStore({
  id: storeID,
  state: () =>
    ({
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
      if (this.mobile !== null) return true
      else {
        const mobile = LocalStorage.getItem(StorageKeys.MOBILE) as string | null
        if (mobile) {
          this.mobile = mobile
          return true
        }
        return false
      }
    },
  },
  actions: {
    login(mobile: string): void {
      this.mobile = mobile
      LocalStorage.set(StorageKeys.MOBILE, mobile)
      const wsStore = useWebsocketStore()
      wsStore.handleTokenUpdate()
    },
    async logout(): Promise<void> {
      console.log('logout called')
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
      await routerInstance.push({ name: RouteNames.LOGIN })
    },
    clearLocalStorage(): void {
      try {
        LocalStorage.remove(StorageKeys.MOBILE)
        LocalStorage.remove(StorageKeys.USER)
        LocalStorage.remove(StorageKeys.ACCESS_TOKEN)
        LocalStorage.remove(StorageKeys.REFRESH_TOKEN)
      } catch {
        LocalStorage.clear()
      }
    },
    setUserInfo(response: UserResponse) {
      this.user = userResponseToDomain(response)
    },
    setProfile(payload: UserProfileResponse): void {
      this.profile = userProfileResponseToDomain(payload)
    },
    hasPerm(codename: string | string[]): boolean {
      const user = this.user
      if (user === null) return false
      if (typeof codename === 'string') {
        if (codename === Permissions.IS_SUPERUSER) return user.isSuperuser
        if (codename === Permissions.IS_STAFF) return user.isStaff
        if (codename === Permissions.IS_ADMIN) return user.isStaff || user.isSuperuser
        return user.permissions.map((p) => p.codename).includes(codename)
      } else {
        return codename.some((p) => this.hasPerm(p))
      }
    },
  },
})

export default useUserStore
