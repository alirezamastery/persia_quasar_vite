<template>
  <q-select
    v-model="selectedValue"
    :input-debounce="200"
    :label="label"
    :options="items"
    :multiple="selectMultiple"
    :autocomplete="objUniqueId"
    :loading="loading"
    :error-message="errors"
    :error="errors?.length > 0"
    :rules="rules"
    use-input
    clearable
    use-chips
    @virtual-scroll="onScroll"
    @filter="handleSearchInput"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ scope.opt[objReprField] }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:selected-item="scope">
      <template v-if="typeof scope.opt === 'string'">
        {{ scope.opt }}
      </template>
      <template v-else>
        <template v-if="selectMultiple">
          <q-chip
            removable
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
          >
            {{ scope.opt[objReprField] }}
          </q-chip>
        </template>
        <template v-else>
          {{ scope.opt[objReprField] }}
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

<script setup>
import {ref, watch} from 'vue'
import {axiosInstance} from 'src/boot/axios'

const props = defineProps({
  modelValue: {type: [Number, Array, String]},
  name: String,
  objUniqueId: {type: String, default: 'id'},
  objReprField: {type: String, default: 'title'},
  label: String,
  api: String,
  queryParam: String,
  selectMultiple: {type: Boolean, default: false},
  isRequired: {type: Boolean, default: false},
  rules: {type: Array, required: false, default: () => ([])},
  errors: {type: String, required: false, default: ''},
  listQueryParam: {type: String, required: false, default: 'ids[]'},
  listApi: {type: String, required: false, default: 'get-by-dkpc-list/'},
})

const emits = defineEmits(['update', 'update:modelValue', 'new-selection'])

const loading = ref(false)
const items = ref([])
const selectedValue = ref(null)
const nextPage = ref('')
let searchPhrase = ''

/**
 * it might be necessary to split this into 2 components if the
 * logic for single and multiple selection gets more complicated
 */
watch(selectedValue, (newValue) => {
  console.log('AutoComplete | watch selectedValue | new selected value:', newValue)
  let emitVal
  if (Array.isArray(selectedValue.value)) {
    emitVal = newValue.map(item => item[props.objUniqueId])
  } else if (newValue !== null && typeof newValue === 'object') {
    emitVal = newValue[props.objUniqueId]
  } else {
    emitVal = newValue
  }
  console.log('AutoComplete | watch selectedValue | emit value:', emitVal)
  emits('update:modelValue', emitVal)
})


function onScroll({index, to, ref}) {
  const lastIndex = items.value.length - 1
  console.log('AutoComplete | onScroll | came into view:', index)
  console.log('AutoComplete | onScroll | last rendered:', to)
  console.log('AutoComplete | onScroll | last index:', lastIndex)

  if (loading.value === false && !!nextPage.value && index === lastIndex) {
    console.log('AutoComplete | onScroll | getting data')

    loading.value = true

    axiosInstance.get(nextPage.value)
      .then(res => {
        console.log('AutoComplete | onScroll | response:', res)
        items.value.push(...res.data.items)
        console.log('AutoComplete | onScroll | items value:', items.value)
        console.log('AutoComplete | onScroll | items length:', items.value.length)
        nextPage.value = res.data.next
        ref.refresh(-1)
      })
      .catch(err => {
        console.log('AutoComplete | onScroll | error:', err)
      })
      .finally(() => loading.value = false)
  }
}

function handleSearchInput(val, update, abort) {
  console.log('handleSearchInput | phrase:', val)
  update(
    () => {
      if (searchPhrase === val) return
      searchPhrase = val
      loading.value = true
      const url = `${props.api}?${props.queryParam}=${val}`
      axiosInstance.get(url)
        .then(res => {
          console.log('AutoComplete | handleSearchInput | response:', res)
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
      if (val !== '' && ref.options.length > 0) {
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
function getInitialDataToDisplay(modelVal) {
  console.log('AutoComplete | getInitialDataToDisplay | modelVal', modelVal)
  if (!modelVal) return
  if (typeof modelVal === 'string' || typeof modelVal === 'number') {
    axiosInstance.get(props.api + modelVal)
      .then(res => {
        console.log('AutoComplete | getInitialDataToDisplay | got initial data:', res)
        selectedValue.value = res.data
      })
  } else {
    let query = '?'
    for (const id of modelVal) {
      query += `&${props.listQueryParam}=${id}`
    }
    const url = props.api + props.listApi + query
    axiosInstance.get(url)
      .then(res => {
        console.log('AutoComplete | getInitialDataToDisplay | got initial data [list]:', res)
        selectedValue.value = res.data
      })
  }
}


console.log('AutoComplete | ---------------------------------------------------')
console.log('AutoComplete | start with modelValue from props:', props.modelValue)
const propHasValue = (Array.isArray(props.modelValue) && props.modelValue.length > 0)
  || (typeof props.modelValue === 'string' && props.modelValue !== '')
  || typeof props.modelValue === 'number'
// If propHasValue is true, it means we are in an Edit view and should display the existing item
if (propHasValue)
  getInitialDataToDisplay(props.modelValue)

// Populate the dropdown list
axiosInstance.get(props.api)
  .then(res => {
    items.value = res.data.items
    nextPage.value = res.data.next
  })
</script>
