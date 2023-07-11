<template>
  <BooleanRadio
    v-if="uiType === 'radioDual'"
    :model-value="inputValue"
    @update:modelValue="handleValueUpdate"
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
    :model-value="inputValue"
    @update:modelValue="handleValueUpdate"
    :filter-data="filter"
  />

  <div v-else>
    Invalid Filter type
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {useRoute} from 'vue-router'
import useGeneralStore from 'src/stores/general'
import DateQ from './filters/DateQ.vue'
import BooleanRadio from './filters/BooleanRadio.vue'
import {TableFilter} from 'components/table/types'

export interface FilterTypesProps {
  modelValue?: string
  filter: TableFilter
  resetSignal: number | boolean
}

type InputValueType = Nullable<string | undefined>

const emits = defineEmits(['update', 'update:modelValue'])
const props = defineProps<FilterTypesProps>()

const route = useRoute()
const generalStore = useGeneralStore()

const inputValue = ref<InputValueType>(props.modelValue)

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

watch(() => resetSignal.value, () => {
  console.warn('FilterSelector | watch resetSignal')
  inputValue.value = null
  emits('update:modelValue', null)
})

function handleValueUpdate(val: InputValueType) {
  console.log('FilterSelector | handleValueUpdate:', val, typeof val)
  inputValue.value = val
  emits('update:modelValue', val)
}

if (route.query.hasOwnProperty(props.filter.queryParam)) {
  const val = route.query[props.filter.queryParam]
  console.log('FilterSelector | filter value from url:', val)
  inputValue.value = val as string
  emits('update:modelValue', inputValue.value)
}
</script>

