import {ShopProductForm} from 'src/types/domain/shop/product'
import {ShopProductPayload} from 'src/types/network/payload/shop/product'
import {ShopProductDetailResponse} from 'src/types/network/response/shop/product'


export function shopProductResponseToForm(data: ShopProductDetailResponse): ShopProductForm {
  let mainImgId: number | null = null
  for (const img of data.images) {
    if (img.is_main) {
      mainImgId = img.id
      break
    }
  }
  console.log('main img:', mainImgId)

  return {
    brandId: data.brand.id,
    title: data.title,
    categoryId: data.category.id,
    description: data.description,
    isActive: data.is_active,
    attributeFields: data.attribute_values,
    attributeValues: data.attribute_values.map(av => ({
      attrId: av.attribute.id,
      attrTitle: av.attribute.title,
      attrDescription: av.attribute.description,
      value: av.value,
    })),
    currentImages: data.images.map(img => ({
      id: img.id,
      url: img.url,
      description: img.description,
      isMain: img.is_main,
      productId: img.product,
    })),
    newImages: [],
    mainImgId: mainImgId,
  }
}

export function shopProductFormToPayload(form: ShopProductForm): ShopProductPayload {
  return {
    brand: form.brandId!,
    title: form.title,
    category: form.categoryId!,
    description: form.description,
    is_active: form.isActive,
    attribute_values: form.attributeValues.map(attr => ({
      attribute: attr.attrId,
      value: attr.value,
    })),
    new_images: form.newImages.map(img => ({
      file: img.file,
      is_main: img.isMain,
    })),
    main_img: form.mainImgId,
  }
}
