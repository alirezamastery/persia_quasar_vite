export interface ShopBrandForm {
  title: string
}

export interface ShopProductForm {
  brandId: number
  title: string
  categoryId: number
  description: string
  isActive: boolean
  attributeValues: Array<{
    attrId: number
    attrTitle: string
    attrDescription: string
    attributeValueId: number
    value: string
  }>
}
