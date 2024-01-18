<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router/dist/vue-router'
import { isRequired } from 'src/modules/form-validation'
import AutoComplete from 'src/components/AutoCompleteSingle.vue'
import urls from 'src/urls'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import RouteNames from 'src/router/route-names'
import { AuthGroupForm } from 'src/types/domain/auth/user'
import { AuthGroupPayload } from 'src/types/network/payload/auth/user'
import { AuthGroupResponse } from 'src/types/network/response/auth/user'
import { getItemIdFromRoute, useAddEdit } from 'src/modules/add-edit-composable'
import {
  authGroupFormTpPayload,
  authGroupResponseToForm,
} from 'src/types/converter/auth/groups'

const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.authGroups
const listViewRoute = RouteNames.AUTH_GROUP_LIST
const itemTypeTranslate = 'گروه مدیریتی'
const form = ref<AuthGroupForm>({
  name: '',
  permissions: [],
})

const itemRepr = computed(() => form.value.name)

const {
  formTitle,
  showForm,
  isLoading,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<AuthGroupPayload, AuthGroupResponse, AuthGroupForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  authGroupResponseToForm,
  authGroupFormTpPayload
)
</script>

<template>
  <AddEdit
    :item-id="itemId"
    :form-title="formTitle"
    :item-repr="itemRepr"
    :show-form="showForm"
    :show-delete-dialog="showDeleteDialog"
    :save-disabled="isLoading"
    @form-submit="handleFormSubmit"
    @handle-delete-dialog="toggleDeleteDialog($event)"
    @delete="handleDelete"
  >
    <template v-slot:form-fields>
      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.name"
            :label="$t('general.name')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoComplete
            v-model="form.permissions"
            :label="$t('general.permissions')"
            :obj-repr="'name'"
            :query-param="'search'"
            :api="urls.authPermissions"
            :list-query-param="'ids[]'"
            :list-api="'get-by-id-list/'"
            select-multiple
            outlined
            dense
          />
        </div>
      </div>
    </template>
  </AddEdit>
</template>
