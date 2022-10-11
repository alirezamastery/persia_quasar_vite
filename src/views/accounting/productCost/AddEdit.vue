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
import {getItemIdFromRoute, useAddEdit} from 'src/modules/add-edit-composable'
import {formatIntNumber} from 'src/modules/number-tools'
import {
  productCostFormToRequest,
  productCostResponseToForm,
} from 'src/typings/converter/accounting/product-cost'
import urls from 'src/urls'
import {ProductCostRequest} from 'src/typings/network/payload/accounting/product-cost'
import {ProductCostResponse} from 'src/typings/network/response/accounting/product-cost'
import {ProductCostForm} from 'src/typings/domain/accounting/product-cost'
import QDateInput from 'src/components/QDateInput.vue'
import AddEdit from 'src/components/addEdit/AddEdit.vue'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.productCosts
const listViewRoute = 'productCostList'
const itemTypeTranslate = 'acc.productCost'
const form = ref<ProductCostForm>({
  amount: '',
  date: '',
  description: '',
})
const itemRepr = computed(() => form.value.amount)

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
} = useAddEdit<ProductCostRequest, ProductCostResponse, ProductCostForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  productCostResponseToForm,
  productCostFormToRequest,
)
</script>
