<template>
  <q-card class="q-pa-sm q-ma-lg" style="max-width: 600px">
    <q-card-section v-if="invoice">
      <div class="row">
        <div class="col">
          <span>{{ $t('general.fromDate') + ':' }}</span>
          {{ invoice['start_date_persian'] }}
        </div>
        <div class="col">
          <span>{{ $t('general.untilDate') + ':' }}</span>
          {{ invoice['end_date_persian'] }}
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div>
        <span class="text-h6">{{ `${$t('acc.totalCount')}: ${totalCount}` }}</span>
      </div>
    </q-card-section>
    <q-table
      :rows="items"
      :columns="columns"
      :pagination="pagination"
      row-key="id"
      hide-bottom
    >
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {InvoiceResponse} from 'src/types/network/response/accounting/invoice'
import {InvoiceDetailItem, InvoiceDetailsResponse} from 'src/types/network/response/accounting/invoice-details'

defineProps({
  invoiceId: Number,
})

const {t} = useI18n()
const route = useRoute()

const invoice = ref<InvoiceResponse | null>(null)
const items = ref<InvoiceDetailItem[]>([])
const totalCount = ref(0)
const columns = [
  {name: 'name', label: t('general.name'), field: 'name', align: 'left'},
  {name: 'count', label: t('general.count'), field: 'count', align: 'left'},
]
const pagination = ref({
  rowsNumber: 100,
})

axiosInstance.get<InvoiceResponse>(urls.invoices + route.params.id)
  .then(res => {
    console.log('invoice:', res.data)
    invoice.value = res.data
  })
const detailsUrl = urls.invoices + route.params.id + '/get_details/'
axiosInstance.get<InvoiceDetailsResponse>(detailsUrl)
  .then(res => {
    console.log('invoice details:', res.data)
    items.value = res.data.items
    totalCount.value = res.data.total_count
  })
</script>
