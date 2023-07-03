<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useAddEdit, getItemIdFromRoute} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import urls from 'src/urls'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import RouteNames from 'src/router/route-names'
import {ShopCategoryForm} from 'src/types/domain/shop/category'
import {ShopCategoryDetailResponse} from 'src/types/network/response/shop/category'
import {ShopCategoryPayload} from 'src/types/network/payload/shop/category'
import {shopCategoryDetailResponseToForm, shopCategoryFormToPayload} from 'src/types/converter/shop/category'
import AutoCompleteSingle from 'components/AutoCompleteSingle.vue'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.shopCategoriesAdmin
const listViewRoute = RouteNames.SHOP_CATEGORY_LIST
const itemTypeTranslate = 'shop.category'
const form = ref<ShopCategoryForm>({
  title: '',
  parentNodeId: null,
  selectorTypeId: null,
  attributeIds: [
    {id: null},
  ],
})
const itemRepr = computed(() => form.value.title)

const {
  formTitle,
  showForm,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<ShopCategoryPayload, ShopCategoryDetailResponse, ShopCategoryForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  shopCategoryDetailResponseToForm,
  shopCategoryFormToPayload,
)

function addAttributeInput() {
  form.value.attributeIds.push({
    id: null,
  })
}

function removeAttributeInput(index: number) {
  form.value.attributeIds.splice(index, 1)
}
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

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoCompleteSingle
            v-model="form.parentNodeId"
            :label="$t('shop.category')"
            :obj-repr="'title'"
            :query-param="'search'"
            :api="urls.shopCategoriesAdmin"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoCompleteSingle
            v-model="form.parentNodeId"
            :label="$t('shop.selectorType')"
            :obj-repr="'title'"
            :query-param="'search'"
            :api="urls.shopSelectorTypes"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <q-separator size="2px" class="q-my-xl" inset/>
      <h5>{{ $t('shop.specifications')}}</h5>

      <div
        v-for="(attribute, i) in form.attributeIds"
        :key="i"
        class="row q-ma-sm"
      >
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoCompleteSingle
            v-model="attribute.id"
            :label="$t('shop.specification')"
            :obj-repr="'title'"
            :query-param="'search'"
            :api="urls.shopSelectorTypes"
            :rules="[isRequired]"
          />
        </div>
        <div class="q-pt-sm col-1">
          <q-btn
            v-if="i === form.attributeIds.length - 1"
            icon="add"
            color="primary"
            round
            flat
            @click="addAttributeInput"
          />
          <q-btn
            v-else
            icon="remove"
            color="red"
            round
            flat
            @click="removeAttributeInput(i)"
          />
        </div>
      </div>

    </template>

  </AddEdit>
</template>

