import {CostTypeResponse} from 'src/types/network/response/accounting/cost-type'
import {CostTypeForm} from 'src/types/domain/accounting/cost-type'
import {CostTypePayload} from 'src/types/network/payload/accounting/cost-type'

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
