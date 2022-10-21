<template>
  <div class="q-mx-sm-sm q-mx-md-xl q-pa-sm">
    <template v-if="loaded">
      <div v-if="variants.length === 0">
        {{ $t('general.noItemsFound') }}
      </div>
      <template v-else>
        <div class="row q-my-md">
          <div class="col text-h4">
            <span>{{ $t('general.totalCount') + ':' }}</span>
            {{ totalCount }}
          </div>
        </div>
        <template
          v-for="variant in variants"
          :key="variant.id"
        >
          <Variant :variant="variant"/>
          <div class="q-my-lg"></div>
        </template>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {cloneDeep} from 'lodash'
import Variant from 'components/Variant.vue'
import {axiosInstance} from 'boot/axios'
import urls from 'src/urls'
import {
  VariantResponse,
  VariantDkResponse,
  InactiveVariantsResponse
} from 'src/types/network/response/products/variant'
import {VariantDigikalaResponse} from 'src/types/network/response/products/variant-digikala'


const digiItems = ref<VariantDigikalaResponse[]>([])
const totalCount = ref(0)
const variants = ref<VariantDkResponse[]>([])
const loaded = ref(false)

axiosInstance.get<InactiveVariantsResponse>(urls.inactiveVariants)
  .then(res => {
    console.log('inactive variants:', res)
    digiItems.value = res.data.items
    totalCount.value = res.data.total_count
    fetchPersiaData()
  })

function fetchPersiaData() {
  let query = '?'
  for (const item of digiItems.value) {
    query += `&dkpc[]=${item.id}`
  }
  const url = urls.variants + 'get-by-dkpc-list/' + query
  axiosInstance.get<VariantResponse[]>(url)
    .then(res => {
      console.log('persia data:', res)
      constructData(res.data)
    })
}

function constructData(resData: VariantResponse[]) {
  const data = cloneDeep(resData)
  const result = []
  for (const variant of data) {
    for (const digiItem of digiItems.value) {
      if (digiItem.id === variant.dkpc) {
        const temp = cloneDeep(variant) as VariantDkResponse
        temp['dk'] = digiItem
        result.push(temp)
      }
    }
  }
  console.log('combined result:', result)
  variants.value = result
  loaded.value = true
}
</script>
