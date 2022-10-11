import {ProductCostResponse} from 'src/types/network/response/accounting/product-cost'
import {ProductCostForm} from 'src/types/domain/accounting/product-cost'
import {ProductCostRequest} from 'src/types/network/payload/accounting/product-cost'
import {formatAsCommaSeparated, parseCommaSeparatedInt} from 'src/modules/number-tools'


export function productCostResponseToForm(data: ProductCostResponse): ProductCostForm {
  return {
    amount: formatAsCommaSeparated(data.amount),
    date: data.date,
    description: data.description,
  }
}

export function productCostFormToRequest(form: ProductCostForm): ProductCostRequest {
  return {
    amount: parseCommaSeparatedInt(form.amount),
    date: form.date,
    description: form.description,
  }
}
