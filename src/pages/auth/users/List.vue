<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import TableDjango from 'components/table/Table.vue'
import urls from 'src/urls'
import RouteNames from 'src/router/route-names'
import {TableColumn, TableFilter} from 'components/table/types'

const {t} = useI18n()
const apiRoot = urls.users
const editRoute = RouteNames.USER_EDIT
const addRoute = RouteNames.USER_ADD
const columns: TableColumn[] = [
  {name: 'mobile', label: t('general.mobile'), field: 'mobile', align: 'left'},
  {name: 'firstName', label: t('general.firstName'), field: '', align: 'center'},
  {name: 'lastName', label: t('general.lastName'), field: '', align: 'center'},
  {name: 'isActive', label: t('general.isActive'), field: 'is_active', align: 'center'},
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
  <TableDjango
    :title="$t('general.users')"
    :columns="columns"
    :api-root="apiRoot"
    :add-route="addRoute"
    :filters="filters"
    search-word="q"
  >

    <template v-slot:col-mobile="{ props }">
      <q-btn
        :to="{name: editRoute, params: {id: props.row.id}}"
        color="light-blue"
        class="text-persian-mono"
        style="letter-spacing: 1px"
        dense
        flat
      >
        {{ props.row.mobile }}
      </q-btn>
    </template>

    <template v-slot:col-firstName="{ props }">
      {{ props.row.profile.first_name }}
    </template>

    <template v-slot:col-lastName="{ props }">
      {{ props.row.profile.last_name }}
    </template>

    <template v-slot:col-isActive="{ props }">
      <q-icon v-if="props.row.is_active" right small color="green" name="mdi-checkbox-marked-circle"/>
      <q-icon v-else right small color="red" name="mdi-cancel"/>
    </template>

  </TableDjango>
</template>

