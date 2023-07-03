export interface ShopBrandPayload {
  title: string
}

export interface ShopProductPayload {
  brand: number
  title: string
  category: number
  description: string
  is_active: boolean
  attribute_values: Array<{
    attribute: number
    value: string
  }>
}
