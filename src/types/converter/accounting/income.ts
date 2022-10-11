import {IncomeResponse} from 'src/types/network/response/accounting/income'
import {IncomeForm} from 'src/types/domain/accounting/income'
import {IncomePayload} from 'src/types/network/payload/accounting/income'
import {formatAsCommaSeparated, parseCommaSeparatedInt} from 'src/modules/number-tools'


export function incomeResponseToForm(data: IncomeResponse): IncomeForm {
  return {
    amount: formatAsCommaSeparated(data.amount),
    date: data.date,
    description: data.description,
  }
}

export function incomeFormToPayload(form: IncomeForm): IncomePayload {
  return {
    amount: parseCommaSeparatedInt(form.amount!),
    date: form.date,
    description: form.description,
  }
}
