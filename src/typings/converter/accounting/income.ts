import {IncomeResponse} from 'src/typings/network/response/accounting/income'
import {IncomeForm} from 'src/typings/domain/accounting/income'
import {IncomePayload} from 'src/typings/network/payload/accounting/income'
import {formatIntNumber, numberWithCommaToInt} from 'src/modules/number-tools'


export function incomeResponseToForm(data: IncomeResponse): IncomeForm {
  return {
    amount: formatIntNumber(data.amount),
    date: data.date,
    description: data.description,
  }
}

export function incomeFormToPayload(form: IncomeForm): IncomePayload {
  return {
    amount: numberWithCommaToInt(form.amount!),
    date: form.date,
    description: form.description,
  }
}
