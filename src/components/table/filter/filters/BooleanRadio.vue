<template>
  <div class="q-gutter-sm column q-pa-sm">
    <span class="flex justify-center">{{ $t(label) }}</span>
    <q-radio
      :model-value="inputVal"
      :label="$t('general.all')"
      :val="null"
      @update:model-value="handleDualRadioUpdate"
      dense/>
    <q-radio
      :model-value="inputVal"
      :label="$t('general.yes')"
      :val="'1'"
      @update:model-value="handleDualRadioUpdate"
      dense
    />
    <q-radio
      :model-value="inputVal"
      :label="$t('general.no')"
      :val="'0'"
      @update:model-value="handleDualRadioUpdate"
      dense
    />
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

interface BooleanRadioFilterProps {
  modelValue?: string | null
  label: string
}

const props = defineProps<BooleanRadioFilterProps>()
const emits = defineEmits(['update:modelValue'])

const inputVal = ref<string | null | undefined>(props.modelValue)

function handleDualRadioUpdate(val: string | null) {
  inputVal.value = val
  emits('update:modelValue', val)
}
</script>
