import {defineStore} from 'pinia'
import {LocalStorage, uid} from 'quasar'
import useRobotStore from './robot'
import {StorageKeys} from 'src/utils'
import {
  ResponseTypes,
  WebsocketResponse,
  FetchData,
  RobotRunningData,
  ToggleRobotData,
} from 'src/types/websocket/response'
import {WebsocketCommands, WebsocketRequest} from 'src/types/websocket/request'


export interface WebsocketMessage {
  command: number
  req_key: string
  payload?: unknown
}

export interface WebsocketStoreState {
  WS: WebSocket | null,
  isConnected: boolean,
  requestQueue: WebsocketRequest<unknown>[],
  sentMessages: { [key: string]: WebsocketMessage },
}

const websocketServerURL = process.env.WEBSOCKET_BASE as string
const WS_RECONNECT_INTERVAL = 2000

export const useWebsocketStore = defineStore({
  id: 'websocket',
  state: () => ({
    WS: null,
    isConnected: false,
    requestQueue: [],
    sentMessages: {},
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

      this.WS.onopen = async () => {
        console.log('%cws opened', 'color: green;')
        this.HandleWSIsOpen()
      }

      this.WS.onerror = err => {
        console.error('Socket encountered error: ', err)
      }

      this.WS.onmessage = ev => {
        const response = JSON.parse(ev.data)
        const responseType = response.type
        const msgData = response.data
        const reqKey = response.req_key
        console.info('%c onmessage - type:', 'color: yellow;', responseType, reqKey)
        console.info('%c onmessage - data:', 'color: yellow;', msgData)

        // If the response was not for a command sent from this device, do nothing
        const passThroughMsgTypes = [ResponseTypes.TOGGLE_ROBOT]
        if (
            !!reqKey
            && !passThroughMsgTypes.includes(responseType)
            && !this.sentMessages.hasOwnProperty(reqKey)
        ) {
          console.warn('no sent command with this req key')
          return
        }

        switch (responseType) {
          case ResponseTypes.ERROR:
            console.error('WS error type:', response.data)
            break
          case ResponseTypes.FETCH_RESPONSE:
            robotStore.HandleFetch(response as WebsocketResponse<FetchData>)
            break
          case ResponseTypes.TOGGLE_ROBOT:
            robotStore.HandleToggleRobot(response as WebsocketResponse<ToggleRobotData>)
            break
          case ResponseTypes.ROBOT_RUNNING:
            robotStore.HandleRobotRunningStatus(response as WebsocketResponse<RobotRunningData>)
            break
          default:
            console.error('WS response did not have a proper type')
            break
        }
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
      this.isConnected = true

      this.SendCommandToWS({
        command: WebsocketCommands.FETCH, // robot data fetch command
      })

      const queueCopy = []
      for (const msg of this.requestQueue) {
        queueCopy.push(msg)
      }
      for (const msg of queueCopy) {
        this.sendToWS(msg)
        const index = this.requestQueue.indexOf(msg)
        this.requestQueue.splice(index, 1)
      }
    },

    SendCommandToWS<Payload>(req: WebsocketRequest<Payload>) {
      if (this.isConnected)
        this.sendToWS(req)
      else
        this.requestQueue.push(req)
    },

    sendToWS<Payload>(req: WebsocketRequest<Payload>) {
      const msg: WebsocketMessage = {
        command: req.command,
        req_key: uid(),
        payload: req.payload,
      }
      if (this.WS === null) throw Error('Websocket instance is null')
      this.WS.send(JSON.stringify(msg))
      this.sentMessages[msg['req_key']] = msg
    },

  },
})

export default useWebsocketStore
