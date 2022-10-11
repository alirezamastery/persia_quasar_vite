<template>
  <q-layout view="lHh Lpr lFf">

    <q-ajax-bar
      position="top"
      color="info"
    />

    <Header v-if="showAppLayout"/>

    <Sidebar v-if="showAppLayout"/>

    <q-page-container>

      <Banners/>

      <router-view/>

    </q-page-container>
  </q-layout>
</template>

<script setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import useUserStore from 'src/stores/user'
import useWebsocketStore from 'src/stores/websocket'
import {broadcastInstance} from 'src/boot/broadcast'
import {setupFireBase} from 'src/modules/push-notif'
import {logger} from 'src/utils'
import Header from 'src/components/layout/header/Header.vue'
import Sidebar from 'src/components/layout/Sidebar.vue'
import Banners from 'src/components/layout/Banners.vue'

const q = useQuasar()
const route = useRoute()
const userStore = useUserStore()
const wsStore = useWebsocketStore()

const isAuthenticated = computed(() => userStore.isAuthenticated)
const showAppLayout = computed(() => {
  const noAuthRoutes = ['404', 'Login', 'justRain']
  return isAuthenticated.value && !noAuthRoutes.includes(String(route.name))
})

if (userStore.isAuthenticated && !wsStore.WS) {
  wsStore.openWS()
}

let isDark = q.localStorage.getItem('isDark')
if (isDark === undefined) {
  q.localStorage.set('isDark', true)
  isDark = true
}
q.dark.set(isDark)

logger('check platform')
if (q.platform.is.android) {
  logger('android detected')
  setupFireBase()
}

broadcastInstance.addBroadcastCallback('LOGOUT', () => {
  userStore.Logout()
})
</script>
