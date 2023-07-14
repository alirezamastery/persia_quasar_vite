<template>
  <div class="q-gutter-sm column q-pa-sm">
    <span class="flex justify-center">{{ $t(label) }}</span>
    <q-radio
      v-model="inputVal"
      :label="$t('general.all')"
      :val="null"
      dense/>
    <q-radio
      v-model="inputVal"
      :label="$t('general.yes')"
      :val="'1'"
      dense
    />
    <q-radio
      v-model="inputVal"
      :label="$t('general.no')"
      :val="'0'"
      dense
    />
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'

const props = defineProps<{
  modelValue?: string | null
  label?: string
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', val: string | undefined | null): void
}>()

const inputVal = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})
</script>
