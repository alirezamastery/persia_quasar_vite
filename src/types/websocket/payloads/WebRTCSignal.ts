export interface WebRTCSignalOffer {
  type: 'offer'
  name: string
  target: string
  sdp: RTCSessionDescription
}

export interface WebRTCSignalHangUp {
  type: 'hang-up'
  name: string
  target: string
}

export interface WebRTCSignalReject {
  type: 'reject'
  target: string
}

export interface WebRTCSignalAnswer {
  type: 'answer'
  name: string
  target: string
  sdp: RTCSessionDescription
}

export interface WebRTCSignalCandidate {
  type: 'candidate'
  target: string
  candidate: RTCIceCandidate
}

export type WebRTCSignal = WebRTCSignalOffer
    | WebRTCSignalHangUp
    | WebRTCSignalReject
    | WebRTCSignalAnswer
    | WebRTCSignalCandidate
