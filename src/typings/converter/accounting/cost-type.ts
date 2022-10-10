import {CostTypeResponse} from 'src/typings/network/response/accounting/cost-type'
import {CostTypeForm} from 'src/typings/domain/accounting/cost-type'
import {CostTypePayload} from 'src/typings/network/payload/accounting/cost-type'

export function costTypeResponseToForm(data: CostTypeResponse): CostTypeForm {
  return {
    title: data.title,
  }
}

export function costTypeFormToPayload(form: CostTypeForm): CostTypePayload {
  return {
    title: form.title,
  }
}
