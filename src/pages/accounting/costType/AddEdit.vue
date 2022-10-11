<template>
  <AddEdit
    :item-id="itemId"
    :form-title="formTitle"
    :item-repr="itemRepr"
    :show-form="showForm"
    :show-delete-dialog="showDeleteDialog"
    @form-submit="handleFormSubmit"
    @handle-delete-dialog="toggleDeleteDialog($event)"
    @delete="handleDelete"
  >

    <template v-slot:form-fields>

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.title"
            :label="$t('general.title')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

    </template>

  </AddEdit>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import {getItemIdFromRoute, useAddEdit} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import urls from 'src/urls'
import {CostTypeForm} from 'src/types/domain/accounting/cost-type'
import {CostTypePayload} from 'src/types/network/payload/accounting/cost-type'
import {CostTypeResponse} from 'src/types/network/response/accounting/cost-type'
import {costTypeFormToPayload, costTypeResponseToForm} from 'src/types/converter/accounting/cost-type'
import AddEdit from 'src/components/addEdit/AddEdit.vue'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.costTypes
const listViewRoute = 'costTypeList'
const itemTypeTranslate = 'acc.costType'
const form = ref<CostTypeForm>({
  title: '',
})
const itemRepr = computed(() => form.value.title)

const {
  formTitle,
  showForm,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<CostTypePayload, CostTypeResponse, CostTypeForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  costTypeResponseToForm,
  costTypeFormToPayload,
)
</script>
