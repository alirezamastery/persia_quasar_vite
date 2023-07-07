export interface ShopVariantPayload{
  product: number
  selector_value: number
  price: number
  is_active: boolean
}

export interface ShopProductAddVariantPayload{
  product: number
  selector_value: number
  is_active: boolean
  price: number
  max_in_order: number
  inventory: number
}
