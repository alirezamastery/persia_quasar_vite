export interface WebsocketCommand {
  command: number,
  req_key: string,
  payload?: { [key: string]: unknown }
}

export interface WebsocketBaseResponse {
  type: string,
  data: unknown,
  req_key: string
}

export interface WebsocketErrorResponse extends WebsocketBaseResponse {
  type: string,
  data: string
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
