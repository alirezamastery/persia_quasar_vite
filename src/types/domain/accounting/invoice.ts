export interface InvoiceDetailsDomain {
  totalCount: number
  items: InvoiceDetailItemDomain[]
}

export interface InvoiceDetailItemDomain {
  rowNumber: number
  actualProductId: number
  title: string
  count: number
  price: string
}
