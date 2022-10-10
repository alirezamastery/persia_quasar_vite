<template>
  <div class="fit q-pa-sm">
    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form
      v-if="showForm"
      @submit.prevent="handleFormSubmit"
    >
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
import {computed, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useAddEdit, getItemIdFromRoute} from 'src/modules/add-edit-composable'
import {formatIntNumber} from 'src/modules/number-tools'
import {isRequired} from 'src/modules/form-validation'
import AutoComplete from 'src/components/AutoComplete.vue'
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'
import urls from 'src/urls'
import {VariantAddEditForm} from 'src/typings/domain/variant'
import {VariantRequestPayload} from 'src/typings/network/payload/variant'
import {VariantResponse} from 'src/typings/network/response/variant'
import {variantResponseToForm, variantFormToRequestPayload} from 'src/typings/converter/variant'


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
})
const itemRepr = computed(() => {
  return form.value.dkpc ? form.value.dkpc.toString() : ''
})

watch(() => form.value.priceMin, (newVal) => {
  form.value.priceMin = formatIntNumber(newVal)
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
