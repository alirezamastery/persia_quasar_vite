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

function handleCropperCancel() {

}

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


<!--<style scoped lang="scss">-->
<!--.vue-advanced-cropper {-->
<!--  text-align: center;-->
<!--  position: relative;-->
<!--  user-select: none;-->
<!--  max-height: 100%;-->
<!--  max-width: 100%;-->
<!--  direction: ltr;-->
<!--}-->
<!--.vue-advanced-cropper__stretcher {-->
<!--  pointer-events: none;-->
<!--  position: relative;-->
<!--  max-width: 100%;-->
<!--  max-height: 100%;-->
<!--}-->
<!--.vue-advanced-cropper__image {-->
<!--  user-select: none;-->
<!--  position: absolute;-->
<!--  transform-origin: center;-->
<!--  max-width: none !important;-->
<!--}-->
<!--.vue-advanced-cropper__background, .vue-advanced-cropper__foreground {-->
<!--  opacity: 1;-->
<!--  background: black;-->
<!--  transform: translate(-50%, -50%);-->
<!--  position: absolute;-->
<!--  top: 50%;-->
<!--  left: 50%;-->
<!--}-->
<!--.vue-advanced-cropper__foreground {-->
<!--  opacity: 0.5;-->
<!--}-->
<!--.vue-advanced-cropper__boundaries {-->
<!--  opacity: 1;-->
<!--  transform: translate(-50%, -50%);-->
<!--  position: absolute;-->
<!--  left: 50%;-->
<!--  top: 50%;-->
<!--}-->
<!--.vue-advanced-cropper__cropper-wrapper {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->
<!--.vue-advanced-cropper__image-wrapper {-->
<!--  overflow: hidden;-->
<!--  position: absolute;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->
<!--.vue-advanced-cropper__stencil-wrapper {-->
<!--  position: absolute;-->
<!--}-->

<!--.vue-draggable-area {-->
<!--  position: relative;-->
<!--}-->

<!--.vue-line-wrapper {-->
<!--  background: none;-->
<!--  position: absolute;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--}-->
<!--.vue-line-wrapper&#45;&#45;north, .vue-line-wrapper&#45;&#45;south {-->
<!--  height: 12px;-->
<!--  width: 100%;-->
<!--  left: 0;-->
<!--  transform: translateY(-50%);-->
<!--}-->
<!--.vue-line-wrapper&#45;&#45;north {-->
<!--  top: 0;-->
<!--  cursor: n-resize;-->
<!--}-->
<!--.vue-line-wrapper&#45;&#45;south {-->
<!--  top: 100%;-->
<!--  cursor: s-resize;-->
<!--}-->
<!--.vue-line-wrapper&#45;&#45;east, .vue-line-wrapper&#45;&#45;west {-->
<!--  width: 12px;-->
<!--  height: 100%;-->
<!--  transform: translateX(-50%);-->
<!--  top: 0;-->
<!--}-->
<!--.vue-line-wrapper&#45;&#45;east {-->
<!--  left: 100%;-->
<!--  cursor: e-resize;-->
<!--}-->
<!--.vue-line-wrapper&#45;&#45;west {-->
<!--  left: 0;-->
<!--  cursor: w-resize;-->
<!--}-->
<!--.vue-line-wrapper&#45;&#45;disabled {-->
<!--  cursor: auto;-->
<!--}-->

