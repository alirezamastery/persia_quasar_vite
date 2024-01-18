<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { addBanner } from 'src/modules/notif'
import { isRequired } from 'src/modules/form-validation'
import { axiosInstance } from 'boot/axios'
import urls from 'src/urls'
import RouteNames from 'src/router/route-names'
import { PasswordForm, UserDomain } from 'src/types/domain/auth/user'
import { parentCardClass } from 'src/utils/screen'
import { userResponseToDomain } from 'src/types/converter/auth/user'

export interface ChangePasswordProps {
  id: string
}

const props = defineProps<ChangePasswordProps>()

const { t } = useI18n()
const router = useRouter()
const user = ref<UserDomain | null>(null)
const form = ref<PasswordForm>({
  password: '',
  passwordRepeat: '',
})

const formTitle = computed(() => {
  if (!user.value) return ''
  const firstName = user.value.profile.firstName
  const lastName = user.value.profile.lastName
  return `${t('general.changePassword')} برای ${firstName} ${lastName}`
})

const formIsValid = computed(() => {
  return (
    form.value.password.length > 5 && form.value.password === form.value.passwordRepeat
  )
})

function handleFormSubmit() {
  console.log('form:', form.value, 'id:', props.id)

  const url = urls.changePassword.replace('{user_id}', props.id)
  const data = {
    new_password: form.value.password,
  }
  axiosInstance.post(url, data).then((res) => {
    console.log('password change res:', res)
    if (user.value === null) return
    const userStr = `${user.value.profile.firstName} ${user.value.profile.lastName}`
    addBanner(t('general.alert.userPasswordChanged', { user: userStr }))
    router.push({ name: RouteNames.USER_LIST })
  })
}

const url = `${urls.users}${props.id}/`
console.log('url:', url)
axiosInstance.get(url).then((res) => {
  user.value = userResponseToDomain(res.data)
})
</script>

<template>
  <q-card :class="parentCardClass">
    <q-card-section class="text-h5 q-ma-md">{{ formTitle }}</q-card-section>

    <q-card-section>
      <q-form @submit.prevent="handleFormSubmit">
        <div class="row q-ma-sm">
          <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
            <q-input
              v-model="form.password"
              :label="$t('general.password')"
              type="password"
              filled
              :rules="[
                isRequired,
                (val) => val.length > 5 || $t('err.validation.passwordMin'),
              ]"
            />
          </div>
        </div>

        <div class="row q-ma-sm">
          <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
            <q-input
              v-model="form.passwordRepeat"
              :label="$t('general.passwordRepeat')"
              type="password"
              filled
              :rules="[isRequired]"
            />
          </div>
        </div>

        <q-btn
          :label="$t('general.save')"
          :disable="!formIsValid"
          type="submit"
          color="primary"
        />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
