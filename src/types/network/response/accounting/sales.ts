export interface ActualProductSalesResponse {
  actual_product: {
    id: number
    title: string
    price_step: number
    brand: number
  }
  sales: SalesDataResponse[]
}

export interface SalesDataResponse {
  month_start: string
  month_end: string
  count: number
}
