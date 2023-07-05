<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useAddEdit, getItemIdFromRoute} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import urls from 'src/urls'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import RouteNames from 'src/router/route-names'
import {ShopProductForm} from 'src/types/domain/shop/product'
import {ShopProductResponse} from 'src/types/network/response/shop/product'
import {ShopProductPayload} from 'src/types/network/payload/shop/product'
import {shopProductFormToPayload, shopProductResponseToForm} from 'src/types/converter/shop/product'
import AutoCompleteSingle from 'components/AutoCompleteSingle.vue'
import {ShopCategoryDetailResponse} from 'src/types/network/response/shop/category'
import {axiosInstance} from 'boot/axios'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.shopProducts
const listViewRoute = RouteNames.SHOP_PRODUCT_LIST
const itemTypeTranslate = 'shop.product'
const form = ref<ShopProductForm>({
  title: '',
  brandId: null,
  categoryId: null,
  description: '',
  isActive: true,
  attributeFields: [],
  attributeValues: [],
})
const itemRepr = computed(() => form.value.title)
const selectedCategory = ref<ShopCategoryDetailResponse | null>(null)
const isLoadingCategory = ref(false)

watch(() => form.value.categoryId, async (newVal) => {
  isLoadingCategory.value = true
  console.log('new cat:', newVal)
  const url = urls.shopCategoryDetailAdmin.replace('{0}', String(newVal))
  try {
    const res = await axiosInstance.get(url)
    selectedCategory.value = res.data
  } catch (e) {
    console.log('error in getting category details:', e)
  }
  isLoadingCategory.value = true
})

const {
  formTitle,
  showForm,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<ShopProductPayload, ShopProductResponse, ShopProductForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  shopProductResponseToForm,
  shopProductFormToPayload,
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
          <AutoCompleteSingle
            v-model="form.brandId"
            :label="$t('shop.brand')"
            :obj-repr="'title'"
            :query-param="'search'"
            :api="urls.shopBrands"
            :rules="[isRequired]"
          />
        </div>
      </div>

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

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-checkbox
            v-model="form.isActive"
            :label="$t('shop.isActive')"
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

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoCompleteSingle
            v-model="form.categoryId"
            :label="$t('shop.category')"
            :obj-repr="'title'"
            :query-param="'search'"
            :api="urls.shopCategories"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <template v-if="selectedCategory !== null">
        <div
          v-for="attr in selectedCategory.attributes"
          :key="attr.id"
          class="row"
        >
          <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
            <div>{{ attr.title }}</div>
          </div>
          <!--        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">-->
          <!--          <q-input-->
          <!--            v-model="form.description"-->
          <!--            :label="$t('general.description')"-->
          <!--            filled-->
          <!--            type="textarea"-->
          <!--          />-->
          <!--        </div>-->
        </div>
      </template>

    </template>

  </AddEdit>
</template>

