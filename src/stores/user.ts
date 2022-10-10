import {defineStore} from 'pinia'
import {routerInstance} from 'src/router'
import {axiosInstance} from 'src/boot/axios'
import localDb from 'src/local-db'
import {broadcastInstance} from 'src/boot/broadcast'
import useWebsocketStore from './websocket'
import useRobotStore from './robot'
import {UserProfile} from 'src/typings/types'

const storeID = 'user'


export interface UserStoreState {
  user: string | null,
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
      if (this.user) return true
      else {
        const user = localDb.get('user')
        if (user !== undefined) {
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
      localDb.set('user', user)
      const wsStore = useWebsocketStore()
      wsStore.HandleTokenUpdate()
    },
    Logout() {
      this.user = null
      localDb.clearAll()
      delete axiosInstance.defaults.headers['Authorization']
      broadcastInstance.sendBroadcastMessage('LOGOUT', {})
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