<!--.vue-handler-wrapper {-->
<!--  position: absolute;-->
<!--  transform: translate(-50%, -50%);-->
<!--  width: 30px;-->
<!--  height: 30px;-->
<!--}-->
<!--.vue-handler-wrapper__draggable {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--}-->
<!--.vue-handler-wrapper&#45;&#45;west-north {-->
<!--  cursor: nw-resize;-->
<!--}-->
<!--.vue-handler-wrapper&#45;&#45;north {-->
<!--  cursor: n-resize;-->
<!--}-->
<!--.vue-handler-wrapper&#45;&#45;east-north {-->
<!--  cursor: ne-resize;-->
<!--}-->
<!--.vue-handler-wrapper&#45;&#45;east {-->
<!--  cursor: e-resize;-->
<!--}-->
<!--.vue-handler-wrapper&#45;&#45;east-south {-->
<!--  cursor: se-resize;-->
<!--}-->
<!--.vue-handler-wrapper&#45;&#45;south {-->
<!--  cursor: s-resize;-->
<!--}-->
<!--.vue-handler-wrapper&#45;&#45;west-south {-->
<!--  cursor: sw-resize;-->
<!--}-->
<!--.vue-handler-wrapper&#45;&#45;west {-->
<!--  cursor: w-resize;-->
<!--}-->
<!--.vue-handler-wrapper&#45;&#45;disabled {-->
<!--  cursor: auto;-->
<!--}-->

<!--.vue-simple-handler {-->
<!--  display: block;-->
<!--  background: white;-->
<!--  height: 10px;-->
<!--  width: 10px;-->
<!--}-->

<!--.vue-simple-line {-->
<!--  background: none;-->
<!--  transition: border 0.5s;-->
<!--  border-color: rgba(255, 255, 255, 0.3);-->
<!--  border-width: 0;-->
<!--  border-style: solid;-->
<!--}-->
<!--.vue-simple-line&#45;&#45;south, .vue-simple-line&#45;&#45;north {-->
<!--  height: 0;-->
<!--  width: 100%;-->
<!--}-->
<!--.vue-simple-line&#45;&#45;east, .vue-simple-line&#45;&#45;west {-->
<!--  height: 100%;-->
<!--  width: 0;-->
<!--}-->
<!--.vue-simple-line&#45;&#45;east {-->
<!--  border-right-width: 1px;-->
<!--}-->
<!--.vue-simple-line&#45;&#45;west {-->
<!--  border-left-width: 1px;-->
<!--}-->
<!--.vue-simple-line&#45;&#45;south {-->
<!--  border-bottom-width: 1px;-->
<!--}-->
<!--.vue-simple-line&#45;&#45;north {-->
<!--  border-top-width: 1px;-->
<!--}-->
<!--.vue-simple-line&#45;&#45;hover {-->
<!--  opacity: 1;-->
<!--  border-color: white;-->
<!--}-->

<!--.vue-bounding-box {-->
<!--  position: relative;-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--}-->
<!--.vue-bounding-box__handler {-->
<!--  position: absolute;-->
<!--}-->
<!--.vue-bounding-box__handler&#45;&#45;west-north {-->
<!--  left: 0;-->
<!--  top: 0;-->
<!--}-->
<!--.vue-bounding-box__handler&#45;&#45;north {-->
<!--  left: 50%;-->
<!--  top: 0;-->
<!--}-->
<!--.vue-bounding-box__handler&#45;&#45;east-north {-->
<!--  left: 100%;-->
<!--  top: 0;-->
<!--}-->
<!--.vue-bounding-box__handler&#45;&#45;east {-->
<!--  left: 100%;-->
<!--  top: 50%;-->
<!--}-->
<!--.vue-bounding-box__handler&#45;&#45;east-south {-->
<!--  left: 100%;-->
<!--  top: 100%;-->
<!--}-->
<!--.vue-bounding-box__handler&#45;&#45;south {-->
<!--  left: 50%;-->
<!--  top: 100%;-->
<!--}-->
<!--.vue-bounding-box__handler&#45;&#45;west-south {-->
<!--  left: 0;-->
<!--  top: 100%;-->
<!--}-->
<!--.vue-bounding-box__handler&#45;&#45;west {-->
<!--  left: 0;-->
<!--  top: 50%;-->
<!--}-->

<!--.vue-rectangle-stencil {-->
<!--  position: absolute;-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--  box-sizing: border-box;-->
<!--}-->
<!--.vue-rectangle-stencil__preview {-->
<!--  position: absolute;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->
<!--.vue-rectangle-stencil&#45;&#45;movable {-->
<!--  cursor: move;-->
<!--}-->

