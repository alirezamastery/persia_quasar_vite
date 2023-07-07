<template>
  <div :class="$q.screen.gt.sm ? 'q-ma-lg' : 'q-ma-none'">

    <Header
      :title="title"
      :add-route="addRoute"
      :extra-links="extraLinks"
    />

    <div class="row no-wrap-md">

      <q-card
        class="col-xs-12 col-md"
        :class="$q.screen.gt.sm ? '' : 'border-radius-inherit no-shadow'"
      >

        <TableHeader
          v-if="!hideSearch"
          @search-input="searchPhrase = $event"
        />

        <q-table
          :rows="data.items"
          :columns="finalColumns"
          :row-key="itemKey"
          :dense="denseRows"
          v-model:pagination="pagination"
          :filter="filter"
          hide-bottom
          flat
          @request="handleRequest"
        >

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td
                v-for="column in columns"
                :key="column.name"
                :props="props"
                :auto-width="column.autoWidth"
              >
                <slot
                  :name="`col-${column.name}`"
                  :props="props"
                  :data="data"
                >
                  {{ props.row[column.field] }}
                </slot>
              </q-td>

              <!-- "key" should be set for the cell to show -->
              <q-td v-if="editRoute" :props="props" key="tools" auto-width>
                <slot
                  :name="`col-tools`"
                  :props="props"
                  :data="data"
                >
                  <q-btn
                    :to="{name: editRoute, params: {id: props.row.id}}"
                    icon="edit"
                    :size="denseRows ? 'sm' : 'md'"
                    flat
                    round
                  />
                </slot>
              </q-td>
            </q-tr>
          </template>

          <template v-slot:no-data>
            {{ $t('general.noItemsFound') }}
          </template>

        </q-table>

        <q-separator/>

        <Pagination
          :page="page"
          :page-size="pageSize"
          :page-size-options="pageSizeOptions"
          :page-count="data.page_count"
          :total-count="data.count"
          :table-loading="loading"
          @page-select="handlePageSelect"
          @page-size-select="pageSize = $event"
        />
      </q-card>

      <DisplayFilters
        v-if="filters.length > 0"
        :filters="filters"
        @filter-change="handleFilterChange"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {cloneDeep} from 'lodash'
import Pagination from './Pagination.vue'
import DisplayFilters from './filter/DisplayFilters.vue'
import Header from './ActionBar.vue'
import TableHeader from './TableHeader.vue'
import {axiosInstance} from 'src/boot/axios'
import {TableColumn, TableExtraLink, TableFilter} from 'components/table/types'

export interface TablePagination {
  rowsNumber: number
  page?: number
  rowsPerPage?: number
  sortBy?: string
  descending?: boolean
}

export interface TableProps {
  title: string
  apiRoot: string
  columns?: TableColumn[]
  editRoute?: Nullable<string>
  addRoute?: Nullable<string>
  extraLinks?: TableExtraLink[]
  itemKey?: string
  denseRows?: boolean
  filters?: TableFilter[]
  hideSearch?: boolean
  searchWord?: string
}

const props = withDefaults(defineProps<TableProps>(), {
  editRoute: null,
  addRoute: null,
  extraLinks: () => [],
  itemKey: 'id',
  denseRows: true,
  filters: () => [],
  hideSearch: false,
  searchWord: 'search',
})

const {t} = useI18n()

const loading = ref(false)
const pageSize = ref(20)
const pageSizeOptions = ref([10, 20, 50, 100])
const page = ref(1)
const queries = ref('')
const filter = ref('')
const pagination = ref<TablePagination>({
  rowsNumber: 10,
})
const data = ref({
  items: [],
  count: 0,
  page_count: 0,
  next: null,
  previous: null,
})
const searchPhrase = ref('')
const sideFilterQuery = ref('')

const finalColumns = computed(() => {
  const editCol: TableColumn = {
    name: 'tools',
    label: t('general.tools'),
    field: 'id',
    align: 'center',
  }
  if (props.columns !== undefined) {
    const columns = cloneDeep(props.columns)
    if (props.editRoute) {
      columns.push(editCol)
    }
    return columns
  }
  return [editCol]
})

watch(pageSize, () => {
  page.value = 1
  fetchData()
})
watch(searchPhrase, () => {
  console.log('search phrase')
  page.value = 1
  fetchData()
})

function constructQuery() {
  let query = `?${queries.value}&page_size=${pageSize.value}`
  if (searchPhrase.value)
    query += `&${props.searchWord}=${searchPhrase.value}`
  if (page.value)
    query += `&page=${page.value}`
  if (sideFilterQuery.value)
    query += sideFilterQuery.value
  console.log('constructQuery', query)
  return query
}

function handlePageSelect(event: number) {
  console.log('handlePageSelect', event)
  page.value = event
  fetchData()
}

function fetchData() {
  const url = props.apiRoot + constructQuery()
  loading.value = true
  axiosInstance.get(url)
    .then(res => {
      console.log('fetchData | response', res)
      data.value = res.data
      pagination.value.rowsNumber = res.data.count
    })
    .catch(err => {
      console.log('reFetchData | error', err)
    })
    .finally(() => loading.value = false)
}

function handleRequest(props: any) {
  console.log('handleRequest', props)
  const {page: tablePage, rowsPerPage, sortBy, descending} = props.pagination
  console.log(tablePage, rowsPerPage, sortBy, descending)
  if (sortBy === null) {
    queries.value = ''
  } else {
    const order = descending ? '-' : ''
    queries.value = 'o=' + order + sortBy
  }

  pagination.value.page = tablePage
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending

  page.value = 1
  fetchData()
}

function handleFilterChange(event: string) {
  console.log('handleFilterChange', event)
  sideFilterQuery.value = event
  page.value = 1
  fetchData()
}

fetchData()

</script>
