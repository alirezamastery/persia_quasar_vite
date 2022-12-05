<template>
  <BooleanRadio
    v-if="uiType === 'radioDual'"
    v-model="inputValue"
   :label="filter.label"
  />

  <q-select
    v-else-if="uiType === 'select'"
    v-model="inputValue"
    :options="filter.options"
    :label="$t(filter.label)"
    dense
    filled
    class="q-pa-sm"
  />

  <DateQ
    v-else-if="uiType === 'date'"
    :filter-data="filter"
    @date-change="inputValue = $event"
  />

  <div v-else>
    Invalid Filter type
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import useGeneralStore from 'src/stores/general'
import DateQ from './filters/DateQ.vue'
import BooleanRadio from './filters/BooleanRadio.vue'
import {TableFilter} from 'components/table/types'

export interface FilterTypesProps {
  modelValue?: string | number | boolean
  filter: TableFilter
  resetSignal: number | boolean
}

const emits = defineEmits(['update', 'update:modelValue'])
const props = defineProps<FilterTypesProps>()

const generalStore = useGeneralStore()

const inputValue = ref<Nullable<string | number | boolean | undefined>>(props.modelValue)

const resetSignal = computed(() => generalStore.tableFilterResetSignal)
const uiType = computed(() => {
  const type = props.filter.type
  if (type === 'boolean') {
    return 'radioDual'
  }
  return type
})

if (props.filter.type === 'boolean') {
  inputValue.value = null
}

watch(() => resetSignal.value, () => inputValue.value = null)
watch(inputValue, () => {
  emits('update:modelValue', inputValue.value)
})

</script>

