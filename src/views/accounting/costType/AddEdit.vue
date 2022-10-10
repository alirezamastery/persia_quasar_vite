<template>
  <div class="fit q-pa-sm">

    <div class="text-h6 q-ma-md">{{ formTools.formTitle }}</div>

    <q-form
      v-if="formTools.showForm"
      @submit.prevent="formTools.handleFormSubmit"
      class="q-gutter-sm"
    >
      <div class="row">
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
        @delete="formTools.toggleDeleteDialog"
      />

    </q-form>

    <DeleteDialog
      v-if="itemId !== null"
      v-model="formTools.showDeleteDialog"
      :item-repr="itemRepr"
      @delete="formTools.handleDelete"
    />

  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'
import {getItemIdFromRoute, useAddEdit} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'
import urls from 'src/urls'
import {CostTypeForm} from 'src/typings/domain/accounting/cost-type'
import {CostTypePayload} from 'src/typings/network/payload/accounting/cost-type'
import {CostTypeResponse} from 'src/typings/network/response/accounting/cost-type'
import {costTypeFormToPayload, costTypeResponseToForm} from 'src/typings/converter/accounting/cost-type'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.costTypes
const listViewRoute = 'costTypeList'
const itemTypeTranslate = 'acc.costType'
const form = ref<CostTypeForm>({
  title: '',
})
const itemRepr = computed(() => form.value.title)

const formTools = useAddEdit<CostTypePayload, CostTypeResponse, CostTypeForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  costTypeResponseToForm,
  costTypeFormToPayload,
)
</script>
