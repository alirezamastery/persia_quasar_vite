import {BrandResponse} from 'src/types/network/response/products/brand'
import {BrandAddEditForm} from 'src/types/domain/products/brand'
import {BrandRequestPayload} from 'src/types/network/payload/products/brand'

export function brandResponseToForm(data: BrandResponse): BrandAddEditForm {
  return {
    title: data.title,
  }
}

export function brandFormToRequestPayload(form: BrandAddEditForm): BrandRequestPayload {
  return {
    title: form.title,
  }
}
