<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useAddEdit, getItemIdFromRoute} from 'src/modules/add-edit-composable'
import {isRequired} from 'src/modules/form-validation'
import {axiosInstance} from 'boot/axios'
import urls from 'src/urls'
import AddEdit from 'src/components/addEdit/AddEdit.vue'
import AutoCompleteSingle from 'components/AutoCompleteSingle.vue'
import RouteNames from 'src/router/route-names'
import {ShopProductForm} from 'src/types/domain/shop/product'
import {ShopProductResponse} from 'src/types/network/response/shop/product'
import {ShopProductPayload} from 'src/types/network/payload/shop/product'
import {ShopCategoryDetailResponse} from 'src/types/network/response/shop/category'
import {shopProductFormToPayload, shopProductResponseToForm} from 'src/types/converter/shop/product'
import ImageUploader from 'pages/shop/product/ImageUploader.vue'
import {notifyMessage} from 'src/modules/notif'


const route = useRoute()
const itemId = getItemIdFromRoute(route)
const apiRoot = urls.shopProducts
const listViewRoute = RouteNames.SHOP_PRODUCT_LIST
const itemTypeTranslate = 'shop.product'
const form = ref<ShopProductForm>({
  title: '',
  brandId: null,
  categoryId: null,
  description: '',
  isActive: true,
  attributeFields: [],
  attributeValues: [],
  newImages: [],
  currentImages: [],
  mainImgId: 0,
})
const selectedCategory = ref<ShopCategoryDetailResponse | null>(null)
const isLoadingCategory = ref(false)
const mainImgId = ref(0)
const itemRepr = computed(() => form.value.title)

watch(() => form.value.categoryId, async (newVal) => {
  // Should not change the category of an existing product:
  if (route.params.hasOwnProperty('id')) return

  isLoadingCategory.value = true
  const url = urls.shopCategoryDetailAdmin.replace('{0}', String(newVal))
  try {
    const res = await axiosInstance.get<ShopCategoryDetailResponse>(url)
    form.value.attributeValues = res.data.attributes.map(obj => {
      return {
        attrId: obj.id,
        attrTitle: obj.title,
        attrDescription: obj.description,
        value: '',
      }
    })
    selectedCategory.value = res.data
  } catch (e) {
    console.log('error in getting category details:', e)
  }
  isLoadingCategory.value = true
})
watch(() => form.value.currentImages, newVal => {
  for (const img of newVal) {
    if (img.isMain === true) {
      mainImgId.value = img.id
      break
    }
  }
})

const {
  formTitle,
  showForm,
  showDeleteDialog,
  toggleDeleteDialog,
  handleFormSubmit,
  handleDelete,
} = useAddEdit<ShopProductPayload, ShopProductResponse, ShopProductForm>(
  form,
  itemId,
  apiRoot,
  listViewRoute,
  itemTypeTranslate,
  itemRepr,
  shopProductResponseToForm,
  shopProductFormToPayload,
)

function getImageFullPath(relPath: string): string {
  return process.env.SERVER_BASE_URL + relPath
}

async function handleImageDelete(id: number) {
  try {
    const res = await axiosInstance.delete(urls.shopImages + `${id}/`)
    console.log('image deleted:', res)
    for (const [index, img] of Object.entries(form.value.currentImages)) {
      if (img.id === id) {
        form.value.currentImages.splice(parseInt(index), 1)
        break
      }
    }
  } catch (e) {
    console.log('error in deleting image:', e)
  }
}

function handleSubmit() {
  if (!route.params.hasOwnProperty('id') && form.value.newImages.length === 0) {
    notifyMessage('negative', 'حداقل یک عکس اضافه کنید')
    return
  }
  handleFormSubmit()
}
</script>

