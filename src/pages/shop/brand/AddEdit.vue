<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useAddEdit, getItemIdFromRoute} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import urls from 'src/urls'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import RouteNames from 'src/router/route-names'
import {ShopBrandForm} from 'src/types/domain/shop/product'
import {ShopBrandResponse} from 'src/types/network/response/shop/brand'
import {ShopBrandPayload} from 'src/types/network/payload/shop/product'
import {shopBrandFomToPayload, shopBrandResponseToForm} from 'src/types/converter/shop/brand'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.shopBrands
const listViewRoute = RouteNames.SHOP_BRAND_LIST
const itemTypeTranslate = 'shop.brand'
const form = ref<ShopBrandForm>({
  title: '',
})
const itemRepr = computed(() => form.value.title)

const {
  formTitle,
  showForm,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<ShopBrandPayload, ShopBrandResponse, ShopBrandForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  shopBrandResponseToForm,
  shopBrandFomToPayload,
)
</script>

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
            :rules="[isRequired]"
            filled
          />
        </div>
      </div>

    </template>

  </AddEdit>
</template>

