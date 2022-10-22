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
            outlined
          />
        </div>
      </div>

    </template>

  </AddEdit>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute} from 'vue-router'
import {useAddEdit, getItemIdFromRoute} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import {productFormToRequest, productResponseToForm} from 'src/types/converter/products/product'
import {ProductResponse} from 'src/types/network/response/products/product'
import {ProductAddEditForm} from 'src/types/domain/products/product'
import {ProductRequestPayload} from 'src/types/network/payload/products/product'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import AutoComplete from 'src/components/AutoComplete.vue'
import urls from 'src/urls'


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
