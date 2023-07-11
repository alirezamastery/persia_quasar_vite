<template>
  <div
    class="row q-pa-sm bg-soft"
  >
    <q-input
      v-model="searchPhrase"
      :label="$t('general.search')"
      debounce="300"
      color="primary"
      outlined
      dense
      hide-hint
      clearable
    >
      <template v-slot:append>
        <q-icon name="search"/>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'

const props = defineProps<{ modelValue: string | null }>()
const emits = defineEmits<{ (e: 'update:modelValue', value: string | null): void }>()

const searchPhrase = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})
</script>
