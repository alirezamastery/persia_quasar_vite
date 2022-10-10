<template>
  <q-dialog
      v-model="toggle"
      @update:model-value="handleCancel"
  >
    <q-card>
      <q-card-section>
        {{ $t('general.Q.itemDelete', {item: itemRepr}) }}
      </q-card-section>
      <q-card-actions>
        <q-btn color="primary" @click="handleCancel">{{ $t('general.cancel') }}</q-btn>
        <q-space/>
        <q-btn color="red" @click="emits('delete')">{{ $t('general.yes') }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'

const props = defineProps(['modelValue', 'itemRepr'])
const emits = defineEmits(['update:modelValue', 'delete'])

const toggle = ref(props.modelValue)

watch(() => props.modelValue, newVal => toggle.value = newVal)

function handleCancel() {
  toggle.value = false
  emits('update:modelValue', toggle.value)
}
</script>
