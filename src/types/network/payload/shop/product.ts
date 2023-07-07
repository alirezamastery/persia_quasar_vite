export interface ShopBrandPayload {
  title: string
}

export interface ShopProductAttributeValuesPayload {
  attribute: number
  value: string
}

export interface ShopProductPayload {
  brand: number
  title: string
  category: number
  description: string
  is_active: boolean
  attribute_values: ShopProductAttributeValuesPayload[]
  new_images: Array<{ file: string, is_main: boolean }>
  main_img: number | null
}
