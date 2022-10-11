import {defineStore} from 'pinia'
import {LocalStorage} from 'quasar'
import useWebsocketStore from './websocket'
import useRobotStore from './robot'
import {routerInstance} from 'src/router'
import {axiosInstance} from 'src/boot/axios'
import {broadcastInstance} from 'src/boot/broadcast'
import {UserProfile} from 'src/typings/types'

const storeID = 'user'

export interface UserStoreState {
  user: Nullable<string>,
  profile: UserProfile
}

export const useUserStore = defineStore({
  id: storeID,
  state: () => ({
    user: null,
    profile: {
      first_name: null,
      last_name: null,
      avatar: null,
    },
  } as UserStoreState),
  getters: {
    isAuthenticated(): boolean {
      if (this.user !== null) return true
      else {
        const user = LocalStorage.getItem('user') as Nullable<string>
        if (user) {
          this.user = user
          return true
        }
        return false
      }
    },
  },
  actions: {
    Login(user: string) {
      this.user = user
      LocalStorage.set('user', user)
      const wsStore = useWebsocketStore()
      wsStore.HandleTokenUpdate()
    },
    Logout() {
      console.log('logout')
      this.user = null
      LocalStorage.clear()
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
    SetProfile(payload: UserProfile) {
      this.profile = payload
      let property: keyof typeof payload
      for (property in payload) {
        this.profile[property] = payload[property]
      }
    },
  },
})

export default useUserStore