<!--.vue-preview-result {-->
<!--  overflow: hidden;-->
<!--  box-sizing: border-box;-->
<!--  position: absolute;-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--}-->
<!--.vue-preview-result__wrapper {-->
<!--  position: absolute;-->
<!--}-->
<!--.vue-preview-result__image {-->
<!--  pointer-events: none;-->
<!--  position: relative;-->
<!--  user-select: none;-->
<!--  transform-origin: center;-->
<!--  max-width: none !important;-->
<!--}-->

<!--.vue-circle-stencil {-->
<!--  position: absolute;-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--  box-sizing: content-box;-->
<!--  cursor: move;-->
<!--}-->
<!--.vue-circle-stencil__preview {-->
<!--  border-radius: 50%;-->
<!--  position: absolute;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->
<!--.vue-circle-stencil&#45;&#45;movable {-->
<!--  cursor: move;-->
<!--}-->

<!--.vue-preview {-->
<!--  overflow: hidden;-->
<!--  box-sizing: border-box;-->
<!--  position: relative;-->
<!--}-->
<!--.vue-preview&#45;&#45;fill {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  position: absolute;-->
<!--}-->
<!--.vue-preview__wrapper {-->
<!--  position: absolute;-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--}-->
<!--.vue-preview__image {-->
<!--  pointer-events: none;-->
<!--  position: absolute;-->
<!--  user-select: none;-->
<!--  transform-origin: center;-->
<!--  max-width: none !important;-->
<!--}-->



<!--[dir="rtl"] .vue-advanced-cropper {-->
<!--  text-align: center;-->
<!--  position: relative;-->
<!--  user-select: none;-->
<!--  max-height: 100%;-->
<!--  max-width: 100%;-->
<!--  direction: ltr;-->
<!--}-->
<!--[dir="rtl"] .vue-advanced-cropper__stretcher {-->
<!--  pointer-events: none;-->
<!--  position: relative;-->
<!--  max-width: 100%;-->
<!--  max-height: 100%;-->
<!--}-->
<!--[dir="rtl"] .vue-advanced-cropper__image {-->
<!--  user-select: none;-->
<!--  position: absolute;-->
<!--  transform-origin: center;-->
<!--  max-width: none !important;-->
<!--}-->
<!--[dir="rtl"] .vue-advanced-cropper__background, .vue-advanced-cropper__foreground {-->
<!--  opacity: 1;-->
<!--  background: black;-->
<!--  transform: translate(-50%, -50%);-->
<!--  position: absolute;-->
<!--  top: 50%;-->
<!--  left: 50%;-->
<!--}-->
<!--[dir="rtl"] .vue-advanced-cropper__foreground {-->
<!--  opacity: 0.5;-->
<!--}-->
<!--[dir="rtl"] .vue-advanced-cropper__boundaries {-->
<!--  opacity: 1;-->
<!--  transform: translate(-50%, -50%);-->
<!--  position: absolute;-->
<!--  left: 50%;-->
<!--  top: 50%;-->
<!--}-->
<!--[dir="rtl"] .vue-advanced-cropper__cropper-wrapper {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->
<!--[dir="rtl"] .vue-advanced-cropper__image-wrapper {-->
<!--  overflow: hidden;-->
<!--  position: absolute;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->
<!--[dir="rtl"] .vue-advanced-cropper__stencil-wrapper {-->
<!--  position: absolute;-->
<!--}-->

<!--[dir="rtl"] .vue-draggable-area {-->
<!--  position: relative;-->
<!--}-->

<!--[dir="rtl"] .vue-line-wrapper {-->
<!--  background: none;-->
<!--  position: absolute;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--}-->
<!--[dir="rtl"] .vue-line-wrapper&#45;&#45;north, .vue-line-wrapper&#45;&#45;south {-->
<!--  height: 12px;-->
<!--  width: 100%;-->
<!--  left: 0;-->
<!--  transform: translateY(-50%);-->
<!--}-->
<!--[dir="rtl"] .vue-line-wrapper&#45;&#45;north {-->
<!--  top: 0;-->
<!--  cursor: n-resize;-->
<!--}-->
<!--[dir="rtl"] .vue-line-wrapper&#45;&#45;south {-->
<!--  top: 100%;-->
<!--  cursor: s-resize;-->
<!--}-->
<!--[dir="rtl"] .vue-line-wrapper&#45;&#45;east, .vue-line-wrapper&#45;&#45;west {-->
<!--  width: 12px;-->
<!--  height: 100%;-->
<!--  transform: translateX(-50%);-->
<!--  top: 0;-->
<!--}-->
<!--[dir="rtl"] .vue-line-wrapper&#45;&#45;east {-->
<!--  left: 100%;-->
<!--  cursor: e-resize;-->
<!--}-->
<!--[dir="rtl"] .vue-line-wrapper&#45;&#45;west {-->
<!--  left: 0;-->
<!--  cursor: w-resize;-->
<!--}-->
<!--[dir="rtl"] .vue-line-wrapper&#45;&#45;disabled {-->
<!--  cursor: auto;-->
<!--}-->

