<template>
  <div class="column items-center">
    <div
      class="row w-100"
      :class="$q.screen.gt.sm ? 'justify-start' : 'justify-center'"
    >
      <div class="col-xs-6 col-sm-3 col-md-4">
        <div class="user-avatar">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt=""
            class="avatar-img editable"
            @click="onAvatarChangeAttempt"
          >
          <img
            v-else
            src="~assets/svg/user-blank.svg"
            alt=""
            class="avatar-img editable"
            @click="onAvatarChangeAttempt"
          >
          <div class="action-icons">
            <q-btn
              round
              unelevated
              color="primary"
              icon="mdi-image-filter-none"
            >
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item
                    v-close-popup
                    clickable
                    @click="onAvatarChangeAttempt"
                  >
                    <q-item-section>
                      <q-icon name="mdi-pencil"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ $t('general.select') }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="avatarUrl"
                    v-close-popup
                    clickable
                    @click="handleImageDelete"
                  >
                    <q-item-section>
                      <q-icon name="mdi-delete"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ $t('general.delete') }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>

  <q-dialog v-model="showCropperDialog">
    <q-card class="cropper-custom overflow-hidden-y">
      <q-card-section class="row justify-between">
        <q-btn
          v-close-popup
          icon="close"
          size="lg"
          round
          flat
        />
        <q-btn
          v-if="$q.screen.lt.md"
          color="primary"
          size="lg"
          @click="handleCropperSubmit"
        >
          {{ $t('general.submit') }}
        </q-btn>
      </q-card-section>
      <q-card-section class="cropper-custom__cropper-wrapper">
        <Cropper
          ref="cropper"
          :src="cropperImageObjectURL"
          :stencil-component="CircleStencil"
          :stencil-props="{aspectRatio: 1, resizable: true}"
          :canvas="{minHeight: 30, minWidth: 30, maxHeight: 300, maxWidth: 300}"
          class="cropper-custom__cropper cropper"
          dir="ltr"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn
          v-if="$q.screen.gt.sm"
          color="primary"
          size="lg"
          @click="handleCropperSubmit"
        >
          {{ $t('general.submit') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {Cropper, CircleStencil} from 'vue-advanced-cropper'
import useUserStore from 'src/stores/user'
import {cloneDeep} from 'lodash'
import {notifyMessage} from 'src/modules/notif'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'


const validExtensions = ['png', 'jpg', 'jpeg', 'JPG', 'JPEG']
const userStore = useUserStore()
const cropper = ref(null)
const showCropperDialog = ref(false)
const cropperImageObjectURL = ref(null)
const avatarUrl = ref('')

onMounted(() => {
  avatarUrl.value = userStore.profile.avatar
})

function onAvatarChangeAttempt() {
  const imageInput = document.createElement('input')
  imageInput.type = 'file'
  imageInput.addEventListener('change', openImageSelectDialog)
  imageInput.click()
}

function openImageSelectDialog(event) {
  console.log('openImageSelectDialog', event)
  const file = event.target.files[0]
  const extension = file.name.split('.').pop()
  if (!validExtensions.includes(extension)) {
    notifyMessage('warning', t('general.snack.fileFormatError'))
    return
  }
  cropperImageObjectURL.value = window.URL.createObjectURL(file)
  showCropperDialog.value = true
  console.log('imgURL', cropperImageObjectURL.value)
}

function handleImageDelete() {
  const data = {
    avatar: null,
  }
  axiosInstance.patch(urls.userProfile, data)
    .then(res => {
      console.log('delete response:', res)
      avatarUrl.value = null
      userStore.SetProfile(cloneDeep(res.data))
    })
    .catch(err => console.log('delete error:', err))
}

function handleCropperSubmit() {
  showCropperDialog.value = false
  const {canvas} = cropper.value.getResult()
  avatarUrl.value = canvas
  avatarUrl.value.avatar = avatarUrl.value.toDataURL()
  console.log('handleCropperSubmit | canvas', avatarUrl.value)
  const formData = new FormData()
  avatarUrl.value.toBlob(blob => {
    formData.append('avatar', blob, 'avatar.png')
    axiosInstance.patch(urls.userProfile, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      console.log('form patch response:', res)
      avatarUrl.value = res.data.avatar
      userStore.SetProfile(res.data)
    }).catch(err => {
      console.log('file upload error', err)
      notifyMessage('negative', t('general.snack.connectionError'))
    })
  })
}
</script>
