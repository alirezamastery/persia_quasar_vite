import {boot} from 'quasar/wrappers'


// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files

type BroadcastPayload = { [key: string]: string }

interface BroadcastInstance {
  broadcastChannel: Nullable<BroadcastChannel>
  broadcastCallbacks: { [key: string]: (payload: BroadcastPayload) => void }
  addBroadcastCallback: (type: string, callback: () => void) => void
  sendBroadcastMessage: (type: string, payload: BroadcastPayload) => void
  setup: () => void
  teardown: () => void
}

export const broadcastInstance: BroadcastInstance = {
  broadcastChannel: null,
  broadcastCallbacks: {},

  addBroadcastCallback(type: string, callback: () => void) {
    this.broadcastCallbacks[type] = callback
  },
  sendBroadcastMessage(type: string, payload = {}) {
    if (this.broadcastChannel)
      this.broadcastChannel.postMessage({type, payload})
  },
  setup() {
    this.broadcastChannel = new BroadcastChannel('persia_atlas')
    this.broadcastChannel.onmessage = event => {
      if (event.data && event.data.type) {
        const callback = this.broadcastCallbacks[event.data.type]
        if (callback && typeof callback === 'function')
          callback(event.data.payload)
        else
          console.log('RECEIVED AN UNKNOWN BROADCAST MESSAGE')
      }
    }
  },
  teardown() {
    this.broadcastChannel = null
    this.broadcastCallbacks = {}
  },
}

broadcastInstance.setup()

export default boot(({app}) => {
  app.config.globalProperties.$broadcast = broadcastInstance
})
