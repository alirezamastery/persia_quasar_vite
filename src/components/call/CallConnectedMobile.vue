<template>
  <div
    v-if="callConnected"
    id="call-container"
    class="row"
    :class="$q.screen.gt.sm ? 'q-pt-lg' : ''"
  >
    <div
      class="col-xs-12 col-md-4 offset-md-4"
    >
      <q-img
        v-if="callee.profile.avatar"
        :src="callee.profile.avatar"
        alt=""
        :class="[$q.screen.gt.sm ? 'mobile-img' : '']"
      />
      <img v-else src="~assets/svg/user-blank.svg" alt="">
    </div>

    <!--    <div class="call-actions q-pa-lg">-->
    <!--      <q-btn-->
    <!--        color="red"-->
    <!--        id="hangup-button"-->
    <!--        class="shadow-7"-->
    <!--        size="lg"-->
    <!--        icon="phone_disabled"-->
    <!--        round-->
    <!--        @click="hangUpCall"-->
    <!--      />-->
    <!--      <q-btn-->
    <!--        id="mute-button"-->
    <!--        size="lg"-->
    <!--        class="shadow-7"-->
    <!--        :color="isMuted ? 'grey' : 'transparent'"-->
    <!--        :icon="isMuted ? 'mic_off' : 'mic'"-->
    <!--        round-->
    <!--        @click="muteCall"-->
    <!--      />-->
    <!--    </div>-->

  </div>

</template>

<script setup lang="ts">


import useWebRTCStore from 'stores/webrtc'
import useUserStore from 'stores/user'
import {computed, ref} from 'vue'
import {UserDomain} from 'src/types/domain/auth/user'

const webrtcStore = useWebRTCStore()
const userStore = useUserStore()

const isMuted = ref(false)

const callConnected = computed(() => webrtcStore.myPeerConnection !== null)
const callee = computed(() => webrtcStore.callee)


function hangUpCall() {
  webrtcStore.HangUpCall()
}

function muteCall() {
  console.log('mute')
  isMuted.value = !isMuted.value
}
</script>

<style scoped>

</style>
