import {defineStore} from 'pinia'
import {Notify, Dialog, QNotifyUpdateOptions, DialogChainObject} from 'quasar'
import useWebsocketStore from 'stores/websocket'
import useUserStore from 'stores/user'
import {notifyMessage} from 'src/modules/notif'
import {i18n} from 'boot/i18n'
import {
  WebRTCSignal,
  WebRTCSignalAnswer,
  WebRTCSignalCandidate,
  WebRTCSignalHangUp,
  WebRTCSignalOffer,
  WebRTCSignalReject,
  WebRTCSignalTypes,
} from 'src/types/websocket/payloads/WebRTCSignal'
import {WebsocketRequest} from 'src/types/websocket/request'
import {WebsocketResponse} from 'src/types/websocket/response'
import {UserDomain} from 'src/types/domain/auth/user'
import waitToneUrl from 'src/assets/sound/call-waiting.mp3'
import CallDialog from 'src/components/dialog/call/CallDialog.vue'


export interface WebrtcStoreState {

  waitingForAnswer: boolean
  callConnected: boolean
  hasCallInvite: boolean
  hangUpSignal: boolean
  targetUser: Nullable<UserDomain>
  mediaConstraints: {
    audio: boolean,
    video: boolean,
  },
  myPeerConnection: Nullable<RTCPeerConnection>
  callNotifDismiss: Nullable<(props?: QNotifyUpdateOptions) => void>
  callOfferData: Nullable<WebRTCSignalOffer>
  iceCandidateMsgQueue: RTCIceCandidate[]
  callDialog: Nullable<DialogChainObject>
  localStream: Nullable<MediaStream>
}

export const CALL_AUDIO_ELEMENT_ID = 'voice-call-audio'
export const WAIT_AUDIO_ELEMENT_ID = 'waiting-tone-audio'

