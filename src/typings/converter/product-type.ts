import {ProductTypeAddEditForm} from 'src/typings/domain/product-type'
import {ProductTypeRequestPayload} from 'src/typings/network/payload/product-type'
import {ProductTypeResponse} from 'src/typings/network/response/product-type'

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
