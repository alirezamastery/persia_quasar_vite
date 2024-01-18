<template>
  <TableDjango
    :title="$t('general.groups')"
    :columns="columns"
    :api-root="apiRoot"
    :add-route="addRoute"
  >

    <template v-slot:col-name="{ props }">
      <q-btn :to="{name: editRoute, params: {id: props.row.id}}" color="light-blue" dense flat>
        {{ props.row.name }}
      </q-btn>
    </template>

  </TableDjango>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import TableDjango from 'components/table/Table.vue'
import urls from 'src/urls'
import RouteNames from 'src/router/route-names'
import {TableColumn} from 'components/table/types'

const {t} = useI18n()
const apiRoot = urls.authGroups
const editRoute = RouteNames.AUTH_GROUP_EDIT
const addRoute = RouteNames.AUTH_GROUP_ADD
const columns:TableColumn[] = [
  {name: 'name', label: t('general.name'), field: 'name', align: 'left'},
]
</script>
