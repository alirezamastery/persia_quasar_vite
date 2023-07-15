export interface ShopVariantResponse {
  id: number
  product: {
    id: number
    brand: string
    title: string
    description: string
    is_active: boolean
    thumbnail: string
    slug: number
    category: number
  }
  selector_value: {
    id: number
    type: {
      id: number
      title: string
      code: 'COLOR' | 'SIZE'
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
