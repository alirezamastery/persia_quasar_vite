<script setup lang="ts">
import {computed, ref} from 'vue'
import {QUploader, useQuasar} from 'quasar'
import urls from 'src/urls'
import {StorageKeys} from 'src/utils/storage'
import {ShopProductFormNewImage} from 'src/types/domain/shop/product'
import {notifyMessage} from 'src/modules/notif'

interface ImageUploaderProps {
  modelValue: ShopProductFormNewImage[]
  canSubmit: boolean
}

const props = defineProps<ImageUploaderProps>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: ShopProductFormNewImage[]): void,
  (e: 'update:canSubmit', value: boolean): void,
  (e: 'mainSelected', value: boolean): void,
  (e: 'failed', value: boolean): void,
  (e: 'finished', value: boolean): void,
}>()

const q = useQuasar()

const uploadURL = process.env.API_BASE + urls.shopImageUpload
const uploadHeaders = [
  {name: 'Authorization', value: `Bearer ${q.localStorage.getItem(StorageKeys.ACCESS_TOKEN)}`},
  {name: 'X-CSRFToken', value: q.cookies.get('csrftoken')},
]

const uploader = ref<QUploader | null>(null)
const hasUploadFail = ref(false)
const mainImgKey = ref('')
const queuedImageCount = ref(0)

const newImages = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})
const canSubmit = computed({
  get: () => props.canSubmit,
  set: (value) => emits('update:canSubmit', value),
})
const uploaderReadonly = computed(() => !!uploader.value?.isBusy)


function handleImageAdded(files: any[]) {
  console.log('image added', files)
  queuedImageCount.value += files.length
}

function handleImageRemoved(files: any[]) {
  const key = files[0].__key
  for (const [index, img] of Object.entries(newImages.value)) {
    if (img.key === key) {
      newImages.value.splice(parseInt(index), 1)
      break
    }
  }
  if (queuedImageCount.value > 0)
    queuedImageCount.value -= 1

  console.log('images after remove:', newImages.value)
}

function handleImageUploaded(e: any) {
  console.log('upload event:', e)
  const response = JSON.parse(e.xhr.response)
  const key = e.files[0].__key
  newImages.value.push({
    file: response.file_address,
    key: key,
    isMain: mainImgKey.value === key,
  })
  queuedImageCount.value -= 1
  console.log('images after upload', newImages.value, key === mainImgKey.value)
}

function handleUploaderFail() {
  hasUploadFail.value = true
  canSubmit.value = false
  notifyMessage('negative', 'خطا در آپلود عکس')
}

function handleMainImageSelected(file: any) {
  console.log('file:', file.__key)
  mainImgKey.value = file.__key
  emits('mainSelected', true)
}

function startUpload() {
  console.log('start upload')
  hasUploadFail.value = false
  uploader.value!.upload()
}


defineExpose({
  uploader: uploader,
  queuedImageCount: queuedImageCount,
  hasUploadFail: hasUploadFail,
  startUpload: startUpload,
})
</script>

<template>
  <div class="flex row q-my-md q-px-sm">
    <q-uploader
      :url="uploadURL"
      :headers="uploadHeaders"
      :accept="'.jpg,.JPG,.jpeg,.png'"
      :label="$t('shop.addImage')"
      :multiple="true"
      :field-name="'image'"
      @removed="handleImageRemoved"
      @added="handleImageAdded"
      @uploaded="handleImageUploaded"
      @failed="handleUploaderFail"
      @finish="emits('finished', true)"
      ref="uploader"
      :readonly="uploaderReadonly"
      flat
      bordered
      style="max-width: 1200px; width: 100%"
    >
      <template v-slot:list="scope">
        <q-list separator>

          <q-card
            v-for="file in scope.files"
            :key="file.__key"
            class="no-shadow"
          >

            <q-card-section horizontal>
              <q-img
                v-if="file.__img"
                :src="file.__img.src"
                :ratio="1"
                height="100px"
                :fit="'contain'"
                :position="'100% 50%'"
              />

              <q-card-actions>
                <q-item-label v-if="['uploaded', 'uploading', 'failed'].includes(file.__status)">
                  <span>{{ $t('general.status') }}:&nbsp;</span>
                  <q-icon
                    v-if="file.__status === 'uploaded'"
                    color="green"
                    name="mdi-checkbox-marked-circle"
                    size="xs"
                    right
                  />
                  <q-spinner-hourglass v-else-if="file.__status === 'uploading'" color="orange" size="xs" right/>
                  <q-icon v-else color="red" name="mdi-cancel" size="xs" right/>
                </q-item-label>

                <q-item-label caption lines="2">
                  <div>{{ file.__sizeLabel }}</div>
                  <div>{{ file.__progressLabel }}</div>
                </q-item-label>
              </q-card-actions>

              <q-card-actions>
                <q-btn
                  icon="delete"
                  color="pink"
                  flat
                  :disable="uploaderReadonly"
                  @click="scope.removeFile(file)"
                />
              </q-card-actions>
              <q-card-actions>
                <q-btn
                  :icon="mainImgKey === file.__key ? 'fa-solid fa-flag' : 'fa-regular fa-flag'"
                  :color="mainImgKey === file.__key ? 'primary' : ''"
                  :disable="uploaderReadonly"
                  flat
                  @click="handleMainImageSelected(file)"
                />
              </q-card-actions>
            </q-card-section>

            <q-separator class="q-my-sm"/>

          </q-card>

        </q-list>
      </template>
    </q-uploader>
  </div>
</template>

<style scoped lang="scss">

</style>
