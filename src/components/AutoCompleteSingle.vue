<template>
  <q-select
    v-model="selectedValue"
    :input-debounce="200"
    :label="label"
    :options="items"
    :autocomplete="objUniqueId"
    :loading="loading"
    :error-message="errorMsg"
    :error="Boolean(errorMsg)"
    :rules="rules"
    use-input
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
      <template v-if="typeof scope.opt === 'string'">
        {{ scope.opt }}
      </template>
      <template v-else>
        <template v-if="typeof objRepr === 'function'">
          {{ objRepr(scope.opt) }}
        </template>
        <template v-else-if="typeof objRepr === 'string'">
          {{ scope.opt[objRepr] }}
        </template>
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
import {onMounted, Ref, ref, watch} from 'vue'
import {axiosInstance} from 'src/boot/axios'
import {QSelect, QSelectProps, ValidationRule} from 'quasar'

export interface AutoCompleteMultipleProps {
  modelValue: Nullable<never>
  label: string
  objUniqueId?: string
  objRepr: string | ((obj: unknown) => string)
  api: string
  queryParam: string
  rules?: ValidationRule[]
  errorMsg?: string
  inputDebounce?: number
  pageSize?: number
  pageSizeParam?: string
  allowNull?: boolean
  afterOptionsUpdate?: (opts: Ref<unknown[]>) => void
  reInitializeSignal?: boolean
  getInitData?: (selectedVal: Ref<never | null>) => void
}

const props = withDefaults(defineProps<AutoCompleteMultipleProps>(), {
  objUniqueId: 'id',
  rules: () => ([]),
  errorMsg: '',
  inputDebounce: 200,
  pageSize: 50,
  pageSizeParam: 'page_size',
  allowNull: false,
})

const emits = defineEmits([
  'update',
  'update:modelValue',
  'new-selection',
])

const loading = ref(false)
const items = ref<unknown[]>([])
const selectedValue = ref<never | null>(null)
const nextPage = ref('')
let searchPhrase = ''


watch(selectedValue, (newValue) => {
  let emitVal
  if (newValue === null) {
    emitVal = null
  } else if (typeof newValue === 'object') {
    emitVal = newValue[props.objUniqueId]
  } else {
    emitVal = newValue
  }
  emits('update:modelValue', emitVal)
})
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
        console.log('AutoComplete | onScroll | error:', err)
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
          console.log('AutoComplete | handleSearchInput | error:', err)
        })
        .finally(() => loading.value = false)
    },
    ref => {
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
function getInitialDataToDisplay(modelVal: never) {
  if (!modelVal) return
  axiosInstance.get(props.api + modelVal)
    .then(res => {
      console.log('got data:', res.data)
      selectedValue.value = res.data
    })
}

function handleClear(value: unknown) {
  selectedValue.value = null
}

function getItems() {
  axiosInstance.get(`${props.api}?${props.pageSizeParam}=${props.pageSize}`)
    .then(res => {
      items.value = res.data.items
      if (props.allowNull) {
        const nullObj: { [key: string]: string | null } = {[props.objUniqueId]: null}
        if (typeof props.objRepr === 'string') {
          nullObj[props.objRepr] = '--------'
        }
        items.value.unshift(nullObj)
      }
      if (props.afterOptionsUpdate !== undefined)
        props.afterOptionsUpdate(items)
      nextPage.value = res.data.next
    })
}

onMounted(() => {
// Populate the dropdown list
  getItems()

  // If propHasValue is true, it means we are in an Edit view
  // and should display the existing item
  if (props.modelValue !== null) {
    console.log('props.getInitData:', props.getInitData)
    if (props.getInitData !== undefined)
      props.getInitData(selectedValue)
    else
      getInitialDataToDisplay(props.modelValue)
  }
})
</script>
