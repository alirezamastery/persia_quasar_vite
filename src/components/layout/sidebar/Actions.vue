<template>
  <q-item>
    <q-btn-group spread unelevated>
      <q-btn
        v-if="$q.dark.isActive"
        text-color="amber"
        icon="light_mode"
        class="bg-transparent"
        @click="handleThemeToggle"
        flat
      />
      <q-btn
        v-else
        text-color="black"
        icon="fa fa-moon"
        class="bg-transparent"
        @click="handleThemeToggle"
        flat
      />
    </q-btn-group>
  </q-item>
</template>

<script setup lang="ts">
import {handleThemeToggle} from 'src/utils'
</script>

