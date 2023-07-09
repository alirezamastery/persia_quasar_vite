export interface ShopVariantResponse {
  id: number
  product: number
  selector_value: {
    id: number
    type: {
      id: 1
      title: string
      code: string
    }
    title: string
    value: string
    extra_info: string
  }
  is_active: boolean
  price: number
  inventory: number
  max_in_order: number
}
