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
          <AutoComplete
            v-model="form.productId"
            :label="$t('products.product')"
            :obj-repr-field="'title'"
            :query-param="'search'"
            :api="urls.products"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.actualProductId"
            :label="$t('products.actualProduct')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.actualProducts"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.variantSelectorId"
            :label="$t('products.selectorValues')"
            :query-param="'search'"
            :obj-repr-field="'value'"
            :api="urls.variantSelectors"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.dkpc"
            :label="$t('products.DKPC')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.priceMin"
            :label="$t('general.priceMinToman')"
            filled
            :rules="[isRequired]"
          />
          <!-- SAMPLE ERROR FOR FUTURE: error-message="errors.price_min ? errors.price_min[0] : null"-->
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

    </template>

  </AddEdit>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useAddEdit, getItemIdFromRoute} from 'src/modules/add-edit-composable'
import {formatAsCommaSeparated} from 'src/modules/number-tools'
import {isRequired} from 'src/modules/form-validation'
import {variantResponseToForm, variantFormToRequestPayload} from 'src/types/converter/products/variant'
import {VariantAddEditForm} from 'src/types/domain/products/variant'
import {VariantRequestPayload} from 'src/types/network/payload/products/variant'
import {VariantResponse} from 'src/types/network/response/products/variant'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import AutoComplete from 'src/components/AutoComplete.vue'
import urls from 'src/urls'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.variants
const listViewRoute = 'variantList'
const itemTypeTranslate = 'products.variant'
const form = ref<VariantAddEditForm>({
  productId: null,
  actualProductId: null,
  variantSelectorId: null,
  dkpc: null,
  priceMin: null,
  isActive: true,
  productTitle: ''
})
const itemRepr = computed(() => {
  return form.value.productTitle ? form.value.productTitle.toString() : ''
})

watch(() => form.value.priceMin, (newVal) => {
  form.value.priceMin = formatAsCommaSeparated(newVal)
})

const {
  formTitle,
  showForm,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<VariantRequestPayload, VariantResponse, VariantAddEditForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  variantResponseToForm,
  variantFormToRequestPayload,
)
</script>
