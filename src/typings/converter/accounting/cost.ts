import {CostResponse} from 'src/typings/network/response/accounting/cost'
import {CostForm} from 'src/typings/domain/accounting/cost'
import {CostPayload} from 'src/typings/network/payload/accounting/cost'
import {formatIntNumber, numberWithCommaToInt} from 'src/modules/number-tools'


export function costResponseToForm(data: CostResponse): CostForm {
  return {
    costTypeId: data.type.id,
    amount: formatIntNumber(data.amount.toString()),
    date: data.date,
    description: data.description,
  }
}

export function costFormToPayload(form: CostForm): CostPayload {
  return {
    type: form.costTypeId!,
    amount: numberWithCommaToInt(form.amount!),
    date: form.date,
    description: form.description,
  }
}
