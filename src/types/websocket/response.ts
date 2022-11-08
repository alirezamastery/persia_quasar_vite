import {UserResponse} from 'src/types/network/response/auth/user'


export enum ResponseTypes {
  ERROR = 'error',
  FETCH_RESPONSE = 'fetch_response',
  TOGGLE_ROBOT = 'toggle_robot',
  ROBOT_RUNNING = 'robot_running',
  WEBRTC_SIGNAL = 'webrtc_signal',
  WEBRTC_ANSWERED = 'webrtc_answered',
  USER_STATUS = 'user_status',
}

export interface WebsocketResponse<DataType> {
  type: string
  req_key: string
  data: DataType
}

export interface FetchData {
  robot_is_on: boolean
  robot_running: boolean
}

export interface ToggleRobotData {
  robot_is_on: boolean
}

export interface RobotRunningData {
  robot_running: boolean
}

export interface UserStatsData {
  user: UserResponse
  is_online: boolean
}
