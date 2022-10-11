import {ProductCostResponse} from 'src/typings/network/response/accounting/product-cost'
import {ProductCostForm} from 'src/typings/domain/accounting/product-cost'
import {ProductCostRequest} from 'src/typings/network/payload/accounting/product-cost'
import {formatIntNumber, numberWithCommaToInt} from 'src/modules/number-tools'


export function productCostResponseToForm(data: ProductCostResponse): ProductCostForm {
  return {
    amount: formatIntNumber(data.amount),
    date: data.date,
    description: data.description,
  }
}

export function productCostFormToRequest(form: ProductCostForm): ProductCostRequest {
  return {
    amount: numberWithCommaToInt(form.amount),
    date: form.date,
    description: form.description,
  }
}
