<template>
  <div class="fit" :class="$q.screen.gt.sm ? 'q-pa-md' : 'q-pa-sm'">

    <div class="text-h5 q-ma-md">{{ formTitle }}</div>

    <q-form @submit.prevent="handleFormSubmit">
      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
              v-model="form.productId"
              :label="$t('products.product')"
              :obj-repr-field="'title'"
              :query-param="'search'"
              :api="urls.products"
              :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
              v-model="form.actualProductId"
              :label="$t('products.actualProduct')"
              :query-param="'search'"
              :obj-repr-field="'title'"
              :api="urls.actualProducts"
              :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
              v-model="form.priceMin"
              :label="$t('general.priceMinRial')"
              filled
              :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-checkbox
              v-model="form.isActive"
              :label="$t('products.isActive')"
          />
        </div>
      </div>

      <q-separator class="q-my-md"/>

      <div class="text-h6 q-mb-md">
        {{ $t('products.variants') }}
      </div>

      <!-- key=i is necessary because if dkpc is used, it will change by each character and input loses focus -->
      <div
          v-for="(variant , i) in form.variants"
          class="row q-gutter-sm q-pa-sm"
          :key="i"
      >
        <div class="col col-xs-10 col-sm-5 col-md-5 col-lg-3 col-xl-2">
          <AutoComplete
              v-model="variant.variantSelectorId"
              :hint="$t('products.selectorValues')"
              :query-param="'search'"
              :obj-repr-field="'value'"
              :api="urls.variantSelectors"
              :rules="[isRequired]"
              :filled="false"
              outlined
          />
        </div>
        <div class="col col-xs-10 col-sm-5 col-md-5 col-lg-3 col-xl-2">
          <q-input
              v-model="variant.dkpc"
              :hint="$t('products.DKPC')"
              :rules="[isRequired]"
              outlined
          />
        </div>
        <div class="q-pt-sm col-1">
          <q-btn
              v-if="i === form.variants.length - 1"
              icon="add"
              color="primary"
              round
              flat
              @click="addVariantInput"
          />
          <q-btn
              v-else
              icon="remove"
              color="red"
              round
              flat
              @click="removeVariantInput(i)"
          />
        </div>
      </div>

      <FormActions :show-delete="false"/>

    </q-form>

  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import useGeneralStore from 'src/stores/general'
import {formatAsCommaSeparated, parseCommaSeparatedInt} from 'src/modules/number-tools'
import {addBanner, notifyMessage} from 'src/modules/notif'
import {isRequired} from 'src/modules/form-validation'
import AutoComplete from 'src/components/AutoComplete.vue'
import FormActions from 'src/components/addEdit/FormActions.vue'
import {routerInstance} from 'src/router'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {VariantBulkAddForm} from 'src/types/domain/products/variant'


const {t} = useI18n()
const generalStore = useGeneralStore()
const formTitle = `${t('general.bulkCreate')} ${t('products.variant')}`
const form = ref<VariantBulkAddForm>({
  productId: null,
  actualProductId: null,
  priceMin: '',
  isActive: true,
  variants: [
    {
      dkpc: null,
      variantSelectorId: null,
    },
  ],
})

watch(() => form.value.priceMin, (newVal) => {
  form.value.priceMin = formatAsCommaSeparated(newVal)
})

function addVariantInput() {
  form.value.variants.push({
    dkpc: null,
    variantSelectorId: null,
  })
}

function removeVariantInput(index: number) {
  form.value.variants.splice(index, 1)
}

function validateVariants() {
  generalStore.ClearBanners()
  const selectorIds = form.value.variants.map(variant => variant.variantSelectorId)
  if (form.value.variants.length !== new Set(selectorIds).size) {
    notifyMessage('negative', t('general.snack.duplicateSelector'))
    return false
  }
  const dkpcList = form.value.variants.map(variant => variant.dkpc)
  if (form.value.variants.length !== new Set(dkpcList).size) {
    notifyMessage('negative', t('general.snack.duplicateDkpc'))
    return false
  }
  return true
}

function handleFormSubmit() {
  if (!validateVariants()) return
  const data = {
    product: form.value.productId,
    actual_product: form.value.actualProductId,
    price_min: parseCommaSeparatedInt(form.value.priceMin),
    is_active: form.value.isActive,
    variants: form.value.variants.map(v => ({dkpc: v.dkpc, selector: v.variantSelectorId})),
  }
  console.log('form data:', data)
  axiosInstance.post(urls.variantBulkCreate, data)
      .then(res => {
        console.log('save success', res.data)
        addBanner(t('general.alert.saveSuccessGeneral', {type: t('products.variant')}))
        routerInstance.push({name: 'variantList'})
      })
      .catch(err => console.log('bulk create error:', err))
}
</script>

