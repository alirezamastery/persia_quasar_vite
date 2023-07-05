import {ShopBrandForm, ShopProductForm} from 'src/types/domain/shop/product'
import {ShopBrandPayload, ShopProductPayload} from 'src/types/network/payload/shop/product'
import {ShopBrandResponse, ShopProductResponse} from 'src/types/network/response/shop/product'

export function shopBrandResponseToForm(data: ShopBrandResponse): ShopBrandForm {
  return {
    title: data.title,
  }
}

export function shopBrandFomToPayload(form: ShopBrandForm): ShopBrandPayload {
  return {
    title: form.title,
  }
}

export function shopProductResponseToForm(data: ShopProductResponse): ShopProductForm {
  return {
    brandId: data.id,
    title: data.title,
    categoryId: data.category.id,
    description: data.description,
    isActive: data.is_active,
    attributeFields: data.attribute_values,
    attributeValues: data.attribute_values.map(av => ({
      attrId: av.attribute.id,
      attrTitle: av.attribute.title,
      attrDescription: av.attribute.description,
      attributeValueId: av.id,
      value: av.value,
    })),
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
  }
}
