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
            v-model="form.dkp"
            :label="$t('products.dkp')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

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
          <q-checkbox
            v-model="form.isActive"
            :label="$t('products.isActive')"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.typeId"
            :label="$t('products.productType')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.productTypes"
            :rules="[isRequired]"
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
import {computed, ref} from 'vue'
import {useRoute} from 'vue-router'
import {useAddEdit, getItemIdFromRoute} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import AutoComplete from 'src/components/AutoComplete.vue'
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'
import urls from 'src/urls'
import {ProductResponse} from 'src/typings/network/response/product'
import {ProductAddEditForm} from 'src/typings/domain/product'
import {ProductRequestPayload} from 'src/typings/network/payload/product'
import {productFormToRequest, productResponseToForm} from 'src/typings/converter/product'

const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.products
const listViewRoute = 'productList'
const itemTypeTranslate = 'products.product'
const form = ref<ProductAddEditForm>({
  title: '',
  dkp: '',
  isActive: true,
  typeId: null,
})
const itemRepr = computed(() => {
  return form.value.title
})

const {
  formTitle,
  showForm,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<ProductRequestPayload, ProductResponse, ProductAddEditForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  productResponseToForm,
  productFormToRequest,
)
</script>
