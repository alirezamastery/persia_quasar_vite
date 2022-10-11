import {ProductAddEditForm} from 'src/types/domain/products/product'
import {ProductRequestPayload} from 'src/types/network/payload/products/product'
import {ProductResponse} from 'src/types/network/response/products/product'


export function productFormToRequest(form: ProductAddEditForm): ProductRequestPayload {
  return {
    title: form.title,
    dkp: form.dkp,
    is_active: form.isActive,
    type: form.typeId!,
  }
}

export function productResponseToForm(data: ProductResponse): ProductAddEditForm {
  return {
    title: data.title,
    dkp: data.dkp,
    isActive: data.is_active,
    typeId: data.type.id,
  }
}
