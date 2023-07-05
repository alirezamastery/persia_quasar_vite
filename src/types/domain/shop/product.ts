export interface ShopBrandForm {
  title: string
}

export interface ShopProductForm {
  brandId: number | null
  title: string
  categoryId: number | null
  description: string
  isActive: boolean
  attributeFields: Array<{
    id: number
    attribute: {
      id: number
      title: string
      description: string
    }
    value: string
  }>
  attributeValues: Array<{
    attrId: number
    attrTitle: string
    attrDescription: string
    attributeValueId: number
    value: string
  }>
}
