<template>
  <h1>cropper</h1>
  <button @click="handleImageSelect">click me</button>
  <q-dialog v-model="dialogOpen" style="direction: ltr">
    <q-btn @click="$q.lang.set('en')">set</q-btn>
    <Cropper
      ref="cropper"
      :src="cropperImageObjectURL"
      :stencil-component="CircleStencil"
      :stencil-props="{aspectRatio: 1, resizable: true}"
      :canvas="{minHeight: 0, minWidth: 0, maxHeight: 200, maxWidth: 200}"
    />

  </q-dialog>
</template>

<script setup>
import 'vue-advanced-cropper/dist/style.css'
// import 'vue-advanced-cropper/dist/theme.classic.css'

import {ref} from 'vue'
import {Cropper} from 'vue-advanced-cropper'


const validExtensions = ['png', 'jpg', 'jpeg', 'JPG', 'JPEG']
const form = ref({
  first_name: null,
  last_name: null,
  avatar: null,
})
const cropper = ref(null)
const avatarSrc = ref(null)
const hasCroppedImage = ref(false)
const cropperImageObjectURL = ref(null)
// const imageInput = ref(null)
const dialogOpen = ref(false)
const showAvatarMenu = ref(false)
const deletedImage = ref(false)



function handleImageSelect() {
  const imageInput = document.createElement('input')
  imageInput.type = 'file'
  imageInput.addEventListener('change', handleImageSelected)
  imageInput.click()
}

function handleImageSelected(event) {
  console.log('handleImageSelected', event)
  const file = event.target.files[0]
  const extension = file.name.split('.').pop()
  if (!validExtensions.includes(extension)) {
    q.notify({
      type: 'warning',
      message: t('general.snack.fileFormatError'),
      position: 'top',
      actions: [
        {label: '', icon: 'close', color: 'black', round: true},
      ],
    })
    return
  }
  cropperImageObjectURL.value = window.URL.createObjectURL(file)
  dialogOpen.value = true
  console.log('imgURL', cropperImageObjectURL.value)
}

function handleCropperSubmit() {
  dialogOpen.value = false
  const {canvas} = cropper.value.getResult()
  avatarSrc.value = canvas.toDataURL()
  hasCroppedImage.value = true
}

</script>
