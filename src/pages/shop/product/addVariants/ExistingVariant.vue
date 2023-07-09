<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import {formatAsCommaSeparated, parseCommaSeparatedInt} from 'src/modules/number-tools'
import {Vue3SlideUpDown} from 'vue3-slide-up-down'
import {axiosInstance} from 'boot/axios'
import urls from 'src/urls'
import QInputCommaSeparated from 'components/form/QInputCommaSeparated.vue'
import {ShopVariantResponse} from 'src/types/network/response/shop/variant'

const props = defineProps<{
  variant: ShopVariantResponse
}>()

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
const isDataOpen = ref(true)
const isFormOpen = ref(false)

const hasChanged = computed(() => {
  // @ts-ignore
  return Object.keys(form).some((key) => form[key] !== initialValues[key])
})


function handleEditClick() {
  isFormOpen.value = true
  isDataOpen.value = false
}

function handleCancelClick() {
  isFormOpen.value = false
  isDataOpen.value = true
  // @ts-ignore
  Object.keys(form).forEach(key => form[key] = initialValues[key])
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
    isFormOpen.value = false
    isDataOpen.value = true
  } catch (e) {
    console.log('error in updating variant:', e)
  }
}
</script>

<template>
  <q-card class="bordered no-shadow q-my-lg">
    <q-card-section>
      <div class="flex items-center justify-start">
        <q-btn dense class="q-ma-sm selector-btn" outline>
          <div
            v-if="variant.selector_value.type.code === 'COLOR'"
            class="selector-icon"
            :style="{'background-color': variant.selector_value.value}"
          ></div>
          <span class="q-ml-sm">{{ variant.selector_value.title }}</span>
        </q-btn>
      </div>
    </q-card-section>

    <Vue3SlideUpDown v-model="isDataOpen">
      <q-card-section class="flex items-center justify-between">
        <div>
          <span>{{ $t('shop.isActive') }}:</span>&nbsp;
          <q-icon v-if="form.isActive" right small color="green" name="mdi-checkbox-marked-circle"/>
          <q-icon v-else right small color="red" name="mdi-cancel"/>
        </div>
        <div>
          <span>{{ $t('shop.maxInOrder') }}:</span>&nbsp;
          <span>{{ form.maxInOrder }}</span>
        </div>
        <div>
          <span>{{ $t('shop.inventory') }}:</span>&nbsp;
          <span>{{ form.inventory }}</span>
        </div>
        <div>
          <span>{{ $t('shop.price') }}:</span>&nbsp;
          <span>{{ form.price }}</span>
        </div>
        <q-btn
          icon="edit"
          color="grey"
          flat
          :disable="isFormOpen"
          @click="handleEditClick"
        />
      </q-card-section>
    </Vue3SlideUpDown>

    <Vue3SlideUpDown v-model="isFormOpen">
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
      <q-card-actions class="flex items-center justify-end">
        <q-btn
          v-if="hasChanged"
          color="primary"
          class="q-mx-md"
          icon-right="save"
          :label="$t('general.submit')"
          @click="handleSubmit"
        />
        <q-btn
          icon="cancel"
          color="red"
          outline
          @click="handleCancelClick"
        />
      </q-card-actions>
    </Vue3SlideUpDown>

  </q-card>
</template>

<style scoped lang="scss">

</style>
