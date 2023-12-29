<script setup lang="ts">
import { ref, watch } from 'vue'
import { QPopupProxy } from 'quasar'

const props = defineProps<{
  modelValue: string | null
  label: string
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | null): void
}>()

const qTimeProxy = ref<QPopupProxy | null>(null)
const time = ref<string | null>(props.modelValue)
const proxyTime = ref<string | null>(null)

watch(
  () => props.modelValue,
  (newVal) => {
    time.value = newVal
  }
)
watch(time, (val) => {
  emits('update:modelValue', val)
})

function handleInputUpdate(val: string | null) {
  let payload = val
  if (!val) payload = null
  qTimeProxy.value?.hide()
  emits('update:modelValue', payload)
}
</script>

<template>
  <q-input :model-value="time" :label="$t(label)" @click="qTimeProxy?.show()">
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          ref="qTimeProxy"
          cover
          transition-show="scale"
          transition-hide="scale"
          @before-show="proxyTime = time"
        >
          <q-time v-model="proxyTime" calendar="persian" today-btn>
            <div class="row items-center justify-between">
              <q-btn
                v-close-popup
                :label="$t('general.save')"
                color="primary"
                flat
                @click="time = proxyTime"
              />
              <q-btn
                v-close-popup
                :label="$t('general.cancel')"
                color="warning"
                flat
              />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<style scoped lang="scss"></style>
