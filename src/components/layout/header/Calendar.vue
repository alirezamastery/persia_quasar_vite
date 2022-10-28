<template>
  <q-item class="">
    <q-item-section>
      <q-item-label>
        {{ timeDisplay }}
      </q-item-label>
    </q-item-section>
    <q-item-section style="width: 2.5rem">
      <q-item-label style="white-space: nowrap">
        {{ dateDisplay }}
      </q-item-label>
<!--      <q-item-label>-->
<!--        {{ timeDisplay }}-->
<!--      </q-item-label>-->
    </q-item-section>
    <div class="q-px-sm flex items-center">
      <q-icon name="fa fa-calendar-alt" size="xs"/>
    </div>
  </q-item>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'

const date = new Date()
const dateDisplay = Intl.DateTimeFormat(
  'fa-IR-u-nu-latn',
  {month: 'short', day: 'numeric'},
).format(date)

const time = Intl.DateTimeFormat(
  'fa-IR-u-nu-latn',
  {hour: 'numeric', minute: '2-digit'},
).format(date)
const timeDisplay = ref(time)
onMounted(() => {
  setInterval(() => {
    timeDisplay.value = Intl.DateTimeFormat(
      'fa-IR-u-nu-latn',
      {hour: 'numeric', minute: '2-digit'},
    ).format(new Date())
  }, 60000)
})
</script>

<style scoped>

</style>
