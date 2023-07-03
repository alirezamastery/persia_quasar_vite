export interface ShopVariantResponse {
  id: number
  product: number
  selector_value: {
    id: number
    type: {
      id: 1
      title: string
      code: string
    },
    value: string
    extra_info: string
  }
  price: number
  is_active: boolean
}
