<template>
  <q-toggle
    :model-value="robotIsOn"
    class="truthy-black"
    color="orange"
    unchecked-icon="power_settings_new"
    checked-icon="bolt"
    size="xl"
    @update:model-value="updateRobotStatus"
  >
  </q-toggle>
  <q-spinner-gears
    size="lg"
    v-if="robotRunning"
    color="orange"
  />
  <GearsMotionless v-else/>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useQuasar} from 'quasar'
import useWebsocketStore from 'src/stores/websocket'
import useRobotStore from 'src/stores/robot'
import GearsMotionless from 'src/components/static/GearsMotionless.vue'

const q = useQuasar()
const wsStore = useWebsocketStore()
const robotStore = useRobotStore()

const robotRunning = computed(() => robotStore.robotRunning)
const robotIsOn = computed(() => robotStore.robotIsOn)
const lightMobile = computed(() => !q.dark.isActive && !q.screen.gt.sm)

function updateRobotStatus(event: Event) {
  console.log('event:', event)
  wsStore.SendCommandToWS({
    command: 2,
    payload: {
      stop: !event,
    },
  })
}
</script>

<style scoped>

</style>
