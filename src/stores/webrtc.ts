import {defineStore} from 'pinia'
import useWebsocketStore from 'stores/websocket'
import useUserStore from 'stores/user'
import {
  WebRTCSignalAnswer, WebRTCSignalCandidate,
  WebRTCSignalHangUp,
  WebRTCSignalOffer, WebRTCSignalReject, WebRTCSignal,
} from 'src/types/websocket/payloads/WebRTCSignal'
import {WebsocketRequest} from 'src/types/websocket/request'
import {WebsocketResponse} from 'src/types/websocket/response'
import {UserDomain} from 'src/types/domain/auth/user'


export interface WebrtcStoreState {
  myPeerConnection: Nullable<RTCPeerConnection>
  targetUsername: Nullable<string>
  mediaConstraints: {
    audio: boolean,
    video: boolean,
  },
  callee: Nullable<UserDomain>
  caller: Nullable<string>
  callOfferData: Nullable<RTCSessionDescriptionInit> | any
  hasCallInvite: boolean
  iceCandidateMsgQueue: RTCIceCandidate[]
}

const AUDIO_ELEMENT_ID = 'call-received-audio'

export const useWebRTCStore = defineStore({
  id: 'webrtc',
  state: () => ({
    myPeerConnection: null,
    targetUsername: null,
    mediaConstraints: {
      audio: true,
      video: false,
    },
    callee: null,
    caller: null,
    callOfferData: null,
    hasCallInvite: false,
    iceCandidateMsgQueue: [],
  } as WebrtcStoreState),
  getters: {},
  actions: {
    HandleWebRTCSignal(response: WebsocketResponse<WebRTCSignal>) {
      const signalType = response.data.type
      switch (signalType) {
        case 'offer':
          this.handleCallInvite(response as WebsocketResponse<WebRTCSignalOffer>)
          break
        case 'answer':
          this.handleCallAnswer(response as WebsocketResponse<WebRTCSignalAnswer>)
          break
        case 'reject':
          this.handleCallReject(response as WebsocketResponse<WebRTCSignalReject>)
          break
        case 'candidate':
          this.handleNewICECandidateMsg(response as WebsocketResponse<WebRTCSignalCandidate>)
          break
        case 'hang-up':
          this.handleCallHangUp()
          break
      }
    },

    InviteToCall(targetUser: UserDomain) {
      console.log('InviteToCall | ***************************************************************************')
      console.log('InviteToCall | base url:', process.env.SERVER_BASE_URL)
      if (this.myPeerConnection !== null) {
        alert('You can\'t start a call because you already have one open!')
      } else {
        this.targetUsername = targetUser.mobile
        this.callee = targetUser
        this.CreatePeerConnection()

        console.log('InviteToCall | navigator.mediaDevices:', navigator.mediaDevices)
        // checkPermissions()

        navigator.mediaDevices.getUserMedia(this.mediaConstraints)
            .then((localStream) => {
              console.log(`InviteToCall | got user media: ${localStream}`)
              localStream.getTracks().forEach(track => {
                console.log('InviteToCall | track of stream:', track)
                if (this.myPeerConnection === null) throw Error('myPeerConnection is null')
                this.myPeerConnection.addTrack(track, localStream)
              })
            })
            .catch(this.handleGetUserMediaError)
      }
    },

    handleCallInvite(response: WebsocketResponse<WebRTCSignalOffer>) {
      this.hasCallInvite = true
      this.caller = response.data.name
      this.callOfferData = response.data
    },

    CreatePeerConnection() {
      const audioElement = document.createElement('audio')
      audioElement.id = AUDIO_ELEMENT_ID
      document.body.appendChild(audioElement)

      this.myPeerConnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: ['stun:stun.persia-atlas.com:3478', 'turn:turn.persia-atlas.com:3478'],
            // urls: ['stun:stun.persia-atlas.com:5349', 'turn:turn.persia-atlas.com:5349'],
            username: 'guest',
            credential: 'somepassword',
          },
        ],
      })
      console.log('CreatePeerConnection | myPeerConnection:', this.myPeerConnection)

      this.myPeerConnection.onicecandidate = this.handleICECandidateEvent
      this.myPeerConnection.ontrack = this.handleTrackEvent
      this.myPeerConnection.onnegotiationneeded = this.handleNegotiationNeededEvent
      // this.myPeerConnection.onremovetrack = this.handleRemoveTrackEvent
      this.myPeerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent
      this.myPeerConnection.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent
      this.myPeerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent
    },

    handleICECandidateEvent(event: RTCPeerConnectionIceEvent) {
      console.log('handleICECandidateEvent | event:', event)
      if (event.candidate) {
        const payload: WebRTCSignalCandidate = {
          type: 'candidate',
          target: this.targetUsername!,
          candidate: event.candidate,
        }
        console.log('handleICECandidateEvent | payload:', payload)
        const wsStore = useWebsocketStore()
        wsStore.SendCommandToWS<WebRTCSignalCandidate>({
          command: 3,
          payload: payload,
        })
      }
    },

    handleNewICECandidateMsg(response: WebsocketResponse<WebRTCSignalCandidate>) {
      console.log('handleNewICECandidateMsg | data:', response.data)
      const candidate = new RTCIceCandidate(response.data.candidate)

      if (this.myPeerConnection) {
        this.myPeerConnection.addIceCandidate(candidate)
            .catch(err => console.log('handleNewICECandidateMsg | error:', err))
      } else {
        this.iceCandidateMsgQueue.push(candidate)
      }
    },

    handleTrackEvent(event: RTCTrackEvent) {
      console.log('handleTrackEvent | event:', event)
      const audioEl = document.getElementById('received_audio') as HTMLAudioElement
      audioEl.srcObject = event.streams[0]
    },

    handleNegotiationNeededEvent() {
      if (this.myPeerConnection === null) throw Error('myPeerConnection is null')
      this.myPeerConnection.createOffer().then((offer) => {
            console.log('handleNegotiationNeededEvent | offer:', offer)
            return this.myPeerConnection!.setLocalDescription(offer)
          })
          .then(() => {
            console.log('handleNegotiationNeededEvent | send offer')
            const userStore = useUserStore()
            const wsStore = useWebsocketStore()
            wsStore.SendCommandToWS<WebRTCSignalOffer>({
              command: 3,
              payload: {
                type: 'offer',
                name: userStore.user!,
                target: this.targetUsername!,
                sdp: this.myPeerConnection!.localDescription!,
              },
            })
          })
          .catch(err => console.log('handleNegotiationNeededEvent error:', err))
    },

    handleRemoveTrackEvent(event: Event) {
      console.log('handleRemoveTrackEvent | event:', event)
      const audioEl = document.getElementById('received_video') as HTMLAudioElement
      const stream = audioEl.srcObject as MediaStream
      const trackList = stream.getTracks()
      console.log('handleRemoveTrackEvent | trackList:', trackList)

      if (trackList.length === 0) {
        this.terminateCall()
      }
    },

    handleICEConnectionStateChangeEvent(event: Event) {
      console.log('handleICEConnectionStateChangeEvent | event:', event)

      switch (this.myPeerConnection!.iceConnectionState) {
        case 'closed':
        case 'failed':
          this.terminateCall()
          break
      }
    },

    handleICEGatheringStateChangeEvent(event: Event) {
      console.log('handleICEGatheringStateChangeEvent | event:', event)
      console.log('handleICEGatheringStateChangeEvent | state:', this.myPeerConnection!.iceGatheringState)
      // Our sample just logs information to console here,
      // but you can do whatever you need.
    },

    handleSignalingStateChangeEvent(event: Event) {
      console.log('handleSignalingStateChangeEvent | event:', event)
      console.log('handleSignalingStateChangeEvent | signalingState:', this.myPeerConnection!.signalingState)

      switch (this.myPeerConnection!.signalingState) {
        case 'closed':
          this.terminateCall()
          break
      }
    },

    checkIceMsgQueue() {
      for (const candidate of this.iceCandidateMsgQueue) {
        this.myPeerConnection!.addIceCandidate(candidate)
            .catch(err => console.log('handleNewICECandidateMsg | error:', err))
      }
    },


    handleCallOffer(response: any) {
      console.log('***************************************************************************')
      console.log('HandleWebRTCOffer | response:', response)

      // checkPermissions()

      // const data = response.data
      if (this.callOfferData === null) throw Error('callOfferData is null')
      const data = this.callOfferData
      let localStream: MediaStream

      this.targetUsername = data.name
      this.CreatePeerConnection()

      // const desc = new RTCSessionDescription(data.sdp)
      const desc = new RTCSessionDescription(this.callOfferData.sdp)

      this.myPeerConnection!.setRemoteDescription(desc).then(() => {
            return navigator.mediaDevices.getUserMedia(this.mediaConstraints)
          })
          .then((stream) => {
            console.log('handleVideoOfferMsg | got user stream:', stream)
            localStream = stream
            // document.getElementById('local_video').srcObject = localStream

            localStream.getTracks().forEach(track => {
              console.log('track of stream:', track)
              this.myPeerConnection!.addTrack(track, localStream)
            })
          })
          .then(() => {
            console.log('handleVideoOfferMsg | creating answer')
            return this.myPeerConnection!.createAnswer()
          })
          .then((answer) => {
            console.log('handleVideoOfferMsg | answer:', answer)
            return this.myPeerConnection!.setLocalDescription(answer)
          })
          .then(() => {
            console.log('send answer (localDescription):', this.myPeerConnection!.localDescription)
            const userStore = useUserStore()
            const payload: WebsocketRequest<WebRTCSignalAnswer> = {
              command: 3,
              payload: {
                type: 'answer',
                name: userStore.user!,
                target: this.targetUsername!,
                sdp: this.myPeerConnection!.localDescription!,
              },
            }
            console.log('handleVideoOfferMsg | answer payload:', payload)
            const wsStore = useWebsocketStore()
            wsStore.SendCommandToWS<WebRTCSignalAnswer>(payload)
          })
          .catch(this.handleGetUserMediaError)

      this.checkIceMsgQueue()

    },

    handleCallAnswer(response: WebsocketResponse<WebRTCSignalAnswer>) {
      console.log('*** handleVideoAnswerMsg | data:', response.data)

      // Configure the remote description, which is the SDP payload
      // in our "answer" message.

      const desc = new RTCSessionDescription(response.data.sdp)
      this.myPeerConnection!.setRemoteDescription(desc)
          .catch(err => console.log('handleVideoAnswerMsg error:', err))
    },

    rejectCall() {
      console.log('reject call')
      const wsStore = useWebsocketStore()
      wsStore.SendCommandToWS<WebRTCSignalReject>({
        command: 3,
        payload: {
          type: 'reject',
          target: this.callOfferData!.name,
        },
      })

      this.callOfferData = null
      this.hasCallInvite = false
    },

    handleCallReject(response: WebsocketResponse<WebRTCSignalReject>) {
      console.log('call rejected:', response)
      this.terminateCall()
    },

    hangUpCall() {
      console.log('hangUpCall')

      const userStore = useUserStore()
      const wsStore = useWebsocketStore()
      wsStore.SendCommandToWS<WebRTCSignalHangUp>({
        command: 3,
        payload: {
          type: 'hang-up',
          name: userStore.user!,
          target: this.targetUsername!,
        },
      })

      this.terminateCall()
    },

    handleCallHangUp() {
      console.log('*** Received hang up notification from other peer')

      this.terminateCall()
    },

    handleGetUserMediaError(e: Error) {
      console.log('error:', e.name, e.message)
      switch (e.name) {
        case 'NotFoundError':
          console.error('Unable to open your call because no camera and/or microphone were found.')
          break
        case 'SecurityError':
        case 'PermissionDeniedError':
          // Do nothing; this is the same as the user canceling the call.
          break
        default:
          alert('Error opening your camera and/or microphone: ' + e.message)
          break
      }

      this.terminateCall()
    },

    terminateCall() {
      console.log('closeVideoCall')
      console.log('closeVideoCall | myPeerConnection:', this.myPeerConnection)
      // const remoteAudio = document.getElementById('video')
      this.hasCallInvite = false

      if (this.myPeerConnection) {
        this.myPeerConnection.ontrack = null
        // this.myPeerConnection.onremovetrack = null
        // this.myPeerConnection.onremovestream = null
        this.myPeerConnection.onicecandidate = null
        this.myPeerConnection.oniceconnectionstatechange = null
        this.myPeerConnection.onsignalingstatechange = null
        this.myPeerConnection.onicegatheringstatechange = null
        this.myPeerConnection.onnegotiationneeded = null

        // if (remoteAudio.srcObject) {
        //   remoteAudio.srcObject.getTracks().forEach(track => track.stop())
        // }
        // if (localVideo.srcObject) {
        //   localVideo.srcObject.getTracks().forEach(track => track.stop())
        // }

        this.myPeerConnection.close()
        this.myPeerConnection = null
      }

      const remoteAudio = document.getElementById(AUDIO_ELEMENT_ID)
      if (remoteAudio) {
        remoteAudio.removeAttribute('src')
        remoteAudio.removeAttribute('srcObject')
      }

      this.targetUsername = null
    },
  },

})

export default useWebRTCStore
