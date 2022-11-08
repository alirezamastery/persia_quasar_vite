<template>
  <q-slide-transition :duration="150">
    <div
      v-if="showCallBanner"
      class="q-pa-none flex full-width bg-green"
    >

      <q-item
        :dark="false"
        class="text-black"
        clickable
        @click="handleBannerClick"
        dense
        style="flex: 1;"
      >
        <q-item-section avatar>
          <q-avatar>
            <q-img
              v-if="targetUser.profile.avatar"
              :src="targetUser.profile.avatar"
              alt=""
              :class="[$q.screen.gt.sm ? 'mobile-img' : '']"
            />
            <img v-else src="~assets/svg/user-blank.svg" alt="">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">
            {{ targetUserFullName }}
          </q-item-label>
        </q-item-section>

        <div
          class="q-px-md text-black flex-center"
          style="display: flex"
        >
          {{ callDuration }}
        </div>

      </q-item>

      <q-btn
        icon="phone_disabled"
        color="red"
        stretch
        @click="webrtcStore.hangUpCall"
      />

    </div>
  </q-slide-transition>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import useWebRTCStore from 'stores/webrtc'

const webrtcStore = useWebRTCStore()

const targetUser = computed(() => webrtcStore.targetUser)
const targetUserFullName = computed(() => {
  const firstName = targetUser.value!.profile.firstName || ''
  const lastName = targetUser.value!.profile.lastName || ''
  return firstName + ' ' + lastName
})
const callConnected = computed(() => webrtcStore.callConnected)
const showCallBanner = computed(() => {
  return (callConnected.value || webrtcStore.waitingForAnswer)
})
const callDuration = computed(() => webrtcStore.callDuration)

function handleBannerClick() {
  webrtcStore.createCallDialog()
}
</script>

<style scoped>

</style>
