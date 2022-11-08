export enum WebsocketCommands {
  FETCH = 1,
  TOGGLE_ROBOT = 2,
  WEBRTC_SIGNAL = 3,
  WEBRTC_ANSWERED = 4,
}

export interface WebsocketRequest<PayloadType = void> {
  command: number
  payload?: PayloadType
}




