<template>

  <q-header
    class="flex items-center"
    :class="headerClassObj"
    :height-hint="56"
    :elevated="$q.screen.gt.sm"
  >

    <CallRequest/>

    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />

      <q-toolbar-title v-if="q.screen.gt.sm">
        {{ $t('general.siteHeader') }}
      </q-toolbar-title>

      <q-space/>
      <RobotStatus/>
      <q-space v-if="q.screen.gt.sm"/>
      <q-space/>

      <q-btn-group
        v-if="$q.screen.gt.sm"
        rounded
        unelevated
      >
        <ThemeToggle/>
        <q-btn
          v-if="isAuthenticated"
          color="red"
          @click="$router.push({name: 'Logout'})"
          icon="power_settings_new"
          flat
        >
        </q-btn>
      </q-btn-group>

    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useQuasar} from 'quasar'
import useUserStore from 'src/stores/user'
import {generalState} from 'components/layout/sidebar/composables'
import ThemeToggle from './ThemeToggle.vue'
import RobotStatus from './RobotStatus.vue'
import CallRequest from './CallRequest.vue'

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
