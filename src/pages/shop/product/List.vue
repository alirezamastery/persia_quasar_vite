<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import urls from 'src/urls'
import Table from 'src/components/table/Table.vue'
import RouteNames from 'src/router/route-names'
import {TableColumn, TableFilter} from 'components/table/types'

const {t} = useI18n()
const apiRoot = urls.shopProducts
const editRoute = RouteNames.SHOP_PRODUCT_EDIT
const addRoute = RouteNames.SHOP_PRODUCT_ADD
const columns: TableColumn[] = [
  {name: 'title', label: t('general.title'), field: 'title', align: 'left'},
  {name: 'brand', label: t('shop.brand'), field: 'brand', align: 'left'},
  {name: 'category', label: t('shop.category'), field: 'category', align: 'left'},
  {name: 'isActive', label: t('general.isActive'), field: 'is_active', align: 'left'},
]

const filters: TableFilter[] = [
  {
    type: 'boolean',
    queryParam: 'is_active',
    label: 'general.isActive',
  },
]
</script>

<template>
  <Table
    :title="$t('shop.brands')"
    :columns="columns"
    :api-root="apiRoot"
    :edit-route="editRoute"
    :add-route="addRoute"
    :filters="filters"
  >

    <template v-slot:col-title="{ props }">
      <q-btn :to="{name: editRoute, params: {id: props.row.id}}" dense flat>
        {{ props.row.title }}
      </q-btn>
    </template>

    <template v-slot:col-brand="{ props }">
      {{ props.row.brand.title }}
    </template>

    <template v-slot:col-category="{ props }">
      {{ props.row.category.title }}
    </template>

    <template v-slot:col-isActive="{ props }">
      <q-icon v-if="props.row.is_active" right small color="green" name="mdi-checkbox-marked-circle"/>
      <q-icon v-else right small color="red" name="mdi-cancel"/>
    </template>

  </Table>
</template>
