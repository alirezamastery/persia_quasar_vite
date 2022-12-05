<template>
  <Table
    :title="$t('products.brands')"
    :columns="columns"
    :api-root="apiRoot"
    :edit-route="editRoute"
    :add-route="addRoute"
  >

    <template v-slot:col-title="{ props }">
      <q-btn :to="{name: editRoute, params: {id: props.row.id}}" dense flat>
        {{ props.row.title }}
      </q-btn>
    </template>

  </Table>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import Table from 'src/components/table/Table.vue'
import urls from 'src/urls'
import RouteNames from 'src/router/route-names'
import {TableColumn} from 'components/table/types'

const {t} = useI18n()
const apiRoot = urls.brands
const editRoute = RouteNames.BRAND_EDIT
const addRoute = RouteNames.BRAND_ADD
const columns: TableColumn[] = [
  {name: 'title', label: t('general.title'), field: 'title', align: 'left'},
]
</script>
