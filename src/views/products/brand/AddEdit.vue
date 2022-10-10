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
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useAddEdit, getItemIdFromRoute} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'
import urls from 'src/urls'
import {BrandAddEditForm} from 'src/typings/domain/brand'
import {BrandRequestPayload} from 'src/typings/network/payload/brand'
import {BrandResponse} from 'src/typings/network/response/brand'
import {brandFormToRequestPayload, brandResponseToForm} from 'src/typings/converter/brand'


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
}  = useAddEdit<BrandRequestPayload, BrandResponse, BrandAddEditForm>(
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
