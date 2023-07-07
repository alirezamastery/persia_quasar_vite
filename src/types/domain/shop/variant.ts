import {ShopVariantSelectorValueResponse} from 'src/types/network/response/shop/selector'

export interface ShopVariantForm {
  productId: number
  selectorValueId: number
  price: string
  isActive: boolean
}

export interface ShopProductAddVariantForm {
  productId: number
  selectorValue: ShopVariantSelectorValueResponse
  isActive: boolean
  maxInOrder: number | null
  inventory: number | null
  price: string
}
