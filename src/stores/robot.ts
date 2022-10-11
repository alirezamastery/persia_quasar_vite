import {defineStore} from 'pinia'
import {
  WebsocketFetchResponse,
  WebsocketRobotStatusResponse,
  WebsocketRobotStopResponse
} from 'src/types/websocket'


export interface RobotStoreState {
  robotRunning: boolean,
  robotIsOn: boolean | null,
}

export const useRobotStore = defineStore({
  id: 'robot',
  state: () => ({
    robotRunning: false,
    robotIsOn: null,
  } as RobotStoreState),
  getters: {},
  actions: {
    HandleFetch(response: WebsocketFetchResponse) {
      console.log('HandleRobotFetch | response:', response)
      const data = response['data']
      this.robotRunning = data['robot_running']
      this.robotIsOn = data['robot_is_on']
    },
    HandleRobotStatus(response: WebsocketRobotStatusResponse) {
      console.log('HandleRobotStatus | response:', response)
      this.robotRunning = response['data']['robot_running']
    },
    HandleRobotStop(response: WebsocketRobotStopResponse) {
      console.log('HandleRobotStop | response:', response)
      this.robotIsOn = response['data']['robot_is_on']
    },
  },
})

export default useRobotStore
