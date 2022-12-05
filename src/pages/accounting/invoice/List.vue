<template>
  <Table
    :title="$t('robot.invoices')"
    :columns="columns"
    :api-root="apiRoot"
    :filters="filters"
    hide-search
  >

    <template v-slot:col-number="{ props }">
      <q-btn :to="{name: 'invoiceDetails', params: {id: props.row.id}}" color="light-blue" dense flat>
        {{ props.row.number }}
      </q-btn>
    </template>

  </Table>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import Table from 'src/components/table/Table.vue'
import urls from 'src/urls'
import {TableColumn, TableFilter} from 'components/table/types'

const {t} = useI18n()

const apiRoot = urls.invoices
const columns: TableColumn[] = [
  {name: 'number', label: t('general.number'), field: 'number', align: 'left'},
  {name: 'start_date_persian', label: t('general.fromDate'), field: 'start_date_persian', align: 'left'},
  {name: 'end_date_persian', label: t('general.untilDate'), field: 'end_date_persian', align: 'left'},
]
const filters: TableFilter[] = [
  {
    type: 'date',
    queryParam: 'end_date_gte',
    label: 'general.fromDate',
  },
  {
    type: 'date',
    queryParam: 'end_date_lte',
    label: 'general.untilDate',
  },
]
</script>
