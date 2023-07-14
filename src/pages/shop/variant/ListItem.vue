<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import {formatAsCommaSeparated} from 'src/modules/number-tools'
import urls from 'src/urls'
import {axiosInstance} from 'boot/axios'
import QInputCommaSeparated from 'components/form/QInputCommaSeparated.vue'
import {ShopVariantResponse} from 'src/types/network/response/shop/variant'
import {ShopVariantForm} from 'src/types/domain/shop/variant'
import {shopVariantFormToPayload, shopVariantResponseToForm} from 'src/types/converter/shop/variant'


const props = defineProps<{ variant: ShopVariantResponse }>()

const initialValues = reactive<ShopVariantForm>({
  isActive: props.variant.is_active,
  price: formatAsCommaSeparated(props.variant.price),
  inventory: formatAsCommaSeparated(props.variant.inventory),
  maxInOrder: formatAsCommaSeparated(props.variant.max_in_order),
})
const form = reactive<ShopVariantForm>({
  isActive: props.variant.is_active,
  price: formatAsCommaSeparated(props.variant.price),
  inventory: formatAsCommaSeparated(props.variant.inventory),
  maxInOrder: formatAsCommaSeparated(props.variant.max_in_order),
})
const isLoading = ref(false)

const hasChanged = computed(() => {
  // @ts-ignore
  return Object.keys(form).some((key) => form[key] !== initialValues[key])
})


function revertChanges() {
  Object.assign(form, initialValues)
}

async function handleToggleClick(variantId: number, isActive: boolean) {
  isLoading.value = true
  try {
    const url = urls.shopVariantDetail.replace('{0}', props.variant.id.toString())
    const res = await axiosInstance.patch<ShopVariantResponse>(url, {is_active: isActive})
    form.isActive = res.data.is_active
    initialValues.isActive = res.data.is_active
  } catch (e) {
    console.log('error in updating is_active:', e)
  }
  isLoading.value = false
}

async function handleSubmit() {
  isLoading.value = true
  const url = urls.shopVariantDetail.replace('{0}', props.variant.id.toString())
  try {
    const res = await axiosInstance.patch(url, shopVariantFormToPayload(form))
    const domainObj = shopVariantResponseToForm(res.data)
    Object.assign(form, domainObj)
    Object.assign(initialValues, domainObj)
  } catch (e) {
    console.log('error in updating variant:', e)
  }
  isLoading.value = false
}
</script>

<template>
  <q-card class="q-my-md q-mx-sm bordered no-shadow" style="width: 100%">
    <q-card-section class="row">
      <div class="col col-xs-12 col-sm-6 col-md-4">
        <q-btn
          :label="variant.product.title"
          flat
        />
      </div>

      <div
        v-if="variant.selector_value.type.code === 'COLOR'"
        class="col col-xs-12 col-sm-6 col-md-4"
      >
        <q-btn flat>
          <div
            class="selector-icon q-mr-sm"
            :style="{'background-color': variant.selector_value.value}"
          ></div>
          {{ variant.selector_value.title }}
        </q-btn>
      </div>
      <div v-else>{{ variant.selector_value.value }}</div>

      <div class="col col-xs-12 col-sm-6 col-md-4">
        <q-toggle
          :model-value="form.isActive"
          :label="$t('shop.isActive')"
          :disable="isLoading"
          @update:model-value="handleToggleClick(variant.id, $event)"
        />
      </div>
    </q-card-section>

    <q-card-section class="row q-col-gutter-sm">
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-3">
        <QInputCommaSeparated
          v-model="form.maxInOrder"
          :label="$t('shop.maxInOrder')"
          outlined
          dense
          :disable="isLoading"
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-3">
        <QInputCommaSeparated
          v-model="form.inventory"
          :label="$t('shop.inventory')"
          outlined
          dense
          :disable="isLoading"
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-3">
        <QInputCommaSeparated
          v-model="form.price"
          :label="$t('shop.price')"
          outlined
          dense
          :disable="isLoading"
        />
      </div>

      <div class="col col-xs-12 col-sm-6 col-lg-3 flex justify-around">
        <div>
          <q-btn
            v-if="hasChanged"
            color="green"
            icon="save"
            class="q-mr-sm"
            @click="handleSubmit"
            :disable="isLoading"
          />
        </div>
        <div>
          <q-btn
            v-if="hasChanged"
            color="grey"
            icon="cancel"
            outline
            @click="revertChanges"
            :disable="isLoading"
          />
        </div>
      </div>
    </q-card-section>

  </q-card>
</template>

<style scoped lang="scss">

</style>
