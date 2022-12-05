<template>
  <div class="q-pa-sm">
    <q-input v-model="date" :label="$t(filterData.label)" mask="date" filled>
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="date"
              @update:model-value="() => $refs.qDateProxy.hide()"
              calendar="persian"
              today-btn
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  :label="$t('general.cancel')"
                  color="primary"
                  flat
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, computed} from 'vue'
import useGeneralStore from 'stores/general'
import {useQuasar} from 'quasar'
import moment from 'moment-jalaali'
import {TableFilter} from 'components/table/types'

const emits = defineEmits(['date-change'])
// const emits = defineEmits<{
// (e: 'date-change', payload: string | null): void
// }>()

export interface DateQProps {
  filterData: TableFilter
}

defineProps<DateQProps>()

const q = useQuasar()
const generalStore = useGeneralStore()

const date = ref<Nullable<string>>(null)
const resetSignal = computed(() => generalStore.tableFilterResetSignal)

watch(date, (val) => {
  let payload = val
  if (!val) payload = null
  if (val && q.lang.isoName === 'fa') {
    payload = moment(val, 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
  }
  emits('date-change', payload)
})
watch(
  () => resetSignal.value,
  () => (date.value = null),
)
</script>
