<template>
  <q-slide-transition>
    <div
      v-if="showCallBanner"
      class="q-pa-none flex full-width bg-green"
    >

      <q-item
        :dark="false"
        class="text-black"
        clickable
        @click="handleBannerClick"
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
      </q-item>

      <q-space/>

      <q-btn
        icon="phone_disabled"
        color="red"
        stretch
        @click="webrtcStore.HangUpCall"
      />

    </div>
  </q-slide-transition>
</template>

<script setup lang="ts">
import useWebRTCStore from 'stores/webrtc'
import {computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'

const route = useRoute()
const router = useRouter()
const webrtcStore = useWebRTCStore()
const hideCallBannerRoutes = [
  'ContactList', 'CallConnected', 'CallWaiting',
]

const targetUser = computed(() => webrtcStore.targetUser)
const targetUserFullName = computed(() => {
  const firstName = targetUser.value!.profile.firstName || ''
  const lastName = targetUser.value!.profile.lastName || ''
  return firstName + ' ' + lastName
})
const callConnected = computed(() => webrtcStore.callConnected)
const showCallBanner = computed(() => {
  return (callConnected.value || webrtcStore.waitingForAnswer)
    && !hideCallBannerRoutes.includes(String(route.name))
})

function handleBannerClick() {
  if (webrtcStore.waitingForAnswer)
    router.push({name: 'CallWaiting'})
  else if (webrtcStore.callConnected)
    router.push({name: 'CallConnected'})
}
</script>

<style scoped>

</style>
