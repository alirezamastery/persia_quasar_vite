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
            v-model="form.productTypeId"
            :label="$t('products.productTypeSelector')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.variantSelectorTypes"
            :rules="[isRequired]"
          />
        </div>
      </div>

    </template>

  </AddEdit>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute} from 'vue-router'
import {useAddEdit} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import {
  productTypeResponseToForm,
  productTypeFormToRequest,
} from 'src/types/converter/products/product-type'
import {ProductTypeAddEditForm} from 'src/types/domain/products/product-type'
import {ProductTypeRequestPayload} from 'src/types/network/payload/products/product-type'
import {ProductTypeResponse} from 'src/types/network/response/products/product-type'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import AutoComplete from 'src/components/AutoComplete.vue'
import urls from 'src/urls'


const route = useRoute()
const itemId = route.params.id ? route.params.id.toString() : null
const apiRoot = urls.productTypes
const listViewRoute = 'productTypeList'
const itemTypeTranslate = 'products.productType'
const form = ref<ProductTypeAddEditForm>({
  title: null,
  productTypeId: null,
})
const itemRepr = computed(() => {
  return form.value.title ? form.value.title : ''
})

const {
  formTitle,
  showForm,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<ProductTypeRequestPayload, ProductTypeResponse, ProductTypeAddEditForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  productTypeResponseToForm,
  productTypeFormToRequest,
)
</script>
