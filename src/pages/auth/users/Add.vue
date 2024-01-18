<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {isRequired} from 'src/modules/form-validation'
import {axiosInstance} from 'boot/axios'
import urls from 'src/urls'
import FormActions from 'src/components/addEdit/FormActions.vue'
import RouteNames from 'src/router/route-names'
import {UserCreateForm} from 'src/types/domain/auth/user'
import {parentCardClass} from 'src/utils/screen'
import {userCreateFormToPayload} from 'src/types/converter/auth/user'


const router = useRouter()
const form = reactive<UserCreateForm>({
  mobile: '',
  password: '',
  passwordRepeat: '',
  isActive: true,
  isStaff: false,
})
const isLoading = ref(false)

const formValid = computed(() => {
  return form.password.length > 5 && form.password === form.passwordRepeat
})
const passwordsDiff = computed(() => form.password !== form.passwordRepeat)

async function handleSubmit() {
  isLoading.value = true
  const data = userCreateFormToPayload(form)
  console.log('data:', data)
  try {
    const res = await axiosInstance.post(urls.users, data)
    console.log('user create response:', res)
    await router.push({name: RouteNames.USER_LIST})
  } catch (e) {
    console.log('user create error:', e)
  }
  isLoading.value = false
}
</script>


<template>
  <div :class="parentCardClass">

    <div class="q-mt-md row justify-end">
      <q-btn
        :label="$t('general.goBack')"
        color="grey"
        icon-right="arrow_left"
        size="sm"
        @click="$router.go(-1)"
        outline
      />
    </div>

    <div class="text-h5 q-ma-md">ایجاد کاربر</div>

    <q-form @submit.prevent="handleSubmit">
      <q-card flat>
        <q-card-section>

          <div class="row q-ma-sm">
            <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
              <q-input
                v-model="form.mobile"
                :label="$t('general.username')"
                filled
                :rules="[isRequired]"
              />
            </div>
          </div>

          <div class="row q-ma-sm">
            <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
              <q-input
                v-model="form.password"
                :label="$t('general.password')"
                type="password"
                filled
                :rules="[isRequired , val => val.length > 5 || $t('err.validation.passwordMin')]"
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

          <!--          <div class="row q-ma-sm">-->
          <!--            <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">-->
          <!--              <q-input-->
          <!--                v-model="form.email"-->
          <!--                :label="$t('general.email')"-->
          <!--                filled-->
          <!--              />-->
          <!--            </div>-->
          <!--          </div>-->

          <div class="row q-ma-sm">
            <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
              <q-checkbox
                v-model="form.isActive"
                :label="$t('general.active')"
                filled
              />
            </div>
          </div>

        </q-card-section>
        <q-card-section v-if="passwordsDiff" class="text-red">
          <div>{{ $t('err.validation.passwordsDontMatch') }}</div>
        </q-card-section>
      </q-card>

      <FormActions
        :show-delete="false"
        :save-disabled="!formValid || isLoading"
      />
    </q-form>

  </div>
</template>

<style scoped>

</style>
