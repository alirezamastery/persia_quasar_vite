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

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.amount"
            :label="$t('general.amountToman')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <QDateInput
            v-model="form.date"
            :label="$t('general.date')"
            required
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

    </template>

  </AddEdit>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {getItemIdFromRoute, useAddEdit} from 'src/modules/add-edit-composable'
import {formatIntNumber} from 'src/modules/number-tools'
import {isRequired} from 'src/modules/form-validation'
import {incomeResponseToForm, incomeFormToPayload} from 'src/typings/converter/accounting/income'
import urls from 'src/urls'
import {IncomePayload} from 'src/typings/network/payload/accounting/income'
import {IncomeResponse} from 'src/typings/network/response/accounting/income'
import {IncomeForm} from 'src/typings/domain/accounting/income'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import QDateInput from 'src/components/QDateInput.vue'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.incomes
const listViewRoute = 'incomeList'
const itemTypeTranslate = 'acc.income'
const form = ref<IncomeForm>({
  amount: '',
  date: '',
  description: '',
})
const itemRepr = computed(() => form.value.amount || '')

watch(() => form.value.amount, (newVal) => {
  form.value.amount = formatIntNumber(newVal)
})

const {
  formTitle,
  showForm,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<IncomePayload, IncomeResponse, IncomeForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  incomeResponseToForm,
  incomeFormToPayload,
)
</script>
