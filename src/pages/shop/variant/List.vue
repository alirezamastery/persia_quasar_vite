<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import urls from 'src/urls'
import Table from 'src/components/table/Table.vue'
import ListItem from 'pages/shop/variant/ListItem.vue'
import {TableColumn, TableFilter} from 'components/table/types'

const {t} = useI18n()
const apiRoot = urls.shopVariants
const columns: TableColumn[] = [
  {name: 'variant', label: t('shop.variant'), field: 'product', align: 'left'},
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
    :title="$t('shop.variants')"
    :columns="columns"
    :api-root="apiRoot"
    :filters="filters"
    :grid="true"
  >

    <template v-slot:grid-item="{props}">
      <ListItem :variant="props.row"/>
    </template>

  </Table>
</template>
