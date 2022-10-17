export enum ResponseTypes {
  ERROR = 'error',
  FETCH_RESPONSE = 'fetch_response',
  TOGGLE_ROBOT = 'toggle_robot',
  ROBOT_RUNNING = 'robot_running',
}

export interface WebsocketResponse<DayaType> {
  type: string
  req_key: string
  data: DayaType
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
