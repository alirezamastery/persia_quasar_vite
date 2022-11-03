<template>
  <div
    id="call-container"
    class="row relative-position"
    :class="$q.screen.gt.sm ? 'q-pt-lg' : 'call-container-mobile'"
    :style="$q.screen.gt.sm ? '' : containerStyle"
  >
    <div
      v-if="$q.screen.gt.sm && targetUser"
      class="row full-width full-height"
    >
      <div class="col-xs-12 col-md-4 offset-md-4">
        <q-img
          v-if="targetUser.profile.avatar"
          :src="targetUser.profile.avatar"
          alt=""
          :class="[$q.screen.gt.sm ? 'mobile-img' : '']"
        />
        <img v-else src="~assets/svg/user-blank.svg" alt="">
      </div>
    </div>

    <div
      class="row full-width q-pa-lg items-center justify-center callee-info-container"
      :class="$q.screen.gt.sm ? 'q-mt-lg' : 'callee-info-mobile'"
    >
      <div class="text-h4">
        {{ targetUserFullName }}
      </div>
    </div>

    <div
      class="row full-width q-pa-lg flex justify-between call-actions-container"
      :class="$q.screen.gt.sm ? 'q-mt-lg' : 'call-actions-mobile'"
      id="call-actions-container"
    >
      <div
        class="col-1 flex justify-start items-center"
        :class="$q.screen.gt.sm"
      >
        <q-btn
          color="red"
          id="hangup-button"
          class="shadow-7"
          size="lg"
          icon="phone_disabled"
          round
          @click="hangUpCall"
        />
      </div>
      <div class="col-xs-6 col-sm-8 col-md-6 flex justify-center items-center">
        <q-slider
          v-model="volumeLevel"
          :min="0"
          :max="100"
          style="z-index: 100"
          label
        />
      </div>
      <div class="col-1 flex justify-end items-center">
        <q-btn
          id="mute-button"
          size="lg"
          class="shadow-7"
          :color="isMuted ? 'black' : 'grey-7'"
          :icon="isMuted ? 'mic_off' : 'mic'"
          round
          @click="muteCall"
        />
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {ref, computed, watch, onMounted, onBeforeUnmount} from 'vue'
import {useRouter} from 'vue-router'
import useWebRTCStore from 'stores/webrtc'
import blankUserUrl from 'src/assets/svg/user-blank.svg'


const router = useRouter()
const webrtcStore = useWebRTCStore()

const isMuted = ref(false)
const containerStyle = ref('')
const volumeLevel = ref(100)

const callConnected = computed(() => webrtcStore.callConnected)
if (!callConnected.value) {
  router.push({name: 'ContactList'})
}
const targetUser = computed(() => webrtcStore.targetUser)
const targetUserFullName = computed(() => {
  if (!targetUser.value) return ''
  const firstName = targetUser.value.profile.firstName
  const lastName = targetUser.value.profile.lastName
  return firstName + ' ' + lastName
})

onMounted(() => {
  window.addEventListener('resize', calculateAvailableHeight)
  calculateAvailableHeight()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateAvailableHeight)
})

watch(() => callConnected.value, (newVal) => {
  if (!newVal)
    router.push({name: 'ContactList'})
})


function hangUpCall() {
  webrtcStore.HangUpCall()
}

function muteCall() {
  console.log('mute')
  isMuted.value = !isMuted.value
}

function calculateAvailableHeight() {
  const header = document.getElementById('layout-header')
  const headerHeight = header!.clientHeight
  containerStyle.value = `height: calc(100vh - ${headerHeight}px);`
  if (targetUser.value && targetUser.value.profile.avatar) {
    const avatar = targetUser.value.profile.avatar
    containerStyle.value += `background-image: url("${avatar}")`
  } else {
    containerStyle.value += `background-image: url("${blankUserUrl}")`
  }
}

</script>

<style scoped lang="scss">

</style>
