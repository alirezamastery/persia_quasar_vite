<template>
  <div :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm'">

    <div class="text-h6 q-mx-md q-mb-lg">
      {{ $t('general.routes.toggleVariantStatus') }}
    </div>

    <q-form @submit.prevent="handleSubmit" class="q-gutter-sm">

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.actualProductId"
            :label="$t('products.actualProduct')"
            :query-param="'search'"
            :obj-repr-field="'title'"
            :api="urls.actualProducts"
            :rules="[isRequired]"
            :list-api="'get-by-id-list'"
            outlined
            @update:model-value="handleActualProductSelect"
          />
        </div>
      </div>

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-select
            v-model="form.variantSelectors"
            :options="selectorChoices"
            :disable="form.actualProductId === null"
            :label="$t('products.selectors')"
            :rules="[isRequired]"
            multiple
            use-chips
            clearable
            outlined
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt['value'] }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:selected-item="scope">
              <q-chip
                removable
                @remove="scope.removeAtIndex(scope.index)"
                :tabindex="scope.tabindex"
              >
                {{ scope.opt['value'] }}
              </q-chip>
            </template>
          </q-select>
        </div>
      </div>

      <div class="row">
        <div class="col col-xs-12 col-sm-4 col-md-3 col-lg-2">
          <q-select
            v-model="form.isActive"
            :options="statusOptions"
            emit-value
            option-value="value"
            option-label="label"
            :label="t('general.changeStatusTo')"
            :rules="[val => val !== null || t('general.error.fieldIsRequired')]"
            outlined
          >
            <template v-slot:selected-item="scope">
              {{ scope.opt ? $t('general.active') : $t('general.inActive') }}
            </template>
          </q-select>
        </div>
      </div>

      <q-btn
        v-show="!isWorking"
        class="q-mt-lg"
        size="md"
        type="submit"
        color="primary"
        :label="$t('general.submit')"
      />

    </q-form>

    <div class="q-mt-lg">
      <q-spinner-gears
        v-if="!taskDone"
        color="amber"
        size="xl"
      />
      <div v-if="taskState === 'FAILURE' && taskDone">
        <span class="text-negative">{{ $t('general.error.operationFailed') }}</span> &nbsp;
        <q-icon name="cancel" color="negative" size="lg"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {notifyMessage} from 'src/modules/notif'
import {isRequired} from 'src/modules/form-validation'
import {axiosInstance} from 'boot/axios'
import urls from 'src/urls'
import {variantStatusFormToRequest} from 'src/types/converter/products/toggle-variant-status'
import {ToggleVariantStatusResponse} from 'src/types/network/response/products/toggle-variant-status'
import {TaskStatus} from 'src/types/network/response/task'
import {ToggleVariantStatusForm} from 'src/types/domain/products/toggle-variant-status'
import {VariantSelector} from 'src/types/network/response/products/variant'
import AutoComplete from 'components/AutoComplete.vue'

const {t} = useI18n()

const statusOptions = [
  {value: false, label: t('general.inActive')},
  {value: true, label: t('general.active')},
]
const form = ref<ToggleVariantStatusForm>({
  actualProductId: null,
  variantSelectors: null,
  isActive: null,
})
const selectorChoices = ref<VariantSelector[]>([])
const taskId = ref<Nullable<string>>(null)
const taskState = ref<TaskStatus>(null)
const taskDone = ref(false)
const isWorking = ref(false)

const stateInterval = ref<Nullable<number>>(null)

onBeforeUnmount(() => {
  if (stateInterval.value !== null)
    stopChecking()
})

function stopChecking() {
  window.clearInterval(stateInterval.value!)
}

async function handleActualProductSelect() {
  if (!form.value.actualProductId) {
    form.value.variantSelectors = []
    return
  }
  const url = urls.actualProductsRelatedSelectors.replace('{0}', String(form.value.actualProductId))
  const res = await axiosInstance.get<VariantSelector[]>(url)
  console.log('related selectors:', res.data)
  selectorChoices.value = res.data
}

async function handleSubmit() {
  taskDone.value = false
  isWorking.value = true
  console.log('form', form.value)
  const data = variantStatusFormToRequest(form.value)
  console.log('data', data)
  try {
    const res = await axiosInstance.post<ToggleVariantStatusResponse>(urls.toggleVariantStatus, data)
    console.log('res:', res.data)
    // taskId.value = res.data.task_id
    // handleTaskStatus()
    if (res.data.has_error) {
      for (const error of res.data.errors) {
        notifyMessage('negative', error.data[0].message)
      }
      notifyMessage('negative', 'عملیات با خطا همراه بود:')
    } else {
      notifyMessage('positive', t('general.alert.operationSuccess'))
    }
  } catch (err) {
    console.log('toggle error:', err)
  }
  isWorking.value = false
  taskDone.value = true
}

function handleTaskStatus() {
  stateInterval.value = window.setInterval(() => {
    const url = urls.taskState.replace('{0}', taskId.value!)
    console.log('status url', url)
    axiosInstance.get(url)
      .then(res => {
        console.log('task state response:', res)
        taskState.value = res.data.state
        console.log('taskState', taskState.value)
        if (taskState.value !== 'PENDING') {
          stopChecking()
          taskDone.value = true
          taskId.value = null
          isWorking.value = false
          if (taskState.value === 'SUCCESS') {
            notifyMessage('positive', t('general.alert.operationSuccess'))
          }
        }
      })
      .catch(err => {
        console.log('task state error', err)
        stopChecking()
      })
  }, 5000)
}
</script>

<style scoped>

</style>
