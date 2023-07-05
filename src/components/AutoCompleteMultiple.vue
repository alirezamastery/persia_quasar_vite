<template>
  <q-select
    v-model="selectedValue"
    :input-debounce="inputDebounce"
    :label="label"
    :options="items"
    :autocomplete="objUniqueId"
    :loading="loading"
    :error-message="errorMsg"
    :error="Boolean(errorMsg)"
    :rules="rules"
    multiple
    use-input
    clearable
    use-chips
    @virtual-scroll="onScroll"
    @filter="handleSearchInput"
    @clear="handleClear"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label v-if="typeof scope.opt === 'string' || typeof scope.opt === 'number'">
            {{ scope.opt }}
          </q-item-label>
          <q-item-label v-else>
            <template v-if="typeof objRepr === 'function'">
              {{ objRepr(scope.opt) }}
            </template>
            <template v-else-if="typeof objRepr === 'string'">
              {{ scope.opt[objRepr] }}
            </template>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:selected-item="scope">
      <template v-if="typeof scope.opt === 'string' || typeof scope.opt === 'number'">
        {{ scope.opt }}
      </template>
      <template v-else>
        <q-chip
          removable
          @remove="scope.removeAtIndex(scope.index)"
          :tabindex="scope.tabindex"
        >
          <template v-if="typeof objRepr === 'function'">
            {{ objRepr(scope.opt) }}
          </template>
          <template v-else-if="typeof objRepr === 'string'">
            {{ scope.opt[objRepr] }}
          </template>
        </q-chip>
      </template>
    </template>

    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ $t('general.noItemsFound') }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import {Ref, ref, watch} from 'vue'
import {axiosInstance} from 'src/boot/axios'
import {QSelect, QSelectProps, ValidationRule} from 'quasar'

export interface AutoCompleteMultipleProps {
  modelValue: Array<number | string>
  objUniqueId: string
  label: string
  api: string
  queryParam: string
  listQueryParam: string
  listApi: string
  objRepr: string | ((obj: any) => string)
  isRequired?: boolean
  rules?: ValidationRule[]
  errorMsg?: string
  inputDebounce?: number
  pageSize?: number
  pageSizeParam?: string
  afterOptionsUpdate?: (opts: Ref<unknown[]>) => void
  reInitializeSignal?: boolean
}

const props = withDefaults(defineProps<AutoCompleteMultipleProps>(), {
  isRequired: false,
  rules: () => ([]),
  errorMsg: '',
  inputDebounce: 200,
  pageSize: 50,
  pageSizeParam: 'page_size',
})

const emits = defineEmits([
  'update',
  'update:modelValue',
  'new-selection',
  'clear',
])

const loading = ref(false)
const items = ref<any[]>([])
const selectedValue = ref<any[]>([])
const nextPage = ref('')
let searchPhrase = ''


watch(selectedValue, (newValue) => {
  const emitVal = newValue.map(item => {
    if (typeof item === 'string' || typeof item === 'number')
      return item
    return item[props.objUniqueId]
  })
  emits('update:modelValue', emitVal)
}, {deep: true})
watch(() => props.reInitializeSignal, () => {
  console.log('init again')
  getItems()
})

interface VirtualScrollDetails {
  index: number
  from: number
  to: number
  direction: 'increase' | 'decrease'
  ref: QSelect
}

function onScroll({index, to, ref}: VirtualScrollDetails) {
  const lastIndex = items.value.length - 1

  if (loading.value === false && !!nextPage.value && index === lastIndex) {
    loading.value = true

    axiosInstance.get(nextPage.value)
      .then(res => {
        items.value.push(...res.data.items)
        if (props.afterOptionsUpdate !== undefined)
          props.afterOptionsUpdate(items)
        nextPage.value = res.data.next
        ref.refresh(-1)
      })
      .catch(err => {
        console.log('AutoCompleteMultiple | onScroll | error:', err)
      })
      .finally(() => loading.value = false)
  }
}

type OnFilterArguments = Parameters<Exclude<QSelectProps['onFilter'], undefined>>

function handleSearchInput(
  val: OnFilterArguments[0],
  update: OnFilterArguments[1],
  abort: OnFilterArguments[2],
) {
  update(
    () => {
      if (searchPhrase === val) return
      searchPhrase = val
      loading.value = true
      const url = `${props.api}?${props.queryParam}=${val}&${props.pageSizeParam}=${props.pageSize}`
      axiosInstance.get(url)
        .then(res => {
          items.value = res.data.items
          nextPage.value = res.data.next
        })
        .catch(err => {
          console.log('AutoCompleteMultiple | handleSearchInput | error:', err)
        })
        .finally(() => loading.value = false)
    },
    (ref: QSelect) => {
      // ref is the q-select itself. you can make changes to the q-select in this function
      if (val !== '' && ref.options && ref.options.length > 0) {
        ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
        ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
      }
    },
  )
}

/**
 * if we are in an Edit view (we have primary key(s)), get the data from
 * the server to display in the input field as chips
 */
function getInitialDataToDisplay(modelVal: any[]) {
  let query = '?'
  for (const id of modelVal) {
    query += `&${props.listQueryParam}=${id}`
  }
  const url = props.api + props.listApi + query
  axiosInstance.get(url)
    .then(res => {
      selectedValue.value = res.data
    })
}

function handleClear(value: any) {
  selectedValue.value = []
}


// If propHasValue is true, it means we are in an Edit view and should display the existing item
if (props.modelValue.length > 0)
  getInitialDataToDisplay(props.modelValue)

function getItems() {
  axiosInstance.get(`${props.api}?${props.pageSizeParam}=${props.pageSize}`)
    .then(res => {
      items.value = res.data.items
      nextPage.value = res.data.next
      if (props.afterOptionsUpdate !== undefined)
        props.afterOptionsUpdate(items)
    })
}

// Populate the dropdown list
getItems()
</script>
