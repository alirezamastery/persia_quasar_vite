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

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.title"
            :label="$t('general.title')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.brandId"
            :label="$t('products.brand')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.brands"
            :rules="[isRequired]"
            outlined
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-select
            v-model="form.priceStep"
            :options="priceStepOptions"
            :label="$t('general.priceStepRial')"
            emit-value
            filled
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
import {
  actualProductFormToPayload,
  actualProductResponseToForm,
} from 'src/types/converter/products/actual-product'
import {ActualProductAddEditForm} from 'src/types/domain/products/actual-product'
import {ActualProductPayload} from 'src/types/network/payload/products/actual-product'
import {ActualProductResponse} from 'src/types/network/response/products/actual-product'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import AutoComplete from 'src/components/AutoComplete.vue'
import urls from 'src/urls'
import RouteNames from 'src/router/route-names'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.actualProducts
const listViewRoute = RouteNames.ACTUAL_PRODUCTS_LIST
const itemTypeTranslate = 'products.actualProduct'
const form = ref<ActualProductAddEditForm>({
  title: '',
  priceStep: null,
  brandId: null,
})
const itemRepr = computed(() => form.value.title)
const priceStepOptions = [
  {label: '1,000', value: 1000},
  {label: '2,000', value: 2000},
  {label: '3,000', value: 3000},
  {label: '4,000', value: 4000},
  {label: '5,000', value: 5000},
]

const {
  formTitle,
  showForm,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<ActualProductPayload, ActualProductResponse, ActualProductAddEditForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  actualProductResponseToForm,
  actualProductFormToPayload,
)
</script>