export const useWebRTCStore = defineStore({
  id: 'webrtc',
  state: () => ({
    waitingForAnswer: false,
    callConnected: false,
    hasCallInvite: false,
    hangUpSignal: false,
    targetUser: null,
    mediaConstraints: {
      audio: true,
      video: false,
    },
    myPeerConnection: null,
    callNotifDismiss: null,
    callOfferData: null,
    iceCandidateMsgQueue: [],
    callDialog: null,
    localStream: null,
  } as WebrtcStoreState),
  getters: {},
  actions: {
    handleWebRTCSignal(response: WebsocketResponse<WebRTCSignal>) {
      const signalType = response.data.type
      switch (signalType) {
        case WebRTCSignalTypes.OFFER:
          this._handleCallInvite(response as WebsocketResponse<WebRTCSignalOffer>)
          break
        case WebRTCSignalTypes.ANSWER:
          this._handleCallAnswer(response as WebsocketResponse<WebRTCSignalAnswer>)
          break
        case WebRTCSignalTypes.REJECT:
          this._handleCallReject(response as WebsocketResponse<WebRTCSignalReject>)
          break
        case WebRTCSignalTypes.ICE_CANDIDATE:
          this._handleNewICECandidateMsg(response as WebsocketResponse<WebRTCSignalCandidate>)
          break
        case WebRTCSignalTypes.HANG_UP:
          this._handleCallHangUp()
          break
      }
    },

    inviteToCall(targetUser: UserDomain) {
      console.log('InviteToCall | ***************************************************************************')
      console.log('InviteToCall | base url:', process.env.SERVER_BASE_URL)
      if (this.myPeerConnection !== null) {
        alert('You can\'t start a call because you already have one open!')
      } else {
        this.targetUser = targetUser
        this._createPeerConnection()

        console.log('InviteToCall | navigator.mediaDevices:', navigator.mediaDevices)
        // checkPermissions()
        this.waitingForAnswer = true

        navigator.mediaDevices.getUserMedia(this.mediaConstraints)
            .then(async (localStream) => {
              console.log(`InviteToCall | got user media: ${localStream}`)
              this.localStream = localStream
              localStream.getTracks().forEach(track => {
                console.log('InviteToCall | track of stream:', track)
                if (this.myPeerConnection === null) throw Error('myPeerConnection is null')
                this.myPeerConnection.addTrack(track, localStream)
              })

              await this._addWaitTone()

              this.createCallDialog()

            })
            .catch(this._handleGetUserMediaError)
      }
    },

    _handleCallInvite(response: WebsocketResponse<WebRTCSignalOffer>) {
      this.hasCallInvite = true
      this.targetUser = response.data.caller
      this.callOfferData = response.data

      const {t} = i18n.global
      let callerDisplayName = response.data.caller.mobile
      if (this.targetUser.profile.firstName)
        callerDisplayName += ` ${this.targetUser.profile.firstName}`
      if (this.targetUser.profile.lastName)
        callerDisplayName += ` ${this.targetUser.profile.lastName}`
      this.callNotifDismiss = Notify.create({
        type: 'on-going',
        message: t('general.snack.callOfferFrom', {caller: callerDisplayName}),
        position: 'top',
        timeout: 0,
        classes: 'call-notif',
        actions: [
          {
            label: t('general.rejectCall'),
            icon: 'phone_disabled',
            color: 'red',
            flat: false,
            handler: this.rejectCall,
          },
          {
            label: t('general.acceptCall'),
            iconRight: 'phone',
            color: 'green',
            flat: false,
            handler: this._acceptCallOffer,
          },
        ],
      })
    },

    _createPeerConnection() {
      const audioElement = document.createElement('audio')
      audioElement.id = CALL_AUDIO_ELEMENT_ID
      audioElement.autoplay = true // this line is very important!
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
      console.log('_createPeerConnection | myPeerConnection:', this.myPeerConnection)

      this.myPeerConnection.onicecandidate = this._handleICECandidateEvent
      this.myPeerConnection.ontrack = this._handleTrackEvent
      this.myPeerConnection.onnegotiationneeded = this._handleNegotiationNeededEvent
      // this.myPeerConnection.onremovetrack = this._handleRemoveTrackEvent
      this.myPeerConnection.oniceconnectionstatechange = this._handleICEConnectionStateChangeEvent
      this.myPeerConnection.onicegatheringstatechange = this._handleICEGatheringStateChangeEvent
      this.myPeerConnection.onsignalingstatechange = this._handleSignalingStateChangeEvent
    },

    _handleICECandidateEvent(event: RTCPeerConnectionIceEvent) {
      console.log('_handleICECandidateEvent | event:', event)
      if (event.candidate) {
        const payload: WebRTCSignalCandidate = {
          type: WebRTCSignalTypes.ICE_CANDIDATE,
          target: this.targetUser!.mobile,
          candidate: event.candidate,
        }
        console.log('_handleICECandidateEvent | payload:', payload)
        const wsStore = useWebsocketStore()
        wsStore.sendCommandToWS<WebRTCSignalCandidate>({
          command: 3,
          payload: payload,
        })
      }
    },

    _handleNewICECandidateMsg(response: WebsocketResponse<WebRTCSignalCandidate>) {
      console.log('_handleNewICECandidateMsg | data:', response.data)
      const candidate = new RTCIceCandidate(response.data.candidate)

      if (this.myPeerConnection) {
        this.myPeerConnection.addIceCandidate(candidate)
            .catch(err => console.error('_handleNewICECandidateMsg | error:', err))
      } else {
        this.iceCandidateMsgQueue.push(candidate)
      }
    },

    _handleTrackEvent(event: RTCTrackEvent) {
      console.log('_handleTrackEvent | event:', event)
      const audioEl = document.getElementById(CALL_AUDIO_ELEMENT_ID) as HTMLAudioElement
      audioEl.srcObject = event.streams[0]
    },

    _handleNegotiationNeededEvent() {
      if (this.myPeerConnection === null) throw Error('myPeerConnection is null')
      this.myPeerConnection.createOffer().then((offer) => {
            console.log('_handleNegotiationNeededEvent | offer:', offer)
            return this.myPeerConnection!.setLocalDescription(offer)
          })
          .then(() => {
            console.log('_handleNegotiationNeededEvent | send offer')
            const userStore = useUserStore()
            const wsStore = useWebsocketStore()
            wsStore.sendCommandToWS<WebRTCSignalOffer>({
              command: 3,
              payload: {
                type: WebRTCSignalTypes.OFFER,
                caller: {
                  mobile: userStore.mobile!,
                  profile: userStore.profile,
                },
                target: this.targetUser!.mobile,
                sdp: this.myPeerConnection!.localDescription!,
              },
            })
          })
          .catch(err => console.error('_handleNegotiationNeededEvent error:', err))
    },

    _handleRemoveTrackEvent(event: Event) {
      console.log('_handleRemoveTrackEvent | event:', event)
      const audioEl = document.getElementById('received_video') as HTMLAudioElement
      const stream = audioEl.srcObject as MediaStream
      const trackList = stream.getTracks()
      console.log('_handleRemoveTrackEvent | trackList:', trackList)

      if (trackList.length === 0) {
        this.terminateCall()
      }
    },

    _handleICEConnectionStateChangeEvent(event: Event) {
      console.log('_handleICEConnectionStateChangeEvent | event:', event)

      switch (this.myPeerConnection!.iceConnectionState) {
        case 'closed':
        case 'failed':
          this.terminateCall()
          break
      }
    },

    _handleICEGatheringStateChangeEvent(event: Event) {
      console.log('_handleICEGatheringStateChangeEvent | event:', event)
      console.log('_handleICEGatheringStateChangeEvent | state:', this.myPeerConnection!.iceGatheringState)
      // Our sample just logs information to console here,
      // but you can do whatever you need.
    },

    _handleSignalingStateChangeEvent(event: Event) {
      console.log('_handleSignalingStateChangeEvent | event:', event)
      console.log('_handleSignalingStateChangeEvent | signalingState:', this.myPeerConnection!.signalingState)

      switch (this.myPeerConnection!.signalingState) {
        case 'closed':
          this.terminateCall()
          break
      }
    },

    _checkIceMsgQueue() {
      for (const candidate of this.iceCandidateMsgQueue) {
        this.myPeerConnection!.addIceCandidate(candidate)
            .catch(err => console.error('_handleNewICECandidateMsg | error:', err))
      }
      this.iceCandidateMsgQueue = []
    },


    _acceptCallOffer() {
      console.log('_acceptCallOffer | *******************************************')

      // checkPermissions()

      if (this.callOfferData === null) throw Error('callOfferData is null')
      let localStream: MediaStream
      this.targetUser = this.callOfferData.caller

      this._createPeerConnection()

      const desc = new RTCSessionDescription(this.callOfferData.sdp)

      this.myPeerConnection!.setRemoteDescription(desc).then(() => {
            return navigator.mediaDevices.getUserMedia(this.mediaConstraints)
          })
          .then((stream) => {
            console.log('handleVideoOfferMsg | got user stream:', stream)
            localStream = stream
            this.localStream = stream

            localStream.getTracks().forEach(track => {
              console.log('track of stream:', track)
              this.myPeerConnection!.addTrack(track, localStream)
            })
          })
          .then(() => {
            console.log('_acceptCallOffer | creating answer')
            return this.myPeerConnection!.createAnswer()
          })
          .then((answer) => {
            console.log('_acceptCallOffer | answer:', answer)
            return this.myPeerConnection!.setLocalDescription(answer)
          })
          .then(() => {
            console.log('_acceptCallOffer | send answer (localDescription):', this.myPeerConnection!.localDescription)
            const userStore = useUserStore()
            const payload: WebsocketRequest<WebRTCSignalAnswer> = {
              command: 3,
              payload: {
                type: WebRTCSignalTypes.ANSWER,
                name: userStore.user!,
                target: this.targetUser!.mobile,
                sdp: this.myPeerConnection!.localDescription!,
              },
            }
            console.log('_acceptCallOffer | answer payload:', payload)
            const wsStore = useWebsocketStore()
            wsStore.sendCommandToWS<WebRTCSignalAnswer>(payload)
            this.createCallDialog()
          })
          .catch(this._handleGetUserMediaError)

      this._checkIceMsgQueue()
      this.callConnected = true
    },

    _handleCallAnswer(response: WebsocketResponse<WebRTCSignalAnswer>) {
      console.log('****** _handleCallAnswer | data:', response.data)
      // Configure the remote description, which is the SDP payload
      // in our "answer" message.
      const desc = new RTCSessionDescription(response.data.sdp)
      this.myPeerConnection!.setRemoteDescription(desc)
          .catch(err => console.error('_handleCallAnswer error:', err))

      this.callConnected = true
      this.waitingForAnswer = false
      this._removeWaitTone()
    },

    rejectCall() {
      console.log('reject call')
      const wsStore = useWebsocketStore()
      wsStore.sendCommandToWS<WebRTCSignalReject>({
        command: 3,
        payload: {
          type: WebRTCSignalTypes.REJECT,
          target: this.callOfferData!.caller.mobile,
        },
      })

      this.callOfferData = null
      this.hasCallInvite = false
    },

    _handleCallReject(response: WebsocketResponse<WebRTCSignalReject>) {
      console.log('call rejected:', response)
      this.waitingForAnswer = false
      this.terminateCall()
      const {t} = i18n.global
      notifyMessage(
          'warning',
          t('general.callRejected'),
      )
    },

    hangUpCall() {
      console.log('HangUpCall')
      this.waitingForAnswer = false
      const userStore = useUserStore()
      const wsStore = useWebsocketStore()
      wsStore.sendCommandToWS<WebRTCSignalHangUp>({
        command: 3,
        payload: {
          type: WebRTCSignalTypes.HANG_UP,
          name: userStore.user!,
          target: this.targetUser!.mobile,
        },
      })

      this.terminateCall()
    },

    _handleCallHangUp() {
      console.log('*** Received hang up notification from other peer')
      this.hangUpSignal = true
      if (this.callNotifDismiss !== null)
        this.callNotifDismiss()
      this.terminateCall()
    },

    _handleGetUserMediaError(e: Error) {
      this.waitingForAnswer = false
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

    async _addWaitTone() {
      const waitTone = document.createElement('audio')
      document.body.appendChild(waitTone)
      waitTone.id = WAIT_AUDIO_ELEMENT_ID
      waitTone.src = waitToneUrl
      waitTone.loop = true
      await waitTone.play()
    },

    _removeWaitTone() {
      const waitTone = document.getElementById(WAIT_AUDIO_ELEMENT_ID) as HTMLAudioElement
      if (waitTone) {
        waitTone.pause()
        document.body.removeChild(waitTone)
      }
    },

    createCallDialog() {
      this.callDialog = Dialog.create({
        component: CallDialog,
      })
    },

    closeCallDialog() {
      if (this.callDialog) {
        this.callDialog.hide()
        this.callDialog = null
      }
    },

    toggleMuteMicrophone() {
      if (this.localStream) {
        const userAudio = this.localStream.getAudioTracks().find(track => track.kind === 'audio')
        if (userAudio)
          userAudio.enabled = !userAudio.enabled
      }
    },

    toggleMuteSpeaker() {
      const audioEl = document.getElementById(CALL_AUDIO_ELEMENT_ID) as HTMLAudioElement
      audioEl.muted = !audioEl.muted
    },

    terminateCall() {
      console.log('terminateCall | myPeerConnection:', this.myPeerConnection)
      this.callConnected = false
      this.hasCallInvite = false

      this.closeCallDialog()

      if (this.myPeerConnection) {
        this.myPeerConnection.ontrack = null
        // this.myPeerConnection.onremovetrack = null
        // this.myPeerConnection.onremovestream = null
        this.myPeerConnection.onicecandidate = null
        this.myPeerConnection.oniceconnectionstatechange = null
        this.myPeerConnection.onsignalingstatechange = null
        this.myPeerConnection.onicegatheringstatechange = null
        this.myPeerConnection.onnegotiationneeded = null

        this.myPeerConnection.close()
        this.myPeerConnection = null
      }

      const remoteAudio = document.getElementById(CALL_AUDIO_ELEMENT_ID) as HTMLAudioElement
      if (remoteAudio) {
        if (remoteAudio.srcObject) {
          const stream = remoteAudio.srcObject as MediaStream
          stream.getTracks().forEach(track => track.stop())
        }
        remoteAudio.removeAttribute('srcObject')
        remoteAudio.removeAttribute('src')
        document.body.removeChild(remoteAudio)
      }

      this._removeWaitTone()

      this.targetUser = null
      this.iceCandidateMsgQueue = []
      this.callOfferData = null
    },
  },

})

export default useWebRTCStore
