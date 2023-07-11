<template>
  <div
    :class="className !== undefined ? className : $q.screen.gt.sm ? $q.screen.gt.md ? 'q-ma-xl' : 'q-ma-lg' : 'q-ma-none'"
  >

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
          v-model="searchPhrase"
        />

        <q-table
          :rows="data.items"
          :columns="finalColumns"
          :row-key="itemKey"
          :dense="denseRows"
          :grid="xsGridCard && $q.screen.xs || grid"
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
              <q-td v-if="editRoute && showTools" :props="props" key="tools" auto-width>
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


          <template v-slot:item="props">
            <slot
              :name="'grid-item'"
              :props="props"
              :data="data"
            >
              <div
                class="q-pa-xs q-my-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                :style="props.selected ? 'transform: scale(0.95);' : ''"
              >
                <q-card
                  :class="props.selected ? 'bg-grey-2' : ''"
                  @click="handleXsCardClick(props)"
                  v-ripple
                >
                  <q-list dense>
                    <template v-for="col in props.cols" :key="col.name">
                      <slot
                        :name="`col-xs-${col.name}`"
                        :props="props"
                        :data="data"
                      >
                        <q-item>
                          <q-item-section>
                            <q-item-label>{{ col.label }}</q-item-label>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ props.row[col.field] }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </slot>
                    </template>
                  </q-list>
                </q-card>
              </div>
            </slot>
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
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {cloneDeep, toInteger} from 'lodash'
import Pagination from './Pagination.vue'
import DisplayFilters from './filter/DisplayFilters.vue'
import Header from './ActionBar.vue'
import TableHeader from './TableHeader.vue'
import {axiosInstance} from 'src/boot/axios'
import {QTableSlotItemProps, TableColumn, TableExtraLink, TableFilter} from 'components/table/types'


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
  editRoute?: string
  itemKey?: string
  columns?: TableColumn[]
  addRoute?: Nullable<string>
  extraLinks?: TableExtraLink[]
  denseRows?: boolean
  filters?: TableFilter[]
  hideSearch?: boolean
  searchWord?: string
  pageSize?: number
  showTools?: boolean
  xsGridCard?: boolean
  fetchCallback?: (items: any) => void
  className?: string
  grid?: boolean
}

const props = withDefaults(defineProps<TableProps>(), {
  addRoute: null,
  extraLinks: () => [],
  itemKey: 'id',
  denseRows: true,
  filters: () => [],
  hideSearch: false,
  searchWord: 'search',
  pageSize: 20,
  showTools: true,
  xsGridCard: false,
  grid: false,
})

const {t} = useI18n()
const route = useRoute()
const router = useRouter()

const initComplete = ref(false)
const loading = ref(false)
const pageSize = ref(props.pageSize)
const pageSizeOptions = ref([10, 20, 50, 100])
const page = ref(1)
const otherQueries = ref<{ [key: string]: string }>({})
const otherQueriesStr = ref('')
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
const sideFilterQuery = ref<{ [key: string]: string }>({})

const finalColumns = computed(() => {
  const editCol: TableColumn = {
    name: 'tools',
    label: t('general.tools'),
    field: 'id',
    align: 'center',
  }
  let columns: TableColumn[] = []
  if (props.columns !== undefined) {
    columns = cloneDeep(props.columns)
  }
  if (props.editRoute && props.showTools) {
    columns.push(editCol)
  }
  return columns
})

watch(pageSize, () => {
  if (!initComplete.value) return
  page.value = 1
  fetchData()
})
watch(searchPhrase, () => {
  if (!initComplete.value) return
  console.log('search phrase')
  page.value = 1
  fetchData()
})

function constructQuery(): string {
  let urlParams: { [key: string]: string } = {}
  let apiQuery = ''

  if (page.value) {
    apiQuery += `&page=${page.value}`
    urlParams['page'] = page.value.toString()
  }

  apiQuery += `&page_size=${pageSize.value}`
  urlParams['page_size'] = pageSize.value.toString()

  if (searchPhrase.value) {
    apiQuery += `&${props.searchWord}=${searchPhrase.value}`
    urlParams[props.searchWord] = searchPhrase.value
  }

  Object.assign(urlParams, otherQueries.value)
  for (const [key, value] of Object.entries(otherQueries.value)) {
    apiQuery += `&${key}=${value}`
  }

  console.log('sideFilterQuery:', sideFilterQuery.value)
  console.log('urlParams:', urlParams)
  Object.assign(urlParams, sideFilterQuery.value)
  console.log('sideFilterQuery:', sideFilterQuery.value)
  console.log('urlParams:', urlParams)
  for (const [key, value] of Object.entries(sideFilterQuery.value)) {
    apiQuery += `&${key}=${value}`
  }

  console.log('constructQuery | url params:', urlParams)
  console.log('constructQuery | api query: ', apiQuery)
  router.replace({query: urlParams})
  return apiQuery
}

function handlePageSelect(event: number) {
  console.log('handlePageSelect', event)
  page.value = event
  fetchData()
}

function fetchData() {
  const url = props.apiRoot + '?' + constructQuery()
  loading.value = true
  axiosInstance.get(url)
    .then(res => {
      console.log('%c fetchData | response', 'color: green', res)
      data.value = res.data
      pagination.value.rowsNumber = res.data.count
      if (props.fetchCallback !== undefined) props.fetchCallback(res.data)
    })
    .catch(err => {
      console.error('reFetchData | error', err)
    })
    .finally(() => {
      loading.value = false
      if (!initComplete.value) initComplete.value = true
    })
}

function handleRequest(props: any) {
  console.log('handleRequest', props)
  const {page: tablePage, rowsPerPage, sortBy, descending} = props.pagination
  console.log(tablePage, rowsPerPage, sortBy, descending)
  if (sortBy === null) {
    otherQueriesStr.value = ''
    otherQueries.value = {}
  } else {
    const orderBy = descending ? '-' : ''
    otherQueriesStr.value = 'o=' + orderBy + sortBy
    otherQueries.value['o'] = orderBy + sortBy
  }

  pagination.value.page = tablePage
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending

  page.value = 1
  fetchData()
}

function handleFilterChange(event: Record<string, string>) {
  console.log('handleFilterChange', event)
  sideFilterQuery.value = event
  page.value = 1
  fetchData()
}

function handleXsCardClick(p: QTableSlotItemProps) {
  router.push({name: props.editRoute, params: {[props.itemKey]: p.row[props.itemKey]}})
}

const queryParams = route.query
console.log('----------- Table Start -----------', 'query params:', queryParams)
if (queryParams.hasOwnProperty('page')) page.value = toInteger(queryParams['page'])
if (queryParams.hasOwnProperty('page_size')) pageSize.value = toInteger(queryParams['page_size'])
otherQueries.value = {}
if (queryParams.hasOwnProperty('o')) otherQueries.value['o'] = String(queryParams['o'])
if (queryParams.hasOwnProperty(props.searchWord)) searchPhrase.value = String(queryParams[props.searchWord])

if (props.filters.length === 0)
  fetchData()

</script>
