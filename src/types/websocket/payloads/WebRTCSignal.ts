import {UserDomain} from 'src/types/domain/auth/user'

export enum WebRTCSignalTypes {
  OFFER = 'offer',
  ANSWER = 'answer',
  REJECT = 'reject',
  HANG_UP = 'hang-up',
  ICE_CANDIDATE = 'ice-candidate',
}

export interface WebRTCSignalOffer {
  type: WebRTCSignalTypes.OFFER
  caller: UserDomain
  target: string
  sdp: RTCSessionDescription
}

export interface WebRTCSignalAnswer {
  type: WebRTCSignalTypes.ANSWER
  name: string
  target: string
  sdp: RTCSessionDescription
}

export interface WebRTCSignalReject {
  type: WebRTCSignalTypes.REJECT
  target: string
}

export interface WebRTCSignalHangUp {
  type: WebRTCSignalTypes.HANG_UP
  name: string
  target: string
}

export interface WebRTCSignalCandidate {
  type: WebRTCSignalTypes.ICE_CANDIDATE
  target: string
  candidate: RTCIceCandidate
}

export type WebRTCSignal =
    | WebRTCSignalOffer
    | WebRTCSignalHangUp
    | WebRTCSignalReject
    | WebRTCSignalAnswer
    | WebRTCSignalCandidate
