import {formatAsCommaSeparated} from 'src/modules/number-tools'
import {InvoiceDetailItemResponse, InvoiceDetailsResponse} from 'src/types/network/response/accounting/invoice-details'
import {InvoiceDetailItemDomain, InvoiceDetailsDomain} from 'src/types/domain/accounting/invoice'


export function invoiceDetailResponseToDomain(data: InvoiceDetailsResponse): InvoiceDetailsDomain {
  return {
    totalCount: data.total_count,
    items: data.items.map((item: InvoiceDetailItemResponse) => <InvoiceDetailItemDomain>{
      rowNumber: item.row_number,
      actualProductId: item.actual_product_id,
      title: item.title,
      count: item.count,
      price: item.price === null ? '' : formatAsCommaSeparated(item.price),
    }),
  }
}
