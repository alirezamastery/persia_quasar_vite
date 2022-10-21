<template>
  <div class="row " :class="$q.screen.gt.sm ? 'q-pa-sm q-ma-lg' : 'q-pt-sm'">
    <q-card class="col col-lg-8 col-xl-4">
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
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {InvoiceResponse} from 'src/types/network/response/accounting/invoice'
import {InvoiceDetailsResponse} from 'src/types/network/response/accounting/invoice-details'
import {InvoiceDetailItemDomain} from 'src/types/domain/accounting/invoice'
import {invoiceDetailResponseToDomain} from 'src/types/converter/accounting/invoice'

defineProps({
  invoiceId: Number,
})

const {t} = useI18n()
const route = useRoute()

const invoice = ref<InvoiceResponse | null>(null)
const items = ref<InvoiceDetailItemDomain[]>([])
const totalCount = ref(0)
const columns = [
  {name: 'rowNumber', label: t('general.row'), field: 'rowNumber', align: 'left'},
  {name: 'title', label: t('general.name'), field: 'title', align: 'left'},
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
    const data = invoiceDetailResponseToDomain(res.data)
    items.value = data.items
    totalCount.value = data.totalCount
  })
</script>
