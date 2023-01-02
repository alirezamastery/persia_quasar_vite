<template>
  <q-card
    :class="parentCardClass"
    id="sales-data-card"
  >
    <q-card-section
      class="row"
      id="actual-product-selection"
    >
      <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
        <AutoCompleteMultiple
          v-model="actualProducts"
          :api="urls.actualProducts"
          list-api="get-by-id-list/"
          obj-unique-id="id"
          obj-repr="title"
          query-param="search"
          list-query-param="ids[]"
          :label="$t('products.actualProducts')"
          outlined
          options-dense
          :max-values="4"
          :disable="isLoading"
        />
      </div>
    </q-card-section>
    <div
      :style="chartContainerStyle"
      id="chart-container"
    >
      <canvas id="chart-canvas" ref="chartCanvas"></canvas>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import {ref, watch, onMounted} from 'vue'
import Chart from 'chart.js/auto'
import {parentCardClass} from 'src/utils/screen'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import AutoCompleteMultiple from 'components/AutoCompleteMultiple.vue'
import {actualProductSalesResponseToDomain} from 'src/types/converter/accounting/sales'
import {ActualProductSalesDomain} from 'src/types/domain/accounting/sales'
import {ActualProductSalesResponse} from 'src/types/network/response/accounting/sales'


const chartCanvas = ref<HTMLCanvasElement>()
const chartContainerStyle = ref('')
const actualProducts = ref<number[]>([])
const isLoading = ref(false)

let chart: Nullable<Chart> = null
let newData: ActualProductSalesDomain | null = null
let salesDataMap: {
  [key: number]: {
    label: string
    data: number[]
    borderColor: string
    tension: number
    backgroundColor: string
    pointStyle: string
    pointRadius: number
    pointHoverRadius: number
  }
} = {}
const axisColors = ['rgb(75, 192, 192)', 'rgb(213,53,53)', 'rgb(19,182,64)', 'rgb(206,178,43)']
let selectedColors: string[] = []

watch(actualProducts, async (newVal, oldValue) => {
  if (newVal.length === 0) {
    clearChart()
    return
  }

  const diffAdd = newVal.filter(id => !oldValue.includes(id))
  if (diffAdd.length > 0) {
    await getSalesData(diffAdd[0])
  } else {
    const diffRemove = oldValue.filter(id => !newVal.includes(id))
    if (diffRemove.length === 0) return
    const apId = diffRemove[0]
    const clr = salesDataMap[apId].borderColor
    freeColor(clr)
    delete salesDataMap[apId]
    updateChartData()
  }
})

onMounted(() => {
  createChart()
  calculateChartHeight()
})

async function getSalesData(apId: number) {
  isLoading.value = true
  const url = urls.salesCount
  const queryParams = {ap_id: apId}
  const res = await axiosInstance.get<ActualProductSalesResponse>(url, {params: queryParams})
  newData = actualProductSalesResponseToDomain(res.data)
  const color = selectColor()
  salesDataMap[apId] = {
    label: newData.actualProduct.title,
    data: newData.sales.map(d => d.count),
    borderColor: color,
    tension: 0.1,
    pointStyle: 'circle',
    backgroundColor: color.replace(')', ', 0.5)').replace('rgb', 'rgba'),
    pointRadius: 5,
    pointHoverRadius: 15,
  }
  updateChartData()
  isLoading.value = false
}


function updateChartData() {
  if (chart === null) throw Error('chart is null!')
  if (chart.data.labels?.length === 0) {
    chart.data.labels = newData!.sales.map(item => {
      const date = new Date(item.monthStart)
      return new Intl.DateTimeFormat('fa-IR', {year: 'numeric', month: 'long'}).format(date)
    })
  }
  chart.data.datasets = Object.values(salesDataMap)
  chart.update()
}

function clearChart() {
  console.log('clear chart')
  salesDataMap = {}
  selectedColors = []
  if (chart === null) return
  chart.data.labels = []
  chart.data.datasets = []
  chart.update()
}

function createChart() {
  console.log('create chart')
  const ctx = chartCanvas.value!.getContext('2d')
  if (chart !== null) chart.destroy()
  chart = new Chart(ctx!, {
    type: 'line',
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          stacked: false,
          ticks: {
            callback(tickValue): string {
              if (typeof tickValue === 'number' && Number.isInteger(tickValue))
                return tickValue.toString()
              const num = Number(tickValue)
              if (Number.isInteger(num))
                return tickValue as string
              return ''
            },
          },
        },
      },
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  })
}

// utils:
function randomRGB() {
  const o = Math.round, r = Math.random, s = 255
  return `rgb(${o(r() * s)},${o(r() * s)},${o(r() * s)})`
}

function selectColor(): string {
  const availableColors = axisColors.filter(clr => !selectedColors.includes(clr))
  const color = availableColors[Math.floor(Math.random() * availableColors.length)]
  selectedColors.push(color)
  return color
}

function freeColor(clr: string) {
  const index = selectedColors.indexOf(clr)
  if (index > -1)
    selectedColors.splice(index, 1)
}

function calculateChartHeight() {
  const header = document.getElementById('layout-header')
  const headerH = parseInt(getComputedStyle(header!).height)

  const card = document.getElementById('sales-data-card')
  const cardStyle = getComputedStyle(card!)
  const cardMarginTop = parseInt(cardStyle.marginTop)
  const cardMarginBottom = parseInt(cardStyle.marginBottom)
  const cardPaddingTop = parseInt(cardStyle.paddingTop)
  const cardPaddingBottom = parseInt(cardStyle.paddingBottom)

  const yearSelection = document.getElementById('actual-product-selection')
  const yearSelectionH = parseInt(getComputedStyle(yearSelection!).height)

  const reservedHeight = headerH
    + cardMarginTop
    + cardMarginBottom
    + cardPaddingTop
    + cardPaddingBottom
    + yearSelectionH

  chartContainerStyle.value = `height: calc(100vh - ${reservedHeight}px)`
}
</script>

<style scoped>
#chart-container {
  position: relative;
  width: 100%;
}
</style>
