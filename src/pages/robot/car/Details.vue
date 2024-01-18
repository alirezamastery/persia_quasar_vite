<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router/dist/vue-router'
import { useI18n } from 'vue-i18n'
import { isRequired } from 'src/modules/form-validation'
import { getItemIdFromRoute, useAddEdit } from 'src/modules/add-edit-composable'
import { formatAsCommaSeparated } from 'src/modules/number-tools'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import PersianDatePicker from 'components/input/date/PersianDatePicker.vue'
import TimePicker from 'components/input/date/TimePicker.vue'
import urls from 'src/urls'
import RouteNames from 'src/router/route-names'
import { CarForm } from 'src/types/domain/car/car'
import { CarPayload } from 'src/types/network/payload/car/car'
import { CarResponse } from 'src/types/network/response/car/car'
import { carFormToPayload, carResponseToForm } from 'src/types/converter/car/car'
import carTranslate from 'src/i18n/fa/car'

const { t } = useI18n()
const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.robotCarList
const listViewRoute = RouteNames.ROBOT_CAR_LIST
const itemTypeTranslate = 'car.car'
const form = ref<CarForm>({
  token: '',
  title: '',
  time: '',
  location: '',
  kilometer: 0,
  year: 0,
  color: '',
  adType: '',
  model: '',
  fuel: '',
  engine: '',
  chassis: '',
  chassisFront: '',
  chassisBack: '',
  body: '',
  insurance: '',
  gearbox: '',
  canExchange: '',
  price: 0,
  phone: '',
  status: '',
  description: '',
  appointment: null,
  sellerType: 'NA',
  myDescription: '',
})
const itemRepr = computed(() => form.value.title)
const appointDate = ref<string | null>(null)
const appointTime = ref<string | null>(null)

const {
  formTitle,
  showForm,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<CarPayload, CarResponse, CarForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  carResponseToForm,
  carFormToPayload
)

const statusOpts = [
  { label: t('car.statusChoices.CALL_WAIT'), value: 'CALL_WAIT' },
  { label: t('car.statusChoices.SOLD'), value: 'SOLD' },
  { label: t('car.statusChoices.NO_ANSWER'), value: 'NO_ANSWER' },
  { label: t('car.statusChoices.TALKED'), value: 'TALKED' },
]

const sellerTypeOpts = [
  { label: t('car.sellerTypeChoices.GREEDY'), value: 'GREEDY' },
  { label: t('car.sellerTypeChoices.OK'), value: 'OK' },
  { label: t('car.sellerTypeChoices.NA'), value: 'NA' },
]

watch(
  () => form.value,
  (val) => {
    if (val && val.appointment) {
      const parts = val.appointment.split('T')
      appointDate.value = parts[0]
      appointTime.value = parts[1].substring(0, 5)
    }
  }
)
watch(appointDate, (val) => {
  if (appointTime.value) {
    form.value.appointment = `${val}T${appointTime.value}`
  } else {
    form.value.appointment = val
  }
})
watch(appointTime, (val) => {
  if (appointDate.value) {
    form.value.appointment = `${appointDate.value}T${val}`
  } else {
    const today = new Intl.DateTimeFormat('sv', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(new Date())
    appointDate.value = today
    form.value.appointment = `${today}T${val}`
  }
})
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
      <div class="q-my-lg row">
        <q-btn
          :href="`https://divar.ir/v/blank/${form.token}`"
          icon-right="mdi-open-in-new"
          color="primary"
          :label="$t('car.divarAd')"
          target="_blank"
        />
      </div>

      <div class="row">
        <div class="col col-xs-12 col-md-4 col-lg-2 col-xl-1">
          <q-select
            v-model="form.status"
            :options="statusOpts"
            option-label="label"
            option-value="value"
            :label="$t('car.status')"
            :rules="[isRequired]"
            options-dense
            filled
            emit-value
          >
            <template v-slot:selected-item="scope">
              <div style="direction: ltr">
                {{ carTranslate.statusChoices[scope.opt] }}
              </div>
            </template>
          </q-select>
        </div>
      </div>

      <div class="row">
        <div class="col col-xs-12 col-md-4 col-lg-2 col-xl-1">
          <q-select
            v-model="form.sellerType"
            :options="sellerTypeOpts"
            option-label="label"
            option-value="value"
            :label="$t('car.sellerType')"
            :rules="[isRequired]"
            options-dense
            filled
            emit-value
          >
            <template v-slot:selected-item="scope">
              <div style="direction: ltr">
                {{ carTranslate.sellerTypeChoices[scope.opt] }}
              </div>
            </template>
          </q-select>
        </div>
      </div>

      <div>{{ $t('car.appointment') }}:</div>
      <div class="row">
        <div class="col col-xs-12 col-md-4 col-lg-2 col-xl-1">
          <PersianDatePicker v-model="appointDate" label="general.date" outlined dense />
          <TimePicker
            v-model="appointTime"
            label="general.hour"
            class="q-mt-sm"
            outlined
            dense
          />
        </div>
      </div>

      <div class="row q-my-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.myDescription"
            type="textarea"
            :label="$t('car.myDescription')"
            outlined
          />
        </div>
      </div>

      <div class="row q-my-md">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-markup-table>
            <tbody>
              <tr>
                <td>{{ $t('general.title') }}</td>
                <td>{{ form.title }}</td>
              </tr>
              <tr>
                <td>{{ $t('car.location') }}</td>
                <td>{{ form.location }}</td>
              </tr>
              <tr>
                <td>{{ $t('car.phone') }}</td>
                <td style="letter-spacing: 1px">{{ form.phone }}</td>
              </tr>
              <tr>
                <td>{{ $t('car.price') }}</td>
                <td>{{ formatAsCommaSeparated(form.price) }}</td>
              </tr>
              <tr>
                <td>{{ $t('car.year') }}</td>
                <td>{{ form.year }}</td>
              </tr>
              <tr>
                <td>{{ $t('car.kilometer') }}</td>
                <td>{{ formatAsCommaSeparated(form.kilometer) }}</td>
              </tr>
              <tr>
                <td>{{ $t('car.engine') }}</td>
                <td>{{ form.engine }}</td>
              </tr>
              <tr>
                <td>{{ $t('car.chassis') }}</td>
                <td>{{ form.chassis }}</td>
              </tr>
              <tr>
                <td>{{ $t('car.chassisFront') }}</td>
                <td>{{ form.chassisFront }}</td>
              </tr>
              <tr>
                <td>{{ $t('car.chassisBack') }}</td>
                <td>{{ form.chassisBack }}</td>
              </tr>
              <tr>
                <td>{{ $t('car.body') }}</td>
                <td>{{ form.body }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>

      <div class="text-h6">{{ $t('general.description') }}:</div>
      <div class="row">
        <div class="q-pa-md text-h6 col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          {{ form.description }}
        </div>
      </div>
    </template>
  </AddEdit>
</template>
