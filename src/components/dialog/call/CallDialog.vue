<template>
  <q-dialog
    v-model="showDialog"
    persistent
    :maximized="!$q.screen.gt.sm"
    full-height
    square
    transition-show="slide-up"
    transition-hide="slide-down"
    :transition-duration="transitionDuration"
    ref="dialogRef"
  >
    <q-card class="call-dialog-main-card" :style="mainCardStyle">
      <q-toolbar class="bg-primary">
        <q-space/>
        <q-btn
          color="white"
          icon="expand_more"
          size="lg"
          flat
          @click="webrtcStore.closeCallDialog"
        />
      </q-toolbar>

      <div
        class="call-avatar-container"
        :style="avatarContainerStyle"
      >
        <div class="call-info-container q-pa-md">
          <div class="text-h4">
            {{ targetUserFullName }}
          </div>
          <div v-show="callConnected" class="q-mt-md text-h6">
            {{ callDuration }}
          </div>
        </div>
      </div>

      <div class="bg-primary call-actions" id="call-actions">
        <div
          class="q-pa-lg full-width row "
          :class="callConnected ? 'justify-between' : 'justify-center'"
          style="flex-direction: row"
        >
          <q-btn
            color="red"
            id="hangup-button"
            size="lg"
            icon="phone_disabled"
            round
            unelevated
            @click="hangUpCall"
          />
          <template v-if="callConnected">
            <q-btn
              id="mute-others-button"
              size="lg"
              :color="microphoneMuted ? 'black' : 'cyan-10'"
              :icon="microphoneMuted ? 'mic_off' : 'mic'"
              round
              unelevated
              @click="muteMicrophone"
            />
            <q-btn
              id="mute-me-button"
              size="lg"
              :color="speakerMuted ? 'black' : 'cyan-10'"
              :icon="speakerMuted ? 'volume_off' : 'volume_up'"
              round
              unelevated
              @click="muteSpeaker"
            />
          </template>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {useDialogPluginComponent} from 'quasar'
import useWebRTCStore from 'stores/webrtc'
import blankUserUrl from 'src/assets/svg/user-blank.svg'

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const webrtcStore = useWebRTCStore()

const showDialog = ref(false)
const microphoneMuted = ref(false)
const speakerMuted = ref(false)
const avatarContainerStyle = ref('')
const mainCardStyle = ref('')
const transitionDuration = 150

const canDisplayDialog = computed(() => webrtcStore.callConnected || webrtcStore.waitingForAnswer)
const callConnected = computed(() => webrtcStore.callConnected)
const targetUser = computed(() => webrtcStore.targetUser)
const targetUserFullName = computed(() => {
  if (!targetUser.value) return ''
  const firstName = targetUser.value.profile.firstName
  const lastName = targetUser.value.profile.lastName
  return firstName + ' ' + lastName
})
const callDuration = computed(() => webrtcStore.callDuration)

showDialog.value = canDisplayDialog.value

onMounted(() => {
  calculateAvailableHeight()
  setCallAvatar()
})
onBeforeUnmount(() => {
  avatarContainerStyle.value = ''
})

function hangUpCall() {
  webrtcStore.hangUpCall()
}

function muteMicrophone() {
  microphoneMuted.value = !microphoneMuted.value
  webrtcStore.toggleMuteMicrophone()
}

function muteSpeaker() {
  speakerMuted.value = !speakerMuted.value
  webrtcStore.toggleMuteSpeaker()
}

function calculateAvailableHeight() {
  setTimeout(() => {
    const footer = document.getElementById('call-actions') as HTMLElement
    console.log('footer', footer)
    const footerHeight = footer!.clientHeight
    mainCardStyle.value = `padding-bottom: ${footerHeight}px;`
  }, transitionDuration + 10)
}

function setCallAvatar() {
  if (targetUser.value && targetUser.value.profile.avatar) {
    const avatar = targetUser.value.profile.avatar
    avatarContainerStyle.value += `background-image: url("${avatar}")`
  } else {
    avatarContainerStyle.value += `background-image: url("${blankUserUrl}")`
  }
}
</script>

<style scoped lang="scss">

</style>