<!--[dir="rtl"] .vue-handler-wrapper {-->
<!--  position: absolute;-->
<!--  transform: translate(-50%, -50%);-->
<!--  width: 30px;-->
<!--  height: 30px;-->
<!--}-->
<!--[dir="rtl"] .vue-handler-wrapper__draggable {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--}-->
<!--[dir="rtl"] .vue-handler-wrapper&#45;&#45;west-north {-->
<!--  cursor: nw-resize;-->
<!--}-->
<!--[dir="rtl"] .vue-handler-wrapper&#45;&#45;north {-->
<!--  cursor: n-resize;-->
<!--}-->
<!--[dir="rtl"] .vue-handler-wrapper&#45;&#45;east-north {-->
<!--  cursor: ne-resize;-->
<!--}-->
<!--[dir="rtl"] .vue-handler-wrapper&#45;&#45;east {-->
<!--  cursor: e-resize;-->
<!--}-->
<!--[dir="rtl"] .vue-handler-wrapper&#45;&#45;east-south {-->
<!--  cursor: se-resize;-->
<!--}-->
<!--[dir="rtl"] .vue-handler-wrapper&#45;&#45;south {-->
<!--  cursor: s-resize;-->
<!--}-->
<!--[dir="rtl"] .vue-handler-wrapper&#45;&#45;west-south {-->
<!--  cursor: sw-resize;-->
<!--}-->
<!--[dir="rtl"] .vue-handler-wrapper&#45;&#45;west {-->
<!--  cursor: w-resize;-->
<!--}-->
<!--[dir="rtl"] .vue-handler-wrapper&#45;&#45;disabled {-->
<!--  cursor: auto;-->
<!--}-->

<!--[dir="rtl"] .vue-simple-handler {-->
<!--  display: block;-->
<!--  background: white;-->
<!--  height: 10px;-->
<!--  width: 10px;-->
<!--}-->

<!--[dir="rtl"] .vue-simple-line {-->
<!--  background: none;-->
<!--  transition: border 0.5s;-->
<!--  border-color: rgba(255, 255, 255, 0.3);-->
<!--  border-width: 0;-->
<!--  border-style: solid;-->
<!--}-->
<!--[dir="rtl"] .vue-simple-line&#45;&#45;south, .vue-simple-line&#45;&#45;north {-->
<!--  height: 0;-->
<!--  width: 100%;-->
<!--}-->
<!--[dir="rtl"] .vue-simple-line&#45;&#45;east, .vue-simple-line&#45;&#45;west {-->
<!--  height: 100%;-->
<!--  width: 0;-->
<!--}-->
<!--[dir="rtl"] .vue-simple-line&#45;&#45;east {-->
<!--  border-right-width: 1px;-->
<!--}-->
<!--[dir="rtl"] .vue-simple-line&#45;&#45;west {-->
<!--  border-left-width: 1px;-->
<!--}-->
<!--[dir="rtl"] .vue-simple-line&#45;&#45;south {-->
<!--  border-bottom-width: 1px;-->
<!--}-->
<!--[dir="rtl"] .vue-simple-line&#45;&#45;north {-->
<!--  border-top-width: 1px;-->
<!--}-->
<!--[dir="rtl"] .vue-simple-line&#45;&#45;hover {-->
<!--  opacity: 1;-->
<!--  border-color: white;-->
<!--}-->

