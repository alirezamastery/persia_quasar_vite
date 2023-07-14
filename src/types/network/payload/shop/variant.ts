export interface ShopVariantUpdatePayload {
  is_active: boolean
  price: number
  inventory: number
  max_in_order: number
}

export interface ShopVariantCreatePayload {
  product: number
  selector_value: number
  is_active: boolean
  price: number
  max_in_order: number
  inventory: number
}
