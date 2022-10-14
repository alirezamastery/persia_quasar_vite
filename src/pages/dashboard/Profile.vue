<template>
  <q-card :class="$q.screen.gt.sm ? 'q-ma-md' : 'no-shadow'">
    <q-card-section>
      <div class="text-h5">
        {{ $t('general.routes.profile') }}
      </div>
    </q-card-section>
    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="handleFormSubmit">

        <AvatarCropper/>

        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
            <q-input
              v-model="form.first_name"
              :label="$t('general.firstName')"
              filled
            />
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
            <q-input
              v-model="form.last_name"
              :label="$t('general.lastName')"
              filled
            />
          </div>
        </div>
        <q-btn
          type="submit"
          color="green"
        >
          {{ $t('general.submit') }}
        </q-btn>
      </q-form>
    </q-card-section>
  </q-card>

  <q-card
    class="q-mt-xl"
    :class="$q.screen.gt.sm ? 'q-ma-md' : 'no-shadow'"
  >
    <q-card-section>
      <q-btn
        color="red"
        :to="{name: 'Logout'}"
        icon="logout"
      >
        {{ $t('general.routes.logout') }}
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import useUserStore from 'src/stores/user'
import {notifyMessage} from 'src/modules/notif'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import AvatarCropper from 'src/components/profile/AvatarCropper.vue'

const {t} = useI18n()
const userStore = useUserStore()

const form = ref({
  first_name: null,
  last_name: null,
})

onMounted(() => {
  form.value.first_name = userStore.profile.first_name
  form.value.last_name = userStore.profile.last_name
})

function handleFormSubmit() {
  const data = {
    'first_name': form.value.first_name,
    'last_name': form.value.last_name,
  }
  axiosInstance.patch(urls.userProfile, data)
    .then(res => {
      console.log('without avatar change response:', res)
      userStore.SetProfile(res.data)
      notifyMessage('info', t('general.snack.saveSuccess'))
    })
    .catch(err => {
      console.log('simple patch error', err)
    })
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
