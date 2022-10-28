<template>
  <div
    class="q-pa-sm q-py-md row justify-between shadow-2"
    ref="BannerDesktop"
    id="desktop-logo"
  >
    <div
      id="desktop-logo-bg"
      :class="$q.dark.isActive ? 'desktop-logo-bg-dark' : 'desktop-logo-bg-light'"
    >
    </div>
    <div class="col-4 offset-4">
      <q-img src="~assets/desktop-logo.svg" tstyle="border-radius: 0.2rem"/>
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
#desktop-logo {
  position: relative;
}

#desktop-logo-bg {
  position: absolute;
  top: 5%;
  bottom: 5%;
  left: 5%;
  right: 5%;
  z-index: -1;
  border-radius: 0.3rem;
}

.desktop-logo-bg-dark {
  /*background: radial-gradient(circle, rgb(208, 27, 27) 0%, rgb(49, 10, 10) 100%);*/
  /*background: radial-gradient(circle, rgb(183, 183, 183) 0%, rgb(38, 38, 38) 100%);*/
  background: linear-gradient(190deg, rgba(182,182,182,1) 0%, rgba(83,83,83,1) 100%);
}

.desktop-logo-bg-light {
  background: radial-gradient(circle, rgba(175, 175, 175, 1) 0%, rgba(223, 223, 223, 1) 50%);
}
</style>
