<template>
  <q-card
    :class="$q.screen.gt.sm ? 'q-ma-md q-pa-sm' : 'no-shadow no-border-radius'"
    id="all-year-profit-card"
  >
    <q-card-section
      class="row q-gutter-sm justify-center"
      id="year-selection"
    >
      <div class="col-1 flex justify-end items-center">
        <q-btn
          color="primary"
          flat
          round
          icon="add"
          @click="jYear++"
        />
      </div>
      <div class="col-xs-3 col-sm-2 col-md-1">
        <q-input
          v-model="jYear"
          :label="$t('general.year')"
          type="text"
          input-style="text-align: center;"
          readonly
          outlined
        />
      </div>
      <div class="col-1 flex justify-start items-center">
        <q-btn
          color="primary"
          flat
          round
          icon="remove"
          @click="jYear--"
        />
      </div>
    </q-card-section>
    <div id="chart-container" :style="chartContainerStyle">
      <canvas id="chart-canvas" ref="chartCanvas"></canvas>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import {ref, watch, onMounted} from 'vue'
import Chart from 'chart.js/auto'
import moment from 'moment-jalaali'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {persianMonth} from 'src/utils'
import {YearProfitResponse} from 'src/types/network/response/accounting/year-profit'


const jYear = ref(moment().format('jYYYY'))
const chartCanvas = ref<HTMLCanvasElement>()
const chartContainerStyle = ref('')
let profitChart: Nullable<Chart> = null

watch(jYear, async () => await getProfitData())

onMounted(async () => {
  await createChart()
  await getProfitData()
  calculateChatHeight()
})

async function getProfitData() {
  const url = urls.profitYear + `?j_year=${jYear.value}`
  const res = await axiosInstance.get<YearProfitResponse>(url)
  console.log('profit data', res)
  updateChartData(res.data.profits)
}

async function createChart() {
  console.log('create chart')
  const ctx = chartCanvas.value!.getContext('2d')
  if (profitChart !== null) profitChart.destroy()
  profitChart = new Chart(ctx!, {
    type: 'bar',
    data: {
      labels: persianMonth,
      datasets: [],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  })
}

function updateChartData(profits: number[]) {
  if (profitChart === null) throw Error('chart is null!')
  profitChart.data = {
    labels: persianMonth,
    datasets: [
      {
        data: profits,
        fill: false,
        backgroundColor: getBG(profits),
        barPercentage: 0.5,
      },
    ],
  }
  profitChart.update()
}

function getBG(profits: number[]): string[] {
  const colors = []
  for (const val of profits) {
    if (val > 0) colors.push('rgba(75, 192, 192, 0.5)')
    else colors.push('rgba(255, 99, 132, 0.5)')
  }
  return colors
}

function calculateChatHeight() {
  const header = document.getElementById('layout-header')
  const headerH = parseInt(getComputedStyle(header!).height)

  const card = document.getElementById('all-year-profit-card')
  const cardStyle = getComputedStyle(card!)
  const cardMarginTop = parseInt(cardStyle.marginTop)
  const cardMarginBottom = parseInt(cardStyle.marginBottom)
  const cardPaddingTop = parseInt(cardStyle.paddingTop)
  const cardPaddingBottom = parseInt(cardStyle.paddingBottom)

  const yearSelection = document.getElementById('year-selection')
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

<style scoped lang="scss">
#chart-container {
  position: relative;
  width: 100%;
}
</style>
