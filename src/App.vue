<template>
  <q-layout view="lHh Lpr lFf">

<!--    <q-linear-progress-->
<!--      v-show="hasHttpRequestWaiting"-->
<!--      indeterminate-->
<!--      stripe-->
<!--      class="fixed z-top"-->
<!--      color="red"-->
<!--      :animation-speed="500"-->
<!--    />-->
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
import useUserStore from 'src/stores/user'
import useWebsocketStore from 'src/stores/websocket'
import Header from 'src/components/layout/header/Header.vue'
import Sidebar from 'src/components/layout/Sidebar.vue'
import Banners from 'src/components/layout/Banners.vue'
import {broadcastInstance} from './boot/broadcast'
import {useQuasar} from 'quasar'
import {logger} from './utils'
import {setupFireBase} from './modules/push-notif'

const q = useQuasar()

const userStore = useUserStore()
const wsStore = useWebsocketStore()

const route = useRoute()

const isAuthenticated = computed(() => userStore.isAuthenticated)

const showAppLayout = computed(() => {
  const noAuthRoutes = ['404', 'Login', 'justRain']
  return isAuthenticated.value && !noAuthRoutes.includes(String(route.name))
})

if (userStore.isAuthenticated && !wsStore.WS) {
  wsStore.openWS()
}

broadcastInstance.addBroadcastCallback('LOGOUT', () => {
  userStore.Logout()
})

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

// TODO: QAjaxBar plugin

</script>
