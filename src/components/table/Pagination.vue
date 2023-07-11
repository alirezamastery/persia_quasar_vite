<template>
  <div class="row items-center justify-between q-pa-sm">
    <div
      class="col-12 col-md-2 col-lg-1 text-no-wrap"
      :class="$q.screen.gt.sm ? '' : 'q-my-md'"
    >
      {{ countDisplay }}
    </div>
    <div class="col-12 col-md-7 col-lg-8 col-xl-9 flex justify-center">
      <q-pagination
        v-model="pageValue"
        :max="pageCount"
        :max-pages="7"
        :disable="tableLoading"
        boundary-numbers
        direction-links
        @update:model-value="emits('page-select', $event)"
      />
    </div>
    <div
      class="col-4 col-md-3 col-lg-3 col-xl-2 flex"
      :class="[q.screen.gt.sm ? 'justify-end' : 'q-mt-lg']"
    >
      <q-select
        v-model="pageSizeValue"
        :options="pageSizeOptions"
        style="max-width: 90px"
        dense
        filled
        @update:model-value="$emit('page-size-select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'

export interface TablePaginationProps {
  page: number
  pageSize: number
  pageCount: number
  totalCount:number
  pageSizeOptions?: number[]
  tableLoading?: boolean
  totalVisible? : number
}

const props = withDefaults(defineProps<TablePaginationProps>(),{
  pageSizeOptions: () => [10, 20, 50, 100],
  tableLoading: false,
  totalVisible: 7
})

const emits = defineEmits(['page-select', 'page-size-select'])
// const emits = defineEmits<{
//   (e: 'page-select', value: number): void
//   (e: 'page-size-select', value: number): void
// }>()

const {t} = useI18n()
const q = useQuasar()

const pageValue = ref(props.page)
const pageSizeValue = ref(props.pageSize)

const countDisplay = computed(() => `${t('general.totalCount')}: ${props.totalCount}`)

watch(() => props.page, (newValue) => pageValue.value = newValue)
watch(() => props.pageSize, (newValue) => pageSizeValue.value = newValue)
</script>
