<template>
  <div :class="parentCardClass">

    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form
      v-if="showForm"
      @submit.prevent="emits('form-submit')"
    >

      <slot name="form-fields"/>

      <FormActions
        :show-delete="canDelete && itemId !== null"
        :save-disabled="saveDisabled"
        :show-save="showSave"
        :show-back="showBack"
        @delete="emits('handle-delete-dialog', true)"
        @go-back="router.go(-1)"
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
import {useRouter} from 'vue-router'
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'
import {parentCardClass} from 'src/utils/screen'

export interface AddEditProps {
  itemId: Nullable<string>,
  formTitle: string,
  itemRepr: string,
  showForm: boolean,
  showDeleteDialog: boolean,
  saveDisabled?: boolean,
  canDelete?: boolean,
  showSave?: boolean,
  showBack?: boolean
}

const props = withDefaults(defineProps<AddEditProps>(), {
  saveDisabled: false,
  canDelete: true,
  showSave: true,
  showBack: false,
})

const emits = defineEmits([
  'form-submit',
  'handle-delete-dialog',
  'delete',
])

const router = useRouter()
const displayDeleteDialog = ref(props.showDeleteDialog)

watch(() => props.showDeleteDialog, newVal => displayDeleteDialog.value = newVal)
watch(displayDeleteDialog, newVal => emits('handle-delete-dialog', newVal))
</script>
