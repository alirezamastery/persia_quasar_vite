import {ActualProductSalesResponse, SalesDataResponse} from 'src/types/network/response/accounting/sales'
import {ActualProductSalesDomain, SalesDataDomain} from 'src/types/domain/accounting/sales'

export function actualProductSalesResponseToDomain(data: ActualProductSalesResponse): ActualProductSalesDomain {
  return {
    actualProduct: {
      id: data.actual_product.id,
      title: data.actual_product.title,
      priceStep: data.actual_product.price_step,
      brand: data.actual_product.brand,
    },
    sales: data.sales.map((item: SalesDataResponse) => <SalesDataDomain>{
      monthStart: item.month_start,
      monthEnd: item.month_end,
      count: item.count,
    }),
  }
}
