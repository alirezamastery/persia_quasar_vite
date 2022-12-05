<template>
  <div class="q-gutter-sm column q-pa-sm">
    <span class="flex justify-center">{{ $t(label) }}</span>
    <q-radio
      v-model="inputVal"
      :label="$t('general.all')"
      :val="null"
      @update:model-value="handleDualRadioUpdate"
      dense/>
    <q-radio
      v-model="inputVal"
      :label="$t('general.yes')"
      :val="1"
      @update:model-value="handleDualRadioUpdate"
      dense
    />
    <q-radio
      v-model="inputVal"
      :label="$t('general.no')"
      :val="0"
      @update:model-value="handleDualRadioUpdate"
      dense
    />
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import useGeneralStore from 'stores/general'

interface BooleanRadioFilterProps {
  modelValue: Nullable<number>
  label: string
}

const props = defineProps<BooleanRadioFilterProps>()
const emits = defineEmits(['update:modelValue'])

const generalStore = useGeneralStore()

const inputVal = ref<Nullable<number>>(props.modelValue)
const resetSignal = computed(() => generalStore.tableFilterResetSignal)

watch(
  () => resetSignal.value,
  () => (inputVal.value = null),
)

function handleDualRadioUpdate(val: string | number | boolean | null) {
  if (val === null)
    emits('update:modelValue', null)
  else
    emits('update:modelValue', Boolean(val))
}
</script>
