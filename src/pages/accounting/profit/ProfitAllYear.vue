<template>
  <q-card :class="$q.screen.gt.sm ? 'q-ma-md q-pa-sm' : 'no-shadow no-border-radius'">
    <q-card-section>
      <q-form class="q-my-md">
        <div class="row q-col-gutter-md items-center justify-center">
          <q-btn
            color="primary"
            flat
            round
            icon="add"
            @click="jYear++"
          />
          <q-input
            v-model="jYear"
            :label="$t('general.year')"
            type="text"
            filled
            class="col-xs-6"
            input-style="text-align: center;"
            style="max-width: 200px;"
          />
          <q-btn
            color="primary"
            flat
            round
            icon="remove"
            @click="jYear--"
          />
        </div>
      </q-form>

    </q-card-section>
    <div id="chart-container">
      <canvas id="chart-canvas" ref="chartCanvas"></canvas>
    </div>
  </q-card>
</template>

<script setup>
import {ref, watch, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import Chart from 'chart.js/auto'
import moment from 'moment-jalaali'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'


const {t} = useI18n()
const persianMonth = ('فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند').split('_')

const profits = ref([1, 2])
const jYear = ref(moment().format('jYYYY'))
const chartCanvas = ref(null)
const isLoading = ref(false)
let profitChart = null

watch(jYear, async () => await getProfitData())

onMounted(async () => {
  profitChart = document.getElementById('chart-canvas')
  await createChart()
  await getProfitData()
})

async function getProfitData() {
  isLoading.value = true
  const res = await axiosInstance.get(urls.profitYear + `?j_year=${jYear.value}`)
  console.log('res', res)
  profits.value = res.data.data.profits
  console.log('profits:', profits.value)
  profitChart.data = {
    labels: persianMonth,
    datasets: [{
      label: false,
      title: `${t('general.year')} ${jYear.value}`,
      data: profits.value,
      fill: false,
      backgroundColor: getBG(),
      barPercentage: 0.5,
    }],
  }
  profitChart.update()
}

function getBG() {
  const colors = []
  for (const val of profits.value) {
    if (val > 0) colors.push('rgba(75, 192, 192, 0.5)')
    else colors.push('rgba(255, 99, 132, 0.5)')
  }
  return colors
}

async function createChart() {
  console.log('create chart')
  const ctx = chartCanvas.value.getContext('2d')
  // if (profitChart.value !== null)
  //   profitChart.value.destroy()
  profitChart = new Chart(ctx, {
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
        title: {
          display: true,
          text: `${t('general.year')} ${jYear.value}`,
          font: {
            family: '\'Samim\' , \'Robot-Regular\'',
          },
        },
        legend: {
          display: false,
        },
      },
    },
  })
  isLoading.value = false
}

</script>

<style scoped lang="scss">
#chart-container {
  position: relative;
  width: 100%;
  height: 70vh;
}
</style>
