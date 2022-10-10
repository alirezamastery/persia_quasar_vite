import {defineStore} from 'pinia'
import {WebsocketBaseResponse} from 'src/typings/types'

export interface RobotStoreState {
  robotRunning: boolean,
  robotIsOn: boolean | null,
}

export interface WebsocketFetchResponse extends WebsocketBaseResponse {
  data: {
    robot_running: boolean,
    robot_is_on: boolean
  }
}

export interface WebsocketRobotStatusResponse extends WebsocketBaseResponse {
  data: {
    robot_running: boolean,
  }
}

export interface WebsocketRobotStopResponse extends WebsocketBaseResponse {
  data: {
    robot_is_on: boolean,
  }
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
