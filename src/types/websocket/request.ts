export enum WebsocketCommands {
  FETCH = 1,
  TOGGLE_ROBOT = 2,
}

export interface WebsocketRequest<PayloadType = void> {
  command: number
  req_key: string
  payload?: PayloadType
}


