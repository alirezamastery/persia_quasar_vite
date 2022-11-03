<template>
  <div class="custom-login-container">

    <!--    <MatrixRain/>-->

    <div
      v-show="isLoading"
      class="absolute-full flex flex-center justify-center"
    >
      <div class="fixed-full bg-grey" style="opacity: 0.5;z-index: 2000"></div>
      <q-spinner-tail
        :size="'10rem'"
        color="teal-5"
        class="fixed"
        style="z-index: 3000"
      />
    </div>

    <q-card bordered class="q-pa-md" style="z-index: 1000">
      <q-form
        @submit.prevent="handleSubmit"
        class="q-gutter-md"
      >
        <q-input
          v-model="form.mobile"
          type="tel"
          :label="$t('general.mobile')"
          filled
          :rules="[isRequired]"
        >
          <template v-slot:prepend>
            <q-icon name="phone"/>
          </template>
        </q-input>
        <q-input
          v-model="form.password"
          filled
          :type="showPassword ? 'text' : 'password'"
          :label="$t('general.password')"
        >
          <template v-slot:prepend>
            <q-icon name="key"/>
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="handleShowPassword"
            />
          </template>
        </q-input>
        <div class="col">
          <q-checkbox
            v-model="rememberMe"
            :label="$t('general.rememberMe')"
          />
        </div>
        <div class="col flex justify-center">
          <q-btn
            :label="$t('general.routes.login')"
            type="submit"
            color="green"
            ripple
            size="lg"
            style="min-width: 120px"
          />
        </div>
      </q-form>
    </q-card>

  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import {useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import {isRequired} from 'src/modules/form-validation'
import useUserStore from 'src/stores/user'
import {axiosInstance} from 'src/boot/axios'
import urls from 'src/urls'
import {LoginForm} from 'src/types/domain/auth/login'
import {StorageKeys} from 'src/utils'
import RouteNames from 'src/router/route-names'

const q = useQuasar()
const userStore = useUserStore()
const router = useRouter()
const showPassword = ref(false)
const rememberMe = ref(false)
const form = reactive<LoginForm>({
  mobile: '',
  password: '',
})
const isLoading = ref(false)

let rem = q.localStorage.getItem(StorageKeys.REMEMBER_ME)
if (rem === null) {
  rem = false
  q.localStorage.set(StorageKeys.REMEMBER_ME, false)
}
rememberMe.value = rem as boolean
if (rememberMe.value) {
  form.mobile = q.localStorage.getItem(StorageKeys.MOBILE) as string
}

function handleSubmit() {
  isLoading.value = true
  storeCredentials()
  axiosInstance.post(urls.token, form)
    .then(res => {
      console.log('Login', res)
      q.localStorage.set(StorageKeys.ACCESS_TOKEN, res.data.access)
      q.localStorage.set(StorageKeys.REFRESH_TOKEN, res.data.refresh)
      axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + res.data.access
      userStore.login(form.mobile)
      router.push({name: RouteNames.HOME})
    })
    .catch(err => {
      console.log('axios error:', err)
    })
    .finally(() => isLoading.value = false)
}

function handleShowPassword() {
  showPassword.value = !showPassword.value
}

function storeCredentials() {
  q.localStorage.set(StorageKeys.REMEMBER_ME, rememberMe.value)
  if (rememberMe.value) {
    q.localStorage.set(StorageKeys.MOBILE, form.mobile)
  } else {
    q.localStorage.remove(StorageKeys.MOBILE)
  }
}
</script>

<style scoped lang="scss">
.custom-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90vh;
  background-color: transparent;
  z-index: 2;
  margin-right: auto;
}
</style>
