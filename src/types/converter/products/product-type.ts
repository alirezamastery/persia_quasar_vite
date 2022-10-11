import {ProductTypeAddEditForm} from 'src/types/domain/products/product-type'
import {ProductTypeRequestPayload} from 'src/types/network/payload/products/product-type'
import {ProductTypeResponse} from 'src/types/network/response/products/product-type'

export function productTypeFormToRequest(
    form: ProductTypeAddEditForm,
): ProductTypeRequestPayload {
  return {
    title: form.title!,
    selector_type: form.productTypeId!,
  }
}

export function productTypeResponseToForm(
    data: ProductTypeResponse,
): ProductTypeAddEditForm {
  return {
    title: data.title,
    productTypeId: data.selector_type.id,
  }
}
