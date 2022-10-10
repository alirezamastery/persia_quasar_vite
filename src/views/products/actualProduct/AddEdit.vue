<template>
  <div class="fit q-pa-sm">

    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form
      v-if="showForm"
      @submit.prevent="handleFormSubmit"
    >
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
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-select
            v-model="form.priceStep"
            :options="priceStepOptions"
            :label="$t('general.priceStepRial')"
            filled
          />
        </div>
      </div>

      <FormActions
        :show-delete="itemId !== null"
        @delete="toggleDeleteDialog"
      />

    </q-form>

    <DeleteDialog
      v-if="itemId !== null"
      v-model="showDeleteDialog"
      :item-repr="itemRepr"
      @delete="handleDelete"
    />

  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import {getItemIdFromRoute, useAddEdit} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import AutoComplete from 'src/components/AutoComplete.vue'
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'
import urls from 'src/urls'
import {ActualProductAddEditForm} from 'src/typings/domain/actual-product'
import {ActualProductPayload} from 'src/typings/network/payload/actual-product'
import {ActualProductResponse} from 'src/typings/network/response/actual-product'
import {
  actualProductFormToPayload,
  actualProductResponseToForm,
} from 'src/typings/converter/actual-product'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.actualProducts
const listViewRoute = 'actualProductList'
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
