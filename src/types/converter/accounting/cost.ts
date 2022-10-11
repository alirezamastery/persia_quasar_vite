import {CostResponse} from 'src/types/network/response/accounting/cost'
import {CostForm} from 'src/types/domain/accounting/cost'
import {CostPayload} from 'src/types/network/payload/accounting/cost'
import {formatAsCommaSeparated, parseCommaSeparatedInt} from 'src/modules/number-tools'


export function costResponseToForm(data: CostResponse): CostForm {
  return {
    costTypeId: data.type.id,
    amount: formatAsCommaSeparated(data.amount.toString()),
    date: data.date,
    description: data.description,
  }
}

export function costFormToPayload(form: CostForm): CostPayload {
  return {
    type: form.costTypeId!,
    amount: parseCommaSeparatedInt(form.amount!),
    date: form.date,
    description: form.description,
  }
}
