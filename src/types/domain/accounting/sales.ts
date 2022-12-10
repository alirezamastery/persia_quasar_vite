export interface ActualProductSalesDomain {
  actualProduct: {
    id: number
    title: string
    priceStep: number
    brand: number
  }
  sales: SalesDataDomain[]
}

export interface SalesDataDomain {
  monthStart: string
  monthEnd: string
  count: number
}
