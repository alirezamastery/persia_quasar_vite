<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { notifyMessage } from 'src/modules/notif'
import { formatAsCommaSeparated, parseCommaSeparatedInt } from 'src/modules/number-tools'
import { axiosInstance } from 'src/boot/axios'
import urls from 'src/urls'
import QInputCommaSeparated from 'components/form/QInputCommaSeparated.vue'
import { invoiceDetailResponseToDomain } from 'src/types/converter/accounting/invoice'
import { InvoiceResponse } from 'src/types/network/response/accounting/invoice'
import { InvoiceDetailsResponse } from 'src/types/network/response/accounting/invoice-details'
import { InvoiceDetailItemDomain } from 'src/types/domain/accounting/invoice'

defineProps({
  invoiceId: Number,
})

const q = useQuasar()
const { t } = useI18n()
const route = useRoute()

const invoice = ref<InvoiceResponse | null>(null)
const items = ref<InvoiceDetailItemDomain[]>([])
const totalCount = ref(0)
const columns = [
  {
    name: 'rowNumber',
    label: t('general.row'),
    field: 'rowNumber',
    align: 'left',
  },
  { name: 'title', label: t('general.name'), field: 'title', align: 'left' },
  { name: 'count', label: t('general.count'), field: 'count', align: 'left' },
  {
    name: 'price',
    label: t('general.priceToman'),
    field: 'price',
    align: 'left',
  },
]
const pagination = ref({
  rowsNumber: 1000,
})
const form = reactive<Record<number, string>>({})
const quantityMap: Record<number, number> = {}

const tableSum = computed(() => {
  let sum = 0
  for (const item of items.value) {
    const price = form[item.actualProductId]
    const priceInt = price ? parseCommaSeparatedInt(price) : 0
    sum += priceInt * item.count
  }
  return sum
})

axiosInstance.get<InvoiceResponse>(urls.invoices + route.params.id).then((res) => {
  console.log('invoice:', res.data)
  invoice.value = res.data
})

const detailsUrl = urls.invoices + route.params.id + '/get_details/'
axiosInstance.get<InvoiceDetailsResponse>(detailsUrl).then((res) => {
  console.log('invoice details:', res.data)
  const data = invoiceDetailResponseToDomain(res.data)
  items.value = data.items
  items.value.forEach(
    (item) => (form[item.actualProductId] = formatAsCommaSeparated(item.price))
  )
  items.value.forEach((item) => (quantityMap[item.actualProductId] = item.count))
  totalCount.value = data.totalCount
})

async function handleSubmit() {
  const payload = []
  for (const [k, v] of Object.entries(form)) {
    payload.push({
      actual_product: parseInt(k),
      invoice: parseInt(String(route.params.id)),
      price: v === '' ? 0 : parseCommaSeparatedInt(v),
      quantity: quantityMap[k],
    })
  }
  const url = urls.invoiceActualItems + 'bulk-insert/'
  q.loading.show({ delay: 300 })
  try {
    await axiosInstance.post(url, payload)
    notifyMessage('positive', 'تغییرات ثبت شد')
  } catch (e) {
    console.log('e:', e)
  }
  q.loading.hide()
}
</script>

<template>
  <div class="row q-pb-xl" :class="$q.screen.gt.sm ? 'q-pa-sm q-ma-lg' : 'q-pt-sm'">
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
        <div class="row justify-between">
          <div>
            <div class="text-h6">{{ `${$t('acc.totalCount')}: ${totalCount}` }}</div>
            <div class="text-h6">
              <span>مجموع قیمت:</span>&nbsp;
              <span>{{ formatAsCommaSeparated(tableSum) }}</span
              >&nbsp;
              <span>{{ $t('general.toman') }}</span>
            </div>
          </div>
          <div class="q-pa-sm">
            <q-btn :label="$t('general.save')" @click="handleSubmit" color="primary" />
          </div>
        </div>
      </q-card-section>

      <q-table
        :rows="items"
        :columns="columns"
        :pagination="pagination"
        row-key="id"
        hide-bottom
        :grid="$q.screen.xs"
      >
        <template v-slot:body-cell-price="props">
          <td>
            <QInputCommaSeparated
              v-model="form[props.row.actualProductId]"
              filled
              dense
              hide-bottom-space
              style="width: 120px"
            />
          </td>
        </template>

        <!-- col-xs -->
        <template v-slot:item="props">
          <div
            class="q-pa-xs q-my-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
            :style="props.selected ? 'transform: scale(0.95);' : ''"
          >
            <q-card :class="props.selected ? 'bg-grey-2' : ''">
              <q-list dense>
                <template v-for="col in props.cols" :key="col.name">
                  <q-item v-if="col.name === 'price'">
                    <q-item-section>
                      <QInputCommaSeparated
                        v-model="form[props.row.actualProductId]"
                        :label="$t('general.priceToman')"
                        filled
                        dense
                      />
                    </q-item-section>
                  </q-item>
                  <q-item v-else>
                    <q-item-section>
                      <q-item-label>{{ col.label }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ props.row[col.field] }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-card>
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>
