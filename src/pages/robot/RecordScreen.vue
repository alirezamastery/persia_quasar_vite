<template>
  <q-card :class="parentCardClass">
    <q-card-section>
      <q-btn color="blue" @click="startRecording">start</q-btn>
    </q-card-section>
    <q-card-section>
      <q-btn color="red" @click="stopRecording">stop</q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import {parentCardClass} from 'src/utils/screen'
import {axiosInstance} from 'boot/axios'

let recorder: Nullable<MediaRecorder>

async function startRecording() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  })
  const audio = await navigator.mediaDevices.getUserMedia({video: false, audio: true})
  const combined = new MediaStream([...stream.getTracks(), ...audio.getTracks()])
  recorder = new MediaRecorder(combined)
  const chunks: Blob[] = []

  recorder.ondataavailable = async (e) => {
    chunks.push(e.data)
    console.log('chunk:', e.data)
    // const blob = new Blob([e.data], {type: e.data.type})

    // const elem = window.document.createElement('a')
    // elem.href = window.URL.createObjectURL(blob)
    // elem.download = `test_chunk_${counter}_${new Date().toISOString()}`
    // counter++
    // document.body.appendChild(elem)
    // elem.click()
    // document.body.removeChild(elem)

    let pos = 0
    const base = 'base64,'
    const fr = new FileReader()
    fr.onload = async function () {
      const result = this.result as string
      console.log('res:', result)
      pos = result.search(base)
      pos = pos + base.length
      const chunk = result.substring(pos)
      try {
        const res = await axiosInstance.post('products/stream-chunk/', {chunk})
        console.log('chunk upload response:', res)
      } catch (err) {
        console.log('chunk upload error', err)
      }
    }
    fr.readAsDataURL(e.data)

    // const formData = new FormData()
    // formData.append('file', e.data)
    // try {
    //   const res = await axiosInstance.post('products/stream-chunk/', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   })
    //   console.log('chunk upload response:', res)
    // } catch (err) {
    //   console.log('chunk upload error', err)
    // }

  }

  recorder.onstop = e => {
    const blob = new Blob(chunks, {type: 'video/mp4'})
    console.log(blob)
    stream.getVideoTracks().forEach(track => track.stop())

    const filename = 'yourCustomFileName.mp4'
    const elem = window.document.createElement('a')
    elem.href = window.URL.createObjectURL(blob)
    elem.download = filename
    document.body.appendChild(elem)
    elem.click()
    document.body.removeChild(elem)
  }

  recorder.start(2000)
}

async function stopRecording() {
  if (recorder)
    recorder.stop()
}
</script>

<style scoped>

</style>
