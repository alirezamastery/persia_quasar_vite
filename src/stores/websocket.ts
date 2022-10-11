import {defineStore} from 'pinia'
import {LocalStorage, uid} from 'quasar'
import useRobotStore from './robot'
import {
  WebsocketErrorResponse,
  WebsocketFetchResponse,
  WebsocketRobotStatusResponse,
  WebsocketRobotStopResponse,
} from 'src/types/websocket'
import {StorageKeys} from 'src/utils'


const websocketServerURL = process.env.WEBSOCKET_BASE as string
const WS_RECONNECT_INTERVAL = 1000

export interface WebsocketStoreState {
  WS: WebSocket | null,
  isWSOpen: boolean,
  wsMsgQueue: unknown[],
  sentCommands: { [index: string]: unknown },
}

// export type WebsocketMessageHandler = { [index: string]: (res: WebsocketBaseResponse) => void }
export type WebsocketMessageHandler = {
  [key: string]: (res: any) => void
}

export const useWebsocketStore = defineStore({
  id: 'websocket',
  state: () => ({
    WS: null,
    isWSOpen: false,
    wsMsgQueue: [],
    sentCommands: {},
  } as WebsocketStoreState),
  getters: {},
  actions: {
    openWS() {
      const accessToken = LocalStorage.getItem(StorageKeys.ACCESS_TOKEN) as string
      this.WS = new WebSocket(websocketServerURL, [accessToken])
      this.setupWS()
    },
    setupWS() {
      console.log('ws setup')
      if (this.WS === null) throw Error('Websocket instance is null')

      const robotStore = useRobotStore()
      // const webrtcStore = useWebRTCStore()

      const MESSAGE_HANDLERS: WebsocketMessageHandler = {
        'error': (res: WebsocketErrorResponse) => console.error(res.data),
        'fetch_response': (res: WebsocketFetchResponse) => robotStore.HandleFetch(res),
        'robot_status': (res: WebsocketRobotStatusResponse) => robotStore.HandleRobotStatus(res),
        'robot_stopped': (res: WebsocketRobotStopResponse) => robotStore.HandleRobotStop(res),
        // 'webrtc_signal': response => webrtcStore.handleWebRTCSignal(response),
      }


      this.WS.onopen = async () => {
        console.log('%cws opened', 'color: green;')
        this.HandleWSIsOpen()
      }

      this.WS.onerror = err => {
        console.error('Socket encountered error: ', err)
      }

      this.WS.onmessage = ev => {
        const response = JSON.parse(ev.data)
        const msgType = response.type
        const msgData = response.data
        const reqKey = response.req_key
        console.info('%c onmessage - type:', 'color: yellow;', msgType, reqKey)
        console.info('%c onmessage - data:', 'color: yellow;', msgData)

        // If the response was not for a command sent from this device, do nothing
        const passThroughMsgTypes = ['robot_stopped']
        if (
            !!reqKey
            && !passThroughMsgTypes.includes(msgType)
            && !this.sentCommands.hasOwnProperty(reqKey)
        ) {
          console.warn('no sent command with this req key')
          return
        }

        MESSAGE_HANDLERS[msgType](response)
      }

      this.WS.onclose = ev => {
        console.log(`ws close | reason: ${ev.reason} | code: ${ev.code}`)
        this.$reset()
        setTimeout(() => {
              this.openWS()
            },
            WS_RECONNECT_INTERVAL,
        )
      }
    },

    HandleTokenUpdate() {
      const accessToken = LocalStorage.getItem(StorageKeys.ACCESS_TOKEN)
      console.log('Token Updated', accessToken)
      if (accessToken) {
        if (this.WS) {
          this.HandleLogout()
        }
        this.openWS()
      }
    },

    HandleLogout() {
      if (this.WS) {
        this.WS.onclose = function () {
          console.log('ws close after logout')
        }
        this.WS.close()
      }
      this.$reset()
    },

    HandleWSIsOpen() {
      this.isWSOpen = true

      this.SendCommandToWS({
        command: 1, // robot data fetch command
      })

      const queueCopy = []
      for (const msg of this.wsMsgQueue) {
        queueCopy.push(msg)
      }
      for (const msg of queueCopy) {
        this.sendToWS(msg)
        const index = this.wsMsgQueue.indexOf(msg)
        this.wsMsgQueue.splice(index, 1)
      }
    },

    SendCommandToWS(payload: unknown) {
      if (this.isWSOpen)
        this.sendToWS(payload)
      else
        this.wsMsgQueue.push(payload)
    },

    sendToWS(request: any) {
      request['req_key'] = uid()
      if (this.WS === null) throw Error('Websocket instance is null')
      this.WS.send(JSON.stringify(request))
      this.sentCommands[request['req_key']] = request['payload']
    },

  },
})

export default useWebsocketStore
