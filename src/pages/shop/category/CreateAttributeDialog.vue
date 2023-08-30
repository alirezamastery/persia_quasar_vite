<script setup lang="ts">
import {computed, reactive} from 'vue'
import {axiosInstance} from 'boot/axios'
import urls from 'src/urls'
import {notifyErrors} from 'src/modules/notif'

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'attribute-created', value: boolean): void,
}>()

const showDialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

const form = reactive({
  title: '',
  description: '',
})

async function handleSubmit() {
  try {
    await axiosInstance.post(urls.shopAttributes, form)
    showDialog.value = false
    emits('attribute-created', true)
    form.title = ''
    form.description = ''
  } catch (e: any) {
    console.log('create attribute error:', e)
    notifyErrors(e.response.data)
  }
}
</script>

<template>
  <q-dialog v-model="showDialog">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-bar>
        <q-btn dense flat icon="close" @click="showDialog = false"/>
        <q-space/>
      </q-bar>

      <q-card-section class="text-h6">
        {{ $t('shop.createANew', {item: $t('shop.specification')}) }}
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="form.title"
          :label="$t('shop.specification')"
          outlined
        />
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="form.description"
          type="textarea"
          :label="$t('general.description')"
          outlined
        />
      </q-card-section>

      <q-card-actions>
        <q-btn
          color="green"
          class="text-black q-mt-md"
          @click="handleSubmit"
        >
          {{ $t('general.create') }}
        </q-btn>
        <q-space class="q-mx-xl"/>
        <q-btn
          color="warning text-black"
          class="q-mt-md"
          @click="showDialog = false"
        >
          {{ $t('general.cancel') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">

</style>
