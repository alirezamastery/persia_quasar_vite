export interface InvoiceDetailsResponse {
  total_count: number
  items: InvoiceDetailItem[]
}

export interface InvoiceDetailItem {
  name: string
  count: number
}
