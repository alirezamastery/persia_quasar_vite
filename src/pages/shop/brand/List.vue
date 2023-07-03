<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import Table from 'src/components/table/Table.vue'
import urls from 'src/urls'
import RouteNames from 'src/router/route-names'
import {TableColumn} from 'components/table/types'

const {t} = useI18n()
const apiRoot = urls.shopBrands
const editRoute = RouteNames.SHOP_BRAND_EDIT
const addRoute = RouteNames.SHOP_BRAND_ADD
const columns: TableColumn[] = [
  {name: 'title', label: t('general.title'), field: 'title', align: 'left'},
]
</script>

<template>
  <Table
    :title="$t('shop.brands')"
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
