<template>
  <q-card :class="$q.screen.gt.sm ? 'q-ma-md' : 'no-shadow'">
    <q-card-section>
      <div class="text-h5">
        {{ $t('general.routes.profile') }}
      </div>
    </q-card-section>

    <q-card-section class="row">
      <AvatarCropper />
    </q-card-section>

    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="handleFormSubmit">
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
            <q-input v-model="form.firstName" :label="$t('general.firstName')" filled />
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
            <q-input v-model="form.lastName" :label="$t('general.lastName')" filled />
          </div>
        </div>
        <q-btn type="submit" color="green">
          {{ $t('general.submit') }}
        </q-btn>
      </q-form>
    </q-card-section>
  </q-card>

  <q-card class="q-mt-xl" :class="$q.screen.gt.sm ? 'q-ma-md' : 'no-shadow'">
    <q-card-section>
      <q-btn color="red" :to="{ name: 'Logout' }" icon="logout">
        {{ $t('general.routes.logout') }}
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useUserStore from 'src/stores/user'
import { notifyMessage } from 'src/modules/notif'
import { axiosInstance } from 'src/boot/axios'
import urls from 'src/urls'
import { userProfileFormToRequest } from 'src/types/converter/profile/user-profile'
import { UserProfileForm } from 'src/types/domain/profile/user-profile'
import AvatarCropper from 'src/components/profile/AvatarCropper.vue'
import axios from 'axios'
import { LocalStorage } from 'quasar'
import StorageKeys from 'src/utils/storage'

const { t } = useI18n()
const userStore = useUserStore()

const form = ref<UserProfileForm>({
  firstName: '',
  lastName: '',
})

onMounted(() => {
  form.value.firstName = userStore.profile.firstName
  form.value.lastName = userStore.profile.lastName
})

async function handleFormSubmit() {
  const data = userProfileFormToRequest(form.value)
  try {
    const res = await axiosInstance.patch(urls.userProfile, data)
    console.log('without avatar change response:', res)
    userStore.setProfile(res.data)
    notifyMessage('info', t('general.snack.saveSuccess'))
  } catch (err) {
    console.log('profile patch error', err)
  }
}

async function handleCallLocal() {
  const ax = axios.create({
    timeout: 0,
    headers: {
      accept: 'application/json',
    },
  })
  try {
    const res = await ax.post('http://localhost:8000/api/admin/auth/call-local/')
    console.log('local res:', res)
  } catch (e) {
    console.log('call local error:', e)
  }
}
</script>

<style lang="scss">
.cropper-custom {
  user-select: none;

  &__cropper {
    max-height: 50vh !important;
    width: 100%;
  }

  &__cropper-wrapper {
    position: relative;
  }
}
</style>
