<template>
  <q-layout view="lHh Lpr lFf">

    <q-ajax-bar
      position="top"
      color="info"
      :hijack-filter="ajaxBarFilter"
    />

    <Header v-if="showAppLayout"/>

    <Sidebar v-if="showAppLayout"/>

    <q-page-container>

      <Banners/>

      <router-view/>

    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import useUserStore from 'src/stores/user'
import useWebsocketStore from 'src/stores/websocket'
import {broadcastInstance} from 'src/boot/broadcast'
import {firebaseSetup} from 'src/modules/push-notif-setup'
import {logger} from 'src/utils/log'
import {StorageKeys} from 'src/utils/storage'
import {BroadcastTypes} from 'src/utils/broadcast'
import Header from 'src/components/layout/header/Header.vue'
import Sidebar from 'src/components/layout/sidebar/Sidebar.vue'
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

let isDark = q.localStorage.getItem(StorageKeys.IS_DARK)
if (isDark) {
  q.localStorage.set(StorageKeys.IS_DARK, true)
  isDark = true
}
q.dark.set(!!isDark)

if (q.platform.is.android) {
  logger('android detected')
  firebaseSetup()
}

broadcastInstance.addBroadcastCallback(BroadcastTypes.LOGOUT, () => userStore.logout())
broadcastInstance.addBroadcastCallback(BroadcastTypes.SW_NEW_CONTENT, () => window.location.reload())

function ajaxBarFilter(url: string) {
  const parts = url.split('/')
  return !['task-state' , 'stream-chunk'].includes(parts[5])
}
</script>
