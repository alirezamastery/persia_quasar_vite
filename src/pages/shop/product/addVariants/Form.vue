<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {axiosInstance} from 'boot/axios'
import {parentCardClass} from 'src/utils/screen'
import urls from 'src/urls'
import NewVariants from 'pages/shop/product/addVariants/NewVariants.vue'
import {ShopProductAddVariantForm} from 'src/types/domain/shop/variant'
import {ShopProductDetailResponse} from 'src/types/network/response/shop/product'
import {ShopSelectorTypeDetailResponse} from 'src/types/network/response/shop/selector'
import {ShopVariantResponse} from 'src/types/network/response/shop/variant'
import {shopProductAddVariantToPayload} from 'src/types/converter/shop/variant'
import ExistingVariant from 'pages/shop/product/addVariants/ExistingVariant.vue'


const route = useRoute()

const product = ref<ShopProductDetailResponse | null>(null)
const selectorType = ref<ShopSelectorTypeDetailResponse | null>(null)
const mainImgUrl = ref('')
const currentVariants = ref<ShopVariantResponse[]>([])
const newVariants = ref<ShopProductAddVariantForm[]>([])

const formTitle = computed(() => `${product.value?.category.title} ${product.value?.title}`)
const currentSelectorIds = computed(()=> currentVariants.value.map(v => v.selector_value.id))

onMounted(async () => {
  let url = urls.shopProductDetail.replace('{0}', String(route.params.id))
  try {
    const resProduct = await axiosInstance.get<ShopProductDetailResponse>(url)
    product.value = resProduct.data
    console.log(resProduct.data)
    for (const img of resProduct.data.images) {
      if (img.is_main) {
        mainImgUrl.value = img.url
        break
      }
    }
    currentVariants.value = resProduct.data.variants

  } catch (e) {
    console.log('error in getting product details:', e)
  }

  url = urls.shopSelectorTypeDetail.replace('{0}', String(product.value?.category.selector_type))
  try {
    const resType = await axiosInstance.get<ShopSelectorTypeDetailResponse>(url)
    selectorType.value = resType.data
    console.log(resType.data)
  } catch (e) {
    console.log('error in getting selector type details:', e)
  }
})

function btnAlreadySelected(selectorId: number) {
  console.log('s id:', selectorId, currentSelectorIds.value)
  return newVariants.value.some(newVar => newVar.selectorValue.id === selectorId)
    || currentSelectorIds.value.includes(selectorId)
}

function handleSelectorValueClick(selectorValue: ShopSelectorTypeDetailResponse['values'][number]) {
  if (btnAlreadySelected(selectorValue.id))
    return
  newVariants.value.push({
    productId: product.value!.id,
    selectorValue: selectorValue,
    isActive: true,
    maxInOrder: '',
    inventory: '',
    price: '',
  })
}

async function handleSubmit() {
  console.log('ll')
  const data = newVariants.value.map(v => shopProductAddVariantToPayload(v))
  try {
    const res = await axiosInstance.post<ShopVariantResponse[]>(urls.shopAddVariants, data)
    console.log('add variant response:', res)
    currentVariants.value.push(...res.data)
    newVariants.value = []
  } catch (e) {
    console.log('add variant error:', e)
  }
}
</script>

<template>
  <form
    v-if="product !== null && selectorType !== null"
    :class="parentCardClass"
    @submit.prevent="handleSubmit"
  >
    <q-card class="no-shadow q-mb-md">
      <q-card-section horizontal>
        <q-img :src="mainImgUrl" :ratio="1" height="120px" width="120px"/>
        <q-card-section>{{ formTitle }}</q-card-section>
        <q-card-section>
          <span>نوع انتخاب گر:</span>&nbsp;
          <span>{{ selectorType.title }}</span>
        </q-card-section>
      </q-card-section>
    </q-card>

    <q-card class="bordered">
      <q-card-section>
        <q-btn
          v-for="(selectorValue, i) in selectorType.values"
          :key="i"
          class="q-ma-xs selector-btn"
          :outline="btnAlreadySelected(selectorValue.id)"
          dense
          unelevated
          @click="handleSelectorValueClick(selectorValue)"
        >
          <div
            v-if="selectorType.code === 'COLOR'"
            class="selector-icon"
            :style="{'background-color': selectorValue.value}"
          ></div>
          <span class="q-ml-sm">{{ selectorValue.title }}</span>
        </q-btn>
      </q-card-section>
    </q-card>

    <q-card v-if="newVariants.length > 0" class="q-mt-md q-pa-md">
      <NewVariants v-model="newVariants" :selector-type="selectorType"/>

      <q-card-actions>
        <q-btn
          color="primary"
          type="submit"
          :label="$t('shop.addToVariantList')"
        />
      </q-card-actions>
    </q-card>

    <q-card v-if="currentVariants.length > 0" class="q-mt-md q-pa-md">
      <ExistingVariant
        v-for="v in currentVariants"
        :key="v.id"
        :variant="v"
      />
    </q-card>

  </form>
</template>

<style scoped lang="scss">
.selector-icon {
  width: 15px;
  height: 15px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
}
</style>
