<template>
  <AddEdit
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
          <AutoComplete
            v-model="form.costTypeId"
            :label="$t('general.type')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.costTypes"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.amount"
            :label="$t('general.amountToman')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <QDateInput
            v-model="form.date"
            :label="$t('general.date')"
            required
          />
        </div>
      </div>

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.description"
            :label="$t('general.description')"
            filled
            type="textarea"
          />
        </div>
      </div>

    </template>

  </AddEdit>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {useRoute} from 'vue-router/dist/vue-router'
import {isRequired} from 'src/modules/form-validation'
import {getItemIdFromRoute, useAddEdit} from 'src/modules/add-edit-composable'
import {formatIntNumber} from 'src/modules/number-tools'
import {costResponseToForm, costFormToPayload} from 'src/typings/converter/accounting/cost'
import {CostForm} from 'src/typings/domain/accounting/cost'
import {CostPayload} from 'src/typings/network/payload/accounting/cost'
import {CostResponse} from 'src/typings/network/response/accounting/cost'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import QDateInput from 'src/components/QDateInput.vue'
import AutoComplete from 'src/components/AutoComplete.vue'
import urls from 'src/urls'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.costs
const listViewRoute = 'costList'
const itemTypeTranslate = 'acc.cost'
const form = ref<CostForm>({
  costTypeId: null,
  amount: null,
  date: '',
  description: '',
})
const itemRepr = computed(() => form.value.description)

watch(() => form.value.amount, (newVal) => {
  form.value.amount = formatIntNumber(newVal)
})

const {
  formTitle,
  showForm,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<CostPayload, CostResponse, CostForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  costResponseToForm,
  costFormToPayload,
)
</script>
