export interface ShopBrandForm {
  title: string
}

// export type ShopProductFormAttrValue = {
//   [key: number]: {
//     title: string
//     value: string
//   }
// }

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
    // attributeValueId: number
    value: string
  }>
  currentImages: ShopProductFormCurrentImage[]
  newImages: ShopProductFormNewImage[]
  mainImgId: number | null
}

export interface ShopProductFormCurrentImage {
  id: number
  url: string
  description: string
  isMain: boolean
  productId: number
}

export interface ShopProductFormNewImage {
  file: string
  key: string
  isMain: boolean
}
