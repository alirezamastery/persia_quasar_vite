import {defineStore} from 'pinia'
import {FetchData, RobotRunningData, ToggleRobotData, WebsocketResponse} from 'src/types/websocket/response'


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
    HandleFetch(response: WebsocketResponse<FetchData>) {
      console.log('HandleRobotFetch | response:', response)
      const data = response['data']
      this.robotIsOn = data['robot_is_on']
      this.robotRunning = data['robot_running']
    },
    HandleRobotRunningStatus(response: WebsocketResponse<RobotRunningData>) {
      console.log('HandleRobotStatus | response:', response)
      this.robotRunning = response['data']['robot_running']
    },
    HandleToggleRobot(response: WebsocketResponse<ToggleRobotData>) {
      console.log('HandleRobotStop | response:', response)
      this.robotIsOn = response['data']['robot_is_on']
    },
  },
})

export default useRobotStore
