<template>
  <q-btn
    v-if="q.dark.isActive"
    text-color="amber"
    icon="light_mode"
    class="bg-transparent"
    @click="handleThemeToggle"
    flat
  />
  <q-btn
    v-else
    text-color="black"
    icon="nightlight_round"
    class="bg-transparent"
    @click="handleThemeToggle"
    flat
  />
</template>

<script setup lang="ts">
import {useQuasar} from 'quasar'
import {LocalStorage} from 'quasar'

const q = useQuasar()

function handleThemeToggle() {
  q.dark.toggle()
  LocalStorage.set('isDark', q.dark.isActive)
}
</script>
