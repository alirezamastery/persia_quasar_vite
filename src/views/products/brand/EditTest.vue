<template>
  <AddEdit
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

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useAddEdit, getItemIdFromRoute} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import {brandFormToRequestPayload, brandResponseToForm} from 'src/typings/converter/brand'
import {BrandAddEditForm} from 'src/typings/domain/brand'
import {BrandRequestPayload} from 'src/typings/network/payload/brand'
import {BrandResponse} from 'src/typings/network/response/brand'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import urls from 'src/urls'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.brands
const listViewRoute = 'brandList'
const itemTypeTranslate = 'products.brand'
const form = ref<BrandAddEditForm>({
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
} = useAddEdit<BrandRequestPayload, BrandResponse, BrandAddEditForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  brandResponseToForm,
  brandFormToRequestPayload,
)
</script>
