<script setup lang="ts">
import {computed, reactive} from 'vue'
import {formatAsCommaSeparated, parseCommaSeparatedInt} from 'src/modules/number-tools'
import urls from 'src/urls'
import {axiosInstance} from 'boot/axios'
import QInputCommaSeparated from 'components/form/QInputCommaSeparated.vue'

interface VariantListItemProps {
  variant: {
    id: number
    product: {
      id: number
      brand: number
      title: string
      description: string
      is_active: boolean
      slug: string
      category: number
    }
    selector_value: {
      id: number
      type: {
        id: number
        title: string
        code: 'COLOR' | 'SIZE'
      }
      title: string
      value: string
      extra_info: string
    }
    is_active: false
    price: number
    inventory: number
    max_in_order: number
  }
}

const props = defineProps<VariantListItemProps>()

const initialValues = {
  isActive: props.variant.is_active,
  maxInOrder: formatAsCommaSeparated(props.variant.max_in_order),
  inventory: formatAsCommaSeparated(props.variant.inventory),
  price: formatAsCommaSeparated(props.variant.price),
}
const form = reactive({
  isActive: props.variant.is_active,
  maxInOrder: formatAsCommaSeparated(props.variant.max_in_order),
  inventory: formatAsCommaSeparated(props.variant.inventory),
  price: formatAsCommaSeparated(props.variant.price),
})

const hasChanged = computed(() => {
  // @ts-ignore
  return Object.keys(form).some((key) => form[key] !== initialValues[key])
})

function handleToggleClick(variantId: number, isActive: boolean) {
  console.log('id:', variantId, isActive)
}

function formToPayload(){
  return {
    product: props.variant.product,
    selector_value: props.variant.selector_value.id,
    is_active: form.isActive,
    max_in_order: parseCommaSeparatedInt(form.maxInOrder),
    inventory: parseCommaSeparatedInt(form.inventory),
    price: parseCommaSeparatedInt(form.price),
  }
}

async function handleSubmit() {
  console.log('s')
  const url = urls.shopVariantDetail.replace('{0}', props.variant.id.toString())
  try {
    const res = await axiosInstance.patch(url, formToPayload())
    console.log('updated variant:', res)
    // @ts-ignore
    Object.keys(initialValues).forEach(key => initialValues[key] = form[key])
  } catch (e) {
    console.log('error in updating variant:', e)
  }
}
</script>

<template>
  <q-card class="q-my-md q-mx-sm bordered no-shadow" style="width: 100%">
    <q-card-section class="row">
      <div class="col">
        {{ variant.product.title }}
      </div>

      <div v-if="variant.selector_value.type.code === 'COLOR'" class="col">
        <q-btn dense flat>
          <div
            class="selector-icon q-mr-sm"
            :style="{'background-color': variant.selector_value.value}"
          ></div>
          {{ variant.selector_value.title }}
        </q-btn>
      </div>
      <div v-else>{{ variant.selector_value.value }}</div>

      <div class="col col-xs-3 col-sm-2">
        <q-toggle
          :model-value="variant.is_active"
          :label="$t('shop.isActive')"
          @update:model-value="handleToggleClick(variant.id, $event)"
        />
      </div>
    </q-card-section>
    <q-card-section class="row justify-between">
      <q-checkbox
        v-model="form.isActive"
        :label="$t('shop.isActive')"
      />
    </q-card-section>

    <q-card-section class="row q-col-gutter-sm">
      <div class="col col-xs-12 col-sm-6 col-md-4">
        <QInputCommaSeparated
          v-model="form.maxInOrder"
          :label="$t('shop.maxInOrder')"
          outlined
          dense
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-4">
        <QInputCommaSeparated
          v-model="form.inventory"
          :label="$t('shop.inventory')"
          outlined
          dense
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-4">
        <QInputCommaSeparated
          v-model="form.price"
          :label="$t('shop.price')"
          outlined
          dense
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">

</style>
