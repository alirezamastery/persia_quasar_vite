<template>
  <q-toggle
    :model-value="robotIsOn"
    :class="isMobileLightMode ? '' : 'truthy-black'"
    :color="isMobileLightMode ? 'black' : 'orange'"
    unchecked-icon="power_settings_new"
    checked-icon="bolt"
    :size="$q.screen.gt.sm ? 'lg' : 'xl'"
    @update:model-value="updateRobotStatus"
  >
  </q-toggle>
  <q-spinner-gears
    size="lg"
    v-if="robotRunning"
    :color="isMobileLightMode ? 'black' : 'orange'"
  />
  <GearsMotionless v-else size="lg"/>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import useWebsocketStore from 'src/stores/websocket'
import useRobotStore from 'src/stores/robot'
import GearsMotionless from 'src/components/static/GearsMotionless.vue'
import {isMobileLightMode} from 'src/utils/app-status'
import {WebsocketCommands} from 'src/types/websocket/request'
import {ToggleRobot} from 'src/types/websocket/payloads/ToggleRobot'

const wsStore = useWebsocketStore()
const robotStore = useRobotStore()

const robotRunning = computed(() => robotStore.robotRunning)
const robotIsOn = computed(() => robotStore.robotIsOn)

function updateRobotStatus(event: boolean) {
  console.log('event:', event)
  wsStore.sendCommandToWS<ToggleRobot>({
    command: WebsocketCommands.TOGGLE_ROBOT,
    payload: {
      robot_is_on: event,
    },
  })
}
</script>

<style scoped>

</style>
