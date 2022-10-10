import {BrandResponse} from 'src/typings/network/response/brand'
import {BrandAddEditForm} from 'src/typings/domain/brand'
import {BrandRequestPayload} from 'src/typings/network/payload/brand'

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
