import {ProductAddEditForm} from 'src/typings/domain/product'
import {ProductRequestPayload} from 'src/typings/network/payload/product'
import {ProductResponse} from 'src/typings/network/response/product'


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