<template>
  <AddEdit
    :item-id="itemId"
    :form-title="formTitle"
    :item-repr="itemRepr"
    :show-form="showForm"
    :show-delete-dialog="showDeleteDialog"
    @form-submit="handleSubmit"
    @handle-delete-dialog="toggleDeleteDialog($event)"
    @delete="handleDelete"
  >
    <template v-slot:form-fields>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoCompleteSingle
            v-model="form.brandId"
            :label="$t('shop.brand')"
            :obj-repr="'title'"
            :query-param="'search'"
            :api="urls.shopBrands"
            :rules="[isRequired]"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.title"
            :label="$t('general.title')"
            :rules="[isRequired]"
            filled
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-checkbox
            v-model="form.isActive"
            :label="$t('shop.isActive')"
          />
        </div>
      </div>

      <div class="row">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.description"
            :label="$t('general.description')"
            filled
            type="textarea"
          />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <AutoCompleteSingle
            v-model="form.categoryId"
            :label="$t('shop.category')"
            :obj-repr="'title'"
            :query-param="'search'"
            :api="urls.shopCategories"
            :rules="[isRequired]"
            :readonly="route.params.hasOwnProperty('id')"
          />
        </div>
      </div>

      <template v-if="selectedCategory !== null || form.attributeValues.length > 0">
        <q-separator class="q-my-md" inset/>
        <div class="text-h6">{{ $t('shop.specifications') }}:</div>
        <div
          v-for="(attr, index) in form.attributeValues"
          :key="index"
          class="row q-ma-sm"
        >
          <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
            <q-input
              v-model="attr.value"
              :label="attr.attrTitle"
              filled
              :rules="[isRequired]"
            />
          </div>
        </div>

        <!-- Product Images START-->
        <q-separator class="q-my-md" inset/>
        <div class="text-h6">{{ $t('shop.images') }}:</div>

        <div
          v-for="img in form.currentImages"
          :key="img.id"
          class="row q-col-gutter-md q-pa-sm"
        >
          <div
            class="col"
          >
            <q-card
              class="no-shadow"
              :class="form.mainImgId === img.id ? 'main-img-card' : ''"
            >
              <q-card-section class="" horizontal>
                <q-img
                  :src="getImageFullPath(img.url)"
                  :ratio="1"
                  height="150px"
                  :fit="'contain'"
                  :position="'100% 50%'"
                />

                <q-card-actions>
                  <q-btn
                    :icon="form.mainImgId === img.id ? 'fa-solid fa-flag' : 'fa-regular fa-flag'"
                    :color="form.mainImgId === img.id ? 'primary' : ''"
                    flat
                    @click="form.mainImgId = img.id"
                  />
                </q-card-actions>
                <q-card-actions>
                  <q-btn
                    icon="delete"
                    flat
                    @click="handleImageDelete(img.id)"
                  />
                </q-card-actions>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!--        <q-list>-->
        <!--          <q-item v-for="img in form.currentImages" :key="img.id">-->
        <!--            <q-item-section thumbnail>-->
        <!--              <img :src="getImageFullPath(img.url)" :alt="img.description"/>-->
        <!--            </q-item-section>-->
        <!--            <q-item-section side>-->
        <!--              <q-btn-->
        <!--                icon="delete"-->
        <!--                round-->
        <!--                flat-->
        <!--                @click="handleImageDelete(img.id)"-->
        <!--              />-->
        <!--            </q-item-section>-->
        <!--            <q-item-section side>-->
        <!--              <q-btn-->
        <!--                icon="delete"-->
        <!--                round-->
        <!--                flat-->
        <!--                @click="handleImageDelete(img.id)"-->
        <!--              />-->
        <!--            </q-item-section>-->
        <!--          </q-item>-->
        <!--        </q-list>-->

        <ImageUploader
          v-model="form.newImages"
        />
        <!-- Product Images END-->

      </template>

    </template>
  </AddEdit>
</template>

<style lang="scss" scoped>
.main-img-card {
  box-shadow: 0 0 3px 1px #00acc1 !important;
}
</style>

