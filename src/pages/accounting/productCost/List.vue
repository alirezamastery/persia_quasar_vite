<template>
  <Table
    :title="$t('acc.productCosts')"
    :columns="columns"
    :api-root="apiRoot"
    :edit-route="editRoute"
    :add-route="addRoute"
    :filters="filters"
  >

    <template v-slot:col-amount="{ props }">
      <q-btn
        :to="{name: editRoute, params: {id: props.row.id}}"
        dense
        flat
      >
        {{ $filters.price(props.row.amount) }}
      </q-btn>
    </template>

    <template v-slot:col-date="{ props }">
      <template v-if="q.lang.isoName === 'fa'">
        {{ $filters.persianDate(props.row.date) }}
      </template>
      <template v-else>{{ props.row.date }}</template>
    </template>

  </Table>
</template>

<script setup lang="ts">
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import Table from 'src/components/table/Table.vue'
import urls from 'src/urls'
import RouteNames from 'src/router/route-names'
import {TableColumn, TableFilter} from 'components/table/types'

const q = useQuasar()
const {t} = useI18n()

const apiRoot = urls.productCosts
const editRoute = RouteNames.PRODUCT_COST_EDIT
const addRoute = RouteNames.PRODUCT_COST_ADD
const columns: TableColumn[] = [
  {name: 'amount', label: t('general.amountToman'), field: 'amount', align: 'left'},
  {name: 'date', label: t('general.date'), field: 'date'},
]

const filters: TableFilter[] = [
  {
    type: 'date',
    queryParam: 'date_gte',
    label: 'general.fromDate',
  },
  {
    type: 'date',
    queryParam: 'date_lte',
    label: 'general.untilDate',
  },
]
</script>
