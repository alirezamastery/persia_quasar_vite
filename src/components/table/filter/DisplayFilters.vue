<template>
  <q-card
    class="col-xs-12 col-md-3 col-lg-2 col-xl-2 q-my-xs-md q-my-md-none q-mx-md-sm"
    :class="$q.screen.gt.sm ? '' : 'border-radius-inherit no-shadow'"
    style="height: fit-content"
    :bordered="$q.screen.gt.sm"
  >
    <div
      class="flex row justify-between q-pa-sm bg-soft"
      style="min-height: 40px"
    >
      <span>{{ $t('general.filters') }}</span>
      <q-space/>
      <q-btn
        v-if="Object.keys(filterValues).length > 0 && showReset"
        icon="refresh"
        class="bg-yellow text-black"
        size="xs"
        round
        @click="resetFilters"
      />
    </div>
    <q-separator/>

    <template
      v-for="(filter, index) in filters"
      :key="index"
      class="q-pa-sm q-ma-sm"
    >
      <FilterSelector
        v-model="filterValues[filter.queryParam]"
        :filter="filter"
        :reset-signal="justForResetSignal"
      />
      <q-separator v-if="index < filters.length - 1"/>
    </template>

  </q-card>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import useGeneralStore from 'src/stores/general'
import FilterSelector from './FilterSelector.vue'
import {TableFilter} from 'components/table/types'
import {isEqual} from 'lodash'

export interface DisplayFiltersProps {
  filters: TableFilter[]
}

const props = defineProps<DisplayFiltersProps>()

const emits = defineEmits(['filter-change'])

const router = useRouter()
const generalStore = useGeneralStore()

const filterValues = ref<{ [key: string]: Nullable<string> }>({})
const justForResetSignal = ref(0)
const showReset = ref(false)
const filterUpdateLock = ref(false)

watch(() => ({...filterValues.value}), (newValues, oldValues) => {
  console.warn('DisplayFilters | watch filterValues | newVal:', newValues, 'oldVal:', oldValues)
  if (isEqual(newValues, oldValues)) return
  // when filter reset button is clicked all filters will get null value.
  // so we should wait for all of them to become null before sending request to server
  // if we don't check this lock, a request will be sent for each filter!!
  if (filterUpdateLock.value === true) {
    if (Object.keys(newValues).length === props.filters.length
      && Object.values(newValues).every(v => v === null))
      filterUpdateLock.value = false
    else
      return
  }

  const remainingFilters: { [key: string]: string } = {}
  for (const [key, value] of Object.entries(newValues)) {
    if (value !== null) {
      remainingFilters[key] = value as string
    }
  }

  showReset.value = !Object.values(newValues).every(v => v === null)
  emits('filter-change', remainingFilters)

}, {deep: true})


function resetFilters() {
  filterUpdateLock.value = true
  generalStore.resetTableFilter()
  router.replace({query: {}})
}

for (const filter of props.filters) {
  console.log('init null:', filter.queryParam)
  filterValues.value[filter.queryParam] = null
}

</script>
