<template>
  <Table
    :title="$t('acc.costs')"
    :columns="columns"
    :api-root="apiRoot"
    :edit-route="editRoute"
    :add-route="addRoute"
    :filters="filters"
  >
    <template v-slot:col-type="{ props }">
      <q-btn
        :to="{name: editRoute, params: {id: props.row.id}}"
        dense
        flat
      >
        {{ props.row.type.title }}
      </q-btn>
    </template>

    <template v-slot:col-amount="{ props }">
      {{ $filters.price(props.row.amount) }}
    </template>

    <template v-slot:col-description="{ props }">
      <div class="text-wrapper">
        <span class="wrapped-text">
          {{ props.row.description }}
        </span>
      </div>
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
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import Table from 'src/components/table/Table.vue'
import urls from 'src/urls'
import RouteNames from 'src/router/route-names'

const {t} = useI18n()
const q = useQuasar()

const apiRoot = urls.costs
const editRoute = RouteNames.COST_EDIT
const addRoute = RouteNames.COST_ADD
const columns = [
  {name: 'type', label: t('general.type'), field: 'type', align: 'left', 'auto-width': true},
  {name: 'date', label: t('general.date'), field: 'date', 'auto-width': false},
  {name: 'amount', label: t('general.amountToman'), field: 'amount', sortable: true, 'auto-width': true},
  {name: 'description', label: t('general.description'), field: 'description', align: 'center'},
]

const filters = [
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
