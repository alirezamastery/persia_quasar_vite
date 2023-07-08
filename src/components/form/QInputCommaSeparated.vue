<script setup lang="ts">
import {computed} from 'vue'
import {formatAsCommaSeparated} from 'src/modules/number-tools'
import {positiveNumberWithComma} from 'src/modules/form-validation'

const props = defineProps<{
  modelValue: string
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', formatAsCommaSeparated(val)),
})
</script>

<template>
  <q-input
    v-model="modelValue"
    :rules="[positiveNumberWithComma]"
  />
</template>
