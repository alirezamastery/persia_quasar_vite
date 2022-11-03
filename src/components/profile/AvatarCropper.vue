<template>
  <div class="col items-center">
    <div
      class="row w-100"
      :class="$q.screen.gt.xs ? 'justify-start' : 'justify-center'"
    >
      <div class="col-xs-6 col-sm-4 col-lg-2">
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
          ref="cropperElement"
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

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {Cropper, CircleStencil} from 'vue-advanced-cropper'
import useUserStore from 'src/stores/user'
import {cloneDeep} from 'lodash'
import {notifyMessage} from 'src/modules/notif'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {UserProfileResponse} from 'src/types/network/response/profile/user-profile'


const {t} = useI18n()
const validExtensions = ['png', 'jpg', 'jpeg', 'JPG', 'JPEG']
const userStore = useUserStore()
const cropperElement = ref<Nullable<typeof Cropper>>(null)
const showCropperDialog = ref(false)
const cropperImageObjectURL = ref('')
const avatarUrl = computed(() => userStore.profile.avatar)


function onAvatarChangeAttempt() {
  const imageInput = document.createElement('input')
  imageInput.type = 'file'
  imageInput.addEventListener('change', openImageSelectDialog)
  imageInput.click()
}

function openImageSelectDialog(event: Event) {
  console.log('openImageSelectDialog', event)
  const target = event.target as HTMLInputElement
  const files = target.files as FileList
  const file = files[0]
  const extension = file.name.split('.').pop()
  if (extension === undefined || !validExtensions.includes(extension)) {
    notifyMessage('warning', t('general.snack.fileFormatError'))
    return
  }
  cropperImageObjectURL.value = window.URL.createObjectURL(file)
  showCropperDialog.value = true
  console.log('imgURL', cropperImageObjectURL.value)
}

async function handleImageDelete() {
  const data = {
    avatar: null,
  }
  try {
    const res = await axiosInstance.patch<UserProfileResponse>(urls.userProfile, data)
    console.log('delete response:', res)
    userStore.setProfile(cloneDeep(res.data))
  } catch (err) {
    console.log('delete error:', err)
  }
}

async function handleCropperSubmit() {
  showCropperDialog.value = false
  const {canvas} = cropperElement.value!.getResult()
  const formData = new FormData()
  const blob = await new Promise(resolve => canvas.toBlob(resolve)) as Blob
  formData.append('avatar', blob, 'avatar.png')
  try {
    const res = await axiosInstance.patch<UserProfileResponse>(urls.userProfile, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('form patch response:', res)
    userStore.setProfile(res.data)
  } catch (err) {
    console.log('file upload error', err)
    notifyMessage('negative', t('general.snack.connectionError'))
  }
}
</script>
