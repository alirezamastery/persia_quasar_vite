<script setup lang="ts">
import {computed, onMounted, Ref, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {axiosInstance} from 'boot/axios'
import {parentCardClass} from 'src/utils/screen'
import urls from 'src/urls'
import {ShopProductAddVariantForm} from 'src/types/domain/shop/variant'
import {ShopProductDetailResponse} from 'src/types/network/response/shop/product'
import {ShopSelectorTypeDetailResponse, ShopSelectorValueResponse} from 'src/types/network/response/shop/selector'
import {isRequired, positiveNaturalNumber} from 'src/modules/form-validation'
import NewVariant from 'pages/shop/product/addVariants/NewVariant.vue'


const route = useRoute()

const product = ref<ShopProductDetailResponse | null>(null)
const selectorType = ref<ShopSelectorTypeDetailResponse | null>(null)
const mainImgUrl = ref('')
const currentVariants = ref<number[]>([])
const newVariants = ref<ShopProductAddVariantForm[]>([])

const formTitle = computed(() => `${product.value?.category.title} ${product.value?.title}`)

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
    currentVariants.value = resProduct.data.variants.map(v => v.id)
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


function handleSelectorValueClick(selectorValue: ShopSelectorValueResponse) {
  if (newVariants.value.map(v => v.selectorValue.id).includes(selectorValue.id))
    return
  newVariants.value.push({
    productId: product.value!.id,
    selectorValue: selectorValue,
    isActive: true,
    maxInOrder: null,
    inventory: null,
    price: '',
  })
}

function getBtnStatus(selectorId: number) {
  return newVariants.value.some(newVar => newVar.selectorValue.id === selectorId)
    || currentVariants.value.includes(selectorId)
}

function handleRemoveSelector(selectorId: number) {
  const index = newVariants.value.map(v => v.selectorValue.id).indexOf(selectorId)
  if (index > -1)
    newVariants.value.splice(index, 1)
}

function formatNumber(newVar: any) {
  console.log('changed:', newVar.price)
  // newVar.value.price = formatAsCommaSeparated(newVar.value.price)
}
</script>

<template>
  <div
    v-if="product !== null && selectorType !== null"
    :class="parentCardClass"
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

    <q-card class="q-mt-md q-pa-md" v-if="newVariants.length > 0">
      <NewVariant v-model="newVariants" :selector-type="selectorType"/>
      <!--      <q-card-->
      <!--        v-for="(newVar, j) in newVariants"-->
      <!--        :key="j"-->
      <!--        class="bordered no-shadow q-my-lg"-->
      <!--      >-->
      <!--        <q-bar>-->
      <!--          <q-space/>-->
      <!--          <q-btn dense flat icon="close" @click="handleRemoveSelector(newVar.selectorValue.id)"/>-->
      <!--        </q-bar>-->
      <!--        <q-card-section class="row justify-between">-->
      <!--          <q-btn dense class="q-ma-sm selector-btn" outline>-->
      <!--            <div-->
      <!--              v-if="selectorType.code === 'COLOR'"-->
      <!--              class="selector-icon"-->
      <!--              :style="{'background-color': newVar.selectorValue.value}"-->
      <!--            ></div>-->
      <!--            <span class="q-ml-sm">{{ newVar.selectorValue.title }}</span>-->
      <!--          </q-btn>-->
      <!--          <q-checkbox-->
      <!--            v-model="newVar.isActive"-->
      <!--            :label="$t('shop.isActive')"-->
      <!--          />-->
      <!--        </q-card-section>-->

      <!--        <q-card-section class="row q-col-gutter-sm">-->
      <!--          <div class="col col-xs-12 col-sm-6 col-md-4">-->
      <!--            <q-input-->
      <!--              v-model="newVar.maxInOrder"-->
      <!--              :label="$t('shop.maxInOrder')"-->
      <!--              outlined-->
      <!--              dense-->
      <!--              :rules="[isRequired]"-->
      <!--            />-->
      <!--          </div>-->
      <!--          <div class="col col-xs-12 col-sm-6 col-md-4">-->
      <!--            <q-input-->
      <!--              v-model="newVar.inventory"-->
      <!--              :label="$t('shop.inventory')"-->
      <!--              outlined-->
      <!--              dense-->
      <!--              :rules="[isRequired]"-->
      <!--            />-->
      <!--          </div>-->
      <!--          <div class="col col-xs-12 col-sm-6 col-md-4">-->
      <!--            <q-input-->
      <!--              v-model="newVar.price"-->
      <!--              :label="$t('shop.price')"-->
      <!--              type="number"-->
      <!--              outlined-->
      <!--              dense-->
      <!--              :rules="[isRequired,positiveNaturalNumber]"-->
      <!--              @update:model-value="formatNumber(newVar)"-->
      <!--            />-->
      <!--          </div>-->
      <!--        </q-card-section>-->
      <!--      </q-card>-->
    </q-card>



    <q-card class="bordered">
      <q-card-section>
        <q-btn
          v-for="(selectorValue, i) in selectorType.values"
          :key="i"
          class="q-ma-sm selector-btn"
          :outline="getBtnStatus(selectorValue.id)"
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



  </div>
</template>

<style scoped lang="scss">
.selector-icon {
  width: 15px;
  height: 15px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
}
</style>
