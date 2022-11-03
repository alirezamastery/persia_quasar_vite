<template>

  <q-header
    class="flex items-center"
    :class="headerClassObj"
    :elevated="$q.screen.gt.sm"
    id="layout-header"
  >

    <VoiceCall/>

    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />

      <q-space v-if="$q.screen.gt.sm"/>
      <q-space/>

      <RobotStatus/>

      <q-space/>

      <Calendar v-if="$q.screen.gt.sm"/>

      <q-btn-group
        v-if="$q.screen.gt.sm"
        unelevated
        class="bordered"
      >
        <UserInfoDesktop/>
        <ThemeToggle/>
        <q-btn
          v-if="isAuthenticated"
          color="red"
          @click="$router.push({name: RouteNames.LOGOUT})"
          icon="power_settings_new"
          flat
        />
      </q-btn-group>

    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useQuasar} from 'quasar'
import useUserStore from 'src/stores/user'
import {generalState} from 'components/layout/sidebar/composables'
import RouteNames from 'src/router/route-names'
import ThemeToggle from './ThemeToggle.vue'
import RobotStatus from './RobotStatus.vue'
import VoiceCall from './VoiceCall.vue'
import UserInfoDesktop from './UserInfoDesktop.vue'
import Calendar from './Calendar.vue'

const q = useQuasar()
const userStore = useUserStore()
const isAuthenticated = computed(() => userStore.isAuthenticated)

const headerClassObj = computed(() => ({
  'bg-grey-10 text-white': q.dark.isActive,
  'bg-white text-black': !q.dark.isActive && q.screen.gt.sm,
}))

function toggleLeftDrawer() {
  generalState.sideOpen = !generalState.sideOpen
}
</script>

<style scoped>

</style>
