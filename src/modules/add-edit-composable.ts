import {computed, ComputedRef, Ref, ref} from 'vue'
import {RouteLocationNormalizedLoaded, useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {addBanner, notifyErrors} from './notif'
import {axiosInstance} from 'src/boot/axios'


export function getItemIdFromRoute(
    route: RouteLocationNormalizedLoaded,
    idKey = 'id',
): Nullable<string> {
  return route.params[idKey] ? route.params[idKey].toString() : null
}

export function useAddEdit<RequestType, ResponseType, FormType>(
    form: Ref<FormType>,
    itemId: Nullable<string>,
    apiRoot: string,
    listViewRoute: string,
    itemTypeTranslate: string,
    itemRepr: ComputedRef<string>,
    responseToForm: (r: ResponseType) => FormType,
    formToRequest: (f: FormType) => RequestType,
) {
  const q = useQuasar()
  const router = useRouter()
  const {t} = useI18n()

  const showForm = ref(false)
  const showDeleteDialog = ref(false)
  const isLoading = ref(false)

  const editingItemId = computed(() => itemId)
  const formTitle = computed(() => {
    if (itemId !== null)
      return `${t('general.change')} ${t(itemTypeTranslate)} ${itemRepr.value}`
    return t('general.createANew', {item: t(itemTypeTranslate)})
  })

  if (itemId !== null) {
    console.log('getting item details from server')
    console.log('show form:', showForm.value)
    const url = `${apiRoot}${editingItemId.value}/`
    axiosInstance.get<ResponseType>(url)
        .then(res => {
          console.log('item details', res)
          form.value = responseToForm(res.data)
          showForm.value = true
        })
  } else {
    showForm.value = true
  }

  function handleFormSubmit() {
    isLoading.value = true
    q.loading.show({delay: 300})
    const data = formToRequest(form.value)
    console.log('save payload', data)
    let url = apiRoot
    if (editingItemId.value) {
      url += `${editingItemId.value}/`
      updateItem(url, data)
    } else {
      createItem(url, data)
    }
  }

  function createItem(url: string, data: RequestType) {
    axiosInstance.post<ResponseType>(url, data)
        .then(async (res) => {
          await handleRequestSuccess(res.data)
        })
        .catch(err => {
          console.log('create error', err)
          notifyErrors(err.response.data)
        })
        .finally(() => {
          isLoading.value = false
          q.loading.hide()
        })
  }

  function updateItem(url: string, data: RequestType) {
    axiosInstance.patch<ResponseType>(url, data)
        .then(async (res) => {
          await handleRequestSuccess(res.data)
        })
        .catch(err => {
          console.log('update error', err)
          notifyErrors(err.response.data)
        })
        .finally(() => {
          isLoading.value = false
          q.loading.hide()
        })
  }

  function handleDelete() {
    showDeleteDialog.value = false
    const url = `${apiRoot}${editingItemId.value}/`
    axiosInstance.delete(url)
        .then(async res => {
          await handleRequestSuccess(res.data, true)
        })
        .catch(err => {
          console.log('delete error:', err)
        })
  }

  async function handleRequestSuccess(resData: ResponseType, isDelete = false) {
    console.log('save success:', resData)
    let alertText
    if (isDelete) {
      alertText = t('general.alert.deleteSuccess', {
        type: t(itemTypeTranslate),
        item: itemRepr.value,
      })
    } else if (editingItemId.value) {
      alertText = t('general.alert.updateSuccess', {
        type: t(itemTypeTranslate),
        item: itemRepr.value,
      })
    } else
      alertText = t('general.alert.saveSuccessGeneral', {
        type: t(itemTypeTranslate),
      })
    addBanner(alertText)
    await router.push({name: listViewRoute})
  }

  function toggleDeleteDialog(newVale: boolean) {
    console.log('toggleDeleteDialog:', newVale)
    showDeleteDialog.value = newVale
  }

  return {
    formTitle,
    showForm,
    isLoading,
    showDeleteDialog,
    toggleDeleteDialog,
    handleFormSubmit,
    handleDelete,
  }
}

// Class implementation of useAddEdit:
// using a class in Vue Templates doesn't work correctly
// example: can not access instance methods from the template
export class UseAddEdit<FormType, ResponseType, RequestType> {
  showForm = ref(true)
  showDeleteDialog = ref(false)

  formTitle = computed(() => {
    const {t} = useI18n()
    if (this.itemId !== null)
      return `${t('general.change')} ${t(this.itemTypeTranslate)}`
    return t('general.createANew').replace('{0}', t(this.itemTypeTranslate))
  })

  constructor(
      readonly itemId: Nullable<string>,
      readonly apiRoot: string,
      readonly listViewRoute: string,
      readonly itemTypeTranslate: string,
      readonly itemRepr: ComputedRef<string>,
      private responseToForm: (r: ResponseType) => FormType,
      private formToRequest: (f: FormType) => RequestType,
      public form: Ref<FormType>,
  ) {
    if (this.itemId !== null) {
      this.fetchItemData()
    }
  }

  private fetchItemData() {
    console.log('fetching item details from server')
    this.showForm.value = false
    const url = `${this.apiRoot}${this.itemId}/`
    axiosInstance.get<ResponseType>(url)
        .then(res => {
          console.log('item details', res)
          this.form.value = this.responseToForm(res.data)
          this.showForm.value = true
        })
  }

  public handleFormSubmit() {
    const data = this.formToRequest(this.form.value)
    console.log('save payload', data)
    let url = this.apiRoot
    if (this.itemId !== null) {
      url += `${this.itemId}/`
      this.updateItem(url, data)
    } else {
      this.createItem(url, data)
    }
  }


  public toggleDeleteDialog() {
    this.showDeleteDialog.value = !this.showDeleteDialog.value
  }

  public handleDelete() {
    this.showDeleteDialog.value = false
    const url = `${this.apiRoot}${this.itemId}/`
    axiosInstance.delete(url)
        .then(async res => {
          await this.handleRequestSuccess(res.data, true)
        })
        .catch(err => {
          console.log('delete error:', err)
        })
  }

  private createItem(url: string, data: RequestType) {
    axiosInstance.post<ResponseType>(url, data)
        .then(async (res) => {
          await this.handleRequestSuccess(res.data)
        })
        .catch(err => {
          console.log('create error', err)
          notifyErrors(err.response.data)
        })
  }

  private updateItem(url: string, data: RequestType) {
    axiosInstance.patch<ResponseType>(url, data)
        .then(async (res) => {
          await this.handleRequestSuccess(res.data)
        })
        .catch(err => {
          console.log('update error', err)
          notifyErrors(err.response.data)
        })
  }

  private async handleRequestSuccess(resData: ResponseType, isDelete = false) {
    console.log('save success:', resData)
    const {t} = useI18n()
    const router = useRouter()
    let alertText
    if (isDelete) {
      alertText = t('general.alert.deleteSuccess', {
        type: t(this.itemTypeTranslate),
        item: this.itemRepr.value,
      })
    } else if (this.itemId !== null) {
      alertText = t('general.alert.updateSuccess', {
        type: t(this.itemTypeTranslate),
        item: this.itemRepr.value,
      })
    } else
      alertText = t('general.alert.saveSuccessGeneral', {
        type: t(this.itemTypeTranslate),
      })
    addBanner(alertText)
    await router.push({name: this.listViewRoute})
  }
}
