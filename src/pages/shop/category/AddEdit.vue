<script setup lang="ts">
import {computed, ref, Ref} from 'vue'
import {useRoute} from 'vue-router'
import {getItemIdFromRoute, useAddEdit} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import urls from 'src/urls'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import RouteNames from 'src/router/route-names'
import {ShopCategoryForm} from 'src/types/domain/shop/category'
import {ShopCategoryDetailResponse} from 'src/types/network/response/shop/category'
import {ShopCategoryPayload} from 'src/types/network/payload/shop/category'
import {shopCategoryDetailResponseToForm, shopCategoryFormToPayload} from 'src/types/converter/shop/category'
import AutoCompleteSingle from 'components/AutoCompleteSingle.vue'
import CreateAttributeDialog from 'pages/shop/category/CreateAttributeDialog.vue'
import AutoCompleteMultiple from 'components/AutoCompleteMultiple.vue'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.shopCategoriesAdmin
const listViewRoute = RouteNames.SHOP_CATEGORY_LIST
const itemTypeTranslate = 'shop.category'
const form = ref<ShopCategoryForm>({
  title: '',
  parentNodeId: 0,
  selectorTypeId: null,
  attributeIds: [],
})
const showCreateAttributeDialog = ref(false)
const itemRepr = computed(() => form.value.title)
const reInitAttrsSignal = ref(false)

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
const getParentNodeInitData = computed(() => {
  if (form.value.parentNodeId === 0) {
    return function (selectedVal: Ref) {
      selectedVal.value = {
        id: 0,
        title: '-- سرشاخه --',
      }
    }
  } else
    return undefined
})

// function addAttributeInput() {
//   form.value.attributeIds.push({
//     id: null,
//   })
// }

// function removeAttributeInput(attId: number) {
//   console.log('remove:', attId)
//   const newAttrs = form.value.attributeIds.filter(attr => attr.id !== attId)
//   form.value.attributeIds = []
//   form.value.attributeIds = newAttrs
//   console.log(form.value.attributeIds)
// }
//
// function handleFilter(options: Ref<any[]>) {
//   console.log('fffffffffffffffffffffffffffffffffffffffffffff', options.value)
//   options.value = options.value.filter(opt => {
//     return !form.value.attributeIds.map(attr => attr.id).includes(opt.id)
//   })
// }
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
            :get-init-data="getParentNodeInitData"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoCompleteSingle
            v-model="form.selectorTypeId"
            :label="$t('shop.selectorType')"
            :obj-repr="'title'"
            :query-param="'search'"
            :api="urls.shopSelectorTypes"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <q-separator size="2px" class="q-my-xl" inset/>
      <div class="row q-ma-sm">
        <div class="text-h5 col-xs-5 col-sm-3 col-md-2 col-xl-1">
          {{ $t('shop.specifications') }}
        </div>
        <div>
          <q-btn
            :label="$t('general.create')"
            color="primary"
            icon="add"
            @click="showCreateAttributeDialog = true"
          />
        </div>

      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoCompleteMultiple
            v-model="form.attributeIds"
            obj-unique-id="id"
            :label="$t('shop.specifications')"
            :obj-repr="'title'"
            :api="urls.shopAttributes"
            :list-api="'get-by-id-list/'"
            :list-query-param="'ids[]'"
            :query-param="'search'"
            :rules="[isRequired]"
            outlined
            options-dense
            :re-initialize-signal="reInitAttrsSignal"
          />
        </div>
      </div>
      <!--      <div-->
      <!--        v-for="(attribute, i) in form.attributeIds"-->
      <!--        :key="i"-->
      <!--        class="row q-ma-sm"-->
      <!--      >-->
      <!--        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">-->
      <!--          <AutoCompleteSingle-->
      <!--            v-model="attribute.id"-->
      <!--            :label="$t('shop.specification')"-->
      <!--            :obj-repr="'title'"-->
      <!--            :query-param="'search'"-->
      <!--            :api="urls.shopProductAttributes"-->
      <!--            :rules="[isRequired]"-->
      <!--            :after-options-update="handleFilter"-->
      <!--          />-->
      <!--        </div>-->
      <!--        <div class="q-pt-sm col-1" v-if="i > 0">-->
      <!--          <q-btn-->
      <!--            icon="remove"-->
      <!--            color="red"-->
      <!--            round-->
      <!--            flat-->
      <!--            @click="removeAttributeInput(attribute.id)"-->
      <!--          />-->
      <!--        </div>-->
      <!--        <div class="q-pt-sm col-1" v-if="i === form.attributeIds.length - 1">-->
      <!--          <q-btn-->
      <!--            icon="add"-->
      <!--            color="primary"-->
      <!--            round-->
      <!--            flat-->
      <!--            @click="addAttributeInput"-->
      <!--          />-->
      <!--        </div>-->
      <!--      </div>-->

    </template>

  </AddEdit>

  <CreateAttributeDialog
    v-model="showCreateAttributeDialog"
    @attribute-created="reInitAttrsSignal = !reInitAttrsSignal"
  />

</template>

