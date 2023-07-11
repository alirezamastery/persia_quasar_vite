<template>
  <div class="q-pa-sm">
    <q-input
      :model-value="date"
      @update:model-value="handleInputUpdate"
      :label="$t(filterData.label)"
      mask="date"
      filled
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              :model-value="date"
              @update:model-value="handleInputUpdate"
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
import {ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import moment from 'moment-jalaali'
import {TableFilter} from 'components/table/types'

export interface DateQProps {
  filterData: TableFilter
  modelValue?: Nullable<string>
}

const props = defineProps<DateQProps>()
const emits = defineEmits(['date-change', 'update:modelValue'])
// const emits = defineEmits<{
// (e: 'date-change', payload: string | null): void
// }>()

const q = useQuasar()

const qDateProxy = ref(null)
const date = ref<Nullable<string>>(null)
if (props.modelValue !== null && props.modelValue !== undefined) {
  console.log('DateQ | props has value', props.modelValue)
  date.value = moment(props.modelValue, 'YYYY/MM/DD').format('jYYYY/jMM/jDD')
}

watch(() => props.modelValue, newVal => {
  console.warn(`DateQ ${props.filterData.label} | watch modelValue`)
  if (newVal === null)
    date.value = null
  else
    date.value = moment(newVal, 'YYYY/MM/DD').format('jYYYY/jMM/jDD')
})

function handleInputUpdate(val: string | null) {
  console.log('DateQ | handleInputUpdate | value', val)
  let payload = val
  if (!val) payload = null
  if (val && q.lang.isoName === 'fa') {
    payload = moment(val, 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
  }
  qDateProxy.value!.hide()
  emits('update:modelValue', payload)
}
</script>
