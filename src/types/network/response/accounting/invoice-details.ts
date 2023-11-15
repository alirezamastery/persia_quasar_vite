export interface InvoiceDetailsResponse {
  total_count: number
  items: InvoiceDetailItemResponse[]
}

export interface InvoiceDetailItemResponse {
  row_number: number
  actual_product_id: number
  title: string
  count: number
  price: number
}
