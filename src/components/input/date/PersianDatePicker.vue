<script setup lang="ts">
import { ref, watch } from 'vue'
import { QPopupProxy } from 'quasar'
import moment from 'moment-jalaali'

const props = defineProps<{
  modelValue: string | null
  label: string
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | null): void
}>()

const qDateProxy = ref<QPopupProxy | null>(null)
const date = ref<string | null>(null)
if (props.modelValue) {
  date.value = moment(props.modelValue, 'YYYY/MM/DD').format('jYYYY/jMM/jDD')
}

watch(
  () => props.modelValue,
  (val) => {
    date.value = moment(val, 'YYYY/MM/DD').format('jYYYY/jMM/jDD')
  }
)

function handleInputUpdate(val: string | null) {
  date.value = val
  const payload = val ? moment(val, 'jYYYY/jMM/jDD').format('YYYY-MM-DD') : null
  emits('update:modelValue', payload)
  qDateProxy.value?.hide()
}
</script>

<template>
  <q-input :model-value="date" :label="$t(label)" @click="qDateProxy?.show()">
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
</template>
