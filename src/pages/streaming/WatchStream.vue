<template>
  <q-card :class="parentCardClass">
    <q-card-section>
      <video ref="videoPlayer" class="video-js" id="video-player"></video>
    </q-card-section>
  </q-card>
</template>

<script setup>
import 'video.js/dist/video-js.css'
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {parentCardClass} from 'src/utils/screen'
import videojs from 'video.js'

const videoPlayer = ref(null)
let player

onMounted(() => {
  initializePlayer()
})
onBeforeUnmount(() => {
  if (player)
    player.dispose()
})

function initializePlayer() {
  player = videojs('video-player', {
    autoplay: true,
    responsive: true,
    controls: true,
    fluid: true,
    sources: [
      {
        src: 'http://localhost:8100/live/chaikin/index.m3u8',
        type: 'application/x-mpegURL',
      },
    ],
  })
}
</script>

<style scoped>

</style>
