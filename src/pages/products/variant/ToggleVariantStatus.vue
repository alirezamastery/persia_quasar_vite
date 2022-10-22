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
          />
        </div>
      </div>

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.selectorIds"
            :label="$t('products.selectors')"
            :query-param="'search'"
            :obj-repr-field="'value'"
            :api="urls.variantSelectors"
            :rules="[isRequired]"
            :list-api="'get-by-id-list'"
            select-multiple
            outlined
          />
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
              {{ scope.opt ? $t('general.active') : $t('general.inActive')}}
            </template>
          </q-select>
        </div>
      </div>

      <q-btn
        class="q-mt-lg"
        size="md"
        type="submit"
        color="primary"
        :label="$t('general.submit')"
      />

    </q-form>

    <div class="q-mt-lg">
      <q-spinner-gears
        v-if="taskId && !taskDone"
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
import {isRequired} from 'src/modules/form-validation'
import urls from 'src/urls'
import AutoComplete from 'components/AutoComplete.vue'
import {ToggleVariantStatusForm} from 'src/types/domain/products/toggle-variant-status'
import {variantStatusFormToRequest} from 'src/types/converter/products/toggle-variant-status'
import {axiosInstance} from 'boot/axios'
import {ToggleVariantStatusResponse} from 'src/types/network/response/products/toggle-variant-status'
import {useI18n} from 'vue-i18n'
import {TaskStatus} from 'src/types/network/response/task'
import {notifyMessage} from 'src/modules/notif'

const {t} = useI18n()

const statusOptions = [
  {value: false, label: t('general.inActive')},
  {value: true, label: t('general.active')},
]
const form = ref<ToggleVariantStatusForm>({
  actualProductId: null,
  selectorIds: [],
  isActive: null,
})
const taskId = ref<Nullable<string>>(null)
const taskState = ref<TaskStatus>(null)
const taskDone = ref(false)

const stateInterval = ref<Nullable<number>>(null)

onBeforeUnmount(() => {
  if (stateInterval.value !== null)
    stopChecking()
})

function stopChecking() {
  window.clearInterval(stateInterval.value!)
}

async function handleSubmit() {
  const data = variantStatusFormToRequest(form.value)
  console.log('fom', data)
  try {
    const res = await axiosInstance.post<ToggleVariantStatusResponse>(urls.toggleVariantStatus, data)
    console.log('res:', res.data)
    taskId.value = res.data.task_id
    handleTaskStatus()
  } catch (err) {
    console.log('toggle error:', err)
  }
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
          if (taskState.value === 'SUCCESS') {
            notifyMessage('positive', t('general.alert.operationSuccess'))
            stopChecking()
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
