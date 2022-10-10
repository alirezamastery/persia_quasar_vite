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
            v-model="form.productTypeId"
            :label="$t('products.productTypeSelector')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.variantSelectorTypes"
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
import {useAddEdit} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import AutoComplete from 'src/components/AutoComplete.vue'
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'
import urls from 'src/urls'
import {ProductTypeAddEditForm} from 'src/typings/domain/product-type'
import {ProductTypeRequestPayload} from 'src/typings/network/payload/product-type'
import {ProductTypeResponse} from 'src/typings/network/response/product-type'
import {
  productTypeResponseToForm,
  productTypeFormToRequest,
} from 'src/typings/converter/product-type'


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