<!--[dir="rtl"] .vue-bounding-box {-->
<!--  position: relative;-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--}-->
<!--[dir="rtl"] .vue-bounding-box__handler {-->
<!--  position: absolute;-->
<!--}-->
<!--[dir="rtl"] .vue-bounding-box__handler&#45;&#45;west-north {-->
<!--  left: 0;-->
<!--  top: 0;-->
<!--}-->
<!--[dir="rtl"] .vue-bounding-box__handler&#45;&#45;north {-->
<!--  left: 50%;-->
<!--  top: 0;-->
<!--}-->
<!--[dir="rtl"] .vue-bounding-box__handler&#45;&#45;east-north {-->
<!--  left: 100%;-->
<!--  top: 0;-->
<!--}-->
<!--[dir="rtl"] .vue-bounding-box__handler&#45;&#45;east {-->
<!--  left: 100%;-->
<!--  top: 50%;-->
<!--}-->
<!--[dir="rtl"] .vue-bounding-box__handler&#45;&#45;east-south {-->
<!--  left: 100%;-->
<!--  top: 100%;-->
<!--}-->
<!--[dir="rtl"] .vue-bounding-box__handler&#45;&#45;south {-->
<!--  left: 50%;-->
<!--  top: 100%;-->
<!--}-->
<!--[dir="rtl"] .vue-bounding-box__handler&#45;&#45;west-south {-->
<!--  left: 0;-->
<!--  top: 100%;-->
<!--}-->
<!--[dir="rtl"] .vue-bounding-box__handler&#45;&#45;west {-->
<!--  left: 0;-->
<!--  top: 50%;-->
<!--}-->

<!--[dir="rtl"] .vue-rectangle-stencil {-->
<!--  position: absolute;-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--  box-sizing: border-box;-->
<!--}-->
<!--[dir="rtl"] .vue-rectangle-stencil__preview {-->
<!--  position: absolute;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->
<!--[dir="rtl"] .vue-rectangle-stencil&#45;&#45;movable {-->
<!--  cursor: move;-->
<!--}-->

<!--[dir="rtl"] .vue-preview-result {-->
<!--  overflow: hidden;-->
<!--  box-sizing: border-box;-->
<!--  position: absolute;-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--}-->
<!--[dir="rtl"] .vue-preview-result__wrapper {-->
<!--  position: absolute;-->
<!--}-->
<!--[dir="rtl"] .vue-preview-result__image {-->
<!--  pointer-events: none;-->
<!--  position: relative;-->
<!--  user-select: none;-->
<!--  transform-origin: center;-->
<!--  max-width: none !important;-->
<!--}-->

<!--[dir="rtl"] .vue-circle-stencil {-->
<!--  position: absolute;-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--  box-sizing: content-box;-->
<!--  cursor: move;-->
<!--}-->
<!--[dir="rtl"] .vue-circle-stencil__preview {-->
<!--  border-radius: 50%;-->
<!--  position: absolute;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->
<!--[dir="rtl"] .vue-circle-stencil&#45;&#45;movable {-->
<!--  cursor: move;-->
<!--}-->

<!--[dir="rtl"] .vue-preview {-->
<!--  overflow: hidden;-->
<!--  box-sizing: border-box;-->
<!--  position: relative;-->
<!--}-->
<!--[dir="rtl"] .vue-preview&#45;&#45;fill {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  position: absolute;-->
<!--}-->
<!--[dir="rtl"] .vue-preview__wrapper {-->
<!--  position: absolute;-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--}-->
<!--[dir="rtl"] .vue-preview__image {-->
<!--  pointer-events: none;-->
<!--  position: absolute;-->
<!--  user-select: none;-->
<!--  transform-origin: center;-->
<!--  max-width: none !important;-->
<!--}-->
<!--</style>-->
