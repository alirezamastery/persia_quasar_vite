<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useUserStore from 'stores/user'
import { isRequired } from 'src/modules/form-validation'
import urls from 'src/urls'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import AutoCompleteMultiple from 'components/AutoCompleteMultiple.vue'
import RouteNames from 'src/router/route-names'
import { getItemIdFromRoute, useAddEdit } from 'src/modules/add-edit-composable'
import { AxiosResponse } from 'axios'
import { UserResponse } from 'src/types/network/response/auth/user'
import { UserUpdateForm } from 'src/types/domain/auth/user'
import { UserUpdatePayload } from 'src/types/network/payload/auth/user'
import {
  userResponseToForm,
  userUpdateFormToPayload,
} from 'src/types/converter/auth/user'
// import permissions from 'src/i18n/fa-IR/permissions'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.users
const listViewRoute = RouteNames.USER_LIST
const itemTypeTranslate = 'کاربر'
const form = ref<UserUpdateForm>({
  id: '',
  mobile: '',
  isActive: false,
  isStaff: false,
  isSuperuser: false,
  authGroups: [],
  userPermissions: [],
})
const itemRepr = computed(() => form.value.mobile)

async function reqCallback(res: AxiosResponse<UserResponse>) {
  if (res.data.id === userStore.user?.id) {
    userStore.setUserInfo(res.data)
  }
  await router.push({ name: RouteNames.USER_LIST })
}

const {
  formTitle,
  showForm,
  isLoading,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<UserUpdatePayload, UserResponse, UserUpdateForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  userResponseToForm,
  userUpdateFormToPayload
)

function getPermissionRepr(obj: any) {
  // @ts-ignore
  return permissions[obj.codename]
}
</script>

<template>
  <AddEdit
    :item-id="itemId"
    :form-title="formTitle"
    :item-repr="itemRepr"
    :show-form="showForm"
    :show-delete-dialog="showDeleteDialog"
    :save-disabled="isLoading"
    :can-delete="!form.isSuperuser"
    @form-submit="handleFormSubmit"
    @handle-delete-dialog="toggleDeleteDialog($event)"
    @delete="handleDelete"
  >
    <template v-slot:form-fields>
      <q-separator class="q-my-md" />
      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.mobile"
            :label="$t('general.mobile')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

      <!--      <div class="row q-mx-sm q-my-lg">-->
      <!--        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">-->
      <!--          <q-input-->
      <!--            v-model="form.email"-->
      <!--            :label="$t('general.email')"-->
      <!--            filled-->
      <!--          />-->
      <!--        </div>-->
      <!--      </div>-->

      <div
        v-if="!!userStore.user?.isSuperuser && userStore.user?.id !== form.id"
        class="row q-ma-sm"
      >
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-checkbox v-model="form.isActive" :label="$t('general.active')" filled />
        </div>
      </div>

      <div class="row q-ma-sm q-mt-lg">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-btn
            :label="$t('general.changePassword')"
            :to="{ name: RouteNames.CHANGE_PASSWORD }"
            color="amber"
            class="text-black"
          />
        </div>
      </div>

      <!-- Super User Options -->
      <template v-if="!!userStore.user?.isSuperuser && userStore.user.id !== form.id">
        <q-separator class="q-mb-md" />
        <div class="text-h6 q-ma-sm q-pa-sm">{{ $t('general.permissions') }}</div>

        <div class="row q-ma-sm">
          <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
            <q-checkbox
              v-model="form.isStaff"
              :label="$t('general.hasAdminPermission')"
              filled
            />
          </div>
        </div>

        <!--        <div class="row q-ma-sm">-->
        <!--          <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">-->
        <!--            <q-checkbox-->
        <!--              v-model="form.isSuperuser"-->
        <!--              :label="$t('general.hasAllPermission')"-->
        <!--              filled-->
        <!--            />-->
        <!--          </div>-->
        <!--        </div>-->

        <!--        <div class="row q-ma-sm">-->
        <!--          <div class="col col-xs-12 col-md-5 col-lg-3 col-xl-3">-->
        <!--            <AutoCompleteMultiple-->
        <!--              v-model="form.authGroups"-->
        <!--              :api="urls.authGroups"-->
        <!--              :label="$t('general.groups')"-->
        <!--              obj-repr="name"-->
        <!--              query-param="search"-->
        <!--              list-query-param="ids[]"-->
        <!--              list-api="get-by-id-list/"-->
        <!--              obj-unique-id="id"-->
        <!--              select-multiple-->
        <!--              outlined-->
        <!--              dense-->
        <!--              options-dense-->
        <!--            />-->
        <!--          </div>-->
        <!--        </div>-->

        <div class="row q-ma-sm">
          <div class="col col-xs-12 col-md-6">
            <AutoCompleteMultiple
              v-model="form.userPermissions"
              :api="urls.authPermissions"
              :label="$t('general.accesses')"
              obj-repr="name"
              query-param="search"
              list-query-param="ids[]"
              list-api="get-by-id-list/"
              obj-unique-id="id"
              select-multiple
              outlined
              dense
              options-dense
            />
          </div>
        </div>
      </template>
    </template>
  </AddEdit>
</template>
