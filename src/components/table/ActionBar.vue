<template>
  <q-toolbar
    class="row q-pa-md q-mb-sm flex items-center justify-between"
  >
    <div class="col">
      <span class="text-h5">{{ title }}</span>
    </div>
    <template
      v-for="(link,i) in extraLinks"
      :key="i"
    >
      <q-btn
        color="primary"
        class="q-mr-sm"
        @click="$router.push({name: link.routeName})"
      >
        {{ link.title }}
      </q-btn>
    </template>
    <q-space/>
    <q-btn
      v-if="addRoute"
      color="primary"
      class="q-mr-sm"
      @click="$router.push({name: addRoute})"
    >
      {{ $t('general.create') }}
    </q-btn>
  </q-toolbar>
</template>

<script setup lang="ts">
import {TableExtraLink} from 'components/table/types'

export interface TableActionBarProps {
  title: Nullable<string>
  addRoute: Nullable<string>
  extraLinks: TableExtraLink[]
}

withDefaults(defineProps<TableActionBarProps>(), {
  title: '',
  addRoute: null,
  extraLinks: () => ([]),
})
</script>
