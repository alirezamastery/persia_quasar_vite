<template>
  <div
    class="q-pa-sm row justify-between shadow-2"
    ref="BannerDesktop"
    id="desktop-logo"
  >
    <div class="col-3">
      <q-img src="~assets/desktop-logo.png" ratio="1" style="border-radius: 0.2rem"/>
    </div>
    <div class="col flex items-center q-px-md">
      <span class="text-h5">
        {{ $t('general.siteHeader') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {useResizeObserver} from '@vueuse/core'

const emits = defineEmits(['height-change'])

const logoElementHeight = ref(0)

watch(logoElementHeight, (newVal) => {
  emits('height-change', newVal + 1)
})

onMounted(() => {
  const el = document.getElementById('desktop-logo')
  useResizeObserver(el, handleResize)

})

function handleResize() {
  const el = document.getElementById('desktop-logo')
  logoElementHeight.value = el!.clientHeight
}
</script>

<style scoped>

</style>
