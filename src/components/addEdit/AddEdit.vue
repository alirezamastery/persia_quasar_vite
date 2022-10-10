<template>
  <div class="fit q-pa-sm">

    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form
      v-if="showForm"
      @submit.prevent="emits('form-submit')"
    >

      <slot name="form-fields"/>

      <FormActions
        :show-delete="itemId !== null"
        @delete="emits('handle-delete-dialog', true)"
      />

    </q-form>

    <DeleteDialog
      v-if="itemId !== null"
      v-model="displayDeleteDialog"
      :item-repr="itemRepr"
      @delete="emits('delete')"
    />

  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'


const props = defineProps({
  itemId: String,
  formTitle: String,
  itemRepr: String,
  showForm: Boolean,
  showDeleteDialog: Boolean,
})
const emits = defineEmits([
  'form-submit',
  'handle-delete-dialog',
  'delete',
])

const displayDeleteDialog = ref(props.showDeleteDialog)

watch(() => props.showDeleteDialog, newVal => displayDeleteDialog.value = newVal)
watch(displayDeleteDialog, newVal => emits('handle-delete-dialog', newVal))
</script>
