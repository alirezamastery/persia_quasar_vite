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
import Variant from 'src/components/Variant.vue'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {
  Variant as VariantObj,
  VariantDk,
  VariantDigikala,
  InactiveVariantsResponse,
} from 'src/typings/types'


const digiItems = ref<VariantDigikala[]>([])
const totalCount = ref(0)
const variants = ref<VariantDk[]>([])
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
  const url = urls.variants + 'get_by_list/' + query
  axiosInstance.get<VariantObj[]>(url)
      .then(res => {
        console.log('persia data:', res)
        constructData(res.data)
      })
}

function constructData(resData: VariantObj[]) {
  const data = cloneDeep(resData)
  const result = []
  for (const variant of data) {
    for (const digiItem of digiItems.value) {
      if (digiItem.id === variant.dkpc) {
        const temp = cloneDeep(variant) as VariantDk
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
